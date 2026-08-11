const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nexora';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api', apiRoutes);

// Root healthcheck
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected (using in-memory fallback)';
  res.json({
    status: 'online',
    app: 'Nexora SaaS Backend',
    database: dbStatus,
    timestamp: new Date()
  });
});

const fs = require('fs');

// Root API Server Status Route
app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected (using in-memory fallback)';
  res.json({
    status: 'online',
    app: 'Nexora SaaS Backend API Server',
    database: dbStatus,
    timestamp: new Date()
  });
});

// Serve static frontend ONLY IF client/dist exists on disk (prevents ENOENT errors on Render separate backend)
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }
    const indexPath = path.join(clientDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    next();
  });
}

// Connect MongoDB with safe fallback
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('⚡ MongoDB connected successfully to Nexora database');
  })
  .catch(err => {
    console.log('⚠️  MongoDB Connection Notice:', err.message);
    console.log('💡 Nexora Server is running using high-speed In-Memory DB Mode. All CRUD operations will function smoothly.');
  });

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Nexora SaaS Server running on http://localhost:${PORT}`);
  console.log(`====================================================`);
});
