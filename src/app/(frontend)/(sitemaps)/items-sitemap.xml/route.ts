import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getItemsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'items',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const sitemap = results.docs
      ? results.docs
          .filter((item) => Boolean(item?.slug))
          .map((item) => ({
            loc: `${SITE_URL}/items/${item?.slug}`,
            lastmod: item.updatedAt || dateFallback,
          }))
      : []

    return sitemap
  },
  ['items-sitemap'],
  {
    tags: ['items-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getItemsSitemap()

  return getServerSideSitemap(sitemap)
}
