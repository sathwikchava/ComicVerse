const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const paymentRoutes = require('./routes/payment');

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // For development, allow all. In production, configure to allow only Netlify URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/comicverse';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB database successfully!'))
  .catch((err) => console.error('MongoDB database connection error:', err));

const path = require('path');

// Core API routes
app.use('/api/payment', paymentRoutes);

// Serve static frontend files (HTML, CSS, JS, Images) from the root directory
app.use(express.static(path.join(__dirname, '../')));

// Serve home.html as default landing page on root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../home.html'));
});

// Server health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'ComicVerse backend server is running smoothly.' });
});

// Port configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
