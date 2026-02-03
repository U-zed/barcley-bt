"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Page() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);


const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Invalid login");
      setLoading(false);
      return;
    }

    router.push("/accounts");
  } catch (err) {
    console.error(err);
    setError("Something went wrong. Please try again.");
    setLoading(false);
  }
};



  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-blue-300">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 12 }}
        className="text-2xl md:text-4xl font-extrabold text-blue-900 text-center py-9 px-3"
      >
        Welcome to Barcley Bank & Trust (BB&T) Guest Access
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 70 }}
        className="p-4 text-lg md:text-xl text-black text-center max-w-lg"
      >
        A secure and intuitive environment designed exclusively for authorized guests to explore essential account features and financial management experiences.
      </motion.p>

      <form onSubmit={handleLogin} className="bg-slate-50 p-8 rounded-xl shadow w-96 my-4">

        <div className="flex justify-center">
          <img
            src="/logo.png"
            alt="BBT Logo"
            className="w-16 h-16"
          />
        </div>
        <h1 className="text-blue-900 text-2xl font-bold my-6 text-center">Enter Credentials</h1>

        {error && <p className="mb-4 text-red-700 text-sm text-center">{error}</p>}

        <input
          placeholder="Username"
          className="w-full mb-4 p-3 rounded bg-slate-800"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 rounded bg-slate-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded flex items-center justify-center gap-2 ${
            loading
              ? "bg-blue-800 cursor-not-allowed"
              : "bg-blue-900 hover:bg-blue-950 text-white text-sm font-semibold"
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p
          className="mt-4 text-center text-sm text-green-800 hover:text-green-950 hover:underline font-semibold cursor-pointer"
          onClick={() => router.push("/admin")}
        >
          Log in to Core Account
        </p>
      </form>
    </main>
  );
}
