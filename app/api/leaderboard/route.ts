import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

// 1. ПОЛУЧЕНИЕ ТАБЛИЦЫ (Нужно для fetchTop)
export async function GET() {
  try {
    const leaders = await prisma.leaderboard.findMany({
      orderBy: [
        { score: 'desc' },
        { cashback: 'desc' }
      ],
      take: 100,
    });
    // Если в базе пусто, вернем пустой массив, чтобы не было ошибки JSON
    return NextResponse.json(leaders || []);
  } catch (error) {
    console.error("Ошибка GET:", error);
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 });
  }
}

// 2. СОХРАНЕНИЕ РЕЗУЛЬТАТА И ПРОМОКОДА
export async function POST(req: Request) {
  try {
    const { name, score, cashback, promoCode } = await req.json();
    
    // Сохраняем в таблицу лидеров
    const newEntry = await prisma.leaderboard.create({
      data: {
        name: name,
        score: Number(score),
        cashback: Number(cashback)
      }
    });

    // Регистрируем промокод в базе магазина
    if (promoCode && cashback > 0) {
      await prisma.promoCode.create({
        data: {
          code: promoCode.toUpperCase().trim(),
          discount: Number(cashback),
          isActive: true
        }
      });
    }

    return NextResponse.json(newEntry);
  } catch (error) {
    console.error("Ошибка POST:", error);
    return NextResponse.json({ error: 'Ошибка сохранения' }, { status: 500 });
  }
}