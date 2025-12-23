# Endevera Team Photos - Upload Guide

## ✅ Folder Structure
```
frontend/
├── images/
│   ├── README.md (this file)
│   ├── .gitkeep (ensures folder is tracked in git)
│   ├── scott_cunningham.jpg  ← UPLOAD THIS
│   ├── andrew_couch.jpg       ← UPLOAD THIS
│   ├── greg_mazza.jpg         ← UPLOAD THIS
│   ├── scott_scheidt.jpg      ← UPLOAD THIS
│   └── steve_sebestyen.jpeg   ← UPLOAD THIS
└── index.html (references these images)
```

## 📸 Team Member Photo Assignments

### Row 1 (Top Three Members)

**1. scott_cunningham.jpg**
- **Name:** Scott Cunningham, JD
- **Title:** Chief Executive Officer
- **Bio:** Former Cantor Fitzgerald, UBS, Merrill Lynch. Loyola University Chicago School of Law. University of Alabama.
- **Referenced in:** index.html line 1138

**2. andrew_couch.jpg**
- **Name:** Andrew Couch
- **Title:** Chief Innovation Officer
- **Bio:** U.S. Army Combat Veteran. Startup exit. 5x accelerator alumni. 15+ years in technology ventures. Purdue University Global.
- **Referenced in:** index.html line 1148

**3. greg_mazza.jpg**
- **Name:** Greg Mazza
- **Title:** Chief Financial Officer
- **Bio:** Former HSBC, MetLife, General Motors. University of Michigan Ross School of Business MBA.
- **Referenced in:** index.html line 1158

### Row 2 (Bottom Two Members)

**4. scott_scheidt.jpg**
- **Name:** Scott Scheidt, PhD
- **Title:** Chief Technology Officer
- **Bio:** Lt. Colonel US Army Reserves. Top Secret Clearance. PhD Cybersecurity. 30+ years experience.
- **Referenced in:** index.html line 1170

**5. steve_sebestyen.jpeg** ⚠️ Note: .jpeg extension (not .jpg)
- **Name:** Steve Sebestyen
- **Title:** Advisor
- **Bio:** Former Amazon Web Services, Ring. 27+ years in public safety technology. Motorola Solutions.
- **Referenced in:** index.html line 1180

## 📋 Photo Specifications

### Technical Requirements:
- **Aspect Ratio:** 3:4 (portrait orientation)
- **Recommended Size:** 800x1067px minimum (higher resolution is better)
- **Format:** JPG or JPEG
- **File Size:** Under 2MB each for optimal web performance
- **Color:** Full color (the site will apply a subtle grayscale filter on hover)

### Style Guidelines:
- Professional headshots or team photos
- Clean, simple backgrounds (preferably dark or neutral)
- Good lighting on face
- Business or business casual attire
- Facing camera directly

## 🚀 Upload Instructions

### Option 1: Via GitHub Web Interface
1. Navigate to your GitHub repo
2. Go to `frontend/images/` folder
3. Click "Add file" → "Upload files"
4. Drag and drop all 5 images
5. Commit with message: "Add team member photos"

### Option 2: Via Git Command Line
```bash
# From your local repo root
cd frontend/images/

# Copy your photos to this folder
# Then commit
git add .
git commit -m "Add team member photos"
git push origin main
```

### Option 3: Railway Deployment
If deploying directly to Railway, upload the photos to the same `frontend/images/` directory in your Railway project files.

## 🔍 Testing After Upload

After uploading, verify the images appear correctly:

1. **Homepage Team Section:** Scroll to the "Leadership" section
2. **Check Image Display:** All 5 photos should be visible
3. **Hover Effect:** Images should slightly zoom and lose grayscale filter on hover
4. **Mobile View:** Test on mobile to ensure images scale properly

## ⚠️ Important Notes

- **Steve's photo uses .jpeg extension** (not .jpg) - make sure the file extension matches exactly
- All other photos use .jpg extension
- File names are case-sensitive on Linux servers
- If images don't appear, check browser console for 404 errors
- Images will show as broken until you upload the actual files

## 🎨 Optional: Placeholder Images

If you need placeholder images while gathering real photos, you can use:
- https://ui-avatars.com/api/?name=Scott+Cunningham&size=800
- https://ui-avatars.com/api/?name=Andrew+Couch&size=800
- https://ui-avatars.com/api/?name=Greg+Mazza&size=800
- https://ui-avatars.com/api/?name=Scott+Scheidt&size=800
- https://ui-avatars.com/api/?name=Steve+Sebestyen&size=800

## ✅ Verification Checklist

- [ ] All 5 image files uploaded to `frontend/images/`
- [ ] File names match exactly (case-sensitive)
- [ ] Steve's file uses .jpeg extension
- [ ] Images display correctly on homepage
- [ ] Images are professional quality
- [ ] File sizes are optimized (under 2MB each)
- [ ] Images look good on mobile devices
