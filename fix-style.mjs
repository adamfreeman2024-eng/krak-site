import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Загружаем надежные картинки...");

  const updates = [
    // Главные категории
    { slug: 'weapon', img: 'https://eger.am/images/categories/639/Weapon_2.jpg' },
    { slug: 'knives', img: 'https://eger.am/images/categories/634/Knives_2.jpg' },
    { slug: 'ammo', img: 'https://eger.am/images/categories/635/Ammo_2.jpg' },
    { slug: 'optics', img: 'https://eger.am/images/categories/637/Optics_2.jpg' },
    
    // Подкатегории Оружия (нарезное, гладкое и т.д.)
    { slug: 'rifled', img: 'https://eger.am/images/categories/641/rifled_2.jpg' },
    { slug: 'smoothbore', img: 'https://eger.am/images/categories/640/smoothbore_2.jpg' },
    { slug: 'pistols', img: 'https://eger.am/images/categories/643/pistols_2.jpg' },
    { slug: 'air-rifles', img: 'https://eger.am/images/categories/644/Air_rifles_2.jpg' },
    { slug: 'gas-weapon', img: 'https://eger.am/images/categories/645/Gas_weapon_2.jpg' },
    { slug: 'commission', img: 'https://eger.am/images/categories/646/Commision_weapon_2.jpg' }
  ];

  for (const item of updates) {
    await prisma.category.updateMany({
      where: { slug: item.slug },
      data: { image: item.img }
    });
    console.log(`✅ Картинка для ${item.slug} готова`);
  }

  // Чистим главную (parentId = null для основных)
  await prisma.category.updateMany({
    where: { slug: { in: ['weapon', 'knives', 'ammo', 'optics', 'accessories', 'clothing'] } },
    data: { parentId: null }
  });

  console.log("✨ Магия завершена! Проверяй сайт.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());