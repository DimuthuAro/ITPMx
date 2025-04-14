import { Router } from 'express';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
        const [users] = await req.db.query(
            'SELECT id, name, email, password, role FROM user WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        const user = users[0];

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
                id: user.id,
                name: user.name,
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
                id: user.id,
                name: user.name,
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
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Name, email, and password are required' 
            });
        }

        // Check if email already exists
        const [existingUsers] = await req.db.query(
            'SELECT id FROM user WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ 
                success: false,
                message: 'Email already exists' 
            });
        }

        // Hash password
        const hashedPassword = await hash(password, 12);

        // Insert new user with 'user' role by default
        const [result] = await req.db.query(
            'INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, 'user']
        );

        // Generate JWT token for automatic login
        const token = jwt.sign(
            { 
                id: result.insertId,
                name,
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
                id: result.insertId,
                name,
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
        const [users] = await req.db.query(
            'SELECT id, name, email, role FROM user WHERE id = ?',
            [decoded.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        res.json({
            success: true,
            data: users[0]
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
        const [users] = await req.db.query(
            'SELECT id, password FROM user WHERE id = ?',
            [decoded.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        const user = users[0];

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
        
        await req.db.query(
            'UPDATE user SET password = ? WHERE id = ?',
            [hashedPassword, user.id]
        );

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
        const [users] = await req.db.query(
            'SELECT id, email FROM user WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            // Don't reveal whether a user exists for security reasons
            return res.json({ 
                success: true,
                message: 'If your email is registered, you will receive a password reset link' 
            });
        }

        // Generate a reset token
        const resetToken = jwt.sign(
            { id: users[0].id },
            JWT_SECRET + users[0].password, // Add user's hashed password to make token invalid after password change
            { expiresIn: '1h' }
        );

        // Store reset token in database
        await req.db.query(
            'UPDATE user SET reset_token = ?, reset_token_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = ?',
            [resetToken, users[0].id]
        );
        
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
        const [users] = await req.db.query(
            'SELECT id, password, reset_token, reset_token_expires FROM user WHERE reset_token = ?',
            [token]
        );

        if (users.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid or expired reset token' 
            });
        }

        const user = users[0];

        // Check if token is expired
        if (new Date(user.reset_token_expires) < new Date()) {
            return res.status(400).json({ 
                success: false,
                message: 'Reset token has expired' 
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
        await req.db.query(
            'UPDATE user SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
            [hashedPassword, user.id]
        );

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