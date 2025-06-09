const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  next();
}

router.use(requireLogin); // protect all /items routes


// Show item list and total value
router.get('/', async (req, res) => {
  const items = await Item.find();
  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  res.render('index', { items, totalValue });
});

// Add new item
router.post('/', async (req, res) => {
  const { name, quantity, price } = req.body;
  await Item.create({ name, quantity, price });
  res.redirect('/items');
});

// Delete item
router.post('/delete/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.redirect('/items');
});

// Edit item
router.post('/edit/:id', async (req, res) => {
  const { name, quantity, price } = req.body;
  await Item.findByIdAndUpdate(req.params.id, { name, quantity, price });
  res.redirect('/items');
});

module.exports = router;
