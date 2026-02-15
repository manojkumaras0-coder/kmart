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
    const { isAuthenticated, user } = useAuth();

    // Helper to get local cart
    const getLocalCart = () => {
        const savedCart = localStorage.getItem('kmart_guest_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    };

    // Helper to save local cart
    const saveLocalCart = (items) => {
        localStorage.setItem('kmart_guest_cart', JSON.stringify(items));
        setCartItems(items);
    };

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) {
            setCartItems(getLocalCart());
            return;
        }

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

    // Sync guest cart to user account on login
    useEffect(() => {
        const syncCart = async () => {
            const localItems = getLocalCart();
            if (isAuthenticated && localItems.length > 0) {
                setLoading(true);
                try {
                    // Push all local items to the server
                    for (const item of localItems) {
                        await cartAPI.add({ productId: item.product_id, quantity: item.quantity });
                    }
                    // Clear local cart after successful sync
                    localStorage.removeItem('kmart_guest_cart');
                    await fetchCart();
                } catch (err) {
                    console.error('Error syncing cart:', err);
                } finally {
                    setLoading(false);
                }
            } else {
                fetchCart();
            }
        };

        syncCart();
    }, [isAuthenticated, fetchCart]);

    const addToCart = async (productId, quantity = 1, productData = null) => {
        if (!isAuthenticated) {
            const currentItems = getLocalCart();
            const existingItemIndex = currentItems.findIndex(item => item.product_id === productId);

            let newItems;
            if (existingItemIndex > -1) {
                newItems = [...currentItems];
                newItems[existingItemIndex].quantity += quantity;
            } else {
                // If we have product data (passed from ProductDetail), use it
                // Otherwise this logic might need a way to fetch product info if not provided
                newItems = [...currentItems, {
                    product_id: productId,
                    quantity,
                    product: productData
                }];
            }
            saveLocalCart(newItems);
            return { success: true };
        }

        try {
            const response = await cartAPI.add({ productId, quantity });
            await fetchCart();
            return { success: true, item: response.data.item };
        } catch (err) {
            console.error('Error adding to cart:', err);
            return { success: false, error: err.response?.data?.error || 'Failed to add item' };
        }
    };

    const updateQuantity = async (cartItemId, quantity) => {
        if (!isAuthenticated) {
            const currentItems = getLocalCart();
            // Note: For guest cart, cartItemId is actually the product_id if not using UUIDs
            // To keep it consistent, let's assume Cart UI passes product_id for guests
            const newItems = currentItems.map(item =>
                (item.id === cartItemId || item.product_id === cartItemId) ? { ...item, quantity } : item
            );
            saveLocalCart(newItems);
            return { success: true };
        }

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
        if (!isAuthenticated) {
            const currentItems = getLocalCart();
            const newItems = currentItems.filter(item => item.id !== cartItemId && item.product_id !== cartItemId);
            saveLocalCart(newItems);
            return { success: true };
        }

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
        if (!isAuthenticated) {
            saveLocalCart([]);
            return { success: true };
        }

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
        if (!item.product) return total;
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
