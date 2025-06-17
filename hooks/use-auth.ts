"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { namelessAPI, type NamelessUser } from "@/lib/nameless-api"

interface AuthContextType {
  user: NamelessUser | null
  token: string | null
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function useAuthProvider() {
  const [user, setUser] = useState<NamelessUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedToken = localStorage.getItem("nameless-token")
    const savedUser = localStorage.getItem("nameless-user")

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))

      // Validate token with API
      namelessAPI.validateUser(savedToken).then((response) => {
        if (response.success && response.data) {
          setUser(response.data)
        } else {
          // Token invalid, clear session
          localStorage.removeItem("nameless-token")
          localStorage.removeItem("nameless-user")
          setToken(null)
          setUser(null)
        }
        setIsLoading(false)
      })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (username: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await namelessAPI.login(username, password)

      if (response.success && response.data) {
        const { user: userData, token: userToken } = response.data
        setUser(userData)

        if (userToken) {
          setToken(userToken)
          localStorage.setItem("nameless-token", userToken)
        }

        localStorage.setItem("nameless-user", JSON.stringify(userData))
        return { success: true }
      } else {
        return { success: false, error: response.error || "Login failed" }
      }
    } catch (error) {
      return { success: false, error: "Network error occurred" }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await namelessAPI.register(username, email, password)

      if (response.success) {
        return { success: true }
      } else {
        return { success: false, error: response.error || "Registration failed" }
      }
    } catch (error) {
      return { success: false, error: "Network error occurred" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("nameless-token")
    localStorage.removeItem("nameless-user")
  }

  return {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
  }
}

export { AuthContext }
