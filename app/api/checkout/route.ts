import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, items, total, discount } = body;

    const TOKEN = "8687540184:AAGEJj14R-LAXLdin7kHfkhhBKIzs2KUqzk"; 
    const CHAT_ID = "429384890";

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

    if (!res.ok) return NextResponse.json({ error: 'Ошибка Telegram' }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 });
  }
}