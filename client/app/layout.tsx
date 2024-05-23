import type { Metadata } from "next";

import "./globals.css";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";

import Layout from "@/components/Layout";

export const metadata: Metadata = {
  title: "US-Lamp",
  description: "IOT Lamp Control",
};

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

export default RootLayout;
