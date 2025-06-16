import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section className="bg-gradient-primary py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text mb-6">
            Ready to Change Your Life?
          </h2>
          <p className="text-xl text-tertiary mb-8 max-w-2xl mx-auto">
            Join thousands who have already transformed their lives through the 75 Hard Challenge. 
            Your journey to mental toughness starts today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/auth"
              className="bg-secondary text-primary font-bold px-10 py-4 rounded-xl text-lg shadow-secondary hover:scale-105 transition-all duration-300"
            >
              Start 75 Hard Today
            </Link>
            <div className="text-tertiary text-sm">
              No equipment needed • No gym required • Just commitment
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
