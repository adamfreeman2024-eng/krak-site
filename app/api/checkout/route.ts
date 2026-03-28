import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, items, total, discount } = body;

    const TOKEN = process.env.TELEGRAM_BOT_TOKEN; 
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // --- БЛОК ОТЛАДКИ (Поможет нам найти ошибку в логах) ---
    console.log("DEBUG: Token exists:", !!TOKEN);
    console.log("DEBUG: Token length:", TOKEN?.length);
    console.log("DEBUG: Token starts with:", TOKEN?.substring(0, 5));
    console.log("DEBUG: Chat ID:", CHAT_ID);
    // ------------------------------------------------------

    if (!TOKEN || !CHAT_ID) {
      return NextResponse.json({ error: 'Конфигурация не найдена' }, { status: 500 });
    }

    let message = `🚀 **НОВЫЙ ЗАКАЗ KRAK.AM**\n\n👤 КЛИЕНТ: ${name}\n📞 ТЕЛЕФОН: ${phone}\n\n📦 АРСЕНАЛ:\n`;
    items.forEach((item: any) => {
      message += `• ${item.name} — x${item.quantity}\n`;
    });
    if (discount > 0) message += `\n🎁 СКИДКА: -${discount}%\n`;
    message += `\n💰 ИТОГО: ${total} ֏`;

    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'Markdown' }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      console.error("TELEGRAM ERROR:", responseData); // Это покажет точную причину ошибки в логах
      return NextResponse.json({ error: 'Telegram Error', details: responseData }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("SERVER ERROR:", error.message);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}