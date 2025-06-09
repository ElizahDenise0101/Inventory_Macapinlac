const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

// Show login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login POST
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.send('Invalid username or password');

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send('Invalid username or password');

  req.session.userId = user._id;
  res.redirect('/items');
});

// Show register form
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle register POST
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await User.create({ username, password: hashedPassword });
    res.redirect('/auth/login');
  } catch {
    res.send('User registration failed');
  }
});


// Handle logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;