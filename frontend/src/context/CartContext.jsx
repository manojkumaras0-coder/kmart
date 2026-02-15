import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) return;

        setLoading(true);
        try {
            const response = await cartAPI.get();
            setCartItems(response.data.cart || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching cart:', err);
            setError('Failed to load cart');
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setCartItems([]);
        }
    }, [isAuthenticated, fetchCart]);

    const addToCart = async (productId, quantity = 1) => {
        if (!isAuthenticated) {
            window.location.href = '/login';
            return { success: false, error: 'Please login to add items to cart' };
        }

        try {
            const response = await cartAPI.add({ productId, quantity });
            await fetchCart(); // Refresh cart after adding
            return { success: true, item: response.data.item };
        } catch (err) {
            console.error('Error adding to cart:', err);
            return { success: false, error: err.response?.data?.error || 'Failed to add item' };
        }
    };

    const updateQuantity = async (cartItemId, quantity) => {
        try {
            await cartAPI.update(cartItemId, quantity);
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === cartItemId ? { ...item, quantity } : item
                )
            );
            return { success: true };
        } catch (err) {
            console.error('Error updating quantity:', err);
            return { success: false, error: 'Failed to update quantity' };
        }
    };

    const removeItem = async (cartItemId) => {
        try {
            await cartAPI.remove(cartItemId);
            setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
            return { success: true };
        } catch (err) {
            console.error('Error removing item:', err);
            return { success: false, error: 'Failed to remove item' };
        }
    };

    const clearCart = async () => {
        try {
            await cartAPI.clear();
            setCartItems([]);
            return { success: true };
        } catch (err) {
            console.error('Error clearing cart:', err);
            return { success: false, error: 'Failed to clear cart' };
        }
    };

    const cartTotal = cartItems.reduce((total, item) => {
        const price = item.product.discount_price || item.product.price;
        return total + price * item.quantity;
    }, 0);

    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    const value = {
        cartItems,
        loading,
        error,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        cartTotal,
        cartCount,
        fetchCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
