require('dotenv').config();
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { Server } = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth');
const meetingRoutes = require('./routes/meetings');
const taskRoutes = require('./routes/tasks');
const aiRoutes = require('./routes/ai');

// Import Socket.io handler
const registerSocketHandlers = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
// Render requires binding to 0.0.0.0; falls back safely on localhost too
const HOST = process.env.HOST || '0.0.0.0';

// ─── Allowed origins ──────────────────────────────────────────────────────────
// FRONTEND_URL is the single source of truth for production.
// LOCAL_CLIENT_URL allows local dev without setting FRONTEND_URL.
const allowedOrigins = [
  process.env.FRONTEND_URL,              // production Vercel URL
  process.env.CLIENT_URL,               // legacy / local override
  'http://localhost:5173',              // Vite dev server fallback
  'http://localhost:4173',              // Vite preview fallback
].filter(Boolean); // drop undefined entries

// ─── Socket.io setup ─────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow server-to-server requests (no origin) and whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`Socket.io CORS blocked: ${origin}`));
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Register all socket event handlers
registerSocketHandlers(io);

// ─── Express middleware ───────────────────────────────────────────────────────
app.use(helmet());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS blocked: ${origin} is not in the allowed list.`));
  },
  credentials: true,
}));

app.use(express.json());

// ─── Database ─────────────────────────────────────────────────────────────────
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// ─── API routes ───────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    socketConnections: io.engine.clientsCount,
    allowedOrigins,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}. Resource not found.` });
});

// ─── Global error handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[Error Log] ${err.stack}`);

  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ error: err.message });
  }
  if (err.code === 11000) {
    const key = Object.keys(err.keyValue)[0];
    return res.status(400).json({ error: `The ${key} value provided is already registered.` });
  }
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ error: `Validation error: ${messages.join(', ')}` });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Invalid identifier format: ${err.value}` });
  }

  return res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
    error: err.message || 'An unexpected internal server error occurred.',
  });
});

// ─── Start server (bind to 0.0.0.0 for Render) ───────────────────────────────
server.listen(PORT, HOST, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Listening on ${HOST}:${PORT}`);
  console.log(`Socket.io ready — allowed origins: ${allowedOrigins.join(', ')}`);
});
