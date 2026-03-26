"use server"

import prisma from "./prisma"
import { revalidatePath } from "next/cache"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  "https://nlhyzwgfpmboxfdwfgej.supabase.co", 
  "sb_publishable_HzIe3NihAMZzYGTxMAUtQg_rt8ySbgm" 
)

// --- ТОВАРЫ ---

export async function createProduct(formData: FormData) {
    try {
      // 1. Получаем все файлы из поля "images" (в форме должно быть name="images")
      const files = formData.getAll("images") as File[];
      let imageUrls: string[] = [];

      // 2. Загружаем каждый файл по очереди
      for (const file of files) {
        if (file && file.size > 0 && file.name !== 'undefined') {
          const fileName = `${Date.now()}-${file.name}`;
          const { error } = await supabase.storage.from('product-images').upload(fileName, file);
          
          if (!error) {
            const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
            imageUrls.push(publicUrl);
          }
        }
      }

      const nameEn = formData.get("nameEn") as string || "";
      const slug = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

      await prisma.product.create({
        data: {
          slug: slug,
          sku: formData.get("sku") as string || null,
          nameAm: (formData.get("nameAm") as string) || "",
          nameRu: (formData.get("nameRu") as string) || "",
          nameEn: nameEn,
          descriptionRu: (formData.get("descRu") as string) || "",
          descriptionAm: (formData.get("descAm") as string) || "",
          descriptionEn: (formData.get("descEn") as string) || "",
          seoTitle: formData.get("seoTitle") as string || null,
          seoDescription: formData.get("seoDescription") as string || null,
          seoKeywords: formData.get("seoKeywords") as string || null,
          price: Number(formData.get("price")) || 0,
          stockQuantity: Number(formData.get("stock")) || 0,
          categoryId: formData.get("categoryId") as string,
          brandId: formData.get("brandId") === "none" ? null : (formData.get("brandId") as string),
          
          // Сохраняем массив ссылок
          images: imageUrls, 
          
          requiresLicense: formData.get("requiresLicense") === "on",
          isFeatured: formData.get("isFeatured") === "on",
          isActive: true,
        }
      });
      
      revalidatePath("/admin/products");
      revalidatePath("/catalog");
    } catch (error) { console.error("Ошибка при создании товара:", error); }
}

export async function updateProduct(formData: FormData) {
    const id = formData.get("id") as string;
    try {
      const files = formData.getAll("images") as File[];
      let newImageUrls: string[] = [];

      // Загружаем новые файлы, если они есть
      for (const file of files) {
        if (file && file.size > 0 && file.name !== 'undefined') {
          const fileName = `${Date.now()}-${file.name}`;
          const { error } = await supabase.storage.from('product-images').upload(fileName, file);
          if (!error) {
            const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
            newImageUrls.push(publicUrl);
          }
        }
      }
      
      const current = await prisma.product.findUnique({ where: { id } });

      await prisma.product.update({
        where: { id },
        data: {
          sku: formData.get("sku") as string || current?.sku,
          nameRu: formData.get("nameRu") as string,
          nameAm: formData.get("nameAm") as string,
          nameEn: formData.get("nameEn") as string,
          descriptionRu: formData.get("descRu") as string,
          descriptionAm: formData.get("descAm") as string,
          descriptionEn: formData.get("descEn") as string,
          seoTitle: formData.get("seoTitle") as string,
          seoDescription: formData.get("seoDescription") as string,
          seoKeywords: formData.get("seoKeywords") as string,
          price: Number(formData.get("price")),
          stockQuantity: Number(formData.get("stock")),
          categoryId: (formData.get("categoryId") as string) || current?.categoryId,
          brandId: formData.get("brandId") === "none" ? null : (formData.get("brandId") as string),
          
          // Если загружены новые фото — заменяем старые, если нет — оставляем текущие
          images: newImageUrls.length > 0 ? newImageUrls : current?.images,
          
          requiresLicense: formData.get("requiresLicense") === "on",
          isFeatured: formData.get("isFeatured") === "on",
        }
      });
      
      revalidatePath("/admin/products");
      revalidatePath("/catalog");
    } catch (error) { console.error("Ошибка при обновлении товара:", error); }
}

export async function deleteProduct(formData: FormData) {
    const id = formData.get("id") as string;
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
}

// --- КАТЕГОРИИ ---

export async function createCategory(formData: FormData) {
  const nameRu = formData.get("nameRu") as string;
  const nameAm = formData.get("nameAm") as string;
  const nameEn = formData.get("nameEn") as string;
  const pId = formData.get("parentId") as string;
  const parentId = pId === "none" ? null : pId;

  await prisma.category.create({
    data: { 
        nameRu, 
        nameAm, 
        nameEn, 
        parentId,
        slug: nameRu.toLowerCase().replace(/[^а-яa-z0-9]+/g, '-') + '-' + Date.now()
    }
  });
  revalidatePath("/admin/categories");
}

export async function updateCategory(formData: FormData) {
  const id = formData.get("id") as string;
  const nameRu = formData.get("nameRu") as string;
  const nameAm = formData.get("nameAm") as string;
  const nameEn = formData.get("nameEn") as string;
  const pId = formData.get("parentId") as string;
  const parentId = pId === "none" ? null : pId;

  await prisma.category.update({
    where: { id },
    data: { nameRu, nameAm, nameEn, parentId }
  });
  revalidatePath("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  const id = formData.get("id") as string;
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
  } catch (error) {
    console.error("Ошибка при удалении категории:", error);
  }
}

// --- ЗАКАЗЫ ---

export async function createOrder(orderData: any) {
  try {
    const order = await prisma.order.create({
      data: {
        orderNumber: `KRAK-${Math.floor(10000 + Math.random() * 90000)}`,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        totalAmount: Number(orderData.totalAmount),
        status: "PENDING",
        items: {
          create: orderData.items.map((item: any) => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            priceAtTime: Number(item.price)
          })),
        },
      },
    });
    revalidatePath("/admin/orders");
    return { success: true, orderId: order.id };
  } catch (error) { return { success: false }; }
}