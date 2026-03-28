const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const User = require('../models/User');
const Property = require('../models/Property');

// @desc    Get user's saved properties
// @route   GET /customer/saved-properties
// @access  Private (Customer)
router.get('/saved-properties', protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('savedProperties');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        
        res.status(200).json({
            success: true,
            data: user.savedProperties || []
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Save a property to wishlist
// @route   POST /customer/saved-properties/:id
// @access  Private (Customer)
router.post('/saved-properties/:id', protect, async (req, res, next) => {
    try {
        const propertyId = req.params.id;
        const user = await User.findById(req.user.id);
        
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Validate Property exists
        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

        if (!user.savedProperties) user.savedProperties = [];
        if (!user.savedProperties.includes(propertyId)) {
            user.savedProperties.push(propertyId);
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: 'Property saved successfully',
            data: user.savedProperties
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Remove a property from wishlist
// @route   DELETE /customer/saved-properties/:id
// @access  Private (Customer)
router.delete('/saved-properties/:id', protect, async (req, res, next) => {
    try {
        const propertyId = req.params.id;
        const user = await User.findById(req.user.id);
        
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.savedProperties) {
            user.savedProperties = user.savedProperties.filter(id => id.toString() !== propertyId);
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: 'Property removed from saved list',
            data: user.savedProperties || []
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
