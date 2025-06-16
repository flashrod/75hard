import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Dashboard() {
  const { backendUser, getAuthHeaders } = useAuth();
  const [currentDay, setCurrentDay] = useState(null);
  const [challengeStatus, setChallengeStatus] = useState('not_started');
  const [userStats, setUserStats] = useState({
    currentChallengeDay: 0,
    totalResets: 0,
    completedChallenges: 0
  });
  const [tasks, setTasks] = useState({
    workout1: { completed: false, duration: 0, notes: "" },
    workout2: { completed: false, duration: 0, notes: "" },
    waterIntake: { completed: false, amount: 0 },
    dietCompliance: { completed: false, notes: "" },
    reading: { completed: false, pages: 0, bookTitle: "" },
    progressPhoto: { completed: false }
  });
  const [loading, setLoading] = useState(true);
  const [startingChallenge, setStartingChallenge] = useState(false);
  const [error, setError] = useState("");

  // Fetch current day and progress data
  useEffect(() => {
    const fetchData = async () => {
      if (!backendUser || startingChallenge) return; // Prevent fetch during challenge start
      
      try {
        setLoading(true);
        setError("");
        const headers = await getAuthHeaders();
        
        // Fetch current day
        const currentDayResponse = await apiService.getCurrentDay(headers);
        console.log('📊 Current day response:', currentDayResponse);
        
        // Update all state from response
        setChallengeStatus(currentDayResponse.challengeStatus || 'not_started');
        
        if (currentDayResponse.user) {
          setUserStats({
            currentChallengeDay: currentDayResponse.user.currentChallengeDay || 0,
            totalResets: currentDayResponse.user.totalResets || 0,
            completedChallenges: currentDayResponse.user.completedChallenges || 0
          });
        }
        
        if (currentDayResponse.currentDay) {
          setCurrentDay(currentDayResponse.currentDay);
          setTasks(currentDayResponse.currentDay.tasks || tasks);
        } else {
          setCurrentDay(null);
        }
        
      } catch (error) {
        console.error('❌ Dashboard fetch error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backendUser, getAuthHeaders, startingChallenge]); // Added startingChallenge dependency

  // Handle starting the challenge - FIXED: No more reload
  const handleStartChallenge = async () => {
    if (startingChallenge) return; // Prevent multiple clicks
    
    try {
      setStartingChallenge(true);
      setError("");
      
      const headers = await getAuthHeaders();
      const response = await apiService.startChallenge(headers);
      console.log('✅ Challenge started:', response);
      
      // Update state directly instead of reloading
      setChallengeStatus('active');
      setUserStats(prev => ({
        ...prev,
        currentChallengeDay: 1
      }));
      
      // Create initial day tasks
      const initialTasks = {
        workout1: { completed: false, duration: 0, notes: "" },
        workout2: { completed: false, duration: 0, notes: "" },
        waterIntake: { completed: false, amount: 0 },
        dietCompliance: { completed: false, notes: "" },
        reading: { completed: false, pages: 0, bookTitle: "" },
        progressPhoto: { completed: false }
      };
      setTasks(initialTasks);
      
      // Fetch fresh data after starting
      setTimeout(async () => {
        try {
          const headers = await getAuthHeaders();
          const currentDayResponse = await apiService.getCurrentDay(headers);
          
          if (currentDayResponse.currentDay) {
            setCurrentDay(currentDayResponse.currentDay);
            setTasks(currentDayResponse.currentDay.tasks || initialTasks);
          }
        } catch (error) {
          console.error('❌ Error fetching after start:', error);
        }
      }, 500);
      
    } catch (error) {
      console.error('❌ Start challenge error:', error);
      setError(error.message);
    } finally {
      setStartingChallenge(false);
    }
  };

  // Handle task updates
  const handleTaskToggle = async (taskName, taskData = {}) => {
    if (challengeStatus !== 'active') {
      setError('Please start the challenge first');
      return;
    }

    try {
      const updatedTasks = {
        ...tasks,
        [taskName]: {
          ...tasks[taskName],
          completed: !tasks[taskName].completed,
          ...taskData
        }
      };

      // Optimistic update
      setTasks(updatedTasks);

      // Update backend
      const headers = await getAuthHeaders();
      await apiService.updateTasks({
        dayNumber: userStats.currentChallengeDay || 1,
        tasks: updatedTasks
      }, headers);

      console.log('✅ Task updated successfully');
    } catch (error) {
      console.error('❌ Task update error:', error);
      setError(error.message);
      // Revert optimistic update
      setTasks(tasks);
    }
  };

  if (loading && !startingChallenge) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="bg-tertiary rounded-2xl p-8 flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-primary text-lg">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  if (!backendUser) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-text text-xl">Please log in to continue</div>
      </div>
    );
  }

  // If user hasn't started challenge yet
  if (challengeStatus === 'not_started') {
    return (
      <div className="min-h-screen bg-primary flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-32">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-tertiary rounded-2xl p-8 text-center max-w-md mx-4"
          >
            <h1 className="text-3xl font-display font-bold text-primary mb-4">
              Ready to Start Your 75 Hard Journey?
            </h1>
            <p className="text-primary mb-6">
              Transform your life in 75 days with daily challenges that build mental toughness.
            </p>
            
            <div className="mb-6 text-left">
              <h3 className="font-bold text-primary mb-3">Daily Requirements:</h3>
              <ul className="text-primary space-y-2">
                <li>• Two 45-minute workouts</li>
                <li>• Follow a diet (no cheat meals)</li>
                <li>• Drink 1 gallon of water</li>
                <li>• Read 10 pages of non-fiction</li>
                <li>• Take a progress photo</li>
              </ul>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-200 text-red-800 rounded-lg text-sm">
                {error}
              </div>
            )}

            <motion.button
              onClick={handleStartChallenge}
              disabled={startingChallenge}
              whileHover={{ scale: startingChallenge ? 1 : 1.05 }}
              className="bg-secondary text-primary font-bold py-3 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {startingChallenge ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Starting...
                </div>
              ) : (
                'Start Challenge'
              )}
            </motion.button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  // If challenge is completed
  if (challengeStatus === 'completed') {
    return (
      <div className="min-h-screen bg-primary flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-32">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-tertiary rounded-2xl p-8 text-center max-w-md mx-4"
          >
            <h1 className="text-3xl font-display font-bold text-primary mb-4">
              🎉 Congratulations!
            </h1>
            <p className="text-primary mb-6">
              You've completed the 75 Hard Challenge! You've built incredible mental toughness.
            </p>
            <motion.button
              onClick={handleStartChallenge}
              disabled={startingChallenge}
              whileHover={{ scale: startingChallenge ? 1 : 1.05 }}
              className="bg-secondary text-primary font-bold py-3 px-8 rounded-lg disabled:opacity-50"
            >
              {startingChallenge ? 'Starting...' : 'Start New Challenge'}
            </motion.button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  // Active challenge dashboard
  const completedTasks = Object.values(tasks).filter(task => task.completed).length;
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
    <div className="min-h-screen bg-primary flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 max-w-4xl mx-auto w-full px-4">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-200 text-red-800 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-tertiary rounded-xl p-6 text-center"
          >
            <div className="text-3xl font-bold text-secondary">
              {userStats.currentChallengeDay}
            </div>
            <div className="text-primary">Current Day</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-tertiary rounded-xl p-6 text-center"
          >
            <div className="text-3xl font-bold text-secondary">{completedTasks}/6</div>
            <div className="text-primary">Tasks Today</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-tertiary rounded-xl p-6 text-center"
          >
            <div className="text-3xl font-bold text-secondary">
              {userStats.totalResets}
            </div>
            <div className="text-primary">Total Resets</div>
          </motion.div>
        </div>

        {/* Daily Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-tertiary rounded-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-display font-bold text-primary mb-6 text-center">
            Day {userStats.currentChallengeDay} Tasks
          </h2>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-primary mb-2">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-primary/20 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
                className="bg-secondary h-3 rounded-full"
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
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  tasks[item.key]?.completed
                    ? 'bg-secondary/20 border-secondary text-primary'
                    : 'bg-white border-primary/20 text-primary hover:bg-primary/5'
                }`}
                onClick={() => handleTaskToggle(item.key)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  tasks[item.key]?.completed 
                    ? 'bg-secondary border-secondary' 
                    : 'border-primary/40'
                }`}>
                  {tasks[item.key]?.completed && (
                    <span className="text-primary text-sm font-bold">✓</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
