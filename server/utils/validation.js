const Joi = require('joi');

// Validate meal data
const validateMeal = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().required().min(10).max(500),
    price: Joi.number().required().min(0),
    image: Joi.string().uri(),
    category: Joi.string().required().valid(
      'Breakfast',
      'Lunch',
      'Snacks',
      'Beverages'
    ),
    isVegetarian: Joi.boolean(),
    available: Joi.boolean(),
    availableQuantity: Joi.number().min(0),
    nutritionInfo: Joi.object({
      calories: Joi.number(),
      protein: Joi.number(),
      carbohydrates: Joi.number(),
      fat: Joi.number(),
      allergens: Joi.array().items(Joi.string())
    }),
    preparationTime: Joi.number(),
    isSpecial: Joi.boolean(),
    availableDays: Joi.array().items(
      Joi.string().valid(
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      )
    )
  });

  return schema.validate(data);
};

// Validate order data
const validateOrder = (data) => {
  const schema = Joi.object({
    mealId: Joi.string().required(),
    quantity: Joi.number().required().min(1).max(5),
    pickupTime: Joi.string().required().valid('lunch', 'snacks')
  });

  return schema.validate(data);
};

// Validate settings data
const validateSettings = (data) => {
  const schema = Joi.object({
    notifications: Joi.object({
      email: Joi.boolean(),
      push: Joi.boolean(),
      orderUpdates: Joi.boolean(),
      eventReminders: Joi.boolean()
    }),
    preferences: Joi.object({
      language: Joi.string().valid('en', 'es', 'fr', 'de'),
      theme: Joi.string().valid('light', 'dark', 'system'),
      timezone: Joi.string()
    }),
    security: Joi.object({
      twoFactorAuth: Joi.boolean(),
      loginNotifications: Joi.boolean()
    }),
    wallet: Joi.object({
      lowBalanceAlert: Joi.boolean(),
      lowBalanceThreshold: Joi.number().min(0),
      autoRecharge: Joi.object({
        enabled: Joi.boolean(),
        threshold: Joi.number().min(0),
        amount: Joi.number().min(0)
      })
    }),
    parentalControls: Joi.object({
      spendingLimit: Joi.boolean(),
      dailyLimit: Joi.number().min(0),
      restrictedItems: Joi.boolean(),
      restrictedCategories: Joi.array().items(
        Joi.string().valid('Fast Food', 'Beverages', 'Desserts')
      ),
      allowedVendors: Joi.array().items(Joi.string())
    }),
    accessibility: Joi.object({
      fontSize: Joi.string().valid('small', 'medium', 'large'),
      highContrast: Joi.boolean(),
      screenReader: Joi.boolean()
    }),
    privacy: Joi.object({
      shareUsageData: Joi.boolean(),
      shareLocation: Joi.boolean()
    })
  });

  return schema.validate(data);
};

// Validate vendor data
const validateVendor = (data) => {
  const schema = Joi.object({
    businessName: Joi.string().required().min(3).max(100),
    description: Joi.string().required().min(10).max(500),
    image: Joi.string().uri(),
    phoneNumber: Joi.string().required().pattern(/^\+?[\d\s-]+$/),
    email: Joi.string().required().email(),
    location: Joi.string().required(),
    categories: Joi.array().items(
      Joi.string().valid(
        'Breakfast',
        'Lunch',
        'Snacks',
        'Beverages',
        'South Indian',
        'North Indian',
        'Chinese',
        'Fast Food',
        'Healthy Food',
        'Desserts'
      )
    ),
    services: Joi.array().items(
      Joi.string().valid('Dine In', 'Takeaway', 'Delivery')
    ),
    openingTime: Joi.string().required(),
    closingTime: Joi.string().required(),
    counterNumber: Joi.string().required(),
    documents: Joi.object({
      gstNumber: Joi.string().required(),
      fssaiLicense: Joi.string().required(),
      panCard: Joi.string(),
      addressProof: Joi.string()
    }),
    bankDetails: Joi.object({
      bankName: Joi.string().required(),
      accountNumber: Joi.string().required(),
      ifscCode: Joi.string().required(),
      accountHolderName: Joi.string().required()
    })
  });

  return schema.validate(data);
};

// Validate transaction data
const validateTransaction = (data) => {
  const schema = Joi.object({
    type: Joi.string().required().valid('credit', 'debit'),
    amount: Joi.number().required().min(0),
    description: Joi.string().required(),
    reference: Joi.string().required()
  });

  return schema.validate(data);
};

module.exports = {
  validateMeal,
  validateOrder,
  validateSettings,
  validateVendor,
  validateTransaction
};
