"use client"

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";

export default function ProductPage() {
  const params = useParams();
  const productId = params?.id as string || params?.slug as string;

  const [product, setProduct] = useState<any>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [optics, setOptics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("RU");
  const [added, setAdded] = useState(false);

  const addToCart = useCartStore((state: any) => state.addToCart);

  // --- ЛОГИКА ГАЛЕРЕИ ---
  const images = product?.images || [];
  const currentIndex = images.indexOf(activeImage);

  const nextImage = useCallback(() => {
    if (images.length > 1) {
      const nextIdx = (currentIndex + 1) % images.length;
      setActiveImage(images[nextIdx]);
    }
  }, [currentIndex, images]);

  const prevImage = useCallback(() => {
    if (images.length > 1) {
      const prevIdx = (currentIndex - 1 + images.length) % images.length;
      setActiveImage(images[prevIdx]);
    }
  }, [currentIndex, images]);

  // Управление кнопками клавиатуры
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, nextImage, prevImage]);

  useEffect(() => {
    setLang(localStorage.getItem("lang") || "RU");
    async function fetchData() {
      if (!productId) return;
      try {
        const res = await fetch(`/api/products/${productId}?t=${Date.now()}`);
        const data = await res.json();
        if (data && !data.error) {
          setProduct(data);
          if (data.images?.length > 0) setActiveImage(data.images[0]);

          // Проверка на оружие для рекомендации оптики
          const isFirearm = ["нарезное", "гладкоствольное", "оружие"].some(cat => 
            data.category?.nameRu?.toLowerCase().includes(cat) || 
            data.category?.nameEn?.toLowerCase().includes(cat)
          );

          if (isFirearm) {
            const productsRes = await fetch('/api/products');
            const allData = await productsRes.json();
            const suggested = allData.products.filter((p: any) => {
              const catNameRu = (p.category?.nameRu || "").toLowerCase();
              return catNameRu.includes("оптика") && p.id !== data.id;
            }).slice(0, 3);
            setOptics(suggested);
          }
        }
      } catch (err) { 
        console.error(err);
      } finally { 
        setLoading(false); 
      }
    }
    fetchData();
  }, [productId]);

  const ui: any = {
    RU: { back: "[ ESC ] НАЗАД В АРСЕНАЛ", specs: "ХАРАКТЕРИСТИКИ", order: "В АРСЕНАЛ", added: "ДОБАВЛЕНО ✓", price: "ЦЕНА:", desc: "ОПИСАНИЕ СИСТЕМЫ", bundleTitle: "TACTICAL BUNDLE", bundleText: "ВИНТОВКА + ОПТИКА = ПОДАРКИ", suggestedTitle: "РЕКОМЕНДУЕМАЯ ОПТИКА" },
    AM: { back: "[ ESC ] ՎԵՐԱԴԱՌՆԱԼ", specs: "ԲՆՈՒԹԱԳՐԵՐ", order: "ԱՎԵԼԱՑՆԵԼ", added: "ԱՎԵԼԱՑՎԱԾ Է ✓", price: "ԳԻՆ.", desc: "ՆԿԱՐԱԳՐՈՒԹՅՈՒՆ", bundleTitle: "ՏԱԿՏԻԿԱԿԱՆ ՓԱԹԵԹ", bundleText: "ՀՐԱՑԱՆ + ՕՊՏԻԿԱ = ՆՎԵՐ", suggestedTitle: "ԱՌԱՋԱՐԿՎՈՂ ՕՊՏԻԿԱ" },
    EN: { back: "[ ESC ] BACK TO CATALOG", specs: "SPECS", order: "TO ARSENAL", added: "ADDED ✓", price: "PRICE:", desc: "DESCRIPTION", bundleTitle: "TACTICAL BUNDLE", bundleText: "RIFLE + OPTICS = GIFTS", suggestedTitle: "RECOMMENDED OPTICS" }
  };

  const t = ui[lang] || ui.RU;

  if (loading) return <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center font-mono text-red-600 animate-pulse text-2xl uppercase italic tracking-widest">KRAK_SYNC_PROTOCOL...</div>;
  if (!product) return <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center font-black uppercase">OBJECT_NOT_FOUND</div>;

  const getLocalizedName = (p: any) => lang === "AM" ? p.nameAm : (lang === "EN" ? (p.nameEn || p.nameRu) : p.nameRu);

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-black pt-32 pb-20 px-4 md:px-10 font-sans selection:bg-red-600 selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        <Link href="/catalog" className="text-zinc-500 hover:text-red-600 text-xs font-mono font-black uppercase mb-10 inline-block tracking-widest bg-zinc-200 px-4 py-2 hover:bg-red-100 transition-all">
          {t.back}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 mb-20">
          
          {/* ГАЛЕРЕЯ ТОВАРА */}
          <div className="flex flex-col gap-4">
            <div 
              onClick={() => setIsModalOpen(true)}
              className="relative aspect-square md:h-[600px] bg-white border-2 border-transparent hover:border-black flex items-center justify-center shadow-xl overflow-hidden group cursor-zoom-in transition-all"
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <img 
                src={activeImage} 
                className="relative z-10 max-h-full max-w-full object-contain group-hover:scale-[1.05] transition-all duration-700 mix-blend-multiply p-6" 
                alt="" 
              />
              <div className="absolute bottom-4 right-4 bg-zinc-900 text-white px-2 py-1 text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                DETAILED_SCAN_MODE
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(img)} 
                    className={`flex-shrink-0 w-20 h-20 bg-white border-2 p-2 transition-all ${activeImage === img ? 'border-red-600 shadow-md' : 'border-zinc-200 hover:border-black'}`}
                  >
                    <img src={img} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ИНФОРМАЦИЯ */}
          <div className="flex flex-col justify-center">
             <div className="flex items-center gap-4 mb-4">
               <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white ${!product.requiresLicense ? 'bg-zinc-800' : 'bg-red-600'}`}>
                 {!product.requiresLicense ? "FREE ACCESS" : "LICENSE REQ"}
               </span>
               <p className="text-zinc-400 font-mono text-[10px] tracking-widest uppercase">ID: {product.id.slice(-8).toUpperCase()}</p>
             </div>

             <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none mb-8">{getLocalizedName(product)}</h1>
             
             {/* ЦЕНА И КОРЗИНА */}
             <div className="bg-white border-l-8 border-red-600 p-8 mb-6 shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                  <p className="text-zinc-400 text-[10px] font-black uppercase mb-2 tracking-widest">{t.price}</p>
                  <p className="text-5xl font-black italic tracking-tighter">{product.price.toLocaleString()} <span className="text-red-600 text-2xl font-sans">֏</span></p>
                </div>
                <button 
                  onClick={() => { 
                    addToCart({ id: product.id, name: getLocalizedName(product), price: product.price, quantity: 1, image: activeImage });
                    setAdded(true); 
                    setTimeout(() => setAdded(false), 1500); 
                  }} 
                  className={`w-full sm:w-auto px-12 py-5 font-black uppercase italic transition-all skew-x-[-5deg] shadow-lg ${added ? "bg-black text-white" : "bg-red-600 text-white hover:bg-black active:scale-95"}`}
                >
                   <span className="skew-x-[5deg] block">{added ? t.added : t.order}</span>
                </button>
             </div>

             {optics.length > 0 && (
               <div className="bg-black text-white p-4 mb-10 skew-x-[-5deg] border-r-4 border-red-600 animate-pulse">
                 <div className="skew-x-[5deg] flex items-center gap-4">
                   <div className="bg-red-600 text-white px-2 py-1 font-black text-[10px] uppercase italic">{t.bundleTitle}</div>
                   <p className="font-black italic text-xs md:text-sm uppercase tracking-widest">{t.bundleText}</p>
                 </div>
               </div>
             )}

              <div className="mt-10">
               <h3 className="bg-zinc-200 inline-block px-3 py-1 mb-6 text-[10px] font-black uppercase italic skew-x-[-10deg]">
                 <span className="skew-x-[10deg] block">{t.desc} //</span>
               </h3>
               <div className="prose prose-sm max-w-none text-zinc-700 font-bold uppercase leading-relaxed selection:bg-red-600 selection:text-white" 
                 dangerouslySetInnerHTML={{ __html: lang === 'AM' ? product.descriptionAm : (lang === 'EN' ? (product.descriptionEn || product.descriptionRu) : product.descriptionRu) }} 
               />
             </div>
          </div>
        </div>

        {/* СЕКЦИЯ РЕКОМЕНДАЦИЙ */}
        {optics.length > 0 && (
          <div className="mt-20 border-t-2 border-zinc-100 pt-20">
             <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-12">{t.suggestedTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {optics.map((opt: any) => (
                <Link href={`/product/${opt.slug || opt.id}`} key={opt.id} className="bg-white border border-zinc-200 p-8 group hover:border-black transition-all shadow-sm hover:shadow-2xl">
                  <div className="h-48 w-full mb-6 flex items-center justify-center overflow-hidden bg-zinc-50 p-4">
                    <img src={opt.images?.[0]} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform mix-blend-multiply" alt="" />
                  </div>
                  <h4 className="font-black uppercase italic text-sm mb-3 group-hover:text-red-600 transition-colors">{getLocalizedName(opt)}</h4>
                  <p className="text-2xl font-black italic">{opt.price.toLocaleString()} <span className="text-red-600 text-sm">֏</span></p>
                 </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- МОДАЛЬНОЕ ОКНО (ТЕПЕРЬ НА БЕЛОМ ФОНЕ) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center select-none overflow-hidden animate-in fade-in duration-300">
          
          {/* Тонкая светлая сетка для стиля */}
          <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          {/* Хедер модалки */}
          <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-[120] bg-gradient-to-b from-white/80 to-transparent">
             <div className="flex flex-col">
              <span className="text-red-600 font-black italic text-xs tracking-[0.4em]">SYSTEM_SCAN_DETAILED</span>
              <span className="text-zinc-400 font-mono text-[10px] uppercase mt-2 tracking-widest">
                {currentIndex + 1} / {images.length} — {getLocalizedName(product)}
              </span>
            </div>
             <button 
              onClick={() => setIsModalOpen(false)} 
              className="text-black hover:text-red-600 transition-all text-4xl font-light p-4 bg-zinc-100 hover:bg-zinc-200 rounded-full"
            >
              ✕
            </button>
          </div>

          {/* Стрелки навигации (темные) */}
          {images.length > 1 && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-6 md:left-12 z-[120] text-zinc-300 hover:text-black transition-all text-7xl md:text-9xl font-thin hover:scale-110 active:scale-95"
              >
                ‹
              </button>
              <button 
                 onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-6 md:right-12 z-[120] text-zinc-300 hover:text-black transition-all text-7xl md:text-9xl font-thin hover:scale-110 active:scale-95"
              >
                ›
              </button>
            </>
           )}

          {/* ГЛАВНОЕ ФОТО (ИСПРАВЛЕННЫЙ РЕЖИМ БЕЗ ТЕМНОТЫ) */}
          <div 
            className="relative z-[110] w-full h-full flex items-center justify-center p-6 md:p-24"
            onClick={() => setIsModalOpen(false)}
          >
            <img 
              src={activeImage} 
              key={activeImage} // Для анимации смены фото
              className="max-w-full max-h-full object-contain animate-in zoom-in duration-500" 
              style={{ mixBlendMode: 'normal' }} // Гарантируем чистые цвета
              alt="Detailed View" 
            />
          </div>

           {/* Футер модалки */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-300 text-[9px] font-black uppercase tracking-[0.6em] hidden md:block">
            TACTICAL_UI_ACTIVE // LIGHT_MODE // KEYBOARD_ARROWS_SUPPORTED
          </div>
        </div>
      )}
    </div>
  );
}