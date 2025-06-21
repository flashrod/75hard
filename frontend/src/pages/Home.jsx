// src/pages/Home.jsx

import React, { useState } from "react";
import Navbar from "../components/NavBar";
import Landing from "../components/Landing";
import ColorPicker from "../components/ColorPicker";

// FIXED: Added the missing component imports
import Features from "../components/Features";
import CallToAction from "../components/CalltoAction";
import Footer from "../components/Footer";

export default function Home() {
  // --- THEME STATE ---
  // This state will be passed down as props to all child components
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
      {/* The Navbar component receives the theme and the function to open the color picker */}
      <Navbar 
        theme={theme} 
        onColorPickerOpen={() => setColorPickerOpen(true)} 
      />
      
      {/* Each major section of your page receives the current theme as a prop */}
      <Landing theme={theme} />
      
      <Features theme={theme} />
      
      <CallToAction theme={theme} />
      
      
      {/* The ColorPicker component controls the theme for the entire page */}
      <ColorPicker
        theme={theme}
        onThemeChange={handleThemeChange}
        isOpen={colorPickerOpen}
        onClose={() => setColorPickerOpen(false)}
      />
    </div>
  );
}
