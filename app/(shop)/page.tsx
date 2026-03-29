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
        if (data && data.length > 0) {
          setBrands(data);
        } else {
          setBrands([
            { name: "BENELLI" }, { name: "BERETTA" }, { name: "FRANCHI" }, 
            { name: "BLASER" }, { name: "HECKLER & KOCH" }, { name: "DANIEL DEFENSE" }, 
            { name: "GLOCK" }
          ]);
        }
      })
      .catch(() => {
        setBrands([
            { name: "BENELLI" }, { name: "BERETTA" }, { name: "FRANCHI" }, 
            { name: "GLOCK" }
        ]);
      });

    // Загрузка всех товаров для быстрого умного поиска
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.products) setAllProducts(data.products);
        else if (Array.isArray(data)) setAllProducts(data);
      })
      .catch(err => console.error("Ошибка загрузки арсенала:", err));

    // Закрытие поиска при клике вне его области
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
      ).slice(0, 5); // Показываем топ-5 совпадений
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allProducts]);

  const t: any = {
    RU: {
      heroTitle: "ПРОФЕССИОНАЛЬНЫЙ АРСЕНАЛ", heroSub: "ОРУЖИЕ, ОПТИКА И ЭКИПИРОВКА ПРЕМИУМ КЛАССА", toCatalog: "ОТКРЫТЬ КАТАЛОГ", brandsTitle: "ОФИЦИАЛЬНЫЙ ПАРТНЕР",
      searchPlaceholder: "ПОИСК ПО АРСЕНАЛУ (НАЗВАНИЕ ИЛИ SKU)...", searchEmpty: "ОБЪЕКТ НЕ НАЙДЕН",
      servicesTitle: "ПРОФЕССИОНАЛЬНЫЕ УСЛУГИ",
      wsTitle: "ОРУЖЕЙНАЯ МАСТЕРСКАЯ", wsItems: ["Ремонт и обслуживание", "Глубокая чистка и уход", "Тюнинг и кастомизация", "Замена деталей"],
      balTitle: "БАЛЛИСТИКА И СНАЙПИНГ", balItems: ["Пристрелка оружия", "Настройка оптики", "Тактическая стрельба", "Баллистические расчеты"],
      globalTitle: "НЕТ НУЖНОГО ТОВАРА?", globalSub: "МЫ ДОСТАВИМ ЕГО ИЗ ЛЮБОЙ ТОЧКИ МИРА",
      globalText: "Если вы ищете редкий калибр, эксклюзивную винтовку или специфическую оптику, которой нет в каталоге — оставьте заявку.", globalBtn: "ОФОРМИТЬ СПЕЦЗАКАЗ",
    },
    AM: {
      heroTitle: "ՊՐՈՖԵՍԻՈՆԱԼ ԱՐՍԵՆԱԼ", heroSub: "ՊՐԵՄԻՈՒՄ ԴԱՍԻ ԶԵՆՔ, ՕՊՏԻԿԱ ԵՎ ՀԱՆԴԵՐՁԱՆՔ", toCatalog: "ԲԱՑԵԼ ԿԱՏԱԼՈԳԸ", brandsTitle: "ՊԱՇՏՈՆԱԿԱՆ ԳՈՐԾԸՆԿԵՐ",
      searchPlaceholder: "ՓՆՏՐԵԼ ԱՐՍԵՆԱԼՈՒՄ...", searchEmpty: "ՕԲՅԵԿՏԸ ՉԻ ԳՏՆՎԵԼ",
      servicesTitle: "ՊՐՈՖԵՍԻՈՆԱԼ ԾԱՌԱՅՈՒԹՅՈՒՆՆԵՐ",
      wsTitle: "ԶԵՆՔԻ ԱՐՀԵՍՏԱՆՈՑ", wsItems: ["Վերանորոգում և սպասարկում", "Խորը մաքրում և խնամք", "Թյունինգ և կաստոմիզացիա", "Պահեստամասերի փոխարինում"],
      balTitle: "ԲԱԼԻՍՏԻԿԱ ԵՎ ՍՆԱՅՊԻՆԳ", balItems: ["Զենքի նշանառում", "ՕպՏիկայի կարգավորում", "Տակտիկական հրաձգություն", "Բալիստիկ հաշվարկներ"],
      globalTitle: "ՉԳՏԱ՞Ք ԱՆՀՐԱԺԵՇՏ ԱՊՐԱՆՔԸ", globalSub: "ՄԵՆՔ ԿԱՌԱՔԵՆՔ ԱՅՆ ԱՇԽԱՐՀԻ ՑԱՆԿԱՑԱԾ ԿԵՏԻՑ",
      globalText: "Եթե փնտրում եք հազվագյուտ տրամաչափ կամ հատուկ օպտիկա՝ թողեք հայտ: Մեր լոգիստիկան աշխատում է ամբողջ աշխարհում:", globalBtn: "ՁԵՎԱԿԵՐՊԵԼ ՀԱՏՈՒԿ ՊԱՏՎԵՐ",
    },
    EN: {
      heroTitle: "PROFESSIONAL ARSENAL", heroSub: "PREMIUM FIREARMS, OPTICS & TACTICAL GEAR", toCatalog: "OPEN CATALOG", brandsTitle: "OFFICIAL PARTNER",
      searchPlaceholder: "SEARCH ARSENAL (NAME OR SKU)...", searchEmpty: "OBJECT NOT FOUND",
      servicesTitle: "PROFESSIONAL SERVICES",
      wsTitle: "GUNSMITH WORKSHOP", wsItems: ["Repair & Maintenance", "Deep Cleaning", "Tuning & Customization", "Parts Replacement"],
      balTitle: "BALLISTICS & SNIPING", balItems: ["Firearm Zeroing", "Optics Setup", "Tactical Shooting", "Ballistic Calculations"],
      globalTitle: "CAN'T FIND WHAT YOU NEED?", globalSub: "WE WILL DELIVER IT FROM ANYWHERE IN THE WORLD",
      globalText: "If you are looking for a rare caliber or specific optics not found in the catalog - leave a request.", globalBtn: "PLACE CUSTOM ORDER",
    }
  };
  const cur = t[lang] || t.RU;

  const getLocalizedName = (p: any) => lang === "AM" ? p.nameAm : (lang === "EN" ? (p.nameEn || p.nameRu) : p.nameRu);

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-black font-sans selection:bg-red-600 selection:text-white pb-10">
      
      <style jsx>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: flex; width: 200%; animation: marquee 30s linear infinite; }
      `}</style>

      {/* --- HERO СЕКЦИЯ --- */}
      <section className="relative pt-40 pb-20 px-6 md:px-10 overflow-hidden min-h-[70vh] flex flex-col justify-center">
        <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <p className="text-red-600 font-mono text-xs md:text-sm tracking-[0.4em] font-black uppercase mb-4 animate-pulse">
            KRAK SYSTEM // PROTOCOL_01
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black italic uppercase tracking-tighter leading-none mb-6">
            {cur.heroTitle.split(' ')[0]} <br />
            <span className="text-transparent border-text" style={{ WebkitTextStroke: '2px black' }}>
              {cur.heroTitle.split(' ').slice(1).join(' ')}
            </span>
          </h1>
          <p className="text-zinc-500 font-black text-sm md:text-lg uppercase tracking-widest max-w-2xl mb-10 border-l-4 border-red-600 pl-4">
            {cur.heroSub}
          </p>

          {/* --- ИНТЕЛЛЕКТУАЛЬНЫЙ ПОИСК --- */}
          <div className="relative w-full max-w-2xl mb-10 z-50" ref={searchRef}>
            <div className="relative flex items-center shadow-2xl skew-x-[-5deg]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={cur.searchPlaceholder}
                className="w-full bg-white border-2 border-transparent focus:border-red-600 px-6 py-5 text-black font-black uppercase italic outline-none text-sm md:text-base transition-colors"
              />
              <div className="absolute right-6 text-red-600 font-black">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
            </div>

            {/* ВЫПАДАЮЩИЙ СПИСОК РЕЗУЛЬТАТОВ */}
            {isSearchFocused && searchQuery.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-200 shadow-2xl skew-x-[-5deg] overflow-hidden">
                <div className="skew-x-[5deg]">
                  {searchResults.length > 0 ? (
                    searchResults.map((p) => (
                      <Link 
                        href={`/product/${p.slug || p.id}`} 
                        key={p.id}
                        onClick={() => setIsSearchFocused(false)}
                        className="flex items-center gap-4 p-4 border-b border-zinc-100 hover:bg-zinc-50 transition-colors group"
                      >
                        <div className="w-12 h-12 bg-zinc-100 flex items-center justify-center shrink-0 overflow-hidden">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt="" className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                          ) : (
                            <span className="text-[8px] text-zinc-400 font-black">NO PIC</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-black font-black uppercase italic text-xs md:text-sm group-hover:text-red-600 transition-colors line-clamp-1">{getLocalizedName(p)}</p>
                          {p.sku && <p className="text-zinc-400 font-mono text-[9px] uppercase tracking-widest">{p.sku}</p>}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-red-600 font-black italic">{p.price.toLocaleString()} ֏</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-6 text-center text-zinc-400 font-black uppercase italic tracking-widest text-sm">
                      {cur.searchEmpty}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Link href="/catalog" className="inline-block bg-red-600 text-white px-12 py-5 font-black uppercase italic tracking-widest hover:bg-black transition-all shadow-2xl skew-x-[-10deg] active:scale-95">
            <span className="skew-x-[10deg] block">{cur.toCatalog}</span>
          </Link>
        </div>
      </section>

      {/* --- БЕГУЩАЯ СТРОКА БРЕНДОВ --- */}
      <section className="w-full bg-black text-white py-8 border-y-4 border-red-600 overflow-hidden flex items-center relative z-10">
        <div className="absolute z-20 bg-black/90 px-4 py-8 md:px-10 border-r-4 border-red-600 hidden md:block backdrop-blur-md h-full flex items-center">
           <p className="text-[10px] font-mono font-black tracking-widest uppercase text-zinc-400">{cur.brandsTitle}</p>
        </div>
        
        <div className="animate-marquee flex gap-6 md:gap-8 items-center pl-4 md:pl-72 hover:[animation-play-state:paused]">
           {[...brands, ...brands, ...brands, ...brands, ...brands, ...brands].map((brand, i) => (
             <Link 
                href={`/catalog?brand=${brand.name}`} 
                key={i} 
                className="flex-shrink-0 flex items-center justify-center h-16 md:h-24 min-w-[140px] md:min-w-[180px] bg-white px-4 py-2 border-b-4 border-transparent hover:border-red-600 group cursor-pointer transition-all shadow-xl"
             >
               {brand.logoUrl ? (
                 <img 
                   src={brand.logoUrl} 
                   alt={brand.name} 
                   className="max-h-full max-w-full object-contain group-hover:scale-110 transition-all duration-300"
                 />
               ) : (
                 <span className="text-2xl md:text-3xl font-black italic tracking-tighter text-black group-hover:text-red-600 group-hover:scale-105 transition-all cursor-pointer whitespace-nowrap">
                   {brand.name}
                 </span>
               )}
             </Link>
           ))}
        </div>
      </section>

      {/* --- СЕРВИСЫ: МАСТЕРСКАЯ И БАЛЛИСТИКА --- */}
      <section className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-16 text-center">{cur.servicesTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <div className="group relative bg-white border border-zinc-200 p-10 hover:border-black hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-black opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-16 h-16 bg-zinc-100 flex items-center justify-center mb-8 border border-zinc-200 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            </div>
            <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-6">{cur.wsTitle}</h3>
            <ul className="space-y-4">
              {cur.wsItems.map((item: string, i: number) => (
                <li key={i} className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-zinc-600">
                  <div className="w-2 h-2 bg-red-600" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="group relative bg-white border border-zinc-200 p-10 hover:border-black hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-black opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-16 h-16 bg-zinc-100 flex items-center justify-center mb-8 border border-zinc-200 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
            </div>
            <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-6">{cur.balTitle}</h3>
            <ul className="space-y-4">
              {cur.balItems.map((item: string, i: number) => (
                <li key={i} className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-zinc-600">
                  <div className="w-2 h-2 bg-red-600" /> {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* --- СПЕЦЗАКАЗ --- */}
      <section className="w-full bg-red-600 text-white py-24 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)', backgroundSize: '20px 20px' }} />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1">
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 leading-none">{cur.globalTitle}</h2>
            <p className="text-xl md:text-2xl font-black uppercase tracking-widest mb-6 border-l-4 border-black pl-4">{cur.globalSub}</p>
            <p className="text-sm md:text-base font-bold uppercase leading-relaxed max-w-xl opacity-90">{cur.globalText}</p>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <Link 
              href="/custom-order"
              className="w-full md:w-auto inline-block text-center bg-black text-white px-12 py-6 text-lg font-black italic uppercase tracking-widest hover:bg-white hover:text-red-600 transition-all shadow-2xl skew-x-[-10deg] active:scale-95"
            >
              <span className="skew-x-[10deg] block">{cur.globalBtn}</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}