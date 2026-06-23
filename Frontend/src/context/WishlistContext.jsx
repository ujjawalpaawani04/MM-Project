/* eslint-disable react-refresh/only-export-components -- provider + its hook are intentionally co-located */
import { createContext, useContext, useCallback, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useLocalStorage("mm-wishlist", []);

  const isInWishlist = useCallback(
    (id) => items.some((i) => i.id === id),
    [items]
  );

  const addItem = useCallback(
    (product) => {
      setItems((prev) => {
        if (prev.some((i) => i.id === product.id)) return prev;
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
            rating: product.rating,
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

  /** Toggle and return the resulting state (true = now in wishlist). */
  const toggle = useCallback(
    (product) => {
      const added = !items.some((i) => i.id === product.id);
      if (added) addItem(product);
      else removeItem(product.id);
      return added;
    },
    [items, addItem, removeItem]
  );

  const clear = useCallback(() => setItems([]), [setItems]);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      isInWishlist,
      addItem,
      removeItem,
      toggle,
      clear,
    }),
    [items, isInWishlist, addItem, removeItem, toggle, clear]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
