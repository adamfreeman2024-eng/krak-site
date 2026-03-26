"use client"

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#f1f1f1] border-t border-zinc-200 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
        
        {/* О НАС */}
        <div>
          <h3 className="text-red-600 font-black italic text-[10px] tracking-widest mb-6 uppercase">О НАС</h3>
          <p className="text-zinc-500 text-[11px] font-bold leading-relaxed uppercase italic">
            KRAK SYSTEM — Профессиональные тактические решения и оружейные системы. 
            Ереван, Армения. Тюнинг, защита, экипировка.
          </p>
        </div>

        {/* ИНФОРМАЦИЯ */}
        <div>
          <h3 className="text-red-600 font-black italic text-[10px] tracking-widest mb-6 uppercase">ИНФОРМАЦИЯ</h3>
          <div className="flex flex-col gap-3">
            <Link href="/catalog" className="text-black text-[10px] font-black italic hover:text-red-600 transition-colors uppercase">КАТАЛОГ</Link>
            <Link href="/delivery" className="text-black text-[10px] font-black italic hover:text-red-600 transition-colors uppercase">ДОСТАВКА</Link>
            <Link href="/faq" className="text-black text-[10px] font-black italic hover:text-red-600 transition-colors uppercase">ВОПРОСЫ</Link>
            <Link href="/contact" className="text-black text-[10px] font-black italic hover:text-red-600 transition-colors uppercase">КОНТАКТЫ</Link>
          </div>
        </div>

        {/* КОНТАКТЫ */}
        <div>
          <h3 className="text-red-600 font-black italic text-[10px] tracking-widest mb-6 uppercase">КОНТАКТЫ</h3>
          <p className="text-black text-xl font-black italic mb-2 tracking-tighter">+374 98 720 008</p>
          <p className="text-zinc-500 text-[10px] font-bold uppercase italic">Ереван, ул. Давит Бек 1/1</p>
          <div className="flex gap-4 mt-6">
             <span className="text-[9px] font-black text-zinc-400 uppercase italic cursor-pointer hover:text-black">Instagram</span>
             <span className="text-[9px] font-black text-zinc-400 uppercase italic cursor-pointer hover:text-black">Telegram</span>
          </div>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-zinc-200 pt-10 text-center">
        <p className="text-zinc-400 text-[8px] font-black tracking-[0.4em] uppercase">
          © 2026 KRAK SYSTEM // ARSENAL ONLINE STORE
        </p>
      </div>
    </footer>
  );
}