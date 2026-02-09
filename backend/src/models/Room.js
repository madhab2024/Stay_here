const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    type: {
        type: String,
        required: true,
        trim: true // e.g., "Deluxe Suite"
    },
    capacity: {
        adults: { type: Number, default: 2 },
        children: { type: Number, default: 0 },
        total: { type: Number, default: 2 } 
    },
    count: {
        type: Number,
        required: true, 
        default: 1
    },
    basePrice: {
        type: Number,
        required: true,
        min: 0
    },
    amenities: [{
        type: String
    }],
    extraCharges: {
        extraBed: { type: Number, default: 0 },
        cleaningFee: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);
