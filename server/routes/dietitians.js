const express = require('express');
const router = express.Router();
const Dietitian = require('../models/Dietitian');
const auth = require('../middleware/auth');

// @route   GET api/dietitians
// @desc    Get all dietitians
router.get('/', async (req, res) => {
    try {
        const dietitians = await Dietitian.find().populate('userId', 'name email');
        res.json(dietitians);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// @route   POST api/dietitians
// @desc    Create dietitian profile (Admin only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        const newDietitian = new Dietitian(req.body);
        const dietitian = await newDietitian.save();
        res.json(dietitian);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
