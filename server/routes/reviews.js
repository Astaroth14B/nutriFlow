const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// @route   POST api/reviews
// @desc    Add a review for a meal
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const newReview = new Review({
            user: req.user.id,
            meal: req.body.mealId,
            rating: req.body.rating,
            comment: req.body.comment
        });
        const review = await newReview.save();
        res.json(review);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// @route   GET api/reviews/:mealId
// @desc    Get reviews for a meal
router.get('/:mealId', async (req, res) => {
    try {
        const reviews = await Review.find({ meal: req.params.mealId }).populate('user', 'name');
        res.json(reviews);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
