"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface ShoppingCartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined)

export function ShoppingCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (item: CartItem) => {
    setItems((prev) => [...prev, item])
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return <ShoppingCartContext.Provider value={{ items, addItem, removeItem }}>{children}</ShoppingCartContext.Provider>
}

export function useShoppingCart() {
  const context = useContext(ShoppingCartContext)
  if (context === undefined) {
    throw new Error("useShoppingCart must be used within a ShoppingCartProvider")
  }
  return context
}
