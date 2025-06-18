import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "DNA Testing Service | Paternity and Genetic Testing",
  description: "Professional DNA testing services for paternity, ancestry, and genetic health. Schedule your appointment or order a home test kit today.",
  keywords: "DNA testing, paternity test, genetic testing, ancestry, health screening",
  authors: [{ name: "DNA Testing VN" }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
