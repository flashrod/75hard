const ChallengeDay = require('../models/ChallengeDay');
const User = require('../models/User');

const getCurrentDay = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has an active challenge
    if (user.challengeStatus !== 'active') {
      return res.status(200).json({
        success: true,
        message: 'No active challenge',
        currentDay: null,
        user: user,
        challengeStatus: user.challengeStatus
      });
    }

    let currentDay = await ChallengeDay.findOne({
      userId,
      dayNumber: user.currentChallengeDay
    });

    // If current day doesn't exist, create it
    if (!currentDay) {
      currentDay = new ChallengeDay({
        userId,
        dayNumber: user.currentChallengeDay,
        date: new Date()
      });
      await currentDay.save();
    }

    res.json({
      success: true,
      currentDay,
      user: user,
      challengeStatus: user.challengeStatus
    });
  } catch (error) {
    console.error('Get current day error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTasks = async (req, res) => {
  try {
    const { dayNumber, tasks } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    
    if (user.challengeStatus !== 'active') {
      return res.status(400).json({ message: 'No active challenge found' });
    }

    let challengeDay = await ChallengeDay.findOne({ userId, dayNumber });
    
    if (!challengeDay) {
      challengeDay = new ChallengeDay({
        userId,
        dayNumber,
        date: new Date(),
        tasks
      });
    } else {
      challengeDay.tasks = { ...challengeDay.tasks, ...tasks };
    }

    await challengeDay.save();

    // Check if all tasks are completed
    if (challengeDay.allTasksCompleted) {
      // Move to next day if not day 75
      if (dayNumber < 75) {
        await User.findByIdAndUpdate(userId, {
          currentChallengeDay: dayNumber + 1
        });
      } else {
        // Complete the challenge
        await User.findByIdAndUpdate(userId, {
          challengeStatus: 'completed',
          $inc: { completedChallenges: 1 }
        });
      }
    }

    res.json({
      success: true,
      message: 'Tasks updated successfully',
      challengeDay
    });
  } catch (error) {
    console.error('Update tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getDayHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const challengeDays = await ChallengeDay.find({ userId })
      .sort({ dayNumber: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('tasks.progressPhoto.photoId');

    const total = await ChallengeDay.countDocuments({ userId });

    res.json({
      success: true,
      challengeDays,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Get day history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCurrentDay,
  updateTasks,
  getDayHistory
};
// This code defines the taskController for managing challenge days and tasks in the 75 Hard Challenge application.