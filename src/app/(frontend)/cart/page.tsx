'use client'

import { useCart } from '@/hooks/CartContext'
import { Button } from '@/components/ui/button'
// import Image from 'next/image'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { Media } from '@/components/Media'

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, isLoading } = useCart()

  const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>
        <div className="space-y-8">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>
        <div className="text-center">
          <p className="text-xl mb-4">Your cart is currently empty.</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>
      <div className="space-y-8">
        {cartItems.map((item) => (
          <div key={item.product.id} className="flex items-center space-x-4 border-b pb-4">
            {/* <Image
              src={item.product.imageUrl || "/placeholder.svg"}
              alt={item.product.name}
              width={100}
              height={100}
              className="rounded"
            /> */}
            <Media resource={item.product.heroImage!} imgClassName="rounded" />
            <div className="flex-grow">
              <h3 className="font-semibold">{item.product.title}</h3>
              <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateQuantity(item.product, item.quantity - 1)}
              >
                -
              </Button>
              <span>{item.quantity}</span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateQuantity(item.product, item.quantity + 1)}
              >
                +
              </Button>
            </div>
            <Button size="icon" variant="ghost" onClick={() => removeFromCart(item.product)}>
              ×
            </Button>
          </div>
        ))}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={clearCart}>
            Clear Cart
          </Button>
          <p className="font-semibold text-xl">Total: ${totalPrice.toFixed(2)}</p>
        </div>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
          <Button asChild>
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
