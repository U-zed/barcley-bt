"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "transactions"),
      orderBy("createdAt", "desc") // 🔥 newest first
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setTransactions(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const approveTransaction = async (id) => {
    await updateDoc(doc(db, "transactions", id), { status: "approved" });
  };

  const cancelTransaction = async (id) => {
    await updateDoc(doc(db, "transactions", id), { status: "canceled" });
  };

  const deleteTransaction = async (id) => {
    await deleteDoc(doc(db, "transactions", id));
  };

  const formatDate = (ts) => (ts ? ts.toDate().toLocaleString() : "—");

  if (loading) return <p className="text-gray-400 p-8">Loading transactions…</p>;
  if (error)
    return (
      <p className="text-yellow-400 p-8">
        Error loading transactions: {error}
      </p>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-white px-3 p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Transactions</h1>

      {transactions.length === 0 ? (
        <p className="text-gray-400 text-center">No transactions yet.</p>
      ) : (
        <div className="overflow-x-auto bg-slate-900 rounded shadow ">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex flex-col  justify-between  border-t border-slate-700 hover:bg-slate-800/50 py-3 transition-colors duration-200"
            >
              <div className="flex flex-col   md:text-base ">
                <div className="flex justify-between  p-2">
                  <p className="text-gray-400 text-xs">{formatDate(tx.createdAt)}</p>
                  <p className={`font-semibold text-xs uppercase ${tx.status === "approved"
                    ? "text-green-400"
                    : tx.status === "canceled"
                      ? "text-red-600"
                      : "text-yellow-500"
                    }`}
                  >
                    {tx.status}</p>
                </div>


                <div className="flex justify-between text-white text-sm py-1 px-2  bg-gray-800 ">
                  <p>Name: </p>
                  <p> {tx.recipientName} </p>
                </div>
                <div className="flex justify-between text-white text-sm py-1 px-2 ">
                  <p>Bank: </p>
                  <p>({tx.recipientAccount}) </p>
                </div>

                <div className="flex justify-between text-white text-sm py-1 px-2  bg-gray-800">
                  <p>Username: </p>
                  <p className="text-orange-500 "> {tx.recipientUsername || "—"}</p>
                </div>
                <div className="flex justify-between text-sm font-semibold px-2 ">
                  <p>Password: </p>
                  <p className="text-orange-500 "> {tx.recipientPassword || "—"} </p>
                </div>


                <div className="flex justify-between text-white text-sm py-1 px-2  bg-gray-800">
                  <p>From: </p>
                  <p>{tx.fromAccount} account</p>
                </div>
                <div className="flex justify-between text-white text-sm py-1 px-2 ">
                  <p>Amount: </p>
                  <p>${tx.amount?.toLocaleString()} </p>
                </div>
              </div>

              <div className=" flex justify-center mt-2 md:mt-0 gap-2">
                {tx.status !== "approved" && (
                  <button
                    onClick={() => approveTransaction(tx.id)}
                    className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm transition-colors"
                  >
                    Approve
                  </button>
                )}
                {tx.status !== "canceled" && (
                  <button
                    onClick={() => cancelTransaction(tx.id)}
                    className="bg-yellow-600 hover:bg-yellow-500 px-3 py-1 rounded text-sm transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => deleteTransaction(tx.id)}
                  className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

  );
}
