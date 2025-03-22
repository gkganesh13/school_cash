const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Meal = require('../models/Meal');
const Token = require('../models/Token');
const Wallet = require('../models/Wallet');
const Settings = require('../models/Settings');
const { validateMeal, validateOrder } = require('../utils/validation');

// Get all meals
router.get('/', auth, async (req, res) => {
  try {
    const meals = await Meal.find({ available: true })
      .populate('vendor', 'businessName counterNumber');
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get meal by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id)
      .populate('vendor', 'businessName counterNumber');
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    res.json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create meal (vendor only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'vendor') {
    return res.status(403).json({ message: 'Only vendors can create meals' });
  }

  try {
    const { error } = validateMeal(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const meal = new Meal({
      ...req.body,
      vendor: req.user.vendorId
    });

    const savedMeal = await meal.save();
    res.status(201).json(savedMeal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update meal (vendor only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'vendor') {
    return res.status(403).json({ message: 'Only vendors can update meals' });
  }

  try {
    const { error } = validateMeal(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const meal = await Meal.findById(req.params.id);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    if (meal.vendor.toString() !== req.user.vendorId.toString()) {
      return res.status(403).json({ message: 'You can only update your own meals' });
    }

    const updatedMeal = await Meal.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedMeal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete meal (vendor only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'vendor') {
    return res.status(403).json({ message: 'Only vendors can delete meals' });
  }

  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    if (meal.vendor.toString() !== req.user.vendorId.toString()) {
      return res.status(403).json({ message: 'You can only delete your own meals' });
    }

    await meal.remove();
    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add review to meal
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const meal = await Meal.findById(req.params.id);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    await meal.addReview(req.user.id, rating, comment);
    res.json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Order meal
router.post('/order', auth, async (req, res) => {
  try {
    const { error } = validateOrder(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { mealId, quantity, pickupTime } = req.body;

    // Get meal details
    const meal = await Meal.findById(mealId);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    // Check meal availability
    if (!meal.checkAvailability(quantity)) {
      return res.status(400).json({ message: 'Meal not available in requested quantity' });
    }

    // Calculate total amount
    const totalAmount = meal.price * quantity;

    // Get user's wallet
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      return res.status(400).json({ message: 'Wallet not found' });
    }

    // Get user's settings for parental controls
    const settings = await Settings.findOne({ user: req.user.id });
    if (settings && !settings.checkSpendingAllowed(totalAmount, meal.vendor, meal.category)) {
      return res.status(403).json({ message: 'Purchase not allowed due to parental controls' });
    }

    // Create transaction
    const transaction = {
      type: 'debit',
      amount: totalAmount,
      description: `Payment for ${meal.name} x${quantity}`,
      reference: `MEAL-${Date.now()}`,
      status: 'pending',
      metadata: {
        mealId,
        quantity,
        pickupTime
      }
    };

    // Add transaction to wallet and update balance
    await wallet.addTransaction(transaction);

    // Update meal quantity
    await meal.updateQuantity(quantity);

    // Create token
    const token = new Token({
      user: req.user.id,
      meal: mealId,
      quantity,
      totalAmount,
      pickupTime
    });

    await token.save();

    res.status(201).json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's tokens
router.get('/tokens', auth, async (req, res) => {
  try {
    const tokens = await Token.find({ user: req.user.id })
      .populate('meal', 'name price vendor')
      .populate('meal.vendor', 'businessName counterNumber');
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel token
router.post('/tokens/:id/cancel', auth, async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }

    if (token.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'You can only cancel your own tokens' });
    }

    await token.cancelToken(req.body.reason);
    res.json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
