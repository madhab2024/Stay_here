const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, HostApplication } = require('../models');
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
        const { email, password, roles, name, phone } = req.body;

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
            name: name || '',
            phone: phone || '',
            roles: roles || ['customer'], // Default role
        });

        // Generate token
        const token = generateToken(user._id, user.roles);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                roles: user.roles,
            },
        });

    } catch (error) {
        next(error);
    }
};

const admin = require('../config/firebase-admin');

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
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                roles: user.roles,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Google Login
// @route   POST /auth/google
// @access  Public
exports.googleLogin = async (req, res, next) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            const error = new Error('No Google token provided');
            error.statusCode = 400;
            throw error;
        }

        // Verify Firebase ID Token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { email, name, picture, uid } = decodedToken;

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                name: name || '',
                roles: ['customer'],
                avatar: picture || '',
                firebaseUid: uid,
                // passwordHash is not required because firebaseUid is present
            });
            logger.info(`New user created via Google: ${email}`);
        } else {
            // Update user info if missing
            let updated = false;
            if (!user.firebaseUid) {
                user.firebaseUid = uid;
                updated = true;
            }
            if (!user.avatar && picture) {
                user.avatar = picture;
                updated = true;
            }
            if (updated) await user.save();
        }

        // Generate JWT
        const token = generateToken(user._id, user.roles);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                roles: user.roles,
            },
        });

    } catch (error) {
        logger.error(`Google Auth Error: ${error.message}`);
        res.status(401).json({
            success: false,
            message: 'Invalid Google token'
        });
    }
};

// @desc    Update user profile
// @route   PUT /auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                roles: updatedUser.roles,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Submit Host Application
// @route   POST /auth/become-host
// @access  Private
exports.becomeHost = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // Check for existing application
        const existingApplication = await HostApplication.findOne({ userId: user._id });
        if (existingApplication) {
            if (existingApplication.status === 'pending') {
                const error = new Error('You already have a pending application. Please wait for admin approval.');
                error.statusCode = 400;
                throw error;
            }
            if (existingApplication.status === 'approved') {
                const error = new Error('Your application has already been approved. You are already a host.');
                error.statusCode = 400;
                throw error;
            }
            // If rejected, we allow them to re-apply (delete old one or update)
            if (existingApplication.status === 'rejected') {
                await HostApplication.findByIdAndDelete(existingApplication._id);
            }
        }

        // Get file URLs
        const files = req.files || {};
        const profilePhoto = files.profilePhoto ? files.profilePhoto[0].path : null;
        const idFrontImage = files.idFrontImage ? files.idFrontImage[0].path : null;
        const idBackImage = files.idBackImage ? files.idBackImage[0].path : null;
        const selfieWithId = files.selfieWithId ? files.selfieWithId[0].path : null;

        // Create Host Application with pending status
        const application = await HostApplication.create({
            userId: user._id,
            ...req.body,
            profilePhoto,
            idFrontImage,
            idBackImage,
            selfieWithId,
            status: 'pending' // Wait for admin approval
        });

        // Don't upgrade user role until admin approves

        res.status(200).json({
            success: true,
            message: 'Application submitted successfully. Please wait for admin approval.',
            data: {
                applicationId: application._id,
                status: application.status
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Host Application Status
// @route   GET /auth/host-status
// @access  Private
exports.getHostStatus = async (req, res, next) => {
    try {
        const application = await HostApplication.findOne({ userId: req.user.id })
            .sort({ createdAt: -1 }); // Get the latest application

        if (!application) {
            return res.status(200).json({
                success: true,
                data: {
                    hasApplication: false,
                    status: null
                }
            });
        }

        res.status(200).json({
            success: true,
            data: {
                hasApplication: true,
                status: application.status,
                applicationId: application._id,
                submittedAt: application.createdAt,
                updatedAt: application.updatedAt
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user info
// @route   GET /auth/me
// @access  Private
exports.getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-passwordHash');

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};
