import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";
import { MARKDOWN_PATH, profile } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: profile.name,
  description: profile.tagline,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={cn("scroll-smooth font-sans", inter.variable)}>
      <head>
        {/* Lets agents find the markdown rendering of this site without executing JS. */}
        <link rel="alternate" type="text/markdown" href={MARKDOWN_PATH} />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
