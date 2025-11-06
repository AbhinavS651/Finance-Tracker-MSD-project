import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const navigate = useNavigate();

  // 🔥 Fetch user and listen to changes in income/expenses
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // ✅ Real-time income updates
        const incomeQuery = query(
          collection(db, "income"),
          where("userId", "==", currentUser.uid)
        );
        const unsubscribeIncome = onSnapshot(incomeQuery, (snapshot) => {
          const total = snapshot.docs.reduce(
            (sum, doc) => sum + parseFloat(doc.data().amount || 0),
            0
          );
          setTotalIncome(total);
        });

        // ✅ Real-time expenses updates
        const expensesQuery = query(
          collection(db, "expenses"),
          where("userId", "==", currentUser.uid)
        );
        const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
          const total = snapshot.docs.reduce(
            (sum, doc) => sum + parseFloat(doc.data().amount || 0),
            0
          );
          setTotalExpenses(total);
        });

        return () => {
          unsubscribeIncome();
          unsubscribeExpenses();
        };
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  // 💰 Calculate total balance
  const totalBalance = totalIncome - totalExpenses;

  // 🚪 Logout function
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Hello, {user?.displayName?.split(" ")[0] || "User"} 
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      {/* Total Balance */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 text-center">
        <h2 className="text-xl font-semibold text-gray-600">Total Balance</h2>
        <p
          className={`text-4xl font-bold mt-2 ${
            totalBalance >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          ₹{totalBalance.toFixed(2)}
        </p>
      </div>

      {/* Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income Section */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
          <h3 className="text-2xl font-semibold text-blue-600 mb-3">Income</h3>
          <p className="text-gray-600">
            Track all your income sources. Add salary, side hustles, or
            freelance earnings here.
          </p>
          <Link
            to="/income"
            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Go to Income
          </Link>
        </div>

        {/* Expenses Section */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
          <h3 className="text-2xl font-semibold text-red-600 mb-3">Expenses</h3>
          <p className="text-gray-600">
            Track your expenses and spending habits to better manage your money.
          </p>
          <Link
            to="/expenses"
            className="mt-4 inline-block bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Go to Expenses
          </Link>
        </div>

        {/* Reports Section */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
          <h3 className="text-2xl font-semibold text-purple-600 mb-3">
            Reports
          </h3>
          <p className="text-gray-600">
            Visualize your financial progress over time with detailed reports.
          </p>
          <Link
            to="/reports"
            className="mt-4 inline-block bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
          >
            View Reports
          </Link>
        </div>
      </div>
    </div>
  );
  
}

export default Dashboard;
