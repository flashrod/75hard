import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate("/dashboard");
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        await signup(formData.email, formData.password, formData.name);
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-tertiary rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            {isLogin ? "Sign In" : "Create Account"}
          </h1>
          <p className="text-primary">
            {isLogin ? "Welcome back! Sign in to continue." : "Start your 75 Hard journey now."}
          </p>
        </div>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 bg-red-200 text-red-800 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence>
            {!isLogin && (
              <motion.div
                key="name-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-primary font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-primary text-primary placeholder-primary/70 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div>
            <label className="block text-primary font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white border border-primary text-primary placeholder-primary/70 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-primary font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white border border-primary text-primary placeholder-primary/70 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
              placeholder={isLogin ? "Enter your password" : "Create a password"}
              required
            />
          </div>
          <AnimatePresence>
            {!isLogin && (
              <motion.div
                key="confirm-password"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-primary font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-primary text-primary placeholder-primary/70 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                  required={!isLogin}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-primary font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg flex items-center justify-center hover:bg-primary hover:text-secondary"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary border-t-secondary rounded-full animate-spin"></div>
                {isLogin ? "Signing In..." : "Creating Account..."}
              </div>
            ) : (
              isLogin ? "Sign In" : "Create Account"
            )}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-primary">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-secondary font-semibold underline transition-colors"
            >
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
