/* ============================================
   AUTHENTICATION MIDDLEWARE
   JWT token verification for protected routes
   ============================================ */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// ============================================
// Verify JWT token
// ============================================
function authenticateToken(req, res, next) {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Access token is required'
        });
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    error: 'Token expired',
                    message: 'Your session has expired. Please login again.'
                });
            }
            
            return res.status(403).json({
                error: 'Invalid token',
                message: 'Token is invalid or malformed'
            });
        }

        // Attach user data to request
        req.user = user;
        next();
    });
}

// ============================================
// Verify user role
// ============================================
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Authentication required'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Insufficient permissions'
            });
        }

        next();
    };
}

// ============================================
// Optional authentication (doesn't fail if no token)
// ============================================
function optionalAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        req.user = null;
        return next();
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            req.user = null;
        } else {
            req.user = user;
        }
        next();
    });
}

module.exports = {
    authenticateToken,
    requireRole,
    optionalAuth
};
