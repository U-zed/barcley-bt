"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function Charts() {
  const randomValue = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const [transactionsData, setTransactionsData] = useState([
    { month: "Jan", payments: 100_000_000, deposits: 140_000_000 },
    { month: "Feb", payments: 150_000_000, deposits: 139_000_000 },
    { month: "Mar", payments: 80_000_000, deposits: 100_000_000 },
    { month: "Apr", payments: 78_000_000, deposits: 90_000_000 },
    { month: "May", payments: 89_000_000, deposits: 80_000_000 },
    { month: "Jun", payments: 39_000_000, deposits: 30_000_000 },
    { month: "Jul", payments: 49_000_000, deposits: 60_000_000 },
  ]);

  const [accountDistribution, setAccountDistribution] = useState([
    { name: "Savings", value: 200_000_000 },
    { name: "Business", value: 550_000_000 },
    { name: "Investment", value: 600_000_000 },
  ]);

  // --- Update charts every 8 seconds ---
  useEffect(() => {
    const interval = setInterval(() => {
      setTransactionsData((prev) =>
        prev.map((item) => ({
          ...item,
          payments: randomValue(300_000, 350_000_000),
          deposits: randomValue(100_000, 75_000_000),
        }))
      );

      setAccountDistribution([
        { name: "Savings", value: randomValue(37_000_000, 45_000_000) },
        { name: "Business", value: randomValue(350_000_000, 450_000_000) },
        { name: "Investment", value: randomValue(180_000_000, 200_000_000) },
      ]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
      {/* Header */}
      <div className="mb-6 text-center col-span-1 md:col-span-2">
        <h1 className="text-3xl font-bold mb-2 text-blue-900">Account Overview</h1>
        <p className="text-gray-600 text-lg">
          Monitor your monthly transactions and account distribution
        </p>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-2">Monthly Transactions</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={transactionsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={(v) => `$${(v / 1_000_000).toLocaleString()}M`}
            />
            <Tooltip
              formatter={(v) => `$${(v / 1_000_000).toLocaleString()}M`}
            />
            <Legend />
            <Bar dataKey="payments" fill="#8884d8" />
            <Bar dataKey="deposits" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-2">
          Payments vs Deposits Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={transactionsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={(v) => `$${(v / 1_000_000).toLocaleString()}M`}
            />
            <Tooltip
              formatter={(v) => `$${(v / 1_000_000).toLocaleString()}M`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="payments"
              stroke="#8884d8"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="deposits"
              stroke="#82ca9d"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-4 rounded-xl shadow col-span-1 md:col-span-2">
        <h3 className="text-lg font-semibold mb-2">
          Account Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={accountDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={(e) =>
                `${e.name}: $${(e.value / 1_000_000).toLocaleString()}M`
              }
            >
              {accountDistribution.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => `$${(v / 1_000_000).toLocaleString()}M`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}