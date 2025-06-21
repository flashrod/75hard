// src/App.jsx

import React, { useState } from 'react'; // Import useState
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Challenge from './pages/Challenge';
import Rules from './pages/Rules';
import ProtectedRoute from './components/ProtectedRoute';
import ColorPicker from './components/ColorPicker'; // Import ColorPicker
import Navbar from './components/Navbar'; // Import Navbar for global access
import Footer from './components/Footer'; // Import Footer for global access
import './app.css';

function App() {
  // Move theme state to App.jsx to make it global
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
    <AuthProvider>
      <Router>
        {/*
          Navbar, Footer, and ColorPicker are rendered outside of Routes
          so they are always present and can access the global theme state.
        */}
        <Navbar 
          theme={theme} 
          onColorPickerOpen={() => setColorPickerOpen(true)} 
        />
        
        {/*
          The main content area, which will change based on the route.
          We apply padding-top here to account for the fixed Navbar.
        */}
        <div style={{ paddingTop: '4rem' }}> {/* Adjust padding as needed for your Navbar's height */}
          <Routes>
            {/* Pass theme and colorPickerOpen state to all relevant pages */}
            <Route path="/" element={<Home theme={theme} colorPickerOpen={colorPickerOpen} setColorPickerOpen={setColorPickerOpen} />} />
            <Route path="/auth" element={<Auth theme={theme} />} /> {/* Auth page probably needs theme too */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard theme={theme} colorPickerOpen={colorPickerOpen} setColorPickerOpen={setColorPickerOpen} /></ProtectedRoute>} />
            <Route path="/challenge" element={<Challenge theme={theme} />} />
            <Route path="/rules" element={<Rules theme={theme} />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Footer is also globally available */}
        <Footer theme={theme} />

        {/* ColorPicker is also globally available */}
        <ColorPicker
          theme={theme}
          onThemeChange={handleThemeChange}
          isOpen={colorPickerOpen}
          onClose={() => setColorPickerOpen(false)}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
