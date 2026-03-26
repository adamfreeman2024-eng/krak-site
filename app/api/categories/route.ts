import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET() {
  const cats = await prisma.category.findMany();
  return NextResponse.json(cats);
}