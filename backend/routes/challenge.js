const express = require('express');
const {
  startChallenge,
  resetChallenge,
  completeChallenge,
  getChallengeProgress
} = require('../controllers/challengeController');
const firebaseAuth = require('../middleware/firebaseAuth');

const router = express.Router();

// @route   POST /api/challenge/start
// @desc    Start a new 75 Hard challenge
// @access  Private
router.post('/start', firebaseAuth, startChallenge);

// @route   POST /api/challenge/reset
// @desc    Reset current challenge to day 1
// @access  Private
router.post('/reset', firebaseAuth, resetChallenge);

// @route   POST /api/challenge/complete
// @desc    Mark challenge as completed
// @access  Private
router.post('/complete', firebaseAuth, completeChallenge);

// @route   GET /api/challenge/progress
// @desc    Get challenge progress and statistics
// @access  Private
router.get('/progress', firebaseAuth, getChallengeProgress);

module.exports = router;
