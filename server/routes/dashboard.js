const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Event = require('../models/Event');
const Vendor = require('../models/Vendor');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    // Get counts and stats from different collections
    const [
      totalUsers,
      totalRevenue,
      activeEvents,
      activeVendors,
      recentTransactions,
      upcomingEvents
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Transaction.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Event.countDocuments({ status: 'active' }),
      Vendor.countDocuments({ status: 'active' }),
      Transaction.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name')
        .lean(),
      Event.find({ 
        date: { $gte: new Date() },
        status: 'active'
      })
        .sort({ date: 1 })
        .limit(5)
        .lean()
    ]);

    res.json({
      stats: {
        totalUsers,
        totalRevenue: totalRevenue[0]?.total || 0,
        activeEvents,
        activeVendors
      },
      recentTransactions: recentTransactions.map(t => ({
        _id: t._id,
        description: `${t.type === 'credit' ? 'Payment from' : 'Payment to'} ${t.user.name}`,
        amount: t.amount,
        type: t.type,
        date: t.createdAt
      })),
      upcomingEvents: upcomingEvents.map(e => ({
        _id: e._id,
        name: e.name,
        date: e.date
      }))
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ message: 'Server error while fetching dashboard stats' });
  }
});

module.exports = router;
