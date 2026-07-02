import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Noto_Sans_Arabic, Noto_Sans_Devanagari, Noto_Sans_Malayalam } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-phronesis-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
});

const notoMalayalam = Noto_Sans_Malayalam({
  variable: "--font-noto-malayalam",
  subsets: ["malayalam"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PHRONESIS — Luxury Car Atelier, Al Ain",
  description: "Al Ain's atelier of extraordinary automobiles. Lamborghini, Rolls-Royce, Bentley, Ferrari, McLaren and more — delivered 24/7 with concierge care across the UAE.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${notoArabic.variable} ${notoDevanagari.variable} ${notoMalayalam.variable} antialiased`}>
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#ffffff",
              border: "1px solid rgba(30, 64, 175,0.3)",
              color: "#0f172a",
            },
          }}
        />
      </body>
    </html>
  );
}
