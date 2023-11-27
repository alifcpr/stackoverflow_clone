import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Space_Grotesk as spaceGrotesk } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});
const spaceGroteskFont = spaceGrotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "----font-spaceGrotesk",
});

export const metadata: Metadata = {
  title: "DevFlow",
  description: "StackOverFlow Clone Project",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "primary-gradient",
          footerActionLink: "primary-text-gradient hover:text-primary-500",
        },
      }}
    >
      <html lang="en">
        <body className={`${inter.variable} ${spaceGroteskFont.variable}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
