import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ColorPicker = ({ onColorChange, currentTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const themes = [
    { name: 'Ocean', primary: '#0B1426', secondary: '#00D4FF', tertiary: '#4ECDC4', accent: '#FF6B6B' },
    { name: 'Sunset', primary: '#1A0B2E', secondary: '#FF6B35', tertiary: '#F7931E', accent: '#FFE66D' },
    { name: 'Forest', primary: '#0F2027', secondary: '#2BC0E4', tertiary: '#EAECC6', accent: '#2ECC71' },
    { name: 'Neon', primary: '#0C0C0C', secondary: '#FF0080', tertiary: '#00FFFF', accent: '#FFFF00' },
    { name: 'Royal', primary: '#1B1B2F', secondary: '#7209B7', tertiary: '#B8860B', accent: '#F39C12' },
    { name: 'Arctic', primary: '#0A1D29', secondary: '#4A90E2', tertiary: '#87CEEB', accent: '#E8F4FD' }
  ];

  return (
    <div className="fixed top-24 right-6 z-50">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 shadow-lg flex items-center justify-center backdrop-blur-md"
        style={{ background: `linear-gradient(45deg, ${currentTheme.secondary}, ${currentTheme.tertiary})` }}
      >
        <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm"></div>
      </motion.button>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          className="absolute top-16 right-0 bg-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/20"
        >
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => (
              <motion.button
                key={theme.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onColorChange(theme);
                  setIsOpen(false);
                }}
                className="relative w-16 h-12 rounded-xl overflow-hidden shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 50%, ${theme.tertiary} 100%)`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                <div className="absolute bottom-1 left-1 right-1 text-[8px] text-white/80 text-center font-medium">
                  {theme.name}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default function Navbar({ theme, onColorChange }) {
  const [currentUser, setCurrentUser] = useState(null); // Mock auth state - replace with your actual auth
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  const handleLogout = () => {
    // Replace this with your actual logout function
    setCurrentUser(null);
    console.log('Logout clicked');
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
          isScrolled ? 'bg-black/20 backdrop-blur-xl shadow-2xl' : 'bg-transparent'
        }`}
        style={{
          borderBottom: isScrolled ? `1px solid ${theme.secondary}20` : 'none'
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div 
              className="font-black text-3xl tracking-wider bg-gradient-to-r bg-clip-text text-transparent cursor-pointer"
              style={{ 
                backgroundImage: `linear-gradient(45deg, ${theme.secondary}, ${theme.tertiary})` 
              }}
              onClick={() => window.location.href = '/'}
            >
              75HARD
            </div>
            <motion.div
              animate={{ scaleX: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r"
              style={{ 
                backgroundImage: `linear-gradient(90deg, transparent, ${theme.secondary}, transparent)` 
              }}
            />
          </motion.div>

          <div className="flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="relative text-white font-semibold text-lg transition-all duration-300 group"
              >
                {link.name}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: theme.secondary }}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
            
            {currentUser ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="text-white font-semibold transition-colors duration-300"
                style={{ color: theme.secondary }}
              >
                Logout
              </motion.button>
            ) : (
              <motion.a
                href="/auth"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-6 py-3 font-bold rounded-2xl overflow-hidden shadow-lg transition-all duration-300"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.secondary}, ${theme.tertiary})`,
                  color: theme.primary
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">Sign In</span>
              </motion.a>
            )}
          </div>
        </div>
      </motion.nav>
      
      <ColorPicker onColorChange={onColorChange} currentTheme={theme} />
    </>
  );
}

// Usage Example:
// const [theme, setTheme] = useState({
//   name: 'Ocean',
//   primary: '#0B1426',
//   secondary: '#00D4FF',
//   tertiary: '#4ECDC4',
//   accent: '#FF6B6B'
// });
// 
// <Navbar theme={theme} onColorChange={setTheme} />