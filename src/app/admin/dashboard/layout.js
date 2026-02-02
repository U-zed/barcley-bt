"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminDashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const sidebarRef = useRef(null);

  // ✅ Auth check
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");

    if (!auth) {
      router.replace("/admin"); // redirect to login if not authenticated
    } else {
      setReady(true);
    }
  }, [router]);

  // ✅ Close sidebar on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target) && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  if (!ready) return null; // wait until auth is checked

  // ✅ Sidebar menu items
  const menuItems = [
    { name: "Home", href: "/admin/dashboard" },
    { name: "Codes", href: "/admin/dashboard/otp" },
    { name: "Profile", href: "/admin/dashboard/profile" },
    { name: "Transactions", href: "/admin/dashboard/transactions" },
    { name: "Fund Accounts", href: "/admin/dashboard/add-money" },
    { name: "Beneficiaries", href: "/admin/dashboard/beneficiary" },
    { name: "Couple Savings", href: "/admin/dashboard/couple-savings" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden" />}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo / User */}
        <div className="p-4 border-b border-gray-500 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gray-500 flex items-center justify-center text-lg font-bold">
            A
          </div>
          <p className="mt-2 font-semibold">Admin</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded text-sm font-medium ${
                pathname === item.href
                  ? "bg-slate-800 text-white"
                  : "text-gray-200 hover:bg-gray-800"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-500">
          <button
            className="w-full bg-red-500 hover:bg-red-600 py-2 rounded text-sm font-semibold"
            onClick={() => {
              localStorage.removeItem("adminAuth");
              router.push("/admin");
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar for mobile */}
        <header className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-br from-white to-blue-300 text-blue-900 shadow px-4 py-2 flex items-center justify-between md:hidden">
          <button
            className="p-2 rounded bg-blue-900 text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="flex justify-center">
            <img src="/logo.png" alt="BBT Logo" className="w-11 h-11" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 pt-16 md:pt-0 md:ml-64 bg-slate-950 min-h-screen transition-all">
          {children}
        </main>
      </div>
    </div>
  );
}
