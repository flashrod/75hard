// src/pages/Home.jsx

import React from "react";
// Navbar, Footer, and ColorPicker are now managed in App.jsx
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import ColorPicker from "../components/ColorPicker";

import Landing from "../components/Landing";
import Features from "../components/Features";
import CallToAction from "../components/CallToAction";

// Accept theme and colorPicker props from App.jsx
export default function Home({ theme, colorPickerOpen, setColorPickerOpen }) {
  // theme state removed - now comes from props

  return (
    <div className="relative min-h-screen">
      {/* Navbar, Footer, ColorPicker removed from here - now in App.jsx */}
      
      {/* All sections receive theme as prop */}
      <Landing theme={theme} />
      <Features theme={theme} />
      <CallToAction theme={theme} />
      
      {/* Footer and ColorPicker are handled by App.jsx now */}
    </div>
  );
}
