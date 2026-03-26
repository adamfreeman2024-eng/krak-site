import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, phone } = await req.json();

    // Твои данные бота (проверь их в .env, если они там есть)
    const botToken = process.env.TELEGRAM_BOT_TOKEN || "8687540184:AAGEJj14R-LAXLdin7kHfkhhBKIzs2KUqzk";
    const chatId = process.env.TELEGRAM_CHAT_ID || "429384890";

    const message = `
🚨 **НОВАЯ ЗАЯВКА: СОЮЗ EGER** 🚨
━━━━━━━━━━━━━━━━━━
👤 **ИМЯ:** ${name}
📞 **ТЕЛЕФОН:** ${phone}
━━━━━━━━━━━━━━━━━━
⚡️ *Проверьте статус кандидата в базе.*
    `;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (res.ok) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Ошибка отправки в TG' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}