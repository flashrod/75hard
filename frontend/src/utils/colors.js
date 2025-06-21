// src/utils/colors.js

/**
 * Calculates the perceived luminance of a color to determine if it's light or dark.
 * @param {string} hex - The hex color code (e.g., "#RRGGBB").
 * @returns {number} A value from 0 (darkest) to 1 (lightest).
 */
function getLuminance(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Determines the best contrasting text color (black or white) for a given background.
 * @param {string} backgroundColor - The hex code of the background.
 * @returns {'#000000'} for black or {'#FFFFFF'} for white.
 */
export function getOptimalTextColor(backgroundColor) {
  return getLuminance(backgroundColor) > 0.5 ? '#000000' : '#FFFFFF';
}
