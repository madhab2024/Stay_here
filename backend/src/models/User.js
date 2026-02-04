const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
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
