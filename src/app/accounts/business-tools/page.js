"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Business() {
  const tools = [
    {
      title: "Payroll Management",
      desc: "Manage employee salaries, tax deductions, and payroll history.",
    },
    {
      title: "Expense Management",
      desc: "Track, categorize, and export business expenses.",
    },
    {
      title: "Documents & Statements",
      desc: "Access official bank statements and account documents.",
    },
  ];

  const statements = ["January 2026", "December 2025", "November 2025"];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10space-y-20">

      {/* ===== PAGE HEADER ===== */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-blue-950 pt-10">
          Business Tools
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Manage payroll, expenses, and financial documents for your business
          account.
        </p>
      </div>

      {/* ===== BUSINESS TOOLS ===== */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-blue-900">
          Account Management
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {tools.map((tool, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2 }}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
            >
              <h3 className="font-semibold text-gray-900">
                {tool.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {tool.desc}
              </p>

              <Link
                href="/admin"
                className="mt-4 hover:underline-0 text-sm font-medium text-blue-900 hover:underline"
              >
                Open →
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== DOCUMENTS & STATEMENTS ===== */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-blue-900">
          Statements & Documents
        </h2>

        <div className="bg-white border border-gray-200 rounded-xl divide-y">
          {statements.map((month, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-5"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {month}
                </p>
                <p className="text-sm text-gray-500">
                  Business account statement
                </p>
              </div>

              <Link
                href="/admin"
                className="text-sm font-medium text-blue-900 hover:underline"
              >
                Download PDF
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ===== REPORTS ===== */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-blue-900">
          Reports & Insights
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
          >
            <h3 className="font-semibold text-gray-900">
              Monthly Summary
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Review monthly income, expenses, and transaction activity.
            </p>
            <Link
              href="/admin"
              className="mt-4 hover:underline-0 text-sm font-medium text-blue-900 hover:underline"
            >
              View Report →
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
          >
            <h3 className="font-semibold text-gray-900">
              Annual Overview
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Analyze yearly performance, trends, and financial growth.
            </p>
            <Link
              href="/admin"
              className="mt-4 hover:underline-0 text-sm font-medium text-blue-900 hover:underline"
            >
              View Report →
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}