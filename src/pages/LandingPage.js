import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css"; // for bg-finance class

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-finance min-h-screen text-gray-800 font-inter">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-sky-200 to-teal-100 text-gray-800 py-12 text-center shadow-sm bg-opacity-90">
        <h1 className="text-5xl font-bold mb-2">Track. Save. Grow. </h1>
        <p className="text-lg mb-6 text-gray-600">
          Your personal finance dashboard to control expenses and build savings effortlessly.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-white/80 text-gray-800 font-semibold px-6 py-2 rounded-lg shadow hover:bg-sky-200 hover:text-gray-900 transition"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-white/80 text-gray-800 font-semibold px-6 py-2 rounded-lg shadow hover:bg-sky-200 hover:text-gray-900 transition"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* FEATURES SECTION */}
      <section className="text-center py-12 bg-white/70 backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-6 text-gray-700">✨ Features</h2>
        <div className="flex flex-wrap justify-center gap-6 px-4">
          <div className="bg-gradient-to-br from-sky-100 to-blue-200 text-gray-800 p-6 rounded-2xl shadow-md w-64 hover:-translate-y-2 transition">
            <h3 className="text-xl font-bold mb-2"> Expense Tracking</h3>
            <p>Log and categorize every spend effortlessly.</p>
          </div>
          <div className="bg-gradient-to-br from-teal-100 to-emerald-200 text-gray-800 p-6 rounded-2xl shadow-md w-64 hover:-translate-y-2 transition">
            <h3 className="text-xl font-bold mb-2"> Budgets & Alerts</h3>
            <p>Stay on track with real-time reminders.</p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-indigo-200 text-gray-800 p-6 rounded-2xl shadow-md w-64 hover:-translate-y-2 transition">
            <h3 className="text-xl font-bold mb-2"> Reports & Graphs</h3>
            <p>Visual insights for smarter decisions.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="text-center py-12 bg-slate-50/70">
        <h2 className="text-2xl font-bold mb-6 text-gray-700"> What Users Say</h2>
        <p className="italic text-gray-700 bg-white/80 p-4 rounded-lg shadow-md mx-auto mb-4 w-80">
          “Finance Tracker helped me save ₹10,000 in just 3 months!”
        </p>
        <p className="italic text-gray-700 bg-white/80 p-4 rounded-lg shadow-md mx-auto w-80">
          “The clean dashboard makes budgeting actually fun!”
        </p>
      </section>

      {/* CTA SECTION */}
      <section className="text-center py-16 bg-gradient-to-r from-teal-200 to-sky-100 text-gray-800 px-4">
        <h2 className="text-3xl font-bold mb-4"> Take control of your money today</h2>
        <button
          onClick={() => navigate("/signup")}
          className="bg-white/80 text-gray-800 font-semibold px-8 py-3 rounded-full hover:bg-sky-200 hover:text-gray-900 transition"
        >
          Get Started Free
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-200 py-4 text-center text-sm">
        <p>© 2025 Finance Tracker | About | Privacy | Contact</p>
      </footer>
    </div>
  );
}

export default LandingPage;
