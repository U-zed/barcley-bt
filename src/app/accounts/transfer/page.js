"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export default function TransferPage() {
  const [fromAccount, setFromAccount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [recipientUsername, setRecipientUsername] = useState("");
  const [recipientPassword, setRecipientPassword] = useState("");
  const [amount, setAmount] = useState("");

  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [message, setMessage] = useState("");

  // 🔐 Generate OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!fromAccount || !amount) {
      setMessage("❌ Please fill all fields");
      return;
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const otpRef = await addDoc(collection(db, "otp"), {
      code: otpCode,
      account: fromAccount,
      amount: Number(amount),
      createdAt: serverTimestamp(),
      used: false,
    });

    setGeneratedOtp({ id: otpRef.id, code: otpCode });
    setShowOtpModal(true);
  };

  // ✅ Confirm OTP & Send Money
  const confirmOtp = async () => {
    if (otp !== generatedOtp.code) {
      setMessage("❌ Invalid OTP");
      return;
    }

    try {
      const accRef = doc(db, "accounts", fromAccount);
      const snap = await getDoc(accRef);

      if (!snap.exists()) {
        setMessage("❌ Account not found");
        return;
      }

      if (snap.data().balance < Number(amount)) {
        setMessage("❌ Insufficient balance");
        return;
      }

      // Deduct money
      await updateDoc(accRef, {
        balance: increment(-Number(amount)),
      });

      // Save transaction
      const tx = {
        type: "transfer",
        fromAccount,
        recipientName,
        recipientAccount,
        recipientUsername,
        amount: Number(amount),
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "transactions"), tx);

      setReceipt(tx);
      setShowOtpModal(false);
    } catch (err) {
      console.error(err);
      setMessage("❌ Transfer failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-2xl font-semibold mb-6">Transfer Money</h1>

      {!receipt && (
        <form
          onSubmit={handleSubmit}
          className="max-w-lg space-y-4 bg-slate-900 p-6 rounded-xl border border-slate-800"
        >
          <select
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
            className="w-full p-3 bg-slate-800 rounded"
          >
            <option value="">Select Account</option>
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
            <option value="business">Business</option>
            <option value="investment">Investment</option>
          </select>

          <input placeholder="Recipient Name" className="input" onChange={(e)=>setRecipientName(e.target.value)} />
          <input placeholder="Recipient Account Number" className="input" onChange={(e)=>setRecipientAccount(e.target.value)} />
          <input placeholder="Recipient Username" className="input" onChange={(e)=>setRecipientUsername(e.target.value)} />
          <input placeholder="Recipient Password" type="password" className="input" onChange={(e)=>setRecipientPassword(e.target.value)} />
          <input placeholder="Amount" type="number" className="input" onChange={(e)=>setAmount(e.target.value)} />

          <p className="text-sm text-yellow-400">
            ⚠ Transfers are irreversible. Confirm recipient details carefully.
          </p>

          <button className="w-full bg-emerald-600 p-3 rounded">
            Send Money
          </button>

          {message && <p className="text-center">{message}</p>}
        </form>
      )}

      {/* OTP MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-slate-900 p-6 rounded-xl w-full max-w-sm">
            <h2 className="text-xl mb-4">Enter OTP</h2>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full p-3 bg-slate-800 rounded text-center tracking-widest"
            />
            <button
              onClick={confirmOtp}
              className="w-full bg-emerald-600 p-3 rounded mt-4"
            >
              Confirm OTP
            </button>
          </div>
        </div>
      )}

      {/* RECEIPT */}
      {receipt && (
        <div className="max-w-lg bg-white text-black p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Payment Receipt</h2>
          <p><b>From:</b> {receipt.fromAccount}</p>
          <p><b>To:</b> {receipt.recipientName}</p>
          <p><b>Account:</b> {receipt.recipientAccount}</p>
          <p><b>Amount:</b> ${receipt.amount.toLocaleString()}</p>
          <p><b>Status:</b> Successful</p>
        </div>
      )}
    </div>
  );
}
