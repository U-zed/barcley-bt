"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export default function CredentialsTable() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make sure this path matches where your credentials are saved
        const ref = doc(db, "loginCredentials", "users");
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setData(snap.data());
        } else {
          console.warn("No credentials document found!");
        }
      } catch (err) {
        console.error("Error fetching credentials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="p-4 text-gray-200">Loading credentials…</p>;
  if (!data) return <p className="p-4 text-gray-200">No credentials found</p>;

  // Safely handle Firestore Timestamps
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "—";
    if (timestamp.toDate) return timestamp.toDate().toLocaleString();
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="p-4 bg-slate-900 rounded-md text-gray-100">
      <h2 className="text-lg font-semibold mb-4">Authentication Credentials</h2>

      <table className="w-full border border-gray-600 text-sm">
        <thead>
          <tr className="bg-slate-800">
            <th className="border border-gray-600 p-2 text-left">Field</th>
            <th className="border border-gray-600 p-2 text-left">Value</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="border border-gray-600 p-2">Admin Username</td>
            <td className="border border-gray-600 p-2">{data.adminUsername || "—"}</td>
          </tr>

          <tr>
            <td className="border border-gray-600 p-2">Admin Password</td>
            <td className="border border-gray-600 p-2">{data.adminPassword || "—"}</td>
          </tr>

          <tr>
            <td className="border border-gray-600 p-2">User Username</td>
            <td className="border border-gray-600 p-2">{data.userUsername || "—"}</td>
          </tr>

          <tr>
            <td className="border border-gray-600 p-2">User Password</td>
            <td className="border border-gray-600 p-2">{data.userPassword || "—"}</td>
          </tr>

          <tr>
            <td className="border border-gray-600 p-2">Updated At</td>
            <td className="border border-gray-600 p-2">{formatTimestamp(data.updatedAt)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
