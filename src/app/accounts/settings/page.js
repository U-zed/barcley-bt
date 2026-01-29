"use client";

import Link from "next/link";

export default function SettingsPage() {
  const buttonClass =
    "inline-block mt-3 bg-blue-700 hover:bg-blue-800 text-white text-sm py-2 px-3 rounded-lg transition-all";

  const cardClass =
    "bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all p-5 space-y-2";

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 pt-20 space-y-14">

      {/* Security & Access */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Security & Access</h2>
          <p className="text-sm text-gray-600">Protect your account</p>
        </div>

        <div className="grid md:grid-cols-2 gap-3 md:gap-6">
          <div className={cardClass}>
            <h4 className="font-semibold text-gray-900 text-lg">
              Two-Factor Authentication
            </h4>
            <p className="text-gray-600 text-sm">
              Extra protection for logins and transfers.
            </p>
            <Link href="/admin" className={buttonClass}>
              Enable 2FA
            </Link>
          </div>

          <div className={cardClass}>
            <h4 className="font-semibold text-gray-900 text-lg">
              Active Sessions
            </h4>
            <p className="text-gray-600 text-sm">
              View all devices currently logged in.
            </p>
            <Link href="/admin" className={buttonClass}>
              Logout All
            </Link>
          </div>
        </div>
      </div>

      {/* Profile & Account Settings */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Profile & Account Settings
          </h2>
          <p className="text-sm text-gray-600">
            Manage your account details
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3 md:gap-6">
          <div className={cardClass}>
            <h4 className="font-semibold text-gray-900 text-lg">
              Update Profile
            </h4>
            <p className="text-gray-600 text-sm">
              Change name, email, phone number.
            </p>
            <Link href="/admin" className={buttonClass}>
              Edit
            </Link>
          </div>

          <div className={cardClass}>
            <h4 className="font-semibold text-gray-900 text-lg">
              Password & Security
            </h4>
            <p className="text-gray-600 text-sm">
              Change password and 2FA settings.
            </p>
            <Link href="/admin" className={buttonClass}>
              Manage
            </Link>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Notifications
          </h2>
          <p className="text-sm text-gray-600">
            Control your alerts
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3 md:gap-6">
          <div className={cardClass}>
            <h4 className="font-semibold text-gray-900 text-lg">
              Email Notifications
            </h4>
            <p className="text-gray-600 text-sm">
              Receive alerts about account activity via email.
            </p>
            <Link href="/admin" className={buttonClass}>
              Manage
            </Link>
          </div>

          <div className={cardClass}>
            <h4 className="font-semibold text-gray-900 text-lg">
              Push Notifications
            </h4>
            <p className="text-gray-600 text-sm">
              Enable push alerts for transfers and login attempts.
            </p>
            <Link href="/admin" className={buttonClass}>
              Manage
            </Link>
          </div>
        </div>
      </div>

      {/* Linked Accounts */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Linked Accounts
          </h2>
          <p className="text-sm text-gray-600">
            Manage external accounts
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3 md:gap-6">
          <div className={cardClass}>
            <h4 className="font-semibold text-gray-900 text-lg">
              Bank Accounts
            </h4>
            <p className="text-gray-600 text-sm">
              View or unlink your connected bank accounts.
            </p>
            <Link href="/admin" className={buttonClass}>
              Manage
            </Link>
          </div>

          <div className={cardClass}>
            <h4 className="font-semibold text-gray-900 text-lg">
              Credit Cards
            </h4>
            <p className="text-gray-600 text-sm">
              Manage linked credit and debit cards.
            </p>
            <Link href="/admin" className={buttonClass}>
              Manage
            </Link>
          </div>
        </div>
      </div>

      {/* Statements & Documents */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Statements & Documents
          </h2>
          <p className="text-sm text-gray-600">
            Download official records
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3 md:gap-6">
          <div className={cardClass}>
            <h4 className="font-semibold text-gray-900 text-lg">
              Monthly Statements
            </h4>
            <p className="text-gray-600 text-sm">
              View and download your monthly account statements.
            </p>
            <Link href="/admin" className={buttonClass}>
              View
            </Link>
          </div>

          <div className={cardClass}>
            <h4 className="font-semibold text-gray-900 text-lg">
              Tax Documents
            </h4>
            <p className="text-gray-600 text-sm">
              Download tax forms related to your accounts.
            </p>
            <Link href="/admin" className={buttonClass}>
              View
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
