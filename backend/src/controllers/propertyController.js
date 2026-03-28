const { Property } = require('../models');

// @desc    Create a new property
// @route   POST /properties
// @access  Private (Owner)
exports.createProperty = async (req, res, next) => {
    try {
        const { name, location, description, policies, amenities, rules } = req.body;

        const property = await Property.create({
            ownerId: req.user.id,
            name,
            location,
            description,
            policies,
            amenities,
            rules,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            data: property
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user's properties
// @route   GET /properties/mine
// @access  Private (Owner)
exports.getMyProperties = async (req, res, next) => {
    try {
        const properties = await Property.find({ ownerId: req.user.id });

        res.status(200).json({
            success: true,
            count: properties.length,
            data: properties
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all properties (Public - Approved only)
// @route   GET /properties
// @access  Public
exports.getPublicProperties = async (req, res, next) => {
    try {
        const { random, limit } = req.query;
        let properties;

        if (random === 'true') {
            const size = limit ? parseInt(limit) : 8;
            properties = await Property.aggregate([
                { $match: { status: 'approved' } },
                { $sample: { size } }
            ]);
            // Populate owner and rooms
            properties = await Property.populate(properties, [
                { path: 'ownerId', select: 'email' },
                { path: 'rooms' }
            ]);
        } else {
            let queryList = Property.find({ status: 'approved' })
                .populate('ownerId', 'email')
                .populate('rooms');
                
            if (limit) queryList = queryList.limit(parseInt(limit));
            properties = await queryList;
        }

        res.status(200).json({
            success: true,
            count: properties.length,
            data: properties
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all properties (Admin)
// @route   GET /admin/properties
// @access  Private (Admin)
exports.getAllPropertiesAdmin = async (req, res, next) => {
    try {
        const properties = await Property.find()
            .populate('ownerId', 'email roles');

        res.status(200).json({
            success: true,
            count: properties.length,
            data: properties
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Approve property
// @route   PATCH /admin/properties/:id/approve
// @access  Private (Admin)
exports.approveProperty = async (req, res, next) => {
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { status: 'approved' },
            { new: true, runValidators: true }
        );

        if (!property) {
            const error = new Error('Property not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: property
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reject property
// @route   PATCH /admin/properties/:id/reject
// @access  Private (Admin)
exports.rejectProperty = async (req, res, next) => {
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { status: 'rejected' },
            { new: true, runValidators: true }
        );

        if (!property) {
            const error = new Error('Property not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: property
        });
    } catch (error) {
        next(error);
    }
};
