import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: string;
  title: string;
  category: string;
  pricePerYard: number;
  img: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWhatsAppCartOpen: boolean;
  setIsWhatsAppCartOpen: (open: boolean) => void;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
  triggerToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWhatsAppCartOpen, setIsWhatsAppCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { user, token } = useAuth();

  const triggerToast = (msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, 4000);
  };

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Load from localStorage & sync from database on mount or change
  useEffect(() => {
    const key = user ? `yolanda_cart_${user.id}` : "yolanda_cart_guest";
    const saved = localStorage.getItem(key);
    let loadedItems: CartItem[] = [];

    if (saved) {
      try {
        loadedItems = JSON.parse(saved);
      } catch (e) {
        console.error("Error loading cart", e);
      }
    }

    const syncWithDatabase = async () => {
      if (user && token) {
        try {
          // Fetch cart from backend Supabase
          const res = await fetch(`${API_BASE}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success && data.items) {
            // Translate database items into frontend CartItems
            const dbItems: CartItem[] = data.items.map((dbItem: any) => ({
              id: dbItem.product_id,
              title: dbItem.products?.name || "Bespoke Fabric",
              category: dbItem.products?.fabric_type || "Italian Silk Base",
              pricePerYard: Number(dbItem.products?.price_per_yard) || 35000,
              img: dbItem.products?.product_images?.[0]?.url || "/model-dress1.png",
              quantity: Number(dbItem.yards) || 1
            }));

            // Merge guest cart items into DB loaded items
            const merged = [...dbItems];
            let hasLocalAdditions = false;

            loadedItems.forEach((localItem) => {
              const existing = merged.find((i) => i.id === localItem.id);
              if (existing) {
                if (existing.quantity !== localItem.quantity) {
                  existing.quantity = localItem.quantity;
                  hasLocalAdditions = true;
                }
              } else {
                merged.push(localItem);
                hasLocalAdditions = true;
              }
            });

            // Write local additions to the database
            if (hasLocalAdditions) {
              for (const item of merged) {
                await fetch(`${API_BASE}/api/cart`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify({ product_id: item.id, yards: item.quantity })
                });
              }
            }

            // Clear guest storage cart
            localStorage.removeItem("yolanda_cart_guest");

            setCartItems(merged);
            localStorage.setItem(key, JSON.stringify(merged));
            return;
          }
        } catch (e) {
          console.error("Failed to sync database cart:", e);
        }
      }
      setCartItems(loadedItems);
    };

    syncWithDatabase();
  }, [user, token]);

  // Save to localStorage on change
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    const key = user ? `yolanda_cart_${user.id}` : "yolanda_cart_guest";
    localStorage.setItem(key, JSON.stringify(items));
  };

  const addToCart = async (item: Omit<CartItem, "quantity">) => {
    const existing = cartItems.find((i) => i.id === item.id);
    let updatedItems: CartItem[] = [];
    let newQuantity = 1;

    if (existing) {
      newQuantity = existing.quantity + 1;
      updatedItems = cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity: newQuantity } : i
      );
    } else {
      updatedItems = [...cartItems, { ...item, quantity: 1 }];
    }

    saveCart(updatedItems);
    triggerToast(`Added ${item.title} to your collection successfully!`); // Premium feedback toast instead of auto-opening drawer!

    // Background Database Sync
    if (user && token) {
      try {
        await fetch(`${API_BASE}/api/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ product_id: item.id, yards: newQuantity })
        });
      } catch (e) {
        console.error("Error syncing add-to-cart:", e);
      }
    }
  };

  const removeFromCart = async (id: string) => {
    saveCart(cartItems.filter((i) => i.id !== id));

    // Background Database Sync
    if (user && token) {
      try {
        await fetch(`${API_BASE}/api/cart/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        console.error("Error syncing remove-from-cart:", e);
      }
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      saveCart(cartItems.map((i) => (i.id === id ? { ...i, quantity } : i)));

      // Background Database Sync
      if (user && token) {
        try {
          await fetch(`${API_BASE}/api/cart/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ yards: quantity })
          });
        } catch (e) {
          console.error("Error syncing update-quantity:", e);
        }
      }
    }
  };

  const clearCart = async () => {
    saveCart([]);

    // Background Database Sync
    if (user && token) {
      try {
        await fetch(`${API_BASE}/api/cart`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        console.error("Error syncing clear-cart:", e);
      }
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.pricePerYard * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        isWhatsAppCartOpen,
        setIsWhatsAppCartOpen,
        toastMessage,
        setToastMessage,
        triggerToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
