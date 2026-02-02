"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("adminAuth", "true"); // 🔑 store auth flag
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Server error, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white py-8 px-3">
  <div className="px-8">
        <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 12 }}
        className="text-2xl md:text-4xl font-extrabold upp text-orange-500 text-center py-9"
      >
        Barcley Bank & Trust Core Account Access Required</motion.h1>
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
        className="text-lg md:text-xl font-semibold text-white text-center pb-12 px-2"
      >
        You are leaving the Guest Account environment. To access full account features, secure transfers, and advanced financial tools, please log in to the core account. <i className="text-orange-500">Barcley Bank & Trust Guest Access</i> allows you to explore limited features
      </motion.h2>
  </div>

      <form
        onSubmit={handleLogin}
        className="bg-gray-50 py-8 rounded-xl w-full md:w-1/2 space-y-2"
      >
        <div className="flex justify-center bg-white w-fit mx-auto rounded-full p-1">
          <img src="/logo.png" alt="BBT Logo" className="w-14 h-14" />
        </div>

        <h1 className="text-blue-900 text-lg font-bold text-center "> Enter Credentials </h1>
        <p className="text-center text-sm text-gray-800 px-4">Logging in ensures full security,
          access to personalized services, and complete account control. An OTP code will be sent to verify your identity.</p>
        {error && <p className="my-3 text-red-600 text-sm text-center">{error}</p>}

        <div className="px-9 space-y-3 w-full">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-800 mb-1">Email:</label>
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full p-3 rounded bg-gray-100 text-black border border-gray-300 focus:ring focus:ring-blue-900 outline-none transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-800 mb-1">Password:</label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full p-3 rounded bg-gray-100 text-black border border-gray-300 focus:ring focus:ring-blue-900 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-6 rounded flex items-center justify-center gap-2 text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-900 hover:bg-blue-950"
              } transition`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
        <p className="mt-3 text-center text-sm text-green-700 hover:text-red-800 hover:underline font-semibold cursor-pointer transition-all"
          onClick={() => router.push("/")}>
          Log in to Guest Access
        </p>
      </form>
    </main>
  );
}
