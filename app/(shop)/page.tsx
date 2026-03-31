"use client"

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function HomePage() {
  const [lang, setLang] = useState("RU");
  const [brands, setBrands] = useState<any[]>([]);
  
  // --- СОСТОЯНИЯ ДЛЯ УМНОГО ПОИСКА ---
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLang(localStorage.getItem("lang") || "RU");
    const handleStorage = () => setLang(localStorage.getItem("lang") || "RU");
    window.addEventListener("languageChange", handleStorage);
    window.addEventListener("storage", handleStorage);

    // Загрузка брендов
    fetch('/api/brands')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setBrands(data);
        else {
          setBrands([
            { name: "BENELLI" }, { name: "BERETTA" }, { name: "FRANCHI" }, 
            { name: "BLASER" }, { name: "HECKLER & KOCH" }, { name: "DANIEL DEFENSE" }, 
            { name: "GLOCK" }
          ]);
        }
      }).catch(() => {});

    // Загрузка всех товаров для быстрого умного поиска
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.products) setAllProducts(data.products);
        else if (Array.isArray(data)) setAllProducts(data);
      }).catch(err => console.error("Ошибка загрузки арсенала:", err));

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("languageChange", handleStorage);
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Логика фильтрации поиска
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const filtered = allProducts.filter(p => 
        p.nameRu?.toLowerCase().includes(q) || 
        p.nameEn?.toLowerCase().includes(q) || 
        p.nameAm?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
      ).slice(0, 5);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allProducts]);

  const t: any = {
    RU: {
      heroSuper: "KRAK SYSTEM // BALLISTIC_DATA_ONLINE",
      heroTitle: "ФИЛОСОФИЯ ОГНЯ", 
      heroSub: "ПРОФЕССИОНАЛЬНЫЕ СИСТЕМЫ ДЛЯ УВЕРЕННОГО ПОРАЖЕНИЯ МИШЕНИ.", 
      toCatalog: "ОТКРЫТЬ КАТАЛОГ", brandsTitle: "ОФИЦИАЛЬНЫЙ ПАРТНЕР",
      searchPlaceholder: "ПОИСК ПО АРСЕНАЛУ...", searchEmpty: "ОБЪЕКТ НЕ НАЙДЕН",
      servicesTitle: "УСЛУГИ",
      wsTitle: "МАСТЕРСКАЯ", wsItems: ["Ремонт", "Чистка", "Тюнинг", "Запчасти"],
      balTitle: "БАЛЛИСТИКА", balItems: ["Пристрелка", "Оптика", "Тактика", "Расчеты"],
      globalTitle: "СПЕЦЗАКАЗ?", globalSub: "ДОСТАВКА ИЗ ЛЮБОЙ ТОЧКИ МИРА",
      globalText: "Если вы ищете редкое оружие или специфическую оптику — мы найдем это.", globalBtn: "ОФОРМИТЬ",
    },
    AM: {
      heroSuper: "KRAK SYSTEM // BALLISTIC_DATA_ONLINE",
      heroTitle: "ԿՐԱԿԻ ՓԻԼԻՍՈՓԱՅՈՒԹՅՈՒՆ", 
      heroSub: "ՊՐՈՖԵՍԻՈՆԱԼ ՀԱՄԱԿԱՐԳԵՐ՝ ԹԻՐԱԽԻ ՀԱՍՏԱՏԱԿԱՄ ԽՈՑՄԱՆ ՀԱՄԱՐ։", 
      toCatalog: "ԲԱՑԵԼ ԿԱՏԱԼՈԳԸ", brandsTitle: "ԳՈՐԾԸՆԿԵՐ",
      searchPlaceholder: "ՓՆՏՐԵԼ...", searchEmpty: "ՉԻ ԳՏՆՎԵԼ",
      servicesTitle: "ԾԱՌԱՅՈՒԹՅՈՒՆՆԵՐ",
      wsTitle: "ԱՐՀԵՍՏԱՆՈՑ", wsItems: ["Վերանորոգում", "Մաքրում", "Թյունինգ", "Մասեր"],
      balTitle: "ԲԱԼԻՍՏԻԿԱ", balItems: ["Նշանառում", "Օպտիկա", "Տակտիկա", "Հաշվարկ"],
      globalTitle: "ՀԱՏՈՒԿ ՊԱՏՎԵՐ?", globalSub: "ԱՌԱՔՈՒՄ ԱՄԲՈՂՋ ԱՇԽԱՐՀԻՑ",
      globalText: "Եթե փնտրում եք բացառիկ զենք կամ հատուկ օպտիկա՝ մենք կգտնենք այն:", globalBtn: "ՊԱՏՎԻՐԵԼ",
    },
    EN: {
      heroSuper: "KRAK SYSTEM // BALLISTIC_DATA_ONLINE",
      heroTitle: "PHILOSOPHY OF FIRE", 
      heroSub: "PROFESSIONAL SYSTEMS FOR CONFIDENT TARGET ENGAGEMENT.", 
      toCatalog: "OPEN CATALOG", brandsTitle: "PARTNER",
      searchPlaceholder: "SEARCH ARSENAL...", searchEmpty: "NOT FOUND",
      servicesTitle: "SERVICES",
      wsTitle: "GUNSMITH", wsItems: ["Repair", "Cleaning", "Tuning", "Parts"],
      balTitle: "BALLISTICS", balItems: ["Zeroing", "Optics", "Tactical", "Calculations"],
      globalTitle: "CUSTOM ORDER?", globalSub: "WORLDWIDE DELIVERY",
      globalText: "If you are looking for rare firearms or specific optics — we've got you covered.", globalBtn: "ORDER",
    }
  };

  const cur = t[lang] || t.RU;
  const getLocalizedName = (p: any) => lang === "AM" ? p.nameAm : (lang === "EN" ? (p.nameEn || p.nameRu) : p.nameRu);

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-black font-sans selection:bg-red-600 selection:text-white pb-10 overflow-x-hidden">
      
      <style jsx>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: flex; width: 200%; animation: marquee 25s linear infinite; }
        .border-text { -webkit-text-stroke: 1px black; }
        @media (min-width: 768px) { .border-text { -webkit-text-stroke: 2px black; } }
      `}</style>

      {/* --- HERO СЕКЦИЯ --- */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 px-4 md:px-10 overflow-hidden min-h-[85vh] flex flex-col justify-center">
        <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <p className="text-red-600 font-mono text-[10px] md:text-sm tracking-[0.3em] font-black uppercase mb-4 animate-pulse">
            {cur.heroSuper}
          </p>
          
          {/* Адаптивный размер H1 для длинного армянского текста */}
         {/* Ультимативное решение для армянского текста: правильный размер и на мобилке, и на ПК */}
         <h1 className={`
            ${lang === 'AM' 
              ? 'text-[9.5vw] md:text-7xl lg:text-8xl tracking-[-0.05em]' 
              : 'text-[11.5vw] md:text-8xl lg:text-9xl tracking-tighter'} 
            font-black italic uppercase leading-[0.9] mb-6 break-words
          `}>
            {cur.heroTitle.split(' ')[0]} <br />
            <span className="text-transparent border-text">
              {cur.heroTitle.split(' ').slice(1).join(' ')}
            </span>
          </h1>

          <p className="text-zinc-500 font-black text-xs md:text-lg uppercase tracking-widest max-w-xl mb-10 border-l-4 border-red-600 pl-4 leading-relaxed">
            {cur.heroSub}
          </p>

          {/* --- ИНТЕЛЛЕКТУАЛЬНЫЙ ПОИСК --- */}
          <div className="relative w-full max-w-2xl mb-8 z-50" ref={searchRef}>
            <div className="relative flex items-center shadow-2xl skew-x-[-3deg] md:skew-x-[-5deg]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setIsSearchFocused(true); }}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={cur.searchPlaceholder}
                className="w-full bg-white border-2 border-transparent focus:border-red-600 px-5 py-4 md:py-6 text-black font-black uppercase italic outline-none text-sm md:text-base transition-all"
              />
              <div className="absolute right-4 md:right-6 text-red-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
            </div>

            {isSearchFocused && searchQuery.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-200 shadow-2xl overflow-hidden z-[100]">
                {searchResults.length > 0 ? (
                  searchResults.map((p) => (
                    <Link href={`/product/${p.slug || p.id}`} key={p.id} onClick={() => setIsSearchFocused(false)} className="flex items-center gap-3 p-3 border-b border-zinc-100 active:bg-zinc-100 transition-colors">
                      <div className="w-10 h-10 bg-zinc-50 shrink-0 flex items-center justify-center p-1">
                        <img src={p.images?.[0]} className="max-w-full max-h-full object-contain mix-blend-multiply" alt="" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-black font-black uppercase italic text-[11px] md:text-sm truncate">{getLocalizedName(p)}</p>
                        <p className="text-red-600 font-black text-[10px]">{p.price.toLocaleString()} ֏</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center text-zinc-400 font-black uppercase text-xs">{cur.searchEmpty}</div>
                )}
              </div>
            )}
          </div>

          <Link href="/catalog" className="w-full md:w-auto inline-block text-center bg-red-600 text-white px-10 py-5 font-black uppercase italic tracking-widest hover:bg-black transition-all skew-x-[-5deg] active:scale-95 shadow-xl">
            <span className="skew-x-[5deg] block text-sm md:text-base">{cur.toCatalog}</span>
          </Link>
        </div>
      </section>

      {/* --- БРЕНДЫ (MARQUEE) --- */}
      <section className="w-full bg-black text-white py-6 border-y-2 md:border-y-4 border-red-600 overflow-hidden relative z-10">
        <div className="animate-marquee flex gap-6 md:gap-12 items-center">
           {[...brands, ...brands, ...brands, ...brands].map((brand, i) => (
             <Link href={`/catalog?brand=${brand.name}`} key={i} className="flex-shrink-0 h-12 md:h-20 min-w-[120px] md:min-w-[180px] bg-white px-4 flex items-center justify-center shadow-lg hover:invert transition-all">
               {brand.logoUrl ? (
                 <img src={brand.logoUrl} alt={brand.name} className="max-h-[70%] max-w-full object-contain" />
               ) : (
                 <span className="text-lg md:text-2xl font-black italic text-black uppercase">{brand.name}</span>
               )}
             </Link>
           ))}
        </div>
      </section>

      {/* --- СЕРВИСЫ (GRID ADAPTIVE) --- */}
      <section className="py-20 px-4 md:px-10 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-6xl font-black italic uppercase text-center mb-12 md:mb-20 tracking-tighter">{cur.servicesTitle}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          
          <div className="group bg-white border border-zinc-200 p-8 md:p-12 hover:border-black hover:shadow-2xl transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-50 -mr-12 -mt-12 rotate-45 group-hover:bg-red-600 transition-colors" />
            <div className="w-14 h-14 bg-zinc-100 flex items-center justify-center mb-8 border border-zinc-200 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            </div>
            <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-6">{cur.wsTitle}</h3>
            <div className="grid grid-cols-2 gap-4">
              {cur.wsItems.map((item: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-500 group-hover:text-black transition-colors">
                  <div className="w-1.5 h-1.5 bg-red-600" /> {item}
                </div>
              ))}
            </div>
          </div>

          <div className="group bg-white border border-zinc-200 p-8 md:p-12 hover:border-black hover:shadow-2xl transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-50 -mr-12 -mt-12 rotate-45 group-hover:bg-red-600 transition-colors" />
            <div className="w-14 h-14 bg-zinc-100 flex items-center justify-center mb-8 border border-zinc-200 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
            </div>
            <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-6">{cur.balTitle}</h3>
            <div className="grid grid-cols-2 gap-4">
              {cur.balItems.map((item: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-500 group-hover:text-black transition-colors">
                  <div className="w-1.5 h-1.5 bg-red-600" /> {item}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* --- СПЕЦЗАКАЗ --- */}
      <section className="w-full bg-red-600 text-white py-16 md:py-24 px-4 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 leading-none">{cur.globalTitle}</h2>
            <p className="text-lg md:text-2xl font-black uppercase tracking-widest mb-6 border-zinc-950 lg:border-l-4 lg:pl-4">{cur.globalSub}</p>
            <p className="text-xs md:text-sm font-bold uppercase leading-relaxed max-w-xl mx-auto lg:mx-0 opacity-90">{cur.globalText}</p>
          </div>
          <Link href="/custom-order" className="w-full lg:w-auto bg-black text-white px-12 py-5 text-base md:text-lg font-black italic uppercase skew-x-[-5deg] hover:bg-white hover:text-black transition-all active:scale-95 shadow-2xl">
            <span className="skew-x-[5deg] block">{cur.globalBtn}</span>
          </Link>
        </div>
      </section>

    </div>
  );
}