import { NextResponse } from "next/server";
import { dbAdmin } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (username === process.env.USER_LOGIN_USERNAME &&
        password === process.env.USER_LOGIN_PASSWORD) {
      await dbAdmin.collection("logins").add({
        username,
        role: "user",
        timestamp: new Date(),
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
