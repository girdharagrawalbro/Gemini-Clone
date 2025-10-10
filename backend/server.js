const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session'); // optional if using sessions
require('dotenv').config();

const authRoutes = require('./routes/auth');
const conversationRoutes = require('./routes/conversations');
require('./config/passport'); // ensure passport strategy loaded

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(passport.initialize());
// If you plan to use sessions (not necessary for JWT flow):
// app.use(session({ secret: process.env.SESSION_SECRET || 'secret', resave: false, saveUninitialized: false }));
// app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
const googleAuthRoutes = require('./routes/googleAuth');
app.use('/api/auth', googleAuthRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/geminiclone';
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Start server
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
};

startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

module.exports = app;