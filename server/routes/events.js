const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Get all events
router.get('/', auth, async (req, res) => {
    try {
        const events = await Event.find({ status: { $ne: 'cancelled' } })
            .sort({ date: 1 })
            .populate('organizer', 'name');
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get single event
router.get('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'name')
            .populate('participants.userId', 'name');
            
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create event (admin only)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const {
            title,
            description,
            date,
            registrationDeadline,
            capacity,
            fee,
            type
        } = req.body;

        const event = new Event({
            title,
            description,
            date,
            registrationDeadline,
            capacity,
            fee,
            type,
            organizer: req.user._id
        });

        await event.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Register for event
router.post('/:id/register', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if registration is closed
        if (new Date() > new Date(event.registrationDeadline)) {
            return res.status(400).json({ message: 'Registration deadline has passed' });
        }

        // Check if event is full
        if (event.registeredCount >= event.capacity) {
            return res.status(400).json({ message: 'Event is full' });
        }

        // Check if user is already registered
        const isRegistered = event.participants.some(
            p => p.userId.toString() === req.user._id.toString()
        );

        if (isRegistered) {
            return res.status(400).json({ message: 'Already registered' });
        }

        // Check wallet balance
        const user = await User.findById(req.user._id);
        if (user.wallet.balance < event.fee) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Create transaction
        const transaction = new Transaction({
            userId: req.user._id,
            type: 'payment',
            amount: -event.fee,
            description: `Registration fee for ${event.title}`,
            status: 'completed',
            metadata: {
                eventId: event._id
            }
        });

        await transaction.save();

        // Update user wallet
        user.wallet.balance -= event.fee;
        user.wallet.transactions.push(transaction._id);
        await user.save();

        // Add user to event participants
        event.participants.push({
            userId: req.user._id,
            paymentStatus: 'completed'
        });
        event.registeredCount += 1;
        await event.save();

        res.json({
            message: 'Successfully registered for event',
            event,
            transaction
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Cancel registration
router.post('/:id/cancel', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is registered
        const participantIndex = event.participants.findIndex(
            p => p.userId.toString() === req.user._id.toString()
        );

        if (participantIndex === -1) {
            return res.status(400).json({ message: 'Not registered for this event' });
        }

        // Check if cancellation is allowed (e.g., 24 hours before event)
        const eventDate = new Date(event.date);
        const now = new Date();
        const hoursUntilEvent = (eventDate - now) / (1000 * 60 * 60);

        if (hoursUntilEvent < 24) {
            return res.status(400).json({ message: 'Cannot cancel registration within 24 hours of event' });
        }

        // Create refund transaction
        const transaction = new Transaction({
            userId: req.user._id,
            type: 'refund',
            amount: event.fee,
            description: `Refund for ${event.title} registration cancellation`,
            status: 'completed',
            metadata: {
                eventId: event._id
            }
        });

        await transaction.save();

        // Update user wallet
        const user = await User.findById(req.user._id);
        user.wallet.balance += event.fee;
        user.wallet.transactions.push(transaction._id);
        await user.save();

        // Remove user from event participants
        event.participants.splice(participantIndex, 1);
        event.registeredCount -= 1;
        await event.save();

        res.json({
            message: 'Registration cancelled successfully',
            transaction
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
