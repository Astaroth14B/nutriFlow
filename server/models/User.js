const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profilePicture: { type: String, default: '' },
    dietaryPreferences: {
        goals: [String],
        restrictions: [String],
        preferences: [String],
        allergies: [String],
        height: String,
        weight: String
    },
    subscription: {
        active: { type: Boolean, default: false },
        plan: { type: String, enum: ['monthly', 'yearly', 'none'], default: 'none' },
        stripeCustomerId: String,
        stripeSubscriptionId: String,
        expiresAt: Date
    },
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
