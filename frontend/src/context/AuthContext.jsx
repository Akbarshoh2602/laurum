import { createContext, useContext, useEffect, useState } from 'react'
import client, { unwrap } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('aurum_token')
    const stored = localStorage.getItem('aurum_user')
    if (token && stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('aurum_user')
      }
    }
    setLoading(false)
  }, [])

  const persist = (auth) => {
    localStorage.setItem('aurum_token', auth.token)
    localStorage.setItem('aurum_user', JSON.stringify(auth.user))
    setUser(auth.user)
  }

  const login = async (loginValue, password) => {
    const res = await client.post('/auth/login', { login: loginValue, password })
    const auth = unwrap(res)
    persist(auth)
    return auth.user
  }

  const register = async (form) => {
    const res = await client.post('/auth/register', form)
    const auth = unwrap(res)
    persist(auth)
    return auth.user
  }

  const logout = () => {
    localStorage.removeItem('aurum_token')
    localStorage.removeItem('aurum_user')
    setUser(null)
  }

  const updateUser = (u) => {
    setUser(u)
    localStorage.setItem('aurum_user', JSON.stringify(u))
  }

  const isAdmin = user?.role === 'ADMIN'
  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser, isAdmin, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
