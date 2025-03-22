const mongoose = require('mongoose');
const QRCode = require('qrcode');

const tokenSchema = new mongoose.Schema({
  tokenNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  meal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  totalAmount: {
    type: Number,
    required: true
  },
  pickupTime: {
    type: String,
    enum: ['lunch', 'snacks'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'used', 'expired', 'cancelled'],
    default: 'active'
  },
  qrCode: {
    type: String
  },
  expiresAt: {
    type: Date,
    required: true
  },
  usedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancelReason: {
    type: String
  },
  refundStatus: {
    type: String,
    enum: ['pending', 'processed', 'failed', 'not_required'],
    default: 'not_required'
  },
  refundAmount: {
    type: Number
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Generate token number
tokenSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Generate a unique token number (e.g., TOK-20250322-001)
    const date = new Date();
    const prefix = 'TOK';
    const dateStr = date.getFullYear().toString().substr(-2) +
                   (date.getMonth() + 1).toString().padStart(2, '0') +
                   date.getDate().toString().padStart(2, '0');
    
    const lastToken = await this.constructor.findOne({
      tokenNumber: new RegExp(`^${prefix}-${dateStr}`)
    }).sort({ tokenNumber: -1 });

    let sequence = '001';
    if (lastToken) {
      const lastSequence = parseInt(lastToken.tokenNumber.split('-')[2]);
      sequence = (lastSequence + 1).toString().padStart(3, '0');
    }

    this.tokenNumber = `${prefix}-${dateStr}-${sequence}`;

    // Generate QR code
    try {
      this.qrCode = await QRCode.toDataURL(this.tokenNumber);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }

    // Set expiry time based on pickup time
    const today = new Date();
    if (this.pickupTime === 'lunch') {
      this.expiresAt = new Date(today.setHours(13, 0, 0)); // 1:00 PM
    } else {
      this.expiresAt = new Date(today.setHours(16, 0, 0)); // 4:00 PM
    }
  }
  next();
});

// Check if token is expired
tokenSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

// Use token
tokenSchema.methods.useToken = async function() {
  if (this.status !== 'active') {
    throw new Error(`Token cannot be used. Current status: ${this.status}`);
  }
  if (this.isExpired()) {
    this.status = 'expired';
    throw new Error('Token has expired');
  }
  this.status = 'used';
  this.usedAt = new Date();
  return this.save();
};

// Cancel token
tokenSchema.methods.cancelToken = async function(reason) {
  if (this.status !== 'active') {
    throw new Error(`Token cannot be cancelled. Current status: ${this.status}`);
  }
  if (this.isExpired()) {
    this.status = 'expired';
    throw new Error('Token has expired');
  }

  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.cancelReason = reason;
  this.refundStatus = 'pending';
  this.refundAmount = this.totalAmount;
  return this.save();
};

// Process refund
tokenSchema.methods.processRefund = async function(status) {
  if (this.refundStatus !== 'pending') {
    throw new Error(`Refund cannot be processed. Current status: ${this.refundStatus}`);
  }
  this.refundStatus = status;
  return this.save();
};

module.exports = mongoose.model('Token', tokenSchema);
