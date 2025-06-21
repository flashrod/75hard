import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Palette, Menu, X, Zap, Target, Trophy } from 'lucide-react';
import { getComplementaryColor } from '../utils/colors';

const Navbar = ({ theme, onColorPickerOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');
  const { scrollY } = useScroll();
  
  const navbarOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);
  const navbarBlur = useTransform(scrollY, [0, 100], [10, 20]);
  
  const compColor = getComplementaryColor(theme.primary);
  
  const navItems = [
    { name: 'Home', href: '#home', icon: Target },
    { name: 'Challenge', href: '#challenge', icon: Zap },
    { name: 'Rules', href: '#rules', icon: Trophy },
    { name: 'Progress', href: '#progress', icon: Target },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.querySelector(item.href));
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section, index) => {
        if (section) {
          const top = section.offsetTop;
          const bottom = top + section.offsetHeight;
          
          if (scrollPosition >= top && scrollPosition < bottom) {
            setActiveItem(navItems[index].name);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      style={{ 
        opacity: navbarOpacity,
        backdropFilter: `blur(${navbarBlur}px)`,
        background: `linear-gradient(90deg, ${theme.primary}dd 0%, ${theme.secondary}22 50%, ${theme.primary}dd 100%)`,
        borderBottom: `1px solid ${theme.secondary}40`,
        boxShadow: `0 8px 32px ${theme.secondary}20`
      }}
      className="fixed top-0 w-full z-50 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, ${theme.secondary}, ${theme.tertiary})`,
                boxShadow: `0 4px 20px ${theme.secondary}40`
              }}
            >
              <Zap className="w-6 h-6" style={{ color: theme.primary }} />
            </motion.div>
            
            <motion.h1 
              className="text-3xl font-black tracking-tight"
              style={{
                background: `linear-gradient(45deg, ${theme.secondary}, ${theme.tertiary}, ${compColor})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: `0 2px 20px ${theme.secondary}50`
              }}
            >
              75<span style={{ color: compColor }}>HARD</span>
            </motion.h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;
              
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={() => setActiveItem(item.name)}
                  whileHover={{ 
                    scale: 1.1,
                    y: -2
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="relative flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300"
                  style={{
                    color: isActive ? compColor : '#ffffff',
                    background: isActive ? `${theme.secondary}20` : 'transparent',
                    border: isActive ? `1px solid ${theme.secondary}40` : '1px solid transparent',
                    textShadow: isActive ? `0 0 10px ${compColor}80` : 'none'
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 rounded-xl"
                      style={{ 
                        background: `linear-gradient(135deg, ${theme.secondary}30, ${theme.tertiary}30)`,
                        border: `1px solid ${theme.secondary}60`
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.a>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Color Picker Button */}
            <motion.button
              whileHover={{ 
                scale: 1.1,
                rotate: 180,
                backgroundColor: `${compColor}22`
              }}
              whileTap={{ scale: 0.9 }}
              onClick={onColorPickerOpen}
              className="p-3 rounded-xl border transition-all duration-300"
              style={{
                borderColor: theme.secondary,
                background: `linear-gradient(135deg, ${theme.secondary}20, ${theme.tertiary}20)`,
                color: theme.secondary,
                boxShadow: `0 4px 20px ${theme.secondary}30`
              }}
              aria-label="Open color picker"
            >
              <Palette className="w-5 h-5" />
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-3 rounded-xl border transition-all duration-300"
              style={{
                borderColor: theme.secondary,
                background: `${theme.secondary}20`,
                color: theme.secondary
              }}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ 
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden overflow-hidden"
        >
          <div className="pt-6 pb-4 space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;
              
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    setActiveItem(item.name);
                    setIsOpen(false);
                  }}
                  whileHover={{ x: 10 }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300"
                  style={{
                    color: isActive ? compColor : '#ffffff',
                    background: isActive ? `${theme.secondary}20` : 'transparent',
                    border: `1px solid ${isActive ? theme.secondary + '40' : 'transparent'}`
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
