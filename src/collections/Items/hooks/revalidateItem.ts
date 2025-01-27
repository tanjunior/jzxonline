import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Item } from '../../../payload-types'

export const revalidateItem: CollectionAfterChangeHook<Item> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/items/${doc.slug}`

      payload.logger.info(`Revalidating item at path: ${path}`)

      revalidatePath(path)
      revalidateTag('items-sitemap')
    }

    // If the item was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/items/${previousDoc.slug}`

      payload.logger.info(`Revalidating old item at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('items-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Item> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/items/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('items-sitemap')
  }

  return doc
}
