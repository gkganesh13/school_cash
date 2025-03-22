const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    registrationDeadline: {
        type: Date,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    registeredCount: {
        type: Number,
        default: 0
    },
    fee: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['academic', 'sports', 'cultural', 'hackathon', 'other'],
        required: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    participants: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        registrationDate: {
            type: Date,
            default: Date.now
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending'
        }
    }],
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
