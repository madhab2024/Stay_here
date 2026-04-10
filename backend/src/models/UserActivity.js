const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property' // Adjusted to common 'Property' model name in this project
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId
    },
    actionType: {
        type: String,
        enum: ["view", "click", "search", "wishlist", "booking", "cancel", "compare"],
        required: [true, 'Action type is required']
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    duration: {
        type: Number, // in seconds
        default: 0
    },
    searchQuery: {
        location: String,
        priceRange: {
            min: Number,
            max: Number
        },
        dates: {
            checkIn: Date,
            checkOut: Date
        },
        guests: Number
    },
    device: {
        type: String
    },
    location: {
        type: String // IP based or user provided location string
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed // Flexible JSON for extra data like source, referral, etc.
    }
}, {
    timestamps: true
});

// Indexing for faster recommendation queries
userActivitySchema.index({ userId: 1, actionType: 1, timestamp: -1 });
userActivitySchema.index({ hotelId: 1, actionType: 1 });

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

module.exports = UserActivity;
