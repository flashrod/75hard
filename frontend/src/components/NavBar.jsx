// src/components/Navbar.jsx
import { motion } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Login", href: "/login" },
  { name: "Register", href: "/register" },
];

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full z-50 fixed top-0 left-0 bg-primaryDark bg-opacity-80 backdrop-blur-lg shadow-xl"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2"
        >
          <span className="text-copper font-display text-2xl font-bold tracking-widest">75HARD</span>
        </motion.div>
        <div className="flex gap-8">
          {navLinks.map(link => (
            <motion.a
              key={link.name}
              href={link.href}
              whileHover={{ color: "#0FAA4F", scale: 1.1 }}
              className="font-sans text-lg text-sky hover:text-highlight transition-all"
            >
              {link.name}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
