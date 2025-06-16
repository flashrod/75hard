import { motion } from "framer-motion";

const features = [
  {
    title: "Track Progress",
    desc: "Check off each task daily and visualize your streak.",
    icon: "✅",
  },
  {
    title: "Photo Journal",
    desc: "Upload a daily progress photo and see your transformation.",
    icon: "📸",
  },
  {
    title: "Stay Motivated",
    desc: "See stats, get reminders, and never miss a day.",
    icon: "🔥",
  },
];

export default function Features() {
  return (
    <section className="bg-tertiary py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary text-center mb-10">
          Why <span className="text-secondary">75 Hard?</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.7, type: "spring" }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center"
            >
              <span className="text-4xl mb-4">{f.icon}</span>
              <h3 className="text-xl font-bold text-primary mb-2">{f.title}</h3>
              <p className="text-primary text-center">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
