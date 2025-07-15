const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();

const conn = require('./utilise/conn');
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
conn();

const allowedOrigins = ['https://claimboard-game-frontend.onrender.com'];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Routes
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);

// Fallback route
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'https://claimboard-game-frontend.onrender.com',
    credentials: true,
  },
});

// Global socket access
global.io = io;

io.on('connection', (socket) => {
  console.log(' Socket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
