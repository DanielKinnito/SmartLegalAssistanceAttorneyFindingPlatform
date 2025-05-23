"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = () => {
      const authFromStorage = localStorage.getItem("isAuthenticated") || sessionStorage.getItem("isAuthenticated")
      const userFromStorage = localStorage.getItem("user") || sessionStorage.getItem("user")

      if (authFromStorage === "true" && userFromStorage) {
        setUser(JSON.parse(userFromStorage))
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  useEffect(() => {
    // Redirect to login if not authenticated and trying to access protected routes
    if (!isLoading) {
      const isAdminRoute = pathname.startsWith("/Admin") && !pathname.includes("/Admin/login")

      if (!isAuthenticated && isAdminRoute) {
        router.push("/Admin/login")
      } else if (isAuthenticated && pathname === "/Admin") {
        router.push("/Admin")
      }
    }
  }, [isAuthenticated, pathname, router, isLoading])

  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    // Mock authentication - in a real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo purposes, accept any login with admin@example.com
    if (email === "admin@example.com") {
      const userData = {
        email,
        name: "Admin User",
        role: "admin",
      }

      // Store auth state in localStorage or sessionStorage based on remember me
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem("isAuthenticated", "true")
      storage.setItem("user", JSON.stringify(userData))

      setUser(userData)
      setIsAuthenticated(true)
      return true
    }

    return false
  }

  const logout = () => {
    localStorage.removeItem("isAuthenticated")
    sessionStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
    sessionStorage.removeItem("user")

    setUser(null)
    setIsAuthenticated(false)
    router.push("/Admin/login")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  )
}
