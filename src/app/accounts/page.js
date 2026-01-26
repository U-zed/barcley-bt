"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, onSnapshot } from "firebase/firestore";

const maskAccount = (num = "") => "**** **** **** " + num.slice(-4);


export default function AccountsPage() {
  const [accounts, setAccounts] = useState({});

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

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-semibold mb-8">
        Account Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(accounts).map(([key, acc]) => (
          <div
            key={key}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-lg hover:border-slate-700 transition"
          >
            <h2 className="text-xl font-semibold capitalize mb-3">
              {key}
            </h2>

            <div className="mb-4">
              <p className="text-slate-400 text-sm">
                Account Number
              </p>
              <p className="font-mono tracking-widest">
                {maskAccount(acc.accountNumber)}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Balance
              </p>
              <p className="text-2xl font-bold">
                ${Number(acc.balance).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
