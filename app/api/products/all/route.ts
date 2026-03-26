import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const catSlug = searchParams.get("cat") || "";
  const search = searchParams.get("search") || "";
  const minPrice = Number(searchParams.get("min")) || 0;
  const maxPrice = Number(searchParams.get("max")) || 999999999;
  const onlyStock = searchParams.get("stock") === "true";
  
  const dynamicFilters: any[] = [];
  searchParams.forEach((value, key) => {
    if (!["cat", "search", "min", "max", "stock", "t"].includes(key)) {
      dynamicFilters.push({
        attributes: { path: [key], equals: value }
      });
    }
  });

  try {
    const currentCategory = catSlug 
      ? await prisma.category.findUnique({ 
          where: { slug: catSlug }, 
          include: { children: true } 
        }) 
      : null;

    let where: any = {
      price: { gte: minPrice, lte: maxPrice },
      isActive: true,
    };

    if (onlyStock) {
      where.stockQuantity = { gt: 0 };
    }

    if (currentCategory) {
      const categoryIds = [currentCategory.id, ...currentCategory.children.map(c => c.id)];
      where.categoryId = { in: categoryIds };
    }

    if (search) {
      where.OR = [
        { nameRu: { contains: search, mode: 'insensitive' } },
        { nameAm: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (dynamicFilters.length > 0) {
      where.AND = dynamicFilters;
    }

    const products = await prisma.product.findMany({ 
      where, 
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });

    const mainCategories = await prisma.category.findMany({ 
      where: { parentId: null },
      orderBy: { nameRu: 'asc' }
    });

    const allAttributes: any = {};
    const productsInCat = await prisma.product.findMany({
        where: { categoryId: where.categoryId, price: where.price }
    });

    productsInCat.forEach((p: any) => {
      if (p.attributes && typeof p.attributes === 'object') {
        Object.entries(p.attributes).forEach(([key, val]) => {
          if (!allAttributes[key]) allAttributes[key] = new Set();
          if (val) allAttributes[key].add(val);
        });
      }
    });

    const availableFilters = Object.keys(allAttributes).reduce((acc: any, key) => {
      acc[key] = Array.from(allAttributes[key]);
      return acc;
    }, {});

    return NextResponse.json({
      products,
      mainCategories,
      currentCategory,
      availableFilters
    });
  } catch (error) { 
    console.error("API Error:", error);
    return NextResponse.json({ error: "API Error" }, { status: 500 }); 
  }
}