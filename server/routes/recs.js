const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST api/recs/preferences
// @desc    Save user dietary preferences
// @access  Private
router.post('/preferences', auth, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.id, {
            dietaryPreferences: req.body
        }, { new: true });
        res.json(user.dietaryPreferences);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// @route   GET api/recs/suggest
// @desc    Get meal recommendations
// @access  Private
router.get('/suggest', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { restrictions, goals } = user.dietaryPreferences;

        // Simple logic: Find meals that don't have restricted tags and match some goals
        let query = { isAvailable: true };
        if (restrictions && restrictions.length > 0) {
            query.tags = { $nin: restrictions };
        }

        const meals = await Meal.find(query).limit(6);
        res.json(meals);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
