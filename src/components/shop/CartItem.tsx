// components/CartItem.tsx
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import type { CartItem as CartItemType } from "@/stores/useCartStore";
import Image from "next/image";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, updateItemQuantity, isLoading } = useCart();

  return (
    <div className="flex items-center justify-between border-b p-4">
      <div className="flex items-center space-x-4">
        {item.image && (
          <Image
            src={item.image}
            alt={item.name}
            objectFit="cover"
            width={64}
            height={64}
          />
        )}
        <div>
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-gray-500">${item.price}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateItemQuantity(item.id, Math.max(1, item.quantity - 1))
            }
            disabled={isLoading}
          >
            -
          </Button>
          <span>{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
            disabled={isLoading}
          >
            +
          </Button>
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => removeItem(item.id)}
          disabled={isLoading}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
