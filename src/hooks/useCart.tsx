// hooks/useCart.tsx
import { useEffect } from "react";
import { api } from "@/trpc/react";
import useCartStore, { type CartItem } from "@/stores/useCartStore";

export function useCart() {
  // Get all the state and actions from the cart store
  const {
    items,
    totalItems,
    totalPrice,
    error,
    isLoading: storeLoading,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    setError,
  } = useCartStore();

  // Get tRPC mutations
  const addItemMutation = api.cart.addItem.useMutation();
  const removeItemMutation = api.cart.removeItem.useMutation();
  const updateItemQuantityMutation = api.cart.updateItemQuantity.useMutation();
  const clearCartMutation = api.cart.clearCart.useMutation();
  const utils = api.useUtils();

  // Server-side loading state
  const isServerLoading =
    addItemMutation.isPending ||
    removeItemMutation.isPending ||
    updateItemQuantityMutation.isPending ||
    clearCartMutation.isPending;

  // Combined loading state
  const isLoading = storeLoading || isServerLoading;

  // Load cart from database
  const loadCartFromDatabase = async () => {
    try {
      useCartStore.setState({ isLoading: true });
      const result = await utils.cart.getCart.fetch();

      // Clear existing cart and add server items
      clearCart();

      // Update local store with server data
      result.items.forEach((item) => {
        addItem({
          ...item,
          quantity: item.quantity,
        });
      });

      useCartStore.setState({
        lastSynced: new Date(),
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load cart");
      useCartStore.setState({ isLoading: false });
    }
  };

  // Add item with server sync
  const addItemWithSync = async (item: CartItem) => {
    // First update local state (optimistic update)
    addItem(item);

    // Then sync with server
    try {
      await addItemMutation.mutateAsync({
        productId: item.id,
        quantity: item.quantity ?? 1,
      });
      useCartStore.setState({ lastSynced: new Date() });
      void utils.cart.getCart.invalidate();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to add item to cart",
      );
    }
  };

  // Remove item with server sync
  const removeItemWithSync = async (productId: number) => {
    // First update local state (optimistic update)
    removeItem(productId);

    // Then sync with server
    try {
      await removeItemMutation.mutateAsync({
        productId,
      });
      useCartStore.setState({ lastSynced: new Date() });
      void utils.cart.getCart.invalidate();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to remove item from cart",
      );
    }
  };

  // Update item quantity with server sync
  const updateItemQuantityWithSync = async (
    productId: number,
    quantity: number,
  ) => {
    // First update local state (optimistic update)
    updateItemQuantity(productId, quantity);

    // Then sync with server
    try {
      await updateItemQuantityMutation.mutateAsync({
        productId,
        quantity,
      });
      useCartStore.setState({ lastSynced: new Date() });
      void utils.cart.getCart.invalidate();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update item quantity",
      );
    }
  };

  // Clear cart with server sync
  const clearCartWithSync = async () => {
    // First update local state (optimistic update)
    clearCart();

    // Then sync with server
    try {
      await clearCartMutation.mutateAsync();
      useCartStore.setState({ lastSynced: new Date() });
      void utils.cart.getCart.invalidate();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to clear cart");
    }
  };

  // Sync entire cart with database
  const syncWithDatabase = async () => {
    try {
      useCartStore.setState({ isLoading: true });

      // First, clear the server cart
      await clearCartMutation.mutateAsync();

      // Then add each item
      for (const item of items) {
        await addItemMutation.mutateAsync({
          productId: item.id,
          quantity: item.quantity,
        });
      }

      useCartStore.setState({
        lastSynced: new Date(),
        isLoading: false,
        error: null,
      });

      void utils.cart.getCart.invalidate();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to sync cart");
      useCartStore.setState({ isLoading: false });
    }
  };

  // Merge local cart with server cart
  const mergeLocalAndServerCarts = async () => {
    try {
      useCartStore.setState({ isLoading: true });

      // Get server cart
      const serverCart = await utils.cart.getCart.fetch();
      const localItems = [...items];

      // Create a map for easier lookup
      const mergedItems = new Map<number, CartItem>();

      // Add server items to the map
      serverCart.items.forEach((item) => {
        mergedItems.set(item.id, item);
      });

      // Merge local items, adding quantities if item exists
      localItems.forEach((item) => {
        if (mergedItems.has(item.id)) {
          const existingItem: CartItem | undefined = mergedItems.get(item.id);

          if (existingItem)
            mergedItems.set(item.id, {
              ...existingItem,
              quantity: existingItem.quantity + item.quantity,
            });
        } else {
          mergedItems.set(item.id, item);
        }
      });

      // Clear the cart and add merged items
      clearCart();

      // Add each merged item to the local cart
      Array.from(mergedItems.values()).forEach((item: CartItem) => {
        addItem(item);
      });

      // Sync to server
      await syncWithDatabase();

      useCartStore.setState({ isLoading: false });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to merge carts",
      );
      useCartStore.setState({ isLoading: false });
    }
  };

  // Auto-load cart from database on mount (optional)
  useEffect(() => {
    // You could add logic here to auto-load the cart when the component mounts
    // For example, if the user is authenticated
    // loadCartFromDatabase();
  }, []);

  // Return everything from the store plus our enhanced methods
  return {
    // State from the store
    items,
    totalItems,
    totalPrice,
    error,
    isLoading,

    // Enhanced actions with server sync
    addItem: addItemWithSync,
    removeItem: removeItemWithSync,
    updateItemQuantity: updateItemQuantityWithSync,
    clearCart: clearCartWithSync,

    // Additional server sync methods
    loadCartFromDatabase,
    syncWithDatabase,
    mergeLocalAndServerCarts,
  };
}
