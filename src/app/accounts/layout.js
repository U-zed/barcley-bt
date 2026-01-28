"use client";

import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { AnimatePresence, motion } from "framer-motion";

export default function AccountsLayout({ children }) {
  return (
    <div className="flex min-h-screen ">
      <div className="flex-1 flex flex-col">
        <div >
          <NavBar />
        </div>
        <AnimatePresence mode="wait">
          <motion.main
            key={children?.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="md:p-10 pt-16 "
          >

            {children}
          </motion.main>
        </AnimatePresence>
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
