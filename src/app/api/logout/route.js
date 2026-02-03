import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseClient";
import { doc, deleteDoc } from "firebase/firestore";

export async function POST() {
  try {
    await deleteDoc(doc(db, "sessions", "current"));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
