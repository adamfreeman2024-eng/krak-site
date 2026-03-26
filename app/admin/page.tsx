"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Просто перекидываем тебя в раздел товаров, чтобы не было пустой страницы
    router.push('/admin/products');
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
      <div className="text-center">
        <p className="text-red-600 font-black tracking-[0.4em] uppercase mb-4 animate-pulse">
          KRAK ADMIN SYSTEM
        </p>
        <p className="text-xl">ЗАГРУЗКА БАЗЫ ДАННЫХ...</p>
      </div>
    </div>
  );
}