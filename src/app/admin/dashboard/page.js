"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";
import LoadingAvatar from "@/components/src/LoadingAvatar";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    transactions: 0,
    beneficiaries: 0,
    accounts: 0,
    loveVaultPayments: 0,
    otp: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const transactionsSnap = await getDocs(collection(db, "transactions"));
        const beneficiariesSnap = await getDocs(collection(db, "beneficiaries"));
        const accountsSnap = await getDocs(collection(db, "accounts"));
        const loveVaultPaymentsSnap = await getDocs(collection(db, "loveVaultPayments"));
        const otpSnap = await getDocs(collection(db, "otp"));

        setStats({
          users: usersSnap.size,
          transactions: transactionsSnap.size,
          beneficiaries: beneficiariesSnap.size,
          accounts: accountsSnap.size,
          loveVaultPayments: loveVaultPaymentsSnap.size,
          otp: otpSnap.size,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingAvatar />;

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-6 text-white text-center">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {/* otp */}
        <div className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-gray-400">Codes</p>
          <p className="text-2xl font-bold text-white">{stats.otp}</p>
        </div>

        {/* Fund Accounts */}
        <div className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-gray-400">Fund Accounts</p>
          <p className="text-2xl font-bold text-white">{stats.accounts}</p>
        </div>

        {/* Beneficiaries */}
        <div className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-gray-400">Beneficiaries</p>
          <p className="text-2xl font-bold text-white">{stats.beneficiaries}</p>
        </div>

        {/* Couple Savings */}
        <div className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-gray-400">Couple Savings</p>
          <p className="text-2xl font-bold text-white">{stats.loveVaultPayments}</p>
        </div>

        {/* Total Users */}
        <div className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-gray-400">Total Users</p>
          <p className="text-2xl font-bold text-white">{stats.users}</p>
        </div>

        {/* Transactions */}
        <div className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-gray-400">Transactions</p>
          <p className="text-2xl font-bold text-white">{stats.transactions}</p>
        </div>
      </div>

    </div>
  );
}
