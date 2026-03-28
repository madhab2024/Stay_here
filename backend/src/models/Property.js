const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    policies: {
        checkInTime: { type: String, default: '14:00' },
        checkOutTime: { type: String, default: '11:00' },
        cancellationPolicy: { type: String, default: 'flexible' },
        minStay: { type: Number, default: 1 },
        maxStay: { type: Number, default: 30 }
    },
    propertyType: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    rating: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    pointsOfInterest: [{
        type: String
    }],
    coverImage: {
        type: String
    },
    amenities: [{
        type: String
    }],
    rules: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    // Virtual or manual ref to rooms can be handled, but we'll use separate Room collection
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Reverse populate with virtuals
propertySchema.virtual('rooms', {
    ref: 'Room',
    localField: '_id',
    foreignField: 'propertyId',
    justOne: false
});

module.exports = mongoose.model('Property', propertySchema);
