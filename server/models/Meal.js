const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    ingredients: [String],
    tags: [String], // e.g., 'vegan', 'keto', 'high-protein'
    price: { type: Number, required: true },
    category: { type: String },
    isAvailable: { type: Boolean, default: true }
});

module.exports = mongoose.model('Meal', mealSchema);
