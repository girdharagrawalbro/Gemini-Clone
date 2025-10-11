const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Allow configuring the full callback URL via environment variable to avoid redirect_uri_mismatch
const callbackFromEnv = process.env.GOOGLE_CALLBACK_URL;
const backendUrl = process.env.BACKEND_URL;
const defaultCallback = callbackFromEnv || (backendUrl ? `${backendUrl.replace(/\/$/, '')}/api/auth/google/callback` : 'http://localhost:5000/api/auth/google/callback');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: defaultCallback
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            return done(null, user);
        }

        // Check if user exists with the same email
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
            // User exists with same email, link Google account
            user.googleId = profile.id;
            user.name = profile.displayName;
            user.profilePicture = profile.photos[0]?.value;
            await user.save();
            return done(null, user);
        }

        // Create new user
        user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0]?.value,
            password: 'google-oauth' // Placeholder password for Google users
        });

        await user.save();
        return done(null, user);
    } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;