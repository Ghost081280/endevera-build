/* ============================================
   CHAT ROUTES
   Claude API integration for chatbot
   ============================================ */

const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt for Endevera chatbot
const SYSTEM_PROMPT = `You are the Endevera AI Assistant, a helpful and professional chatbot for Endevera Technologies, LLC.

ABOUT ENDEVERA:
Endevera is a consulting firm that helps municipalities and companies finance, develop, and deploy transformative broadband and technology infrastructure. We operate across three core pillars:

1. ADVISE - Strategic guidance for municipalities and enterprises navigating technology infrastructure, regulatory compliance, and capital markets.

2. DEVELOP - Custom technology solutions from broadband deployment and IT infrastructure to cybersecurity and workflow automation.

3. INVEST - Capital deployment for transformative infrastructure projects with access to $1B+ in committed capital.

SERVICES:
- Technology & Infrastructure Funding (grants, private capital, federal/state resources)
- Government Procurement guidance
- IT Services (ERP integration, broadband mapping, custom software, workflow automation)
- Regulatory Compliance (K-Street and Main Street strategies)
- Policy Development
- Cybersecurity (AI-driven threat protection, IoT security, network resilience)

TEAM LEADERSHIP:
- Scott Cunningham, JD - CEO (Former Cantor Fitzgerald, UBS, Merrill Lynch)
- Andrew Couch - Chief Innovation Officer (U.S. Army Combat Veteran, 15+ years tech ventures)
- Greg Mazza - CFO (Former HSBC, MetLife, General Motors)
- Scott Scheidt, PhD - CTO (Lt. Colonel US Army Reserves, PhD Cybersecurity, 30+ years experience)
- Steve Sebestyen - Advisor (Former Amazon Web Services, Ring, Motorola Solutions)

TONE & STYLE:
- Professional but approachable
- Confident in expertise
- Direct and results-oriented
- Helpful and solution-focused
- When asked about services, provide clear, concise information
- When asked about the team, highlight their expertise and credentials
- For complex inquiries, offer to connect them with the appropriate team member
- Always end conversations with a clear call-to-action when appropriate

IMPORTANT:
- If asked about current deals or specific investment opportunities, explain that this information is only available to approved accredited investors in the member portal
- For pricing or custom solutions, recommend they contact the team directly
- You cannot access real-time data, stock prices, or current events beyond your training data
- Never make up information about team members, projects, or capabilities not listed above`;

// Rate limiting specifically for chat
const chatRateLimit = require('express-rate-limit')({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute per IP
    message: 'Too many chat messages, please slow down.'
});

// ============================================
// POST /api/chat
// Send message to Claude and get response
// ============================================
router.post('/', chatRateLimit, async (req, res) => {
    try {
        const { messages, context } = req.body;

        // Validation
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Messages array is required'
            });
        }

        // Build context-aware system prompt
        let systemPrompt = SYSTEM_PROMPT;
        
        if (context) {
            systemPrompt += `\n\nCURRENT CONTEXT:\n`;
            systemPrompt += `- User is on page: ${context.page || 'unknown'}\n`;
            systemPrompt += `- Page section: ${context.section || 'general'}\n`;
            systemPrompt += `- User authenticated: ${context.isAuthenticated ? 'Yes' : 'No'}\n`;
            
            if (context.isAuthenticated) {
                systemPrompt += `\nThe user is logged in to the member portal. You can provide more detailed information about investments and deals.`;
            }
        }

        // Call Claude API
        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            system: systemPrompt,
            messages: messages
        });

        // Extract text response
        const messageContent = response.content[0].text;

        // Return response
        res.json({
            message: messageContent,
            id: response.id,
            model: response.model
        });

    } catch (error) {
        console.error('Chat API Error:', error);

        // Handle specific API errors
        if (error.status === 429) {
            return res.status(429).json({
                error: 'Rate limit exceeded',
                message: 'Too many requests to AI service. Please try again in a moment.'
            });
        }

        if (error.status === 401) {
            return res.status(500).json({
                error: 'Configuration error',
                message: 'AI service authentication failed. Please contact support.'
            });
        }

        // Generic error response
        res.status(500).json({
            error: 'Chat service error',
            message: 'Unable to process your message. Please try again.'
        });
    }
});

// ============================================
// GET /api/chat/health
// Check if Claude API is accessible
// ============================================
router.get('/health', async (req, res) => {
    try {
        // Simple test to verify API key works
        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 10,
            messages: [{ role: 'user', content: 'hi' }]
        });

        res.json({
            status: 'healthy',
            service: 'Claude API',
            model: response.model
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            service: 'Claude API',
            error: error.message
        });
    }
});

module.exports = router;
