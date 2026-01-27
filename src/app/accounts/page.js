"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, onSnapshot } from "firebase/firestore";
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
  const [username, setUsername] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "accounts"), (snapshot) => {
      const data = {};
      snapshot.forEach((doc) => {
        data[doc.id] = doc.data();
      });
      setAccounts(data);

      // Pick username from first account (or customize as needed)
      const firstUser = snapshot.docs[0]?.data()?.username || "User";
      setUsername(firstUser);
    });

    return () => unsub();
  }, []);

  return (
    <main className="min-h-screen  mt-14 bg-white">
      {/* Greeting message */}
      <div className="px-8 py-10">
        <h3 className="text-2xl font-extrabold text-right py-8 text-blue-900">
          Welcome back, <span className="font-semibold">{username}</span>!
        </h3>


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
