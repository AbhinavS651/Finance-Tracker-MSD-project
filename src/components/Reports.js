import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#22c55e", "#ef4444"]; // green for income, red for expenses

function Reports() {
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const incomeQuery = query(collection(db, "income"), where("userId", "==", user.uid));
        const expensesQuery = query(collection(db, "expenses"), where("userId", "==", user.uid));

        const unsubIncome = onSnapshot(incomeQuery, (snap) => {
          const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setIncomeData(data);
        });

        const unsubExpenses = onSnapshot(expensesQuery, (snap) => {
          const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setExpenseData(data);
        });

        return () => {
          unsubIncome();
          unsubExpenses();
        };
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 🔹 Calculations
  const totalIncome = incomeData.reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const totalExpenses = expenseData.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const totalBalance = totalIncome - totalExpenses;

  // 🔹 Group by category for table summaries
  const groupByCategory = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const category = item.source || "Uncategorized";
      grouped[category] = (grouped[category] || 0) + Number(item.amount || 0);
    });
    return Object.entries(grouped).map(([category, total]) => ({ category, total }));
  };

  const incomeCategories = groupByCategory(incomeData);
  const expenseCategories = groupByCategory(expenseData);

  // 🔹 Group by date for charts
  const dateTotals = {};
  [...incomeData, ...expenseData].forEach((item) => {
    const date = item.date || "Unknown";
    if (!dateTotals[date]) dateTotals[date] = { date, income: 0, expenses: 0 };
    if (incomeData.includes(item)) dateTotals[date].income += Number(item.amount || 0);
    else dateTotals[date].expenses += Number(item.amount || 0);
  });
  const chartData = Object.values(dateTotals).sort((a, b) => new Date(a.date) - new Date(b.date));

  const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Expenses", value: totalExpenses },
  ];

  // 🔹 Insights
  const avgDailyIncome = (totalIncome / (chartData.length || 1)).toFixed(2);
  const avgDailyExpense = (totalExpenses / (chartData.length || 1)).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8">Reports & Insights</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-10">
        <div className="bg-green-200 p-6 rounded-2xl shadow-md text-center">
          <h2 className="text-xl font-semibold">Total Income</h2>
          <p className="text-3xl font-bold text-green-700 mt-2">₹{totalIncome.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-1">Avg/day: ₹{avgDailyIncome}</p>
        </div>

        <div className="bg-red-200 p-6 rounded-2xl shadow-md text-center">
          <h2 className="text-xl font-semibold">Total Expenses</h2>
          <p className="text-3xl font-bold text-red-700 mt-2">₹{totalExpenses.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-1">Avg/day: ₹{avgDailyExpense}</p>
        </div>

        <div className="bg-blue-200 p-6 rounded-2xl shadow-md text-center">
          <h2 className="text-xl font-semibold">Total Balance</h2>
          <p
            className={`text-3xl font-bold mt-2 ${
              totalBalance >= 0 ? "text-green-700" : "text-red-700"
            }`}
          >
            ₹{totalBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-6xl">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Income vs Expenses</h2>
          <PieChart width={400} height={350}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={120}
              dataKey="value"
            >
              {pieData.map((entry, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Daily Income & Expenses</h2>
          <BarChart width={500} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#22c55e" />
            <Bar dataKey="expenses" fill="#ef4444" />
          </BarChart>
        </div>

        {/* Line Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Net Balance Over Time</h2>
          <LineChart width={900} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={(d) => d.income - d.expenses} stroke="#3b82f6" />
          </LineChart>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl mt-10">
        {/* Income Categories */}
        <div className="bg-green-50 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-green-700">Income Breakdown</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-green-300">
                <th className="py-2 px-4">Source</th>
                <th className="py-2 px-4">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {incomeCategories.map((c, i) => (
                <tr key={i} className="border-b border-green-100">
                  <td className="py-2 px-4">{c.category}</td>
                  <td className="py-2 px-4 font-semibold text-green-700">{c.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Expense Categories */}
        <div className="bg-red-50 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-red-700">Expense Breakdown</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-red-300">
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {expenseCategories.map((c, i) => (
                <tr key={i} className="border-b border-red-100">
                  <td className="py-2 px-4">{c.category}</td>
                  <td className="py-2 px-4 font-semibold text-red-700">{c.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;
