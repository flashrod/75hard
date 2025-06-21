// src/pages/Rules.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getOptimalTextColor } from '../utils/colors';

export default function Rules({ theme }) {
  const textColor = getOptimalTextColor(theme.primary);
  const buttonTextColor = getOptimalTextColor(theme.secondary);

  return (
    <div style={{ background: theme.primary, color: textColor, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar theme={theme} />
      <main className="flex-grow max-w-5xl mx-auto px-6 py-20 mt-16 md:mt-24"> {/* Added mt for navbar offset */}
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundImage: `linear-gradient(45deg, ${theme.secondary}, ${theme.tertiary})`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
          }}
        >
          📜 The 75 Hard Rules: No Compromises
        </motion.h1>

        <motion.p
          className="text-xl leading-relaxed mb-12 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ color: textColor, opacity: 0.85 }}
        >
          Success in 75 Hard hinges on absolute adherence. There are no modifications, no exceptions, and no compromises. If a rule is broken, you start over from Day 1.
        </motion.p>

        <section className="space-y-8 mt-12">
          {/* Strict Rules Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center gap-6"
            style={{
              background: `linear-gradient(135deg, ${theme.secondary}20, ${theme.tertiary}10)`,
              border: `1px solid ${theme.secondary}60`,
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="text-5xl md:text-6xl flex-shrink-0">🛑</div>
            <div>
              <h2 className="text-3xl font-bold mb-3" style={{ color: theme.secondary }}>The Unbreakable Code</h2>
              <ol className="list-decimal list-inside space-y-2 text-lg">
                <li><span className="font-bold text-lg">Follow a Strict Diet:</span> No cheat meals, no alcohol.</li>
                <li><span className="font-bold text-lg">Two 45-Minute Workouts Daily:</span> One must be outdoors, regardless of weather.</li>
                <li><span className="font-bold text-lg">Drink 1 Gallon (3.78 Liters) of Water Daily.</span></li>
                <li><span className="font-bold text-lg">Read 10 Pages of a Non-Fiction Book Daily:</span> Audiobooks don't count.</li>
                <li><span className="font-bold text-lg">Take a Progress Photo Every Single Day.</span></li>
                <li><span className="font-bold text-lg">No Alcohol or Cheat Meals:</span> This is absolute.</li>
                <li><span className="font-bold text-lg">Zero Exceptions:</span> If you miss any task or break any rule, you must start over from Day 1. There are no partial days, no makeup days.</li>
              </ol>
            </div>
          </motion.div>

          {/* The Spirit of 75 Hard Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center gap-6"
            style={{
              background: `linear-gradient(135deg, ${theme.tertiary}20, ${theme.secondary}10)`,
              border: `1px solid ${theme.tertiary}60`,
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="text-5xl md:text-6xl flex-shrink-0">💯</div>
            <div>
              <h2 className="text-3xl font-bold mb-3" style={{ color: theme.tertiary }}>The Unyielding Commitment</h2>
              <p className="text-lg">
                75 Hard is a test of mental fortitude. It forces you to operate outside your comfort zone, to develop the discipline to execute, even when you don't feel like it. The "start over" rule is key to building true mental resilience and habit formation. Embrace the challenge, embrace the growth.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Get Started Button */}
        <div className="mt-20 text-center">
          <Link
            to={localStorage.getItem('token') ? "/dashboard" : "/auth"} {/* Dynamic link */}
            className="inline-block px-12 py-5 rounded-full font-bold text-xl shadow-lg transition-transform transform hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${theme.secondary}, ${theme.tertiary})`,
              color: buttonTextColor, // Use calculated color for button text
              boxShadow: `0 15px 40px -10px ${theme.secondary}80`,
            }}
          >
            🚀 Master Your Mindset Today
          </Link>
        </div>
      </main>
      <Footer theme={theme} />
    </div>
  );
}
