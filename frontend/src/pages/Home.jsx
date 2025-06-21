import Navbar from "../components/NavBar";
import Landing from "../components/Landing";
import Features from "../components/Features";
import CallToAction from "../components/CallToAction"
import Footer from "../components/Footer";
import React, { useState, useEffect } from "react";
export default function Home() {
  const [theme, setTheme] = useState({
    name: 'Ocean',
    primary: '#0B1426',
    secondary: '#00D4FF',
    tertiary: '#4ECDC4',
    accent: '#FF6B6B'
  });

  return (
    <div>
      <Navbar theme={theme} onColorChange={setTheme} />
      <Landing theme={theme} />
    </div>
  );
}