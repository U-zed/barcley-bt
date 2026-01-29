"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", "mainUser"), (snap) => {
      if (snap.exists()) setUser(snap.data());
    });
    return () => unsub();
  }, []);

  if (!user) return <p className="text-center mt-10">Loading…</p>;

  return (
    <div className="min-h-screen pt-20  py-10 px-4 bg-gray-100">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ===== HEADER ===== */}
        <div className="flex items-center gap-4">
          {user.photo && (
            <img
              src={user.photo}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border"
            />
          )}
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-blue-950">
              Account Profile
            </h1>
            <p className="text-base text-gray-600">
              View your account information
            </p>
          </div>
        </div>

        {/* ===== PERSONAL ===== */}
        <Section title="Personal Details">
          <Info label="Full Name" value={user.fullName} />
          <Info label="Email" value={maskEmail(user.email)} />
          <Info label="Phone" value={maskPhone(user.phone)} />
          <Info label="Date of Birth" value={maskDOB(user.dob)} />
        </Section>

        {/* ===== BUSINESS ===== */}
        <Section title="Business Information">
          <Info label="Registration Number" value={maskText(user.business?.registration)} />
          <Info label="Business Type" value={user.business?.type} />
          <Info label="Country" value={user.business?.country} />
          <Info label="Customer ID" value={maskText(user.customerId)} />
          <Info label="Account Status" value={user.status} />
          <Info label="Account Type" value={user.account?.type} />
          <Info label="Member Since" value={user.since} />
        </Section>
      </div>
    </div>
  );
}

/* ===== UI HELPERS ===== */
function Section({ title, children }) {
  return (
    <section className="bg-blue-50 rounded border border-blue-100 shadow">
      <div className="border-b border-blue-300 px-6 py-4">
        <h2 className="font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6 px-6 py-5 text-sm">
        {children}
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-600 text-xs uppercase">{label}</p>
      <p className="text-gray-900 font-medium mt-1">{value || "—"}</p>
    </div>
  );
}

/* ===== MASKING ===== */
const maskEmail = (email = "") =>
  email.replace(/(.{2}).+(@.+)/, "$1****$2");

const maskPhone = (phone = "") =>
  phone.replace(/\d(?=\d{4})/g, "*");

const maskDOB = (dob = "") =>
  dob ? "**/**/****" : "—";

const maskText = (val = "") =>
  val ? "**** *** " + val.slice(-4) : "—";
