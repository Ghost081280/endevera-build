/* ============================================
   AUTH ROUTES
   User authentication and session management
   ============================================ */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// ============================================
// POST /api/auth/register
// Register new user (after accredited investor approval)
// ============================================
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, approvalToken } = req.body;

        // Validation
        if (!email || !password || !firstName || !lastName || !approvalToken) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'Email, password, first name, last name, and approval token are required'
            });
        }

        // Validate approval token
        // TODO: Verify approval token against database
        // For now, we'll skip this check

        // Check if user already exists
        const existingUser = await db.query(
            'SELECT id FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                error: 'User already exists',
                message: 'An account with this email already exists'
            });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user
        const result = await db.query(
            `INSERT INTO users (email, password_hash, first_name, last_name, role, status, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW())
             RETURNING id, email, first_name, last_name, role, status`,
            [email.toLowerCase(), passwordHash, firstName, lastName, 'investor', 'active']
        );

        const user = result.rows[0];

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            message: 'Account created successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: 'Registration failed',
            message: 'Unable to create account. Please try again.'
        });
    }
});

// ============================================
// POST /api/auth/login
// User login
// ============================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                error: 'Missing credentials',
                message: 'Email and password are required'
            });
        }

        // Find user
        const result = await db.query(
            `SELECT id, email, password_hash, first_name, last_name, role, status
             FROM users
             WHERE email = $1`,
            [email.toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: 'Invalid credentials',
                message: 'Email or password is incorrect'
            });
        }

        const user = result.rows[0];

        // Check account status
        if (user.status !== 'active') {
            return res.status(403).json({
                error: 'Account inactive',
                message: 'Your account is not active. Please contact support.'
            });
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({
                error: 'Invalid credentials',
                message: 'Email or password is incorrect'
            });
        }

        // Update last login
        await db.query(
            'UPDATE users SET last_login = NOW() WHERE id = $1',
            [user.id]
        );

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Login failed',
            message: 'Unable to login. Please try again.'
        });
    }
});

// ============================================
// POST /api/auth/verify
// Verify JWT token and return user data
// ============================================
router.post('/verify', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                error: 'Missing token',
                message: 'Token is required'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Get user data
        const result = await db.query(
            `SELECT id, email, first_name, last_name, role, status
             FROM users
             WHERE id = $1`,
            [decoded.userId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: 'Invalid token',
                message: 'User not found'
            });
        }

        const user = result.rows[0];

        if (user.status !== 'active') {
            return res.status(403).json({
                error: 'Account inactive',
                message: 'Your account is not active'
            });
        }

        res.json({
            valid: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role
            }
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Invalid token',
                message: 'Token is invalid or expired'
            });
        }

        console.error('Token verification error:', error);
        res.status(500).json({
            error: 'Verification failed',
            message: 'Unable to verify token'
        });
    }
});

// ============================================
// POST /api/auth/logout
// Logout (client-side token deletion, optional server-side blacklist)
// ============================================
router.post('/logout', (req, res) => {
    // In a JWT system, logout is primarily client-side (delete token)
    // Optionally, you could maintain a token blacklist here
    
    res.json({
        message: 'Logout successful'
    });
});

// ============================================
// POST /api/auth/change-password
// Change user password (requires current password)
// ============================================
router.post('/change-password', async (req, res) => {
    try {
        const { token, currentPassword, newPassword } = req.body;

        // Validation
        if (!token || !currentPassword || !newPassword) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'Current password and new password are required'
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                error: 'Invalid password',
                message: 'Password must be at least 8 characters'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Get user
        const result = await db.query(
            'SELECT id, password_hash FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'User not found',
                message: 'User account not found'
            });
        }

        const user = result.rows[0];

        // Verify current password
        const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({
                error: 'Invalid password',
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const saltRounds = 10;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await db.query(
            'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
            [newPasswordHash, user.id]
        );

        res.json({
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            error: 'Password change failed',
            message: 'Unable to change password. Please try again.'
        });
    }
});

module.exports = router;
