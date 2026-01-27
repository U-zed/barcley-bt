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
import Image from "next/image";
import Link from "next/link";

export default function TransferPage() {
  const [fromAccount, setFromAccount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [recipientUsername, setRecipientUsername] = useState("");
  const [recipientPassword, setRecipientPassword] = useState("");
  const [amount, setAmount] = useState("");
  const [showExternal, setShowExternal] = useState(false);

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
  // Reset everything to go back to transfer selection
  const resetFlow = () => {
    setShowExternal(false);
    setReceipt(null);
    setMessage("");
    setOtp("");
    setGeneratedOtp(null);
    setShowOtpModal(false);

    setFromAccount("");
    setRecipientName("");
    setRecipientAccount("");
    setRecipientUsername("");
    setRecipientPassword("");
    setAmount("");
  };

  // Add this function inside your TransferPage component
  const closeOtpModal = () => {
    setShowOtpModal(false);
    setOtp(""); // reset OTP input
  };

  return (
    <div className="min-h-screen bg-gray-100 text-white px-3 md:p-8 my-14">


      {/* Internal and external cards */}
      {!showExternal && (
        <div className="grid md:grid-cols-2 gap-6 ">

          <h1 className="text-center text-3xl font-bold text-blue-900 mb-4">
            Secure Money Transfers
          </h1>
          <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto mb-10">
            Effortlessly move funds between your accounts or send money externally
            with complete confidence.
          </p>

          {/* Internal */}
          <div className="relative h-60 w-full max-w-sm sm:max-w-md md:max-w-lg flex flex-col justify-center items-center shadow-lg overflow-hidden rounded-[50%_20%_50%_30%_/30%_60%_20%_50%] m-auto"
            style={{
              backgroundImage: "url('/internal.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/90" >

              <div className="relative top-1/2 left-1/2  -translate-x-1/2  -translate-y-1/2 z-10 text-center space-y-5">
                <h2 className="text-lg font-bold text-orange-500 bg-gray-100 w-fit mx-auto rounded px-2">
                  Internal Transfer
                </h2>
                <p className="text-sm text-black bg-gray-50 p-1">
                  Quickly move funds between your Savings, Business, Checking, and Investment accounts.
                </p>
                <Link
                  href="/admin"
                  className="text-sm font-semibold bg-orange-500 text-white px-4 py-2 rounded-full"
                >
                  Move Between Accounts
                </Link>
              </div>
            </div>
          </div>

          {/* External */}
          <div
            className="relative h-64 flex flex-col justify-center items-center shadow-lg overflow-hidden rounded-[40%_60%_30%_70%_/50%_30%_60%_40%]"
            style={{
              backgroundImage: "url('/external.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/90" />
            <div className="relative z-10 text-center bg-gray-300 rounded-2xl px-1 border border-blue-900">
              <h2 className="pt-1 text-lg font-bold text-blue-900">
                External Transfer
              </h2>
              <p className="text-sm text-black my-4 max-w-xs mx-auto px-1">
                Send money securely to external accounts with OTP confirmation for each transaction.
              </p>
              <button
                onClick={() => setShowExternal(true)}
                className="text-sm font-semibold bg-blue-900 text-white px-4 py-2 rounded-full"
              >
                Make External Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EXTERNAL TRANSFER FLOW ================= */}
      {showExternal && (
        <div className="w-full md:max-w-xl mx-auto pt-14">


          {/* HEADER */}
          {!receipt && (
            <div className="text-center my-6">
              <h2 className="text-2xl font-bold text-blue-900 py-2">
                External Bank Transfer
              </h2>
              <p className="text-sm text-slate-500 my-5">
                Schedule and manage outgoing payments securely to supported banks and credit unions.
                All transfers require OTP verification before completion.
              </p>
            </div>
          )}

          {/* FORM */}
          {!receipt && (
            <form
              onSubmit={handleSubmit}
              className="max-w-lg space-y-4 bg-gray-900 px-3 md:p-6 rounded-xl border border-slate-800"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white py-5">
                  Enter Recipient Details
                </h2>
                <p className="mt-2 text-xs md:text-sm text-orange-700 font-semibold max-w-md mx-auto bg-yellow-50/50 p-2 rounded border border-orange-700">
                  ⚠ Warning: Transfers are final. Double-check recipient details before submitting. Third-party apps like Cash App, PayPal, Venmo, or Chime are not supported.
                </p>
              </div>
              <select
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
                className="w-full p-2 bg-gray-500 rounded  "
              >
                <option value="">Select Account</option>
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="business">Business</option>
                <option value="investment">Investment</option>
              </select>

              <input placeholder="Recipient Name" className="input w-full p-2 bg-gray-200 rounded" onChange={(e) => setRecipientName(e.target.value)} />
              <input placeholder="Recipient Account Number" className="input w-full p-2 bg-gray-200 rounded" onChange={(e) => setRecipientAccount(e.target.value)} />
              <input placeholder="Recipient Username" className="input w-full p-2 bg-gray-200 rounded" onChange={(e) => setRecipientUsername(e.target.value)} />
              <input placeholder="Recipient Password" type="password" className="input w-full p-2 bg-gray-200 rounded" onChange={(e) => setRecipientPassword(e.target.value)} />
              <input placeholder="Amount" type="number" className="input w-full p-2 bg-gray-200 rounded" onChange={(e) => setAmount(e.target.value)} />

              <p className="text-sm text-yellow-400 bg-gray-600 rounded p-2">
                ⚠  By clicking Send, you confirm the above details are correct.
                Transfers cannot be reversed once submitted.{" "}
                <i className="text-red-700">
                  Only credit cards, traditional banks and credit unions are supported.
                  Third-party apps such as Cash App, PayPal, Venmo, or Chime are not supported.
                </i>
              </p>
              {message && <p className="text-center">{message}</p>}


              {/* BACK BUTTON */}
              <div className="flex justify-between my-9">
                {!receipt && (
                  <button
                    onClick={resetFlow}
                    className=" bg-gray-300 hover:bg-gray-400 text-black text-sm font-semibold transition-all px-9 p-3 rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                <button className=" bg-blue-900 hover:bg-blue-950 text-sm font-semibold transition-all px-5 py-3 rounded cursor-pointer">
                  Schedule Payment
                </button>
              </div>
            </form>
          )}

          {/* OTP MODAL */}
          {showOtpModal && (
            <div className="fixed inset-0 bg-black/95 flex items-center justify-center">
              <div className="bg-gradient-to-br from-gray-100 to-blue-300 p-6 rounded-xl w-full max-w-sm">


                <div className="flex items-center justify-center w-full h-10 mb-4">
                  <Image src="/logo.png" alt="BBT Logo" className="h-10 object-contain" width={90} height={90} priority />
                </div>
                <h2 className=" mb-4 text-xl font-semibold  text-center text-orange-500">          Verify One-Time Passcode
                </h2>
                <p className="text-sm text-black text-center mb-4">
                  For your protection, enter the 6-digit code sent to your registered
                  mobile number (***4523)
                </p>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full p-3 bg-slate-00 rounded text-center tracking-widest" placeholder="Enter OTP"
                />

                <div className="flex justify-between w-full  mt-4">
                  <button
                    className=" text-sm bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded " onClick={closeOtpModal}
                  >
                    Back
                  </button>
                  <button
                    onClick={confirmOtp}
                    className="text-sm bg-blue-900 hover:bg-blue-950  py-2 px-4 rounded "
                  >
                    Confirm OTP
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* RECEIPT */}
          {receipt && (
            <div className="max-w-sm mx-auto bg-white text-black p-6 rounded-xl">
              <h3 className="font-bold text-xl text-center text-green-700 p-2">
                Payment Scheduled Successfully
              </h3>

              <div className="w-fit mx-auto ">
                <Image src="/suc.jpg" alt="successful" width={70} height={70} priority />
              </div>
              <div className="text-center text-base font-semibold text-black py-4">
                <p >
                  Your payment of <b>${receipt.amount.toLocaleString()}</b>  to <b>{receipt.recipientName} </b> has been scheduled successfully.
                </p>

                <div className="text-left mt-5 text-xs">
                  <p>
                    Once approved, the funds will be processed and are expected to post within 3–5 business days.
                  </p>
                  <p>
                    Posting times may vary depending on the recipient’s financial institution and payment network.
                  </p>
                </div>
              </div>

              <div className="bg-gray-200 rounded">

                <div className="flex justify-between px-2 text-sm py-1  text-gray-800 border-b border-gray-100">
                  <p>Name :</p>
                  <p> {receipt.recipientName} </p>
                </div>
                <div className="flex justify-between px-2 text-sm py-1  text-gray-800 border-b border-gray-100">
                  <p>Account:</p>
                  <p> {receipt.recipientAccount}</p>
                </div>
                <div className="flex justify-between px-2 text-sm py-1  text-gray-800 border-b border-gray-100">
                  <p>Amount:</p>
                  <p>${receipt.amount.toLocaleString()}</p>
                </div>
              </div>

              <button
                onClick={() => setReceipt(null)}
                className="px-6 py-1 rounded bg-blue-900 text-white font-semibold hover:bg-blue-950 transition text-sm mx-auto mt-7 block"
              >
                Done
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}