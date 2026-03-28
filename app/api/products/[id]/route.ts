import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Получаем параметр (это может быть как длинный ID, так и красивый SLUG)
    const resolvedParams = await params;
    const identifier = resolvedParams.id;

    if (!identifier) {
      return NextResponse.json({ error: "No identifier provided" }, { status: 400 });
    }

    // 2. Ищем товар одним мощным запросом (Сразу по ID ИЛИ по SLUG)
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier }
        ]
      },
      include: { 
        category: true,
        brand: true // На будущее, чтобы всегда знать производителя
      }
    });

    // 3. Если ничего не нашли
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    // 4. Отдаем готовый товар на клиент
    return NextResponse.json(product);

  } catch (error) {
    console.error("API DATABASE ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}