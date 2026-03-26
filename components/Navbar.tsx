"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/cartStore";

export default function Navbar() {
  const [lang, setLang] = useState("RU");
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Защита для счетчика

  // Подключаем базу корзины
  const cartItems = useCartStore((state: any) => state.cartItems || state.items || []);

  useEffect(() => {
    setIsMounted(true); // Говорим React, что клиент загрузился
    const savedLang = localStorage.getItem("lang") || "RU";
    setLang(savedLang);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const changeLang = (l: string) => {
    localStorage.setItem("lang", l);
    setLang(l);
    window.location.reload();
  };

  const menu: any = {
    RU: { cat: "КАТАЛОГ", range: "ТИР", union: "СОЮЗ", contact: "СВЯЗЬ", cart: "КОРЗИНА" },
    AM: { cat: "ԿԱՏԱԼՈԳ", range: "ՀՐԱՁԳԱՐԱՆ", union: "ՄԻՈՒԹՅՈՒՆ", contact: "ԿԱՊ", cart: "ԶԱՄԲՅՈՒՂ" },
    EN: { cat: "CATALOG", range: "RANGE", union: "UNION", contact: "CONTACT", cart: "CART" }
  };

  const t = menu[lang] || menu.RU;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-md shadow-lg shadow-black/[0.03] h-16' 
        : 'bg-transparent h-24'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <img 
            src="/logo.png" 
            className="h-7 md:h-9 group-hover:scale-110 transition-transform mix-blend-multiply" 
            alt="KRAK" 
          />
        </Link>

        {/* MENU */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/catalog" className="text-[10px] font-black uppercase italic tracking-[0.2em] text-black hover:text-red-600 transition-colors">
            {t.cat}
          </Link>
          <Link href="/range" className="text-[10px] font-black uppercase italic tracking-[0.2em] text-black hover:text-red-600 transition-colors">
            {t.range}
          </Link>
          <Link href="/union" className="text-[10px] font-black uppercase italic tracking-[0.2em] text-black hover:text-red-600 transition-colors">
            {t.union}
          </Link>
          <Link href="/contact" className="text-[10px] font-black uppercase italic tracking-[0.2em] text-black hover:text-red-600 transition-colors">
            {t.contact}
          </Link>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-8">
          <div className="flex gap-3 text-[10px] font-black italic border-r border-zinc-200 pr-6">
            {["AM", "RU", "EN"].map((l) => (
              <button 
                key={l}
                onClick={() => changeLang(l)} 
                className={`transition-all hover:scale-110 ${
                  lang === l ? 'text-red-600 scale-110' : 'text-zinc-300 hover:text-black'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          
          {/* КНОПКА КОРЗИНЫ СО СЧЕТЧИКОМ */}
          <Link 
            href="/cart" 
            className="relative bg-red-600 text-white px-8 py-3 text-[10px] font-black italic uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-red-600/20 active:scale-95"
          >
            {t.cart}
            
            {/* ИНДИКАТОР ТОВАРОВ */}
            {isMounted && cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-mono w-5 h-5 flex items-center justify-center rounded-full border border-white shadow-md">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>

      </div>
    </nav>
  );
}