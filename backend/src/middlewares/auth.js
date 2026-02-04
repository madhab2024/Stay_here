const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { User } = require('../models');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, config.jwtSecret);

            // Get user from the token (exclude password)
            req.user = await User.findById(decoded.id).select('-passwordHash');

            if (!req.user) {
                const error = new Error('User not found');
                error.statusCode = 401;
                throw error;
            }

            next();
        } catch (error) {
            const err = new Error('Not authorized, token failed');
            err.statusCode = 401;
            next(err);
        }
    }

    if (!token) {
        const error = new Error('Not authorized, no token');
        error.statusCode = 401;
        next(error);
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
             const error = new Error('User not found');
             error.statusCode = 401;
             return next(error);
        }

        if (!req.user.roles || !req.user.roles.some(role => roles.includes(role))) {
            const error = new Error(`User role ${req.user.roles} is not authorized to access this route`);
            error.statusCode = 403;
            return next(error);
        }
        next();
    };
};

module.exports = { protect, authorize };
