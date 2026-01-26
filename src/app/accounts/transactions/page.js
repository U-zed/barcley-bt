"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "transactions"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(list);
    });

    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-slate-950 text-white">
      <h1 className="text-3xl font-bold mb-6">Transaction History</h1>

      <div className="bg-slate-900 rounded-xl shadow overflow-x-auto border border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-slate-300 text-left">
            <tr>
              <th className="p-3">Type</th>
              <th className="p-3">From / Sender</th>
              <th className="p-3">To / Recipient</th>
              <th className="p-3">Account</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-t border-slate-800 hover:bg-slate-800/50"
              >
                <td className="p-3 capitalize">
                  {tx.type || "deposit"}
                </td>

                

                <td className="p-3">
                  {tx.recipientName || "—"}
                </td>

                <td className="p-3 font-mono">
                  {tx.senderAccount || tx.recipientAccount || "—"}
                </td>

                <td className="p-3 font-semibold">
                  ${tx.amount?.toLocaleString()}
                </td>

                <td className="p-3 text-slate-400">
                  {tx.createdAt?.toDate().toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
