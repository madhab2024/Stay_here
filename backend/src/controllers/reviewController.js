const { Review, Property, Booking } = require('../models');

// @desc    Add a review
// @route   POST /reviews
// @access  Private
exports.addReview = async (req, res, next) => {
    try {
        const { propertyId, rating, comment } = req.body;

        // Check if property exists
        const property = await Property.findById(propertyId);
        if (!property) {
            const error = new Error('Property not found');
            error.statusCode = 404;
            throw error;
        }

        // Optional: Check if user has booked this property before allowing review
        const hasBooked = await Booking.findOne({ 
            userId: req.user.id, 
            propertyId,
            status: 'confirmed'
        });

        if (!hasBooked) {
            const error = new Error('You can only review properties you have booked');
            error.statusCode = 403;
            throw error;
        }

        const review = await Review.create({
            propertyId,
            userId: req.user.id,
            rating,
            comment
        });

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        if (error.code === 11000) {
            const err = new Error('You have already reviewed this property');
            err.statusCode = 400;
            return next(err);
        }
        next(error);
    }
};

// @desc    Get reviews for a property
// @route   GET /reviews/property/:propertyId
// @access  Public
exports.getPropertyReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ propertyId: req.params.propertyId })
            .populate('userId', 'name avatar')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        next(error);
    }
};
