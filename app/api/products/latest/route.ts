import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET() {
  const latestProducts = await prisma.product.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(latestProducts);
}