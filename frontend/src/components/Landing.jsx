import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Palette, X } from 'lucide-react';

const Landing = ({ theme }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="relative">
      <motion.section 
        className="min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden"
        style={{ 
          background: `radial-gradient(ellipse at top, ${theme.primary}00 0%, ${theme.primary} 50%), linear-gradient(135deg, ${theme.primary} 0%, #000000 100%)` 
        }}
      >
        {/* Dynamic background elements */}
        <motion.div
          style={{ y: y1 }}
          className="absolute inset-0 opacity-30"
        >
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 4 + 1,
                height: Math.random() * 4 + 1,
                backgroundColor: theme.secondary,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>

        <motion.div
          style={{ y: y2 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: theme.secondary }}
        />
        
        <motion.div
          style={{ y: y1 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, delay: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: theme.tertiary }}
        />

        {/* Main content */}
        <motion.div 
          style={{ opacity }}
          className="max-w-6xl mx-auto text-center z-10 relative"
        >
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-12"
          >
            <motion.h1 
              className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none"
              style={{ 
                background: `linear-gradient(135deg, #ffffff 0%, ${theme.secondary} 30%, ${theme.tertiary} 70%, #ffffff 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: `0 0 80px ${theme.secondary}40`
              }}
            >
              Master Your
              <motion.span 
                className="block"
                animate={{ 
                  textShadow: [
                    `0 0 20px ${theme.secondary}80`,
                    `0 0 40px ${theme.secondary}60`,
                    `0 0 20px ${theme.secondary}80`
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ 
                  background: `linear-gradient(45deg, ${theme.secondary}, ${theme.tertiary})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                75 Hard Challenge
              </motion.span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-2xl md:text-3xl max-w-4xl mx-auto leading-relaxed text-white/90 font-light"
            >
              Transform your mindset, build unbreakable discipline, and achieve your goals with the ultimate mental toughness program.
            </motion.p>
          </motion.div>

          {/* Enhanced CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-12 py-5 font-black text-xl rounded-2xl overflow-hidden shadow-2xl group"
              style={{ 
                background: `linear-gradient(135deg, ${theme.secondary}, ${theme.tertiary})`,
                color: theme.primary,
                boxShadow: `0 20px 40px ${theme.secondary}40`
              }}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
              <span className="relative z-10">Start Your Journey</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-12 py-5 font-black text-xl rounded-2xl border-2 transition-all duration-500 overflow-hidden group"
              style={{ 
                borderColor: theme.secondary,
                color: '#ffffff',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <motion.div
                className="absolute inset-0"
                style={{ backgroundColor: theme.secondary }}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4 }}
                transformOrigin="left"
              />
              <span 
                className="relative z-10 group-hover:text-white transition-colors duration-400"
                style={{ color: theme.secondary }}
              >
                Learn More
              </span>
            </motion.button>
          </motion.div>

          {/* Enhanced Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { number: "75", label: "Days to Transform" },
              { number: "6", label: "Daily Tasks" },
              { number: "100%", label: "Commitment Required" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative p-8 rounded-3xl backdrop-blur-xl border border-white/10 overflow-hidden group"
                style={{ 
                  background: 'rgba(255,255,255,0.05)',
                  boxShadow: `0 20px 40px ${theme.secondary}20`
                }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20"
                  style={{ backgroundColor: theme.secondary }}
                  transition={{ duration: 0.4 }}
                />
                <motion.div 
                  className="text-5xl md:text-6xl font-black mb-3"
                  style={{ 
                    background: `linear-gradient(45deg, ${theme.secondary}, ${theme.tertiary})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                  }}
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-white/80 text-lg font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Enhanced scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-8 h-12 rounded-full border-2 border-white/40 flex justify-center backdrop-blur-sm"
            style={{ borderColor: theme.secondary }}
          >
            <motion.div
              className="w-2 h-4 rounded-full mt-2"
              style={{ backgroundColor: theme.secondary }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.section>
      
      {/* Additional content section */}
      <section className="min-h-screen flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${theme.primary} 0%, #000000 100%)` }}>
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <motion.h2 
            className="text-6xl font-bold mb-8"
            style={{ 
              background: `linear-gradient(45deg, ${theme.secondary}, ${theme.tertiary})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
          >
            The Challenge Rules
          </motion.h2>
          <motion.p className="text-2xl leading-relaxed text-white/80">
            Follow a diet, work out twice daily, drink a gallon of water, read 10 pages, and take a progress photo every single day for 75 days straight.
          </motion.p>
        </div>
      </section>
    </div>
  );
};

const ColorPicker = ({ theme, onThemeChange, isOpen, onClose }) => {
  const [customTheme, setCustomTheme] = useState(theme);

  const presetThemes = [
    {
      name: 'Ocean',
      primary: '#0B1426',
      secondary: '#00D4FF',
      tertiary: '#4ECDC4',
      accent: '#FF6B6B'
    },
    {
      name: 'Fire',
      primary: '#1A0A0A',
      secondary: '#FF4500',
      tertiary: '#FF6B35',
      accent: '#FFB347'
    },
    {
      name: 'Forest',
      primary: '#0D1B0D',
      secondary: '#00FF41',
      tertiary: '#32CD32',
      accent: '#90EE90'
    },
    {
      name: 'Purple',
      primary: '#1A0D1A',
      secondary: '#8A2BE2',
      tertiary: '#DA70D6',
      accent: '#DDA0DD'
    },
    {
      name: 'Cyber',
      primary: '#0A0A0A',
      secondary: '#00FFFF',
      tertiary: '#FF00FF',
      accent: '#FFFF00'
    }
  ];

  const handleColorChange = (colorKey, color) => {
    const newTheme = { ...customTheme, [colorKey]: color };
    setCustomTheme(newTheme);
    onThemeChange(newTheme);
  };

  const handlePresetSelect = (preset) => {
    setCustomTheme(preset);
    onThemeChange(preset);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/10"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Customize Colors</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Preset Themes */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Preset Themes</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {presetThemes.map((preset) => (
              <motion.button
                key={preset.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePresetSelect(preset)}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-white/20"
              >
                <div className="flex space-x-2 mb-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.primary }} />
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.secondary }} />
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.tertiary }} />
                </div>
                <div className="text-white font-medium">{preset.name}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Custom Colors</h3>
          <div className="space-y-6">
            {[
              { key: 'primary', label: 'Primary (Background)', description: 'Main background color' },
              { key: 'secondary', label: 'Secondary (Accent)', description: 'Primary accent color' },
              { key: 'tertiary', label: 'Tertiary (Highlight)', description: 'Secondary accent color' },
              { key: 'accent', label: 'Accent (Extra)', description: 'Additional accent color' }
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                <div>
                  <div className="text-white font-medium">{label}</div>
                  <div className="text-white/60 text-sm">{description}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-12 h-12 rounded-xl border-2 border-white/20"
                    style={{ backgroundColor: customTheme[key] }}
                  />
                  <input
                    type="color"
                    value={customTheme[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-16 h-12 rounded-xl border-2 border-white/20 bg-transparent cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="w-full mt-8 py-4 font-bold text-lg rounded-2xl transition-all"
          style={{ 
            background: `linear-gradient(135deg, ${customTheme.secondary}, ${customTheme.tertiary})`,
            color: customTheme.primary
          }}
        >
          Apply Changes
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [theme, setTheme] = useState({
    name: 'Ocean',
    primary: '#0B1426',
    secondary: '#00D4FF',
    tertiary: '#4ECDC4',
    accent: '#FF6B6B'
  });
  
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  return (
    <div className="relative">
      <Landing theme={theme} />
      
      {/* Color Picker Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setColorPickerOpen(true)}
        className="fixed top-6 right-6 p-4 rounded-full backdrop-blur-xl border border-white/20 z-40 shadow-2xl"
        style={{ 
          background: 'rgba(255,255,255,0.1)',
          color: theme.secondary
        }}
      >
        <Palette className="w-6 h-6" />
      </motion.button>

      <ColorPicker
        theme={theme}
        onThemeChange={setTheme}
        isOpen={colorPickerOpen}
        onClose={() => setColorPickerOpen(false)}
      />
    </div>
  );
}