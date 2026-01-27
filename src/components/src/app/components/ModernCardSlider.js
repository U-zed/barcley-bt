"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const maskAccount = (acc) => (acc ? "**** " + acc.slice(-4) : "");
const maskCCV = (ccv) => "***";

const BankCard = ({ accountType, accountNumber, ccv, gradient }) => (
  <motion.div
    className="rounded-xl p-6 shadow-xl flex-shrink-0 min-w-[80vw] sm:min-w-[45vw] lg:min-w-[22vw] text-white relative overflow-hidden"
    style={{
      background: gradient,
      clipPath: "polygon(0 0, 100% 0, 100% 85%, 0% 100%)", // angled bottom
    }}
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.6, ease: "easeInOut" }}
  >
    {/* Logo */}
    <div className="absolute top-4 right-4 w-16 h-16">
      <Image src="/logo.png" alt="Bank Logo" width={64} height={64} />
    </div>

    {/* Card Info */}
    <div className="flex flex-col justify-between h-full mt-4">
      <p className="uppercase tracking-widest font-semibold text-sm my-4">{accountType}</p>
      <p className="text-right text-xl tracking-widest my-2">{maskAccount(accountNumber)}</p>
      <div className="flex justify-between mt-3 mb-8">
      <p className="text-sm">CCV: {maskCCV(ccv)}</p>
      <p className="text-sm">EXP: 09/30</p>
      </div>
    </div>
  </motion.div>




);

export default function ModernCardSlider() {
  const accounts = [
    { type: "BB&T checking", accountNumber: "1234567890123042", ccv: "123" },
    { type: "BB&T savings", accountNumber: "9876543210987012", ccv: "456" },
    { type: "BB&T business", accountNumber: "5555666677777388", ccv: "789" },
    { type: "BB&T investment", accountNumber: "1111222233334444", ccv: "321" },
  ];

  const gradients = [
 "linear-gradient(135deg, #0f0c29, #fff, #24243e)",      // blue-900 → silver
"linear-gradient(135deg, #fcb045, #000000)",      // orange-500 → black
"linear-gradient(135deg, #fff, #000000)",      // silver → black
"linear-gradient(135deg, #f97316, #1e3a8a, #c0c0c0)", // orange → blue → silver
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(1); // default mobile

  // Responsive card count
  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth < 640) setCardsToShow(1);
      else if (window.innerWidth < 1024) setCardsToShow(2);
      else setCardsToShow(4);
    };
    updateCardsToShow();
    window.addEventListener("resize", updateCardsToShow);
    return () => window.removeEventListener("resize", updateCardsToShow);
  }, []);

  // Autoplay slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % accounts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [accounts.length]);

  // Get visible slice of cards
  const getVisibleCards = () => {
    const visible = [];
    for (let i = 0; i < cardsToShow; i++) {
      visible.push(accounts[(currentIndex + i) % accounts.length]);
    }
    return visible;
  };

  return (
    <div className=" bg-gradient-to-tr from-slate-600 to-orange-300  w-full overflow-hidden flex justify-center py-10">
      <motion.div
        className="flex gap-5 w-full max-w-[1200px] justify-center"
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 25 }}
      >
        {getVisibleCards().map((acc, idx) => (
          <BankCard
            key={acc.type}
            accountType={acc.type}
            accountNumber={acc.accountNumber}
            ccv={acc.ccv}
            gradient={gradients[(currentIndex + idx) % gradients.length]}
          />
        ))}
      </motion.div>
    </div>
  );
}