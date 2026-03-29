"use client"

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#f1f1f1] border-t border-zinc-300 pt-20 pb-10 px-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
        
        {/* БЛОК 1: О ПРОЕКТЕ И БЕЗОПАСНОСТЬ */}
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-red-600 font-black italic text-[12px] tracking-widest mb-4 uppercase">О проекте</h3>
            <p className="text-zinc-600 text-[11px] font-bold leading-relaxed uppercase italic">
              KRAK SYSTEM — Профессиональный онлайн-арсенал. 
              Передовые тактические решения, оружие, тюнинг и экипировка.
            </p>
          </div>
          
          {/* Возрастные ограничения */}
          <div className="flex gap-3 mt-2">
            <div className="bg-zinc-200 border border-zinc-300 px-4 py-2 flex flex-col items-center justify-center skew-x-[-5deg]">
              <span className="text-red-600 font-black italic text-xl leading-none skew-x-[5deg]">18+</span>
              <span className="text-zinc-500 text-[7px] font-black uppercase tracking-widest mt-1 skew-x-[5deg]">Любое оружие</span>
            </div>
            <div className="bg-zinc-200 border border-zinc-300 px-4 py-2 flex flex-col items-center justify-center skew-x-[-5deg]">
              <span className="text-red-600 font-black italic text-xl leading-none skew-x-[5deg]">21+</span>
              <span className="text-zinc-500 text-[7px] font-black uppercase tracking-widest mt-1 skew-x-[5deg]">Нарезное</span>
            </div>
          </div>
        </div>

        {/* БЛОК 2: НАВИГАЦИЯ */}
        <div>
          <h3 className="text-red-600 font-black italic text-[12px] tracking-widest mb-6 uppercase">Навигация</h3>
          <div className="flex flex-col gap-4">
            <Link href="/catalog" className="text-zinc-800 text-[11px] font-black italic hover:text-red-600 hover:translate-x-2 transition-all uppercase w-max">/ Каталог</Link>
            <Link href="/range" className="text-zinc-800 text-[11px] font-black italic hover:text-red-600 hover:translate-x-2 transition-all uppercase w-max">/ Тир</Link>
            <Link href="/union" className="text-zinc-800 text-[11px] font-black italic hover:text-red-600 hover:translate-x-2 transition-all uppercase w-max">/ Союз</Link>
            <Link href="/contact" className="text-zinc-800 text-[11px] font-black italic hover:text-red-600 hover:translate-x-2 transition-all uppercase w-max">/ Связь</Link>
          </div>
        </div>

        {/* БЛОК 3: СВЯЗЬ И ПОДДЕРЖКА */}
        <div>
          <h3 className="text-red-600 font-black italic text-[12px] tracking-widest mb-6 uppercase">Связь с арсеналом</h3>
          
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <p className="text-zinc-400 text-[9px] font-black uppercase tracking-widest mb-1">Телефоны (Звонки):</p>
              <p className="text-zinc-800 text-xl font-black italic tracking-tighter leading-none mb-1">+374 41 720 008</p>
              <p className="text-zinc-800 text-xl font-black italic tracking-tighter leading-none">+374 98 220 990</p>
            </div>
            
            <div>
              <p className="text-zinc-400 text-[9px] font-black uppercase tracking-widest mb-1">Viber / WhatsApp:</p>
              <p className="text-zinc-800 text-sm font-black italic tracking-tighter">+374 98 720 008</p>
            </div>

            <div>
              <p className="text-zinc-400 text-[9px] font-black uppercase tracking-widest mb-1">График работы:</p>
              <p className="text-zinc-600 text-[11px] font-bold uppercase italic">Пн-Сб: 10:00 - 19:00 // Вс: Выходной</p>
            </div>
          </div>

          <div className="flex gap-3">
             <a href="https://www.instagram.com/krak.am2/" target="_blank" rel="noopener noreferrer" className="bg-zinc-800 text-white hover:bg-red-600 px-5 py-3 text-[10px] font-black uppercase italic transition-colors skew-x-[-10deg]">
               <span className="block skew-x-[10deg]">Instagram</span>
             </a>
             <a href="https://t.me/krak_am" target="_blank" rel="noopener noreferrer" className="bg-zinc-800 text-white hover:bg-red-600 px-5 py-3 text-[10px] font-black uppercase italic transition-colors skew-x-[-10deg]">
               <span className="block skew-x-[10deg]">Telegram</span>
             </a>
          </div>
        </div>

      </div>

      {/* КОПИРАЙТ И ДИСКЛЕЙМЕР */}
      <div className="max-w-7xl mx-auto border-t border-zinc-300 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-zinc-400 text-[9px] font-black tracking-[0.2em] uppercase italic text-center md:text-left">
          © 2026 KRAK SYSTEM // ARSENAL ONLINE STORE
        </p>
        <p className="text-zinc-400 text-[8px] font-bold uppercase text-center md:text-right max-w-xl leading-relaxed">
          Вся представленная на сайте информация носит исключительно информационный характер и ни при каких условиях не является публичной офертой. Приобретение лицензионного оружия возможно только при наличии соответствующих разрешительных документов.
        </p>
      </div>
    </footer>
  );
}