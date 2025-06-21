// src/components/Navbar.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Zap } from 'lucide-react';
import { getOptimalTextColor } from '../utils/colors';

const Navbar = ({ theme, onColorPickerOpen }) => {
  const navTextColor = getOptimalTextColor(theme.primary);
  const buttonIconColor = getOptimalTextColor(theme.secondary);

  return (
    <motion.nav
      style={{
        background: `rgba(0, 0, 0, 0.2)`,
        backdropFilter: `blur(15px)`,
        borderBottom: `1px solid ${theme.secondary}40`,
      }}
      className="fixed top-0 w-full z-50 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg" style={{ background: theme.secondary }}>
            <Zap style={{ color: buttonIconColor }}/>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: theme.secondary, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            75HARD
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Home', 'Challenge', 'Rules'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-semibold transition-colors hover:text-white"
              style={{ color: navTextColor, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
              {item}
            </a>
          ))}
        </div>
        <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onColorPickerOpen}
          className="p-2.5 rounded-full" style={{ background: theme.secondary, color: buttonIconColor }}>
          <Palette className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
