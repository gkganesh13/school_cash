const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String
  },
  category: {
    type: String,
    required: true,
    enum: ['Breakfast', 'Lunch', 'Snacks', 'Beverages']
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  availableQuantity: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  nutritionInfo: {
    calories: Number,
    protein: Number,
    carbohydrates: Number,
    fat: Number,
    allergens: [String]
  },
  preparationTime: {
    type: Number, // in minutes
    default: 15
  },
  isSpecial: {
    type: Boolean,
    default: false
  },
  availableDays: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  }
}, {
  timestamps: true
});

// Update rating when a new review is added
mealSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.totalRatings = 0;
    return;
  }

  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating = totalRating / this.reviews.length;
  this.totalRatings = this.reviews.length;
};

// Add a new review
mealSchema.methods.addReview = async function(userId, rating, comment) {
  const existingReviewIndex = this.reviews.findIndex(
    review => review.user.toString() === userId.toString()
  );

  if (existingReviewIndex !== -1) {
    this.reviews[existingReviewIndex] = { user: userId, rating, comment };
  } else {
    this.reviews.push({ user: userId, rating, comment });
  }

  this.updateRating();
  return this.save();
};

// Check availability for the given quantity
mealSchema.methods.checkAvailability = function(quantity) {
  return this.available && this.availableQuantity >= quantity;
};

// Update quantity after order
mealSchema.methods.updateQuantity = async function(quantity) {
  if (!this.checkAvailability(quantity)) {
    throw new Error('Insufficient quantity available');
  }
  this.availableQuantity -= quantity;
  if (this.availableQuantity === 0) {
    this.available = false;
  }
  return this.save();
};

module.exports = mongoose.model('Meal', mealSchema);
