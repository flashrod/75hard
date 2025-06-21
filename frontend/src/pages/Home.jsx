import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Landing from "../components/Landing";
import Features from "../components/Features";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";
import ColorPicker from "../components/ColorPicker";
import { getComplementaryColor } from '../utils/colors';

export default function Home() {
  const [theme, setTheme] = useState({
    name: 'Ocean',
    primary: '#0B1426',
    secondary: '#00D4FF',
    tertiary: '#4ECDC4',
    accent: '#FF6B6B'
  });
  
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div className="relative min-h-screen">
      <Navbar 
        theme={theme} 
        onColorPickerOpen={() => setColorPickerOpen(true)} 
      />
      
      <Landing theme={theme} />
      
      <Features theme={theme} />
      
      <CallToAction theme={theme} />
      
      <Footer theme={theme} />
      
      <ColorPicker
        theme={theme}
        onThemeChange={handleThemeChange}
        isOpen={colorPickerOpen}
        onClose={() => setColorPickerOpen(false)}
      />
    </div>
  );
}
