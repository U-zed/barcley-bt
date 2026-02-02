"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const links = [
    { href: "/accounts", label: "Home" },
    { href: "/accounts/profile", label: "Profile" },
    { href: "/accounts/bills", label: "Bill Pay" },
    { href: "/accounts/business-tools", label: "Business Tools" },
    { href: "/accounts/settings", label: "Settings" },
    { href: "/admin", label: "Login Core Account" },
    { href: "/", label: "Logout" },
  ];

  const handleLinkClick = () => setOpen(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav ref={containerRef} className="bg-gradient-to-br from-white to-blue-300 text-blue-900 shadow-md fixed w-full z-50 top-0 left-0">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4 md:p-6">
        {/* Logo */}
        <Link href="/accounts" className="flex items-center gap-2">
          <Image src="/logo.png" alt="BB&T Logo" width={50} height={50} priority />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex md:gap-4 items-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 px-4 rounded hover:bg-blue-900 hover:text-white transition-all font-semibold"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden font-semibold text-4xl focus:outline-none"
          aria-label="Toggle Menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="md:hidden bg-gradient-to-br from-white to-blue-300 flex flex-col overflow-hidden shadow-lg"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="py-3 px-6 hover:bg-gray-50 hover:text-black text-slate-900 transition-all font-medium text-base border-b border-gray-200"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
