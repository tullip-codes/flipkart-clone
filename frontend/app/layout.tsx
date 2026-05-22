import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";

export const metadata: Metadata = {
  title: "Flipkart — Online Shopping",
  description: "India's favourite online shopping destination",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F1F3F6] min-h-screen">
        <Navbar />
        <div className="pt-[112px]">{children}</div>
      </body>
    </html>
  );
}