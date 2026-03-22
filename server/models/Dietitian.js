const mongoose = require('mongoose');

const dietitianSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Links to a User with role 'dietitian'
    fullName: { type: String, required: true },
    credentials: { type: String, required: true }, // e.g., 'RD, MSc in Nutrition'
    bio: { type: String, required: true },
    photo: { type: String }, // URL to photo
    specialties: [String],
    availableSlots: [Date],
    contactEmail: { type: String }
});

module.exports = mongoose.model('Dietitian', dietitianSchema);
