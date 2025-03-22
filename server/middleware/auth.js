const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            logger.warn('No authentication token provided');
            return res.status(401).json({ 
                success: false,
                message: 'No authentication token, authorization denied' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId) {
            logger.warn('Invalid token structure');
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token' 
            });
        }

        // Find user
        const user = await User.findOne({ 
            _id: decoded.userId,
            'tokens.token': token
        }).select('-password -tokens');

        if (!user) {
            logger.warn(`User not found for token: ${token}`);
            return res.status(401).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Attach user and token to request
        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        logger.error(`Authentication error: ${err.message}`);
        
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: 'Token expired' 
            });
        }

        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token' 
            });
        }

        res.status(401).json({ 
            success: false,
            message: 'Authentication failed' 
        });
    }
};

module.exports = auth;
