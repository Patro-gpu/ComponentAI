import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "ComponentAI — AI Component Generator",
  description: "Generate production-grade UI components with AI. React, Vue, Svelte, HTML, Web Components.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-200 min-h-screen antialiased">
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
