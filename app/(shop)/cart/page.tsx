"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/cartStore";
import { XCircle, CheckCircle } from "lucide-react"; 

export default function CartPage() {
  const [lang, setLang] = useState("RU");
  const [promoInput, setPromoInput] = useState("");
  const [discount, setDiscount] = useState(0); 
  const [promoError, setPromoError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [isMounted, setIsMounted] = useState(false);
  
  const [suggestedOptics, setSuggestedOptics] = useState<any[]>([]);
  const [hasFirearm, setHasFirearm] = useState(false);
  const [hasOptics, setHasOptics] = useState(false);

  const cartItems = useCartStore((state: any) => state.cartItems || []);
  const removeItem = useCartStore((state: any) => state.removeItem);
  const updateQuantity = useCartStore((state: any) => state.updateQuantity);
  const clearCart = useCartStore((state: any) => state.clearCart);
  const addToCart = useCartStore((state: any) => state.addToCart);

  useEffect(() => {
    setIsMounted(true);
    setLang(localStorage.getItem("lang") || "RU");

    const checkBundle = async () => {
      if (cartItems.length === 0) return;
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const allProducts = data.products || [];

        const firearmInCart = cartItems.some((item: any) => {
          const p = allProducts.find((allP: any) => allP.id === item.id);
          const cat = (p?.category?.nameRu || "").toLowerCase();
          return cat.includes("нарезное") || cat.includes("гладкоствольное") || cat.includes("оружие");
        });

        const opticsInCart = cartItems.some((item: any) => {
          const p = allProducts.find((allP: any) => allP.id === item.id);
          const cat = (p?.category?.nameRu || "").toLowerCase();
          return cat.includes("оптика") || cat.includes("optic");
        });

        setHasFirearm(firearmInCart);
        setHasOptics(opticsInCart);

        if (firearmInCart && !opticsInCart) {
          const opticsList = allProducts.filter((p: any) => {
            const cat = (p.category?.nameRu || "").toLowerCase();
            return cat.includes("оптика") || cat.includes("optic");
          }).slice(0, 3);
          setSuggestedOptics(opticsList);
        } else {
          setSuggestedOptics([]);
        }
      } catch (err) { console.error(err); }
    };
    checkBundle();
  }, [cartItems]);

  const t: any = {
    RU: {
      cartTitle: "КОРЗИНА", checkoutTitle: "ОФОРМЛЕНИЕ ЗАКАЗА", promoPlaceholder: "ТРОФЕЙНЫЙ ПРОМОКОД", apply: "ПРИМЕНИТЬ",
      invalidPromo: "КОД НЕ НАЙДЕН ИЛИ ИСТЕК", applied: "КОД АКТИВИРОВАН: -", namePlaceholder: "ПОЗЫВНОЙ / ИМЯ", phonePlaceholder: "ТЕЛЕФОН",
      total: "ИТОГО:", discountLabel: "СКИДКА", send: "ОФОРМИТЬ ЗАКАЗ", sending: "ПЕРЕДАЧА КООРДИНАТ...", 
      success: "ЗАКАЗ ПРИНЯТ", successSub: "НАШ ОПЕРАТОР СВЯЖЕТСЯ С ВАМИ В БЛИЖАЙШЕЕ ВРЕМЯ ДЛЯ ПОДТВЕРЖДЕНИЯ ДЕТАЛЕЙ.",
      error: "ОШИБКА СЕТИ", empty: "АРСЕНАЛ ПУСТ", toShop: "В КАТАЛОГ",
      bundleOffer: "ДОБАВЬТЕ ОПТИКУ И ПОЛУЧИТЕ ЧЕХОЛ + РЕМЕНЬ В ПОДАРОК!",
      bundleActive: "КОМПЛЕКТ АКТИВИРОВАН: ПОДАРКИ ВКЛЮЧЕНЫ!",
      suggestedTitle: "ПОДХОДЯЩАЯ ОПТИКА ДЛЯ ВАШЕЙ СИСТЕМЫ"
    },
    AM: {
      cartTitle: "ԶԱՄԲՅՈՒՂ", checkoutTitle: "ՊԱՏՎԵՐԻ ՁԵՎԱԿԵՐՊՈՒՄ", promoPlaceholder: "ՊՐՈՄՈԿՈԴ", apply: "ԿԻՐԱՌԵԼ",
      invalidPromo: "ԿՈԴԸ ՍԽԱԼ Է", applied: "ԿՈԴԸ ԱԿՏԻՎԱՑՎԱԾ Է. -", namePlaceholder: "ԱՆՈՒՆ", phonePlaceholder: "ՀԵՌԱԽՈՍ",
      total: "ԸՆԴԱՄԵՆԸ:", discountLabel: "ԶԵՂՉ", send: "ՀԱՍՏԱՏԵԼ ՊԱՏՎԵՐԸ", sending: "ՈՒՂԱՐԿՎՈՒՄ Է...", 
      success: "ՊԱՏՎԵՐՆ ԸՆԴՈՒՆՎԱԾ Է", successSub: "ՄԵՐ ՄԱՍՆԱԳԵՏԸ ՇՈՒՏՈՎ ԿԿԱՊՎԻ ՁԵԶ ՀԵՏ ՊԱՏՎԵՐԻ ՄԱՆՐԱՄԱՍՆԵՐԸ ՀԱՍՏԱՏԵԼՈՒ ՀԱՄԱՐ:",
      error: "ՍԽАԼ", empty: "ԶԱМԲՅՈՒՂԸ ԴԱՏԱՐԿ Է", toShop: "ԿԱՏԱԼՈԳ",
      bundleOffer: "ԱՎԵԼԱՑՐԵՔ ՕՊՏԻԿԱ ԵՎ ՍՏԱՑԵՔ ՊԱՏՅԱՆ + ԳՈՏԻ ՆՎԵՐ",
      bundleActive: "ԼՐԱԿԱԶՄԸ ԱԿՏԻՎԱՑՎԱԾ Է. ՆՎԵՐՆԵՐԸ ՆԵՐԱՌՎԱԾ ԵՆ",
      suggestedTitle: "ՀԱՐՄԱՐ ՕՊՏԻԿԱ ՁԵՐ ԶԵՆՔԻ ՀԱՄԱՐ"
    }
  };
  const cur = t[lang] || t.RU;

  const subTotal = cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  const discountAmount = (subTotal * discount) / 100;
  const finalTotal = subTotal - discountAmount;

  const handleApplyPromo = async () => {
    if (!promoInput) return;
    setIsValidating(true);
    setPromoError("");

    try {
      const res = await fetch('/api/promo/validate', {
        method: 'POST',
        body: JSON.stringify({ code: promoInput })
      });
      const data = await res.json();

      if (res.ok) {
        setDiscount(data.discount);
        setPromoError("");
      } else {
        setDiscount(0);
        setPromoError(cur.invalidPromo);
      }
    } catch (e) {
      setPromoError("Ошибка сети");
    } finally {
      setIsValidating(false);
    }
  };

  const handleCheckout = async () => {
    if (!name || !phone) return alert("ВВЕДИТЕ ДАННЫЕ");
    setStatus("sending");
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, items: cartItems, total: finalTotal, discount })
      });
      if (res.ok) {
        setStatus("success");
        if(clearCart) clearCart();
      } else setStatus("error");
    } catch (err) { setStatus("error"); }
  };

  if (!isMounted) return null; 

  // --- ЭКРАН ПОДТВЕРЖДЕНИЯ (УБИРАЕТ ВСЁ ОСТАЛЬНОЕ) ---
  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center px-4 font-sans text-center">
        <div className="max-w-xl w-full bg-white p-12 shadow-2xl border-t-8 border-green-500 skew-x-[-5deg]">
          <div className="skew-x-[5deg]">
            <CheckCircle size={80} className="mx-auto text-green-500 mb-6 animate-pulse" />
            <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4 text-black">{cur.success}</h1>
            <p className="font-bold text-zinc-500 uppercase tracking-widest text-sm mb-10 leading-relaxed">
              {cur.successSub}
            </p>
            <Link href="/catalog" className="inline-block bg-black text-white px-12 py-5 font-black italic uppercase tracking-widest hover:bg-red-600 transition-all skew-x-[-10deg]">
              {cur.toShop}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center">
        <h1 className="text-6xl font-black italic uppercase text-zinc-300 mb-8">{cur.empty}</h1>
        <Link href="/catalog" className="bg-red-600 text-white px-8 py-4 font-black italic uppercase skew-x-[-10deg]">
           {cur.toShop}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-black font-sans pb-20">
      <div className="w-full pt-32 pb-10 px-4 md:px-10">
        <div className="max-w-7xl mx-auto flex items-end justify-between border-b-4 border-black pb-4">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter skew-x-[-5deg]">{cur.cartTitle}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-8 flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          {hasFirearm && (
            <div className={`mb-6 p-6 skew-x-[-5deg] border-l-8 transition-all duration-500 ${hasOptics ? 'bg-green-600 border-green-900' : 'bg-black border-red-600 animate-pulse'}`}>
              <div className="skew-x-[5deg] flex items-center gap-4 text-white">
                <div className="text-3xl">🎯</div>
                <p className="font-black italic uppercase text-sm md:text-lg">{hasOptics ? cur.bundleActive : cur.bundleOffer}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {cartItems.map((item: any) => (
              <div key={item.id} className="bg-white border-2 border-transparent hover:border-zinc-300 p-4 flex flex-col md:flex-row items-center gap-6 shadow-sm transition-all group">
                <div className="w-full md:w-32 h-20 bg-zinc-100 flex items-center justify-center relative overflow-hidden">
                   {item.image && <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-black italic text-xl uppercase tracking-tighter line-clamp-1">{item.name}</h3>
                  <p className="font-black text-red-600 text-lg mt-1">{Number(item.price).toLocaleString()} ֏</p>
                </div>
                <div className="flex items-center gap-4 bg-zinc-100 p-2 font-mono">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white">-</button>
                  <span className="w-8 text-center font-black">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white">+</button>
                </div>
                <button onClick={() => removeItem(item.id)} className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-red-600"><XCircle size={24}/></button>
              </div>
            ))}
          </div>

          {suggestedOptics.length > 0 && (
            <div className="mt-12 p-8 bg-zinc-200 border-2 border-dashed border-zinc-400">
              <h4 className="font-black italic uppercase text-sm mb-6 text-zinc-600 flex items-center gap-2">
                <div className="w-2 h-6 bg-red-600" /> {cur.suggestedTitle}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {suggestedOptics.map((opt: any) => (
                  <div key={opt.id} className="bg-white p-4 shadow-lg flex flex-col">
                    <img src={opt.images?.[0]} className="h-32 object-contain mb-4 mix-blend-multiply" alt="" />
                    <p className="font-black uppercase text-[10px] mb-2 line-clamp-1">{lang === 'RU' ? opt.nameRu : opt.nameAm}</p>
                    <button onClick={() => addToCart({ id: opt.id, name: lang === 'RU' ? opt.nameRu : opt.nameAm, price: opt.price, quantity: 1, image: opt.images?.[0] })} className="mt-auto bg-black text-white text-[10px] font-black uppercase py-2 hover:bg-red-600 transition-colors">+ ДОБАВИТЬ</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-white border-t-8 border-red-600 p-8 shadow-2xl sticky top-32">
            <h2 className="font-black italic tracking-widest uppercase mb-8 pb-4 border-b-2 border-zinc-100">{cur.checkoutTitle}</h2>
            
            <div className="mb-8">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder={cur.promoPlaceholder} 
                  value={promoInput} 
                  onChange={(e) => setPromoInput(e.target.value)} 
                  className={`flex-1 bg-zinc-100 px-4 py-3 font-black text-xs uppercase outline-none border-b-2 transition-all ${promoError ? 'border-red-600' : 'border-transparent focus:border-black'}`}
                />
                <button 
                  onClick={handleApplyPromo}
                  disabled={isValidating}
                  className="bg-black text-white px-4 py-3 font-black text-[10px] uppercase hover:bg-red-600 transition-all skew-x-[-5deg]"
                >
                  {isValidating ? '...' : cur.apply}
                </button>
              </div>
              {promoError && <p className="text-red-600 text-[9px] font-black mt-2 uppercase">{promoError}</p>}
              {discount > 0 && <p className="text-green-600 text-[9px] font-black mt-2 uppercase">{cur.applied}{discount}%</p>}
            </div>

            <div className="space-y-4 mb-8">
              <input type="text" placeholder={cur.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-zinc-100 px-4 py-4 font-black text-xs uppercase outline-none focus:border-l-4 focus:border-red-600" />
              <input type="tel" placeholder={cur.phonePlaceholder} value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-zinc-100 px-4 py-4 font-black text-xs uppercase outline-none focus:border-l-4 focus:border-red-600" />
            </div>
            
            <div className="mb-8 p-4 bg-zinc-50 border-l-4 border-black">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{cur.total}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-black italic tracking-tighter text-black">{finalTotal.toLocaleString()}</p>
                <span className="text-xl text-red-600 font-black">֏</span>
              </div>
              {discount > 0 && (
                <p className="text-[10px] font-black text-green-600 uppercase mt-2 italic">-{discountAmount.toLocaleString()} ֏ (СНАЙПЕРСКИЙ КЭШБЕК)</p>
              )}
            </div>

            <button onClick={handleCheckout} disabled={status === "sending"} className="w-full bg-red-600 text-white py-5 font-black italic uppercase hover:bg-black skew-x-[-5deg] transition-all active:scale-95 shadow-lg">
              {status === "sending" ? cur.sending : cur.send}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}