import { NextResponse } from "next/server";
import { dbAdmin } from "@/lib/firebaseAdmin";

const USERS = [
  { name: process.env.USER1_NAME, username: process.env.USER1_USERNAME, password: process.env.USER1_PASSWORD },
  { name: process.env.USER2_NAME, username: process.env.USER2_USERNAME, password: process.env.USER2_PASSWORD },
  { name: process.env.USER3_NAME, username: process.env.USER3_USERNAME, password: process.env.USER3_PASSWORD },
  { name: process.env.USER4_NAME, username: process.env.USER4_USERNAME, password: process.env.USER4_PASSWORD },
  { name: process.env.USER5_NAME, username: process.env.USER5_USERNAME, password: process.env.USER5_PASSWORD },
];

export async function POST(req) {
  const { username, password } = await req.json();

  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await dbAdmin
    .collection("sessions")
    .doc("current")
    .set({
      username: user.username,
      fullName: user.name,
      loggedInAt: new Date(),
    });

  return NextResponse.json({ success: true });
}
