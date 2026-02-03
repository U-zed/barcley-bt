"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import LoadingAvatar from "@/components/src/LoadingAvatar";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to the current session
    const unsub = onSnapshot(doc(db, "sessions", "current"), async (snap) => {
      if (!snap.exists()) {
        setUser(null);
        setLoading(false);
        return;
      }

      const sessionData = snap.data();
      const username = sessionData?.username; // <-- use username as doc ID

      if (!username) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Fetch full user info by username (doc ID)
        const userSnap = await getDoc(doc(db, "users", username));
        if (userSnap.exists()) {
          setUser({ id: userSnap.id, ...userSnap.data() });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) return <LoadingAvatar />;

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">User not found or not logged in</p>
      </div>
    );

  const maskEmail = (email = "") =>
    email ? email.replace(/(.{2}).+(@.+)/, "$1****$2") : "—";

  const maskPhone = (phone = "") =>
    phone ? phone.replace(/\d(?=\d{4})/g, "*") : "—";

  const maskDOB = (dob = "") => (dob ? "**/**/****" : "—");

  const maskAddress = (address = "") =>
    address ? "**** " + address.slice(-4) : "—";

  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    if (timestamp.toDate) return timestamp.toDate().toLocaleDateString();
    return new Date(timestamp).toLocaleDateString();
  };

  const getInitials = (name = "") =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";

  return (
    <div className="min-h-screen pt-20 px-4 bg-gray-100">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          {user.photo ? (
            <img
              src={user.photo}
              alt={user.fullName}
              className="w-20 h-20 rounded-full object-cover border"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-500 flex items-center justify-center text-xl font-bold text-white border">
              {getInitials(user.fullName || "U")}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-blue-950">
              Account Profile
            </h1>
            <p className="text-gray-600">{user.fullName}</p>
            <p className="text-xs text-gray-400 mt-1">
              Doc ID: <span className="font-mono">{user.id}</span>
            </p>
          </div>
        </div>

        {/* PERSONAL DETAILS */}
        <section className="bg-blue-50 rounded border shadow">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold">Personal Details</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 px-6 py-5 text-sm">
            <Info label="Full Name" value={user.fullName} />
            <Info label="Email" value={maskEmail(user.email)} />
            <Info label="Phone" value={maskPhone(user.phone)} />
            <Info label="Date of Birth" value={maskDOB(user.dob)} />
            <Info label="Address" value={maskAddress(user.address)} />
          </div>
        </section>

        {/* BUSINESS DETAILS */}
        <section className="bg-blue-50 rounded border shadow">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold">Business Information</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 px-6 py-5 text-sm">
            <Info label="Business Type" value={user.businessType} />
            <Info label="Username" value={user.username} />
            <Info label="Account Status" value="Active" />
            <Info label="Member Since" value={formatDate(user.createdAt)} />
            <Info label="Last Updated" value={formatDate(user.updatedAt)} />
          </div>
        </section>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-600 uppercase">{label}</p>
      <p className="text-gray-900 font-medium mt-1">{value || "—"}</p>
    </div>
  );
}
