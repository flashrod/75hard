import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [currentDay, setCurrentDay] = useState(1);
  const [tasks, setTasks] = useState({
    workout1: false,
    workout2: false,
    waterIntake: false,
    dietCompliance: false,
    reading: false,
    progressPhoto: false
  });

  const [user] = useState({
    name: "John Doe",
    challengeStatus: "active",
    totalResets: 0,
    completedChallenges: 0
  });

  const handleTaskToggle = (taskName) => {
    setTasks(prev => ({
      ...prev,
      [taskName]: !prev[taskName]
    }));
  };

  const completedTasks = Object.values(tasks).filter(Boolean).length;
  const progressPercentage = (completedTasks / 6) * 100;

  const taskItems = [
    { key: 'workout1', label: '45-min Workout #1', icon: '💪' },
    { key: 'workout2', label: '45-min Workout #2', icon: '🏃‍♂️' },
    { key: 'waterIntake', label: '1 Gallon of Water', icon: '💧' },
    { key: 'dietCompliance', label: 'Follow Diet', icon: '🥗' },
    { key: 'reading', label: 'Read 10 Pages', icon: '📚' },
    { key: 'progressPhoto', label: 'Progress Photo', icon: '📸' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-sky">
      {/* Header */}
      <div className="bg-primary-dark/80 backdrop-blur-lg shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-display font-bold text-white"
          >
            75HARD Dashboard
          </motion.h1>
          <div className="text-sky">
            Welcome back, <span className="text-accent font-semibold">{user.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="text-3xl font-bold text-accent">{currentDay}</div>
            <div className="text-sky">Current Day</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="text-3xl font-bold text-copper">{completedTasks}/6</div>
            <div className="text-sky">Tasks Today</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="text-3xl font-bold text-white">{user.totalResets}</div>
            <div className="text-sky">Total Resets</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="text-3xl font-bold text-accent">{user.completedChallenges}</div>
            <div className="text-sky">Completed</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Tasks */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              Day {currentDay} Tasks
            </h2>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-sky mb-2">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-accent h-3 rounded-full"
                />
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-4">
              {taskItems.map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer ${
                    tasks[item.key]
                      ? 'bg-accent/20 border-accent text-white'
                      : 'bg-white/5 border-white/20 text-sky hover:bg-white/10'
                  }`}
                  onClick={() => handleTaskToggle(item.key)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    tasks[item.key] ? 'bg-accent border-accent' : 'border-white/40'
                  }`}>
                    {tasks[item.key] && <span className="text-white text-sm">✓</span>}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-accent hover:bg-accent/90 text-white font-bold py-3 px-4 rounded-lg transition-all"
              >
                Complete Day
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-copper hover:bg-copper/90 text-white font-bold py-3 px-4 rounded-lg transition-all"
              >
                Reset Challenge
              </motion.button>
            </div>
          </motion.div>

          {/* Progress Calendar/Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              Challenge Progress
            </h2>

            {/* 75 Day Grid */}
            <div className="grid grid-cols-10 gap-2">
              {Array.from({ length: 75 }, (_, i) => i + 1).map((day) => (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + (day * 0.01) }}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    day < currentDay
                      ? 'bg-accent text-white'
                      : day === currentDay
                      ? 'bg-copper text-white ring-2 ring-white'
                      : 'bg-white/20 text-sky'
                  }`}
                >
                  {day}
                </motion.div>
              ))}
            </div>

            <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-accent rounded"></div>
                <span className="text-sky">Completed Days</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-copper rounded ring-1 ring-white"></div>
                <span className="text-sky">Current Day</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white/20 rounded"></div>
                <span className="text-sky">Upcoming Days</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
