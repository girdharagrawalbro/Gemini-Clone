const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('../config/passport'); // make sure passport strategy is registered

const router = express.Router();
const CLIENT_URL = process.env.CLIENT_URL || 'https://gemini-girdhar.netlify.app';

// Start Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback URL that Google redirects to
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/sign-in' }),
  (req, res) => {
    try {
      const user = req.user;

      // Create JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '24h' }
      );

      // Redirect to frontend with token (simple approach)
      const redirectUrl = `${CLIENT_URL}/?token=${token}`;
      return res.redirect(redirectUrl);
    } catch (error) {
      console.error('OAuth callback error:', error);
      return res.redirect('/sign-in');
    }
  }
);

module.exports = router;
