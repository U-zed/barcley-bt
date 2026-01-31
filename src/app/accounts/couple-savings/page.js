"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

/* ---------- MAIN COMPONENT ---------- */
export default function LoveVault() {
  const [activeView, setActiveView] = useState("home"); // home | signup | payin | Profile
  const [lockEnd, setLockEnd] = useState(new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000));
  const [progress, setProgress] = useState(0.45);
  const [countdown, setCountdown] = useState({});
  const [signedInUser, setSignedInUser] = useState(null); // store signed-in user

  // Countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = lockEnd - now;
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 });
        clearInterval(interval);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      setCountdown({ days, hours, mins, secs });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockEnd]);

  // Callback after signup to set signed-in user
  const handleSignupSuccess = (user) => {
    setSignedInUser(user); // { name, email }
    setActiveView("payin"); // go to PayIn after signup
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-orange-500 p-6 mt-15">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-pink-700 mb-2">Love Vault Account</h1>
        <p className="text-gray-600 text-lg">
          Save together with confidence, secure your future, and enjoy rewarding benefits when your lock period ends.
        </p>
      </motion.div>

      {/* CLICKABLE CARDS */}
      {activeView === "home" && (
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <VaultCard
            title="New Member Can Sign Up Here"
            text="New couple? Lock your savings and reach your goals together."
            img="/sign.png"
            onClick={() => setActiveView("signup")}
          />
          <VaultCard
            title="Already A Member? Click To Save"
            text="Already a member? Pay weekly or ahead and maximize benefits."
            img="/add.png"
            onClick={() => {
              if (signedInUser) setActiveView("payin");
              else alert("Please sign up first to pay in.");
            }}
          />
          <VaultCard
            title="View Profile"
            text="Track your payments, see progress and completed goals."
            img="/profile.jpg"
            onClick={() => setActiveView("Profile")}
          />
        </div>
      )}

      {/* SIGNUP FORM */}
      {activeView === "signup" && <SignupForm onBack={() => setActiveView("home")} onSuccess={handleSignupSuccess} />}

      {/* PAY IN FORM */}
      {activeView === "payin" && signedInUser && <PayInForm onBack={() => setActiveView("home")} user={signedInUser} />}

      {/* PROFILE VIEW */}
      {activeView === "Profile" && <ProfileView onBack={() => setActiveView("home")} />}

      {/* PROGRESS + COUNTDOWN */}
      {activeView !== "home" && (
        <div className="max-w-xl mx-auto mt-8 text-center">
          <h2 className="font-bold text-lg text-pink-700 mb-3">Your Love Vault Progress</h2>
          <div className="relative w-40 h-40 mx-auto mb-4">
            <svg className="w-full h-full rotate-[-90deg]">
              <circle cx="80" cy="80" r="70" stroke="#f3f3f3" strokeWidth="15" fill="none" />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#ec4899"
                strokeWidth="15"
                strokeDasharray={2 * Math.PI * 70}
                strokeDashoffset={2 * Math.PI * 70 * (1 - progress)}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold">{Math.floor(progress * 100)}%</span>
              <span className="text-sm text-gray-600">towards goal</span>
            </div>
          </div>
          <div className="text-gray-700 font-semibold">
            Lock Countdown: {countdown.days}d {countdown.hours}h {countdown.mins}m {countdown.secs}s
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- VAULT CARD ---------- */
function VaultCard({ title, text, img, onClick }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} onClick={onClick} className="rounded-2xl overflow-hidden shadow-lg cursor-pointer bg-white">
      <div className="h-44 w-full relative">
        <Image src={img} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" priority />
      </div>
      <div className="p-5 group">
        <h3 className="flex items-center gap-2 font-bold text-lg text-pink-700">
          {title}
          <span className="transition-transform duration-300 group-hover:translate-x-2 text-2xl">›</span>
        </h3>
        <p className="text-sm text-gray-600 mt-2">{text}</p>
      </div>
    </motion.div>
  );
}

/* ---------- SIGNUP FORM ---------- */
function SignupForm({ onBack, onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [weeklyAmount, setWeeklyAmount] = useState("");
  const [goal, setGoal] = useState("");
  const [lockDuration, setLockDuration] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "loveVaultUsers"), {
        name,
        email,
        phone,
        weeklyAmount,
        goal,
        lockDuration,
        createdAt: serverTimestamp(),
      });
      alert("Account created successfully!");
      onSuccess({ name, email }); // send user back
    } catch (err) {
      console.error(err);
      alert("Failed to create account");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow space-y-4 ">
      <h2 className="text-center text-xl font-bold text-pink-700 mb-5">Open a Love Vault Account</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex justify-between gap-2">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your Name" className="w-full p-2 mb-2 border border-orange-500 rounded bg-gray-50 text-black" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full p-2 mb-2 border border-orange-500 rounded bg-gray-50 text-black" />
        </div>
        <div className="flex justify-between gap-2">
          <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="Phone number" className="w-full p-2 mb-2 border border-orange-500 rounded bg-gray-50 text-black" />
          <select value={weeklyAmount} onChange={(e) => setWeeklyAmount(e.target.value)} required className="w-full p-2 mb-2 border border-orange-500 rounded bg-gray-50 text-black">
            <option value="">Weekly Amount</option>
            <option value="$200 / week">$200 / week</option>
            <option value="$300 / week">$300 / week</option>
            <option value="$400 / week">$400 / week</option>
            <option value="$500 / week">$500 / week</option>
            <option value="$1000 / week">$1000 / week</option>
          </select>
        </div>
        <div className="flex justify-between gap-2">
          <select value={goal} onChange={(e) => setGoal(e.target.value)} required className="w-full p-2 mb-2 border border-orange-500 rounded bg-gray-50 text-black">
            <option value="">Love Goal</option>
            <option value="Wedding / Engagement">💍 Wedding / Engagement</option>
            <option value="Moving In Together">🏡 Moving In Together</option>
            <option value="Romantic Vacation">✈️ Romantic Vacation</option>
            <option value="Starting a Family">👶 Starting a Family</option>
            <option value="Forever Security Fund">💑 Forever Security Fund</option>
          </select>
          <select value={lockDuration} onChange={(e) => setLockDuration(e.target.value)} required className="w-full p-2 mb-2 border border-orange-500 rounded bg-gray-50 text-black">
            <option value="">Lock Duration</option>
            <option value="6 Months – Good Benefits">6 Months – Good Benefits</option>
            <option value="9 Months – Better Benefits">9 Months – Better Benefits</option>
            <option value="12 Months – Huge Benefits">12 Months – Huge Benefits</option>
            <option value="18 Months – Maximum Benefits">18 Months – Maximum Benefits</option>
          </select>
        </div>
        <div className="flex justify-between gap-1 mt-4">
          <button type="button" onClick={onBack} className="bg-gray-600 hover:bg-gray-700 w-fit text-white px-7 py-2 rounded">Back</button>
          <button type="submit" className="bg-blue-900 hover:bg-blue-950 w-fit text-white px-7 py-2 rounded">Start Saving</button>
        </div>
      </form>
    </div>
  );
}

/* ---------- PAY IN FORM ---------- */
function PayInForm({ onBack, user }) {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "loveVaultPayments"), {
        name: user.name,
        email: user.email,
        amount,
        paymentMethod,
        createdAt: serverTimestamp(),
      });
      alert("Payment recorded successfully!");
      onBack();
    } catch (err) {
      console.error(err);
      alert("Failed to record payment");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow space-y-4">
      <h2 className="text-center text-xl font-bold text-pink-700 mb-5">Pay Into Love Vault Account</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex justify-between gap-2">
          <span className="w-full p-2 mb-2 border border-orange-500 rounded bg-gray-50 text-black">{user.name}</span>
          <span className="w-full p-2 mb-2 border border-orange-500 rounded bg-gray-50 text-black">{user.email}</span>
        </div>
        <div className="flex justify-between gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="Amount to Pay"
            className="w-full p-2 mb-2 border border-orange-500 rounded bg-gray-50 text-black"
          />
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
            className="w-full p-2 mb-2 border border-orange-500 rounded bg-gray-50 text-black"
          >
            <option value="">Payment Method</option>
            <option value="paypal">PayPal</option>
            <option value="venmo">Venmo</option>
            <option value="bitcoin">Bitcoin (Highest Benefits)</option>
          </select>
        </div>
        <div className="flex justify-between gap-1 mt-4">
          <button type="button" onClick={onBack} className="bg-gray-600 hover:bg-gray-700 w-fit text-white px-7 py-2 rounded">Back</button>
          <button type="submit" className="bg-blue-900 hover:bg-blue-950 w-fit text-white px-7 py-2 rounded">Pay In</button>
        </div>
      </form>
    </div>
  );
}

/* ---------- PROFILE VIEW ---------- */
function ProfileView({ onBack }) {
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const usersQuery = query(collection(db, "loveVaultUsers"), orderBy("createdAt", "desc"));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    const paymentsQuery = query(collection(db, "loveVaultPayments"), orderBy("createdAt", "desc"));
    const unsubscribePayments = onSnapshot(paymentsQuery, (snapshot) => {
      setPayments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubscribeUsers();
      unsubscribePayments();
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 pt-10 rounded-2xl shadow space-y-3">
      <h2 className="text-2xl font-bold text-pink-700">Payment Profile</h2>

      {loading && <p className="text-gray-500">Loadg...</p>}

      {!loading && users.length === 0 && payments.length === 0 && (
        <p className="text-gray-500">No user or payment data yet.</p>
      )}

      {users.map((user) => (
        <div key={user.id} className="p-3 border rounded flex justify-between">
          <span>{user.name} – {user.goal}</span>
          <span className="font-bold">{user.weeklyAmount}</span>
        </div>
      ))}

      {payments.map((tx) => (
        <div key={tx.id} className="p-3 border rounded flex justify-between">
          <span>{tx.name} – {tx.paymentMethod}</span>
          <span className="font-bold">${tx.amount}</span>
        </div>
      ))}

      <button
        onClick={onBack}
        className="bg-gray-600 hover:bg-gray-700 w-full font-semibold text-white px-7 py-2 rounded mt-4 mx-auto"
      >
        Back
      </button>
    </div>
  );
}
