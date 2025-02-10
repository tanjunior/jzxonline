import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Cart: CollectionConfig = {
  slug: 'cart',
  access: {
    // admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  // admin: {
  //   defaultColumns: ['user'],
  //   useAsTitle: 'user',
  // },
  // auth: true,
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          defaultValue: 1,
        },
      ],
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
  ],
  // hooks: {
  //   beforeChange: [
  //     async ({ data, operation, req }) => {
  //       // Check if the user is authenticated
  //       if (req.user) {
  //         // Set the user field to the current user's ID
  //         data.user = req.user.id
  //       } else {
  //         throw new Error('User must be logged in to perform this operation.')
  //       }
  //       return data
  //     },
  //   ],
  //   beforeRead: [
  //     async ({ req }) => {
  //       // Automatically filter cart items by the current user
  //       if (req.user) {
  //         return {
  //           where: {
  //             user: {
  //               equals: req.user.id,
  //             },
  //           },
  //         }
  //       }
  //       return {}
  //     },
  //   ],
  // },
}
