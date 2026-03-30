"use client"

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Footer() {
  const [lang, setLang] = useState("RU");

  useEffect(() => {
    setLang(localStorage.getItem("lang") || "RU");
    const handleStorage = () => setLang(localStorage.getItem("lang") || "RU");
    window.addEventListener("languageChange", handleStorage);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("languageChange", handleStorage);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const t: any = {
    RU: {
      tag: "KRAK_TACTICAL_NETWORK // UNIT_01",
      aboutTitle: "ФИЛОСОФИЯ_ВЫСТРЕЛА",
      aboutText: "KRAK SYSTEM — ТАКТИЧЕСКИЙ ХАБ СТРЕЛКОВ АРМЕНИИ. МАГАЗИН, СТРЕЛЬБИЩЕ И ОХОТНИЧИЙ СОЮЗ В ЕДИНОЙ ЭКОСИСТЕМЕ.",
      targets: "ЗОНА ПОРАЖЕНИЯ",
      gong: "ГОНГ: READY",
      hunt: "ОХОТА: OPEN",
      navTitle: "АРСЕНАЛ",
      commTitle: "ТЕРМИНАЛ_СВЯЗИ",
      phones: "ПРЯМАЯ ЛИНИЯ:",
      schedule: "СТАТУС СИСТЕМЫ:",
      scheduleText: "ONLINE: 10:00 - 19:00 // ВС: STANDBY",
      disclaimer: "ВНИМАНИЕ: ОРУЖИЕ ТРЕБУЕТ ОТВЕТСТВЕННОСТИ. ВСЯ ИНФОРМАЦИЯ НОСИТ ОЗНАКОМИТЕЛЬНЫЙ ХАРАКТЕР. ПРОДАЖА ЛИЦЕНЗИОННОГО ТОВАРА ТОЛЬКО ПРИ НАЛИЧИИ РАЗРЕШЕНИЯ МВД РА."
    },
    AM: {
      tag: "KRAK_TACTICAL_NETWORK // UNIT_01",
      aboutTitle: "ԿՐԱԿՈՑԻ_ՓԻԼԻՍՈՓԱՅՈՒԹՅՈՒՆ",
      aboutText: "KRAK SYSTEM — ՀԱՅԱՍՏԱՆԻ ՀՐԱՁԻԳՆԵՐԻ ՏԱԿՏԻԿԱԿԱՆ ԿԵՆՏՐՈՆ: ԽԱՆՈՒԹ, ՀՐԱՁԳԱՐԱՆ ԵՎ ՈՐՍՈՐԴԱԿԱՆ ՄԻՈՒԹՅՈՒՆ:",
      targets: "ԹԻՐԱԽԱՎՈՐՄԱՆ ԳՈՏԻ",
      gong: "ԳՈՆԳ. READY",
      hunt: "ՈՐՍ. OPEN",
      navTitle: "ԱՐՍԵՆԱԼ",
      commTitle: "ԿԱՊԻ_ՏԵՐՄԻՆԱԼ",
      phones: "ՈՒՂԻՂ ԿԱՊ.",
      schedule: "ՀԱՄԱԿԱՐԳԻ ԿԱՐԳԱՎԻՃԱԿ.",
      scheduleText: "ONLINE: 10:00 - 19:00 // ԿԻՐ. STANDBY",
      disclaimer: "ՈՒՇԱԴՐՈՒԹՅՈՒՆ. ԶԵՆՔԸ ՊԱՀԱՆՋՈՒՄ Է ՊԱՏԱՍԽԱՆԱՏՎՈՒԹՅՈՒՆ: ՈՂՋ ՏԵՂԵԿԱՏՎՈՒԹՅՈՒՆԸ ԿՐՈՒՄ Է ՃԱՆԱՉՈՂԱԿԱՆ ԲՆՈՒՅԹ: ՎԱՃԱՌՔԸ ՄԻԱՅՆ ՀՀ ՈՍՏԻԿԱՆՈՒԹՅԱՆ ԹՈՒՅԼՏՎՈՒԹՅԱՆ ԴԵՊՔՈՒՄ:"
    },
    EN: {
      tag: "KRAK_TACTICAL_NETWORK // UNIT_01",
      aboutTitle: "PHILOSOPHY_OF_SHOT",
      aboutText: "KRAK SYSTEM — TACTICAL HUB OF ARMENIAN SHOOTERS. STORE, RANGE, AND HUNTING UNION IN ONE ECOSYSTEM.",
      targets: "ENGAGEMENT ZONE",
      gong: "GONG: READY",
      hunt: "HUNT: OPEN",
      navTitle: "ARSENAL",
      commTitle: "COMM_TERMINAL",
      phones: "DIRECT LINE:",
      schedule: "SYSTEM STATUS:",
      scheduleText: "ONLINE: 10:00 - 19:00 // SUN: STANDBY",
      disclaimer: "WARNING: FIREARMS REQUIRE RESPONSIBILITY. ALL INFO IS FOR EDUCATIONAL PURPOSES. SALES ONLY WITH STATE PERMIT."
    }
  };

  const cur = t[lang] || t.RU;

  return (
    <footer className="bg-[#050505] border-t-2 border-red-600 pt-20 pb-8 px-6 text-white overflow-hidden relative font-sans">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* Crosshair Decor */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-64 h-64 border border-zinc-800 rounded-full opacity-10 pointer-events-none hidden xl:block">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-red-600" />
        <div className="absolute left-1/2 top-0 w-[1px] h-full bg-red-600" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-2 border-red-600 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 relative z-10">
        
        {/* COL 1: MISSION */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border-l-4 border-red-600">
              <h3 className="text-red-600 font-black text-[10px] tracking-[0.3em] uppercase">{cur.aboutTitle}</h3>
            </div>
            <p className="text-zinc-400 text-[10px] font-black leading-relaxed uppercase italic tracking-wider">
              {cur.aboutText}
            </p>
          </div>
          
          <div className="flex gap-4 opacity-50">
             <div className="flex flex-col gap-1">
                <span className="text-[8px] font-mono text-zinc-500">HUNT_TARGET_01:</span>
                <span className="text-[10px] font-black text-white uppercase">Wild Boar</span>
             </div>
             <div className="flex flex-col gap-1">
                <span className="text-[8px] font-mono text-zinc-500">HUNT_TARGET_02:</span>
                <span className="text-[10px] font-black text-white uppercase">Duck Season</span>
             </div>
          </div>
        </div>

        {/* COL 2: TARGETS */}
        <div className="space-y-6">
          <h3 className="text-zinc-500 font-black text-[10px] tracking-[0.3em] uppercase opacity-50">{cur.targets}</h3>
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full border border-zinc-700 flex items-center justify-center">
                   <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                </div>
                <span className="text-[10px] font-black text-zinc-400 font-mono">{cur.gong} // 300M</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-zinc-800 border border-zinc-700 rotate-45" />
                <span className="text-[10px] font-black text-zinc-400 font-mono">{cur.hunt} // FOREST</span>
             </div>
          </div>
        </div>

        {/* COL 3: NAV */}
        <div className="space-y-6">
          <h3 className="text-zinc-500 font-black text-[10px] tracking-[0.3em] uppercase opacity-50">{cur.navTitle}</h3>
          <div className="grid grid-cols-1 gap-3 font-mono">
            {['catalog', 'range', 'union', 'contact'].map((item) => (
              <Link key={item} href={`/${item}`} className="text-zinc-300 text-[10px] font-black hover:text-red-600 transition-all uppercase flex items-center gap-3 group">
                <div className="w-1 h-3 bg-red-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
                {item === 'catalog' ? (lang === 'AM' ? 'ԿԱՏԱԼՈԳ' : lang === 'EN' ? 'CATALOG' : 'КАТАЛОГ') : 
                 item === 'range' ? (lang === 'AM' ? 'ՏԻՐ' : lang === 'EN' ? 'RANGE' : 'ТИР') : 
                 item === 'union' ? (lang === 'AM' ? 'ՄԻՈՒԹՅՈՒՆ' : lang === 'EN' ? 'UNION' : 'СОՅՈՒԶ') : 
                 (lang === 'AM' ? 'ԿԱՊ' : lang === 'EN' ? 'CONTACT' : 'СВЯЗЬ')}
              </Link>
            ))}
          </div>
        </div>

        {/* COL 4: COMM & ACTIVE MESSENGERS */}
        <div className="space-y-6">
          <h3 className="text-red-600 font-black text-[10px] tracking-[0.3em] uppercase">{cur.commTitle}</h3>
          <div className="space-y-4">
            <div>
              <p className="text-zinc-600 text-[8px] font-black uppercase mb-1 font-mono">{cur.phones}</p>
              <a href="tel:+37441720008" className="text-white text-xl font-black italic tracking-tighter hover:text-red-600 transition-colors block">+374 41 720 008</a>
              <a href="tel:+37498220990" className="text-white text-xl font-black italic tracking-tighter hover:text-red-600 transition-colors block">+374 98 220 990</a>
            </div>
            
            <div className="flex flex-col gap-2 border-l-2 border-zinc-900 pl-4">
              <p className="text-zinc-600 text-[8px] font-black uppercase mb-1 font-mono">Direct Chat:</p>
              <a 
                href="https://wa.me/37498720008" 
                target="_blank" 
                className="text-white text-lg font-black italic tracking-tighter hover:text-green-500 transition-all flex items-center gap-2 group"
              >
                <span className="text-green-600 font-mono text-[10px]">{"//"}</span> WhatsApp
              </a>
              <a 
                href="viber://chat?number=%2B37498720008" 
                className="text-white text-lg font-black italic tracking-tighter hover:text-purple-500 transition-all flex items-center gap-2 group"
              >
                <span className="text-purple-600 font-mono text-[10px]">{"//"}</span> Viber
              </a>
              <p className="text-zinc-500 text-[11px] font-black italic mt-1">+374 98 720 008</p>
            </div>

            <div className="flex gap-2 pt-2">
               <a href="https://t.me/krak_am" target="_blank" className="flex-1 bg-white text-black py-3 text-[9px] font-black uppercase italic text-center hover:bg-red-600 hover:text-white transition-all">TELEGRAM</a>
               <a href="https://www.instagram.com/krak.am2/" target="_blank" className="flex-1 border border-zinc-800 text-zinc-400 py-3 text-[9px] font-black uppercase italic text-center hover:text-white transition-all">INSTAGRAM</a>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER BOTTOM */}
      <div className="max-w-7xl mx-auto border-t border-zinc-900 pt-8 flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="font-mono">
           <p className="text-red-600 text-[9px] font-black tracking-[0.4em] uppercase italic mb-1">{cur.tag}</p>
           <p className="text-zinc-700 text-[8px] font-black uppercase tracking-widest">© 2026 KRAK.AM // BORN IN ARMENIA</p>
        </div>
        
        <p className="text-zinc-700 text-[8px] font-bold uppercase leading-relaxed text-justify max-w-2xl italic">
          {cur.disclaimer}
        </p>

        {/* Bullets Decor */}
        <div className="flex gap-1 opacity-20">
           {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-1.5 h-6 bg-zinc-700 rounded-t-sm border-b-2 border-red-600" />
           ))}
        </div>
      </div>
    </footer>
  );
}