import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Dashboard() {
  const { backendUser, getAuthHeaders } = useAuth();
  const [currentDay, setCurrentDay] = useState(null);
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDay = async () => {
      setLoading(true);
      try {
        const headers = await getAuthHeaders();
        const dayRes = await apiService.getCurrentDay(headers);
        setCurrentDay(dayRes.currentDay?.dayNumber || 1);
        setTasks(dayRes.currentDay?.tasks || {});
      } catch (e) {
        // handle error
      }
      setLoading(false);
    };
    fetchDay();
  }, [backendUser, getAuthHeaders]);

  const taskList = [
    { key: 'workout1', label: '45-min Workout #1' },
    { key: 'workout2', label: '45-min Workout #2' },
    { key: 'waterIntake', label: '1 Gallon of Water' },
    { key: 'dietCompliance', label: 'Follow Diet' },
    { key: 'reading', label: 'Read 10 Pages' },
    { key: 'progressPhoto', label: 'Progress Photo' }
  ];

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 max-w-2xl mx-auto w-full px-4">
        <h1 className="text-3xl font-display font-bold text-white mb-8 text-center">
          Day {currentDay} Checklist
        </h1>
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-tertiary rounded-xl shadow-lg p-8">
            <ul className="space-y-4">
              {taskList.map(task => (
                <li key={task.key} className="flex items-center justify-between">
                  <span className="text-lg text-primary">{task.label}</span>
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                      tasks[task.key]?.completed
                        ? "bg-secondary border-secondary"
                        : "bg-white border-primary"
                    }`}
                  >
                    {tasks[task.key]?.completed && (
                      <span className="text-primary font-bold">✓</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
