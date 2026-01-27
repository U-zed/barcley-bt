import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Notification } from "@/components/Notification";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Barcley Bank & Trust",
  description: "Barcley Bank & Trust – a personalized offshore business-only bank for sending money, managing beneficiaries, and tracking transactions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Notification/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
