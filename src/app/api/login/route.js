import { NextResponse } from "next/server";

const users = [
  { fullName: process.env.USER1_NAME, username: process.env.USER1_USERNAME, password: process.env.USER1_PASSWORD },
  { fullName: process.env.USER2_NAME, username: process.env.USER2_USERNAME, password: process.env.USER2_PASSWORD },
  { fullName: process.env.USER3_NAME, username: process.env.USER3_USERNAME, password: process.env.USER3_PASSWORD },
  { fullName: process.env.USER4_NAME, username: process.env.USER4_USERNAME, password: process.env.USER4_PASSWORD },
  { fullName: process.env.USER5_NAME, username: process.env.USER5_USERNAME, password: process.env.USER5_PASSWORD },
];

export async function POST(req) {
  const body = await req.json();
  const { username, password } = body;

  const matchedUser = users.find(u => u.username === username && u.password === password);

  if (!matchedUser) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Return only fullName and username
  return NextResponse.json({ fullName: matchedUser.fullName, username: matchedUser.username });
}
