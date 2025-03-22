require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const defaultUsers = [
    {
        name: 'Admin User',
        email: 'admin@school.com',
        password: 'admin123',
        role: 'admin',
        profile: {
            phoneNumber: '1234567890',
            address: 'School Address'
        }
    },
    {
        name: 'Parent User',
        email: 'parent@school.com',
        password: 'parent123',
        role: 'parent',
        profile: {
            phoneNumber: '9876543210',
            address: 'Parent Address'
        }
    },
    {
        name: 'Student User',
        email: 'student@school.com',
        password: 'student123',
        role: 'student',
        profile: {
            phoneNumber: '5555555555',
            address: 'Student Address',
            studentId: 'STU001'
        }
    },
    {
        name: 'Vendor User',
        email: 'vendor@school.com',
        password: 'vendor123',
        role: 'vendor',
        profile: {
            phoneNumber: '1111111111',
            address: 'Vendor Address',
            vendorDetails: {
                businessName: 'School Cafeteria',
                description: 'Main school cafeteria services',
                services: ['Food', 'Beverages', 'Snacks']
            }
        }
    }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school-management', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('MongoDB Connected');
    
    try {
        // Clear existing users
        await User.deleteMany({});
        console.log('Cleared existing users');

        // Create new users
        for (const userData of defaultUsers) {
            const user = new User(userData);
            await user.save();
            console.log(`Created user: ${userData.email}`);
        }

        console.log('Default users created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating users:', error);
        process.exit(1);
    }
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
