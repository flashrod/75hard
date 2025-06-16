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

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
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
  optionsSuccessStatus: 200
};

// Middleware Order Matters!
app.use(cors(corsOptions)); // CORS first
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"]
    }
  }
}));

// Rate limiting with CORS headers
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req) => req.method === 'OPTIONS' ? 0 : 100, // Skip OPTIONS
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many requests from this IP, please try again later.'
    });
    // Explicitly set CORS headers for rate-limited responses
    res.header("Access-Control-Allow-Origin", corsOptions.origin);
    res.header("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(','));
  }
});
app.use(limiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Preflight handling
app.options('*', cors(corsOptions));

// Request logging
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'none'}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/challenge', challengeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: '75 Hard Challenge Backend Server Running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    port: PORT
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Server setup
const server = app.listen(PORT, () => {
  console.log(`
🎉 75 Hard Challenge Backend Server Started!
🌐 Port: ${PORT}
🔧 Environment: ${process.env.NODE_ENV || 'development'}
📅 Started: ${new Date().toISOString()}
🌍 CORS Origins: ${corsOptions.origin.join(', ')}
${'─'.repeat(50)}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received - shutting down');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
