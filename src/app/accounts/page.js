"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, doc, onSnapshot } from "firebase/firestore";
import QuickActions from "@/components/QuickActions";
import TransactionsPage from "./transactions/page";
import ModernCardSlider from "@/components/src/app/components/ModernCardSlider";
import Charts from "@/components/Charts";
import Bills from "./bills/page";
import Business from "./business-tools/page";
import LoadingAvatar from "@/components/src/LoadingAvatar";

const maskAccount = (num = "") =>
  num && num.length >= 4 ? "**** " + num.slice(-4) : "****";

export default function AccountsPage({ profileId }) {
  const [accounts, setAccounts] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Realtime fetch accounts
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

  // Realtime fetch user by profileId
  useEffect(() => {
    if (!profileId) return;

    const userRef = doc(db, "users", profileId);
    const unsub = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUser(docSnap.data());
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [profileId]);

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

  if (loading) return <LoadingAvatar src="/logo.png" size={100} />;

  return (
    <main className="min-h-screen pt-14 bg-gray-50">
      {/* Greeting message */}
      <div className="px-3 md:px-8 pb-5">
        <div className="pb-9 flex flex-col md:flex-row items-center md:justify-end gap-4">
          {user && (
            <>
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

              <h3 className="text-xl md:text-2xl font-extrabold text-blue-900 text-center md:text-right">
                {getGreeting()}, <span className="font-semibold">{user.fullName}</span>!
              </h3>
            </>
          )}
        </div>

        {/* Accounts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(accounts).map(([key, acc]) => (
            <div
              key={key}
              className="rounded-2xl border-l-10 border border-l-red-800 border-gray-500 px-5 py-2 shadow-lg hover:border-l-red-950 hover:border-red-700 transition"
            >
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold capitalize mb-3">{key}</h2>
                <p className="text-slate-500 text-sm font-mono tracking-tight text-left">
                  {maskAccount(acc.accountNumber)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-blue-950 text-base text-left">Available Balance</p>
                <p className="text-xl font-bold font-mono tracking-tighter text-right">
                  ${Number(acc.balance).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <QuickActions />
      </div>

      <TransactionsPage />
      <section className="bg-gradient-to-tr from-blue-400 to-orange-300 min-h-screen">
        <div className="mb-6 text-center col-span-1 md:col-span-2">
          <h1 className="text-xl md:text-2xl font-bold py-5 text-blue-950 text-center">Cards & Spending Summaries</h1>
          <p className="text-base md:text-lg text-gray-800 mb-6 text-center">
            Review your active bank cards, monitor transactions, track spending, and stay protected.
          </p>
        </div>

        <ModernCardSlider />
        <Charts />
      </section>

      <Bills />
      <Business />
    </main>
  );
}
