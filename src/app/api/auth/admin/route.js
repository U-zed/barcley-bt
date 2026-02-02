// import { NextResponse } from "next/server";
// import { dbAdmin, adminFirestore } from "@/lib/firebaseAdmin";

// export async function POST(req) {
//   try {
//     const { username, password } = await req.json();

//     if (!username || !password) {
//       return NextResponse.json({ error: "Username and password required" }, { status: 400 });
//     }

//     const adminUsername = process.env.ADMIN_USERNAME;
//     const adminPassword = process.env.ADMIN_PASSWORD;

//     if (username === adminUsername && password === adminPassword) {
//       try {
//         await dbAdmin.collection("logins").add({
//           username,
//           role: "admin",
//           timestamp: adminFirestore.FieldValue.serverTimestamp(),
//         });
//       } catch (logErr) {
//         console.warn("Failed to log admin login:", logErr);
//       }

//       return NextResponse.json({ success: true });
//     }

//     return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
//   } catch (err) {
//     console.error("Admin login error:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";

export async function POST(req) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Missing credentials" },
      { status: 400 }
    );
  }

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { error: "Invalid credentials" },
    { status: 401 }
  );
}
