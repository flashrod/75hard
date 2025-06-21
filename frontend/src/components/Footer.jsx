// src/components/Footer.jsx

import React from 'react';
import { getOptimalTextColor } from '../utils/colors'; // Make sure this path is correct

export default function Footer({ theme }) {
  // --- THEME-AWARE STYLES ---
  // Calculate the best text color for the footer background
  const textColor = getOptimalTextColor(theme.primary);

  return (
    <footer
      className="py-6 text-center mt-12 transition-colors duration-300"
      style={{
        background: theme.primary,
        color: textColor,
        // Add a subtle top border that matches the secondary theme color
        borderTop: `1px solid ${theme.secondary}20`,
      }}
    >
      <span className="font-display text-lg" style={{ color: theme.secondary }}>
        75HARD
      </span>{' '}
      &copy; {new Date().getFullYear()} — All rights reserved.
    </footer>
  );
}
