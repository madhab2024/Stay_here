const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');

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

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                const err = new Error('User not found');
                err.statusCode = 401;
                return next(err);
            }

            next();
        } catch (error) {
            const err = new Error('Not authorized, token failed');
            err.statusCode = 401;
            next(err);
        }
    }

    if (!token) {
        const err = new Error('Not authorized, no token');
        err.statusCode = 401;
        next(err);
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.roles.includes('admin')) {
        next();
    } else {
        const err = new Error('Not authorized as an admin');
        err.statusCode = 403;
        next(err);
    }
};

const owner = (req, res, next) => {
    if (req.user && (req.user.roles.includes('owner') || req.user.roles.includes('admin'))) {
        next();
    } else {
        const err = new Error('Not authorized as an owner');
        err.statusCode = 403;
        next(err);
    }
};

// Generic authorize function that accepts roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            const err = new Error('Not authorized');
            err.statusCode = 401;
            return next(err);
        }

        const hasRole = roles.some(role => req.user.roles.includes(role));
        if (!hasRole) {
            const err = new Error(`Not authorized - requires role: ${roles.join(' or ')}`);
            err.statusCode = 403;
            return next(err);
        }
        next();
    };
};

module.exports = { protect, admin, owner, authorize };
