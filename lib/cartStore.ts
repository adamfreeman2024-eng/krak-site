import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartItems: [],
      
      addToCart: (item) => set((state) => {
        // Проверяем, есть ли уже такая пушка в корзине
        const existingItem = state.cartItems.find((i) => i.id === item.id);
        if (existingItem) {
          // Если есть — просто увеличиваем количество
          return {
            cartItems: state.cartItems.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        }
        // Если нет — добавляем новую
        return { cartItems: [...state.cartItems, { ...item, quantity: 1 }] };
      }),

      removeItem: (id) => set((state) => ({
        cartItems: state.cartItems.filter((i) => i.id !== id),
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        cartItems: state.cartItems.map((i) =>
          i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i // Не даем опуститься ниже 1
        ),
      })),

      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: 'krak-cart-storage', // Имя в localStorage
    }
  )
);