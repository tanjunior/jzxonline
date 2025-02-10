'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/payload-types'
import { useCart } from '@/hooks/CartContext'
import { Media } from '../Media'

export default function ProductPage({ product }: { product: Product }) {
  const { addToCart, cartItems } = useCart()
  const cartItem = cartItems.find((item) => item.product?.id === product.id)

  if (!product) {
    return <div>Error...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          {/* <Image
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          /> */}
          <Media resource={product.heroImage!} fill imgClassName="object-cover rounded-lg" />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-xl font-semibold text-primary mb-4">${product.price.toFixed(2)}</p>
            <p className="text-gray-600 mb-4">{product.title}</p>
            <div className="flex gap-2 mb-4">
              <Badge variant="secondary">
                {product.categories && product.categories[0]?.toString()}
              </Badge>
              {/* <Badge variant="outline">{product.subCategory}</Badge> */}
            </div>
          </div>
          <Button size="lg" onClick={() => addToCart(product)}>
            {cartItem ? `Add Another (${cartItem.quantity} in cart)` : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  )
}
