import prisma from "@/lib/prisma";

const dictionary: Record<string, { ru: string; en: string }> = {
  "ՍԱԻԳԱ": { ru: "Сайга", en: "Saiga" },
  "ԱԿՈՍԱՓՈՂ": { ru: "Нарезное", en: "Rifled" },
  "ԶԵՆՔ": { ru: "Оружие", en: "Weapon" },
  "ՓԱМՓՈՒՇՏ": { ru: "Патрон", en: "Ammo" },
  "ԴԱՆԱԿ": { ru: "Нож", en: "Knife" },
  "ԿԱՐԱԲԻՆ": { ru: "Карабин", en: "Carbine" },
  "ՈՐՍՈՐԴԱԿԱՆ": { ru: "Охотничий", en: "Hunting" }
};

async function translateAll() {
  console.log("🌍 ОПЕРАЦИЯ «ВАВИЛОН»: ПЕРЕВОДИМ ВЕСЬ KRAK...");

  // Берем все товары из базы
  const products = await (prisma.product as any).findMany();

  for (const p of products) {
    let nameRu = p.nameAm || "";
    let nameEn = p.nameAm || "";

    // Если в названии есть армянские буквы — переводим
    if (/[\u0530-\u058F]/.test(nameRu)) {
      Object.entries(dictionary).forEach(([am, trans]) => {
        const regex = new RegExp(am, 'gi');
        nameRu = nameRu.replace(regex, trans.ru);
        nameEn = nameEn.replace(regex, trans.en);
      });

      // Чистим латиницу, если она осталась (например Саига -> Сайга)
      nameRu = nameRu.replace(/SAIGA/gi, "Сайга");

      console.log(`📝 [${p.nameAm}] -> RU: ${nameRu}`);

      await (prisma.product as any).update({
        where: { id: p.id },
        data: {
          nameRu: nameRu,
          nameEn: nameEn,
          descriptionRu: `Высококачественное оборудование ${nameRu} доступно в магазине KRAK. Профессиональный подход к каждому клиенту в Ереване.`,
          descriptionEn: `High-quality ${nameEn} equipment available at KRAK. Professional approach to every client in Yerevan, Armenia.`,
          descriptionAm: `Բարձրորակ ${p.nameAm} սարքավորումներ KRAK խանութում: Մասնագիտացված մոտեցում յուրաքանչյուր հաճախորդին:`,
          seoTitle: `${nameRu} купить в Ереване | KRAK.am`,
          seoDescription: `Заказать ${nameRu} по лучшей цене в Армении. Оружейный магазин KRAK - профессиональное снаряжение и аксессуары.`,
          isActive: true
        }
      });
    }
  }

  console.log("🏁 ГЛОБАЛЬНЫЙ ПЕРЕВОД ЗАВЕРШЕН!");
}

translateAll()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error("❌ ОШИБКА:", e);
    await prisma.$disconnect();
    process.exit(1);
  });