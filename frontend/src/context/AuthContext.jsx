import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { supabase } from '../config/supabase';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
        setError(null);

        // Listen for Supabase auth changes (for social login redirect)
        if (!supabase?.auth) return;

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                await handleSocialLogin(session);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSocialLogin = async (session) => {
        try {
            setLoading(true);
            const { user: sbUser } = session;

            // Extract metadata
            const firstName = sbUser.user_metadata?.full_name?.split(' ')[0] || sbUser.user_metadata?.first_name || '';
            const lastName = sbUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || sbUser.user_metadata?.last_name || '';

            const socialData = {
                email: sbUser.email,
                supabaseId: sbUser.id,
                firstName,
                lastName,
                avatarUrl: sbUser.user_metadata?.avatar_url
            };

            // Notify backend to sync/create social user
            const response = await authAPI.socialLogin(socialData);
            const { user, token, refreshToken } = response.data;

            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);

            setUser(user);
        } catch (err) {
            console.error('Social login sync failed:', err);
            setError('Failed to sync social login');
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        try {
            setError(null);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (err) {
            setError(err.message || 'Google login failed');
            return { success: false, error: err.message };
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const response = await authAPI.register(userData);
            const { user, token, refreshToken } = response.data;

            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);

            setUser(user);
            return { success: true, user };
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Registration failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const login = async (credentials) => {
        try {
            setError(null);
            const response = await authAPI.login(credentials);
            const { user, token, refreshToken } = response.data;

            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);

            setUser(user);
            return { success: true, user };
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Login failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
        await supabase.auth.signOut();
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        loading,
        error,
        register,
        login,
        loginWithGoogle,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
