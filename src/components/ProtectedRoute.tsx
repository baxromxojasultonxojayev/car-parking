'use client'

import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ROLE_PERMISSIONS, Role } from '../types'
import { AdminLayout } from './layout/AdminLayout'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: Role[]
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuthStore()
  const location = useLocation()

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role-based access
  const userPermissions = ROLE_PERMISSIONS[user.role] || []
  const currentPath = location.pathname

  // If specific roles are required, check them
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  // Check if user has permission for this path
  if (!userPermissions.includes(currentPath)) {
    return <Navigate to="/dashboard" replace />
  }

  return <AdminLayout>{children}</AdminLayout>
}
