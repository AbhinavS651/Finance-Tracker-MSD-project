import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Expenses() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!amount || !category) {
      setMessage("Please fill all fields!");
      return;
    }

    try {
      await addDoc(collection(db, "expenses"), {
        userId: auth.currentUser.uid,
        amount: Number(amount),
        category,
        date: date || new Date().toISOString().split("T")[0], // defaults to today
        createdAt: serverTimestamp(),
      });

      setAmount("");
      setCategory("");
      setDate("");
      setMessage("✅ Expense added successfully!");

      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Error adding expense:", err);
      setMessage("❌ Failed to add expense. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-6">
      <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">
          💸 Add Expense
        </h2>

        <form onSubmit={handleAddExpense} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Expense Category (e.g., Food, Rent, Travel)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          />

          <input
            type="number"
            placeholder="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <button
            type="submit"
            className="bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition"
          >
            Add Expense
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-700">{message}</p>
        )}

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 text-red-600 underline hover:text-red-800 text-sm w-full text-center"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Expenses;
