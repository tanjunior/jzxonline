import type { Metadata } from 'next/types'

import { getPayload } from 'payload'
import { Suspense } from 'react'
import PageClient from './page.client'
import configPromise from '@payload-config'
import { Skeleton } from '@/components/ui/skeleton'
import ProductsClient from '@/components/Product'

export const dynamic = 'force-static'
export const revalidate = 30

export default async function ProductsPage() {
  const payload = await getPayload({ config: configPromise })
  const [products, categories] = await Promise.all([
    payload.find({
      collection: 'products',
      // depth: 1,
      // limit: 12,
      // overrideAccess: false,
    }),
    payload.find({
      collection: 'categories',
      // depth: 1,
      // limit: 12,
      // overrideAccess: false,
    }),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <PageClient />
      <h1 className="text-3xl font-bold mb-8 text-center">Shop</h1>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductsClient initialProducts={products.docs} categories={categories.docs} />
      </Suspense>
    </div>
  )
}

function ProductListSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-12 w-full max-w-sm" />
      <div className="flex flex-col md:flex-row gap-8">
        <Skeleton className="w-full md:w-64 h-[600px]" />
        <div className="flex-grow space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-20" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[300px] w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Products`,
  }
}
