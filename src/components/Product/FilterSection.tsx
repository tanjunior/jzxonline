'use client'

import { useCallback } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Category } from '@/payload-types'
import { Filters } from '@/utilities/product'

type FilterSectionProps = {
  categories: Category[]
  filters: Filters
  onFilterChange: (newFilters: Partial<Filters>) => void
  onClearFilters: () => void
  maxPrice: number
}

export default function FilterSection({
  categories,
  filters,
  onFilterChange,
  onClearFilters,
  maxPrice,
}: FilterSectionProps) {
  const handlePriceRangeChange = useCallback(
    (newPriceRange: number[]) => {
      onFilterChange({ priceRange: newPriceRange as [number, number] })
    },
    [onFilterChange],
  )

  const handleCategoryChange = useCallback(
    (category: string) => {
      const newCategories = filters.categories.includes(category)
        ? filters.categories.filter((c) => c !== category)
        : [...filters.categories, category]
      onFilterChange({ categories: newCategories })
    },
    [filters.categories, onFilterChange],
  )

  // const handleSubCategoryChange = useCallback(
  //   (subCategory: string) => {
  //     const newSubCategories = filters.subCategories.includes(subCategory)
  //       ? filters.subCategories.filter((sc) => sc !== subCategory)
  //       : [...filters.subCategories, subCategory]
  //     onFilterChange({ subCategories: newSubCategories })
  //   },
  //   [filters.subCategories, onFilterChange],
  // )

  return (
    <Card className="w-full md:w-64">
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <CardTitle className="text-base">Filters</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          Clear
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Price Range</h3>
          <Slider
            min={0}
            max={maxPrice}
            step={1}
            value={filters.priceRange}
            onValueChange={handlePriceRangeChange}
            className="mb-2"
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>${filters.priceRange[0].toFixed(2)}</span>
            <span>${filters.priceRange[1].toFixed(2)}</span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Categories</h3>
          <Accordion type="multiple" className="w-full">
            {categories.map((category) => (
              <AccordionItem value={category.title} key={category.title}>
                <div className="flex items-center">
                  <Checkbox
                    checked={filters.categories.includes(category.title)}
                    onCheckedChange={() => handleCategoryChange(category.title)}
                    id={`category-${category.title}`}
                    className="mr-2"
                  />
                  <AccordionTrigger className="flex-1 text-sm py-2">
                    <label htmlFor={`category-${category.title}`} className="flex-1 cursor-pointer">
                      {category.title}
                    </label>
                  </AccordionTrigger>
                </div>
                <AccordionContent>
                  {/* <div className="pl-6 space-y-2">
                    {category.map((subCategory) => (
                      <label key={subCategory} className="flex items-center space-x-2">
                        <Checkbox
                          checked={filters.subCategories.includes(subCategory)}
                          onCheckedChange={() => handleSubCategoryChange(subCategory)}
                          id={`subcategory-${subCategory}`}
                        />
                        <span className="text-sm">{subCategory}</span>
                      </label>
                    ))}
                  </div> */}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  )
}
