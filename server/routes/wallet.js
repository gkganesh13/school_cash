const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Get wallet balance and recent transactions
router.get('/balance', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const recentTransactions = await Transaction.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            balance: user.wallet.balance,
            recentTransactions
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add money to wallet
router.post('/deposit', auth, async (req, res) => {
    try {
        const { amount } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const user = await User.findById(req.user._id);
        
        // Create transaction record
        const transaction = new Transaction({
            userId: req.user._id,
            type: 'deposit',
            amount,
            description: 'Wallet top-up',
            status: 'completed',
            metadata: {
                paymentMethod: 'card' // This would come from payment gateway
            }
        });

        await transaction.save();

        // Update wallet balance
        user.wallet.balance += amount;
        user.wallet.transactions.push(transaction._id);
        await user.save();

        res.json({
            message: 'Deposit successful',
            balance: user.wallet.balance,
            transaction
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Make payment
router.post('/pay', auth, async (req, res) => {
    try {
        const { amount, description, vendorId } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const user = await User.findById(req.user._id);
        
        if (user.wallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Create transaction record
        const transaction = new Transaction({
            userId: req.user._id,
            type: 'payment',
            amount: -amount, // Negative amount for payments
            description,
            status: 'completed',
            metadata: {
                vendorId
            }
        });

        await transaction.save();

        // Update wallet balance
        user.wallet.balance -= amount;
        user.wallet.transactions.push(transaction._id);
        await user.save();

        // If vendor exists, update their balance
        if (vendorId) {
            const vendor = await User.findById(vendorId);
            if (vendor) {
                vendor.wallet.balance += amount;
                vendor.wallet.transactions.push(transaction._id);
                await vendor.save();
            }
        }

        res.json({
            message: 'Payment successful',
            balance: user.wallet.balance,
            transaction
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get transaction history
router.get('/transactions', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;

        const transactions = await Transaction.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);

        const total = await Transaction.countDocuments({ userId: req.user._id });

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

module.exports = router;
