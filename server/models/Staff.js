const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    role: { type: String, enum: ['Doctor', 'Chef'], required: true },
    credentials: { type: String },
    bio: { type: String },
    specialties: [String],
    photo: { type: String },
    certificateUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Staff', staffSchema);
