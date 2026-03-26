import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    
    // Ищем код в таблице PromoCode
    const promo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase().trim() }
    });

    if (!promo || !promo.isActive) {
      return NextResponse.json({ error: 'Код не найден' }, { status: 404 });
    }

    return NextResponse.json({ discount: promo.discount });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}