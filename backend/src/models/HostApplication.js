const mongoose = require('mongoose');

const hostApplicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Step 1: Basic Identity
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    profilePhoto: { type: String }, // Cloudinary URL

    // Step 2: Government ID
    idType: { 
        type: String, 
        required: true,
        enum: ['aadhaar', 'pan', 'passport', 'driving_license']
    },
    idNumber: { type: String, required: true },
    idFrontImage: { type: String, required: true }, // Cloudinary URL
    idBackImage: { type: String, required: true }, // Cloudinary URL
    selfieWithId: { type: String }, // Cloudinary URL

    // Step 3: Payment & Tax
    accountHolderName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    bankName: { type: String, required: true },
    upiId: { type: String },
    panNumber: { type: String, required: true },

    // Step 4: Address
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },

    // Step 5: Legal
    termsAccepted: { type: Boolean, required: true, default: false },
    policiesAccepted: { type: Boolean, required: true, default: false },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending' // Or 'approved' if auto-approval
    },
    rejectionReason: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('HostApplication', hostApplicationSchema);
