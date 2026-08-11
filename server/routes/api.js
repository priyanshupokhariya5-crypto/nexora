const express = require('express');
const router = express.Router();
const { TEMPLATES_DATA } = require('../data/templatesList');
const Website = require('../models/Website');
const User = require('../models/User');
const Theme = require('../models/Theme');
const TemplateModel = require('../models/TemplateModel');

// In-memory fallback stores when MongoDB is not connected
const memoryWebsitesStore = new Map();
const memoryUsersStore = new Map();
const memoryThemesStore = new Map();

// Helper to check if Mongoose is connected
const isMongoConnected = () => {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// Seed MongoDB with 30 templates automatically if collection is empty
const seedTemplatesIfEmpty = async () => {
  try {
    if (isMongoConnected()) {
      const count = await TemplateModel.countDocuments();
      if (count === 0) {
        await TemplateModel.insertMany(TEMPLATES_DATA);
        console.log('🌱 Seeded 30 templates into MongoDB "templates" collection');
      }
    }
  } catch (err) {
    console.error('Template seeding error:', err.message);
  }
};

// ==========================================
// 1. CLOUDINARY & IMAGE UPLOAD ENDPOINT
// ==========================================

router.post('/upload', async (req, res) => {
  try {
    const { image } = req.body; // base64 string or image data URL

    if (!image) {
      return res.status(400).json({ success: false, message: 'No image data provided for upload.' });
    }

    // Check if Cloudinary credentials are set in environment
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      const cloudinary = require('cloudinary').v2;
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      });

      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'nexora_uploads'
      });

      return res.json({
        success: true,
        provider: 'cloudinary',
        url: uploadResponse.secure_url,
        message: 'Image uploaded successfully to Cloudinary!'
      });
    }

    // Out-of-the-box fallback: Return data URL / base64 image
    return res.json({
      success: true,
      provider: 'base64',
      url: image,
      message: 'Image uploaded successfully!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 2. ADMIN THEMES ENDPOINTS (GET / POST / DELETE)
// ==========================================

router.get('/admin/themes', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const themes = await Theme.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: themes.length, themes });
    } else {
      const themes = Array.from(memoryThemesStore.values());
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
// 4. TEMPLATES CATALOG ENDPOINTS (DIRECT MONGODB QUERY)
// ==========================================

router.get('/templates', requireAuth, async (req, res) => {
  try {
    await seedTemplatesIfEmpty();
    const { category, search } = req.query;

    if (isMongoConnected()) {
      let query = {};
      if (category && category !== 'All') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { tagline: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ];
      }
      const dbTemplates = await TemplateModel.find(query).limit(30);
      
      const templates = dbTemplates.length > 0 ? dbTemplates : TEMPLATES_DATA.slice(0, 30);
      return res.json({
        success: true,
        source: dbTemplates.length > 0 ? 'mongodb' : 'static',
        count: templates.length,
        templates
      });
    } else {
      let filtered = TEMPLATES_DATA.slice(0, 30);

      if (category && category !== 'All') {
        filtered = filtered.filter(t => t.category.toLowerCase() === category.toLowerCase());
      }

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(t => 
          t.title.toLowerCase().includes(q) || 
          t.tagline.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
        );
      }

      return res.json({
        success: true,
        source: 'in-memory',
        count: filtered.length,
        templates: filtered
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/templates/:id', requireAuth, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const template = await TemplateModel.findOne({ id: req.params.id });
      if (template) return res.json({ success: true, source: 'mongodb', template });
    }
    const template = TEMPLATES_DATA.find(t => t.id === req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, source: 'fallback', template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 5. WEBSITES CRUD ENDPOINTS (AUTO-SAVE & MONGODB SYNC)
// ==========================================

router.post('/websites', requireAuth, async (req, res) => {
  try {
    const { siteId, templateId, title, slug, accentColor, fontFamily, bgTheme, customData, isPublished } = req.body;

    if (!templateId || !title || !customData) {
      return res.status(400).json({ success: false, message: 'Missing required website configuration parameters.' });
    }

    const authenticatedUserId = req.authUserId;
    const generateId = siteId || 'site_' + Math.random().toString(36).substr(2, 9);
    const generateSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(100 + Math.random() * 900);

    // Enforce ownership: User can ONLY update/publish their own website
    if (isMongoConnected()) {
      const existing = await Website.findOne({ siteId: generateId });
      if (existing && existing.userId && existing.userId.toString() !== authenticatedUserId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You can only publish or modify websites belonging to your account.'
        });
      }
    } else {
      const existing = memoryWebsitesStore.get(generateId);
      if (existing && existing.userId && existing.userId.toString() !== authenticatedUserId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You can only publish or modify websites belonging to your account.'
        });
      }
    }

    const sitePayload = {
      userId: authenticatedUserId,
      siteId: generateId,
      templateId,
      title,
      slug: generateSlug,
      accentColor: accentColor || '#2551e8',
      fontFamily: fontFamily || 'sans',
      bgTheme: bgTheme || 'light',
      customData,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : false,
      updatedAt: new Date()
    };

    if (isMongoConnected()) {
      const existing = await Website.findOne({ siteId: generateId });
      let savedSite;
      if (existing) {
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
      const site = await Website.findOne({ $or: [{ siteId: id }, { slug: id }] });
      if (!site) return res.status(404).json({ success: false, message: 'Website not found' });
      site.views += 1;
      await site.save();
      return res.json({ success: true, website: site });
    } else {
      let site = memoryWebsitesStore.get(id);
      if (!site) {
        site = Array.from(memoryWebsitesStore.values()).find(s => s.slug === id);
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

// Public Published Website Fetch Endpoint
router.get('/public/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    if (isMongoConnected()) {
      const site = await Website.findOne({ slug });
      if (!site || site.isPublished === false) {
        return res.status(404).json({ success: false, message: 'Website not found or not published' });
      }
      site.views = (site.views || 0) + 1;
      await site.save();
      return res.json({ success: true, website: site });
    } else {
      let site = Array.from(memoryWebsitesStore.values()).find(s => s.slug === slug);
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

// ==========================================
// 6. AI ASSISTANT ENDPOINTS (GOOGLE GEMINI API INTEGRATION)
// ==========================================

const { GoogleGenerativeAI } = require('@google/generative-ai');

const callGeminiApi = async (action, prompt, currentText = '', targetLang = 'Spanish') => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('ℹ️ GEMINI_API_KEY not configured in environment. Using smart template engine.');
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    let schemaPrompt = '';
    if (action === 'hero') {
      schemaPrompt = 'Output JSON Schema: {"heroTitle": "string", "heroSubtitle": "string", "ctaText": "string"}';
    } else if (action === 'about') {
      schemaPrompt = 'Output JSON Schema: {"aboutTitle": "string", "aboutDesc": "string"}';
    } else if (action === 'services') {
      schemaPrompt = 'Output JSON Schema: {"servicesTitle": "string", "services": [{"title": "string", "price": "string", "desc": "string"}]}';
    } else if (action === 'faq') {
      schemaPrompt = 'Output JSON Schema: {"faqTitle": "string", "faqs": [{"question": "string", "answer": "string"}]}';
    } else if (action === 'seo') {
      schemaPrompt = 'Output JSON Schema: {"metaTitle": "string", "metaDescription": "string", "keywords": "string"}';
    } else if (action === 'cta') {
      schemaPrompt = 'Output JSON Schema: {"ctaText": "string", "ctaSubtext": "string"}';
    } else if (action === 'rewrite' || action === 'shorten' || action === 'expand') {
      schemaPrompt = 'Output JSON Schema: {"resultText": "string"}';
    } else if (action === 'translate') {
      schemaPrompt = `Output JSON Schema: {"targetLang": "${targetLang}", "resultText": "string"}`;
    } else {
      schemaPrompt = 'Output JSON Schema: {"heroTitle": "string", "heroSubtitle": "string", "ctaText": "string"}';
    }

    const fullPrompt = `You are Nexora AI Assistant, a high-converting website copywriter. Generate professional website copy for a modern business.
User Action: ${action}
User Prompt / Business Description: ${prompt}
Current Text Copy: ${currentText || 'None'}
Target Language: ${targetLang}

${schemaPrompt}
Return ONLY valid JSON matching the exact schema specified. Do not include markdown code block formatting or backticks.`;

    const response = await model.generateContent(fullPrompt);
    const text = response.response.text();
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (err) {
    console.error('⚠️ Gemini API execution error, falling back to smart template generator:', err.message);
    return null;
  }
};

const generateAiResponseData = (action, prompt, currentText = '', targetLang = 'Spanish') => {
  const p = (prompt || 'Business').trim();

  switch (action) {
    case 'hero':
      return {
        heroTitle: `Empowering ${p} With Next-Gen Innovations`,
        heroSubtitle: `Streamline operations, increase conversion, and scale your ${p} business with our high-performance platform.`,
        ctaText: `Get Started Free`
      };
    case 'about':
      return {
        aboutTitle: `Crafting Excellence in ${p}`,
        aboutDesc: `Founded with a vision to redefine ${p}, we combine industry expertise with cutting-edge craftsmanship to deliver extraordinary results for scaling businesses.`
      };
    case 'services':
      return {
        servicesTitle: `Premier ${p} Solutions`,
        services: [
          { title: `${p} Core Strategy`, price: '$299', desc: `Comprehensive end-to-end framework optimized for immediate ROI.` },
          { title: `Automated Execution`, price: '$599', desc: `High-performance execution engine engineered for maximum productivity.` },
          { title: `Enterprise Scaling`, price: '$999', desc: `Dedicated infrastructure and 24/7 priority support for global growth.` }
        ]
      };
    case 'faq':
      return {
        faqTitle: `Frequently Asked Questions`,
        faqs: [
          { question: `How fast can I set up ${p}?`, answer: `Deployment takes less than 5 minutes with our automated onboarding.` },
          { question: `Is there a money-back guarantee?`, answer: `Yes, we offer a 30-day full refund policy on all paid plans.` },
          { question: `Can I customize ${p} to my brand?`, answer: `Absolutely! Full control over colors, typography, images, and domain.` }
        ]
      };
    case 'seo':
      return {
        metaTitle: `${p} — High-Converting Official Website`,
        metaDescription: `Discover premier ${p} services designed for scaling enterprises. Fast setup, proven results, and 24/7 support.`,
        keywords: `${p}, business, scaling, platform, premium, fast`
      };
    case 'cta':
      return {
        ctaText: `Claim Your Free ${p} Trial`,
        ctaSubtext: `No credit card required. Instant 14-day full access.`
      };
    case 'rewrite':
      return {
        resultText: `Transforming ${currentText || p} with elevated clarity, precision, and modern customer appeal.`
      };
    case 'shorten':
      return {
        resultText: currentText ? currentText.split('. ')[0] + '.' : `Accelerate growth with ${p}.`
      };
    case 'expand':
      return {
        resultText: `${currentText || p} — Built from the ground up to empower businesses with seamless execution, unparalleled performance, and long-term strategic advantage.`
      };
    case 'translate':
      return {
        targetLang,
        resultText: targetLang === 'Spanish' 
          ? `Impulsando ${p} con innovaciones de última generación y rendimiento superior.`
          : targetLang === 'French'
          ? `Propulser ${p} avec des innovations de nouvelle génération.`
          : targetLang === 'German'
          ? `Beflügeln Sie ${p} mit Innovationen der nächsten Generation.`
          : `Empowering ${p} in ${targetLang}.`
      };
    default:
      return {
        heroTitle: `Transform Your ${p} Business`,
        heroSubtitle: `Elevate user engagement with tailored digital solutions.`,
        ctaText: `Explore Now`
      };
  }
};

// Synchronous JSON response endpoint (Powered by Gemini API)
router.post('/ai/generate', async (req, res) => {
  try {
    const { action, prompt, currentText, targetLang } = req.body;
    let result = await callGeminiApi(action, prompt, currentText, targetLang);
    if (!result) {
      result = generateAiResponseData(action, prompt, currentText, targetLang);
    }
    return res.json({ success: true, action, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// SSE Streaming AI Endpoint (Powered by Gemini API)
router.post('/ai/stream', async (req, res) => {
  try {
    const { action, prompt, currentText, targetLang } = req.body;
    let resultData = await callGeminiApi(action, prompt, currentText, targetLang);
    if (!resultData) {
      resultData = generateAiResponseData(action, prompt, currentText, targetLang);
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const jsonStr = JSON.stringify(resultData);
    const chunkSize = Math.max(1, Math.floor(jsonStr.length / 10));

    let index = 0;
    const interval = setInterval(() => {
      if (index >= jsonStr.length) {
        res.write(`data: [DONE]\n\n`);
        clearInterval(interval);
        res.end();
        return;
      }

      const chunk = jsonStr.slice(index, index + chunkSize);
      index += chunkSize;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    }, 80);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
