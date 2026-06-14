require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

// Import routes
const authRoutes = require('./routes/auth');
const meetingRoutes = require('./routes/meetings');
const taskRoutes = require('./routes/tasks');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middleware
app.use(helmet());

// CORS config
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'https://intell-meet-ten.vercel.app',
  'https://priyansh-rai109.github.io'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy: Origin not allowed.'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Connect to Database
connectDB();

// API Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

// Fallback for unmatched routes (404 handler)
app.use((req, res, next) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}. Resource not found.` });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(`[Error Log] ${err.stack}`);
  
  // CORS block error handling
  if (err.message.includes('CORS')) {
    return res.status(403).json({ error: err.message });
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const key = Object.keys(err.keyValue)[0];
    return res.status(400).json({ error: `The ${key} value provided is already registered in our system.` });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ error: `Validation error: ${messages.join(', ')}` });
  }

  // CastError (e.g. invalid ObjectId formats)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Invalid identifier format: ${err.value}` });
  }

  // General server errors
  return res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
    error: err.message || 'An unexpected internal server error occurred.'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
