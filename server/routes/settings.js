const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get settings
router.get('/', auth, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({
        schoolName: 'School Name',
        contactEmail: 'contact@school.com',
        contactPhone: '1234567890',
        allowParentRegistration: true,
        allowVendorRegistration: true,
        maxDailySpendLimit: 1000,
        notificationEnabled: true
      });
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update settings (admin only)
router.put('/', [auth, admin], async (req, res) => {
  try {
    const {
      schoolName,
      contactEmail,
      contactPhone,
      allowParentRegistration,
      allowVendorRegistration,
      maxDailySpendLimit,
      notificationEnabled
    } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({
        schoolName,
        contactEmail,
        contactPhone,
        allowParentRegistration,
        allowVendorRegistration,
        maxDailySpendLimit,
        notificationEnabled
      });
    } else {
      settings.schoolName = schoolName;
      settings.contactEmail = contactEmail;
      settings.contactPhone = contactPhone;
      settings.allowParentRegistration = allowParentRegistration;
      settings.allowVendorRegistration = allowVendorRegistration;
      settings.maxDailySpendLimit = maxDailySpendLimit;
      settings.notificationEnabled = notificationEnabled;
    }

    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
