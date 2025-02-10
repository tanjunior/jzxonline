'use client'

import { ShoppingCart } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useCart } from '@/hooks/CartContext'
// import Image from 'next/image'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

export function CartSheet() {
  const [isOpen, setIsOpen] = useState(false)
  const { cartItems, removeFromCart, updateQuantity, isLoading } = useCart()

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(true)}>
          <ShoppingCart className="h-6 w-6" />
          <span className="sr-only">Open cart</span>
          {totalItems > 0 && (
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {totalItems}
            </div>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
        </SheetHeader>
        {isLoading ? (
          <div className="mt-8 space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : cartItems.length === 0 ? (
          <p className="text-center text-muted-foreground mt-8">Your cart is empty</p>
        ) : (
          <div className="mt-8 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex items-center space-x-4">
                {/* <Image
                  src={item.product.imageUrl || '/placeholder.svg'}
                  alt={item.product.name}
                  width={50}
                  height={50}
                  className="rounded"
                /> */}
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
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeFromCart(item.product.id as unknown as string)}
                >
                  ×
                </Button>
              </div>
            ))}
            <div className="border-t pt-4">
              <p className="font-semibold">Total: ${totalPrice.toFixed(2)}</p>
            </div>
            <Button className="w-full" asChild>
              <Link href="/cart" onClick={() => setIsOpen(false)}>
                View Cart
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
