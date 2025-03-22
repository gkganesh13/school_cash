const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Event = require('../models/Event');

// Get current user profile
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('wallet.transactions');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update user profile
router.put('/me', auth, async (req, res) => {
    try {
        const {
            name,
            phoneNumber,
            address,
            studentId,
            parentId
        } = req.body;

        const user = await User.findById(req.user._id);

        if (name) user.name = name;
        
        user.profile = {
            ...user.profile,
            phoneNumber: phoneNumber || user.profile.phoneNumber,
            address: address || user.profile.address,
            studentId: studentId || user.profile.studentId,
            parentId: parentId || user.profile.parentId
        };

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get user's registered events
router.get('/events', auth, async (req, res) => {
    try {
        const events = await Event.find({
            'participants.userId': req.user._id
        }).sort({ date: 1 });

        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Link parent to student (for student accounts)
router.post('/link-parent', auth, async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can link parents' });
        }

        const { parentEmail } = req.body;

        const parent = await User.findOne({ email: parentEmail, role: 'parent' });
        if (!parent) {
            return res.status(404).json({ message: 'Parent account not found' });
        }

        const student = await User.findById(req.user._id);
        student.profile.parentId = parent._id;
        await student.save();

        res.json({ message: 'Parent linked successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get linked students (for parent accounts)
router.get('/linked-students', auth, async (req, res) => {
    try {
        if (req.user.role !== 'parent') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const students = await User.find({
            'profile.parentId': req.user._id,
            role: 'student'
        }).select('-password');

        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
