import { Product } from '@/payload-types'
import ProductItem from './ProductItem'

export type ViewMode = 'grid' | 'list'

type ProductListProps = {
  products: Product[]
  view: ViewMode
}

export default function ProductList({ products, view }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">No products found</h2>
        <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
      </div>
    )
  }

  return (
    <div
      className={
        view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'
      }
    >
      {products.map((product) => (
        <ProductItem key={product.id} product={product} view={view} />
      ))}
    </div>
  )
}
