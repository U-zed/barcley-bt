"use client";

import { motion } from "framer-motion";

export default function Footer() {
  const links = [
    { label: "Home", href: "/accounts" },
    { label: "Profile", href: "/accounts/profile" },
    { label: "Bill Pay", href: "/accounts/bills" },
    { label: "Business Tools", href: "/accounts/business-tools" },
    { label: "Settings", href: "/accounts/settings" },
  ];

  return (
    <footer className="bg-blue-900 text-white ">
      <div className="max-w-7xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6">
        {/* Contact */}
        <div>
          <h4 className="font-bold mb-2">Contact Us</h4>
          <p className="text-white/70 text-sm">BB&T Bank HQ</p>
          <p className="text-white/70 text-sm">25 Canary Wharf, London E14 5AB, United Kingdom</p>
          <p className="text-white/70 text-sm">support@bbt.com | +44 20 7946 0958</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold mb-2">Quick Links</h4>
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                whileHover={{ x: 5 }}
                className="text-white/70 text-sm hover:text-white transition"
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        </div>

      </div>

      <div className="bg-blue-800 text-white/60 text-center text-sm py-4">
        &copy; {new Date().getFullYear()} BB&T Bank & Trust. All rights reserved.
      </div>
    </footer>
  );
}