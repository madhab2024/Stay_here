const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Please add a rating between 1 and 5'],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: [true, 'Please add a comment'],
        trim: true,
        maxlength: 500
    }
}, {
    timestamps: true
});

// Prevent user from submitting more than one review per property
reviewSchema.index({ propertyId: 1, userId: 1 }, { unique: true });

// Static method to get avg rating and save
reviewSchema.statics.getAverageRating = async function(propertyId) {
    const obj = await this.aggregate([
        {
            $match: { propertyId: propertyId }
        },
        {
            $group: {
                _id: '$propertyId',
                averageRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 }
            }
        }
    ]);

    try {
        if (obj[0]) {
            await mongoose.model('Property').findByIdAndUpdate(propertyId, {
                rating: obj[0].averageRating,
                reviewCount: obj[0].reviewCount
            });
        } else {
            await mongoose.model('Property').findByIdAndUpdate(propertyId, {
                rating: 0,
                reviewCount: 0
            });
        }
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageRating after save
reviewSchema.post('save', function() {
    this.constructor.getAverageRating(this.propertyId);
});

// Call getAverageRating before remove
reviewSchema.pre('remove', function() {
    this.constructor.getAverageRating(this.propertyId);
});

module.exports = mongoose.model('Review', reviewSchema);
