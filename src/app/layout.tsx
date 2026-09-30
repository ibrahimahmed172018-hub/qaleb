import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QALEB | أنظمة ومتاجر ويب جاهزة بخصم الإطلاق",
  description: "أنظمة ومتاجر ويب جاهزة بخصم الإطلاق - منصة قوالب متكاملة للمشاريع الرقمية والمتاجر الإلكترونية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className={`${cairo.className} bg-brand-bg text-brand-text-primary antialiased selection:bg-brand-accent-1/20 selection:text-brand-accent-2`}>
        {children}
      </body>
    </html>
  );
}
