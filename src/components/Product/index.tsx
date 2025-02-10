'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Category, Product } from '@/payload-types'
import { filterProducts, Filters, SortOption, sortProducts } from '@/utilities/product'
import ProductList, { ViewMode } from './ProductList'
import SearchBar from './SearchBar'
import SortDropdown from './SortDropdown'
import ViewToggle from './ViewToggle'
import FilterSection from './FilterSection'

type ProductsClientProps = {
  initialProducts: Product[]
  categories: Category[]
}

export default function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const searchParams = useSearchParams()
  const [filteredProducts, setFilteredProducts] = useState(initialProducts)
  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get('search') || '',
    categories: searchParams.get('categories')?.split(',') || [],
    subCategories: searchParams.get('subCategories')?.split(',') || [],
    priceRange: [
      Number(searchParams.get('minPrice')) || 0,
      Number(searchParams.get('maxPrice')) || 100,
    ],
  })
  const [sort, setSort] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'name')
  const [view, setView] = useState<ViewMode>((searchParams.get('view') as ViewMode) || 'grid')

  useEffect(() => {
    const filtered = filterProducts(initialProducts, filters)
    const sorted = sortProducts(filtered, sort)
    setFilteredProducts(sorted)
  }, [initialProducts, filters, sort])

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }))
  }

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      categories: [],
      subCategories: [],
      priceRange: [0, 100],
    })
  }

  const maxPrice = Math.max(...initialProducts.map((product) => product.price))

  return (
    <div>
      <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="w-full lg:w-1/2 xl:w-1/3">
          <SearchBar value={filters.search} onChange={handleSearch} />
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <SortDropdown value={sort} onChange={setSort} />
          <ViewToggle value={view} onChange={setView} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <FilterSection
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            maxPrice={maxPrice}
          />
        </aside>
        <main className="flex-grow">
          <ProductList products={filteredProducts} view={view} />
        </main>
      </div>
    </div>
  )
}
