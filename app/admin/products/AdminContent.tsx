"use client"
import { useState } from "react"
import ProductForm from "@/components/ProductForm"
import { deleteProduct } from "@/lib/actions"

// Добавили brands в пропсы
export default function AdminContent({ initialProducts, categories, brands }: any) {
  const [editItem, setEditItem] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex justify-between items-center border-b border-zinc-900 pb-6">
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
          Склад KRAK <span className="text-red-600">[{initialProducts.length}]</span>
        </h2>
        <button 
          onClick={() => {
            setEditItem(null);
            setIsFormOpen(true);
          }}
          className="bg-red-600 hover:bg-white hover:text-black text-white font-black px-6 py-3 uppercase italic text-xs transition-all"
        >
          + Добавить товар
        </button>
      </div>

      {(isFormOpen || editItem) && (
        <ProductForm 
          categories={categories}
          brands={brands} // Передаем список брендов в форму
          editItem={editItem} 
          onClose={() => {
            setEditItem(null);
            setIsFormOpen(false);
          }} 
        />
      )}

      <section className="bg-zinc-950 border border-zinc-900 overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-900/50 text-zinc-500 text-[10px] uppercase font-black italic tracking-widest">
            <tr>
              <th className="p-6">Товар / Статус</th>
              <th className="p-6">Бренд</th>
              <th className="p-6">Категория</th>
              <th className="p-6">Цена</th>
              <th className="p-6 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900 text-sm">
            {initialProducts.map((p: any) => (
              <tr key={p.id} className="hover:bg-zinc-900/50 transition-colors group">
                <td className="p-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-white uppercase tracking-tight">{p.nameRu}</span>
                    <div className="flex flex-wrap gap-2">
                      {p.requiresLicense && (
                        <span className="text-[8px] text-red-600 font-black uppercase italic tracking-widest flex items-center gap-1">
                          🛡️ Лицензия
                        </span>
                      )}
                      {p.isFeatured && (
                        <span className="text-[8px] text-amber-500 font-black uppercase italic tracking-widest flex items-center gap-1">
                          ⭐ Рекомендуемое
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                {/* Новая колонка Бренда */}
                <td className="p-6">
                  <span className="text-zinc-400 font-mono text-xs uppercase font-bold">
                    {p.brand?.name || "—"}
                  </span>
                </td>
                <td className="p-6 text-zinc-500 text-xs uppercase italic">{p.category?.nameRu || "—"}</td>
                <td className="p-6 text-red-600 font-black italic">{Number(p.price).toLocaleString()} ֏</td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-6">
                    <button 
                      onClick={() => {
                        setEditItem(p);
                        setIsFormOpen(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-white hover:text-red-600 text-[10px] font-black uppercase italic tracking-widest transition-colors"
                    >
                      ИЗМЕНИТЬ
                    </button>
                    <form action={deleteProduct} onSubmit={(e) => !confirm("Удалить из арсенала?") && e.preventDefault()}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className="text-zinc-700 hover:text-white text-[10px] font-black uppercase italic transition-colors">
                        УДАЛИТЬ
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}