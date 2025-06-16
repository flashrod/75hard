import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { currentUser, backendUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const navLinks = currentUser 
    ? [
        { name: "Home", href: "/" },
        { name: "Dashboard", href: "/dashboard" },
      ]
    : [
        { name: "Home", href: "/" },
        { name: "Sign In", href: "/auth" },
      ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full z-50 fixed top-0 left-0 bg-primary-dark bg-opacity-80 backdrop-blur-lg shadow-xl"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2"
        >
          <Link to="/" className="text-copper font-display text-2xl font-bold tracking-widest">
            75HARD
          </Link>
        </motion.div>
        
        <div className="flex items-center gap-8">
          {navLinks.map(link => (
            <motion.div key={link.name}>
              <Link
                to={link.href}
                className="font-sans text-lg text-sky hover:text-accent transition-all"
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
          
          {currentUser && (
            <>
              <div className="text-sky text-sm">
                Day {backendUser?.currentChallengeDay || 0}
              </div>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                className="font-sans text-lg text-sky hover:text-accent transition-all"
              >
                Logout
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
// This code defines a responsive navigation bar using React and Framer Motion for animations.