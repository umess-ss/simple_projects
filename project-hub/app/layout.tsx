import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";

// DejaVu Sans ships only Book (400) and Bold (700) — headings must use
// font-bold, never font-medium (500 would be a synthesized fake weight).
const dejavuSans = localFont({
  src: [
    { path: "./fonts/DejaVuSans.ttf", weight: "400", style: "normal" },
    { path: "./fonts/DejaVuSans-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-dejavu-sans",
});

const dejavuMono = localFont({
  src: "./fonts/DejaVuSansMono.ttf",
  weight: "400",
  variable: "--font-dejavu-mono",
});

export const metadata: Metadata = {
  title: "Project Atlas",
  description:
    "A map of my mini-projects — what they are, how they connect, and what I learned building them.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${dejavuSans.variable} ${dejavuMono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <ToastProvider>
          {children}
          </ToastProvider>
          </main>
        <Footer />
      </body>
    </html>
  );
}
