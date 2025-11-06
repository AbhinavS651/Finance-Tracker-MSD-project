import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import Income from "./components/Income";
import Expenses from "./components/Expenses";
import Reports from "./components/Reports";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Default route → Landing Page */}
        <Route path="/" element={<LandingPage />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected route for logged-in users */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Income, Expenses, and Reports */}
        <Route
          path="/income"
          element={user ? <Income /> : <Navigate to="/login" />}
        />
        <Route
          path="/expenses"
          element={user ? <Expenses /> : <Navigate to="/login" />}
        />
        <Route path="/reports" element={<Reports />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
