"use client"

import { useState } from "react";
import { createProduct, updateProduct } from "@/lib/actions";

export default function ProductForm({ categories, brands, editItem, onClose }: any) {
  const [loading, setLoading] = useState(false);
  
  // Состояние для красивого SEO-слага
  const [slugValue, setSlugValue] = useState(editItem?.slug || "");

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Автоматически форматируем слаг: маленькие буквы, без пробелов, только латиница
    const val = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setSlugValue(val);
  };

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      if (editItem) {
        await updateProduct(formData);
      } else {
        await createProduct(formData);
      }
      if (typeof onClose === 'function') {
        onClose();
      }
    } catch (error) {
      console.error("Ошибка при сохранении товара:", error);
      alert("Ошибка при сохранении. Проверь консоль.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-950 border-2 border-zinc-900 w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,1)] scrollbar-hide">
        
        {/* Шапка формы */}
        <div className="p-6 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/50 sticky top-0 z-10 backdrop-blur-sm">
          <h2 className="text-xl font-black uppercase italic text-white tracking-tighter">
            {editItem ? "МОДЕРНИЗАЦИЯ ОБЪЕКТА" : "ПОСТАВКА В АРСЕНАЛ"}
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            className="text-zinc-500 hover:text-red-600 transition-colors text-2xl font-black"
          >
            ✕
          </button>
        </div>

        <form action={handleSubmit} className="p-6 space-y-8">
          {editItem && <input type="hidden" name="id" value={editItem.id} />}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* ЛЕВАЯ КОЛОНКА: ИМЕНА И ТЕХ.ДАННЫЕ */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-red-600 font-black text-[10px] uppercase italic tracking-widest border-b border-zinc-900 pb-2">Идентификация</h4>
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-black mb-1 block">Название (RU)</label>
                  <input name="nameRu" defaultValue={editItem?.nameRu} required className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white outline-none focus:border-red-600 text-xs font-bold" />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-black mb-1 block">Название (AM)</label>
                  <input name="nameAm" defaultValue={editItem?.nameAm} required className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white outline-none focus:border-red-600 text-xs font-bold" />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-black mb-1 block">Название (EN)</label>
                  <input name="nameEn" defaultValue={editItem?.nameEn} required className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white outline-none focus:border-red-600 text-xs font-bold" />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-black mb-1 block">Артикул / SKU</label>
                  <input name="sku" defaultValue={editItem?.sku} placeholder="Напр: GLOCK-17-GEN5" className="w-full bg-zinc-900 border border-zinc-800 p-3 text-zinc-400 outline-none focus:border-red-600 text-xs font-mono font-bold" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-red-600 font-black text-[10px] uppercase italic tracking-widest border-b border-zinc-900 pb-2">Коммерция</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] text-zinc-500 uppercase font-black mb-1 block">Цена (֏)</label>
                    <input name="price" type="number" defaultValue={editItem?.price} required className="w-full bg-zinc-900 border border-zinc-800 p-3 text-red-600 outline-none focus:border-red-600 text-sm font-black" />
                  </div>
                  <div>
                    <label className="text-[9px] text-zinc-500 uppercase font-black mb-1 block">Запас (шт)</label>
                    <input name="stock" type="number" defaultValue={editItem?.stockQuantity} required className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white outline-none focus:border-red-600 text-sm font-bold" />
                  </div>
                </div>
              </div>
            </div>

            {/* ПРАВАЯ КОЛОНКА: КАТЕГОРИИ, БРЕНДЫ, ФОТО */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-red-600 font-black text-[10px] uppercase italic tracking-widest border-b border-zinc-900 pb-2">Классификация</h4>
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-black mb-1 block">Категория</label>
                  <select name="categoryId" defaultValue={editItem?.categoryId} className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white outline-none focus:border-red-600 text-xs font-bold">
                    {categories?.map((c: any) => (
                      <option key={c.id} value={c.id} className="bg-zinc-950">{c.nameRu}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-black mb-1 block">Бренд / Производитель</label>
                  <select name="brandId" defaultValue={editItem?.brandId || "none"} className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white outline-none focus:border-red-600 text-xs font-bold">
                    <option value="none">-- БЕЗ БРЕНДА --</option>
                    {brands?.map((b: any) => (
                      <option key={b.id} value={b.id} className="bg-zinc-950">{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-black mb-1 block">Фото (Supabase Storage)</label>
                  <input 
                    type="file" 
                    name="images"
                    multiple      
                    accept="image/*"
                    className="w-full text-[10px] text-zinc-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-zinc-800 file:text-white hover:file:bg-red-600 cursor-pointer" 
                  />
                  <p className="text-[8px] text-zinc-600 mt-1 uppercase font-bold italic tracking-tighter">Можно выбрать несколько файлов (Ctrl+Click)</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-red-600 font-black text-[10px] uppercase italic tracking-widest border-b border-zinc-900 pb-2">Статус объекта</h4>
                <div className="grid grid-cols-1 gap-3">
                  <label className="flex items-center gap-3 bg-red-950/20 border border-red-900/50 p-3 cursor-pointer hover:bg-red-900/30 transition-colors">
                    <input type="checkbox" name="requiresLicense" defaultChecked={editItem?.requiresLicense} className="w-4 h-4 accent-red-600" />
                    <div>
                      <span className="text-[10px] font-black uppercase italic text-red-500 block">Лицензия МВД</span>
                      <span className="text-[8px] text-zinc-500 uppercase font-bold">Обязательна для покупки</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 bg-amber-950/20 border border-amber-900/50 p-3 cursor-pointer hover:bg-amber-900/30 transition-colors">
                    <input type="checkbox" name="isFeatured" defaultChecked={editItem?.isFeatured} className="w-4 h-4 accent-amber-500" />
                    <div>
                      <span className="text-[10px] font-black uppercase italic text-amber-500 block">РЕКОМЕНДУЕМОЕ (TOP)</span>
                      <span className="text-[8px] text-zinc-500 uppercase font-bold">Вывести в блок на главную страницу</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* ОПИСАНИЯ */}
          <div className="space-y-4 border-t border-zinc-900 pt-6">
            <h4 className="text-red-600 font-black text-[10px] uppercase italic tracking-widest">Техническое описание</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[9px] text-zinc-500 uppercase font-black mb-1 block">Описание (RU)</label>
                <textarea name="descRu" defaultValue={editItem?.descriptionRu} className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white outline-none focus:border-red-600 text-[11px] h-32 resize-none" />
              </div>
              <div>
                <label className="text-[9px] text-zinc-500 uppercase font-black mb-1 block">Описание (AM)</label>
                <textarea name="descAm" defaultValue={editItem?.descriptionAm} className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white outline-none focus:border-red-600 text-[11px] h-32 resize-none font-bold" />
              </div>
              <div>
                <label className="text-[9px] text-zinc-500 uppercase font-black mb-1 block">Описание (EN)</label>
                <textarea name="descEn" defaultValue={editItem?.descriptionEn} className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white outline-none focus:border-red-600 text-[11px] h-32 resize-none" />
              </div>
            </div>
          </div>

          {/* SEO (Здесь добавлено поле Slug) */}
          <div className="bg-zinc-900/30 p-6 border border-zinc-900">
            <h4 className="text-zinc-500 font-black text-[10px] uppercase italic mb-4 tracking-widest">Разведка (SEO)</h4>
            
            {/* НОВОЕ ПОЛЕ SLUG */}
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-[9px] text-zinc-500 uppercase font-black mb-1 block">
                URL Ссылка (Slug) — krak.am/product/...
              </label>
              <input
                name="slug"
                type="text"
                placeholder="saiga-mk-030-762-39"
                className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-red-600 outline-none transition-all font-mono text-xs"
                value={slugValue}
                onChange={handleSlugChange}
              />
              <p className="text-[8px] text-zinc-600 italic">
                * Только латиница, цифры и дефисы. Пробелы заменяются автоматически.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input name="seoTitle" defaultValue={editItem?.seoTitle} placeholder="SEO Meta Title" className="bg-black border border-zinc-800 p-3 text-white text-[11px] outline-none focus:border-zinc-500" />
              <input name="seoKeywords" defaultValue={editItem?.seoKeywords} placeholder="Keywords (через запятую)" className="bg-black border border-zinc-800 p-3 text-white text-[11px] outline-none focus:border-zinc-500" />
            </div>
            <textarea name="seoDescription" defaultValue={editItem?.seoDescription} placeholder="Meta Description для поисковиков..." className="w-full bg-black border border-zinc-800 p-3 text-white text-[11px] h-20 resize-none outline-none focus:border-zinc-500" />
          </div>

          {/* Кнопка отправки */}
          <div className="sticky bottom-0 bg-zinc-950 pt-4 pb-2 border-t border-zinc-900">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-red-600 hover:bg-white hover:text-black disabled:bg-zinc-800 text-white font-black py-5 uppercase italic text-sm transition-all"
            >
              {loading ? "СИНХРОНИЗАЦИЯ С БАЗОЙ..." : (editItem ? "ОБНОВИТЬ ОБЪЕКТ" : "ЗАКРЕПИТЬ В АРСЕНАЛЕ")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}