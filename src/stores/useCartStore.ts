// stores/useCartStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  description: string;
  quantity: number;
}

interface CartState {
  // State
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
  lastSynced: Date | null;

  // Actions
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: number) => void;
  updateItemQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  syncWithDatabase: () => Promise<void>;
  loadCartFromDatabase: () => Promise<void>;
  setError: (error: string | null) => void;
  mergeLocalAndServerCarts: () => Promise<void>;
}

// Helper function to calculate cart totals
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  return { totalItems, totalPrice };
};

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      totalItems: 0,
      totalPrice: 0,
      isLoading: false,
      error: null,
      lastSynced: null,

      // Add item with optimistic update
      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find((i) => i.id === item.id);
        const quantity = item.quantity ?? 1;

        // Update local state first (optimistic update)
        let updatedItems: CartItem[];
        if (existingItem) {
          updatedItems = items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i,
          );
        } else {
          const newItem: CartItem = {
            ...item,
            quantity,
          };
          updatedItems = [...items, newItem];
        }

        const { totalItems, totalPrice } = calculateTotals(updatedItems);
        set({
          items: updatedItems,
          totalItems,
          totalPrice,
        });

        // We'll handle the server sync in a React component using the hooks
      },

      // Remove item with optimistic update
      removeItem: (productId) => {
        const { items } = get();
        const itemToRemove = items.find((i) => i.id === productId);

        if (itemToRemove) {
          // Update local state first (optimistic update)
          const updatedItems = items.filter((i) => i.id !== productId);
          const { totalItems, totalPrice } = calculateTotals(updatedItems);

          set({
            items: updatedItems,
            totalItems,
            totalPrice,
          });

          // Server sync will be handled in a React component
        }
      },

      // Update item quantity with optimistic update
      updateItemQuantity: (productId, quantity) => {
        const { items } = get();
        const item = items.find((i) => i.id === productId);

        if (item) {
          // Update local state first (optimistic update)
          const updatedItems = items.map((i) =>
            i.id === productId ? { ...i, quantity } : i,
          );

          const { totalItems, totalPrice } = calculateTotals(updatedItems);

          set({
            items: updatedItems,
            totalItems,
            totalPrice,
          });

          // Server sync will be handled in a React component
        }
      },

      // Clear cart
      clearCart: () => {
        // Update local state first (optimistic update)
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });

        // Server sync will be handled in a React component
      },

      // Load cart from database
      loadCartFromDatabase: async () => {
        try {
          set({ isLoading: true });

          // This needs to be called from a React component
          // For now, we'll just mark it as not implemented in the store
          set({
            isLoading: false,
            error: "This method needs to be called from a React component",
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : "Failed to load cart",
          });
        }
      },

      // Sync entire cart with database
      syncWithDatabase: async () => {
        try {
          set({ isLoading: true });

          // This needs to be called from a React component
          // For now, we'll just mark it as not implemented in the store
          set({
            isLoading: false,
            error: "This method needs to be called from a React component",
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : "Failed to sync cart",
          });
        }
      },

      // Merge local cart with server cart
      mergeLocalAndServerCarts: async () => {
        try {
          set({ isLoading: true });

          // This needs to be called from a React component
          // For now, we'll just mark it as not implemented in the store
          set({
            isLoading: false,
            error: "This method needs to be called from a React component",
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : "Failed to merge carts",
          });
        }
      },

      // Set error state
      setError: (error) => {
        set({ error });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage), // Use createJSONStorage instead of getStorage
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
        lastSynced: state.lastSynced,
      }),
    },
  ),
);

export default useCartStore;
