import { Router } from 'express';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

// JWT secret key - In production, store this in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Email and password are required' 
            });
        }

        // Find user in database
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Verify password
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role || 'user' // Default to 'user' if role is not set
            },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        // Return user info and token
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role || 'user',
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred during login',
            error: error.message
        });
    }
});

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Username, email, and password are required' 
            });
        }

        // Check if email already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(409).json({ 
                success: false,
                message: 'Email already exists' 
            });
        }

        // Check if username already exists
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(409).json({ 
                success: false,
                message: 'Username already exists' 
            });
        }

        // Hash password
        const hashedPassword = await hash(password, 12);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'user'
        });
        
        const savedUser = await newUser.save();

        // Generate JWT token for automatic login
        const token = jwt.sign(
            { 
                _id: savedUser._id,
                username,
                email,
                role: 'user'
            },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                id: savedUser._id,
                username,
                email,
                role: 'user',
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'An error occurred during registration',
            error: error.message
        });
    }
});

// Get current user profile
router.get('/profile', async (req, res) => {
    try {
        // Get token from authorization header
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Authentication token is required' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Get fresh user data from database
        const user = await User.findById(decoded._id).select('-password');

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        // Handle expired or invalid token
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid or expired token' 
            });
        }

        console.error('Profile error:', error);
        res.status(500).json({ 
            success: false,
            message: 'An error occurred while fetching profile',
            error: error.message
        });
    }
});

// Update password
router.post('/change-password', async (req, res) => {
    try {
        // Get token from authorization header
        const token = req.headers.authorization?.split(' ')[1];
        const { currentPassword, newPassword } = req.body;
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Authentication token is required' 
            });
        }

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false,
                message: 'Current password and new password are required' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Get user from database
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Verify current password
        const isPasswordValid = await compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: 'Current password is incorrect' 
            });
        }

        // Hash and update new password
        const hashedPassword = await hash(newPassword, 12);
        
        user.password = hashedPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        // Handle expired or invalid token
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid or expired token' 
            });
        }

        console.error('Change password error:', error);
        res.status(500).json({ 
            success: false,
            message: 'An error occurred while changing password',
            error: error.message
        });
    }
});

// Forgot password - Request reset
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ 
                success: false,
                message: 'Email is required' 
            });
        }

        // Find user in database
        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal whether a user exists for security reasons
            return res.json({ 
                success: true,
                message: 'If your email is registered, you will receive a password reset link' 
            });
        }

        // Generate a reset token
        const resetToken = jwt.sign(
            { id: user._id },
            JWT_SECRET + user.password, // Add user's hashed password to make token invalid after password change
            { expiresIn: '1h' }
        );

        // Store reset token in user document
        user.resetToken = resetToken;
        user.resetTokenExpires = Date.now() + 3600000; // 1 hour from now
        await user.save();
        
        // In a real application, send an email with the reset link
        // For development purposes, we'll just return the token
        res.json({
            success: true,
            message: 'Password reset instructions sent to your email',
            // Only include this in development
            data: {
                resetToken
            }
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ 
            success: false,
            message: 'An error occurred while processing your request',
            error: error.message
        });
    }
});

// Reset password
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Token and new password are required' 
            });
        }

        // Find user with the reset token
        const user = await User.findOne({ 
            resetToken: token,
            resetTokenExpires: { $gt: Date.now() } // Check if token hasn't expired
        });

        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid or expired reset token' 
            });
        }

        // Verify the token
        try {
            jwt.verify(token, JWT_SECRET + user.password);
        } catch (error) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid reset token' 
            });
        }

        // Hash new password
        const hashedPassword = await hash(password, 12);

        // Update user's password and clear reset token
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Password has been reset successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ 
            success: false,
            message: 'An error occurred while resetting your password',
            error: error.message
        });
    }
});

export default router;