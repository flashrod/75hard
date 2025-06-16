import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <section className="min-h-screen bg-primary flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-20 left-20 w-32 h-32 bg-secondary rounded-full blur-xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, delay: 1, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-20 right-20 w-40 h-40 bg-tertiary rounded-full blur-xl"
      />
      
      {/* Main content */}
      <div className="max-w-4xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-display font-bold text-text mb-6">
            Master Your
            <span className="text-secondary block">75 Hard Challenge</span>
          </h1>
          <p className="text-xl md:text-2xl text-tertiary max-w-2xl mx-auto leading-relaxed">
            Transform your mindset, build unbreakable discipline, and achieve your goals with the ultimate mental toughness program.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Link
            to="/auth"
            className="bg-secondary text-primary font-bold px-8 py-4 rounded-xl text-lg shadow-secondary hover:scale-105 transition-all duration-300"
          >
            Start Your Journey
          </Link>
          <button className="bg-transparent border-2 border-text text-text font-bold px-8 py-4 rounded-xl text-lg hover:bg-text hover:text-primary transition-all duration-300">
            Learn More
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary">75</div>
            <div className="text-tertiary">Days to Transform</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary">6</div>
            <div className="text-tertiary">Daily Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary">100%</div>
            <div className="text-tertiary">Commitment Required</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-text rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-text rounded-full mt-2"></div>
        </motion.div>
      </motion.div>
    </section>
  );
}
