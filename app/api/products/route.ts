import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Достаем все активные категории
    const categories = await prisma.category.findMany({
      where: { isActive: true },
    });

    // Достаем все активные товары
    const products = await prisma.product.findMany({
      where: { isActive: true },
    });

    return NextResponse.json({ categories, products });
  } catch (error) {
    console.error("Ошибка выгрузки каталога:", error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}