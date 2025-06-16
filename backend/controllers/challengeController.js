const User = require('../models/User');
const ChallengeDay = require('../models/ChallengeDay');

const startChallenge = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Update user status
    const user = await User.findByIdAndUpdate(
      userId,
      {
        challengeStatus: 'active',
        currentChallengeDay: 1,
        challengeStartDate: new Date()
      },
      { new: true }
    );

    // Create first day
    const firstDay = new ChallengeDay({
      userId,
      dayNumber: 1,
      date: new Date()
    });

    await firstDay.save();

    res.json({
      success: true,
      message: 'Challenge started successfully!',
      user,
      currentDay: firstDay
    });
  } catch (error) {
    console.error('Start challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const resetChallenge = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Update user - increment reset count and reset to day 1
    const user = await User.findByIdAndUpdate(
      userId,
      {
        currentChallengeDay: 1,
        challengeStartDate: new Date(),
        $inc: { totalResets: 1 }
      },
      { new: true }
    );

    // Create new day 1
    const newDay = new ChallengeDay({
      userId,
      dayNumber: 1,
      date: new Date()
    });

    await newDay.save();

    res.json({
      success: true,
      message: 'Challenge reset to Day 1',
      user,
      currentDay: newDay
    });
  } catch (error) {
    console.error('Reset challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const completeChallenge = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByIdAndUpdate(
      userId,
      {
        challengeStatus: 'completed',
        $inc: { completedChallenges: 1 }
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Congratulations! You completed the 75 Hard Challenge!',
      user
    });
  } catch (error) {
    console.error('Complete challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getChallengeProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    const challengeDays = await ChallengeDay.find({ userId })
      .sort({ dayNumber: 1 })
      .populate('tasks.progressPhoto.photoId');

    const completedDays = challengeDays.filter(day => day.allTasksCompleted).length;
    const currentStreak = user.currentChallengeDay;
    const totalDays = challengeDays.length;

    res.json({
      success: true,
      progress: {
        user,
        challengeDays,
        stats: {
          completedDays,
          currentStreak,
          totalDays,
          completionRate: totalDays > 0 ? (completedDays / totalDays * 100).toFixed(1) : 0
        }
      }
    });
  } catch (error) {
    console.error('Get challenge progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  startChallenge,
  resetChallenge,
  completeChallenge,
  getChallengeProgress
};
// This code defines the challengeController for managing the 75 Hard Challenge.