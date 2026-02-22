"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { ArrowUp, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [now, setNow] = useState(new Date());

  const [selectedTx, setSelectedTx] = useState(null);

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

  const toggleView = () => {
    setVisibleCount((prev) => (prev === 10 ? 20 : 10));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const current = now;
  const previous = new Date(
    current.getFullYear(),
    current.getMonth() - 1,
    1
  );

  const format = (date) =>
    date.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });

  const formatFullDate = (ts) =>
    ts?.toDate().toLocaleString() || "—";

  const getStatusLabel = (status) => {
    if (!status) return "Pending";
    if (status === "approved") return "Sent";
    if (status === "canceled") return "Failed";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen px-4 py-8 pt-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-blue-950 text-center">
        Transaction History
      </h2>

      <section className="flex flex-col max-w-2xl mx-auto bg-red-50">
        {transactions.length === 0 && (
          <p className="text-center text-gray-500">
            No transactions found.
          </p>
        )}

        {transactions.slice(0, visibleCount).map((tx) => (
          <div
            key={tx.id}
            onClick={() => setSelectedTx(tx)}
            className="bg-white border-t border-gray-200 p-2 hover:bg-gray-100 transition cursor-pointer"
          >
            <div className="flex justify-between p-1">
              <p className="text-gray-900 font-semibold text-lg">
                {tx.recipientName || tx.senderName || "—"}
              </p>

              <div className="bg-gray-100 rounded-full p-1">
                {tx.type === "transfer" ? (
                  <ArrowUp className="text-red-600 w-3 h-3" />
                ) : (
                  <ArrowDown className="text-green-600 w-3 h-3" />
                )}
              </div>
            </div>

            <div className="flex justify-between p-1">
              <div>
                <p className="text-gray-600 text-xs">
                  {format(previous)} – {format(current)}
                </p>

                {tx.type === "transfer" && (
                  <p
                    className={`text-xs pt-1 font-semibold ${tx.status === "pending"
                      ? "text-yellow-600"
                      : tx.status === "approved"
                        ? "text-green-600"
                        : tx.status === "canceled"
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                  >
                    {getStatusLabel(tx.status)}
                  </p>
                )}
              </div>

              <p className="font-semibold text-xl text-black">
                ${Number(tx.amount || 0).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* View More Button */}
      {transactions.length > 10 && (
        <button
          onClick={toggleView}
          className="sticky bottom-5 ml-auto bg-blue-900 text-white text-sm px-3 py-2 rounded-full shadow-lg hover:bg-blue-950 transition"
        >
          {visibleCount === 10 ? "View More" : "View Less"}
        </button>
      )}

      {/* TRANSACTION DETAILS MODAL */}
      <AnimatePresence>
        {selectedTx && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-end justify-center z-50"
            onClick={() => setSelectedTx(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 120 }}
              className="bg-gray-50 w-full max-w-2xl rounded-t-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-bold mb-4 text-center">
                Transaction Details
              </h3>

              <div className="space-y-3 text-sm">
                {/* status */}
                <div className="flex flex-col items-center justify-center p-4 space-y-2">
                  {selectedTx.status === "approved" && (
                    <>
                      <CheckCircle className="w-10 h-10 text-green-600" />
                      <span className="font-bold text-xl text-green-600">
                        Sent
                      </span>
                    </>
                  )}

                  {selectedTx.status === "pending" && (
                    <>
                      <Clock className="w-10 h-10 text-yellow-500" />
                      <span className="font-bold text-xl text-yellow-600">
                        Pending
                      </span>
                    </>
                  )}

                  {selectedTx.status === "canceled" && (
                    <>
                      <XCircle className="w-10 h-10 text-red-600" />
                      <span className="font-bold text-xl text-red-600">
                        Failed
                      </span>
                    </>
                  )}
                </div>
                {/* Recipient */}
                <div className="flex justify-between">
                  <span className="text-gray-900">Recipient</span>
                  <span className="text-gray-900">{selectedTx.recipientName || "—"}</span>
                </div>
                {/* Bank */}
                <div className="flex justify-between">
                  <span className="text-gray-900">Bank</span>
                  <span className="text-gray-900">{selectedTx.recipientAccount || "—"}</span>
                </div>
                {/* Amount */}
                <div className="flex justify-between">
                  <span className="text-gray-900">Amount</span>
                  <span className="font-semibold text-gray-900">
                    ${Number(selectedTx.amount || 0).toLocaleString()}
                  </span>
                </div>
                {/* Date */}
                <div className="flex justify-between">
                  <span className="text-gray-900">Date</span>
                  <span className="text-gray-900">{formatFullDate(selectedTx.createdAt)}</span>
                </div>


                {/* 🔴 SHOW CANCEL REASON */}
                {selectedTx.status === "canceled" &&
                  selectedTx.cancelReason && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded">
                      <p className="text-red-700 text-sm font-semibold">
                        Transaction Failed
                      </p>
                      <p className="text-red-600 text-xs mt-1 font-semibold">
                        Reason: {selectedTx.cancelReason}
                      </p>
                    </div>
                  )}
              </div>

              <button
                onClick={() => setSelectedTx(null)}
                className="mt-6 w-full bg-blue-900 hover:bg-blue-950 text-white py-2 rounded-lg"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}