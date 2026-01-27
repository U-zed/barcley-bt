"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const messages = [
  "New beneficiary approved successfully!",
  "Funds sent to Guardian Angels Orphanage.",
  "Payment processed successfully.",
  "Your recent payment was posted.",
  "Payment to Little Stars Orphanage has been posted.",
  "Funds have been transferred to your account.",
  "Your account balance was updated.",
  "Incoming transfer received.",
  "Bill payment completed successfully.",
  "Your contribution to Happy Hearts Orphanage was successful.",
  "Charity payment to Bright Futures Orphanage processed successfully!",
  "Your statement is ready to view.",
  "Donation to Sunshine Orphanage completed successfully!",
  "New beneficiary approved — Global Aid Foundation.",
  "New deposit received in Savings account!",
  "Monthly statement is now available for viewing.",
  "Scheduled payment to school fees completed!",
];

// Security alerts handled separately
const SECURITY_MESSAGE = "Security alert: login from a new device.";

export function Notification() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [isSecurity, setIsSecurity] = useState(false);

  const timerRef = useRef(null);
  const cycleRef = useRef(null);

  useEffect(() => {
    const showNotification = () => {
      const isSecurityAlert = Math.random() < 0.15; // 15% chance

      if (isSecurityAlert) {
        setMessage(SECURITY_MESSAGE);
        setIsSecurity(true);
        setVisible(true);
        return; // 🔒 do NOT auto-dismiss security alerts
      }

      const randomIndex = Math.floor(Math.random() * messages.length);
      setMessage(messages[randomIndex]);
      setIsSecurity(false);
      setVisible(true);

      timerRef.current = setTimeout(() => {
        setVisible(false);
      }, 4000);
    };

    const scheduleNext = () => {
      cycleRef.current = setTimeout(() => {
        showNotification();
        scheduleNext();
      }, Math.random() * 10000 + 8000); // 8–18 sec
    };

    scheduleNext();

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(cycleRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className={`fixed top-18 right-4 sm:right-6 z-50 w-[90%] sm:w-[360px]
            rounded-xl shadow-xl p-4 border-l border-r-2 border-b
            ${isSecurity ? "bg-red-50 border-red-600" : "bg-white border-blue-900"}
          `}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
             <img
  src="/logo.png"
  alt="BBT Logo"
  className="w-7 h-7"
/>

              <strong className="text-sm text-gray-900">
                {isSecurity ? "Security Alert" : "BBT Notification"}
              </strong>
            </div>

            <button
              onClick={() => setVisible(false)}
              className={`text-xs font-medium ${isSecurity ? "text-red-600" : "text-blue-600"
                }`}
            >
              Dismiss
            </button>
          </div>

          <p
            className={`mt-2 text-xs leading-relaxed ${isSecurity ? "text-red-700" : "text-gray-600"
              }`}
          >
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
