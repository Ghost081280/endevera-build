/* ============================================
   PORTAL ROUTES
   Protected routes for member dashboard
   ============================================ */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// All portal routes require authentication
router.use(authenticateToken);

// ============================================
// GET /api/portal/deals
// Get current investment opportunities
// ============================================
router.get('/deals', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT 
                id, title, description, category, location, 
                target_amount, raised_amount, minimum_investment,
                status, launch_date, close_date, 
                images, documents, created_at
             FROM deals
             WHERE status = 'active'
             ORDER BY launch_date DESC`
        );

        res.json({
            deals: result.rows
        });

    } catch (error) {
        console.error('Deals fetch error:', error);
        res.status(500).json({
            error: 'Failed to fetch deals',
            message: 'Unable to retrieve investment opportunities'
        });
    }
});

// ============================================
// GET /api/portal/deals/:id
// Get specific deal details
// ============================================
router.get('/deals/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `SELECT 
                id, title, description, category, location, 
                target_amount, raised_amount, minimum_investment,
                expected_return, investment_timeline, risk_level,
                status, launch_date, close_date, 
                images, documents, details, created_at
             FROM deals
             WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Deal not found',
                message: 'Investment opportunity not found'
            });
        }

        res.json({
            deal: result.rows[0]
        });

    } catch (error) {
        console.error('Deal fetch error:', error);
        res.status(500).json({
            error: 'Failed to fetch deal',
            message: 'Unable to retrieve deal details'
        });
    }
});

// ============================================
// GET /api/portal/reports
// Get user reports and updates
// ============================================
router.get('/reports', async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await db.query(
            `SELECT 
                id, title, type, content, file_url, 
                published_at, created_at
             FROM reports
             WHERE status = 'published'
             ORDER BY published_at DESC
             LIMIT 50`
        );

        res.json({
            reports: result.rows
        });

    } catch (error) {
        console.error('Reports fetch error:', error);
        res.status(500).json({
            error: 'Failed to fetch reports',
            message: 'Unable to retrieve reports'
        });
    }
});

// ============================================
// GET /api/portal/profile
// Get user profile
// ============================================
router.get('/profile', async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await db.query(
            `SELECT 
                id, email, first_name, last_name, role, 
                phone, company, city, state,
                created_at, last_login
             FROM users
             WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'User not found',
                message: 'User profile not found'
            });
        }

        const user = result.rows[0];

        res.json({
            profile: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                phone: user.phone,
                company: user.company,
                city: user.city,
                state: user.state,
                memberSince: user.created_at,
                lastLogin: user.last_login
            }
        });

    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            error: 'Failed to fetch profile',
            message: 'Unable to retrieve profile'
        });
    }
});

// ============================================
// PUT /api/portal/profile
// Update user profile
// ============================================
router.put('/profile', async (req, res) => {
    try {
        const userId = req.user.userId;
        const { firstName, lastName, phone, company, city, state } = req.body;

        const result = await db.query(
            `UPDATE users
             SET first_name = COALESCE($1, first_name),
                 last_name = COALESCE($2, last_name),
                 phone = COALESCE($3, phone),
                 company = COALESCE($4, company),
                 city = COALESCE($5, city),
                 state = COALESCE($6, state),
                 updated_at = NOW()
             WHERE id = $7
             RETURNING id, email, first_name, last_name, phone, company, city, state`,
            [firstName, lastName, phone, company, city, state, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'User not found',
                message: 'Unable to update profile'
            });
        }

        const user = result.rows[0];

        res.json({
            message: 'Profile updated successfully',
            profile: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                phone: user.phone,
                company: user.company,
                city: user.city,
                state: user.state
            }
        });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            error: 'Failed to update profile',
            message: 'Unable to update profile'
        });
    }
});

// ============================================
// GET /api/portal/dashboard
// Get dashboard overview data
// ============================================
router.get('/dashboard', async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get active deals count
        const dealsResult = await db.query(
            'SELECT COUNT(*) as count FROM deals WHERE status = $1',
            ['active']
        );

        // Get recent reports count
        const reportsResult = await db.query(
            `SELECT COUNT(*) as count FROM reports 
             WHERE status = $1 AND published_at > NOW() - INTERVAL '30 days'`,
            ['published']
        );

        // Get user info
        const userResult = await db.query(
            `SELECT first_name, last_name, created_at, last_login
             FROM users WHERE id = $1`,
            [userId]
        );

        const user = userResult.rows[0];

        res.json({
            dashboard: {
                activeDeals: parseInt(dealsResult.rows[0].count),
                recentReports: parseInt(reportsResult.rows[0].count),
                memberSince: user.created_at,
                lastLogin: user.last_login,
                userName: `${user.first_name} ${user.last_name}`
            }
        });

    } catch (error) {
        console.error('Dashboard fetch error:', error);
        res.status(500).json({
            error: 'Failed to fetch dashboard',
            message: 'Unable to retrieve dashboard data'
        });
    }
});

module.exports = router;
