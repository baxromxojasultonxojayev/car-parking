'use client'

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { ConfigProvider, theme as antdThemeContext } from 'antd'
import { useThemeStore } from './store/themeStore'
import { useEffect } from 'react'
import { ProtectedRoute } from './components/ProtectedRoute'

// Auth pages
import { Login } from './pages/auth/Login'

// App pages
import { Dashboard } from './pages/dashboard/Dashboard'
import { Locations } from './pages/locations/Locations'
import { Floors } from './pages/floors/Floors'
import { Boxes } from './pages/boxes/Boxes'
import { Tickets } from './pages/tickets/Tickets'
import { Memberships } from './pages/memberships/Memberships'
import { Sessions } from './pages/sessions/Sessions'
import { Requests } from './pages/requests/Requests'
import { Payments } from './pages/payments/Payments'

const router = createBrowserRouter(
  [
    { path: '/login', element: <Login /> },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: '/locations',
      element: (
        <ProtectedRoute>
          <Locations />
        </ProtectedRoute>
      ),
    },
    {
      path: '/floors',
      element: (
        <ProtectedRoute>
          <Floors />
        </ProtectedRoute>
      ),
    },
    {
      path: '/boxes',
      element: (
        <ProtectedRoute>
          <Boxes />
        </ProtectedRoute>
      ),
    },
    {
      path: '/tickets',
      element: (
        <ProtectedRoute>
          <Tickets />
        </ProtectedRoute>
      ),
    },
    {
      path: '/memberships',
      element: (
        <ProtectedRoute>
          <Memberships />
        </ProtectedRoute>
      ),
    },
    {
      path: '/sessions',
      element: (
        <ProtectedRoute>
          <Sessions />
        </ProtectedRoute>
      ),
    },
    {
      path: '/requests',
      element: (
        <ProtectedRoute>
          <Requests />
        </ProtectedRoute>
      ),
    },
    {
      path: '/payments',
      element: (
        <ProtectedRoute>
          <Payments />
        </ProtectedRoute>
      ),
    },
    { path: '/', element: <Navigate to="/dashboard" replace /> },
    { path: '*', element: <Navigate to="/dashboard" replace /> },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
)

function App() {
  const { theme } = useThemeStore()
  const { defaultAlgorithm, darkAlgorithm } = antdThemeContext

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const antdTheme = {
    token: {
      colorPrimary: '#667eea',
      borderRadius: 10,
    },
    algorithm: theme === 'dark' ? darkAlgorithm : defaultAlgorithm,
  }

  return (
    <ConfigProvider theme={antdTheme}>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </ConfigProvider>
  )
}

export default App
