"use client";

import LoadingAvatar from "@/components/src/LoadingAvatar";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient"; // your Firestore client
import { doc, getDoc } from "firebase/firestore";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("u"); // e.g., /profile?u=Nate247

    if (!username) {
      setLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        const docRef = doc(db, "users", username); // Firestore collection 'users'
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUser(docSnap.data());
        } else {
          console.log("No such user!");
          setUser({}); // empty object so UI shows "-"
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser({}); // empty object for UI fallback
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) return <LoadingAvatar />;

  // fallback helper
  const getValue = (val) => (val ? val : "—");

  return (
    <div className="min-h-screen pt-20 py-10 px-4 bg-gray-100">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ===== HEADER ===== */}
        <div className="flex items-center gap-4">
          {user?.photo ? (
            <img
              src={user.photo}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border"
            />
          ) : (
            <div className="w-20 h-20 rounded-full border bg-gray-300" />
          )}
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-blue-950">
              {getValue(user?.fullName)}            </h1>
            <p className="text-base text-gray-600">
              {maskText("HS77JS93G4")}            </p>
          </div>
        </div>

        {/* ===== PERSONAL ===== */}
        <Section title="Personal Details">
          <Info label="Full Name" value={getValue(user?.fullName)} />
          <Info label="Email" value={maskEmail(user?.email)} />
          <Info label="Phone" value={maskPhone(user?.phone)} />
          <Info label="Date of Birth" value={maskDOB(user?.dob)} />
          <Info label="Address" value={getValue(user?.address)} />
        </Section>

        {/* ===== BUSINESS ===== */}
        <Section title="Business Information">
          <Info label="Registration Number" value={maskText("HS77JS93G4")} />
          <Info label="Business Type" value={getValue(user?.businessType)} />
          <Info label="Country" value="United State And International" />
          <Info label="Account Status" value="Active" />
          <Info label="Account Type" value="Standard (Offshore) Business Account" />
          <Info label="Member Since" value="Aug. 2021" />
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
      <div className="grid md:grid-cols-2 gap-6 px-6 py-5 text-sm">{children}</div>
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

/* ===== MASKING HELPERS ===== */
const maskEmail = (email = "") =>
  email ? email.replace(/(.{2}).+(@.+)/, "$1****$2") : "—";

const maskPhone = (phone = "") =>
  phone ? phone.replace(/\d(?=\d{4})/g, "*") : "—";

const maskDOB = (dob = "") => (dob ? "**/**/****" : "—");
const maskText = (val = "") =>
  val ? "**** *** " + val.slice(-4) : "—";

