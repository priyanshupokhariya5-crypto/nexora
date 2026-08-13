const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { TEMPLATES_DATA } = require('../data/templatesList');
const Website = require('../models/Website');
const User = require('../models/User');
const Theme = require('../models/Theme');
const TemplateModel = require('../models/TemplateModel');
const Subscriber = require('../models/SubscriberModel');
const { sendWelcomeEmail } = require('../services/emailService');

// In-memory fallback stores when MongoDB is not connected
const memoryWebsitesStore = new Map();
const memoryUsersStore = new Map();
const memoryThemesStore = new Map();
const memorySubscribersStore = new Map();
const newsletterRateLimit = new Map();

// Helper to check if Mongoose is connected
const isMongoConnected = () => {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// Helper to normalize template & theme objects across MongoDB & static presets
const normalizeTemplate = (tpl) => {
  if (!tpl) return null;
  const raw = typeof tpl.toObject === 'function' ? tpl.toObject() : tpl;
  const titleStr = raw.title || raw.name || 'Untitled Theme';
  const rawId = raw.id || raw.themeId || (raw._id ? raw._id.toString() : `thm_${Date.now()}`);
  const slugStr = raw.slug || raw.id || titleStr.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  return {
    id: rawId,
    _id: raw._id ? raw._id.toString() : undefined,
    title: titleStr,
    name: titleStr,
    slug: slugStr,
    category: raw.category || 'Local & Retail',
    badge: raw.badge || (raw.featured ? 'Featured' : 'Popular'),
    tagline: raw.tagline || raw.description || 'Professional customizable business website theme.',
    description: raw.description || raw.tagline || 'Professional customizable business website theme.',
    author: raw.author || 'Nexora Studio',
    tags: Array.isArray(raw.tags) ? raw.tags : (typeof raw.tags === 'string' ? raw.tags.split(',').map(s => s.trim()).filter(Boolean) : []),
    accentColor: raw.accentColor || '#2551e8',
    bgTheme: raw.bgTheme || 'light',
    fontFamily: raw.fontFamily || 'sans',
    image: raw.image || raw.thumbnail || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    thumbnail: raw.thumbnail || raw.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    heroImage: raw.heroImage || '',
    logo: raw.logo || '',
    previewUrl: raw.previewUrl || '',
    demoUrl: raw.demoUrl || '',
    liveUrl: raw.liveUrl || '',
    documentationUrl: raw.documentationUrl || '',
    themeType: raw.themeType || raw.heroStyle || 'split-arched',
    heroStyle: raw.heroStyle || raw.themeType || 'split-arched',
    status: raw.status || 'Published',
    featured: Boolean(raw.featured),
    price: raw.price || 'Free',
    sortOrder: typeof raw.sortOrder === 'number' ? raw.sortOrder : 0,
    isAdminCreated: Boolean(raw.isAdminCreated),
    defaultData: raw.defaultData || {
      heroTitle: titleStr,
      heroSubtitle: raw.tagline || raw.description || 'Welcome to our official business platform.',
      ctaText: 'Get Started',
      ctaLink: '/contact',
      logoText: titleStr,
      navLinks: [
        { label: 'Home', href: '/' },
        { label: 'About Us', href: '/about' },
        { label: 'Services', href: '/services' },
        { label: 'Contact', href: '/contact' }
      ]
    },
    createdAt: raw.createdAt || new Date(),
    updatedAt: raw.updatedAt || new Date()
  };
};

// Seed / Sync MongoDB with the 30 redesigned templates automatically
const seedTemplatesIfEmpty = async () => {
  try {
    if (isMongoConnected()) {
      for (const tpl of TEMPLATES_DATA) {
        await TemplateModel.findOneAndUpdate(
          { id: tpl.id },
          { $set: { ...tpl, isAdminCreated: false } },
          { upsert: true, new: true }
        );
      }
      // ONLY delete legacy templates that are NOT created by admin
      const currentIds = TEMPLATES_DATA.map(t => t.id);
      await TemplateModel.deleteMany({ id: { $nin: currentIds }, isAdminCreated: { $ne: true } });
    }
  } catch (err) {
    console.error('Template sync error:', err.message);
  }
};

const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const uniqueName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;
    cb(null, uniqueName);
  }
});

const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }
});

// ==========================================
// 1. CLOUDINARY & IMAGE UPLOAD ENDPOINT (FormData Multer Upload)
// ==========================================

router.post('/upload', (req, res, next) => {
  uploadMiddleware.single('image')(req, res, (err) => {
    if (err) {
      console.warn('Multer upload notice:', err.message);
    }
    next();
  });
}, async (req, res) => {
  console.log('UPLOAD ROUTE HIT');
  console.log('REQ.FILE:', req.file);

  try {
    const uploadedFile = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);

    if (uploadedFile) {
      const localUrl = `/uploads/${uploadedFile.filename}`;

      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        try {
          const cloudinary = require('cloudinary').v2;
          cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
          });

          const uploadResponse = await cloudinary.uploader.upload(uploadedFile.path, {
            folder: 'nexora_uploads'
          });

          return res.json({
            success: true,
            provider: 'cloudinary',
            url: uploadResponse.secure_url,
            imageUrl: uploadResponse.secure_url,
            message: 'Image uploaded successfully to Cloudinary!'
          });
        } catch (cErr) {
          console.warn('Cloudinary upload notice, using local file URL:', cErr.message);
        }
      }

      return res.json({
        success: true,
        provider: 'local',
        url: localUrl,
        imageUrl: localUrl,
        message: 'Image uploaded successfully!'
      });
    }

    return res.status(400).json({ success: false, message: 'No image file uploaded.' });
  } catch (error) {
    console.error('Upload route error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 2. ADMIN THEMES ENDPOINTS (GET / POST / DELETE)
// ==========================================

router.get('/admin/themes', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const themes = await TemplateModel.find({ isAdminCreated: true }).sort({ createdAt: -1 });
      const normalized = themes.map(normalizeTemplate);
      return res.json({ success: true, count: normalized.length, themes: normalized });
    } else {
      const themes = Array.from(memoryThemesStore.values()).map(normalizeTemplate);
      return res.json({ success: true, count: themes.length, themes });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'nexora_jwt_secret_key_2026_prod';

// Database-backed Admin Authorization Middleware
const requireAdmin = async (req, res, next) => {
  try {
    // 1. Extract Bearer token from Authorization header or fallback fields
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : req.headers['x-access-token'] || req.body?.token || req.query?.token;

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: Authentication token required.' 
      });
    }

    // 2. Verify JWT token signature
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: Invalid or expired authentication token.' 
      });
    }

    const userId = decoded.id || decoded.userId;
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: Invalid token payload.' 
      });
    }

    // 3. Fetch user directly from MongoDB database (or fallback memory store)
    let dbUser = null;
    if (isMongoConnected()) {
      try {
        dbUser = await User.findById(userId);
        if (!dbUser) {
          dbUser = await User.findOne({ _id: userId });
        }
      } catch (e) {
        dbUser = await User.findOne({ email: decoded.email });
      }
    } else {
      dbUser = Array.from(memoryUsersStore.values()).find(u => u.id === userId);
    }

    if (!dbUser) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: User account not found.' 
      });
    }

    // 4. Verify role STRICTLY FROM THE DATABASE USER MODEL (never client headers/payload)
    const dbRole = dbUser.role || (dbUser.email === 'admin@nexora.com' ? 'admin' : 'user');

    if (dbRole !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: Admin access required.' 
      });
    }

    req.user = dbUser;
    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error during authorization verification.' 
    });
  }
};

router.post('/admin/themes', requireAdmin, async (req, res) => {
  try {
    const { name, accentColor, bgTheme, fontFamily, category, badge } = req.body;

    if (!name || !accentColor) {
      return res.status(400).json({ success: false, message: 'Please provide theme name and accent color.' });
    }

    const themeId = 'thm_' + Math.random().toString(36).substr(2, 9);
    const themePayload = {
      themeId,
      name,
      accentColor: accentColor || '#2551e8',
      bgTheme: bgTheme || 'light',
      fontFamily: fontFamily || 'sans',
      category: category || 'E-Commerce',
      badge: badge || 'Admin Preset',
      createdAt: new Date()
    };

    if (isMongoConnected()) {
      const newTheme = new Theme(themePayload);
      await newTheme.save();
      return res.json({ success: true, theme: newTheme, message: 'Admin theme added successfully to MongoDB!' });
    } else {
      memoryThemesStore.set(themeId, themePayload);
      return res.json({ success: true, theme: themePayload, message: 'Admin theme added successfully!' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/admin/themes/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      await Theme.findOneAndDelete({ $or: [{ _id: id }, { themeId: id }] });
      return res.json({ success: true, message: 'Theme deleted successfully from MongoDB' });
    } else {
      memoryThemesStore.delete(id);
      return res.json({ success: true, message: 'Theme deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 3. AUTHENTICATION ENDPOINTS (LOGIN / REGISTER)
// ==========================================

router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const isAdminEmail = cleanEmail === 'priyanshupokhariya5@gmail.com' || cleanEmail === 'admin@nexora.com';
    const assignedRole = isAdminEmail ? 'admin' : 'user';

    if (isMongoConnected()) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists in MongoDB.' });
      }

      const newUser = new User({
        name,
        email: cleanEmail,
        password,
        role: assignedRole
      });
      await newUser.save();

      const userIdStr = newUser._id.toString();
      const token = jwt.sign({ id: userIdStr, email: cleanEmail, role: assignedRole }, JWT_SECRET, { expiresIn: '7d' });

      const userPayload = {
        id: userIdStr,
        name: newUser.name,
        email: newUser.email,
        role: assignedRole,
        token,
        createdAt: newUser.createdAt
      };

      return res.json({ success: true, user: userPayload, token, message: 'Registration successful!' });
    } else {
      if (memoryUsersStore.has(cleanEmail)) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const userId = 'usr_' + Math.random().toString(36).substr(2, 9);
      const token = jwt.sign({ id: userId, email: cleanEmail, role: assignedRole }, JWT_SECRET, { expiresIn: '7d' });

      const userPayload = {
        id: userId,
        name,
        email: cleanEmail,
        password,
        role: assignedRole,
        token,
        createdAt: new Date()
      };

      memoryUsersStore.set(cleanEmail, userPayload);
      return res.json({ success: true, user: userPayload, token, message: 'Registration successful!' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter your email and password.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const isAdminEmail = cleanEmail === 'priyanshupokhariya5@gmail.com' || cleanEmail === 'admin@nexora.com';

    if (isMongoConnected()) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user || user.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const userRole = isAdminEmail ? 'admin' : (user.role || 'user');
      const userIdStr = user._id.toString();
      const token = jwt.sign({ id: userIdStr, email: cleanEmail, role: userRole }, JWT_SECRET, { expiresIn: '7d' });

      const userPayload = {
        id: userIdStr,
        name: user.name,
        email: user.email,
        role: userRole,
        token,
        createdAt: user.createdAt
      };

      return res.json({ success: true, user: userPayload, token, message: 'Login successful!' });
    } else {
      const user = memoryUsersStore.get(cleanEmail);
      if (!user || user.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const userRole = isAdminEmail ? 'admin' : (user.role || 'user');
      const token = jwt.sign({ id: user.id, email: cleanEmail, role: userRole }, JWT_SECRET, { expiresIn: '7d' });

      const userPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: userRole,
        token,
        createdAt: user.createdAt
      };

      return res.json({ success: true, user: userPayload, token, message: 'Login successful!' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Middleware: Require Authenticated User (JWT Verification)
const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : req.headers['x-access-token'] || req.body?.token || req.query?.token;

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: Authentication token required.' 
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: Invalid or expired authentication token.' 
      });
    }

    const userId = decoded.id || decoded.userId;
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: Invalid token payload.' 
      });
    }

    req.authUserId = userId;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Authorization error.' });
  }
};

// ==========================================
// 4. TEMPLATES & THEMES CATALOG CRUD ENDPOINTS
// ==========================================

// Public & User GET Templates List
router.get('/templates', async (req, res) => {
  try {
    await seedTemplatesIfEmpty();
    const { category, search, status, featured } = req.query;

    if (isMongoConnected()) {
      let query = {};
      
      // Status filtering: Public view shows Published templates or default templates
      if (status && status !== 'all') {
        query.status = status;
      } else if (!status) {
        query.$or = [{ status: 'Published' }, { status: { $exists: false } }, { status: null }];
      }

      if (category && category !== 'All') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }

      if (featured === 'true') {
        query.featured = true;
      }

      if (search) {
        const searchRegex = new RegExp(search, 'i');
        query.$and = [
          ...(query.$and || []),
          {
            $or: [
              { title: searchRegex },
              { name: searchRegex },
              { tagline: searchRegex },
              { description: searchRegex },
              { category: searchRegex },
              { author: searchRegex },
              { tags: searchRegex }
            ]
          }
        ];
      }

      const dbTemplates = await TemplateModel.find(query).sort({ sortOrder: 1, createdAt: -1 });
      const normalized = dbTemplates.map(normalizeTemplate);

      return res.json({
        success: true,
        source: 'mongodb',
        count: normalized.length,
        templates: normalized
      });
    } else {
      let list = Array.from(memoryThemesStore.values()).map(normalizeTemplate);
      const staticList = TEMPLATES_DATA.map(normalizeTemplate);
      let combined = [...list, ...staticList];

      if (status && status !== 'all') {
        combined = combined.filter(t => t.status === status);
      } else if (!status) {
        combined = combined.filter(t => t.status === 'Published' || !t.status);
      }

      if (category && category !== 'All') {
        combined = combined.filter(t => t.category.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        combined = combined.filter(t => 
          t.title.toLowerCase().includes(q) || 
          t.tagline.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
        );
      }
      return res.json({
        success: true,
        source: 'in-memory',
        count: combined.length,
        templates: combined
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Public GET Single Template
router.get('/templates/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (isMongoConnected()) {
      const isObjId = mongoose.Types.ObjectId.isValid(id);
      const template = await TemplateModel.findOne({
        $or: [
          { id: id },
          { slug: id },
          ...(isObjId ? [{ _id: id }] : [])
        ]
      });
      if (template) {
        return res.json({ success: true, source: 'mongodb', template: normalizeTemplate(template) });
      }
    }
    const staticTpl = TEMPLATES_DATA.find(t => t.id === id || t.slug === id);
    if (staticTpl) {
      return res.json({ success: true, source: 'fallback', template: normalizeTemplate(staticTpl) });
    }
    return res.status(404).json({ success: false, message: 'Template not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin CREATE Theme / Template (POST /api/templates)
router.post('/templates', requireAdmin, async (req, res) => {
  try {
    const {
      title, name, slug, category, badge, tagline, description, author, tags,
      accentColor, bgTheme, fontFamily, image, thumbnail, heroImage, logo,
      previewUrl, demoUrl, liveUrl, documentationUrl, themeType, status,
      featured, price, sortOrder, defaultData
    } = req.body;

    const finalTitle = title || name;
    if (!finalTitle || !category) {
      return res.status(400).json({ success: false, message: 'Please provide theme title/name and category.' });
    }

    // URL Validations if provided
    const urlFields = { previewUrl, demoUrl, liveUrl, documentationUrl };
    for (const [key, val] of Object.entries(urlFields)) {
      if (val && typeof val === 'string' && val.trim() !== '') {
        const cleanVal = val.trim();
        if (!cleanVal.startsWith('http://') && !cleanVal.startsWith('https://')) {
          return res.status(400).json({ success: false, message: `${key} must start with http:// or https://` });
        }
      }
    }

    const generateSlug = slug && slug.trim()
      ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : finalTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
    const tplId = `thm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const tagArray = Array.isArray(tags)
      ? tags
      : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []);

    const imgUrl = thumbnail || image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';

    const tplPayload = {
      id: tplId,
      title: finalTitle,
      name: finalTitle,
      slug: generateSlug,
      category,
      badge: badge || (featured ? 'Featured Theme' : 'Admin Preset'),
      tagline: tagline || description || 'Professional customizable business website theme.',
      description: description || tagline || 'Professional customizable business website theme.',
      author: author || 'Nexora Studio',
      tags: tagArray,
      accentColor: accentColor || '#2551e8',
      bgTheme: bgTheme || 'light',
      fontFamily: fontFamily || 'sans',
      image: imgUrl,
      thumbnail: imgUrl,
      heroImage: heroImage || '',
      logo: logo || '',
      previewUrl: previewUrl ? previewUrl.trim() : '',
      demoUrl: demoUrl ? demoUrl.trim() : '',
      liveUrl: liveUrl ? liveUrl.trim() : '',
      documentationUrl: documentationUrl ? documentationUrl.trim() : '',
      themeType: themeType || 'split-arched',
      heroStyle: themeType || 'split-arched',
      status: status || 'Published',
      featured: Boolean(featured),
      price: price || 'Free',
      sortOrder: typeof sortOrder === 'number' ? sortOrder : parseInt(sortOrder, 10) || 0,
      isAdminCreated: true,
      defaultData: defaultData || {
        heroStyle: themeType || 'split-arched',
        featuresStyle: 'grid-cards',
        aboutStyle: 'split-image-left',
        servicesStyle: 'grid-cards',
        sectionsOrder: ['hero', 'features', 'about', 'services', 'testimonials', 'contact'],
        heroTitle: `${finalTitle} - High Impact Platform`,
        heroSubtitle: tagline || description || 'Empowering your brand with modern design, speed, and elevated user experience.',
        ctaText: 'Get Started Today',
        ctaLink: '/contact',
        heroImageUrl: heroImage || imgUrl,
        aboutImageUrl: imgUrl,
        logoText: finalTitle,
        navLinks: [
          { label: 'Home', href: '/' },
          { label: 'About Us', href: '/about' },
          { label: 'Services', href: '/services' },
          { label: 'Contact', href: '/contact' }
        ]
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (isMongoConnected()) {
      const newTpl = new TemplateModel(tplPayload);
      await newTpl.save();
      return res.json({
        success: true,
        template: normalizeTemplate(newTpl),
        message: `Theme "${finalTitle}" created & saved to MongoDB!`
      });
    } else {
      memoryThemesStore.set(tplId, tplPayload);
      return res.json({
        success: true,
        template: normalizeTemplate(tplPayload),
        message: `Theme "${finalTitle}" created successfully!`
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin UPDATE Theme / Template (PUT /api/templates/:id)
router.put('/templates/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, name, slug, category, badge, tagline, description, author, tags,
      accentColor, bgTheme, fontFamily, image, thumbnail, heroImage, logo,
      previewUrl, demoUrl, liveUrl, documentationUrl, themeType, status,
      featured, price, sortOrder, defaultData
    } = req.body;

    // URL Validations if provided
    const urlFields = { previewUrl, demoUrl, liveUrl, documentationUrl };
    for (const [key, val] of Object.entries(urlFields)) {
      if (val && typeof val === 'string' && val.trim() !== '') {
        const cleanVal = val.trim();
        if (!cleanVal.startsWith('http://') && !cleanVal.startsWith('https://')) {
          return res.status(400).json({ success: false, message: `${key} must start with http:// or https://` });
        }
      }
    }

    const tagArray = Array.isArray(tags)
      ? tags
      : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined);

    const updateData = {};
    if (title !== undefined || name !== undefined) {
      updateData.title = title || name;
      updateData.name = title || name;
    }
    if (slug !== undefined) updateData.slug = slug;
    if (category !== undefined) updateData.category = category;
    if (badge !== undefined) updateData.badge = badge;
    if (tagline !== undefined) updateData.tagline = tagline;
    if (description !== undefined) updateData.description = description;
    if (author !== undefined) updateData.author = author;
    if (tagArray !== undefined) updateData.tags = tagArray;
    if (accentColor !== undefined) updateData.accentColor = accentColor;
    if (bgTheme !== undefined) updateData.bgTheme = bgTheme;
    if (fontFamily !== undefined) updateData.fontFamily = fontFamily;
    if (thumbnail !== undefined || image !== undefined) {
      const img = thumbnail || image;
      updateData.image = img;
      updateData.thumbnail = img;
    }
    if (heroImage !== undefined) updateData.heroImage = heroImage;
    if (logo !== undefined) updateData.logo = logo;
    if (previewUrl !== undefined) updateData.previewUrl = previewUrl.trim();
    if (demoUrl !== undefined) updateData.demoUrl = demoUrl.trim();
    if (liveUrl !== undefined) updateData.liveUrl = liveUrl.trim();
    if (documentationUrl !== undefined) updateData.documentationUrl = documentationUrl.trim();
    if (themeType !== undefined) {
      updateData.themeType = themeType;
      updateData.heroStyle = themeType;
    }
    if (status !== undefined) updateData.status = status;
    if (featured !== undefined) updateData.featured = Boolean(featured);
    if (price !== undefined) updateData.price = price;
    if (sortOrder !== undefined) updateData.sortOrder = parseInt(sortOrder, 10) || 0;
    if (defaultData !== undefined) updateData.defaultData = defaultData;
    updateData.updatedAt = new Date();

    if (isMongoConnected()) {
      const isObjId = mongoose.Types.ObjectId.isValid(id);
      const updated = await TemplateModel.findOneAndUpdate(
        { $or: [{ id: id }, { slug: id }, ...(isObjId ? [{ _id: id }] : [])] },
        { $set: updateData },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Theme not found.' });
      }
      return res.json({
        success: true,
        template: normalizeTemplate(updated),
        message: 'Theme updated successfully in MongoDB!'
      });
    } else {
      let item = memoryThemesStore.get(id);
      if (item) {
        Object.assign(item, updateData);
        return res.json({ success: true, template: normalizeTemplate(item), message: 'Theme updated successfully!' });
      }
      return res.status(404).json({ success: false, message: 'Theme not found.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin DELETE Theme / Template (DELETE /api/templates/:id)
router.delete('/templates/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      const isObjId = mongoose.Types.ObjectId.isValid(id);
      await TemplateModel.findOneAndDelete({
        $or: [{ id: id }, { slug: id }, ...(isObjId ? [{ _id: id }] : [])]
      });
      await Theme.findOneAndDelete({ $or: [{ themeId: id }, ...(isObjId ? [{ _id: id }] : [])] });
      return res.json({ success: true, message: 'Theme deleted successfully from MongoDB' });
    } else {
      memoryThemesStore.delete(id);
      return res.json({ success: true, message: 'Theme deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 5. WEBSITES CRUD ENDPOINTS (AUTO-SAVE & MONGODB SYNC)
// ==========================================

// Helper to generate unique slug from Brand Name
const generateUniqueSlug = async (brandName, currentSiteId = null, existingSlug = null, isAlreadyPublished = false) => {
  // Preserve existing slug ONLY if website is ALREADY PUBLISHED!
  if (isAlreadyPublished && existingSlug && existingSlug.trim()) {
    return existingSlug.trim().toLowerCase();
  }

  let baseSlug = (brandName || 'my-website')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  if (!baseSlug) baseSlug = 'my-website';

  let candidateSlug = baseSlug;
  let counter = 1;

  if (isMongoConnected()) {
    while (true) {
      const existing = await Website.findOne({ 
        slug: candidateSlug, 
        siteId: { $ne: currentSiteId } 
      });
      if (!existing) break;
      counter += 1;
      candidateSlug = `${baseSlug}-${counter}`;
    }
  } else {
    while (true) {
      const existing = Array.from(memoryWebsitesStore.values()).find(
        s => s.slug === candidateSlug && s.siteId !== currentSiteId
      );
      if (!existing) break;
      counter += 1;
      candidateSlug = `${baseSlug}-${counter}`;
    }
  }

  return candidateSlug;
};

router.post('/websites', requireAuth, async (req, res) => {
  try {
    const { siteId, templateId, brandName, title, accentColor, fontFamily, bgTheme, customData, isPublished } = req.body;

    const effectiveBrandName = 
      brandName || 
      customData?.brandName || 
      customData?.logoText || 
      title || 
      customData?.websiteName || 
      'My Website';

    if (!templateId || !customData) {
      return res.status(400).json({ success: false, message: 'Missing required website configuration parameters.' });
    }

    const authenticatedUserId = req.authUserId;
    const generateId = siteId || 'site_' + Math.random().toString(36).substr(2, 9);

    let existingSite = null;
    if (isMongoConnected()) {
      existingSite = await Website.findOne({ siteId: generateId });
    } else {
      existingSite = memoryWebsitesStore.get(generateId);
    }

    if (existingSite && existingSite.userId && existingSite.userId.toString() !== authenticatedUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only publish or modify websites belonging to your account.'
      });
    }

    // Preserve slug ONLY if website is already published!
    const isAlreadyPublished = Boolean(existingSite?.isPublished);
    const targetSlug = await generateUniqueSlug(
      effectiveBrandName, 
      generateId, 
      existingSite?.slug, 
      isAlreadyPublished
    );

    const updatedCustomData = {
      ...customData,
      brandName: effectiveBrandName,
      logoText: effectiveBrandName,
      websiteName: effectiveBrandName,
      title: effectiveBrandName
    };

    const sitePayload = {
      userId: authenticatedUserId,
      siteId: generateId,
      templateId,
      brandName: effectiveBrandName,
      title: effectiveBrandName,
      slug: targetSlug,
      accentColor: accentColor || '#2551e8',
      fontFamily: fontFamily || 'sans',
      bgTheme: bgTheme || 'light',
      customData: updatedCustomData,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : false,
      publishedAt: isPublished ? (existingSite?.publishedAt || new Date()) : existingSite?.publishedAt,
      updatedAt: new Date()
    };

    if (isMongoConnected()) {
      let savedSite;
      if (existingSite) {
        savedSite = await Website.findOneAndUpdate({ siteId: generateId }, sitePayload, { new: true });
      } else {
        savedSite = new Website(sitePayload);
        await savedSite.save();
      }
      return res.json({ success: true, website: savedSite, mode: 'mongodb' });
    } else {
      if (!sitePayload.createdAt) sitePayload.createdAt = new Date();
      if (!sitePayload.views) sitePayload.views = Math.floor(Math.random() * 50) + 12;
      memoryWebsitesStore.set(generateId, sitePayload);
      return res.json({ success: true, website: sitePayload, mode: 'in-memory' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/websites', async (req, res) => {
  try {
    const { userId } = req.query;

    if (isMongoConnected()) {
      const query = userId ? { userId } : {};
      const websites = await Website.find(query).sort({ updatedAt: -1 });
      return res.json({ success: true, count: websites.length, websites });
    } else {
      let websites = Array.from(memoryWebsitesStore.values());
      if (userId) {
        websites = websites.filter(s => s.userId === userId || s.userId === 'guest');
      }
      return res.json({ success: true, count: websites.length, websites });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/websites/:identifier', async (req, res) => {
  try {
    const id = req.params.identifier;
    if (isMongoConnected()) {
      const isObjId = mongoose.Types.ObjectId.isValid(id);
      const site = await Website.findOne({
        $or: [
          { siteId: id },
          { slug: id },
          ...(isObjId ? [{ _id: id }] : [])
        ]
      });
      if (!site) return res.status(404).json({ success: false, message: 'Website not found' });
      site.views += 1;
      await site.save();
      return res.json({ success: true, website: site });
    } else {
      let site = memoryWebsitesStore.get(id);
      if (!site) {
        site = Array.from(memoryWebsitesStore.values()).find(s => s.slug === id || s.siteId === id);
      }
      if (!site) return res.status(404).json({ success: false, message: 'Website not found' });
      site.views = (site.views || 0) + 1;
      return res.json({ success: true, website: site });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/websites/:siteId', async (req, res) => {
  try {
    const { siteId } = req.params;
    if (isMongoConnected()) {
      await Website.findOneAndDelete({ siteId });
      return res.json({ success: true, message: 'Website deleted successfully from MongoDB' });
    } else {
      memoryWebsitesStore.delete(siteId);
      return res.json({ success: true, message: 'Website deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper to normalize and validate slug
const normalizeSlugStr = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/(^-|-$)+/g, '');
};

// Helper to normalize custom domain hostname
const normalizeDomainStr = (str) => {
  if (!str) return '';
  let clean = str.toLowerCase().trim();
  clean = clean.replace(/^https?:\/\//i, '');
  clean = clean.replace(/\/.*$/, '');
  clean = clean.replace(/:\d+$/, '');
  return clean;
};

// 1. UPDATE NEXORA SLUG OR CONNECT CUSTOM DOMAIN
router.put('/websites/:siteId/domain', async (req, res) => {
  try {
    const { siteId } = req.params;
    const { slug, customDomain } = req.body;

    let targetSlug = slug ? normalizeSlugStr(slug) : null;
    let targetDomain = customDomain ? normalizeDomainStr(customDomain) : null;

    if (!targetSlug && !targetDomain) {
      return res.status(400).json({ success: false, message: 'Please provide a valid slug or custom domain.' });
    }

    if (isMongoConnected()) {
      const site = await Website.findOne({ siteId });
      if (!site) return res.status(404).json({ success: false, message: 'Website not found.' });

      // If updating Nexora slug
      if (targetSlug && targetSlug !== site.slug) {
        if (!/^[a-z0-9-]+$/.test(targetSlug)) {
          return res.status(400).json({ success: false, message: 'Nexora URL slug can only contain lowercase letters, numbers, and hyphens.' });
        }
        const existingSlug = await Website.findOne({ slug: targetSlug, siteId: { $ne: siteId } });
        if (existingSlug) {
          return res.status(400).json({ success: false, message: 'That Nexora URL slug is already in use.' });
        }
        site.slug = targetSlug;
      }

      // If connecting a custom domain
      if (targetDomain) {
        const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
        if (!domainRegex.test(targetDomain)) {
          return res.status(400).json({ success: false, message: 'Please enter a valid custom domain (e.g. www.mybusiness.com or mybusiness.com).' });
        }
        const existingDomain = await Website.findOne({ customDomain: targetDomain, siteId: { $ne: siteId } });
        if (existingDomain) {
          return res.status(400).json({ success: false, message: 'This domain is already connected to another Nexora website.' });
        }

        const verificationToken = `nexora-verify-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        site.customDomain = targetDomain;
        site.domainStatus = 'pending';
        site.domainVerified = false;
        site.domainVerificationToken = verificationToken;
      }

      site.updatedAt = new Date();
      await site.save();

      return res.json({
        success: true,
        message: 'Domain configuration updated successfully.',
        website: site,
        dnsTarget: process.env.NEXORA_CNAME_TARGET || 'cname.vercel-dns.com',
        verificationToken: site.domainVerificationToken
      });
    } else {
      // Memory Store Fallback
      let site = memoryWebsitesStore.get(siteId);
      if (!site) return res.status(404).json({ success: false, message: 'Website not found.' });

      if (targetSlug && targetSlug !== site.slug) {
        site.slug = targetSlug;
      }
      if (targetDomain) {
        site.customDomain = targetDomain;
        site.domainStatus = 'pending';
        site.domainVerified = false;
        site.domainVerificationToken = `nexora-verify-${Date.now()}`;
      }
      site.updatedAt = new Date();
      return res.json({
        success: true,
        message: 'Domain configuration updated successfully.',
        website: site,
        dnsTarget: 'cname.vercel-dns.com',
        verificationToken: site.domainVerificationToken
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 2. VERIFY CUSTOM DOMAIN DNS RECORDS ENDPOINT
router.post('/websites/:siteId/domain/verify', async (req, res) => {
  try {
    const dns = require('dns').promises;
    const { siteId } = req.params;
    if (isMongoConnected()) {
      const site = await Website.findOne({ siteId });
      if (!site) return res.status(404).json({ success: false, message: 'Website not found.' });
      if (!site.customDomain) {
        return res.status(400).json({ success: false, message: 'No custom domain is connected to this website.' });
      }

      const domain = site.customDomain;
      const token = site.domainVerificationToken;
      let verified = false;
      let details = '';

      // Perform Real DNS Lookup using Node.js dns module
      try {
        const cnames = await dns.resolveCname(domain).catch(() => []);
        const txts = await dns.resolveTxt(`_nexora.${domain}`).catch(() => []);
        const flatTxt = txts.flat().join(' ');
        const aRecords = await dns.resolveA(domain).catch(() => []);

        const isCnameMatched = cnames.some(c => 
          c.toLowerCase().includes('vercel') || 
          c.toLowerCase().includes('render') || 
          c.toLowerCase().includes('nexora')
        );
        const isTxtMatched = token && flatTxt.includes(token);
        const isAMatched = aRecords && aRecords.length > 0;

        if (isCnameMatched || isTxtMatched || isAMatched) {
          verified = true;
          details = 'DNS records verified successfully.';
        } else {
          details = `Could not verify CNAME or TXT record for ${domain}. Expected CNAME target: cname.vercel-dns.com or TXT record _nexora.${domain}=${token}.`;
        }
      } catch (err) {
        details = `DNS lookup failed for ${domain}: ${err.message}`;
      }

      // Allow bypass in dev mode or explicitly requested fallback
      if (!verified && (process.env.NODE_ENV === 'development' || req.body?.forceDevVerify)) {
        verified = true;
        details = 'Domain verified (Development override enabled).';
      }

      if (verified) {
        site.domainVerified = true;
        site.domainStatus = 'verified';
        await site.save();
        return res.json({
          success: true,
          verified: true,
          message: 'Domain verified and active! Your custom domain is now live.',
          website: site
        });
      } else {
        site.domainVerified = false;
        site.domainStatus = 'failed';
        await site.save();
        return res.status(400).json({
          success: false,
          verified: false,
          message: details,
          website: site
        });
      }
    } else {
      let site = memoryWebsitesStore.get(siteId);
      if (!site) return res.status(404).json({ success: false, message: 'Website not found.' });

      site.domainVerified = true;
      site.domainStatus = 'verified';
      return res.json({
        success: true,
        verified: true,
        message: 'Domain verified successfully.',
        website: site
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 3. DISCONNECT CUSTOM DOMAIN ENDPOINT
router.post('/websites/:siteId/domain/disconnect', async (req, res) => {
  try {
    const { siteId } = req.params;
    if (isMongoConnected()) {
      const site = await Website.findOne({ siteId });
      if (!site) return res.status(404).json({ success: false, message: 'Website not found.' });

      site.customDomain = null;
      site.domainStatus = 'none';
      site.domainVerified = false;
      site.domainVerificationToken = null;
      site.updatedAt = new Date();
      await site.save();

      return res.json({
        success: true,
        message: 'Custom domain disconnected. Nexora URL slug remains active.',
        website: site
      });
    } else {
      let site = memoryWebsitesStore.get(siteId);
      if (site) {
        site.customDomain = null;
        site.domainStatus = 'none';
        site.domainVerified = false;
        site.domainVerificationToken = null;
      }
      return res.json({
        success: true,
        message: 'Custom domain disconnected.',
        website: site
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 4. RESOLVE PUBLIC WEBSITE BY CUSTOM HOSTNAME OR SLUG
router.get('/public/domain/resolve', async (req, res) => {
  try {
    const rawHost = req.query.hostname || req.hostname || '';
    const cleanHost = rawHost.toLowerCase().replace(/:\d+$/, '').trim();

    if (!cleanHost || cleanHost === 'localhost' || cleanHost === '127.0.0.1') {
      return res.status(400).json({ success: false, message: 'No valid custom hostname provided.' });
    }

    if (isMongoConnected()) {
      const site = await Website.findOne({
        customDomain: cleanHost,
        isPublished: true,
        domainVerified: true
      });
      if (!site) {
        return res.status(404).json({ success: false, message: `No published website found for custom domain ${cleanHost}` });
      }
      site.views = (site.views || 0) + 1;
      await site.save();
      return res.json({ success: true, website: site });
    } else {
      const site = Array.from(memoryWebsitesStore.values()).find(
        s => s.customDomain === cleanHost && s.isPublished === true && s.domainVerified === true
      );
      if (!site) {
        return res.status(404).json({ success: false, message: `No published website found for custom domain ${cleanHost}` });
      }
      site.views = (site.views || 0) + 1;
      return res.json({ success: true, website: site });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Public Published Website Fetch Endpoint (Matches slug, customDomain, or siteId)
router.get('/public/:identifier', async (req, res) => {
  try {
    const identifier = req.params.identifier.toLowerCase().trim();
    if (isMongoConnected()) {
      const site = await Website.findOne({
        $or: [
          { slug: identifier },
          { customDomain: identifier },
          { siteId: identifier }
        ]
      });
      if (!site || site.isPublished === false) {
        return res.status(404).json({ success: false, message: 'Website not found or not published' });
      }
      site.views = (site.views || 0) + 1;
      await site.save();
      return res.json({ success: true, website: site });
    } else {
      let site = Array.from(memoryWebsitesStore.values()).find(
        s => s.slug === identifier || s.customDomain === identifier || s.siteId === identifier
      );
      if (!site || site.isPublished === false) {
        return res.status(404).json({ success: false, message: 'Website not found or not published' });
      }
      site.views = (site.views || 0) + 1;
      return res.json({ success: true, website: site });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper to validate email format
const isValidEmailFormat = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// 1. PUBLIC NEWSLETTER SUBSCRIBE ENDPOINT
router.post('/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !isValidEmailFormat(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Lightweight rate-limiting (max 5 requests per 10 minutes per IP/email)
    const clientKey = `${req.ip}_${cleanEmail}`;
    const now = Date.now();
    const rateData = newsletterRateLimit.get(clientKey) || { count: 0, resetTime: now + 10 * 60 * 1000 };
    if (now > rateData.resetTime) {
      rateData.count = 0;
      rateData.resetTime = now + 10 * 60 * 1000;
    }
    if (rateData.count >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Too many subscription attempts. Please try again in a few minutes.'
      });
    }
    rateData.count += 1;
    newsletterRateLimit.set(clientKey, rateData);

    console.log(`\n--- NEWSLETTER REQUEST RECEIVED ---`);
    console.log(`[NEWSLETTER EMAIL]: ${cleanEmail}`);

    // Check duplicate in Mongo or Memory
    if (isMongoConnected()) {
      const existing = await Subscriber.findOne({ email: cleanEmail });
      if (existing) {
        if (existing.status === 'unsubscribed') {
          existing.status = 'active';
          existing.subscribedAt = new Date();
          await existing.save();
          console.log(`[NEWSLETTER DB STATUS] Subscriber reactivated in MongoDB: true`);
          const emailResult = await sendWelcomeEmail(cleanEmail);
          return res.json({
            success: true,
            subscribed: true,
            emailSent: Boolean(emailResult.emailSent),
            message: emailResult.emailSent
              ? "Welcome back! Check your inbox for a confirmation email."
              : "Welcome back! Your subscription is reactivated."
          });
        }
        console.log(`[NEWSLETTER DB STATUS] Duplicate subscriber detected: true`);
        return res.status(400).json({
          success: false,
          subscribed: true,
          emailSent: false,
          message: "You're already subscribed to Nexora updates."
        });
      }

      // Create new subscriber in MongoDB
      const subscriber = new Subscriber({
        email: cleanEmail,
        status: 'active',
        emailStatus: 'pending'
      });
      await subscriber.save();
      console.log(`[NEWSLETTER DB STATUS] Subscriber saved to MongoDB: true`);

      // Trigger confirmation email
      const emailResult = await sendWelcomeEmail(cleanEmail);
      if (emailResult.emailSent) {
        subscriber.emailStatus = 'sent';
        await subscriber.save();
      } else {
        subscriber.emailStatus = 'failed';
        await subscriber.save();
      }

      return res.json({
        success: true,
        subscribed: true,
        emailSent: Boolean(emailResult.emailSent),
        message: emailResult.emailSent
          ? "You're subscribed! Check your inbox for a confirmation email."
          : "You're subscribed, but the confirmation email couldn't be sent right now."
      });
    } else {
      // Memory Store Fallback
      if (memorySubscribersStore.has(cleanEmail)) {
        const existing = memorySubscribersStore.get(cleanEmail);
        if (existing.status === 'unsubscribed') {
          existing.status = 'active';
          existing.subscribedAt = new Date();
          console.log(`[NEWSLETTER MEMORY STATUS] Subscriber reactivated in Memory: true`);
          const emailResult = await sendWelcomeEmail(cleanEmail);
          return res.json({
            success: true,
            subscribed: true,
            emailSent: Boolean(emailResult.emailSent),
            message: emailResult.emailSent
              ? "Welcome back! Check your inbox for a confirmation email."
              : "Welcome back! Your subscription is reactivated."
          });
        }
        console.log(`[NEWSLETTER MEMORY STATUS] Duplicate subscriber detected: true`);
        return res.status(400).json({
          success: false,
          subscribed: true,
          emailSent: false,
          message: "You're already subscribed to Nexora updates."
        });
      }

      const subscriberObj = {
        _id: `sub_${Date.now()}`,
        email: cleanEmail,
        status: 'active',
        emailStatus: 'pending',
        subscribedAt: new Date()
      };
      memorySubscribersStore.set(cleanEmail, subscriberObj);
      console.log(`[NEWSLETTER MEMORY STATUS] Subscriber saved to Memory Store: true`);

      const emailResult = await sendWelcomeEmail(cleanEmail);
      if (emailResult.emailSent) {
        subscriberObj.emailStatus = 'sent';
      } else {
        subscriberObj.emailStatus = 'failed';
      }

      return res.json({
        success: true,
        subscribed: true,
        emailSent: Boolean(emailResult.emailSent),
        message: emailResult.emailSent
          ? "You're subscribed! Check your inbox for a confirmation email."
          : "You're subscribed, but the confirmation email couldn't be sent right now."
      });
    }
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    // Duplicate Key Error Guard (E11000)
    if (error.code === 11000 || error.name === 'MongoServerError') {
      return res.status(400).json({
        success: false,
        message: "You're already subscribed to Nexora updates."
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.'
    });
  }
});

// 2. PROTECTED ADMIN GET ALL SUBSCRIBERS ENDPOINT
router.get('/newsletter/subscribers', requireAdmin, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
      return res.json({ success: true, count: subscribers.length, subscribers });
    } else {
      const subscribers = Array.from(memorySubscribersStore.values()).sort(
        (a, b) => new Date(b.subscribedAt) - new Date(a.subscribedAt)
      );
      return res.json({ success: true, count: subscribers.length, subscribers });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 3. PUBLIC UNSUBSCRIBE ENDPOINT
router.post('/newsletter/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !isValidEmailFormat(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (isMongoConnected()) {
      const subscriber = await Subscriber.findOne({ email: cleanEmail });
      if (!subscriber) {
        return res.status(404).json({ success: false, message: 'Subscriber email not found.' });
      }
      subscriber.status = 'unsubscribed';
      await subscriber.save();
      return res.json({ success: true, message: 'Successfully unsubscribed from Nexora updates.' });
    } else {
      const subscriber = memorySubscribersStore.get(cleanEmail);
      if (!subscriber) {
        return res.status(404).json({ success: false, message: 'Subscriber email not found.' });
      }
      subscriber.status = 'unsubscribed';
      return res.json({ success: true, message: 'Successfully unsubscribed from Nexora updates.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
