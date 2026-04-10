const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    passwordHash: {
        type: String,
        required: function() {
            // Only require password if user is not using social login
            return !this.firebaseUid;
        }
    },
    avatar: {
        type: String
    },
    firebaseUid: {
        type: String,
        unique: true,
        sparse: true // Allow nulls for email/password users
    },
    roles: {
        type: [String],
        default: ['customer'], // customer, owner, admin
        enum: ['customer', 'owner', 'admin']
    },
    savedProperties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
