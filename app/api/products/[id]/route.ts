import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Указываем, что это Promise
) {
  try {
    // 1. Ждем получения ID из параметров (новое правило Next.js)
    const resolvedParams = await params;
    const productId = resolvedParams.id;

    if (!productId) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    // 2. Ищем товар в базе
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true }
    });
    
    // 3. Если не нашли по ID, на всякий случай ищем по SLUG
    if (!product) {
      const productBySlug = await prisma.product.findUnique({
        where: { slug: productId },
        include: { category: true }
      });

      if (!productBySlug) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(productBySlug);
    }
    
    return NextResponse.json(product);

  } catch (error) {
    console.error("API DATABASE ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}