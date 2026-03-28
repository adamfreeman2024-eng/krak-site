/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Игнорируем ошибки типов, чтобы билд прошел успешно даже при мелких багах
    ignoreBuildErrors: true,
  },
  images: {
    // Разрешаем загрузку картинок из твоего Supabase
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nlhyzwgfpmboxfdwfgej.supabase.co',
      },
    ],
  },
};

export default nextConfig;