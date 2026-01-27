import { NextResponse } from "next/server";
import { dbAdmin } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password } = body || {};

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    if (
      username === process.env.USER_LOGIN_USERNAME &&
      password === process.env.USER_LOGIN_PASSWORD
    ) {
      try {
        await dbAdmin.collection("logins").add({
          username,
          role: "user",
          timestamp: new Date(),
        });
      } catch (firestoreErr) {
        console.error("Firestore error:", firestoreErr);
        return NextResponse.json({ error: "Database write failed" }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  } catch (err) {
    console.error("Login API unexpected error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
