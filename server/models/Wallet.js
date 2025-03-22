const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  reference: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  transactions: [transactionSchema],
  dailyLimit: {
    type: Number,
    default: 0
  },
  dailySpent: {
    type: Number,
    default: 0
  },
  lastResetDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Reset daily spent amount at midnight
walletSchema.methods.resetDailySpent = function() {
  const today = new Date();
  const lastReset = new Date(this.lastResetDate);
  
  if (today.getDate() !== lastReset.getDate() ||
      today.getMonth() !== lastReset.getMonth() ||
      today.getFullYear() !== lastReset.getFullYear()) {
    this.dailySpent = 0;
    this.lastResetDate = today;
  }
};

// Check if transaction is within daily limit
walletSchema.methods.checkDailyLimit = function(amount) {
  this.resetDailySpent();
  return !this.dailyLimit || (this.dailySpent + amount <= this.dailyLimit);
};

// Add transaction and update balance
walletSchema.methods.addTransaction = async function(transaction) {
  if (transaction.type === 'debit') {
    if (transaction.amount > this.balance) {
      throw new Error('Insufficient balance');
    }
    if (!this.checkDailyLimit(transaction.amount)) {
      throw new Error('Daily spending limit exceeded');
    }
    this.balance -= transaction.amount;
    this.dailySpent += transaction.amount;
  } else {
    this.balance += transaction.amount;
  }

  this.transactions.push(transaction);
  return this.save();
};

module.exports = mongoose.model('Wallet', walletSchema);
