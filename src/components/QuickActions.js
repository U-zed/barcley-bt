"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRightIcon,
  UserPlusIcon,
  UsersIcon,
  HeartIcon,
} from "@heroicons/react/24/solid"; // install @heroicons/react if you haven't

export default function QuickActions() {
  const router = useRouter();
  const [loadingKey, setLoadingKey] = useState(null);

  const navigate = async (key, path) => {
    if (loadingKey) return; // prevent double clicks
    setLoadingKey(key);

    // show spinner instantly
    await Promise.resolve();

    router.push(path);
  };

  return (
    <div className="pt-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Send Money */}
        <button
          data-loading={loadingKey === "send" ? "true" : "false"}
          disabled={loadingKey !== null}
          onClick={() => navigate("send", "/accounts/transfer")}
          className="border border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white p-2 rounded-full font-semibold flex items-center justify-center gap-2"
        >
          <ArrowRightIcon className="h-5 w-5 md:h-5 md:w-5" />
          <span>Send Money</span>
        </button>

        {/* Add Beneficiary */}
        <button
          data-loading={loadingKey === "add" ? "true" : "false"}
          disabled={loadingKey !== null}
          onClick={() => navigate("add", "/accounts/new-beneficiary")}
          className="border border-black text-black hover:bg-gray-500 hover:text-white p-2 rounded-full font-semibold flex items-center justify-center gap-2"
        >
          <UserPlusIcon className="h-5 w-5 md:h-5 md:w-5" />
          <span>Add Beneficiary</span>
        </button>

        {/* View Beneficiaries */}
        <button
          data-loading={loadingKey === "view" ? "true" : "false"}
          disabled={loadingKey !== null}
          onClick={() => navigate("view", "/accounts/beneficiaries-list")}
          className="border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white p-2 rounded-full font-semibold flex items-center justify-center gap-2"
        >
          <UsersIcon className="h-5 w-5 md:h-5 md:w-5" />
          <span> Beneficiaries</span>
        </button>

        {/* Love Vault */}
        <button
          data-loading={loadingKey === "love" ? "true" : "false"}
          disabled={loadingKey !== null}
          onClick={() => navigate("love", "/accounts/couple-savings")}
          className="border border-pink-700 text-pink-700 hover:bg-pink-700 hover:text-white p-2 rounded-full font-semibold flex items-center justify-center gap-2"
        >
          <HeartIcon className="h-5 w-5 md:h-5 md:w-5" />
          <span>Love Vault</span>
        </button>
      </div>
    </div>
  );
}
