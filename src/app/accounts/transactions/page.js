"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [now, setNow] = useState(new Date());

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

  // Helper to display status nicely
  const getStatusLabel = (status) => {
    if (!status) return "Pending"; // default when user sends money
    if (status === "approved") return "Paid";
    if (status === "canceled") return "Failed";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

 useEffect(() => {
    // update every minute so month flips automatically
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60 * 1000);

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


  return (
    <div className="min-h-screen px-4 py-8 bg-white pt-8">
      <h2 className="text-3xl font-bold mb-4 text-blue-900 text-center">
        Transaction History
      </h2>
      <p className="text-lg text-gray-800 mb-6 text-center">
        Review your recent payments and transfers. Only transactions made through supported banks are listed.
      </p>

      <section className="flex flex-col max-w-2xl mx-auto bg-red-50">
        {transactions.length === 0 && (
          <p className="text-center text-gray-500">No transactions found.</p>
        )}

     {transactions.slice(0, visibleCount).map((tx) => (
  <div
    key={tx.id}
    className="bg-white border-t border-gray-200 p-1 hover:bg-gray-100 transition"
  >
    <div className="flex justify-between p-1">
      <p className="text-gray-900 font-semibold text-lg">
        {tx.recipientName || tx.senderName || "—"}
      </p>
      <div className="bg-gray-100 h-fit rounded-full p-1 text-right">
        {tx.type === "transfer" ? (
          <ArrowUp className="text-red-600 w-3 h-3" />
        ) : (
          <ArrowDown className="text-green-600 w-3 h-3" />
        )}
      </div>
    </div>

    <div className="flex justify-between p-1">

<div className="text-left">
     <p className="text-gray-600 text-xs text-left">
      {format(previous)} – {format(current)}
    </p>
  {/* <p className="text-gray-600 text-xs text-left">
        {tx.createdAt?.toDate().toLocaleString() || "—"}
      </p> */}
      
        {/* ✅ Only show status for debits */}
{tx.type === "transfer" && (
  <p
    className={`text-xs pt-1 font-semibold ${
      tx.status === "pending"
        ? "text-yellow-600"
        : tx.status === "approved"
        ? "text-green-600"
        : tx.status === "canceled"
        ? "text-red-600"
        : "text-gray-500"
    }`}
  >
    {tx.status === "approved"
      ? "Sent"
      : tx.status === "canceled"
      ? "Failed"
      : tx.status?.charAt(0).toUpperCase() + tx.status?.slice(1)}
  </p>
)}
  </div>      

      <p className="font-semibold text-xl text-black text-right">
  ${Number(tx.amount || 0).toLocaleString()}
      </p>
    </div>
  </div>
))}

      </section>

      {/* Sticky View More / Less Button */}
      {transactions.length > 10 && (
        <button
          onClick={toggleView}
          className="sticky bottom-5 ml-auto bg-blue-900 text-white text-sm px-3 py-2 rounded-full shadow-lg hover:bg-blue-950 transition"
        >
          {visibleCount === 10 ? "View More" : "View Less"}
        </button>
      )}
    </div>
  );
}
