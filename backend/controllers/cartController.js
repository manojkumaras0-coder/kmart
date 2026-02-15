import { supabase } from '../config/database.js';

// Get user cart
export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data: cartItems, error } = await supabase
            .from('cart')
            .select(`
        id,
        product_id,
        quantity,
        product:products (
          id,
          name,
          price,
          discount_price,
          unit,
          image_url,
          stock_quantity
        )
      `)
            .eq('user_id', userId);

        if (error) {
            console.error('Get cart error:', error);
            return res.status(500).json({ error: 'Failed to fetch cart' });
        }

        res.json({ cart: cartItems });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        // Check if item already exists in cart
        const { data: existingItem, error: fetchError } = await supabase
            .from('cart')
            .select('id, quantity')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
            console.error('Fetch cart item error:', fetchError);
            return res.status(500).json({ error: 'Failed to check cart' });
        }

        if (existingItem) {
            // Update quantity
            const { data: updatedItem, error: updateError } = await supabase
                .from('cart')
                .update({ quantity: existingItem.quantity + quantity })
                .eq('id', existingItem.id)
                .select()
                .single();

            if (updateError) {
                console.error('Update cart item error:', updateError);
                return res.status(500).json({ error: 'Failed to update cart' });
            }

            return res.json({ message: 'Cart updated', item: updatedItem });
        }

        // Insert new item
        const { data: newItem, error: insertError } = await supabase
            .from('cart')
            .insert([
                {
                    user_id: userId,
                    product_id: productId,
                    quantity
                }
            ])
            .select()
            .single();

        if (insertError) {
            console.error('Insert cart item error:', insertError);
            return res.status(500).json({ error: 'Failed to add to cart' });
        }

        res.status(201).json({ message: 'Added to cart', item: newItem });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const userId = req.user.id;

        if (quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
        }

        const { data: updatedItem, error } = await supabase
            .from('cart')
            .update({ quantity })
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            console.error('Update cart error:', error);
            return res.status(404).json({ error: 'Cart item not found or failed to update' });
        }

        res.json({ message: 'Quantity updated', item: updatedItem });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const { error } = await supabase
            .from('cart')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            console.error('Remove from cart error:', error);
            return res.status(500).json({ error: 'Failed to remove item' });
        }

        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Clear cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const { error } = await supabase
            .from('cart')
            .delete()
            .eq('user_id', userId);

        if (error) {
            console.error('Clear cart error:', error);
            return res.status(500).json({ error: 'Failed to clear cart' });
        }

        res.json({ message: 'Cart cleared' });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
