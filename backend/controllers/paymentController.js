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
            return res.status(503).json({ error: 'Payment service is currently unavailable (Missing configuration)' });
        }

        const userId = req.user.id;

        // Get user's cart items
        const { data: cartItems, error: cartError } = await supabase
            .from('cart')
            .select(`
                quantity,
                products (*)
            `)
            .eq('user_id', userId);

        if (cartError || !cartItems || cartItems.length === 0) {
            return res.status(400).json({ error: 'Your cart is empty' });
        }

        if (isMock) {
            // Simulate Stripe behavior for mock mode
            const totalAmount = cartItems.reduce((sum, item) =>
                sum + (item.products.discount_price || item.products.price) * item.quantity, 0
            );

            // Mock session object for fulfillment
            const mockSession = {
                metadata: { userId },
                payment_intent: `mock_pi_${Date.now()}`,
                amount_total: totalAmount * 100,
                shipping_details: null
            };

            await fulfillOrder(mockSession);

            return res.json({
                id: `mock_session_${Date.now()}`,
                url: `${process.env.FRONTEND_URL || 'http://localhost:5177'}/payment-success?mock=true`
            });
        }

        // Prepare line items for Stripe
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

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5177'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5177'}/cart`,
            customer_email: req.user.email,
            metadata: {
                userId: userId,
            },
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error('Create checkout session error:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
};

export const handleWebhook = async (req, res) => {
    if (!stripe) {
        return res.status(503).json({ error: 'Webhook service unavailable' });
    }
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        await fulfillOrder(session);
    }

    res.json({ received: true });
};

async function fulfillOrder(session) {
    const userId = session.metadata.userId;
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
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 2. Get Cart Items to create Order Items
        const { data: cartItems, error: cartError } = await supabase
            .from('cart')
            .select(`
                quantity,
                product_id,
                products (name, price, discount_price)
            `)
            .eq('user_id', userId);

        if (cartError) throw cartError;

        // 3. Create Order Items
        const orderItems = cartItems.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            product_name: item.products.name,
            quantity: item.quantity,
            unit_price: item.products.discount_price || item.products.price,
            total_price: (item.products.discount_price || item.products.price) * item.quantity
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        // 4. Update Product Stock
        for (const item of cartItems) {
            await supabase.rpc('decrement_stock', {
                prod_id: item.product_id,
                qty: item.quantity
            });
        }

        // 5. Clear User Cart
        await supabase
            .from('cart')
            .delete()
            .eq('user_id', userId);

        console.log(`Order ${order.id} fulfilled successfully for user ${userId}`);
    } catch (error) {
        console.error('Fulfill order error:', error);
    }
}
