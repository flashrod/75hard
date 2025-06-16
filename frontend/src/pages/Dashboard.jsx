import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GitHubCalendar from "react-github-calendar";

export default function Dashboard() {
  const { backendUser, getAuthHeaders } = useAuth();
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

  // Fixed: Create GitHub calendar data for all challenge days up to current
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

  const calendarTheme = {
    light: [
      "#fef2f0",
      "#f0cd3d33",
      "#f0cd3d66",
      "#f0cd3d99",
      "#f0cd3d",
    ],
    dark: [
      "#fef2f0",
      "#f0cd3d33",
      "#f0cd3d66",
      "#f0cd3d99",
      "#f0cd3d",
    ],
  };

  const progressData = createProgressData(
    challengeHistory,
    userStats.challengeStartDate,
    userStats.currentChallengeDay
  );

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

  if (challengeStatus === "not_started") {
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
                "Start Challenge"
              )}
            </motion.button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  if (challengeStatus === "completed") {
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
            {progressData.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-primary mb-3">Your Journey:</h3>
                <div className="bg-white p-4 rounded-lg">
                  <GitHubCalendar
                    username="placeholder"
                    data={progressData}
                    theme={calendarTheme}
                    blockSize={8}
                    blockMargin={1}
                    fontSize={10}
                    hideColorLegend={true}
                    hideMonthLabels={false}
                    hideTotalCount={true}
                    style={{ color: "#6892ef" }}
                  />
                </div>
              </div>
            )}
            <motion.button
              onClick={handleStartChallenge}
              disabled={startingChallenge}
              whileHover={{ scale: startingChallenge ? 1 : 1.05 }}
              className="bg-secondary text-primary font-bold py-3 px-8 rounded-lg disabled:opacity-50"
            >
              {startingChallenge ? "Starting..." : "Start New Challenge"}
            </motion.button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

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
    <div className="min-h-screen bg-primary flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 max-w-6xl mx-auto w-full px-4">
        {error && (
          <div className="mb-4 p-3 bg-red-200 text-red-800 rounded-lg text-sm">
            {error}
          </div>
        )}
        {!canAccessCurrentDay && (
          <div className="mb-4 p-3 bg-yellow-200 text-yellow-800 rounded-lg text-sm">
            Complete the previous day before accessing Day {userStats.currentChallengeDay}
          </div>
        )}
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
            <div className="text-3xl font-bold text-secondary">
              {completedTasks}/6
            </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-tertiary rounded-xl p-8"
          >
            <h2 className="text-2xl font-display font-bold text-primary mb-6 text-center">
              Day {userStats.currentChallengeDay} Tasks
            </h2>
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
            <div className="space-y-4 mb-6">
              {taskItems.map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    canAccessCurrentDay ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                  } ${
                    tasks[item.key]?.completed
                      ? "bg-secondary/20 border-secondary text-primary"
                      : "bg-white border-primary/20 text-primary hover:bg-primary/5"
                  }`}
                  onClick={() => canAccessCurrentDay && handleTaskToggle(item.key)}
                >
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
            {canAccessCurrentDay && (
              <motion.button
                onClick={handleCompleteDay}
                disabled={!allTasksCompleted || completingDay}
                whileHover={{ scale: !allTasksCompleted || completingDay ? 1 : 1.02 }}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                  allTasksCompleted && !completingDay
                    ? "bg-secondary text-primary hover:bg-secondary/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {completingDay ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    Completing Day...
                  </div>
                ) : allTasksCompleted ? (
                  `Complete Day ${userStats.currentChallengeDay}`
                ) : (
                  `Complete all tasks to finish Day ${userStats.currentChallengeDay}`
                )}
              </motion.button>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-tertiary rounded-xl p-8"
          >
            <h2 className="text-2xl font-display font-bold text-primary mb-6 text-center">
              Challenge Progress
            </h2>
            <div className="flex justify-center">
              {progressData.length > 0 ? (
                <div className="w-full overflow-x-auto">
                  <GitHubCalendar
                    username="placeholder"
                    data={progressData}
                    theme={calendarTheme}
                    blockSize={12}
                    blockMargin={2}
                    fontSize={12}
                    hideColorLegend={false}
                    hideMonthLabels={false}
                    hideTotalCount={true}
                    labels={{
                      totalCount: "{{count}} tasks completed since starting",
                    }}
                    style={{ color: "#6892ef" }}
                  />
                </div>
              ) : (
                <div className="text-center text-primary">
                  <div className="text-4xl mb-4">📅</div>
                  <p>Complete your first day to see your progress calendar!</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-primary">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: calendarTheme.light[level] }}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
