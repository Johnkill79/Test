import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeInitScript } from "@/components/ThemeInitScript";

export const metadata: Metadata = {
  title: "JP CAR RENTAL",
  description: "Premium car rentals with WhatsApp booking and online payments.",
  metadataBase: new URL("http://localhost:3000")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-dvh">
        <ThemeInitScript />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

