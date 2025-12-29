import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'DramaBox';

export const metadata: Metadata = {
  title: `${APP_NAME} Streaming - Tonton Drama Terbaru`,
  description: "Platform streaming drama terbaik dengan koleksi drama terbaru, trending, dan populer. Tonton drama favorit Anda secara online dengan kualitas terbaik.",
  keywords: ["drama", "streaming", "korean drama", "dramabox", "watch drama online", "drama terbaru"],
  authors: [{ name: APP_NAME }],
  openGraph: {
    title: `${APP_NAME} Streaming - Tonton Drama Terbaru`,
    description: "Platform streaming drama terbaik dengan koleksi drama terbaru, trending, dan populer.",
    type: "website",
    locale: "id_ID",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
