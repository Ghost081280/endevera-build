/* ============================================
   ENDEVERA BACKEND SERVER
   Express API for Railway deployment
   ============================================ */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

// Security headers
app.use(helmet({
    contentSecurityPolicy: false, // Allow inline scripts for development
}));

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// ============================================
// ROUTES
// ============================================

// Import route modules
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const investorRoutes = require('./routes/investor');
const portalRoutes = require('./routes/portal');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/investor', investorRoutes);
app.use('/api/portal', portalRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// ============================================
// FRONTEND ROUTES (SPA)
// ============================================

// Serve index.html for all non-API routes
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../frontend/index.html'));
    } else {
        res.status(404).json({ error: 'API endpoint not found' });
    }
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log(`
    ============================================
    🚀 Endevera Server Running
    ============================================
    Environment: ${process.env.NODE_ENV || 'development'}
    Port: ${PORT}
    Time: ${new Date().toISOString()}
    ============================================
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    process.exit(0);
});

module.exports = app;
