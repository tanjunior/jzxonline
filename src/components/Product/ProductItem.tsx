// import Image from 'next/image'
import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '@/hooks/CartContext'
import { Product } from '@/payload-types'
import { ViewMode } from './ProductList'
import { Media } from '../Media'

const productItemVariants = cva('', {
  variants: {
    view: {
      grid: 'overflow-hidden flex flex-col h-full',
      list: 'flex items-center w-full h-24',
    },
  },
  defaultVariants: {
    view: 'grid',
  },
})

const imageVariants = cva('', {
  variants: {
    view: {
      grid: 'aspect-square relative w-full h-48',
      list: 'w-24 h-24 relative flex-shrink-0',
    },
  },
  defaultVariants: {
    view: 'grid',
  },
})

const contentVariants = cva('', {
  variants: {
    view: {
      grid: 'p-4 flex-grow flex flex-col',
      list: 'flex-grow flex flex-row items-center justify-between p-4',
    },
  },
  defaultVariants: {
    view: 'grid',
  },
})

interface ProductItemProps extends VariantProps<typeof productItemVariants> {
  product: Product
  view: ViewMode
}

export default function ProductItem({ product, view }: ProductItemProps) {
  const { addToCart, cartItems } = useCart()
  const cartItem = cartItems.find((item) => item.product.id === product.id)

  return (
    <Card className={productItemVariants({ view })}>
      <Link
        href={`/products/${product.slug}`}
        className={view === 'grid' ? 'flex flex-col h-full' : 'flex items-center w-full h-full'}
      >
        <div className={imageVariants({ view })}>
          {/* <Image src={product.imageUrl || "/placeholder.svg"} alt={product.name} fill className="object-cover" /> */}
          <Media resource={product.meta!.image!} fill imgClassName="object-cover p-[1px]" />
        </div>
        <CardContent className={contentVariants({ view })}>
          <div className={view === 'grid' ? '' : 'flex-grow mr-4'}>
            <h2
              className={
                view === 'grid'
                  ? 'text-lg font-semibold mb-2 line-clamp-1'
                  : 'text-base font-semibold mb-0.5 line-clamp-1'
              }
            >
              {product.title}
            </h2>
            <p
              className={`text-sm text-muted-foreground ${
                view === 'grid' ? 'mb-2 line-clamp-2' : 'mb-0.5 line-clamp-1'
              }`}
            >
              {product.title}
            </p>
            <div className="flex flex-wrap gap-1 mb-2">
              <Badge variant="secondary" className="text-xs">
                {product.categories && product.categories[0]?.toString()}
              </Badge>
              {/* <Badge variant="outline" className="text-xs">
                {product.subCategory}
              </Badge> */}
            </div>
          </div>
          {view === 'grid' && (
            <div className="flex justify-between items-center mt-auto">
              <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
              <Button
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  addToCart(product)
                }}
              >
                {cartItem ? `Add (${cartItem.quantity})` : 'Add'}
              </Button>
            </div>
          )}
          {view === 'list' && (
            <div className="flex items-center space-x-2">
              <p className="text-base font-bold text-primary">${product.price.toFixed(2)}</p>
              <Button
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  addToCart(product)
                }}
              >
                {cartItem ? `Add (${cartItem.quantity})` : 'Add'}
              </Button>
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  )
}
