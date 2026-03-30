import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Достаем все активные категории
    const categories = await prisma.category.findMany({
      where: { isActive: true },
    });

    // Достаем все активные товары ВМЕСТЕ С БРЕНДОМ И КАТЕГОРИЕЙ
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        brand: true // <--- ВОТ ЭТА СТРОЧКА ВКЛЮЧИТ ФИЛЬТРЫ В КАТАЛОГЕ
      }
    });

    return NextResponse.json({ categories, products });
  } catch (error) {
    console.error("Ошибка выгрузки каталога:", error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}