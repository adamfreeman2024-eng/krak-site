import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AOSProvider } from "@/components/AOSProvider";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "KRAK SYSTEM | Professional Tactical Equipment Yerevan",
  description: "Магазин профессионального снаряжения в Армении. Тюнинг, защита, экипировка. Снаряжение для профи. Доставка по всей Армении.",
  // ... остальные метаданные оставляем как есть
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      {/* МЫ ПОМЕНЯЛИ bg-black на bg-[#F8F9FA] и text-white на text-black */}
      <body className={`${inter.className} bg-[#F8F9FA] text-[#1A1A1A] antialiased flex flex-col min-h-screen`}>
        <AOSProvider /> 
        
        <Navbar />
        {/* Добавили небольшой минимальный фон для всего контента */}
        <main className="flex-grow bg-[#F8F9FA]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}