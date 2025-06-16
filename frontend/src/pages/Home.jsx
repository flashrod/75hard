import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Landing from "../components/Landing";
import Features from "../components/Features";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="font-sans bg-primary-dark min-h-screen">
      <Navbar />
      <main>
        <Landing />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
