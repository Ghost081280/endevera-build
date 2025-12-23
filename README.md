# Endevera Technologies Website

Professional consulting firm website with Claude AI-powered chatbot, member portal, and accredited investor management.

## 🏗️ Project Structure

```
endevera/
├── frontend/                    # Static frontend files
│   ├── index.html
│   ├── login.html
│   ├── css/
│   │   ├── shared-styles.css
│   │   └── portal-styles.css
│   ├── js/
│   │   ├── shared-script.js
│   │   ├── component-loader.js
│   │   └── components/
│   │       ├── nav.js
│   │       ├── back-to-top.js
│   │       └── cookie-banner.js
│   ├── components/
│   │   ├── nav.html
│   │   ├── footer.html
│   │   ├── scroll-progress.html
│   │   ├── back-to-top.html
│   │   ├── cookie-banner.html
│   │   └── chatbot/
│   │       ├── chatbot.html
│   │       ├── chatbot.css
│   │       └── chatbot.js
│   └── portal/                 # Member dashboard pages
│       └── dashboard.html
├── backend/                    # Node.js/Express API
│   ├── server.js
│   ├── package.json
│   ├── routes/
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── investor.js
│   │   └── portal.js
│   ├── middleware/
│   │   └── auth.js
│   └── config/
│       ├── database.js
│       └── schema.sql
├── .env.example
├── .gitignore
└── railway.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Claude API key from Anthropic
- SMTP credentials (for emails)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd endevera
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Setup database**
   ```bash
   # Create PostgreSQL database
   createdb endevera
   
   # Run schema
   psql endevera < config/schema.sql
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   ```
   http://localhost:3000
   ```

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Required
NODE_ENV=development
PORT=3000
ANTHROPIC_API_KEY=your_claude_api_key
DATABASE_URL=postgresql://user:password@localhost:5432/endevera
JWT_SECRET=your_secret_key_here

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=Endevera <noreply@endevera.com>
ADMIN_EMAIL=admin@endevera.com

# Optional
FRONTEND_URL=http://localhost:3000
BASE_URL=http://localhost:3000
```

## 📦 Railway Deployment

### Step 1: Prepare Your Repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo>
git push -u origin main
```

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Select your repository

### Step 3: Add PostgreSQL Database

1. Click "+ New" in your Railway project
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create `DATABASE_URL`

### Step 4: Configure Environment Variables

In Railway dashboard, add these variables:

```
ANTHROPIC_API_KEY=your_claude_api_key
JWT_SECRET=your_generated_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_password
SMTP_FROM=Endevera <noreply@endevera.com>
ADMIN_EMAIL=admin@endevera.com
NODE_ENV=production
```

### Step 5: Initialize Database

1. Open Railway PostgreSQL service
2. Click "Connect" → "psql"
3. Copy and paste contents of `backend/config/schema.sql`
4. Execute to create tables

### Step 6: Deploy

Railway will automatically deploy on git push:

```bash
git add .
git commit -m "Deploy to Railway"
git push origin main
```

Your app will be live at: `https://your-app.railway.app`

## 🧪 API Endpoints

### Public Endpoints

- `GET /api/health` - Health check
- `POST /api/chat` - Send message to Claude chatbot
- `POST /api/investor/apply` - Submit accredited investor application
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (requires approval token)

### Protected Endpoints (Require JWT)

- `GET /api/portal/dashboard` - Get dashboard data
- `GET /api/portal/deals` - Get investment opportunities
- `GET /api/portal/deals/:id` - Get specific deal
- `GET /api/portal/reports` - Get reports and updates
- `GET /api/portal/profile` - Get user profile
- `PUT /api/portal/profile` - Update user profile

## 🎨 Component System

The site uses a dynamic component loader system. To use components in a page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
    <link rel="stylesheet" href="/css/shared-styles.css">
</head>
<body data-page-type="public">
    
    <!-- Your page content here -->
    
    <script src="/js/shared-script.js"></script>
    <script src="/js/component-loader.js"></script>
</body>
</html>
```

**Page Types:**
- `public` - Loads all public components (nav, footer, chatbot, etc.)
- `portal` - Loads member portal components
- `login` - Minimal components for login page

## 🤖 Chatbot Configuration

The Claude-powered chatbot includes:

- Context-aware responses based on current page
- Conversation history (localStorage)
- Authentication detection
- Mobile-optimized full-screen mode
- Desktop positioned to not overlap navigation

**Customize chatbot behavior:**
Edit `backend/routes/chat.js` to modify the system prompt.

## 🔒 Authentication Flow

1. User applies as accredited investor
2. Admin reviews application
3. Admin approves → sends approval email
4. User creates account (password setup)
5. User logs in → receives JWT token
6. Token stored in localStorage
7. Token sent in Authorization header for protected routes

## 📧 Email Configuration

For Gmail SMTP (recommended):

1. Enable 2-factor authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use App Password in `SMTP_PASSWORD`

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL

# Check if tables exist
\dt
```

### Claude API Issues

```bash
# Test API key
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-sonnet-4-20250514","max_tokens":10,"messages":[{"role":"user","content":"hi"}]}'
```

### Build Failures on Railway

- Check logs in Railway dashboard
- Verify all environment variables are set
- Ensure Node.js version matches `engines` in package.json

## 📝 Creating New Pages

1. Create HTML file in `frontend/`
2. Add `data-page-type` attribute to `<body>`
3. Include shared CSS and component loader:

```html
<link rel="stylesheet" href="/css/shared-styles.css">
<script src="/js/shared-script.js"></script>
<script src="/js/component-loader.js"></script>
```

## 🔐 Security Best Practices

- ✅ All passwords hashed with bcrypt
- ✅ JWT tokens for authentication
- ✅ Rate limiting on API endpoints
- ✅ Helmet.js for security headers
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configured
- ✅ Environment variables for secrets

## 📊 Database Maintenance

```bash
# Backup database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql

# View active connections
psql $DATABASE_URL -c "SELECT * FROM pg_stat_activity;"
```

## 🤝 Support

For technical support:
- Email: info@endevera.com
- Documentation: This README

## 📄 License

Copyright 2025 Endevera Technologies, LLC. All rights reserved.
