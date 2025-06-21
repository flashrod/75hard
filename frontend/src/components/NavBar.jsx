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
        whileHover={{ scale: 1.15, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-2xl group"
        style={{ 
          background: `conic-gradient(from 0deg, ${currentTheme.secondary}, ${currentTheme.tertiary}, ${currentTheme.accent || currentTheme.secondary}, ${currentTheme.secondary})`,
          boxShadow: `0 8px 32px ${currentTheme.secondary}60, inset 0 1px 0 rgba(255,255,255,0.2)`
        }}
      >
        <motion.div
          className="absolute inset-1 rounded-xl bg-black/20 backdrop-blur-md flex items-center justify-center"
          animate={{ rotate: isOpen ? 0 : -180 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <motion.div
            className="w-8 h-8 rounded-lg"
            style={{ 
              background: `linear-gradient(45deg, ${currentTheme.secondary}80, ${currentTheme.tertiary}80)`,
              boxShadow: `0 0 20px ${currentTheme.secondary}40`
            }}
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        
        {/* Floating particles around button */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{ 
              backgroundColor: currentTheme.secondary,
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [0, Math.cos(i * 60 * Math.PI / 180) * 30],
              y: [0, Math.sin(i * 60 * Math.PI / 180) * 30],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.button>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.8, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, y: -30, scale: 0.8, rotateX: -15 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute top-20 right-0 bg-black/30 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/10"
          style={{ 
            background: `linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.1) 100%)`,
            boxShadow: `0 25px 50px -12px ${currentTheme.secondary}40, inset 0 1px 0 rgba(255,255,255,0.1)`
          }}
        >
          {/* Header */}
          <div className="text-center mb-4">
            <h3 className="text-white font-bold text-sm mb-1">Choose Theme</h3>
            <div className="w-12 h-0.5 bg-gradient-to-r mx-auto rounded-full"
                 style={{ backgroundImage: `linear-gradient(90deg, ${currentTheme.secondary}, ${currentTheme.tertiary})` }}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {themes.map((theme, index) => (
              <motion.button
                key={theme.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onColorChange(theme);
                  setIsOpen(false);
                }}
                className="relative w-20 h-16 rounded-2xl overflow-hidden shadow-xl group"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 40%, ${theme.tertiary} 100%)`,
                  boxShadow: `0 8px 25px ${theme.secondary}30`
                }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                  whileHover={{ translateX: '200%' }}
                  transition={{ duration: 0.6 }}
                />
                
                {/* Inner glow */}
                <div 
                  className="absolute inset-0.5 rounded-xl opacity-60"
                  style={{ 
                    background: `radial-gradient(circle at 30% 30%, ${theme.secondary}40, transparent 70%)`
                  }}
                />
                
                {/* Theme name */}
                <div className="absolute bottom-1.5 left-0 right-0 text-center">
                  <span className="text-[10px] text-white/90 font-semibold tracking-wide drop-shadow-lg">
                    {theme.name}
                  </span>
                </div>
                
                {/* Active indicator */}
                {currentTheme.name === theme.name && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-3 h-3 rounded-full bg-white shadow-lg"
                  >
                    <div className="absolute inset-0.5 rounded-full bg-green-400"></div>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
          
          {/* Footer */}
          <div className="mt-4 text-center">
            <span className="text-white/60 text-xs">Tap to switch themes instantly</span>
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