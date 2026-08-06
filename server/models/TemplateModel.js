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
  category: {
    type: String,
    required: true
  },
  badge: {
    type: String,
    default: 'Popular'
  },
  tagline: {
    type: String,
    required: true
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
    type: String,
    required: true
  },
  defaultData: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TemplateModel', TemplateSchema);
