// src/components/CallToAction.jsx

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getOptimalTextColor } from '../utils/colors';

export default function CallToAction({ theme }) {
  // --- THEME-AWARE STYLES ---
  const mainTextColor = getOptimalTextColor(theme.primary);
  const buttonTextColor = getOptimalTextColor(theme.secondary);

  return (
    <section
      className="py-20"
      style={{
        // Create a spotlight effect with the theme colors
        background: `radial-gradient(ellipse at center, ${theme.secondary}1A 0%, ${theme.primary} 70%)`
      }}
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2
            className="text-4xl md:text-5xl font-display font-bold mb-6"
            style={{ color: mainTextColor, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            Ready to Change Your Life?
          </h2>
          <p
            className="text-xl mb-8 max-w-2xl mx-auto"
            style={{ color: mainTextColor, opacity: 0.8 }}
          >
            Join thousands who have already transformed their lives. Your journey to mental toughness starts today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/auth"
                className="font-bold px-10 py-4 rounded-xl text-lg transition-all duration-300 block"
                style={{
                  background: theme.secondary,
                  color: buttonTextColor,
                  boxShadow: `0 10px 30px -10px ${theme.secondary}60`
                }}
              >
                Start 75 Hard Today
              </Link>
            </motion.div>
            <div className="text-sm" style={{ color: mainTextColor, opacity: 0.7 }}>
              No equipment needed • Just commitment
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
