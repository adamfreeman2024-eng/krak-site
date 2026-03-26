import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    
    // Берем пароль из .env (или ставим запасной KrakAdmin777!)
    const truePassword = process.env.ADMIN_PASSWORD || "KrakAdmin777!";

    if (password === truePassword) {
      // Ждем, пока браузер подготовит куки (вот он, спасительный await!)
      const cookieStore = await cookies();
      
      // Выдаем секретную печать в браузер на 7 дней
      cookieStore.set('krak_admin_session', 'access_granted', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 дней
        path: '/',
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'В ДОСТУПЕ ОТКАЗАНО' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'ОШИБКА СЕРВЕРА' }, { status: 500 });
  }
}