// src/pages/Dashboard.jsx

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ColorPicker from "../components/ColorPicker"; // Import the color picker
import { getOptimalTextColor } from "../utils/colors"; // Import the visibility utility
import GitHubCalendar from "react-github-calendar";

export default function Dashboard() {
  const { backendUser, getAuthHeaders } = useAuth();

  // --- THEME STATE ---
  const [theme, setTheme] = useState({
    name: 'Ocean',
    primary: '#0B1426',
    secondary: '#00D4FF',
    tertiary: '#4ECDC4',
    accent: '#FF6B6B'
  });
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  // --- END THEME STATE ---

  // Existing dashboard state (unchanged)
  const [currentDay, setCurrentDay] = useState(null);
  const [challengeStatus, setChallengeStatus] = useState("not_started");
  const [userStats, setUserStats] = useState({
    currentChallengeDay: 0,
    totalResets: 0,
    completedChallenges: 0,
    challengeStartDate: null,
  });
  const [challengeHistory, setChallengeHistory] = useState([]);
  const [canAccessCurrentDay, setCanAccessCurrentDay] = useState(true);
  const [tasks, setTasks] = useState({
    workout1: { completed: false, duration: 0, notes: "" },
    workout2: { completed: false, duration: 0, notes: "" },
    waterIntake: { completed: false, amount: 0 },
    dietCompliance: { completed: false, notes: "" },
    reading: { completed: false, pages: 0, bookTitle: "" },
    progressPhoto: { completed: false },
  });
  const [loading, setLoading] = useState(true);
  const [startingChallenge, setStartingChallenge] = useState(false);
  const [completingDay, setCompletingDay] = useState(false);
  const [error, setError] = useState("");

  // All existing functions (createProgressData, useEffect, handlers) remain exactly the same
  // ... (your existing functions go here, unchanged) ...
    const createProgressData = (challengeDays, startDate, currentChallengeDay) => {
    if (!startDate || !currentChallengeDay) return [];
    const challengeStart = new Date(startDate);
    const data = [];
    for (let dayNumber = 1; dayNumber <= currentChallengeDay; dayNumber++) {
      const currentDate = new Date(challengeStart);
      currentDate.setDate(challengeStart.getDate() + (dayNumber - 1));
      const dayData = challengeDays.find(d => d.dayNumber === dayNumber);
      let level = 0;
      let count = 0;
      if (dayData) {
        const completedTasks = Object.values(dayData.tasks || {}).filter(
          task => task.completed
        ).length;
        count = completedTasks;
        level = dayData.dayCompleted
          ? 4
          : completedTasks > 0
          ? Math.min(3, Math.ceil((completedTasks / 6) * 3))
          : 0;
      }
      data.push({
        date: currentDate.toISOString().split("T")[0],
        count,
        level,
      });
    }
    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!backendUser || startingChallenge) return;
      try {
        setLoading(true);
        setError("");
        const headers = await getAuthHeaders();
        const currentDayResponse = await apiService.getCurrentDay(headers);
        setChallengeStatus(currentDayResponse.challengeStatus || "not_started");
        setCanAccessCurrentDay(currentDayResponse.canAccessCurrentDay !== false);
        if (currentDayResponse.user) {
          setUserStats({
            currentChallengeDay: currentDayResponse.user.currentChallengeDay || 0,
            totalResets: currentDayResponse.user.totalResets || 0,
            completedChallenges: currentDayResponse.user.completedChallenges || 0,
            challengeStartDate: currentDayResponse.user.challengeStartDate,
          });
        }
        if (currentDayResponse.currentDay) {
          setCurrentDay(currentDayResponse.currentDay);
          setTasks(currentDayResponse.currentDay.tasks || tasks);
        } else {
          setCurrentDay(null);
        }
        try {
          const historyResponse = await apiService.getDayHistory(headers, 1, 200);
          setChallengeHistory(historyResponse.challengeDays || []);
        } catch {
          setChallengeHistory([]);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [backendUser, getAuthHeaders, startingChallenge]);

  const handleStartChallenge = async () => {
    if (startingChallenge) return;
    try {
      setStartingChallenge(true);
      setError("");
      const headers = await getAuthHeaders();
      await apiService.startChallenge(headers);
      setChallengeStatus("active");
      setUserStats(prev => ({
        ...prev,
        currentChallengeDay: 1,
        challengeStartDate: new Date().toISOString(),
      }));
      setCanAccessCurrentDay(true);
      const initialTasks = {
        workout1: { completed: false, duration: 0, notes: "" },
        workout2: { completed: false, duration: 0, notes: "" },
        waterIntake: { completed: false, amount: 0 },
        dietCompliance: { completed: false, notes: "" },
        reading: { completed: false, pages: 0, bookTitle: "" },
        progressPhoto: { completed: false },
      };
      setTasks(initialTasks);
      setTimeout(async () => {
        try {
          const headers = await getAuthHeaders();
          const currentDayResponse = await apiService.getCurrentDay(headers);
          const historyResponse = await apiService.getDayHistory(headers, 1, 200);
          setChallengeHistory(historyResponse.challengeDays || []);
          if (currentDayResponse.currentDay) {
            setCurrentDay(currentDayResponse.currentDay);
            setTasks(currentDayResponse.currentDay.tasks || initialTasks);
          }
        } catch {}
      }, 500);
    } catch (error) {
      setError(error.message);
    } finally {
      setStartingChallenge(false);
    }
  };

  const handleCompleteDay = async () => {
    if (completingDay) return;
    try {
      setCompletingDay(true);
      setError("");
      const headers = await getAuthHeaders();
      await apiService.completeDay(userStats.currentChallengeDay, headers);
      if (userStats.currentChallengeDay >= 75) {
        setChallengeStatus("completed");
      } else {
        setUserStats(prev => ({
          ...prev,
          currentChallengeDay: prev.currentChallengeDay + 1,
        }));
      }
      setTimeout(async () => {
        try {
          const headers = await getAuthHeaders();
          const currentDayResponse = await apiService.getCurrentDay(headers);
          const historyResponse = await apiService.getDayHistory(headers, 1, 200);
          setChallengeHistory(historyResponse.challengeDays || []);
          if (currentDayResponse.currentDay) {
            setCurrentDay(currentDayResponse.currentDay);
            setTasks(currentDayResponse.currentDay.tasks || {});
          }
        } catch {}
      }, 500);
    } catch (error) {
      setError(error.message);
    } finally {
      setCompletingDay(false);
    }
  };

  const handleTaskToggle = async (taskName, taskData = {}) => {
    if (challengeStatus !== "active" || !canAccessCurrentDay) {
      setError("Cannot update tasks for this day");
      return;
    }
    try {
      const updatedTasks = {
        ...tasks,
        [taskName]: {
          ...tasks[taskName],
          completed: !tasks[taskName].completed,
          ...taskData,
        },
      };
      setTasks(updatedTasks);
      const headers = await getAuthHeaders();
      await apiService.updateTasks(
        {
          dayNumber: userStats.currentChallengeDay || 1,
          tasks: updatedTasks,
        },
        headers
      );
      setTimeout(async () => {
        try {
          const headers = await getAuthHeaders();
          const historyResponse = await apiService.getDayHistory(headers, 1, 200);
          setChallengeHistory(historyResponse.challengeDays || []);
        } catch {}
      }, 300);
    } catch (error) {
      setError(error.message);
      setTasks(tasks);
    }
  };


  // --- THEME-AWARE STYLES ---
  const textColor = getOptimalTextColor(theme.primary);
  const buttonTextColor = getOptimalTextColor(theme.secondary);
  const cardBg = `linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))`;
  const cardBorderStyle = `1px solid ${theme.secondary}20`;

  const calendarTheme = {
    light: [`${theme.primary}60`, `${theme.secondary}33`, `${theme.secondary}66`, `${theme.secondary}99`, theme.secondary],
    dark: [`${theme.primary}60`, `${theme.secondary}33`, `${theme.secondary}66`, `${theme.secondary}99`, theme.secondary],
  };
  // --- END THEME-AWARE STYLES ---

  const progressData = createProgressData(
    challengeHistory,
    userStats.challengeStartDate,
    userStats.currentChallengeDay
  );

  if (loading && !startingChallenge) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.primary }}>
        <div className="rounded-2xl p-8 flex flex-col items-center" style={{ background: theme.tertiary }}>
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme.secondary, borderTopColor: 'transparent' }}></div>
          <div className="text-lg" style={{ color: getOptimalTextColor(theme.tertiary) }}>Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  // Common wrapper for all dashboard states
  const DashboardContainer = ({ children }) => (
    <div className="min-h-screen flex flex-col" style={{ background: theme.primary, color: textColor }}>
      <Navbar theme={theme} onColorPickerOpen={() => setColorPickerOpen(true)} />
      <main className="flex-1 flex items-center justify-center pt-32 px-4">
        {children}
      </main>
      <Footer theme={theme} />
      <ColorPicker
        theme={theme}
        onThemeChange={setTheme}
        isOpen={colorPickerOpen}
        onClose={() => setColorPickerOpen(false)}
      />
    </div>
  );

  if (challengeStatus === "not_started") {
    return (
      <DashboardContainer>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-8 text-center max-w-md mx-4"
          style={{ background: cardBg, border: cardBorderStyle, backdropFilter: 'blur(10px)' }}
        >
          <h1 className="text-3xl font-display font-bold mb-4" style={{ color: theme.secondary }}>
            Ready to Start Your 75 Hard Journey?
          </h1>
          <p className="mb-6" style={{ color: textColor, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            Transform your life in 75 days with daily challenges that build mental toughness.
          </p>
          <motion.button
            onClick={handleStartChallenge}
            disabled={startingChallenge}
            whileHover={{ scale: startingChallenge ? 1 : 1.05 }}
            className="font-bold py-3 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: theme.secondary, color: buttonTextColor }}
          >
            {/* ... button content ... */}
            Start Challenge
          </motion.button>
        </motion.div>
      </DashboardContainer>
    );
  }

  // ... (Completed Status and Active Dashboard below) ...
  const completedTasks = Object.values(tasks).filter((task) => task.completed).length;
  const progressPercentage = (completedTasks / 6) * 100;
  const allTasksCompleted = completedTasks === 6;

  const taskItems = [
    { key: "workout1", label: "45-min Workout #1", icon: "💪" },
    { key: "workout2", label: "45-min Workout #2", icon: "🏃‍♂️" },
    { key: "waterIntake", label: "1 Gallon of Water", icon: "💧" },
    { key: "dietCompliance", label: "Follow Diet", icon: "🥗" },
    { key: "reading", label: "Read 10 Pages", icon: "📚" },
    { key: "progressPhoto", label: "Progress Photo", icon: "📸" },
  ];


  return (
    <div className="min-h-screen flex flex-col" style={{ background: theme.primary, color: textColor }}>
      <Navbar theme={theme} onColorPickerOpen={() => setColorPickerOpen(true)} />
      <main className="flex-1 pt-32 max-w-6xl mx-auto w-full px-4">
        {/* ... error and access messages ... */}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { value: userStats.currentChallengeDay, label: 'Current Day' },
            { value: `${completedTasks}/6`, label: 'Tasks Today' },
            { value: userStats.totalResets, label: 'Total Resets' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl p-6 text-center"
              style={{ background: cardBg, border: cardBorderStyle }}
            >
              <div className="text-3xl font-bold" style={{ color: theme.secondary }}>
                {stat.value}
              </div>
              <div style={{ color: textColor }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl p-8"
            style={{ background: cardBg, border: cardBorderStyle }}
          >
            <h2 className="text-2xl font-display font-bold mb-6 text-center" style={{ color: textColor }}>
              Day {userStats.currentChallengeDay} Tasks
            </h2>
            <div className="mb-6">
              <div className="w-full rounded-full h-3" style={{ background: `${theme.secondary}20` }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-3 rounded-full"
                  style={{ background: theme.secondary }}
                />
              </div>
            </div>
            <div className="space-y-4 mb-6">
              {taskItems.map((item, index) => (
                <motion.div
                  key={item.key}
                  // ... animation props ...
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    canAccessCurrentDay ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                  }`}
                  style={{
                    background: tasks[item.key]?.completed ? `${theme.secondary}20` : 'rgba(255,255,255,0.05)',
                    borderColor: tasks[item.key]?.completed ? theme.secondary : `${theme.secondary}20`,
                    color: textColor
                  }}
                  onClick={() => canAccessCurrentDay && handleTaskToggle(item.key)}
                >
                  {/* ... task item content ... */}
                   <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      tasks[item.key]?.completed ? "bg-secondary border-secondary" : "border-primary/40"
                    }`}
                  >
                    {tasks[item.key]?.completed && (
                      <span className="text-primary text-sm font-bold">✓</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.button
              onClick={handleCompleteDay}
              disabled={!allTasksCompleted || completingDay}
              whileHover={{ scale: !allTasksCompleted || completingDay ? 1 : 1.02 }}
              className="w-full py-4 rounded-lg font-bold text-lg transition-all"
              style={{
                background: allTasksCompleted && !completingDay ? theme.secondary : `${textColor}20`,
                color: allTasksCompleted && !completingDay ? buttonTextColor : `${textColor}50`,
                cursor: !allTasksCompleted || completingDay ? 'not-allowed' : 'pointer'
              }}
            >
              {/* ... button content ... */}
                Complete Day {userStats.currentChallengeDay}
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl p-8"
            style={{ background: cardBg, border: cardBorderStyle }}
          >
            <h2 className="text-2xl font-display font-bold mb-6 text-center" style={{ color: textColor }}>
              Challenge Progress
            </h2>
            <div className="flex justify-center text-xs" style={{ color: textColor }}>
              {progressData.length > 0 ? (
                <GitHubCalendar
                  username="placeholder"
                  data={progressData}
                  theme={calendarTheme}
                  blockSize={12}
                  blockMargin={2}
                  fontSize={12}
                />
              ) : (
                <p>Complete your first day to see your progress calendar!</p>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer theme={theme} />
      <ColorPicker
        theme={theme}
        onThemeChange={setTheme}
        isOpen={colorPickerOpen}
        onClose={() => setColorPickerOpen(false)}
      />
    </div>
  );
}
