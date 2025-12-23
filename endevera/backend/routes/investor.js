/* ============================================
   INVESTOR ROUTES
   Accredited investor application handling
   ============================================ */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

// ============================================
// POST /api/investor/apply
// Submit accredited investor application
// ============================================
router.post('/apply', async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            company,
            city,
            state,
            accreditationStatus,
            additionalInfo
        } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !phone || !city || !state || !accreditationStatus) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'Please fill in all required fields'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email',
                message: 'Please provide a valid email address'
            });
        }

        // Check if application already exists
        const existing = await db.query(
            'SELECT id FROM investor_applications WHERE email = $1',
            [email.toLowerCase()]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({
                error: 'Application exists',
                message: 'An application with this email already exists'
            });
        }

        // Insert application
        const result = await db.query(
            `INSERT INTO investor_applications (
                first_name, last_name, email, phone, company, 
                city, state, accreditation_status, additional_info, 
                status, submitted_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
            RETURNING id`,
            [
                firstName,
                lastName,
                email.toLowerCase(),
                phone,
                company || null,
                city,
                state,
                accreditationStatus,
                additionalInfo || null,
                'pending'
            ]
        );

        const applicationId = result.rows[0].id;

        // Send confirmation email to applicant
        try {
            await transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: email,
                subject: 'Accredited Investor Application Received - Endevera',
                html: `
                    <h2>Application Received</h2>
                    <p>Dear ${firstName} ${lastName},</p>
                    <p>Thank you for your interest in Endevera investment opportunities.</p>
                    <p>We have received your accredited investor application and will review it within 48 business hours.</p>
                    <p>You will receive an email notification once your application has been reviewed.</p>
                    <p><strong>Application ID:</strong> ${applicationId}</p>
                    <br>
                    <p>Best regards,<br>The Endevera Team</p>
                    <hr>
                    <p style="font-size: 12px; color: #666;">
                        Endevera Technologies, LLC<br>
                        Palm Beach, Florida<br>
                        info@endevera.com
                    </p>
                `
            });
        } catch (emailError) {
            console.error('Email send error:', emailError);
            // Continue even if email fails
        }

        // Send notification to admin
        try {
            await transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: process.env.ADMIN_EMAIL || 'info@endevera.com',
                subject: 'New Accredited Investor Application',
                html: `
                    <h2>New Investor Application</h2>
                    <p><strong>Application ID:</strong> ${applicationId}</p>
                    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Company:</strong> ${company || 'N/A'}</p>
                    <p><strong>Location:</strong> ${city}, ${state}</p>
                    <p><strong>Accreditation Status:</strong> ${accreditationStatus}</p>
                    <p><strong>Additional Info:</strong> ${additionalInfo || 'N/A'}</p>
                `
            });
        } catch (emailError) {
            console.error('Admin notification error:', emailError);
        }

        res.status(201).json({
            message: 'Application submitted successfully',
            applicationId: applicationId
        });

    } catch (error) {
        console.error('Investor application error:', error);
        res.status(500).json({
            error: 'Application failed',
            message: 'Unable to submit application. Please try again.'
        });
    }
});

// ============================================
// GET /api/investor/status/:applicationId
// Check application status
// ============================================
router.get('/status/:applicationId', async (req, res) => {
    try {
        const { applicationId } = req.params;

        const result = await db.query(
            `SELECT id, status, submitted_at, reviewed_at
             FROM investor_applications
             WHERE id = $1`,
            [applicationId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Application not found',
                message: 'No application found with this ID'
            });
        }

        const application = result.rows[0];

        res.json({
            applicationId: application.id,
            status: application.status,
            submittedAt: application.submitted_at,
            reviewedAt: application.reviewed_at
        });

    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({
            error: 'Status check failed',
            message: 'Unable to retrieve status'
        });
    }
});

module.exports = router;
