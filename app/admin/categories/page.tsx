"use client"

import { useState, useEffect } from "react";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions";

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [editItem, setEditItem] = useState<any>(null); // Состояние для редактирования
  const [loading, setLoading] = useState(true);

  // Функция для загрузки списка категорий
  const loadCategories = async () => {
    try {
      const res = await fetch('/api/categories_list'); // Мы создавали этот роут ранее
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Ошибка загрузки категорий:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const mainCategories = categories.filter(c => !c.parentId);

  if (loading) return <div className="p-10 text-white font-mono animate-pulse">SYNCING_DATABASE...</div>;

  return (
    <div className="p-4 md:p-10 bg-black min-h-screen text-white font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* --- ФОРМА: СОЗДАНИЕ И РЕДАКТИРОВАНИЕ --- */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-950 border border-zinc-900 p-6 sticky top-10 shadow-2xl">
            <h2 className="text-xl font-black uppercase italic mb-6 border-l-4 border-red-600 pl-4">
              {editItem ? "Редактировать" : "Новая категория"}
            </h2>
            
            <form action={async (fd) => {
                if (editItem) {
                  await updateCategory(fd);
                } else {
                  await createCategory(fd);
                }
                setEditItem(null);
                loadCategories(); // Обновляем список без перезагрузки страницы
              }} className="space-y-4">
              
              {/* Скрытое поле ID для редактирования */}
              {editItem && <input type="hidden" name="id" value={editItem.id} />}

              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-black mb-1 block">Название (RU)</label>
                <input name="nameRu" defaultValue={editItem?.nameRu || ""} required className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white outline-none focus:border-red-600 text-xs font-bold" />
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-black mb-1 block">Название (AM)</label>
                <input name="nameAm" defaultValue={editItem?.nameAm || ""} required className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white outline-none focus:border-red-600 text-xs font-bold" />
              </div>

              {/* НОВОЕ ПОЛЕ: ENGLISH */}
              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-black mb-1 block">Название (EN)</label>
                <input name="nameEn" defaultValue={editItem?.nameEn || ""} placeholder="English name..." className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white outline-none focus:border-red-600 text-xs font-bold" />
              </div>
              
              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-black mb-1 block">Родительская категория</label>
                <select name="parentId" key={editItem?.id} defaultValue={editItem?.parentId || "none"} className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white outline-none focus:border-red-600 text-xs font-bold appearance-none">
                  <option value="none">-- ГЛАВНАЯ (НЕТ РОДИТЕЛЯ) --</option>
                  {mainCategories.filter(c => c.id !== editItem?.id).map((c: any) => (
                    <option key={c.id} value={c.id}>{c.nameRu}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button type="submit" className="flex-1 bg-red-600 hover:bg-white hover:text-black text-white font-black py-4 uppercase italic transition-all">
                  {editItem ? "СОХРАНИТЬ" : "СОЗДАТЬ"}
                </button>
                {editItem && (
                  <button 
                    type="button" 
                    onClick={() => setEditItem(null)} 
                    className="bg-zinc-800 px-6 hover:bg-zinc-700 text-white font-black transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* --- СПИСОК КАТЕГОРИЙ С КНОПКАМИ РЕДАКТИРОВАНИЯ --- */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-3xl font-black uppercase italic mb-8 tracking-tighter">Дерево категорий</h2>
          
          {mainCategories.length === 0 && <p className="text-zinc-600 italic">Категории не найдены...</p>}

          {mainCategories.map((main: any) => (
            <div key={main.id} className="mb-6">
              <div className="bg-zinc-900 border-l-4 border-red-600 p-4 flex justify-between items-center group shadow-lg">
                <div className="flex flex-col">
                  <span className="font-black uppercase italic text-sm tracking-wide">{main.nameRu}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">EN: {main.nameEn || "—"} / AM: {main.nameAm}</span>
                </div>
                <div className="flex gap-6">
                  {/* КНОПКА ИЗМЕНИТЬ */}
                  <button 
                    onClick={() => {
                        setEditItem(main);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                  >
                    ИЗМЕНИТЬ
                  </button>
                  <form action={async (fd) => { if(confirm('Удалить категорию?')) { await deleteCategory(fd); loadCategories(); } }}>
                    <input type="hidden" name="id" value={main.id} />
                    <button className="text-zinc-600 hover:text-red-500 text-[10px] font-black uppercase transition-colors">Удалить</button>
                  </form>
                </div>
              </div>

              {/* Подкатегории */}
              <div className="ml-8 mt-3 space-y-2">
                {categories.filter(sub => sub.parentId === main.id).map((sub: any) => (
                  <div key={sub.id} className="bg-zinc-950 border border-zinc-900 p-3 flex justify-between items-center group hover:border-zinc-700 transition-all">
                    <div className="flex flex-col">
                       <span className="text-zinc-300 font-bold uppercase text-xs italic">└ {sub.nameRu}</span>
                       <span className="text-[9px] text-zinc-600 font-mono ml-4">EN: {sub.nameEn || "—"}</span>
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => {
                            setEditItem(sub);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-zinc-500 hover:text-white text-[9px] font-black uppercase transition-colors"
                      >
                        ИЗМЕНИТЬ
                      </button>
                      <form action={async (fd) => { if(confirm('Удалить подкатегорию?')) { await deleteCategory(fd); loadCategories(); } }}>
                        <input type="hidden" name="id" value={sub.id} />
                        <button className="text-zinc-800 hover:text-red-500 text-[9px] font-black uppercase transition-colors">Удалить</button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}