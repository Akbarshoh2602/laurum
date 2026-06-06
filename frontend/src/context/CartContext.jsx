import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import client, { unwrap } from '../api/client'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

const EMPTY = { items: [], grandTotal: 0, totalItems: 0 }

export function CartProvider({ children }) {
  const { isAuthenticated, isAdmin } = useAuth()
  const [cart, setCart] = useState(EMPTY)
  const [loading, setLoading] = useState(false)

  const canUseCart = isAuthenticated && !isAdmin

  const refresh = useCallback(async () => {
    if (!canUseCart) {
      setCart(EMPTY)
      return
    }
    setLoading(true)
    try {
      const res = await client.get('/cart')
      setCart(unwrap(res) || EMPTY)
    } catch {
      setCart(EMPTY)
    } finally {
      setLoading(false)
    }
  }, [canUseCart])

  useEffect(() => {
    refresh()
  }, [refresh])

  const add = async (productId, quantity = 1) => {
    const res = await client.post('/cart/items', { productId, quantity })
    setCart(unwrap(res))
  }

  const updateQty = async (productId, quantity) => {
    const res = await client.put(`/cart/items/${productId}?quantity=${quantity}`)
    setCart(unwrap(res))
  }

  const remove = async (productId) => {
    const res = await client.delete(`/cart/items/${productId}`)
    setCart(unwrap(res))
  }

  const clear = async () => {
    await client.delete('/cart')
    setCart(EMPTY)
  }

  return (
    <CartContext.Provider value={{ cart, loading, refresh, add, updateQty, remove, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
