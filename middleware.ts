import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Проверяем, если человек пытается зайти в любой раздел /admin...
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // Ищем секретную печать (cookie), которую мы выдаем при логине
    const session = request.cookies.get('krak_admin_session');
    
    // Если печати нет - грубо выкидываем на страницу логина
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Если печать есть или это обычная страница сайта - пропускаем
  return NextResponse.next();
}

// Указываем Next.js, за какими путями должен следить этот стражник
export const config = {
  matcher: '/admin/:path*',
}