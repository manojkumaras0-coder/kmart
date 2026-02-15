import bcrypt from 'bcryptjs';
import { supabase } from '../config/database.js';
import { generateToken, generateRefreshToken } from '../middleware/auth.js';
import crypto from 'crypto';

// Register new user
export const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create user
        const { data: newUser, error } = await supabase
            .from('users')
            .insert([
                {
                    email,
                    password_hash: passwordHash,
                    first_name: firstName,
                    last_name: lastName,
                    phone,
                    verification_token: verificationToken,
                    role: 'user'
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Registration error:', error);
            return res.status(500).json({ error: 'Failed to create user' });
        }

        // Generate tokens
        const token = generateToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        // TODO: Send verification email

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                email: newUser.email,
                firstName: newUser.first_name,
                lastName: newUser.last_name,
                role: newUser.role
            },
            token,
            refreshToken
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate tokens
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                isVerified: user.is_verified
            },
            token,
            refreshToken
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get current user profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data: user, error } = await supabase
            .from('users')
            .select('id, email, first_name, last_name, phone, role, is_verified, created_at')
            .eq('id', userId)
            .single();

        if (error || !user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                phone: user.phone,
                role: user.role,
                isVerified: user.is_verified,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Request password reset
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Find user
        const { data: user } = await supabase
            .from('users')
            .select('id, email')
            .eq('email', email)
            .single();

        // Don't reveal if user exists or not
        if (!user) {
            return res.json({ message: 'If the email exists, a reset link has been sent' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

        // Update user with reset token
        await supabase
            .from('users')
            .update({
                reset_token: resetToken,
                reset_token_expires: resetTokenExpires.toISOString()
            })
            .eq('id', user.id);

        // TODO: Send password reset email

        res.json({ message: 'If the email exists, a reset link has been sent' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Reset password
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token and new password are required' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        // Find user with valid reset token
        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('reset_token', token)
            .single();

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        // Check if token is expired
        if (new Date(user.reset_token_expires) < new Date()) {
            return res.status(400).json({ error: 'Reset token has expired' });
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token
        await supabase
            .from('users')
            .update({
                password_hash: passwordHash,
                reset_token: null,
                reset_token_expires: null
            })
            .eq('id', user.id);

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Verify email
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Verification token is required' });
        }

        // Find user with verification token
        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('verification_token', token)
            .single();

        if (!user) {
            return res.status(400).json({ error: 'Invalid verification token' });
        }

        // Update user as verified
        await supabase
            .from('users')
            .update({
                is_verified: true,
                verification_token: null
            })
            .eq('id', user.id);

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
