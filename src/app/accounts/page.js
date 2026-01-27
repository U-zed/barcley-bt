"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, onSnapshot } from "firebase/firestore";
import QuickActions from "@/components/QuickActions";
import TransactionsPage from "./transactions/page";

const maskAccount = (num = "") =>
  num && num.length >= 4 ? "**** **** **** " + num.slice(-4) : "**** **** **** ****";


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
    <main className="min-h-screen  mt-14 bg-gradient-to-br from-blue-100 to-red-50">
      {/* Greeting message */}
      <div className="px-8 py-10">
        <h3 className="text-2xl font-extrabold text-right py-8 text-blue-900">
        Welcome back, <span className="font-semibold">{username}</span>!
      </h3>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(accounts).map(([key, acc]) => (
          <div
            key={key}
            className="rounded-2xl  border-l-10 border border-l-red-800 border-red-500 px-6 py-3 shadow-lg hover:border-l-red-950 hover:border-red-700 transition"
          >
            <h2 className="text-xl font-semibold capitalize mb-3">{key}</h2>
            <div className="flex justify-between">
              <div className="mb-4">
                <p className="text-slate-500 text-sm">Account Number</p>
                <p className="font-mono tracking-widest">
                  {maskAccount(acc.accountNumber)}
                </p>
              </div>

              <div>
                <p className="text-slate-500 text-sm">Balance</p>
                <p className="text-2xl font-bold font-mono tracking-tighter">
                  ${Number(acc.balance).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>




       {/* MAIN COMPONENTS */}
     <section className="bg-gradient-to-br from-red-200 to-blue-300 min-h-screen">
       <QuickActions />
      <TransactionsPage />
      {/* <ModernCardSlider /> */}
      {/* <Charts /> */}
      {/* <Bills /> */}
      {/* <BusinessTool /> */}
      {/* <MessageWidget /> */}
     </section>
    </main>
  );
}
