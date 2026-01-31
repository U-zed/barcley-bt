"use client";

import { useEffect, useState } from "react";

// ===== PREDEFINED USER PROFILES =====
const USER_PROFILES = {
  markomu: {
    fullName: "Mark Omu",
    email: "markomu@bbt.com",
    phone: "+2348012345671",
    dob: "1989-03-21",
    occupation: "Business Analyst",
    address: "Lagos, Nigeria",
    status: "Active",
    account: { type: "Savings" },
    since: "Jan 2022",
    business: { registration: "BNK1234", type: "Retail", country: "Nigeria" },
  },
  austineu: {
    fullName: "Austine Uwa",
    email: "austineu@bbt.com",
    phone: "+2348012345672",
    dob: "1992-06-15",
    occupation: "Software Engineer",
    address: "Abuja, Nigeria",
    status: "Active",
    account: { type: "Current" },
    since: "Feb 2021",
    business: { registration: "BNK2345", type: "Tech", country: "Nigeria" },
  },
  kingking: {
    fullName: "King King",
    email: "kingking@bbt.com",
    phone: "+2348012345673",
    dob: "1985-12-05",
    occupation: "Entrepreneur",
    address: "Port Harcourt, Nigeria",
    status: "Active",
    account: { type: "Savings" },
    since: "Mar 2020",
    business: { registration: "BNK3456", type: "Consulting", country: "Nigeria" },
  },
  georgem: {
    fullName: "George Mayor",
    email: "georgem@bbt.com",
    phone: "+2348012345674",
    dob: "1978-09-30",
    occupation: "Accountant",
    address: "Ibadan, Nigeria",
    status: "Active",
    account: { type: "Current" },
    since: "Jul 2019",
    business: { registration: "BNK4567", type: "Finance", country: "Nigeria" },
  },
  isaacem: {
    fullName: "Isaac Emeka",
    email: "isaacem@bbt.com",
    phone: "+2348012345675",
    dob: "1990-01-12",
    occupation: "Manager",
    address: "Kano, Nigeria",
    status: "Active",
    account: { type: "Savings" },
    since: "Nov 2022",
    business: { registration: "BNK5678", type: "Logistics", country: "Nigeria" },
  },
};

export default function ProfilePage({ params }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get profileId from query string or session
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get("u"); // e.g., /profile?u=markomu

    if (profileId && USER_PROFILES[profileId]) {
      setUser(USER_PROFILES[profileId]);
    }
  }, []);

  if (!user) return <p className="text-center mt-10">Loading…</p>;

  return (
    <div className="min-h-screen pt-20 py-10 px-4 bg-gray-100">
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
          <Info label="Occupation" value={user.occupation} />
          <Info label="Address" value={user.address} />
        </Section>

        {/* ===== BUSINESS ===== */}
        <Section title="Business Information">
          <Info label="Registration Number" value={maskText(user.business?.registration)} />
          <Info label="Business Type" value={user.business?.type} />
          <Info label="Country" value={user.business?.country} />
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
