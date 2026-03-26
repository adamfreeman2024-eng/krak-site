"use client"

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
// import { useCartStore } from "@/lib/cartStore";

// --- ВАЖНО: Next.js требует оборачивать useSearchParams в Suspense ---
export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center font-mono text-red-600 font-black animate-pulse text-2xl tracking-widest">СКАНИРОВАНИЕ АРСЕНАЛА...</div>}>
      <CatalogContent />
    </Suspense>
  );
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get("brand");

  const [lang, setLang] = useState("RU");
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Фильтры
  const [activeCategoryId, setActiveCategoryId] = useState<string>("ALL");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [appliedPriceFrom, setAppliedPriceFrom] = useState<number | null>(null);
  const [appliedPriceTo, setAppliedPriceTo] = useState<number | null>(null);
  const [activeBrand, setActiveBrand] = useState<string | null>(initialBrand);

  // const { addToCart } = useCartStore();

  useEffect(() => {
    setLang(localStorage.getItem("lang") || "RU");
    const handleStorage = () => setLang(localStorage.getItem("lang") || "RU");
    window.addEventListener("languageChange", handleStorage);
    window.addEventListener("storage", handleStorage);

    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setCategories(data.categories || []);
          setProducts(data.products || []);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));

    return () => {
      window.removeEventListener("languageChange", handleStorage);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Если URL меняется (например, клиент снова кликнул на бренд), обновляем фильтр
  useEffect(() => {
    setActiveBrand(searchParams.get("brand"));
  }, [searchParams]);

  const t: any = {
    RU: {
      headerSub: "DATABASE // WEAPON SYSTEMS", headerTitle: "АРСЕНАЛ", found: "НАЙДЕНО:", system: "СИСТЕМА:", online: "ОНЛАЙН",
      categoriesTitle: "КАТЕГОРИИ", allCategories: "ВЕСЬ АРСЕНАЛ", priceTitle: "ЦЕНА (֏)", priceFrom: "ОТ", priceTo: "ДО", apply: "ПРИМЕНИТЬ",
      tagRestricted: "ПО ЛИЦЕНЗИИ", tagFree: "БЕЗ ЛИЦЕНЗИИ", active: "[АКТИВНО]", empty: "ТОВАРЫ НЕ НАЙДЕНЫ", brandFilter: "ФИЛЬТР БРЕНДА:"
    },
    AM: {
      headerSub: "ՏՎՅԱԼՆԵՐԻ ԲԱԶԱ // ԶԵՆՔԻ ՀԱՄԱԿԱՐԳԵՐ", headerTitle: "ԱՐՍԵՆԱԼ", found: "ԳՏՆՎԱԾ Է:", system: "ՀԱՄԱԿԱՐԳ:", online: "ԱԿՏԻՎ",
      categoriesTitle: "ԲԱԺԻՆՆԵՐ", allCategories: "ԱՄԲՈՂՋ ԱՐՍԵՆԱԼԸ", priceTitle: "ԳԻՆ (֏)", priceFrom: "ՍԿՍԱԾ", priceTo: "ՄԻՆՉԵՎ", apply: "ԿԻՐԱՌԵԼ",
      tagRestricted: "ՍԱՀՄԱՆԱՓԱԿՎԱԾ", tagFree: "ԱՌԱՆՑ ՍԱՀՄԱՆԱՓԱԿՄԱՆ", active: "[ԱԿՏԻՎ Է]", empty: "ԱՊՐԱՆՔՆԵՐ ՉԵՆ ԳՏՆՎԵԼ", brandFilter: "ԲՐԵՆԴԻ ՖԻԼՏՐ:"
    },
    EN: {
      headerSub: "DATABASE // WEAPON SYSTEMS", headerTitle: "ARSENAL", found: "ITEMS FOUND:", system: "SYSTEM:", online: "ONLINE",
      categoriesTitle: "CATEGORIES", allCategories: "ALL ARSENAL", priceTitle: "PRICE (֏)", priceFrom: "FROM", priceTo: "TO", apply: "APPLY",
      tagRestricted: "LICENSE REQ.", tagFree: "NO LICENSE", active: "[ACTIVE]", empty: "NO ITEMS FOUND", brandFilter: "BRAND FILTER:"
    }
  };
  const cur = t[lang] || t.RU;

  const getLocalizedName = (item: any) => {
    if (lang === "RU") return item.nameRu;
    if (lang === "AM") return item.nameAm;
    if (lang === "EN") return item.nameEn || item.nameRu;
    return item.nameRu || "";
  };

  const applyPriceFilter = () => {
    setAppliedPriceFrom(priceFrom ? Number(priceFrom) : null);
    setAppliedPriceTo(priceTo ? Number(priceTo) : null);
  };

  const clearBrandFilter = () => {
    setActiveBrand(null);
    // Очищаем URL, чтобы при обновлении страницы фильтр не вернулся
    window.history.pushState({}, '', '/catalog');
  };

  const filteredProducts = products.filter(product => {
    if (activeCategoryId !== "ALL" && product.categoryId !== activeCategoryId) return false;
    if (appliedPriceFrom !== null && product.price < appliedPriceFrom) return false;
    if (appliedPriceTo !== null && product.price > appliedPriceTo) return false;
    
    // ФИЛЬТР ПО БРЕНДУ
    if (activeBrand) {
      const brandUpper = activeBrand.toUpperCase();
      const pBrand = (product.brand || "").toUpperCase();
      const pName = getLocalizedName(product).toUpperCase();
      
      // Ищем либо точное совпадение в поле brand, либо упоминание в названии
      if (pBrand !== brandUpper && !pName.includes(brandUpper)) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-black font-sans selection:bg-red-600 selection:text-white pb-20">
      
      <div className="w-full bg-black text-white pt-32 pb-10 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="max-w-7xl mx-auto relative z-10 flex justify-between items-end">
          <div>
            <p className="text-red-600 font-mono text-[10px] tracking-[0.4em] mb-2">{cur.headerSub}</p>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">{cur.headerTitle}</h1>
          </div>
          <div className="hidden md:block text-right">
             <p className="font-mono text-[10px] text-zinc-500">{cur.found} <span className="text-white">{filteredProducts.length}</span></p>
             <p className="font-mono text-[10px] text-zinc-500">{cur.system} <span className="text-red-500 animate-pulse">{cur.online}</span></p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 flex flex-col lg:flex-row gap-10">
        
        <aside className="w-full lg:w-72 shrink-0">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-6 bg-red-600 skew-x-[-15deg]" />
              <h3 className="font-black italic text-xl uppercase tracking-widest">{cur.categoriesTitle}</h3>
            </div>
            
            {isLoading ? (
              <div className="font-mono text-xs text-zinc-400 animate-pulse">СКАНИРОВАНИЕ...</div>
            ) : (
              <ul className="space-y-1">
                <li>
                  <button 
                    onClick={() => setActiveCategoryId("ALL")}
                    className={`w-full text-left px-4 py-3 font-black italic text-sm transition-all duration-300 flex justify-between items-center ${activeCategoryId === "ALL" ? 'bg-black text-white skew-x-[-5deg] scale-105 shadow-xl shadow-black/10' : 'bg-transparent text-zinc-500 hover:text-black hover:bg-zinc-200'}`}
                  >
                    {cur.allCategories}
                    {activeCategoryId === "ALL" && <span className="text-red-600 font-mono text-[10px] skew-x-[5deg]">{cur.active}</span>}
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => setActiveCategoryId(cat.id)}
                      className={`w-full text-left px-4 py-3 font-black italic text-sm transition-all duration-300 flex justify-between items-center ${activeCategoryId === cat.id ? 'bg-black text-white skew-x-[-5deg] scale-105 shadow-xl shadow-black/10' : 'bg-transparent text-zinc-500 hover:text-black hover:bg-zinc-200'}`}
                    >
                      {getLocalizedName(cat)}
                      {activeCategoryId === cat.id && <span className="text-red-600 font-mono text-[10px] skew-x-[5deg]">{cur.active}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-6 bg-black skew-x-[-15deg]" />
              <h3 className="font-black italic text-xl uppercase tracking-widest">{cur.priceTitle}</h3>
            </div>
            <div className="flex gap-4 mb-4">
              <input type="number" placeholder={cur.priceFrom} value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} className="w-full bg-white border-2 border-zinc-200 px-3 py-2 text-xs font-black italic focus:border-red-600 outline-none transition-colors" />
              <input type="number" placeholder={cur.priceTo} value={priceTo} onChange={(e) => setPriceTo(e.target.value)} className="w-full bg-white border-2 border-zinc-200 px-3 py-2 text-xs font-black italic focus:border-red-600 outline-none transition-colors" />
            </div>
            <button onClick={applyPriceFilter} className="w-full bg-red-600 text-white font-black italic uppercase py-3 tracking-widest hover:bg-black transition-colors skew-x-[-5deg] active:scale-95">
              {cur.apply}
            </button>
          </div>
        </aside>

        <main className="flex-1">
          
          {/* ПЛАШКА АКТИВНОГО БРЕНДА */}
          {activeBrand && (
            <div className="mb-6 bg-black border-l-4 border-red-600 px-6 py-4 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase">{cur.brandFilter}</span>
                <span className="font-black italic text-xl text-white uppercase tracking-tighter">{activeBrand}</span>
              </div>
              <button 
                onClick={clearBrandFilter}
                className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-red-600 transition-colors"
                title="Сбросить фильтр"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="w-full h-64 flex items-center justify-center">
               <p className="font-mono text-zinc-400 font-black tracking-widest animate-pulse">ПОЛУЧЕНИЕ ДАННЫХ...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="w-full h-64 border-2 border-dashed border-zinc-300 flex flex-col items-center justify-center bg-white">
               <p className="font-black text-zinc-400 tracking-widest uppercase italic mb-4">{cur.empty}</p>
               <button 
                 onClick={() => {
                   setActiveCategoryId("ALL"); setPriceFrom(""); setPriceTo(""); setAppliedPriceFrom(null); setAppliedPriceTo(null); clearBrandFilter();
                 }} 
                 className="bg-red-600 text-white px-6 py-2 font-black text-xs uppercase italic tracking-widest hover:bg-black transition-colors skew-x-[-5deg]"
               >
                 <span className="skew-x-[5deg] block">СБРОСИТЬ ВСЕ ФИЛЬТРЫ</span>
               </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link href={`/product/${product.slug || product.id}`} key={product.id} className="group relative bg-white border border-zinc-200 p-5 cursor-pointer hover:shadow-2xl hover:border-black transition-all duration-300 flex flex-col block">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className={`absolute top-4 left-4 z-10 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-white ${!product.requiresLicense ? 'bg-zinc-800' : 'bg-red-600'}`}>
                    {!product.requiresLicense ? cur.tagFree : cur.tagRestricted}
                  </div>
                  <div className="relative w-full h-48 bg-[#F0F0F0] mb-6 flex items-center justify-center overflow-hidden">
                     <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                     {product.images && product.images.length > 0 ? (
                       <img src={product.images[0]} alt={getLocalizedName(product)} className="max-w-[80%] max-h-[80%] object-contain group-hover:scale-110 transition-transform duration-500" />
                     ) : (
                       <div className="w-3/4 h-12 bg-zinc-300 rounded-sm shadow-inner opacity-50 flex items-center justify-center"><span className="text-[8px] font-mono text-zinc-500">NO IMAGE</span></div>
                     )}
                  </div>
                  <div className="space-y-2 flex-grow flex flex-col justify-end">
                    <p className="text-[9px] font-mono text-zinc-400">ID: {product.id.substring(product.id.length - 6).toUpperCase()} // ARM</p>
                    <h4 className="font-black italic text-lg uppercase leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                      {getLocalizedName(product)}
                    </h4>
                    <div className="h-[1px] w-full bg-zinc-100 my-2" />
                    <div className="flex justify-between items-end">
                      <p className="text-red-600 font-black text-2xl tracking-tighter">
                        {product.price.toLocaleString()} <span className="text-sm font-sans">֏</span>
                      </p>
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert("Добавлено в корзину (подключи Zustand)"); }} className="w-10 h-10 bg-black text-white flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:bg-red-600">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}