import Navbar from "../components/Navbar";
import Landing from "../components/Landing";
import Features from "../components/Features";
import CallToAction from "../components/CallToAction"
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Landing />
        <Features />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
