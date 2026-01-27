"use client";

import Link from "next/link";

export default function AdminNavbar() {
  return (
    <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
      <div className="font-bold text-xl">Admin Panel</div>
      <ul className="flex gap-6">
        <li>
          <Link href="/admin/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/admin/transfer" className="hover:underline">
            Transfer
          </Link>
        </li>
        <li>
          <Link href="/admin/transactions" className="hover:underline">
            Transactions
          </Link>
        </li>
        <li>
          <Link href="/admin/opt" className="hover:underline">
            OPT
          </Link>
        </li>
        <li>
          <Link href="/admin/info" className="hover:underline">
            Info
          </Link>
        </li>
        <li>
          <Link href="/admin/couple-savings" className="hover:underline">
            Couple Savings
          </Link>
        </li>
        <li>
          <Link href="/admin/beneficiary" className="hover:underline">
            Beneficiary
          </Link>
        </li>
      </ul>
    </nav>
  );
}
