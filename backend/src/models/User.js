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
        required: true
    },
    roles: {
        type: [String],
        default: ['customer'], // customer, owner, admin
        enum: ['customer', 'owner', 'admin']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
