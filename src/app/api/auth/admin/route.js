import { NextResponse } from "next/server";
import { dbAdmin, adminFirestore } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // Fetch credentials from Firestore
    const credsSnap = await dbAdmin.collection("loginCredentials").doc("users").get();
    if (!credsSnap.exists) {
      return NextResponse.json(
        { error: "Admin credentials not set" },
        { status: 500 }
      );
    }

    const creds = credsSnap.data();

    // Validate credentials
    if (username === creds.adminUsername && password === creds.adminPassword) {
      // Log the login in Firestore
      await dbAdmin.collection("logins").add({
        username,
        role: "admin",
        timestamp: adminFirestore.FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid admin credentials" },
      { status: 401 }
    );
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
