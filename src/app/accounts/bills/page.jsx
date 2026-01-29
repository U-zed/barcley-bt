"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Bills() {
  const upcomingBills = [
    { name: "Electricity", amount: 360, due: "Jan 25, 2026" },
    { name: "Water", amount: 420, due: "Jan 28, 2026" },
    { name: "Internet", amount: 218, due: "Jan 30, 2026" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10 space-y-20">

      {/* ===== HEADER ===== */}
      <div className="space-y-2">
        <h1 className="text-xl md:text-2xl font-bold text-blue-950 text-center">Bills & Payments</h1>
        <p className="text-base md:text-lg text-center text-gray-600">
          View, manage, and pay your bills securely.
        </p>
      </div>

      {/* ===== UPCOMING BILLS ===== */}
      <section className="space-y-5">
        <h2 className="text-lg font-semibold text-gray-800">
          Upcoming Bills
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {upcomingBills.map((bill, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">
                  {bill.name}
                </h3>
                <span className="text-sm text-red-600 font-medium">
                  Due {bill.due}
                </span>
              </div>

              <p className="mt-3 text-2xl font-bold text-blue-950">
                ${bill.amount}
              </p>

              <Link
                href="/admin"
                className="mt-4 inline-block w-full text-center bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-950 transition"
              >
                Pay Bill
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

   {/* ===== SCHEDULED PAYMENTS ===== */}
<section className="space-y-6">
  <h2 className="text-lg font-semibold text-gray-800">
    Scheduled Payments
  </h2>

  <div className="bg-white border border-gray-200 rounded-xl divide-y">

    {/* Rent */}
    <div className="flex justify-between items-center p-5">
      <div>
        <p className="font-medium text-gray-900">Luxury Apartment Rent</p>
        <p className="text-sm text-gray-500">Monthly • Auto-Pay</p>
      </div>
      <div className="text-right">
        <p className="font-semibold">$4,500</p>
        <Link href="/admin" className="text-sm text-blue-900 hover:underline">
          Manage
        </Link>
      </div>
    </div>

    {/* Car Note */}
    <div className="flex justify-between items-center p-5">
      <div>
        <p className="font-medium text-gray-900">Vehicle Lease (G-Wagon)</p>
        <p className="text-sm text-gray-500">Monthly • Auto-Pay</p>
      </div>
      <div className="text-right">
        <p className="font-semibold">$2,100</p>
        <Link href="/admin" className="text-sm text-blue-900 hover:underline">
          Manage
        </Link>
      </div>
    </div>

    {/* Insurance */}
    <div className="flex justify-between items-center p-5">
      <div>
        <p className="font-medium text-gray-900">Insurance Bundle</p>
        <p className="text-sm text-gray-500">Monthly • Auto-Pay</p>
      </div>
      <div className="text-right">
        <p className="font-semibold">$980</p>
        <Link href="/admin" className="text-sm text-blue-900 hover:underline">
          Manage
        </Link>
      </div>
    </div>

    {/* Private School */}
    <div className="flex justify-between items-center p-5">
      <div>
        <p className="font-medium text-gray-900">Private School Tuition</p>
        <p className="text-sm text-gray-500">Monthly</p>
      </div>
      <div className="text-right">
        <p className="font-semibold">$3,200</p>
        <Link href="/admin" className="text-sm text-blue-900 hover:underline">
          Manage
        </Link>
      </div>
    </div>

    {/* House Staff */}
    <div className="flex justify-between items-center p-5">
      <div>
        <p className="font-medium text-gray-900">Housekeeping & Staff</p>
        <p className="text-sm text-gray-500">Bi-Weekly</p>
      </div>
      <div className="text-right">
        <p className="font-semibold">$1,400</p>
        <Link href="/admin" className="text-sm text-blue-900 hover:underline">
          Manage
        </Link>
      </div>
    </div>

    {/* Personal Trainer */}
    <div className="flex justify-between items-center p-5">
      <div>
        <p className="font-medium text-gray-900">Personal Trainer</p>
        <p className="text-sm text-gray-500">Weekly</p>
      </div>
      <div className="text-right">
        <p className="font-semibold">$850</p>
        <Link href="/admin" className="text-sm text-blue-900 hover:underline">
          Manage
        </Link>
      </div>
    </div>

    {/* Allowances */}
    <div className="flex justify-between items-center p-5">
      <div>
        <p className="font-medium text-gray-900">Personal Allowances</p>
        <p className="text-sm text-gray-500">Weekly • Standing Order</p>
      </div>
      <div className="text-right">
        <p className="font-semibold">$4,500</p>
        <Link href="/admin" className="text-sm text-blue-900 hover:underline">
          Manage
        </Link>
      </div>
    </div>

    {/* Subscriptions */}
    <div className="flex justify-between items-center p-5">
      <div>
        <p className="font-medium text-gray-900">Premium Subscriptions</p>
        <p className="text-sm text-gray-500">Monthly</p>
      </div>
      <div className="text-right">
        <p className="font-semibold">$420</p>
        <Link href="/admin" className="text-sm text-blue-900 hover:underline">
          Manage
        </Link>
      </div>
    </div>

  </div>
</section>

    </div>
  );
}