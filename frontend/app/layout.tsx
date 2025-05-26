import type { Metadata } from "next";
import "./globals.css";

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
      </body>
    </html>
  );
}
