import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('/')
);

router.get('/logout', (req, res) => {
//   req.logout();
  res.send('Logged out');
});

export default router;  // Ensure default export
