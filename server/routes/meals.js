const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const auth = require('../middleware/auth');

// @route   GET api/meals
// @desc    Get all active meals
router.get('/', async (req, res) => {
    try {
        const meals = await Meal.find({ isAvailable: true });
        res.json(meals);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// @route   GET api/meals/:id
// @desc    Get meal by ID
router.get('/:id', async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id);
        if (!meal) return res.status(404).json({ msg: 'Meal not found' });
        res.json(meal);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// @route   POST api/meals
// @desc    Create meal (Admin only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        const newMeal = new Meal(req.body);
        const meal = await newMeal.save();
        res.json(meal);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/meals/:id
// @desc    Delete meal (Admin only)
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        const meal = await Meal.findById(req.params.id);
        if (!meal) return res.status(404).json({ msg: 'Meal not found' });
        await meal.deleteOne();
        res.json({ msg: 'Meal removed' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
