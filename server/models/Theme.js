const mongoose = require('mongoose');

const ThemeSchema = new mongoose.Schema({
  themeId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  accentColor: {
    type: String,
    required: true,
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
  category: {
    type: String,
    default: 'E-Commerce'
  },
  badge: {
    type: String,
    default: 'Custom Theme'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Theme', ThemeSchema);
