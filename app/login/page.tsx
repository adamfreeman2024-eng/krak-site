"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // Если пароль подошел, пускаем в командный пункт!
        router.push('/admin');
        router.refresh(); // Обновляем данные
      } else {
        setError("В ДОСТУПЕ ОТКАЗАНО // НЕВЕРНЫЙ КОД");
      }
    } catch (err) {
      setError("ОШИБКА СВЯЗИ С СЕРВЕРОМ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 selection:bg-red-600 selection:text-white font-sans relative overflow-hidden">
      
      {/* Фоновая сетка */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="relative z-10 w-full max-w-md border-t-8 border-red-600 bg-zinc-950 p-10 shadow-2xl">
        <p className="text-red-600 font-mono text-[10px] tracking-[0.4em] uppercase mb-2 animate-pulse">RESTRICTED AREA</p>
        <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter mb-8">СЕКРЕТНЫЙ <br/>ДОСТУП</h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-zinc-500 font-black uppercase text-[10px] tracking-widest mb-2">АВТОРИЗАЦИОННЫЙ КОД</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white px-4 py-4 font-mono text-center tracking-widest outline-none focus:border-red-600 transition-colors"
              autoFocus
            />
          </div>
          
          {error && <p className="text-red-600 text-xs font-black uppercase tracking-widest text-center animate-pulse">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 text-white font-black italic uppercase py-4 tracking-widest hover:bg-white hover:text-black transition-all skew-x-[-5deg]"
          >
            <span className="skew-x-[5deg] block">{loading ? "ПРОВЕРКА..." : "ВОЙТИ В СИСТЕМУ"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}