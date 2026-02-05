import { create } from 'zustand'
import { Role, User } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (role: Role, name?: string) => void
  logout: () => void
}

const roleNames: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  VALET: 'Valet',
}

const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem('valet_user')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Invalid JSON, clear it
    localStorage.removeItem('valet_user')
  }
  return null
}

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  isAuthenticated: !!getStoredUser(),

  login: (role: Role, name?: string) => {
    const user: User = {
      id: Date.now().toString(),
      name: name || roleNames[role],
      role,
    }
    localStorage.setItem('valet_user', JSON.stringify(user))
    set({ user, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('valet_user')
    set({ user: null, isAuthenticated: false })
  },
}))

// Helper to check if user has access to a route
export const hasAccess = (user: User | null, path: string): boolean => {
  if (!user) return false
  
  const { ROLE_PERMISSIONS } = require('../types')
  const allowedPaths = ROLE_PERMISSIONS[user.role] || []
  return allowedPaths.includes(path)
}
