"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";
import OtpAdminPage from "./otp/page";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    transactions: 0,
    reports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const transactionsSnap = await getDocs(collection(db, "transactions"));
        const reportsSnap = await getDocs(collection(db, "reports"));

        setStats({
          users: usersSnap.size,
          transactions: transactionsSnap.size,
          reports: reportsSnap.size,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="text-white text-center mt-10">Loading dashboard...</p>;

  return (
    <div className="p-6 text-white">
      <OtpAdminPage />
    </div>
  );
}
