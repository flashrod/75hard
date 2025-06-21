// src/components/Features.jsx

import { motion } from 'framer-motion';
import { getOptimalTextColor } from '../utils/colors';

export default function Features({ theme }) {
  // --- THEME-AWARE STYLES ---
  const mainTextColor = getOptimalTextColor(theme.primary);
  const cardBg = `linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))`;
  const cardBorderStyle = `1px solid ${theme.secondary}20`;

  // Define features array inside the component to access the theme prop
  const features = [
    { title: "Daily Tracking", desc: "Track everything in one place.", icon: "📊", color: theme.secondary },
    { title: "Progress Photos", desc: "Visually track your transformation.", icon: "📸", color: theme.tertiary },
    { title: "Mental Toughness", desc: "Build unbreakable discipline.", icon: "💪", color: theme.secondary },
    { title: "No Excuses", desc: "Miss a task? Start from day 1.", icon: "🔥", color: theme.tertiary },
    { title: "Community Support", desc: "Join thousands on the same journey.", icon: "👥", color: theme.secondary },
    { title: "Habit Formation", desc: "Create lasting, life-changing habits.", icon: "⚡", color: theme.tertiary }
  ];

  return (
    <section className="py-20" style={{ background: theme.primary }}>
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-display font-bold mb-4"
            style={{ color: mainTextColor, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
          >
            Why Choose{' '}
            <span style={{
              backgroundImage: `linear-gradient(45deg, ${theme.secondary}, ${theme.tertiary})`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}>
              75 Hard?
            </span>
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: mainTextColor, opacity: 0.8 }}>
            This isn't just another fitness challenge. It's a mental transformation program.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="rounded-2xl p-8 transition-all duration-300"
              style={{
                background: cardBg,
                border: cardBorderStyle,
                backdropFilter: 'blur(10px)',
                boxShadow: `0 8px 32px rgba(0, 0, 0, 0.2)`
              }}
            >
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-6 mx-auto"
                style={{
                  background: feature.color,
                  // Ensure the icon emoji is visible on its colored background
                  color: getOptimalTextColor(feature.color)
                }}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-center" style={{ color: mainTextColor }}>
                {feature.title}
              </h3>
              <p className="text-center leading-relaxed" style={{ color: mainTextColor, opacity: 0.7 }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
