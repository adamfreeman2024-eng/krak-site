"use client"

import { useState, useEffect } from "react";

export default function UnionPage() {
  const [lang, setLang] = useState("RU");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  // РЕАЛЬНАЯ ОТПРАВКА В TELEGRAM ЧЕРЕЗ API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/union', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setName("");
        setPhone("");
      } else {
        alert("ОШИБКА СВЯЗИ. ПОПРОБУЙТЕ ПОЗЖЕ.");
      }
    } catch (err) {
      console.error(err);
      alert("СЕРВЕР НЕ ОТВЕЧАЕТ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const t: any = {
    RU: {
      heroTitle: "ЭКСТРА ДОСТУП // EGER ID",
      heroSub: "ЕДИНЫЙ ЦИФРОВОЙ ОРУЖЕЙНЫЙ ПАСПОРТ",
      heroDesc: "Официальное членство в ассоциации EGER, эксклюзивные скидки на KRAK.AM и доступ к закрытым оружейным поставкам для элиты.",
      silverTitle: "EGER MEMBER",
      silverDesc: "Для активных стрелков и охотников Армении.",
      silverPerks: ["Официальный охотничий билет", "Базовая скидка 5% на платформе", "Бесплатная пристрелка раз в год", "Доступ к открытым мероприятиям"],
      goldTitle: "EGER GOLD",
      goldDesc: "Закрытая элита и коллекционеры.",
      goldPerks: ["Скидка до 15% на весь арсенал", "Доступ к закрытому EGER GOLD WhatsApp", "Право первой покупки редких стволов", "Оружейный консьерж 24/7", "VIP-часы в тире и мастерской"],
      formTitle: "ПОДАТЬ ЗАЯВКУ В СОЮЗ",
      formName: "ВАШЕ ИМЯ",
      formPhone: "ТЕЛЕФОН",
      formBtn: "ОТПРАВИТЬ ЗАПРОС",
      formSuccess: "ЗАЯВКА ПРИНЯТА. ОЖИДАЙТЕ РЕШЕНИЯ КОМИТЕТА.",
    },
    AM: {
      heroTitle: "ԷՔՍԿԼՅՈՒԶԻՎ ՄՈՒՏՔ // EGER ID",
      heroSub: "ՄԻԱՍՆԱԿԱՆ ԹՎԱՅԻՆ ԶԵՆՔԻ ԱՆՁՆԱԳԻՐ",
      heroDesc: "Պաշտոնական անդամակցություն EGER ասոցիացիային, բացառիկ զեղչեր KRAK.AM-ում և մուտք դեպի փակ զինանոցներ էլիտայի համար:",
      silverTitle: "EGER MEMBER",
      silverDesc: "Ակտիվ հրաձիգների և որսորդների համար:",
      silverPerks: ["Պաշտոնական որսորդական տոմս", "Բազային 5% զեղչ հարթակում", "Անվճար նշանառում տարին մեկ անգամ", "Մուտք դեպի բաց միջոցառումներ"],
      goldTitle: "EGER GOLD",
      goldDesc: "Փակ էլիտա և կոլեկցիոներներ:",
      goldPerks: ["Մինչև 15% զեղչ ողջ արսենալի համար", "Մուտք EGER GOLD WhatsApp", "Հազվագյուտ զենքերի գնման առաջնահերթություն", "Անձնական կոնսիերժ 24/7", "VIP ժամեր հրաձգարանում և արհեստանոցում"],
      formTitle: "ՆԵՐԿԱՅԱՑՆԵԼ ՀԱՅՏ",
      formName: "ՁԵՐ ԱՆՈՒՆԸ",
      formPhone: "ՀԵՌԱԽՈՍ",
      formBtn: "ՈՒՂԱՐԿԵԼ ՀԱՐՑՈՒՄԸ",
      formSuccess: "ՀԱՅՏՆ ԸՆԴՈՒՆՎԱԾ Է: ՍՊԱՍԵՔ ԿՈՄԻՏԵԻ ՈՐՈՇՄԱՆԸ:",
    },
    EN: {
      heroTitle: "EXCLUSIVE ACCESS // EGER ID",
      heroSub: "UNIFIED DIGITAL WEAPON PASSPORT",
      heroDesc: "Official membership in the EGER association, exclusive discounts on KRAK.AM, and access to private weapon supplies for the elite.",
      silverTitle: "EGER MEMBER",
      silverDesc: "For active shooters and hunters.",
      silverPerks: ["Official hunting license", "Basic 5% discount on the platform", "Free zeroing once a year", "Access to public events"],
      goldTitle: "EGER GOLD",
      goldDesc: "Private elite and collectors.",
      goldPerks: ["Up to 15% discount on all arsenal", "EGER GOLD WhatsApp access", "First purchase right for rare firearms", "Weapon concierge 24/7", "VIP hours in range and workshop"],
      formTitle: "SUBMIT MEMBERSHIP APPLICATION",
      formName: "YOUR NAME",
      formPhone: "PHONE NUMBER",
      formBtn: "SEND REQUEST",
      formSuccess: "APPLICATION RECEIVED. AWAIT COMMITTEE DECISION.",
    }
  };
  const cur = t[lang] || t.RU;

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-red-600 selection:text-white pb-20">
      
      {/* ФОНОВАЯ СЕТКА И ГРАДИЕНТ */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #333 0%, transparent 70%), linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)', backgroundSize: '100% 100%, 40px 40px, 40px 40px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-40">
        
        {/* ЗАГОЛОВОК */}
        <div className="text-center mb-24">
          <p className="text-red-600 font-mono text-xs md:text-sm tracking-[0.4em] font-black uppercase mb-4 animate-pulse">
            {cur.heroTitle}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter leading-none mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600">
            {cur.heroSub.split(' ')[0]} <br className="md:hidden" /> {cur.heroSub.split(' ').slice(1).join(' ')}
          </h1>
          <p className="text-zinc-400 font-bold text-sm md:text-lg uppercase tracking-widest max-w-3xl mx-auto leading-relaxed border-l-2 border-red-600 pl-4 text-left md:text-center md:border-l-0 md:pl-0">
            {cur.heroDesc}
          </p>
        </div>

        {/* КАРТОЧКИ СТАТУСОВ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-24">
          
          {/* SILVER CARD */}
          <div className="relative group bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 p-10 hover:border-zinc-500 transition-all duration-500 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-500 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity" />
            
            <div className="flex justify-between items-start mb-8 border-b border-zinc-800 pb-8">
              <div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-300 mb-2">{cur.silverTitle}</h3>
                <p className="text-xs font-mono tracking-widest text-zinc-500 uppercase">{cur.silverDesc}</p>
              </div>
              <div className="w-12 h-12 bg-zinc-800 flex items-center justify-center skew-x-[-10deg]">
                <span className="skew-x-[10deg] font-black text-zinc-400">S</span>
              </div>
            </div>

            <ul className="space-y-4">
              {cur.silverPerks.map((perk: string, i: number) => (
                <li key={i} className="flex items-start gap-4 text-sm font-bold uppercase tracking-widest text-zinc-400">
                  <div className="w-2 h-2 mt-1.5 bg-zinc-500 shrink-0" /> {perk}
                </li>
              ))}
            </ul>
          </div>

          {/* GOLD CARD */}
          <div className="relative group bg-gradient-to-br from-[#1a1500] to-black border border-[#4a3b00] p-10 hover:border-[#ffd700] transition-all duration-500 shadow-2xl overflow-hidden shadow-[#ffd700]/5 hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffd700] rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity" />
            
            <div className="flex justify-between items-start mb-8 border-b border-[#332800] pb-8">
              <div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-[#ffd700] mb-2">{cur.goldTitle}</h3>
                <p className="text-xs font-mono tracking-widest text-[#a68a00] uppercase">{cur.goldDesc}</p>
              </div>
              <div className="w-12 h-12 bg-[#332800] flex items-center justify-center skew-x-[-10deg]">
                <span className="skew-x-[10deg] font-black text-[#ffd700]">G</span>
              </div>
            </div>

            <ul className="space-y-4">
              {cur.goldPerks.map((perk: string, i: number) => (
                <li key={i} className="flex items-start gap-4 text-sm font-bold uppercase tracking-widest text-zinc-300">
                  <div className="w-2 h-2 mt-1.5 bg-[#ffd700] shrink-0 shadow-[0_0_10px_#ffd700]" /> {perk}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ФОРМА ЗАЯВКИ */}
        <div className="max-w-xl mx-auto bg-zinc-950 border-t-4 border-red-600 p-8 md:p-12 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter mb-8 text-center">
            {cur.formTitle}
          </h2>

          {isSuccess ? (
            <div className="bg-green-900/20 border border-green-900 p-6 text-center">
              <p className="text-green-500 font-mono text-sm tracking-widest uppercase animate-pulse">
                {cur.formSuccess}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-zinc-500 font-black uppercase text-[10px] tracking-widest mb-2">{cur.formName}</label>
                <input 
                  required
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black border border-zinc-800 text-white px-4 py-4 font-black uppercase tracking-widest outline-none focus:border-red-600 transition-colors"
                />
              </div>
              <div>
                <label className="block text-zinc-500 font-black uppercase text-[10px] tracking-widest mb-2">{cur.formPhone}</label>
                <input 
                  required
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black border border-zinc-800 text-white px-4 py-4 font-black uppercase tracking-widest outline-none focus:border-red-600 transition-colors"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-red-600 text-white font-black italic uppercase py-5 tracking-widest hover:bg-white hover:text-black transition-all skew-x-[-5deg] disabled:opacity-50 mt-4"
              >
                <span className="skew-x-[5deg] block">
                  {isSubmitting ? "ОБРАБОТКА..." : cur.formBtn}
                </span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}