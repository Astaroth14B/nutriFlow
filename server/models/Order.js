const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    meals: [{
        meal: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' },
        quantity: { type: Number, default: 1 },
        customizations: { type: String } // e.g., 'no onions'
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    deliveryDate: Date,
    address: {
        street: String,
        city: String,
        state: String,
        zip: String
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
