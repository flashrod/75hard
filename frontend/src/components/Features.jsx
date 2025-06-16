// src/components/Features.jsx
import { motion } from "framer-motion";
const features = [
  {
    title: "Daily Progress",
    desc: "Track every workout, meal, and milestone with ease.",
    icon: "📈",
  },
  {
    title: "Photo Journal",
    desc: "Upload daily progress photos and see your transformation.",
    icon: "📷",
  },
  {
    title: "Community",
    desc: "Stay motivated with leaderboards and support.",
    icon: "🤝",
  },
  {
    title: "Reminders",
    desc: "Never miss a task with smart notifications.",
    icon: "⏰",
  },
];

export default function Features() {
  return (
    <section className="bg-primary py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-display font-bold text-white text-center mb-12">
          Why <span className="text-highlight">75 Hard</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.7, type: "spring" }}
              viewport={{ once: true }}
              className="bg-sky/10 border-l-4 border-highlight rounded-xl shadow-lg p-8 flex items-center gap-6"
            >
              <span className="text-4xl">{f.icon}</span>
              <div>
                <h3 className="text-2xl text-highlight font-bold">{f.title}</h3>
                <p className="text-white/80 mt-2">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
