const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  slug: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  badge: {
    type: String,
    default: 'Popular'
  },
  tagline: {
    type: String
  },
  description: {
    type: String
  },
  author: {
    type: String,
    default: 'Nexora Studio'
  },
  tags: {
    type: [String],
    default: []
  },
  accentColor: {
    type: String,
    default: '#2551e8'
  },
  bgTheme: {
    type: String,
    default: 'light'
  },
  fontFamily: {
    type: String,
    default: 'sans'
  },
  image: {
    type: String
  },
  thumbnail: {
    type: String
  },
  heroImage: {
    type: String
  },
  logo: {
    type: String
  },
  previewUrl: {
    type: String,
    default: ''
  },
  demoUrl: {
    type: String,
    default: ''
  },
  liveUrl: {
    type: String,
    default: ''
  },
  documentationUrl: {
    type: String,
    default: ''
  },
  themeType: {
    type: String,
    default: 'split-arched'
  },
  status: {
    type: String,
    enum: ['Published', 'Draft', 'Archived'],
    default: 'Published'
  },
  featured: {
    type: Boolean,
    default: false
  },
  price: {
    type: String,
    default: 'Free'
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  isAdminCreated: {
    type: Boolean,
    default: false
  },
  defaultData: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TemplateModel', TemplateSchema);
