import prisma from "@/lib/prisma";
import AdminContent from "./AdminContent";
export const dynamic = 'force-dynamic';
export default async function ProductsAdminPage() {
  // 1. Загружаем товары сразу с их категориями и брендами
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { 
      category: true,
      brand: true 
    }
  });

  // 2. Загружаем категории для выпадающего списка
  const categories = await prisma.category.findMany({
    orderBy: { nameRu: 'asc' }
  });

  // 3. Загружаем бренды (Glock, Sako и т.д.) для выпадающего списка
  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="p-4 md:p-10 bg-black min-h-screen">
      {/* Передаем бренды в клиентский компонент AdminContent */}
      <AdminContent 
        initialProducts={products} 
        categories={categories} 
        brands={brands} 
      />
    </div>
  );
}