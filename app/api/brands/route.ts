import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// Эту функцию вызывает Главная страница, чтобы показать бегущую строку
export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка загрузки брендов' }, { status: 500 });
  }
}

// Эту функцию будет вызывать твоя Админка, чтобы добавить новый бренд
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, logoUrl } = body;

    const newBrand = await prisma.brand.create({
      data: { 
        name: name.toUpperCase(), 
        logoUrl 
      }
    });
    
    return NextResponse.json(newBrand);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка создания бренда' }, { status: 500 });
  }
}

// Добавь это в самый низ файла app/api/brands/route.ts
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.brand.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 });
  }
}