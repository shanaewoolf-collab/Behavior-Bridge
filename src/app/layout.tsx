import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const louisGeorgeCafe = localFont({
  src: [
    {
      path: "./fonts/LouisGeorgeCafe-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/LouisGeorgeCafe-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-louis-george-cafe",
});

export const metadata: Metadata = {
  title: "Behavior Bridge",
  description: "Shared behavior & rewards tracking for home-school teams",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${louisGeorgeCafe.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
