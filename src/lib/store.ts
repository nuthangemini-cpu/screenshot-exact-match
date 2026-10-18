import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;
  qty: number;
  customization?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  payment: "Razorpay" | "COD";
  name: string;
  status: "Processing" | "Shipped" | "Delivered";
}

interface ShopState {
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  addToCart: (item: Omit<CartItem, "key" | "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clearCart: () => void;
  toggleWish: (id: string) => void;
  placeOrder: (o: Omit<Order, "id" | "date" | "status">) => Order;
}

export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      orders: [],
      addToCart: (item, qty = 1) =>
        set((s) => {
          const key = `${item.productId}-${item.size}-${item.color}-${item.customization ?? ""}`;
          const existing = s.cart.find((c) => c.key === key);
          if (existing) return { cart: s.cart.map((c) => (c.key === key ? { ...c, qty: c.qty + qty } : c)) };
          return { cart: [...s.cart, { ...item, key, qty }] };
        }),
      setQty: (key, qty) => set((s) => ({ cart: s.cart.map((c) => (c.key === key ? { ...c, qty: Math.max(1, qty) } : c)) })),
      remove: (key) => set((s) => ({ cart: s.cart.filter((c) => c.key !== key) })),
      clearCart: () => set({ cart: [] }),
      toggleWish: (id) => set((s) => ({ wishlist: s.wishlist.includes(id) ? s.wishlist.filter((w) => w !== id) : [...s.wishlist, id] })),
      placeOrder: (o) => {
        const order: Order = { ...o, id: "#DW" + Date.now().toString().slice(-8), date: new Date().toISOString(), status: "Processing" };
        set({ orders: [order, ...get().orders], cart: [] });
        return order;
      },
    }),
    { name: "dripwear-shop" },
  ),
);

export const cartCount = (c: CartItem[]) => c.reduce((n, i) => n + i.qty, 0);
export const cartSubtotal = (c: CartItem[]) => c.reduce((n, i) => n + i.qty * i.price, 0);
