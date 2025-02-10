import { Product, User } from '@/payload-types'
import { getClientSideURL } from './getURL'
import type { Where } from 'payload'
import { stringify } from 'qs-esm'

export const getCartItems = async (): Promise<CartItem[]> => {
  try {
    const req = await fetch(`${getClientSideURL()}/api/cart`)
    const data = await req.json()
    return data.docs[0].items
  } catch (err) {
    console.log(err)
    return []
  }
}

// export const removeFromCart = async (cartId: string | number, productId: number | Product) => {
//   const cart = await payload.findByID({
//     collection: 'cart',
//     id: cartId,
//   })

//   const updatedItems = cart.items?.filter((item) => item.productId !== productId)

//   const updatedCart = await payload.update({
//     collection: 'cart',
//     id: cartId,
//     data: { items: updatedItems },
//   })

//   return updatedCart
// }

export const updateCartItems = async (updatedItems: CartItem[]) => {
  const meUserReq = await fetch(`${getClientSideURL()}/api/users/me`)
  const { user }: { user: User } = await meUserReq.json()
  //   console.log(user)
  const query: Where = {
    user: {
      equals: user.id,
    },
  }

  const stringifiedQuery = stringify(
    {
      where: query, // ensure that `qs-esm` adds the `where` property, too!
      limit: 1,
    },
    { addQueryPrefix: true },
  )

  try {
    await fetch(`${getClientSideURL()}/api/cart${stringifiedQuery}`, {
      method: 'PATCH',
      //   credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: updatedItems,
      }),
    })
    // const cart = await req.json()

    // console.log(cart.docs)
  } catch (err) {
    console.log(err)
  }
}

// export const clearCart = async () => {
//   await payload.delete({
//     collection: 'cart',
//     id: 0,
//   })
// }

export type CartItem = {
  product: Product
  quantity: number
}
