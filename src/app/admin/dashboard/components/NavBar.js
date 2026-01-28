"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavBar({ sidebarOpen, setSidebarOpen, user }) {
  const pathname = usePathname();
  const sidebarRef = useRef();

  // Close sidebar when clicking outside (mobile)
  useEffect(() => {

    const handleClickOutside = (e) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        sidebarOpen
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen, setSidebarOpen]);

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Profile", href: "/admin/dashboard/profile" },
    { name: "Transactions", href: "/admin/dashboard/transactions" },
    { name: "Users", href: "/admin/dashboard/users" },
    { name: "Reports", href: "/admin/dashboard/reports" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden" />
      )}

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-blue-900 text-white transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo / User Info */}
        <div className="p-4 border-b border-blue-800 flex flex-col items-center">
          {user?.photo ? (
<p>d</p>          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-500 flex items-center justify-center text-lg font-bold">
              {user?.fullName?.[0] || "A"}
            </div>
          )}
          <p className="mt-2 font-semibold">{user?.fullName || "Admin"}</p>
          <p className="text-xs text-gray-200">{user?.role || "Administrator"}</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded text-sm font-medium ${
                pathname === item.href
                  ? "bg-blue-700 text-white"
                  : "text-gray-200 hover:bg-blue-800"
              }`}
              onClick={() => setSidebarOpen(false)} // close sidebar on mobile
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-blue-800">
          <button
            className="w-full bg-red-500 hover:bg-red-600 py-2 rounded text-sm font-semibold"
            onClick={() => {
              // Call your logout handler here
              window.location.href = "/admin"; // redirect to login
            }}
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
