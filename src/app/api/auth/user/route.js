import { NextResponse } from "next/server";
import { dbAdmin } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    // Fetch all users credentials from Firestore
    const snapshot = await dbAdmin.collection("loginCredentials").get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Find matching user
    const user = users.find(u => u.userUsername === username && u.userPassword === password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Log successful login (audit trail)
    try {
      await dbAdmin.collection("logins").add({
        username: user.userUsername,
        role: "user",
        timestamp: new Date(),
      });
    } catch (err) {
      console.error("Firestore logging error:", err);
    }

    // Success response
    return NextResponse.json({
      success: true,
      username: user.userUsername,
      profileId: user.id,
    });
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
