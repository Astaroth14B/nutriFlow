const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   POST api/subs/mock-subscribe
// @desc    Mock subscription success
// @access  Private
router.post('/mock-subscribe', auth, async (req, res) => {
    const { plan, method, details } = req.body;
    try {
        await User.findByIdAndUpdate(req.user.id, {
            'subscription.active': true,
            'subscription.plan': plan,
            'subscription.expiresAt': plan === 'yearly' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
        res.json({ success: true, msg: `Subscription successful via ${method}` });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/subs/webhook
// @desc    Handle Stripe Webhooks
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const plan = session.metadata.plan;

        await User.findByIdAndUpdate(userId, {
            'subscription.active': true,
            'subscription.plan': plan,
            'subscription.stripeCustomerId': session.customer,
            'subscription.stripeSubscriptionId': session.subscription,
            'subscription.expiresAt': plan === 'yearly' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
    }

    res.json({ received: true });
});

module.exports = router;
