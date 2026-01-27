"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import AdminLayout from "../../AdminLayout";

export default function AdminCoupleSavings() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "loveVaultUsers"), snap => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const approveUser = (id) =>
    updateDoc(doc(db, "loveVaultUsers", id), { approved: true });

  const deleteUser = (id) =>
    deleteDoc(doc(db, "loveVaultUsers", id));

  return (
    <AdminLayout>

    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Couple Savings Admin</h1>

      {users.map(u => (
        <div key={u.id} className="border p-4 rounded mb-3 flex justify-between">
          <div>
            <p className="font-bold">{u.name}</p>
            <p className="text-sm">{u.email}</p>
            <p className="text-xs">{u.goal}</p>
          </div>

          <div className="flex gap-2">
            {!u.approved && (
              <button
                onClick={() => approveUser(u.id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Approve
              </button>
            )}
            <button
              onClick={() => deleteUser(u.id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
    </AdminLayout>
  );
}
