const express = require('express');
const {
  getCurrentDay,
  updateTasks,
  completeDay,
  getDayHistory
} = require('../controllers/taskController');
const firebaseAuth = require('../middleware/firebaseAuth');

const router = express.Router();

// @route   GET /api/tasks/current
// @desc    Get current day tasks
// @access  Private
router.get('/current', firebaseAuth, getCurrentDay);

// @route   PUT /api/tasks/update
// @desc    Update task completion status
// @access  Private
router.put('/update', firebaseAuth, updateTasks);

// @route   POST /api/tasks/complete-day
// @desc    Complete current day and move to next
// @access  Private
router.post('/complete-day', firebaseAuth, completeDay);

// @route   GET /api/tasks/history
// @desc    Get task history with pagination
// @access  Private
router.get('/history', firebaseAuth, getDayHistory);

module.exports = router;
