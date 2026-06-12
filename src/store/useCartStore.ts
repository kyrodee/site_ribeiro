import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProdutoSqlServer } from '@/lib/db-sqlserver';

export interface CartItem {
  produto: ProdutoSqlServer;
  quantidade: number;
}

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  addItem: (produto: ProdutoSqlServer, quantidade?: number) => void;
  removeItem: (produtoId: string) => void;
  updateQuantity: (produtoId: string, quantidade: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      setDrawerOpen: (open) => set({ isDrawerOpen: open }),
      
      addItem: (produto, quantidade = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.produto.id === produto.id);
          const newItems = existingItem
            ? state.items.map(item => 
                item.produto.id === produto.id 
                  ? { ...item, quantidade: item.quantidade + quantidade }
                  : item
              )
            : [...state.items, { produto, quantidade }];
          return { 
            items: newItems,
            isDrawerOpen: true
          };
        });
      },
      
      removeItem: (produtoId) => {
        set((state) => ({
          items: state.items.filter(item => item.produto.id !== produtoId)
        }));
      },
      
      updateQuantity: (produtoId, quantidade) => {
        set((state) => ({
          items: state.items.map(item => 
            item.produto.id === produtoId 
              ? { ...item, quantidade: Math.max(1, quantidade) }
              : item
          )
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantidade, 0),
    }),
    {
      name: 'ribeiro-cart-storage',
    }
  )
);
