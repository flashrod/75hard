import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { currentUser, logout } = useAuth();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <nav className="bg-primary w-full fixed top-0 left-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl font-bold text-secondary tracking-widest">
          75HARD
        </Link>
        <div className="flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.name}
              to={link.href}
              className="text-white font-semibold hover:text-secondary transition"
            >
              {link.name}
            </Link>
          ))}
          {currentUser ? (
            <button
              onClick={logout}
              className="text-white font-semibold hover:text-secondary transition"
            >
              Logout
            </button>
          ) : (
            <Link to="/auth" className="bg-secondary text-primary font-bold px-4 py-2 rounded-lg shadow hover:bg-primary hover:text-secondary transition">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
// This code defines a responsive navigation bar for a web application using React and Framer Motion.