"use client"

import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

// Подключаем твой рабочий Supabase!
const supabase = createClient(
  "https://nlhyzwgfpmboxfdwfgej.supabase.co", 
  "sb_publishable_HzIe3NihAMZzYGTxMAUtQg_rt8ySbgm" 
);

export default function AdminBrands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Загружаем список брендов
  const fetchBrands = async () => {
    const res = await fetch('/api/brands');
    const data = await res.json();
    if (Array.isArray(data)) setBrands(data);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Создание нового бренда
  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setLoading(true);

    try {
      let logoUrl = "";

      // 1. Если выбрали файл, грузим его в Supabase
      if (file) {
        const fileName = `brand-${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage.from('product-images').upload(fileName, file);
        
        if (!error) {
          const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
          logoUrl = publicUrl;
        } else {
          console.error("Ошибка Supabase:", error);
          alert("Ошибка загрузки фото!");
        }
      }

      // 2. Отправляем в нашу базу данных
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, logoUrl }),
      });

      if (res.ok) {
        setName("");
        setFile(null);
        fetchBrands(); // Обновляем список
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Удаление бренда
  const handleDelete = async (id: string) => {
    if (!confirm("Точно удалить этот бренд?")) return;
    
    await fetch('/api/brands', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchBrands();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto text-white font-sans">
      
      <div className="flex items-center gap-4 mb-10 border-b border-zinc-800 pb-6">
        <div className="w-2 h-8 bg-red-600 skew-x-[-15deg]" />
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">БРЕНДЫ ПАРТНЕРОВ</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* ФОРМА ДОБАВЛЕНИЯ */}
        <div className="lg:col-span-1 bg-zinc-950 border border-zinc-900 p-6 shadow-2xl h-fit">
          <h2 className="text-xl font-black italic uppercase tracking-widest mb-6">НОВЫЙ БРЕНД</h2>
          <form onSubmit={handleAddBrand} className="space-y-6">
            <div>
              <label className="block text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">НАЗВАНИЕ (Например: GLOCK)</label>
              <input 
                required 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full bg-black border border-zinc-800 px-4 py-3 text-white font-black uppercase outline-none focus:border-red-600 transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">ЛОГОТИП (PNG С ПРОЗРАЧНЫМ ФОНОМ)</label>
              <label className="w-full flex items-center justify-center border-2 border-dashed border-zinc-800 bg-black px-4 py-6 cursor-pointer hover:border-red-600 transition-colors">
                <span className="font-black italic uppercase tracking-widest text-xs text-zinc-400">
                  {file ? `ВЫБРАН: ${file.name}` : "+ ВЫБРАТЬ ФАЙЛ"}
                </span>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp, image/svg+xml" 
                  onChange={(e) => { if (e.target.files) setFile(e.target.files[0]) }} 
                  className="hidden" 
                />
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-red-600 text-white font-black italic uppercase py-4 hover:bg-white hover:text-black transition-all skew-x-[-5deg] disabled:opacity-50 mt-4"
            >
              <span className="skew-x-[5deg] block">{loading ? "ЗАГРУЗКА..." : "ДОБАВИТЬ В БАЗУ"}</span>
            </button>
          </form>
        </div>

        {/* СПИСОК БРЕНДОВ */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-950 border border-zinc-900">
            {brands.length === 0 ? (
              <div className="p-10 text-center font-mono text-zinc-600 text-sm">БРЕНДОВ ПОКА НЕТ</div>
            ) : (
              <ul>
                {brands.map((brand) => (
                  <li key={brand.id} className="flex items-center justify-between p-4 border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-12 bg-white rounded-sm flex items-center justify-center p-2 overflow-hidden">
                        {brand.logoUrl ? (
                          <img src={brand.logoUrl} alt={brand.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                        ) : (
                          <span className="text-[8px] font-mono text-zinc-400">NO LOGO</span>
                        )}
                      </div>
                      <span className="font-black italic uppercase text-xl">{brand.name}</span>
                    </div>
                    
                    <button 
                      onClick={() => handleDelete(brand.id)}
                      className="text-[10px] font-black uppercase text-zinc-500 hover:text-red-600 transition-colors tracking-widest"
                    >
                      УДАЛИТЬ ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}