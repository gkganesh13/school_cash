const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    required: true,
    trim: true
  },
  contactEmail: {
    type: String,
    required: true,
    trim: true
  },
  contactPhone: {
    type: String,
    required: true,
    trim: true
  },
  allowParentRegistration: {
    type: Boolean,
    default: true
  },
  allowVendorRegistration: {
    type: Boolean,
    default: true
  },
  maxDailySpendLimit: {
    type: Number,
    default: 0
  },
  notificationEnabled: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

settingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Settings', settingsSchema);
