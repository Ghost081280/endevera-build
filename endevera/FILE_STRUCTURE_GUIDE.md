# 📁 ENDEVERA - Complete File Structure for GitHub Upload

## 🗂️ Full Directory Structure

```
endevera/                                    ← Root project folder
│
├── .gitignore                               ← Git ignore rules
├── README.md                                ← Main documentation
├── IMAGES_UPLOAD_GUIDE.md                   ← Team photos guide
├── railway.json                             ← Railway deployment config
│
├── frontend/                                ← Frontend files (public website)
│   ├── index.html                           ← Homepage
│   ├── login.html                           ← Login/Register page
│   │
│   ├── images/                              ← Team member photos folder
│   │   ├── .gitkeep                         ← Ensures folder is tracked
│   │   ├── README.md                        ← Images folder guide
│   │   ├── scott_cunningham.jpg             ← ADD THIS (CEO photo)
│   │   ├── andrew_couch.jpg                 ← ADD THIS (CIO photo - YOU!)
│   │   ├── greg_mazza.jpg                   ← ADD THIS (CFO photo)
│   │   ├── scott_scheidt.jpg                ← ADD THIS (CTO photo)
│   │   └── steve_sebestyen.jpeg             ← ADD THIS (Advisor photo)
│   │
│   ├── portal/                              ← Member portal pages
│   │   └── dashboard.html                   ← Member dashboard
│   │
│   ├── css/                                 ← Stylesheets
│   │   └── shared-styles.css                ← Main stylesheet
│   │
│   ├── js/                                  ← JavaScript files
│   │   ├── shared-script.js                 ← Global scripts
│   │   ├── component-loader.js              ← Component injection system
│   │   │
│   │   └── components/                      ← Component-specific JS
│   │       ├── nav.js                       ← Navigation functionality
│   │       ├── back-to-top.js               ← Back to top button
│   │       └── cookie-banner.js             ← Cookie consent
│   │
│   └── components/                          ← HTML component templates
│       ├── nav.html                         ← Navigation component
│       ├── footer.html                      ← Footer component
│       ├── scroll-progress.html             ← Progress bar component
│       ├── back-to-top.html                 ← Back to top component
│       ├── cookie-banner.html               ← Cookie banner component
│       │
│       └── chatbot/                         ← Chatbot component
│           ├── chatbot.html                 ← Chatbot structure
│           ├── chatbot.css                  ← Chatbot styles
│           └── chatbot.js                   ← Chatbot functionality
│
├── backend/                                 ← Backend API (Node.js/Express)
│   ├── server.js                            ← Main server file
│   ├── package.json                         ← Node dependencies
│   ├── .env.example                         ← Environment variables template
│   │
│   ├── routes/                              ← API routes
│   │   ├── auth.js                          ← Authentication routes
│   │   ├── chat.js                          ← Claude chatbot routes
│   │   ├── investor.js                      ← Investor application routes
│   │   └── portal.js                        ← Member portal routes
│   │
│   ├── middleware/                          ← Express middleware
│   │   └── auth.js                          ← JWT authentication middleware
│   │
│   └── config/                              ← Configuration files
│       ├── database.js                      ← PostgreSQL connection
│       └── schema.sql                       ← Database schema
│
├── css/                                     ← Legacy CSS (will be moved to frontend/)
│   └── shared-styles.css                    ← Duplicate (use frontend/css version)
│
├── js/                                      ← Legacy JS (will be moved to frontend/)
│   ├── shared-script.js                     ← Duplicate (use frontend/js version)
│   ├── component-loader.js                  ← Duplicate (use frontend/js version)
│   └── components/                          ← Duplicate (use frontend/js/components/)
│       ├── nav.js
│       ├── back-to-top.js
│       └── cookie-banner.js
│
└── components/                              ← Legacy components (will be moved to frontend/)
    ├── nav.html                             ← Duplicate (use frontend/components version)
    ├── footer.html                          ← Duplicate
    ├── scroll-progress.html                 ← Duplicate
    ├── back-to-top.html                     ← Duplicate
    ├── cookie-banner.html                   ← Duplicate
    └── chatbot/                             ← Duplicate
        ├── chatbot.html
        ├── chatbot.css
        └── chatbot.js
```

## 📸 Team Photos - Exact File Paths

**YOU NEED TO ADD THESE 5 FILES:**

1. `endevera/frontend/images/scott_cunningham.jpg`
2. `endevera/frontend/images/andrew_couch.jpg`
3. `endevera/frontend/images/greg_mazza.jpg`
4. `endevera/frontend/images/scott_scheidt.jpg`
5. `endevera/frontend/images/steve_sebestyen.jpeg` ⚠️ (note: .jpeg not .jpg)

## 🚀 Quick Upload Guide

### Option 1: GitHub Web Interface

1. Create new repo on GitHub: "endevera"
2. Upload everything in this structure:
   ```
   Main branch
   ├── All files from root (endevera/)
   └── Add 5 photos to frontend/images/
   ```

### Option 2: Git Command Line

```bash
# Initialize repo
cd /path/to/endevera
git init
git add .
git commit -m "Initial commit - Endevera website"

# Add your remote
git remote add origin https://github.com/YOUR_USERNAME/endevera.git

# Push to GitHub
git branch -M main
git push -u origin main

# After initial push, add team photos
cd frontend/images/
# Copy your 5 photos here
git add *.jpg *.jpeg
git commit -m "Add team member photos"
git push
```

## ⚠️ Important Notes

### Duplicate Files (Legacy Structure)
I noticed there are duplicate files in the root-level folders:
- `css/` (root) vs `frontend/css/` ← **Use frontend/css/**
- `js/` (root) vs `frontend/js/` ← **Use frontend/js/**
- `components/` (root) vs `frontend/components/` ← **Use frontend/components/**

**Recommendation:** Delete the root-level duplicates and only use the `frontend/` versions.

### Clean Up Before Upload (Optional)

```bash
# Remove duplicate folders
rm -rf css/
rm -rf js/
rm -rf components/

# Keep only frontend versions
```

## ✅ Files That Must Be Uploaded

### Required for Website:
- ✅ All files in `frontend/`
- ✅ 5 team photos in `frontend/images/`
- ✅ All files in `backend/`
- ✅ `.gitignore`
- ✅ `README.md`
- ✅ `railway.json`

### Optional Documentation:
- ✅ `IMAGES_UPLOAD_GUIDE.md`

## 🔧 After Upload - Railway Setup

1. Connect GitHub repo to Railway
2. Railway will auto-detect Node.js project
3. Add PostgreSQL database
4. Set environment variables
5. Deploy!

See `README.md` for complete Railway deployment instructions.
