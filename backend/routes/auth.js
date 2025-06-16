const express = require('express');
const { auth } = require('../config/firebase-admin');
const User = require('../models/User');
const firebaseAuth = require('../middleware/firebaseAuth');

const router = express.Router();

// @route   POST /api/auth/verify-token
// @desc    Verify Firebase token and get/create user
// @access  Public
router.post('/verify-token', async (req, res) => {
  try {
    console.log('🔄 Verifying Firebase token...');
    const { idToken } = req.body;
    
    if (!idToken) {
      console.log('❌ No ID token provided');
      return res.status(400).json({ message: 'ID token is required' });
    }

    // Verify the Firebase token
    const decodedToken = await auth.verifyIdToken(idToken);
    console.log('✅ Firebase token verified for user:', decodedToken.email);
    
    // Find or create user
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      console.log('🔄 Creating new user in database...');
      user = new User({
        firebaseUid: decodedToken.uid,
        name: decodedToken.name || 'User',
        email: decodedToken.email,
        profileInfo: {}
      });
      await user.save();
      console.log('✅ New user created in database');
    } else {
      console.log('✅ Existing user found in database');
    }

    res.json({
      success: true,
      message: 'Token verified successfully',
      user
    });
  } catch (error) {
    console.error('❌ Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', firebaseAuth, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', firebaseAuth, async (req, res) => {
  try {
    const { name, profileInfo } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, profileInfo },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
