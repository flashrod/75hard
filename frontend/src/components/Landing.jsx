import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Landing({ theme }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <motion.section 
      className="min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden"
      style={{ 
        background: `radial-gradient(ellipse at top, ${theme.primary}00 0%, ${theme.primary} 50%), linear-gradient(135deg, ${theme.primary} 0%, #000000 100%)` 
      }}
    >
      {/* Dynamic background elements */}
      <motion.div
        style={{ y: y1 }}
        className="absolute inset-0 opacity-30"
      >
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              backgroundColor: theme.secondary,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: theme.secondary }}
      />
      
      <motion.div
        style={{ y: y1 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, delay: 1, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl"
        style={{ backgroundColor: theme.tertiary }}
      />

      {/* Main content */}
      <motion.div 
        style={{ opacity }}
        className="max-w-6xl mx-auto text-center z-10 relative"
      >
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-12"
        >
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none"
            style={{ 
              background: `linear-gradient(135deg, #ffffff 0%, ${theme.secondary} 30%, ${theme.tertiary} 70%, #ffffff 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textShadow: `0 0 80px ${theme.secondary}40`
            }}
          >
            Master Your
            <motion.span 
              className="block"
              animate={{ 
                textShadow: [
                  `0 0 20px ${theme.secondary}80`,
                  `0 0 40px ${theme.secondary}60`,
                  `0 0 20px ${theme.secondary}80`
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ 
                background: `linear-gradient(45deg, ${theme.secondary}, ${theme.tertiary})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              75 Hard Challenge
            </motion.span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-2xl md:text-3xl max-w-4xl mx-auto leading-relaxed text-white/90 font-light"
          >
            Transform your mindset, build unbreakable discipline, and achieve your goals with the ultimate mental toughness program.
          </motion.p>
        </motion.div>

        {/* Enhanced CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <motion.a
            href="/auth"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-12 py-5 font-black text-xl rounded-2xl overflow-hidden shadow-2xl group"
            style={{ 
              background: `linear-gradient(135deg, ${theme.secondary}, ${theme.tertiary})`,
              color: theme.primary,
              boxShadow: `0 20px 40px ${theme.secondary}40`
            }}
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
            <span className="relative z-10">Start Your Journey</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </motion.a>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-12 py-5 font-black text-xl rounded-2xl border-2 transition-all duration-500 overflow-hidden group"
            style={{ 
              borderColor: theme.secondary,
              color: '#ffffff',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ backgroundColor: theme.secondary }}
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.4 }}
              transformOrigin="left"
            />
            <span 
              className="relative z-10 group-hover:text-white transition-colors duration-400"
              style={{ color: theme.secondary }}
            >
              Learn More
            </span>
          </motion.button>
        </motion.div>

        {/* Enhanced Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {[
            { number: "75", label: "Days to Transform" },
            { number: "6", label: "Daily Tasks" },
            { number: "100%", label: "Commitment Required" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative p-8 rounded-3xl backdrop-blur-xl border border-white/10 overflow-hidden group"
              style={{ 
                background: 'rgba(255,255,255,0.05)',
                boxShadow: `0 20px 40px ${theme.secondary}20`
              }}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-20"
                style={{ backgroundColor: theme.secondary }}
                transition={{ duration: 0.4 }}
              />
              <motion.div 
                className="text-5xl md:text-6xl font-black mb-3"
                style={{ 
                  background: `linear-gradient(45deg, ${theme.secondary}, ${theme.tertiary})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              >
                {stat.number}
              </motion.div>
              <div className="text-white/80 text-lg font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Enhanced scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-8 h-12 rounded-full border-2 border-white/40 flex justify-center backdrop-blur-sm"
          style={{ borderColor: theme.secondary }}
        >
          <motion.div
            className="w-2 h-4 rounded-full mt-2"
            style={{ backgroundColor: theme.secondary }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

// Usage Example:
// const theme = {
//   name: 'Ocean',
//   primary: '#0B1426',
//   secondary: '#00D4FF',
//   tertiary: '#4ECDC4',
//   accent: '#FF6B6B'
// };
// 
// <Landing theme={theme} />