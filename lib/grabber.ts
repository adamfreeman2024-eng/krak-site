import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const TARGET_CATEGORY_ID = "cmmsa40dd0004e1uc83kmcsbk";

const rawData = [
  {
    "name": "Benelli Lupo HPR",
    "price": 1450000,
    // Используем прямую ссылку на изображение через сервис-прокси или проверенный источник
    "image": "https://www.benelli.it/sites/default/files/styles/gun_top/public/2023-03/LUPO_BE_S.T._HPR_0.png",
    "description": "<b>КАЛИБР:</b> 308 WIN / 6.5 CREEDMOOR<br><b>ДЛИНА СТВОЛА:</b> 610 MM<br><b>КУЧНОСТЬ:</b> SUB-MOA<br>Первая болтовая винтовка Benelli с шасси. Идеальна для стрельбы на дальние дистанции."
  },
  {
    "name": "CZ TSR 308 Win",
    "price": 2800000,
    "image": "https://www.czub.cz/media/cache/7a/9a/7a9a1a3648197779f3900222f7902996.png",
    "description": "<b>КАЛИБР:</b> 308 WIN<br><b>ВЕС:</b> 6.3 КГ<br>Высокоточная тактическая винтовка. Складывающийся приклад, регулируемый спуск."
  }
];

async function fixImport() {
  console.log("🛠️ ПЕРЕЗАГРУЗКА ЭЛИТНОГО АРСЕНАЛА...");

  for (const p of rawData) {
    try {
      // Сначала удалим старую версию без картинки, чтобы не было дублей
      await (prisma.product as any).deleteMany({ where: { nameRu: p.name } });

      const uniqueSlug = `gun-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;

      await (prisma.product as any).create({
        data: {
          slug: uniqueSlug,
          nameRu: p.name,
          nameAm: p.name, 
          nameEn: p.name,
          descriptionRu: p.description,
          descriptionAm: p.description, 
          descriptionEn: p.description,
          price: p.price,
          stockQuantity: 5,
          categoryId: TARGET_CATEGORY_ID,
          images: [p.image],
          requiresLicense: true,
          isActive: true
        }
      });
      console.log(`✅ ИСПРАВЛЕНО: ${p.name}`);
    } catch (err: any) {
      console.error(`❌ Ошибка: ${err.message}`);
    }
  }
}

fixImport().then(() => prisma.$disconnect());