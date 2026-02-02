import { NextResponse } from "next/server";
import { dbAdmin } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const snapshot = await dbAdmin
      .collection("users")
      .where("username", "==", username)
      .where("password", "==", password)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Log login attempts
    await dbAdmin.collection("logins").add({
      username: userData.username,
      role: "user",
      timestamp: new Date(),
    });

    // Return full user data
    return NextResponse.json({
      success: true,
      profileId: userDoc.id,
      user: {
        fullName: userData.fullName,
        photo: userData.photo || null,
        username: userData.username,
      },
    });
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
