const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// @route   POST api/orders
// @desc    Place a new order
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const newOrder = new Order({
            user: req.user.id,
            meals: req.body.meals,
            totalAmount: req.body.totalAmount,
            address: req.body.address
        });
        const order = await newOrder.save();
        res.json(order);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// @route   GET api/orders
// @desc    Get user orders
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('meals.meal');
        res.json(orders);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
