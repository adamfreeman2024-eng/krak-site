import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, brand, model, budget, message, images } = body;

    // ТВОИ КЛЮЧИ ТЕЛЕГРАМ
    const TOKEN = "8687540184:AAGEJj14R-LAXLdin7kHfkhhBKIzs2KUqzk"; 
    const CHAT_ID = "429384890";

    // Формируем красивое сообщение
    let text = `🚨 **СПЕЦЗАКАЗ KRAK** 🚨\n\n`;
    text += `👤 **Клиент:** ${name}\n`;
    text += `📞 **Телефон:** ${phone}\n\n`;
    text += `🎯 **Бренд:** ${brand}\n`;
    text += `🔫 **Модель:** ${model}\n`;
    text += `💰 **Бюджет:** ${budget}\n\n`;
    
    if (message) text += `📝 **Детали:** ${message}\n\n`;

    if (images && images.length > 0) {
      text += `📸 **ФОТО (СКОПИРУЙ ССЫЛКУ ИЛИ НАЖМИ):**\n`;
      images.forEach((img: string, i: number) => {
        text += `${i + 1}. [ОТКРЫТЬ ФОТО](${img})\n`;
      });
    }

    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'Markdown',
        disable_web_page_preview: false // Чтобы в телеграме сразу открывалось превью картинки
      })
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Ошибка отправки в Telegram' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Критическая ошибка:", error.message);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}