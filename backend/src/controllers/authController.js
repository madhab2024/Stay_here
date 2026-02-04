const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const config = require('../config/env');
const logger = require('../utils/logger');

// Generate JWT Token
const generateToken = (id, roles) => {
    return jwt.sign({ id, roles }, config.jwtSecret, {
        expiresIn: config.jwtExpire,
    });
};

// @desc    Register a new user
// @route   POST /auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { email, password, roles } = req.body;

        // Check availability
        const userExists = await User.findOne({ email });
        if (userExists) {
            const error = new Error('User already exists');
            error.statusCode = 400;
            throw error;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            email,
            passwordHash,
            roles: roles || ['customer'], // Default role
        });

        // Generate token
        const token = generateToken(user._id, user.roles);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                roles: user.roles,
            },
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate
        if (!email || !password) {
            const error = new Error('Please provide email and password');
            error.statusCode = 400;
            throw error;
        }

        // Check for user
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        // Generate token
        const token = generateToken(user._id, user.roles);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                roles: user.roles,
            },
        });
    } catch (error) {
        next(error);
    }
};
