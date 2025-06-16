// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-primaryDark text-sky py-8 text-center font-sans">
      <div>
        &copy; {new Date().getFullYear()} <span className="text-copper font-bold">75HARD</span> — Built with 💪 by You.
      </div>
    </footer>
  );
}
