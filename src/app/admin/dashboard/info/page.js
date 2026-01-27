"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import AdminLayout from "../../AdminLayout";

export default function AdminTransferInfoPage() {
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    // Query only "transfer" type transactions
    const q = query(
      collection(db, "transactions"),
      where("type", "==", "transfer"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransfers(list);
    });

    return () => unsub();
  }, []);

  return (
    <AdminLayout>

    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">User Transfers Info</h1>

      {transfers.length === 0 ? (
        <p className="text-gray-400">No transfer info available yet.</p>
      ) : (
        <div className="bg-slate-900 rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-300 text-left">
              <tr>
                <th className="p-3">Sender Name</th>
                <th className="p-3">Sender Account</th>
                <th className="p-3">Recipient Name</th>
                <th className="p-3">Recipient Username</th>
                <th className="p-3">Recipient Account</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {transfers.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-t border-slate-800 hover:bg-slate-800/50"
                >
                  <td className="p-3">{tx.senderName}</td>
                  <td className="p-3 font-mono">{tx.senderAccount}</td>
                  <td className="p-3">{tx.recipientName}</td>
                  <td className="p-3">{tx.recipientUsername}</td>
                  <td className="p-3 font-mono">{tx.recipientAccount}</td>
                  <td className="p-3 font-semibold">${tx.amount?.toLocaleString()}</td>
                  <td className="p-3 text-slate-400">
                    {tx.createdAt?.toDate().toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
