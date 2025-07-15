const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken'); 
const nodemailer = require('nodemailer');
const crypto = require('crypto'); 
const passport = require('passport');


// route POST /api/signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Signup successful', userId: newUser._id });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// route POST /api/signin
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login successful',
      userId: user._id,
      token: token, 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('token'); 
  res.status(200).json({ message: 'Logout successful' });
});


// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      
      return res.status(404).json({ message: 'Email not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expiration = Date.now() + 3600000;

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiration;
    await user.save();

    

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `https://claimboard-game-frontend.onrender.com/reset-password/${token}`;
   

    await transporter.sendMail({
      to: user.email,
      from: 'yourappemail@gmail.com',
      subject: 'ClaimBoard - Password Reset',
      html: `<p>You requested a password reset.</p><p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });

    

    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error(' Forgot password error:', err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});



router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Token invalid or expired' });

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Reset failed', error: err.message });
  }
});

// Initiate Google Login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] ,  prompt: 'consent'})
);

// Callback URL that Google redirects to

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/signin', session: false }),
  (req, res) => {
    console.log('[Callback] Authenticated user:', req.user);

    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const redirectUrl = `https://claimboard-game-frontend.onrender.com/google-auth-success?token=${token}`;
    console.log('[Callback] Redirecting to:', redirectUrl);

    res.redirect(redirectUrl);
  }
);


module.exports = router;
