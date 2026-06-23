/* eslint-disable react-refresh/only-export-components -- provider + its hook are intentionally co-located */
import { createContext, useContext, useMemo, useCallback } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const CartContext = createContext(null);

const MAX_QTY = 10;

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage("mm-cart", []);

  const addItem = useCallback(
    (product, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.id === product.id
              ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + quantity) }
              : i
          );
        }
        // Store only what the cart needs (keeps localStorage small).
        return [
          ...prev,
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            character: product.character,
            quantity: Math.min(MAX_QTY, quantity),
          },
        ];
      });
    },
    [setItems]
  );

  const removeItem = useCallback(
    (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
    [setItems]
  );

  const updateQuantity = useCallback(
    (id, quantity) => {
      const q = Math.max(1, Math.min(MAX_QTY, quantity));
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: q } : i))
      );
    },
    [setItems]
  );

  const increment = useCallback(
    (id) =>
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + 1) }
            : i
        )
      ),
    [setItems]
  );

  const decrement = useCallback(
    (id) =>
      setItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
        )
      ),
    [setItems]
  );

  const clearCart = useCallback(() => setItems([]), [setItems]);

  const isInCart = useCallback(
    (id) => items.some((i) => i.id === id),
    [items]
  );

  const { totalItems, subtotal, savings } = useMemo(() => {
    let totalItems = 0;
    let subtotal = 0;
    let savings = 0;
    for (const i of items) {
      totalItems += i.quantity;
      subtotal += i.price * i.quantity;
      if (i.originalPrice) savings += (i.originalPrice - i.price) * i.quantity;
    }
    return { totalItems, subtotal, savings };
  }, [items]);

  const SHIPPING_THRESHOLD = 1999;
  const shipping = subtotal === 0 || subtotal >= SHIPPING_THRESHOLD ? 0 : 99;
  const total = subtotal + shipping;

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    increment,
    decrement,
    clearCart,
    isInCart,
    totalItems,
    subtotal,
    savings,
    shipping,
    total,
    shippingThreshold: SHIPPING_THRESHOLD,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
