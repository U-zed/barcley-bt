"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { db } from "@/lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";

export default function AdminDashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const router = useRouter();
  const sidebarRef = useRef(null);

  // Fetch admin user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const snap = await getDoc(doc(db, "users", "mainUser"));
        if (snap.exists()) {
          const data = snap.data();
          setUser(data);
          setLoading(false);

          if (data?.role !== "admin") {
            router.push("/admin");
          }
        } else {
          setLoading(false);
          router.push("/admin");
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
        router.push("/admin");
      }
    };
    fetchUser();
  }, [router]);

  // Close sidebar on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target) && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  if (loading) return <p className="text-center mt-6 text-white">Loading…</p>;
  if (!user) return null;

  const menuItems = [
    { name: "Codes", href: "/admin/dashboard" },
    { name: "Profile", href: "/admin/dashboard/profile" },
    { name: "Transactions", href: "/admin/dashboard/transactions" },
    { name: "Fund Accounts", href: "/admin/dashboard/add-money" },
    { name: "Beneficiaries", href: "/admin/dashboard/beneficiary" },
    { name: "Couple Savings", href: "/admin/dashboard/couple-savings" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden" />}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo / User */}
        <div className="p-4 border-b border-gray-500 flex flex-col items-center">
          {user?.photo ? (
            <img src={user.photo} alt="Admin" className="w-16 h-16 rounded-full" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-500 flex items-center justify-center text-lg font-bold">
              {user?.fullName?.[0] || "A"}
            </div>
          )}
          <p className="mt-2 font-semibold">{user?.fullName}</p>
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

        <div className="p-4 border-t border-gray-500">
          <button
            className="w-full bg-red-500 hover:bg-red-600 py-2 rounded text-sm font-semibold"
            onClick={() => router.push("/admin")}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Fixed Top Navbar */}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex justify-center">
            <img src="/logo.png" alt="BBT Logo" className="w-11 h-11" />
          </div>
        </header>

        {/* Main content with padding for sidebar on desktop */}
        <main className="flex-1 pt-16 md:pt-0 md:ml-64 bg-slate-950 min-h-screen transition-all">
          {children}
        </main>
      </div>
    </div>
  );
}
