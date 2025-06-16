const express = require('express');
const {
  getCurrentDay,
  updateTasks,
  getDayHistory
} = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { validateTaskUpdate, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/tasks/current
// @desc    Get current day tasks
// @access  Private
router.get('/current', auth, getCurrentDay);

// @route   PUT /api/tasks/update
// @desc    Update task completion status
// @access  Private
router.put('/update', auth, validateTaskUpdate, handleValidationErrors, updateTasks);

// @route   GET /api/tasks/history
// @desc    Get task history with pagination
// @access  Private
router.get('/history', auth, getDayHistory);

module.exports = router;
