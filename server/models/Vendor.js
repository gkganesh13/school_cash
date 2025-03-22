const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  categories: [{
    type: String,
    enum: [
      'Breakfast',
      'Lunch',
      'Snacks',
      'Beverages',
      'South Indian',
      'North Indian',
      'Chinese',
      'Fast Food',
      'Healthy Food',
      'Desserts'
    ]
  }],
  services: [{
    type: String,
    enum: ['Dine In', 'Takeaway', 'Delivery']
  }],
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive', 'suspended'],
    default: 'pending'
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
  openingTime: {
    type: String,
    required: true
  },
  closingTime: {
    type: String,
    required: true
  },
  counterNumber: {
    type: String,
    required: true,
    unique: true
  },
  documents: {
    gstNumber: {
      type: String,
      required: true
    },
    fssaiLicense: {
      type: String,
      required: true
    },
    panCard: String,
    addressProof: String
  },
  bankDetails: {
    bankName: {
      type: String,
      required: true
    },
    accountNumber: {
      type: String,
      required: true
    },
    ifscCode: {
      type: String,
      required: true
    },
    accountHolderName: {
      type: String,
      required: true
    }
  },
  earnings: {
    total: {
      type: Number,
      default: 0
    },
    pending: {
      type: Number,
      default: 0
    },
    lastPayout: {
      amount: Number,
      date: Date
    }
  },
  settings: {
    autoAcceptOrders: {
      type: Boolean,
      default: true
    },
    preparationTime: {
      type: Number,
      default: 15
    },
    maxDailyOrders: {
      type: Number,
      default: 100
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  }
}, {
  timestamps: true
});

// Update rating when a new review is added
vendorSchema.methods.updateRating = function() {
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
vendorSchema.methods.addReview = async function(userId, rating, comment) {
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

// Check if vendor is open
vendorSchema.methods.isOpen = function() {
  const now = new Date();
  const currentTime = now.getHours() * 100 + now.getMinutes();
  
  const [openHour, openMinute] = this.openingTime.split(':').map(Number);
  const [closeHour, closeMinute] = this.closingTime.split(':').map(Number);
  
  const openTime = openHour * 100 + openMinute;
  const closeTime = closeHour * 100 + closeMinute;
  
  return currentTime >= openTime && currentTime <= closeTime;
};

// Update earnings
vendorSchema.methods.updateEarnings = async function(amount) {
  this.earnings.total += amount;
  this.earnings.pending += amount;
  return this.save();
};

// Process payout
vendorSchema.methods.processPayout = async function(amount) {
  if (amount > this.earnings.pending) {
    throw new Error('Insufficient pending earnings');
  }
  
  this.earnings.pending -= amount;
  this.earnings.lastPayout = {
    amount,
    date: new Date()
  };
  
  return this.save();
};

module.exports = mongoose.model('Vendor', vendorSchema);
