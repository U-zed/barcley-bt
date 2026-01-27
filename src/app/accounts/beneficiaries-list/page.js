"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebaseClient";


// Helper to mask sensitive info
const mask = (value, type) => {
    if (!value) return "-";
    switch (type) {
        case "password":
            return "***";
        case "routing":
            return value.slice(-4).padStart(value.length, "*");
        case "account":
            return "**** " + value.slice(-4);
        default:
            return value;
    }
};

function BeneficiariesList() {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "beneficiaries"), (snap) => {
            setBeneficiaries(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto p-3 md:p-6 mt-15">
            {/* Header */}
            <div className="my-6 flex justify-between items-center">
                <div>
                    <h1 className="text-center text-3xl font-bold text-blue-900">Beneficiaries</h1>
                    <p className="text-center text-gray-500 p-5">
                        Manage all your trusted business accounts securely in one place
                    </p>
                </div>
            </div>


            {/* Beneficiaries List */}
            {beneficiaries.length === 0 ? (
                <p className="text-gray-400 text-center mt-4">No beneficiaries yet.</p>
            ) : (
                <div className="flex flex-col gap-2 w-full bg-white rounded-lg shadow">
                    {beneficiaries
                        .slice()
                        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
                        .map((b) => (
                            <div key={b.id} className="flex flex-col gap-2 font-medium text-sm text-gray-700 border-b border-gray-200 p-2 px-3">

                                <div className="flex justify-between">
                                    <span>Name:</span><span>{b.name || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Bank:</span><span>{b.bank || "-"}</span>
                                </div>  
                                <div className="flex justify-between">
                                    <span>Routing #:</span>
                                    <span>{mask(b.routingNumber, "routing")}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Account #:</span>
                                    <span>{mask(b.accountNumber, "account")}</span>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}

export default BeneficiariesList;