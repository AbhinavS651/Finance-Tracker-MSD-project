import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import loginBg from "../assets/login-bg.jpg";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${loginBg})`,
      }}
    >
      <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg w-96 border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create Your Account 
        </h2>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          {/* 🌿 Stylish gradient Sign Up button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-semibold py-2 rounded-lg 
                       hover:from-emerald-500 hover:to-teal-600 hover:shadow-lg hover:shadow-emerald-200/50 
                       transition-all duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-700">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-emerald-600 cursor-pointer hover:underline"
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
