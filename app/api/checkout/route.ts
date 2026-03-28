import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, items, total, discount } = body;

    // Получаем ключи из безопасных настроек Vercel
    const TOKEN = process.env.TELEGRAM_BOT_TOKEN; 
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // Проверка наличия конфигурации
    if (!TOKEN || !CHAT_ID) {
      console.error("Ошибка сервера: Переменные окружения не настроены");
      return NextResponse.json({ error: 'Ошибка конфигурации сервера' }, { status: 500 });
    }

    // Формируем текст сообщения для Telegram
    let message = `🚀 **НОВЫЙ ЗАКАЗ KRAK.AM**\n\n`;
    message += `👤 КЛИЕНТ: ${name}\n`;
    message += `📞 ТЕЛЕФОН: ${phone}\n\n`;
    message += `📦 АРСЕНАЛ:\n`;

    items.forEach((item: any) => {
      message += `• ${item.name} — x${item.quantity}\n`;
    });

    if (discount > 0) {
      message += `\n🎁 СКИДКА: -${discount}%\n`;
    }
    
    message += `\n💰 ИТОГО К ОПЛАТЕ: ${total} ֏`;

    // Отправляем запрос в Telegram API
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: CHAT_ID, 
        text: message, 
        parse_mode: 'Markdown' 
      }),
    });

    const responseData = await res.json();

    // Если Telegram вернул ошибку
    if (!res.ok) {
      console.error("Telegram API Error:", responseData);
      return NextResponse.json({ error: 'Ошибка отправки в Telegram' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Critical Server Error:", error.message);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}