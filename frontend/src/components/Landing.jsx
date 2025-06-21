// src/components/Landing.jsx

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getOptimalTextColor } from '../utils/colors';

const Landing = ({ theme }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const mainTextColor = getOptimalTextColor(theme.primary);
  const buttonTextColor = getOptimalTextColor(theme.secondary);

  return (
    <div className="relative">
      <motion.section className="min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden pt-20"
        style={{ background: `linear-gradient(135deg, ${theme.primary} 0%, #000000 100%)`, paddingTop: '5rem' }}>
        <motion.div style={{ y: y2, backgroundColor: theme.secondary, opacity: 0.15 }} className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl"/>
        <motion.div style={{ y: y1, backgroundColor: theme.tertiary, opacity: 0.1 }} className="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl"/>
        <motion.div style={{ opacity }} className="max-w-6xl mx-auto text-center z-10 relative">
          <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut' }} className="mb-12">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none" style={{ color: mainTextColor, textShadow: `0 2px 5px rgba(0,0,0,0.5)` }}>
              Master Your
              <span className="block" style={{ backgroundImage: `linear-gradient(45deg, ${theme.secondary}, ${theme.tertiary})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.3))'}}>
                75 Hard Challenge
              </span>
            </h1>
            <p className="text-2xl md:text-3xl max-w-4xl mx-auto leading-relaxed font-light" style={{ color: mainTextColor, textShadow: `0 2px 8px rgba(0,0,0,0.7)` }}>
              Transform your mindset, build unbreakable discipline, and achieve your goals.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <motion.button whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} className="px-12 py-5 font-black text-xl rounded-2xl shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${theme.secondary}, ${theme.tertiary})`, color: buttonTextColor, boxShadow: `0 20px 40px ${theme.secondary}40` }}>
              Start Your Journey
            </motion.button>
            <motion.button whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} className="px-12 py-5 font-black text-xl rounded-2xl border-2"
              style={{ borderColor: theme.secondary, color: theme.secondary, background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Landing;
