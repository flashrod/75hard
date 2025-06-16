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

    // Check if current day can be accessed (previous day must be completed)
    let canAccessCurrentDay = true;
    if (user.currentChallengeDay > 1) {
      const prevDay = await ChallengeDay.findOne({ 
        userId, 
        dayNumber: user.currentChallengeDay - 1 
      });
      canAccessCurrentDay = prevDay && prevDay.dayCompleted;
    }

    res.json({
      success: true,
      currentDay,
      user: user,
      challengeStatus: user.challengeStatus,
      canAccessCurrentDay
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

    // Check if user can access this day (previous day must be completed)
    if (dayNumber > 1) {
      const prevDay = await ChallengeDay.findOne({ 
        userId, 
        dayNumber: dayNumber - 1 
      });
      if (!prevDay || !prevDay.dayCompleted) {
        return res.status(403).json({ 
          message: `Complete day ${dayNumber - 1} before accessing day ${dayNumber}` 
        });
      }
    }

    // Only allow updating current day or previous days
    if (dayNumber > user.currentChallengeDay) {
      return res.status(403).json({ 
        message: `Cannot access future days. Complete day ${user.currentChallengeDay} first.` 
      });
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
      // Don't allow updating completed days
      if (challengeDay.dayCompleted) {
        return res.status(403).json({ 
          message: `Day ${dayNumber} is already completed and cannot be modified.` 
        });
      }
      challengeDay.tasks = { ...challengeDay.tasks, ...tasks };
    }

    await challengeDay.save();

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

const completeDay = async (req, res) => {
  try {
    const { dayNumber } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    
    if (user.challengeStatus !== 'active') {
      return res.status(400).json({ message: 'No active challenge found' });
    }

    // Only allow completing current day
    if (dayNumber !== user.currentChallengeDay) {
      return res.status(403).json({ 
        message: `Can only complete current day (${user.currentChallengeDay})` 
      });
    }

    const challengeDay = await ChallengeDay.findOne({ userId, dayNumber });
    
    if (!challengeDay) {
      return res.status(404).json({ message: 'Day not found' });
    }

    // Check if all tasks are completed
    if (!challengeDay.allTasksCompleted) {
      return res.status(400).json({ 
        message: 'Complete all tasks before finishing the day' 
      });
    }

    // Mark day as completed
    challengeDay.dayCompleted = true;
    challengeDay.completedAt = new Date();
    await challengeDay.save();

    // Move to next day or complete challenge
    if (dayNumber < 75) {
      await User.findByIdAndUpdate(userId, {
        currentChallengeDay: dayNumber + 1
      });
    } else {
      // Complete the entire challenge
      await User.findByIdAndUpdate(userId, {
        challengeStatus: 'completed',
        $inc: { completedChallenges: 1 }
      });
    }

    res.json({
      success: true,
      message: dayNumber === 75 ? 'Challenge completed! 🎉' : `Day ${dayNumber} completed! Moving to day ${dayNumber + 1}`,
      challengeDay,
      challengeCompleted: dayNumber === 75
    });
  } catch (error) {
    console.error('Complete day error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getDayHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 100 } = req.query;

    const challengeDays = await ChallengeDay.find({ userId })
      .sort({ dayNumber: 1 })
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
  completeDay,
  getDayHistory
};
