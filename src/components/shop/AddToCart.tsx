// components/AddToCartButton.tsx
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

interface AddToCartButtonProps {
  product: {
    id: number;
    name: string;
    price: number;
    image?: string;
    description: string;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem, isLoading } = useCart();

  const handleAddToCart = () => {
    void addItem({...product, quantity: 1}); // This now handles both local state and server sync
  };

  return (
    <Button onClick={handleAddToCart} disabled={isLoading}>
      {isLoading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
