import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PhoneGenie - AI Shopping Assistant",
  description: "Find the perfect mobile phone with AI-powered recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

