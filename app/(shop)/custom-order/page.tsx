"use client"

import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

// Твой рабочий Supabase
const supabase = createClient(
  "https://nlhyzwgfpmboxfdwfgej.supabase.co", 
  "sb_publishable_HzIe3NihAMZzYGTxMAUtQg_rt8ySbgm" 
);

export default function CustomOrderPage() {
  const [lang, setLang] = useState("RU");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: "", phone: "", brand: "", model: "", budget: "", message: ""
  });

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

  const translations: any = {
    RU: {
      title: "СПЕЦЗАКАЗ",
      sub: "ПРИКРЕПИТЕ ФОТО ИЛИ СКРИНШОТ, ЧТОБЫ МЫ НАШЛИ ИМЕННО ТО, ЧТО ВАМ НУЖНО.",
      name: "ПОЗЫВНОЙ / ИМЯ *",
      phone: "WHATSAPP / ТЕЛЕФОН *",
      brand: "БРЕНД (ПРОИЗВОДИТЕЛЬ) *",
      model: "МОДЕЛЬ *",
      budget: "БЮДЖЕТ (УКАЖИТЕ ВАЛЮТУ) *",
      message: "ДОПОЛНИТЕЛЬНЫЕ ДЕТАЛИ (КАЛИБР, ЦВЕТ И Т.Д.)",
      upload: "ПРИКРЕПИТЬ ФОТО (МАКС. 3)",
      submit: "ОТПРАВИТЬ ЗАПРОС В АРСЕНАЛ",
      success: "ЗАЯВКА ПРИНЯТА",
      successSub: "КОМАНДИР, МЫ СВЯЖЕМСЯ С ВАМИ В ТЕЧЕНИЕ 24 ЧАСОВ.",
      back: "ВЕРНУТЬСЯ В АРСЕНАЛ",
      brands: "МЫ РАБОТАЕМ С: BENELLI / BERETTA / BLASER / REMINGTON / RUGER / SIG SAUER / H&K / GLOCK"
    },
    AM: {
      title: "ՀԱՏՈՒԿ ՊԱՏՎԵՐ",
      sub: "ԿՑԵՔ ԼՈՒՍԱՆԿԱՐ ԿԱՄ ՍՔՐԻՆՇՈԹ, ՈՐՊԵՍԶԻ ՄԵՆՔ ԳՏՆԵՆՔ ՀԵՆՑ ԱՅՆ, ԻՆՉ ՁԵԶ ԱՆՀՐԱԺԵՇՏ Է:",
      name: "ԱՆՈՒՆ *",
      phone: "WHATSAPP / ՀԵՌԱԽՈՍ *",
      brand: "ԲՐԵՆԴ *",
      model: "ՄՈԴԵԼ *",
      budget: "ԲՅՈՒՋԵ *",
      message: "ԼՐԱՑՈՒՑԻՉ ՄԱՆՐԱՄԱՍՆԵՐ",
      upload: "ԿՑԵԼ ՆԿԱՐ (ԱՌԱՎԵԼԱԳՈՒՅՆԸ 3)",
      submit: "ՈՒՂԱՐԿԵԼ ՀԱՅՏԸ",
      success: "ՀԱՅՏԸ ԸՆԴՈՒՆՎԱԾ Է",
      successSub: "ՀՐԱՄԱՆԱՏԱՐ, ՄԵՆՔ ԿԿԱՊՆՎԵՆՔ ՁԵԶ ՀԵՏ 24 ԺԱՄՎԱ ԸՆԹԱՑՔՈՒՄ:",
      back: "ՎԵՐԱԴԱՌՆԱԼ",
      brands: "ՄԵՆՔ ԱՇԽԱՏՈՒՄ ԵՆՔ. BENELLI / BERETTA / BLASER / REMINGTON / RUGER / SIG SAUER / H&K / GLOCK"
    },
    EN: {
      title: "CUSTOM ORDER",
      sub: "ATTACH A PHOTO OR SCREENSHOT SO WE CAN FIND EXACTLY WHAT YOU NEED.",
      name: "CALLSIGN / NAME *",
      phone: "WHATSAPP / PHONE *",
      brand: "BRAND *",
      model: "MODEL *",
      budget: "BUDGET *",
      message: "ADDITIONAL DETAILS",
      upload: "ATTACH PHOTO (MAX 3)",
      submit: "SEND REQUEST TO ARSENAL",
      success: "REQUEST RECEIVED",
      successSub: "COMMANDER, WE WILL CONTACT YOU WITHIN 24 HOURS.",
      back: "BACK TO ARSENAL",
      brands: "WE WORK WITH: BENELLI / BERETTA / BLASER / REMINGTON / RUGER / SIG SAUER / H&K / GLOCK"
    }
  };

  const t = translations[lang] || translations.RU;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 3);
      setFiles(selectedFiles);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const uploadedUrls = [];
      
      // 1. Загрузка фото в Supabase
      for (const file of files) {
        const fileName = `custom-${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage.from('product-images').upload(fileName, file);
        if (!error) {
          const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
          uploadedUrls.push(publicUrl);
        } else {
          console.error("Ошибка загрузки фото:", error);
        }
      }
      
      // 2. Отправка в наш API Telegram
      const res = await fetch("/api/custom-order", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, images: uploadedUrls }),
      });
      
      // 3. Жесткая проверка ответа от сервера
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Сервер вернул ошибку. Возможно, не настроен Telegram API.");
      }
      
      // 4. Если всё успешно:
      setIsSuccess(true);
      
    } catch (err: any) {
      console.error("ОШИБКА ОТПРАВКИ:", err);
      alert(`⚠️ ОШИБКА: ${err.message}\nУбедитесь, что серверный файл API существует и ключи Telegram (.env) прописаны!`);
    } finally {
      setLoading(false);
    }
  };

  // ЭКРАН УСПЕХА
  if (isSuccess) return (
    <div className="bg-[#F8F9FA] min-h-screen text-black flex flex-col items-center justify-center p-8 text-center font-sans relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      <div className="relative z-10">
        <div className="w-24 h-24 border-4 border-red-600 rounded-full flex items-center justify-center mx-auto mb-8 bg-white shadow-2xl">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase italic mb-4 tracking-tighter text-black">{t.success}</h1>
        <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-10 border-l-4 border-red-600 pl-4 max-w-md mx-auto">{t.successSub}</p>
        <button onClick={() => window.location.href = "/catalog"} className="bg-red-600 text-white px-12 py-5 font-black uppercase italic hover:bg-black transition-all shadow-xl skew-x-[-10deg]">
           <span className="skew-x-[10deg] block">{t.back}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-black pt-32 pb-20 px-4 md:px-10 font-sans selection:bg-red-600 selection:text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      <div className="max-w-5xl mx-auto relative z-10">
        
        <div className="mb-16 border-l-8 border-red-600 pl-6 md:pl-8">
          <p className="text-red-600 font-mono text-[10px] tracking-[0.4em] uppercase mb-2">GLOBAL LOGISTICS // SECURE</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-4">{t.title}</h1>
          <p className="text-zinc-500 font-black uppercase tracking-widest text-xs leading-relaxed max-w-xl">{t.sub}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border-2 border-zinc-200 p-6 md:p-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            
            {/* ЛЕВАЯ КОЛОНКА */}
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2">{t.name}</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-zinc-100 px-4 py-4 font-black text-sm uppercase outline-none focus:border-l-4 focus:border-red-600 transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2">{t.phone}</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-zinc-100 px-4 py-4 font-black text-sm uppercase outline-none focus:border-l-4 focus:border-red-600 transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2">{t.budget}</label>
                <input required placeholder="1 500 000 AMD" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="w-full bg-zinc-100 px-4 py-4 font-black text-sm uppercase outline-none focus:border-l-4 focus:border-red-600 transition-all text-red-600" />
              </div>
              
              <div className="pt-4">
                <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2">{t.upload}</label>
                <label className={`w-full flex items-center justify-center border-2 border-dashed px-4 py-5 cursor-pointer transition-colors ${files.length > 0 ? 'border-red-600 bg-red-50 text-red-600' : 'border-zinc-300 bg-zinc-50 text-zinc-500 hover:border-black hover:text-black'}`}>
                  <span className="font-black italic uppercase tracking-widest text-xs">
                    {files.length > 0 ? `ВЫБРАНО ФАЙЛОВ: ${files.length} ✓` : t.upload}
                  </span>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* ПРАВАЯ КОЛОНКА */}
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2">{t.brand}</label>
                <input required placeholder="BENELLI / GLOCK..." value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full bg-zinc-100 px-4 py-4 font-black text-sm uppercase outline-none focus:border-l-4 focus:border-red-600 transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2">{t.model}</label>
                <input required value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full bg-zinc-100 px-4 py-4 font-black text-sm uppercase outline-none focus:border-l-4 focus:border-red-600 transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2">{t.message}</label>
                <textarea rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-zinc-100 px-4 py-4 font-black text-sm uppercase outline-none focus:border-l-4 focus:border-red-600 transition-all resize-none" />
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t-2 border-zinc-100">
            <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-black text-white py-6 font-black uppercase italic text-xl tracking-widest transition-all skew-x-[-5deg] active:scale-95 disabled:opacity-50 shadow-xl">
              <span className="skew-x-[5deg] block">{loading ? "PROCESSING..." : t.submit}</span>
            </button>
            <p className="text-center text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mt-8 italic">
              {t.brands}
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}