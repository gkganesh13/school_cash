const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Get all vendors
router.get('/', auth, async (req, res) => {
    try {
        const vendors = await User.find({ role: 'vendor' })
            .select('-password')
            .select('-wallet.transactions');
        res.json(vendors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get vendor profile
router.get('/profile', auth, async (req, res) => {
    try {
        if (req.user.role !== 'vendor') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const vendor = await User.findById(req.user._id)
            .select('-password')
            .populate('wallet.transactions');

        res.json(vendor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update vendor profile
router.put('/profile', auth, async (req, res) => {
    try {
        if (req.user.role !== 'vendor') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const {
            businessName,
            description,
            services,
            phoneNumber,
            address
        } = req.body;

        const vendor = await User.findById(req.user._id);

        vendor.profile = {
            ...vendor.profile,
            businessName: businessName || vendor.profile.businessName,
            description: description || vendor.profile.description,
            services: services || vendor.profile.services,
            phoneNumber: phoneNumber || vendor.profile.phoneNumber,
            address: address || vendor.profile.address
        };

        await vendor.save();
        res.json(vendor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get vendor transactions
router.get('/transactions', auth, async (req, res) => {
    try {
        if (req.user.role !== 'vendor') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;

        const transactions = await Transaction.find({
            'metadata.vendorId': req.user._id
        })
            .populate('userId', 'name')
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);

        const total = await Transaction.countDocuments({
            'metadata.vendorId': req.user._id
        });

        res.json({
            transactions,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalTransactions: total
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Request withdrawal
router.post('/withdraw', auth, async (req, res) => {
    try {
        if (req.user.role !== 'vendor') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const vendor = await User.findById(req.user._id);

        if (vendor.wallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Create withdrawal transaction
        const transaction = new Transaction({
            userId: req.user._id,
            type: 'withdrawal',
            amount: -amount,
            description: 'Vendor withdrawal request',
            status: 'pending',
            metadata: {
                vendorId: req.user._id
            }
        });

        await transaction.save();

        // Update vendor wallet
        vendor.wallet.balance -= amount;
        vendor.wallet.transactions.push(transaction._id);
        await vendor.save();

        res.json({
            message: 'Withdrawal request submitted',
            transaction
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
