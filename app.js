require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express(); // <--- app must be initialized before using it

const itemRoutes = require('./routes/Items');
const authRoutes = require('./routes/auth');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'yourSecretKey',  // change this to a strong secret
  resave: false,
  saveUninitialized: false,
}));

// Use routes AFTER app is created and middleware set up
app.use('/auth', authRoutes);
app.use('/items', itemRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => res.redirect('/items'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
