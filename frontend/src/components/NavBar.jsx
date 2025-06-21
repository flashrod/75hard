// src/components/Navbar.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Palette, Zap, LogIn, LogOut, User, Trophy, BarChart } from 'lucide-react';
import { getOptimalTextColor } from '../utils/colors';

const Navbar = ({ theme, onColorPickerOpen }) => {
  const { backendUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // --- THEME-AWARE STYLES ---
  const navTextColor = getOptimalTextColor(theme.primary);
  const buttonTextColor = getOptimalTextColor(theme.secondary);

  const handleLogout = async () => {
    await logout();
    navigate('/'); // Redirect to home page after logout
  };

  // --- NAVIGATION LINKS ---
  // The "Challenge" and "Rules" links are now included.
  // They will intelligently navigate to the homepage sections.
  const mainLinks = [
    { name: 'Challenge', path: '/#challenge', icon: Trophy },
    { name: 'Rules', path: '/#rules', icon: BarChart },
  ];

  return (
    <motion.nav
      style={{
        background: `rgba(0, 0, 0, 0.2)`,
        backdropFilter: `blur(15px)`,
        borderBottom: `1px solid ${theme.secondary}40`,
        boxShadow: `0 4px 30px rgba(0, 0, 0, 0.1)`,
      }}
      className="fixed top-0 w-full z-50 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo - Links to homepage */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg" style={{ background: theme.secondary }}>
            <Zap style={{ color: buttonTextColor }}/>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: theme.secondary, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            75HARD
          </h1>
        </Link>

        {/* --- Main Navigation Links (Center) --- */}
        <div className="hidden md:flex items-center gap-8">
          {mainLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-2 text-sm font-semibold transition-colors hover:text-white"
              style={{
                color: navTextColor,
                textShadow: '0 1px 4px rgba(0,0,0,0.8)',
              }}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </div>

        {/* --- Action Buttons (Right Side) --- */}
        <div className="flex items-center gap-4">
          {backendUser ? (
            // --- Logged-in User View ---
            <>
              <Link to="/dashboard" className="hidden sm:flex items-center gap-2 text-sm font-semibold" style={{ color: navTextColor }}>
                <User className="w-4 h-4" />
                Dashboard
              </Link>
              <motion.button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg"
                style={{ backgroundColor: `${theme.accent || '#FF6B6B'}20`, color: theme.accent || '#FF6B6B' }}
                whileHover={{ scale: 1.05 }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            </>
          ) : (
            // --- Guest View ---
            // The prominent, colored Login button
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/auth"
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm shadow-lg transition-all duration-300"
                style={{
                  background: theme.secondary,
                  color: buttonTextColor,
                  boxShadow: `0 8px 25px -8px ${theme.secondary}`
                }}
              >
                <LogIn className="w-4 h-4" />
                Login / Sign Up
              </Link>
            </motion.div>
          )}

          {/* Color Picker Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onColorPickerOpen}
            className="p-2.5 rounded-full"
            style={{
              background: `${theme.secondary}20`,
              color: theme.secondary,
            }}
          >
            <Palette className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
