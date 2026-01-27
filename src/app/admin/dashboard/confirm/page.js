"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import AdminLayout from "../../AdminLayout";

export default function AdminConfirmPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "transactions"),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snap) => {
      setTransactions(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    });
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this transaction permanently?")) return;

    await deleteDoc(doc(db, "transactions", id));
  };

  return (
    
    <AdminLayout>

    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">
        Confirm / Delete Transactions
      </h1>

      <div className="space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                ${tx.amount?.toLocaleString()} — {tx.type || "deposit"}
              </p>
              <p className="text-slate-400 text-sm">
                {tx.createdAt?.toDate().toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => handleDelete(tx.id)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
    </AdminLayout>
  );
}
