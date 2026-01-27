"use client";

import { useRouter } from "next/navigation";

export default function QuickActions() {
    const router = useRouter();

    return (
        <div className="p-6 h-fit">
            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4  gap-3 ">
                <button
                    onClick={() => router.push("/accounts/transfer")} // Send Money page
                    className="border border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white p-2 rounded-full transition-all font-semibold"
                >
                    Send Money
                </button>

                <button
                    onClick={() => router.push("/accounts/new-beneficiary")}
                    className="border border-black text-black hover:bg-gray-500 hover:text-white hover:border-gray-500 p-2 rounded-full transition-all font-semibold"
                >
                    Add Beneficiary
                </button>

                <button
                    onClick={() => router.push("/accounts/beneficiaries-list")} // View Beneficiaries page
                    className="border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white p-2 rounded-full transition-all font-semibold"
                >
                    View Beneficiaries
                </button>

                <button
                    onClick={() => router.push("/accounts/couple-savings")} // Love Vault page
                    className="border border-pink-700 text-pink-700 hover:bg-pink-700 hover:text-white p-2 rounded-full transition-all font-semibold"
                >
                    Love Vault
                </button>
            </div>
        </div>
    );
}
