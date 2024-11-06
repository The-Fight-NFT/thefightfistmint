import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import NavbarGreen from "@/components/mintpage/NavbarGreen";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TTS - MINT NFTs",
  description: "The Fight NFT Collections from TTS",
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
        <ThirdwebProvider>
          <div className="absolute top-0 inset-x-0 z-50">
            <NavbarGreen />
          </div>
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}
