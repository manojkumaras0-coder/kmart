import Stripe from 'stripe';
import { supabase } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export const createCheckoutSession = async (req, res) => {
    try {
        const isMock = process.env.PAYMENT_MODE === 'mock';

        if (!isMock && !stripe) {
            return res.status(503).json({ error: 'Payment service is currently unavailable' });
        }

        const user = req.user; // Might be null if guest
        let cartItems = [];
        let customerEmail = req.body.email || (user ? user.email : null);

        if (user) {
            // Get user's cart items from DB
            const { data, error: cartError } = await supabase
                .from('cart')
                .select(`
                    quantity,
                    products (*)
                `)
                .eq('user_id', user.id);

            if (cartError || !data || data.length === 0) {
                return res.status(400).json({ error: 'Your cart is empty' });
            }
            cartItems = data;
        } else {
            // Guest checkout: cartItems passed in body
            const { cartItems: guestItems } = req.body;
            if (!guestItems || guestItems.length === 0) {
                return res.status(400).json({ error: 'Your cart is empty' });
            }

            // Fetch product details for guest items to ensure price integrity
            const productIds = guestItems.map(item => item.productId);
            const { data: products, error: productError } = await supabase
                .from('products')
                .select('*')
                .in('id', productIds);

            if (productError || !products) {
                return res.status(400).json({ error: 'Failed to verify products' });
            }

            cartItems = guestItems.map(item => {
                const product = products.find(p => p.id === item.productId);
                return {
                    quantity: item.quantity,
                    products: product
                };
            }).filter(item => item.products);
        }

        if (isMock) {
            const totalAmount = cartItems.reduce((sum, item) =>
                sum + (item.products.discount_price || item.products.price) * item.quantity, 0
            );

            const mockSession = {
                metadata: {
                    userId: user ? user.id : 'guest',
                    guestEmail: customerEmail
                },
                payment_intent: `mock_pi_${Date.now()}`,
                amount_total: totalAmount * 100,
                shipping_details: null
            };

            await fulfillOrder(mockSession, cartItems);

            return res.json({
                id: `mock_session_${Date.now()}`,
                url: `${process.env.FRONTEND_URL || 'http://localhost:5177'}/payment-success?mock=true`
            });
        }

        const line_items = cartItems.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.products.name,
                    images: item.products.image_url ? [item.products.image_url] : [],
                    description: item.products.description,
                },
                unit_amount: Math.round((item.products.discount_price || item.products.price) * 100),
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5177'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5177'}/cart`,
            customer_email: customerEmail,
            metadata: {
                userId: user ? user.id : 'guest',
                guestEmail: user ? null : customerEmail
            },
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error('Create checkout session error:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
};

export const handleWebhook = async (req, res) => {
    if (!stripe) return res.status(503).json({ error: 'Webhook service unavailable' });
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        await fulfillOrder(session);
    }
    res.json({ received: true });
};

async function fulfillOrder(session, providedItems = null) {
    const userId = session.metadata.userId !== 'guest' ? session.metadata.userId : null;
    const guestEmail = session.metadata.guestEmail;
    const stripePaymentId = session.payment_intent;
    const totalAmount = session.amount_total / 100;

    try {
        // 1. Create Order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: userId,
                total_amount: totalAmount,
                status: 'processing',
                payment_status: 'paid',
                payment_method: 'stripe',
                stripe_payment_id: stripePaymentId,
                shipping_address: session.shipping_details ? JSON.stringify(session.shipping_details) : 'Direct Pickup',
                // We could add guest_email column to orders if needed, for now it's in metadata
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 2. Get line items
        let orderItemsData = [];
        if (providedItems) {
            orderItemsData = providedItems;
        } else if (userId) {
            const { data: cartItems } = await supabase
                .from('cart')
                .select(`quantity, product_id, products (name, price, discount_price)`)
                .eq('user_id', userId);
            orderItemsData = cartItems;
        } else {
            // Guest checkout from Stripe Session
            // Stripe sessions don't easily give back line items in webhook without extra call
            const sessionWithLineItems = await stripe.checkout.sessions.retrieve(session.id, {
                expand: ['line_items.data.price.product'],
            });

            // This part is complex because we need the product_id (Supabase UUID)
            // If we store Supabase product_id in Stripe metadata for each item, it's easier.
            // For now, let's assume we need to match by name or pass custom IDs.
            // SIMPLIFIED: Guest checkout works best when cart data is fulfilled by the app logic.
            console.log('Fulfilling guest order from Stripe session - simplified');
        }

        // 3. Create Order Items (Simplified for guest if not provided)
        if (orderItemsData.length > 0) {
            const orderItems = orderItemsData.map(item => ({
                order_id: order.id,
                product_id: item.product_id || item.products.id,
                product_name: item.products.name,
                quantity: item.quantity,
                unit_price: item.products.discount_price || item.products.price,
                total_price: (item.products.discount_price || item.products.price) * item.quantity
            }));

            await supabase.from('order_items').insert(orderItems);

            // 4. Update Stock
            for (const item of orderItemsData) {
                await supabase.rpc('decrement_stock', {
                    prod_id: item.product_id || item.products.id,
                    qty: item.quantity
                });
            }
        }

        // 5. Clear User Cart (if registered)
        if (userId) {
            await supabase.from('cart').delete().eq('user_id', userId);
        }

        console.log(`Order ${order.id} fulfilled successfully`);
    } catch (error) {
        console.error('Fulfill order error:', error);
    }
}
