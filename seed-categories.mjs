import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Начинаю установку структуры категорий...");

  // 1. Создаем главную категорию: ОРУЖИЕ
  const weapon = await prisma.category.upsert({
    where: { slug: 'weapon' },
    update: {},
    create: {
      slug: 'weapon',
      nameRu: 'Оружие',
      nameAm: 'Զենք',
      nameEn: 'Weapon',
    },
  });

  // 2. Создаем ПОДКАТЕГОРИИ для Оружия
  const subWeapons = [
    { slug: 'smoothbore', ru: 'Гладкоствольное', am: 'ՈՂՈՐԿԱՓՈՂ ԶԵՆՔԵՐ', en: 'Smoothbore' },
    { slug: 'rifled', ru: 'Нарезное', am: 'ԱԿՈՍԱՓՈՂ ԶԵՆՔԵՐ', en: 'Rifled Weapon' },
    { slug: 'pistols', ru: 'Пистолеты', am: 'ԱՏՐՃԱՆԱԿՆԵՐ', en: 'Pistols' },
    { slug: 'air-rifles', ru: 'Пневматическое', am: 'ՕԴԱՄՂԻՉ ԶԵՆՔԵՐ', en: 'Air Rifles' },
    { slug: 'gas-weapon', ru: 'Газовое', am: 'ԳԱԶԱՅԻՆ ԶԵՆՔԵՐ', en: 'Gas Weapon' },
    { slug: 'commission', ru: 'Комиссионное', am: 'ԿՈՄԻՍԻՈՆ ԶԵՆՔԵՐ', en: 'Commission' },
  ];

  for (const sub of subWeapons) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: { parentId: weapon.id },
      create: {
        slug: sub.slug,
        nameRu: sub.ru,
        nameAm: sub.am,
        nameEn: sub.en,
        parentId: weapon.id
      },
    });
  }

  // 3. Создаем другие главные разделы
  const otherCats = [
    { slug: 'knives', ru: 'Ножи', am: 'Դանակներ', en: 'Knives' },
    { slug: 'ammo', ru: 'Патроны', am: 'Փամփուշտներ', en: 'Ammo' },
    { slug: 'optics', ru: 'Оптика', am: 'Օպտիկա', en: 'Optics' },
    { slug: 'clothing', ru: 'Одежда', am: 'Հանդերձանք', en: 'Clothing' },
  ];

  for (const cat of otherCats) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        slug: cat.slug,
        nameRu: cat.ru,
        nameAm: cat.am,
        nameEn: cat.en,
      },
    });
  }

  console.log("✅ Все категории и подкатегории успешно созданы!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });