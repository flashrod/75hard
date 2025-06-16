const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');

// Route imports
const authRoutes = require('./routes/auth');
const challengeRoutes = require('./routes/challenge');
const taskRoutes = require('./routes/tasks');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// CORS Configuration - FIXED to include localhost:3000
const corsOptions = {
  origin: [
    'http://localhost:3000',  // Your frontend is running on this port
    'http://localhost:5173',  // Vite alternative port
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://localhost:4173',  // Vite preview port
    'http://127.0.0.1:4173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Middleware
app.use(limiter);
app.use(helmet({
  crossOriginEmbedderPolicy: false // Disable COEP for development
}));
app.use(cors(corsOptions)); // Updated CORS configuration
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add preflight handling for all routes
app.options('*', cors(corsOptions));

// Add logging middleware to debug CORS
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'none'}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/challenge', challengeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/upload', uploadRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: '75 Hard Challenge Backend Server Running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    port: PORT,
    corsOrigins: corsOptions.origin
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.all('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found' });
});

// Enhanced server startup with port conflict handling
const server = app.listen(PORT, () => {
  console.log('🎉 75 Hard Challenge Backend Server Started!');
  console.log(`🌐 Server running on port ${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  console.log(`🌍 CORS enabled for origins: ${corsOptions.origin.join(', ')}`);
  console.log('─'.repeat(50));
});

// Handle port already in use error
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.log('🔧 Solutions:');
    console.log(`   1. Kill the process: sudo kill -9 $(lsof -ti:${PORT})`);
    console.log(`   2. Use a different port in your .env file`);
    console.log(`   3. Wait a moment and try again`);
    process.exit(1);
  } else {
    console.error('🚨 Server error:', err);
    process.exit(1);
  }
});

// Graceful shutdown
