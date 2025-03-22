require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Meal = require('../models/Meal');
const Settings = require('../models/Settings');

const initializeDb = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Vendor.deleteMany({}),
      Meal.deleteMany({}),
      Settings.deleteMany({})
    ]);

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@school.com',
      password: adminPassword,
      role: 'admin',
      isActive: true
    });

    // Create sample parent
    const parentPassword = await bcrypt.hash('parent123', 10);
    const parent = await User.create({
      name: 'Parent User',
      email: 'parent@school.com',
      password: parentPassword,
      role: 'parent',
      isActive: true
    });

    // Create sample student
    const studentPassword = await bcrypt.hash('student123', 10);
    const student = await User.create({
      name: 'Student User',
      email: 'student@school.com',
      password: studentPassword,
      role: 'student',
      isActive: true
    });

    // Create sample vendor
    const vendorPassword = await bcrypt.hash('vendor123', 10);
    const vendor = await User.create({
      name: 'Vendor User',
      email: 'vendor@school.com',
      password: vendorPassword,
      role: 'vendor',
      isActive: true
    });

    const vendorProfile = await Vendor.create({
      user: vendor._id,
      businessName: 'School Cafeteria',
      counterNumber: 'C1',
      description: 'Main school cafeteria serving fresh and healthy meals',
      status: 'active',
      email: 'vendor@school.com',
      phoneNumber: '1234567890',
      location: 'Main Building, Ground Floor',
      openingTime: '08:00',
      closingTime: '16:00',
      bankDetails: {
        accountHolderName: 'Vendor Name',
        bankName: 'Sample Bank',
        accountNumber: '1234567890',
        ifscCode: 'SBIN0123456'
      },
      documents: {
        gstNumber: 'GST1234567890',
        fssaiLicense: 'FSSAI1234567890'
      }
    });

    // Create sample meals
    const meals = await Meal.create([
      {
        name: 'Healthy Breakfast',
        description: 'Eggs, toast, and fresh fruit',
        price: 5.99,
        category: 'Breakfast',
        vendor: vendorProfile._id,
        available: true,
        image: 'breakfast.jpg'
      },
      {
        name: 'Lunch Special',
        description: 'Rice, curry, and vegetables',
        price: 7.99,
        category: 'Lunch',
        vendor: vendorProfile._id,
        available: true,
        image: 'lunch.jpg'
      }
    ]);

    // Create default settings
    await Settings.create({
      user: admin._id,
      mealBookingDeadline: 2, // hours before meal time
      maxDailyTokens: 3,
      allowedBookingDays: 7,
      maintenanceMode: false
    });

    console.log('Database initialized with sample data');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initializeDb();
