import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      {/* Боковое меню админки */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col gap-6">
        <div className="text-xl font-bold tracking-wider text-zinc-300">
          KRAK <span className="text-red-500 text-sm">ADMIN</span>
        </div>
        <nav className="flex flex-col gap-3">
          <Link href="/admin" className="text-zinc-400 hover:text-white transition-colors">
            Дашборд
          </Link>
          <Link href="/admin/products" className="text-zinc-400 hover:text-white transition-colors">
            Товары
          </Link>
          <Link href="/admin/categories" className="text-zinc-400 hover:text-white transition-colors">
            Категории
          </Link>
          {/* НОВАЯ КНОПКА УПРАВЛЕНИЯ БРЕНДАМИ */}
          <Link href="/admin/brands" className="text-zinc-400 hover:text-white transition-colors">
            Бренды
          </Link>
          <Link href="/admin/orders" className="text-zinc-400 hover:text-white transition-colors">
            Заказы
          </Link>
          
          <div className="mt-8 pt-8 border-t border-zinc-800">
            <Link href="/" className="text-zinc-500 hover:text-white transition-colors text-sm flex items-center gap-2">
              &larr; Вернуться в магазин
            </Link>
          </div>
        </nav>
      </aside>

      {/* Основной контент админки */}
      <main className="flex-1 p-10 overflow-y-auto bg-zinc-900">
        {children}
      </main>
    </div>
  );
}