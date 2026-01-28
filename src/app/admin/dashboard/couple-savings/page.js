"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { motion } from "framer-motion";

export default function AdminCoupleSavings() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "loveVaultUsers"),
      orderBy("createdAt", "desc") // 🔥 ALWAYS newest first
    );

    const unsub = onSnapshot(q, (snap) => {
      setUsers(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return unsub;
  }, []);

  const approveUser = (id) =>
    updateDoc(doc(db, "loveVaultUsers", id), { approved: true });

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    await deleteDoc(doc(db, "loveVaultUsers", id));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto p-6 bg-slate-950">
      <h1 className="text-white text-xl font-bold pb-6 text-center">
        Couple Savings Payments
      </h1>

      {users.map((u) => (
        <div
          key={u.id}
          className="border p-4 rounded mb-3 flex justify-between bg-slate-900 text-white"
        >
          <div>
            <p className="font-bold">{u.name}</p>
            <p className="text-sm">{u.email}</p>
            <p className="text-xs">{u.goal}</p>

            <p className="text-[11px] text-slate-400 mt-1">
              Submitted:{" "}
              {u.createdAt?.toDate
                ? u.createdAt.toDate().toLocaleString()
                : "—"}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {!u.approved && (
              <button
                onClick={() => approveUser(u.id)}
                className="bg-green-600 text-white px-2 py-1 rounded text-sm"
              >
                Approve
              </button>
            )}

            <button
              onClick={() => deleteUser(u.id)}
              className="bg-red-600 text-white px-2 py-1 rounded text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
