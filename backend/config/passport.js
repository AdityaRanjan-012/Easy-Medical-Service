const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            if (user.role !== 'customer') {
              return done(null, false, { message: 'Only customers can use Google OAuth' });
            }
            return done(null, user);
          }

          // Check if the email already exists
          user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            if (user.role !== 'customer') {
              return done(null, false, { message: 'Email is registered with a different role' });
            }
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
          }

          // Create new customer with Google OAuth
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            role: 'customer',
          });
          await user.save();
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};