// src/components/Landing.jsx
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primaryDark via-primary to-sky overflow-hidden">
      {/* Background Mountains & Water (SVG or Image) */}
      <img
        src="https://pplx-res.cloudinary.com/image/upload/v1750059142/user_uploads/73529264/e3c74e0e-d65a-4d4d-a27b-d9a0a1eab7f6/image.jpg"
        alt="mountain"
        className="absolute inset-0 w-full h-full object-cover opacity-80 pointer-events-none"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primaryDark/60 to-transparent" />
      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, type: "spring" }}
          className="font-display text-5xl md:text-7xl font-bold text-white drop-shadow-lg"
        >
          A New <span className="text-highlight">Generation</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-6 text-xl md:text-2xl text-sky font-light"
        >
          Transform your life in 75 days.<br />
          Track. Achieve. Repeat.
        </motion.p>
        <motion.a
          href="/register"
          whileHover={{ scale: 1.07, backgroundColor: "#0FAA4F" }}
          className="mt-10 inline-block px-8 py-4 rounded-full bg-copper text-white font-bold shadow-lg text-lg transition-all"
        >
          Start Your Challenge
        </motion.a>
      </div>
      {/* Decorative Ripples */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3 }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-sky opacity-20 blur-3xl"
      />
    </section>
  );
}
