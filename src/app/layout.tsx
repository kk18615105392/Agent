import type { Metadata } from "next";
import { IBM_Plex_Mono, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "ForgeAgent — Multi-Agent Orchestration Studio",
  description:
    "Interview-ready agent platform built with Vercel AI SDK ToolLoopAgent, subagents, tools, memory and traces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`h-full ${sora.variable} ${plexMono.variable}`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
