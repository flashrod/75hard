import { motion } from "framer-motion";

const features = [
  {
    title: "Daily Tracking",
    desc: "Track your workouts, water intake, diet, reading, and progress photos all in one place.",
    icon: "📊",
    color: "bg-secondary"
  },
  {
    title: "Progress Photos",
    desc: "Upload daily photos to visually track your transformation over 75 days.",
    icon: "📸",
    color: "bg-tertiary"
  },
  {
    title: "Mental Toughness",
    desc: "Build unbreakable discipline through consistent daily habits and accountability.",
    icon: "💪",
    color: "bg-secondary"
  },
  {
    title: "No Excuses",
    desc: "Miss a single task? Start over from day 1. This challenge demands perfection.",
    icon: "🔥",
    color: "bg-tertiary"
  },
  {
    title: "Community Support",
    desc: "Join thousands of others on the same journey towards mental and physical transformation.",
    icon: "👥",
    color: "bg-secondary"
  },
  {
    title: "Habit Formation",
    desc: "Create lasting habits that will serve you long after the 75 days are complete.",
    icon: "⚡",
    color: "bg-tertiary"
  }
];

export default function Features() {
  return (
    <section className="bg-text py-20">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
            Why Choose <span className="text-secondary">75 Hard?</span>
          </h2>
          <p className="text-xl text-primary max-w-2xl mx-auto">
            This isn't just another fitness challenge. It's a complete mental transformation program.
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
              whileHover={{ scale: 1.05 }}
              className="bg-primary rounded-2xl p-8 shadow-primary hover:shadow-secondary transition-all duration-300"
            >
              <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center text-2xl mb-6 mx-auto`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-text mb-4 text-center">{feature.title}</h3>
              <p className="text-tertiary text-center leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
