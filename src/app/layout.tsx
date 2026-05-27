import type { Metadata } from "next";
import { Space_Grotesk, DM_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Logos Global Uptime Leaderboard",
  description:
    "Global node uptime leaderboard ranked by country for the Logos network.",
  openGraph: {
    title: "Logos Global Uptime Leaderboard",
    description: "Global node uptime leaderboard ranked by country for the Logos network.",
    url: "https://leaderboard.logos.live",
    images: [{ url: "/social.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Logos Global Uptime Leaderboard",
    description: "Global node uptime leaderboard ranked by country for the Logos network.",
    images: ["/social.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmMono.variable} h-full antialiased overflow-x-hidden`}>
      <body className="min-h-full font-sans bg-bg-deep">{children}</body>
    </html>
  );
}