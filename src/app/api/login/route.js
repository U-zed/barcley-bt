import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseClient"; // your firebase client
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    // Get user doc by ID (username)
    const userRef = doc(db, "users", username);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const user = userSnap.data();

    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    // Set session doc
    await setDoc(doc(db, "sessions", "current"), {
      fullName: user.fullName,
      username: user.username,
      loggedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, fullName: user.fullName });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
