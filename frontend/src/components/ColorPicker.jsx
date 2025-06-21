import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, RotateCcw, Download, Upload } from 'lucide-react';

const ColorPicker = ({ theme, onThemeChange, isOpen, onClose }) => {
  const [customTheme, setCustomTheme] = useState(theme);

  // Sync with parent theme changes
  useEffect(() => {
    setCustomTheme(theme);
  }, [theme]);

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
    },
    {
      name: 'Sunset',
      primary: '#1A0F0A',
      secondary: '#FF6B35',
      tertiary: '#F7931E',
      accent: '#FFD23F'
    },
    {
      name: 'Arctic',
      primary: '#0F1419',
      secondary: '#64FFDA',
      tertiary: '#18FFFF',
      accent: '#69F0AE'
    },
    {
      name: 'Royal',
      primary: '#0D0A1A',
      secondary: '#7C4DFF',
      tertiary: '#B388FF',
      accent: '#E1BEE7'
    }
  ];

  const handleColorChange = (colorKey, color) => {
    // Ensure proper hex format
    const hexColor = color.startsWith('#') ? color : `#${color}`;
    const newTheme = { ...customTheme, [colorKey]: hexColor };
    setCustomTheme(newTheme);
    onThemeChange(newTheme);
  };

  const handlePresetSelect = (preset) => {
    setCustomTheme(preset);
    onThemeChange(preset);
  };

  const resetToDefault = () => {
    const defaultTheme = presetThemes[0];
    setCustomTheme(defaultTheme);
    onThemeChange(defaultTheme);
  };

  const exportTheme = () => {
    const themeData = JSON.stringify(customTheme, null, 2);
    const blob = new Blob([themeData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `75hard-theme-${customTheme.name || 'custom'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importTheme = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTheme = JSON.parse(e.target.result);
          setCustomTheme(importedTheme);
          onThemeChange(importedTheme);
        } catch (error) {
          console.error('Invalid theme file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10"
          style={{
            background: `linear-gradient(135deg, ${customTheme.primary}f0 0%, ${customTheme.secondary}20 100%)`,
            backdropFilter: 'blur(20px)',
            boxShadow: `0 25px 50px ${customTheme.secondary}30`
          }}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 p-8 border-b border-white/10"
            style={{ 
              background: `linear-gradient(135deg, ${customTheme.primary}f5 0%, ${customTheme.secondary}15 100%)`,
              backdropFilter: 'blur(20px)'
            }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="p-3 rounded-2xl"
                  style={{ background: `linear-gradient(135deg, ${customTheme.secondary}, ${customTheme.tertiary})` }}
                >
                  <Palette className="w-6 h-6" style={{ color: customTheme.primary }} />
                </motion.div>
                <div>
                  <h2 className="text-3xl font-black text-white">Theme Customizer</h2>
                  <p className="text-white/60">Personalize your 75 Hard experience</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetToDefault}
                  className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
                  title="Reset to default"
                >
                  <RotateCcw className="w-5 h-5 text-white" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportTheme}
                  className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
                  title="Export theme"
                >
                  <Download className="w-5 h-5 text-white" />
                </motion.button>
                
                <motion.label
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/20 cursor-pointer"
                  title="Import theme"
                >
                  <Upload className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    accept=".json"
                    onChange={importTheme}
                    className="hidden"
                  />
                </motion.label>
                
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Preset Themes */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-2 h-8 rounded-full mr-3" style={{ backgroundColor: customTheme.secondary }} />
                Preset Themes
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {presetThemes.map((preset) => (
                  <motion.button
                    key={preset.name}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePresetSelect(preset)}
                    className="group relative p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-white/20 overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-20"
                      style={{ backgroundColor: preset.secondary }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="relative z-10">
                      <div className="flex justify-center space-x-1 mb-3">
                        {[preset.primary, preset.secondary, preset.tertiary, preset.accent].map((color, index) => (
                          <motion.div
                            key={index}
                            className="w-6 h-6 rounded-full border border-white/20"
                            style={{ backgroundColor: color }}
                            whileHover={{ scale: 1.2 }}
                          />
                        ))}
                      </div>
                      <div className="text-white font-semibold text-center">{preset.name}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-2 h-8 rounded-full mr-3" style={{ backgroundColor: customTheme.tertiary }} />
                Custom Colors
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'primary', label: 'Primary', description: 'Main background color', icon: '🎨' },
                  { key: 'secondary', label: 'Secondary', description: 'Primary accent color', icon: '✨' },
                  { key: 'tertiary', label: 'Tertiary', description: 'Secondary accent color', icon: '🌟' },
                  { key: 'accent', label: 'Accent', description: 'Additional accent color', icon: '💫' }
                ].map(({ key, label, description, icon }) => (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-white/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{icon}</div>
                        <div>
                          <div className="text-white font-semibold text-lg">{label}</div>
                          <div className="text-white/60 text-sm">{description}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="w-16 h-16 rounded-2xl border-2 border-white/20 shadow-lg"
                          style={{ 
                            backgroundColor: customTheme[key],
                            boxShadow: `0 8px 25px ${customTheme[key]}40`
                          }}
                        />
                        <div className="relative">
                          <input
                            type="color"
                            value={customTheme[key]}
                            onChange={(e) => handleColorChange(key, e.target.value)}
                            className="w-20 h-16 rounded-2xl border-2 border-white/20 bg-transparent cursor-pointer opacity-0 absolute inset-0"
                          />
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-20 h-16 rounded-2xl border-2 border-white/20 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                          >
                            <Palette className="w-6 h-6 text-white" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-2 h-8 rounded-full mr-3" style={{ backgroundColor: customTheme.accent }} />
                Preview
              </h3>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-2xl border border-white/20 overflow-hidden relative"
                style={{
                  background: `linear-gradient(135deg, ${customTheme.primary} 0%, ${customTheme.secondary}20 100%)`
                }}
              >
                <div className="relative z-10">
                  <h4 
                    className="text-4xl font-black mb-4"
                    style={{
                      background: `linear-gradient(45deg, ${customTheme.secondary}, ${customTheme.tertiary})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent'
                    }}
                  >
                    75 HARD Challenge
                  </h4>
                  <p className="text-white/80 text-lg mb-6">
                    This is how your theme will look across the application.
                  </p>
                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="px-6 py-3 rounded-xl font-semibold"
                      style={{
                        background: `linear-gradient(135deg, ${customTheme.secondary}, ${customTheme.tertiary})`,
                        color: customTheme.primary
                      }}
                    >
                      Primary Button
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="px-6 py-3 rounded-xl font-semibold border"
                      style={{
                        borderColor: customTheme.secondary,
                        color: customTheme.secondary,
                        background: 'transparent'
                      }}
                    >
                      Secondary Button
                    </motion.button>
                  </div>
                </div>
                
                {/* Animated background elements */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-4 right-4 w-32 h-32 rounded-full blur-2xl"
                  style={{ backgroundColor: customTheme.secondary }}
                />
                <motion.div
                  animate={{ 
                    scale: [1.2, 1, 1.2],
                    opacity: [0.1, 0.15, 0.1]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                  className="absolute bottom-4 left-4 w-24 h-24 rounded-full blur-2xl"
                  style={{ backgroundColor: customTheme.tertiary }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ColorPicker;
