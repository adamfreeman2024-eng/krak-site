import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, items, total, discount } = body;

    // ТЕПЕРЬ МЫ БЕРЕМ ДАННЫЕ ИЗ БЕЗОПАСНОГО ХРАНИЛИЩА
    const TOKEN = process.env.TELEGRAM_BOT_TOKEN; 
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // Проверка конфигурации (поможет при отладке на Vercel)
    if (!TOKEN || !CHAT_ID) {
      console.error("Критическая ошибка: Секреты Telegram не настроены в Environment Variables!");
      return NextResponse.json({ error: 'Ошибка конфигурации сервера' }, { status: 500 });
    }

    let message = `🚀 **НОВЫЙ ЗАКАЗ KRAK.AM**\n\n`;
    message += `👤 **КЛИЕНТ:** ${name}\n`;
    message += `📞 **ТЕЛЕФОН:** ${phone}\n\n`;
    message += `📦 **АРСЕНАЛ:**\n`;

    items.forEach((item: any) => {
      const itemName = item.nameRu || item.nameAm || item.nameEn || item.name || "Товар";
      message += `• ${itemName} — x${item.quantity}\n`;
    });

    if (discount && discount > 0) {
      message += `\n🎁 **ПРИМЕНЕН ТРОФЕЙНЫЙ КОД: -${discount}%**\n`;
    }

    message += `\n💰 **ИТОГО К ОПЛАТЕ: ${Number(total).toLocaleString()} ֏**`;

    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Ошибка Telegram API:", errorData);
      return NextResponse.json({ error: 'Ошибка Telegram' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Внутренняя ошибка API:", error.message);
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 });
  }
}