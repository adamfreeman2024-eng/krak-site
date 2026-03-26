"use client"
import { useCart } from "@/lib/cartStore";
import { useState } from "react";

export default function AddToCartBtn({ product }: any) {
  const addItem = useCart((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    // Через 2 секунды возвращаем текст кнопки обратно
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleAdd}
      className={`w-full font-black py-5 uppercase italic text-xl transition-all duration-300 shadow-[0_0_30px_rgba(220,38,38,0.2)] active:scale-95 ${
        added ? "bg-white text-black" : "bg-red-600 text-white hover:bg-white hover:text-black"
      }`}
    >
      {added ? "ДОБАВЛЕНО В АРСЕНАЛ ✓" : "В КОРЗИНУ"}
    </button>
  );
}