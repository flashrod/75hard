// src/pages/Challenge.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { getOptimalTextColor } from '../utils/colors';

export default function Challenge({ theme }) {
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
          💪 The 75 Hard Challenge
        </motion.h1>

        <motion.p
          className="text-xl leading-relaxed mb-12 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ color: textColor, opacity: 0.85 }}
        >
          This isn't just another fitness program; it's a transformative mental toughness journey designed to forge discipline, resilience, and unwavering self-confidence through a set of daily non-negotiable habits.
        </motion.p>

        <section className="space-y-8 mt-12">
          {/* Daily Tasks Section */}
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
            <div className="text-5xl md:text-6xl flex-shrink-0">📝</div>
            <div>
              <h2 className="text-3xl font-bold mb-3" style={{ color: theme.secondary }}>Daily Non-Negotiables</h2>
              <ul className="list-none space-y-2 text-lg">
                <li><span className="font-bold text-lg">🍎 Follow a diet:</span> No cheat meals, no alcohol.</li>
                <li><span className="font-bold text-lg">💪🏽 Two 45-min workouts:</span> One must be outdoors.</li>
                <li><span className="font-bold text-lg">💧 1 Gallon of Water:</span> Hydration is key.</li>
                <li><span className="font-bold text-lg">📚 Read 10 Pages:</span> Non-fiction, personal development.</li>
                <li><span className="font-bold text-lg">📸 Progress Photo:</span> Track your visual transformation.</li>
                <li><span className="font-bold text-lg">🚫 No Alcohol / Cheat Meals:</span> Zero exceptions for 75 days.</li>
              </ul>
            </div>
          </motion.div>

          {/* Why Take the Challenge Section */}
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
            <div className="text-5xl md:text-6xl flex-shrink-0">🌟</div>
            <div>
              <h2 className="text-3xl font-bold mb-3" style={{ color: theme.tertiary }}>Beyond Physical Transformation</h2>
              <p className="text-lg">
                The 75 Hard Challenge is a crucible for mental fortitude. It teaches you to conquer self-doubt, embrace discomfort, and build the discipline required to achieve any goal you set your mind to. This isn't just about weight loss; it's about life transformation.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Start Journey Button */}
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
            🚀 Start Your Unstoppable Journey
          </Link>
        </div>
      </main>
      <Footer theme={theme} />
    </div>
  );
}
