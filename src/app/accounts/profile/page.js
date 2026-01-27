"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export default function ProfilePage() {
  const [user, setUser] = useState({
    fullName: "Kelsey Hart",
    email: "**** ***** **** USA",
    phone: "*** **** 4627",
    dob: "** ** 1995",
    business: {
      registration: "**** *** 2EG4",
      type: "Musician / Independent Contractor",
      country: "United States & International",
    },
    customerId: "**** *** 8322",
    status: "Active",
    account: { type: "Personalised Business Account" },
    since: "August, 2012.",
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", "mainUser"), (snap) => {
      if (snap.exists()) setUser((prev) => ({ ...prev, ...snap.data() }));
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen py-10 px-4 bg-gray-100">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ===== PAGE TITLE ===== */}
        <div>
          <h1 className="text-2xl font-semibold text-blue-900">Account Profile</h1>
          <p className="text-sm text-gray-600">
            View and manage your personal and business information
          </p>
        </div>

        {/* ===== PERSONAL DETAILS ===== */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <section className="bg-white rounded-xl border shadow-sm flex-1">
            <div className="border-b px-6 py-4">
              <h2 className="font-semibold text-gray-800">Personal Details</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 px-6 py-5 text-sm">
              <Info label="Full Name" value={user.fullName} />
              <Info label="Email Address" value={user.email} />
              <Info label="Phone Number" value={user.phone} />
              <Info label="Date of Birth" value={user.dob} />
            </div>
          </section>

          {/* ===== BUSINESS DETAILS ===== */}
          <section className="bg-white rounded-xl border shadow-sm flex-1">
            <div className="border-b px-6 py-4">
              <h2 className="font-semibold text-gray-800">Business Information</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 px-6 py-5 text-sm">
              <Info label="Registration Number" value={user.business?.registration} />
              <Info label="Business Type" value={user.business?.type} />
              <Info label="Country of Operation" value={user.business?.country} />
              <Info label="Customer ID" value={user.customerId} />
              <Info label="Account Status" value={user.status} />
              <Info label="Account Type" value={user.account?.type} />
              <Info label="Member Since" value={user.since} />
            </div>
          </section>
        </div>

        {/* ===== CARD DETAILS ===== */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-blue-900">Cards Management</h2>
          <p className="text-sm text-gray-600">
            Control, freeze, and manage your business cards
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-40 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-700 p-6 flex flex-col justify-between">
              <p className="text-sm font-bold text-white">BB&T Business Card</p>
              <h3 className="text-xl mt-2 tracking-widest text-orange-500">•••• 4589</h3>
              <p className="text-gray-100 mt-2 text-sm font-medium">Active</p>
            </div>

            <div className="mt-4 flex gap-3">
              <button className="flex-1 bg-blue-900 text-white shadow-lg py-2 rounded-lg">Freeze</button>
              <button className="flex-1 bg-blue-900 text-white shadow-lg py-2 rounded-lg">Limits</button>
            </div>

            <section className="bg-blue-100 border border-blue-500 rounded-xl px-6 py-4">
              <h4 className="font-semibold mb-3 text-blue-900">Card Usage</h4>
              <p className="text-blue-800 text-sm">
                Monthly spend tracking, merchant control, and fraud protection.
              </p>
              <p className="text-md font-bold text-red-600 text-center py-2">Security Notice</p>
              <p className="text-xs text-red-700 mt-1">
                To update sensitive information such as your name, business registration
                or phone number, please contact BB&T Business Support or log in to main account.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== REUSABLE INFO ROW ===== */
function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-500 text-xs uppercase tracking-wide">{label}</p>
      <p className="text-gray-900 font-medium mt-1">{value || "—"}</p>
    </div>
  );
}
