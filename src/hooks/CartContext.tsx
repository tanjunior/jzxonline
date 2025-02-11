'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product } from '@/payload-types'
import { CartItem, getCartItems, updateCartItems } from '../utilities/cart'

type CartContextType = {
  cartItems: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (product: Product) => Promise<void>
  updateQuantity: (product: Product, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCartItems = async () => {
      setIsLoading(true)
      const items = await getCartItems()
      // console.log(items)
      setCartItems(items)
      setIsLoading(false)
    }
    fetchCartItems()
  }, [])

  const addToCart = async (product: Product) => {
    setIsLoading(true)
    const itemExist = cartItems.find((item) => item.product.id == product.id)
    let updatedItems: CartItem[] = []
    if (itemExist) {
      updatedItems = cartItems.map((item) => {
        if (item.product.id == product.id) item.quantity += 1
        return item
      })
    } else {
      updatedItems = [...cartItems, { product, quantity: 1 }]
    }
    // console.log('cartItems', cartItems)
    updateCartItems(updatedItems)
    setCartItems(updatedItems)
    setIsLoading(false)
  }

  const removeFromCart = async (product: Product) => {
    setIsLoading(true)
    const updatedItems = cartItems.filter((item) => item.product.id !== product.id)
    setCartItems(updatedItems)
    updateCartItems(updatedItems)
    setIsLoading(false)
  }

  const updateQuantity = async (product: Product, quantity: number) => {
    setIsLoading(true)
    const itemIndex = cartItems.findIndex((item) => item.product.id == product.id)
    const updatedItems = [...cartItems]
    updatedItems[itemIndex] = { product, quantity }
    setCartItems(updatedItems)
    updateCartItems(updatedItems)
    setIsLoading(false)
  }

  const clearAllCart = async () => {
    setIsLoading(true)
    setCartItems([])
    updateCartItems([])
    setIsLoading(false)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart: clearAllCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
