import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Получаем данные из формы
    const body = await req.json();
    const { name, phone, brand, model, budget, message, images } = body;

    // 2. Достаем ключи Telegram из Hostinger (.env)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("ОШИБКА: Нет токенов Telegram в .env");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // 3. Формируем красивое тактическое сообщение
    let text = `🚨 <b>НОВЫЙ СПЕЦЗАКАЗ (KRAK.AM)</b> 🚨\n\n`;
    text += `👤 <b>Позывной:</b> ${name}\n`;
    text += `📞 <b>Связь:</b> ${phone}\n`;
    text += `🏢 <b>Бренд:</b> ${brand}\n`;
    text += `🔫 <b>Модель:</b> ${model}\n`;
    text += `💰 <b>Бюджет:</b> ${budget}\n`;
    
    if (message) {
      text += `📝 <b>Детали:</b> ${message}\n`;
    }

    if (images && images.length > 0) {
      text += `\n📸 <b>Прикрепленные файлы:</b>\n`;
      images.forEach((url: string, index: number) => {
        text += `<a href="${url}">👉 Открыть фото ${index + 1}</a>\n`;
      });
    }

    // 4. Отправляем запрос прямо в API Telegram
    const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: false, // Чтобы фотки подгружались превьюшкой
      }),
    });

    if (!response.ok) {
       const errRes = await response.text();
       console.error("ОШИБКА TELEGRAM:", errRes);
       return NextResponse.json({ error: "Failed to send to Telegram" }, { status: 500 });
    }

    // 5. Возвращаем успешный ответ на сайт
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("ОШИБКА API СПЕЦЗАКАЗА:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}