import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "LegalConnect",
  description: "Find attorneys and legal services with LegalConnect",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
