import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Income() {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleAddIncome = async (e) => {
    e.preventDefault();

    if (!amount || !source) {
      setMessage("Please fill all fields!");
      return;
    }

    try {
      await addDoc(collection(db, "income"), {
        userId: auth.currentUser.uid,
        amount: Number(amount),
        source,
        date: date || new Date().toISOString().split("T")[0], // defaults to today's date
        createdAt: serverTimestamp(),
      });

      setAmount("");
      setSource("");
      setDate("");
      setMessage("✅ Income added successfully!");

      // Clear message after 2s
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Error adding income:", err);
      setMessage("❌ Failed to add income. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          💰 Add Income
        </h2>

        <form onSubmit={handleAddIncome} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Income Source (e.g., Salary, Freelance)"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />

          <input
            type="number"
            placeholder="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <button
            type="submit"
            className="bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
          >
            Add Income
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-700">{message}</p>
        )}

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 text-green-600 underline hover:text-green-800 text-sm w-full text-center"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Income;
