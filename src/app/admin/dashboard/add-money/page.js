"use client";

import { useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export default function AddMoneyPage() {
  const [account, setAccount] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderAccount, setSenderAccount] = useState("");
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  if (!account || !senderName || !senderAccount || !amount) {
    setMessage("❌ Please fill all fields");
    setLoading(false);
    return;
  }

  try {
    const accRef = doc(db, "accounts", account);
    const accSnap = await getDoc(accRef);

    // Determine default account number based on account type
    const defaultNumber =
      account === "checking"
        ? "1234567890123042"
        : account === "savings"
        ? "9876543210987012"
        : account === "business"
        ? "5555666677777388"
        : "1111222233334444";

    if (!accSnap.exists()) {
      // ✅ Create account if it doesn't exist
      await setDoc(accRef, {
        balance: Number(amount),
        accountNumber: defaultNumber,
      });
    } else {
      // ✅ Increment balance and backfill accountNumber if missing
      await updateDoc(accRef, {
        balance: increment(Number(amount)),
        accountNumber: accSnap.data().accountNumber || defaultNumber,
      });
    }

    // ✅ Save transaction
    await addDoc(collection(db, "transactions"), {
      account,
      senderName,
      senderAccount,
      amount: Number(amount),
      createdAt: serverTimestamp(),
    });

    setMessage("✅ Money added successfully");

    // ✅ Clear form
    setAccount("");
    setSenderName("");
    setSenderAccount("");
    setAmount("");

    setTimeout(() => setMessage(""), 3000);
  } catch (err) {
    console.error(err);
    setMessage("❌ Failed to add money");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-2xl font-semibold mb-6">Add Money</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md space-y-5 bg-slate-900 border border-slate-800 p-6 rounded-xl"
      >
        <select
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          className="w-full p-3 rounded bg-slate-800 border border-slate-700"
        >
          <option value="">Select Account</option>
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
          <option value="business">Business</option>
          <option value="investment">Investment</option>
        </select>

        <input
          type="text"
          placeholder="Sender Name"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          className="w-full p-3 rounded bg-slate-800 border border-slate-700"
        />

        <input
          type="text"
          placeholder="Sender Account Number"
          value={senderAccount}
          onChange={(e) => setSenderAccount(e.target.value)}
          className="w-full p-3 rounded bg-slate-800 border border-slate-700"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 rounded bg-slate-800 border border-slate-700"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 transition p-3 rounded font-semibold disabled:opacity-50"
        >
          {loading ? "Processing..." : "Add Money"}
        </button>

        {message && (
          <p className="text-center text-sm mt-2">{message}</p>
        )}
      </form>
    </div>
  );
}
