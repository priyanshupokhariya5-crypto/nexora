const mongoose = require('mongoose');

const WebsiteSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'guest'
  },
  siteId: {
    type: String,
    required: true,
    unique: true
  },
  templateId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  accentColor: {
    type: String,
    default: '#2551e8'
  },
  fontFamily: {
    type: String,
    default: 'sans'
  },
  bgTheme: {
    type: String,
    default: 'light'
  },
  customData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  customDomain: {
    type: String,
    default: null,
    sparse: true,
    lowercase: true,
    trim: true
  },
  domainStatus: {
    type: String,
    enum: ['none', 'pending', 'verified', 'failed'],
    default: 'none'
  },
  domainVerified: {
    type: Boolean,
    default: false
  },
  domainVerificationToken: {
    type: String,
    default: null
  },
  publishedAt: {
    type: Date,
    default: null
  },
  views: {
    type: Number,
    default: 0
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

module.exports = mongoose.model('Website', WebsiteSchema);
