"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import QuickActions from "@/components/QuickActions";
import TransactionsPage from "./transactions/page";
import ModernCardSlider from "@/components/src/app/components/ModernCardSlider";
import Charts from "@/components/Charts";
import Bills from "./bills/page";
import Business from "./business-tools/page";

const maskAccount = (num = "") =>
  num && num.length >= 4 ? "**** " + num.slice(-4) : "****";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState({});
  const [user, setUser] = useState(null); // <- user state
  const [loading, setLoading] = useState(true);

  // Fetch accounts
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "accounts"), (snapshot) => {
      const data = {};
      snapshot.forEach((doc) => {
        data[doc.id] = doc.data();
      });
      setAccounts(data);
    });
    return () => unsub();
  }, []);

  // Fetch main user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const snap = await getDoc(doc(db, "users", "mainUser"));
        if (snap.exists()) {
          setUser(snap.data());
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Get initials if no photo
  const getInitials = (name = "") => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";
  };

  if (loading) return <p className="text-center mt-6">Loading…</p>;

  return (
    <main className="min-h-screen  mt-14 bg-white">
      {/* Greeting message */}
      <div className="px-3 md:px-8 ">
    {/* Greeting message */}
<div className="px-3 md:px-8 pb-9 flex flex-col md:flex-row items-center md:justify-end gap-4">
  {user && (
    <>
      {/* Profile Photo or Initials */}
      {user.photo ? (
        <img
          src={user.photo}
          alt={user.fullName}
          className="w-14 h-14 rounded-full object-cover border border-blue-900"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-gray-500 flex items-center justify-center text-lg md:text-xl font-bold text-white border border-blue-900">
          {getInitials(user.fullName)}
        </div>
      )}

      {/* Greeting Text */}
      <h3 className="text-xl md:text-2xl font-extrabold text-blue-900 text-center md:text-right">
        {getGreeting()}, <span className="font-semibold">{user.fullName}</span>!
      </h3>
    </>
  )}
</div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(accounts).map(([key, acc]) => (
            <div
              key={key}
              className="rounded-2xl  border-l-10 border border-l-red-800 border-gray-500 px-5 py-2 shadow-lg hover:border-l-red-950 hover:border-red-700 transition"
            >
              <h2 className="text-xl font-semibold capitalize mb-3">{key}</h2>
              <div className="flex justify-between">
                <div className="mb-4">
                  <p className="text-transparent text-sm text-left">Balance</p>
                  <p className="text-slate-500 text-sm text-left">Account Number</p>
                </div>

                <div>
                  <p className="text-xl font-bold font-mono tracking-tighter text-right">
                    ${Number(acc.balance).toLocaleString()}
                  </p>
                  <p className="text-slate-500 text-sm font-mono tracking-widest text-right">
                    {maskAccount(acc.accountNumber)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <QuickActions />
      </div>
        <TransactionsPage />

      {/* MAIN COMPONENTS */}
      <section className="bg-gradient-to-tr from-blue-400 to-orange-300 min-h-screen">

        <div className="mb-6 text-center col-span-1 md:col-span-2">
          <h1 className="text-2xl font-bold py-5 text-blue-900 text-center">Cards & Spending Summeries</h1>
          <p className="ext-sm text-gray-800 mb-6 text-center">
            Review your active bank cards, monitor transactions, track spending, and stay protected.
          </p>
        </div>

        <ModernCardSlider />
        <Charts />
      </section>

        <Bills />
        <Business />
        {/* <MessageWidget /> */}
    </main>
  );
}
