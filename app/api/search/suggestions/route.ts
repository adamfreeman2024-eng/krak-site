import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) return NextResponse.json([]);

  try {
    const suggestions = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { nameRu: { contains: query, mode: 'insensitive' } },
          { nameAm: { contains: query, mode: 'insensitive' } },
          { nameEn: { contains: query, mode: 'insensitive' } },
        ]
      },
      select: {
        id: true,
        nameRu: true,
        price: true,
        images: true,
      },
      take: 6 // Показываем максимум 6 подсказок
    });

    return NextResponse.json(suggestions);
  } catch (e) {
    return NextResponse.json([]);
  }
}