// src/App.jsx
import Navbar from "./components/NavBar";
import Landing from "./components/Landing";
import Features from "./components/Features";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="font-sans bg-primaryDark min-h-screen">
      <Navbar />
      <main>
        <Landing />
        <Features />
      </main>
      <Footer />
    </div>
  );
}

export default App;
