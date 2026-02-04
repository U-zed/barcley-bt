"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Notification } from "@/components/Notification";
import { AnimatePresence, motion } from "framer-motion";
import { db } from "@/lib/firebaseClient";
import { doc, onSnapshot, deleteDoc } from "firebase/firestore";
import LoadingAvatar from "@/components/src/LoadingAvatar";

export default function AccountsLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to current session in Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "sessions", "current"), (snap) => {
      if (snap.exists()) setUser(snap.data());
      else setUser(null);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await deleteDoc(doc(db, "sessions", "current"));
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (loading) return <div><LoadingAvatar/></div>;

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col">
        <div>
          {/* Pass user and logout to NavBar */}
          <NavBar user={user} handleLogout={handleLogout} />
          <Notification />
        </div>

        <AnimatePresence mode="wait">
          <motion.main
            key={children?.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="md:p-10 pt-16"
          >
            {children}
          </motion.main>
        </AnimatePresence>

        <Footer />
      </div>
    </div>
  );
}
