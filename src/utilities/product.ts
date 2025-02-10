import { Product } from '@/payload-types'

export type Filters = {
  search: string
  categories: string[]
  subCategories: string[]
  priceRange: [number, number]
}

export type SortOption = 'name' | 'price' | 'price-desc'

export function filterProducts(products: Product[], filters: Filters): Product[] {
  return products.filter((product) => {
    const matchesSearch =
      !filters.search || product.title.toLowerCase().includes(filters.search.toLowerCase())
    // product.description.toLowerCase().includes(filters.search.toLowerCase()) ||
    // product.category.toLowerCase().includes(filters.search.toLowerCase()) ||
    // product.subCategory.toLowerCase().includes(filters.search.toLowerCase())

    //   const matchesCategory = filters.categories.length === 0 || filters.categories.includes(product.category)

    //   const matchesSubCategory = filters.subCategories.length === 0 || filters.subCategories.includes(product.subCategory)

    const matchesPriceRange =
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]

    //   return matchesSearch && matchesCategory && matchesSubCategory && matchesPriceRange
    return matchesSearch && matchesPriceRange
  })
}

export function sortProducts(products: Product[], sortOption: SortOption): Product[] {
  return [...products].sort((a, b) => {
    if (sortOption === 'price') {
      return a.price - b.price
    } else if (sortOption === 'price-desc') {
      return b.price - a.price
    } else {
      return a.title.localeCompare(b.title)
    }
  })
}
