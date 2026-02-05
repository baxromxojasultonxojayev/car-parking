'use client';

import React, { useState, useEffect } from "react"
import { Layout } from 'antd'
import { AppHeader } from './Header'
import { Sidebar } from './Sidebar'
import { useThemeStore } from '../../store/themeStore'
import { useLocation } from 'react-router-dom'

const { Content } = Layout

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { theme } = useThemeStore()
  const location = useLocation()
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Simulate page loading when location changes
  useEffect(() => {
    setIsNavigating(true)
    const timer = setTimeout(() => {
      setIsNavigating(false)
    }, 400) // Brief loading moment
    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <Layout style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Top Loading Bar */}
      {isNavigating && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #667eea, #764ba2, #667eea)',
          backgroundSize: '200% 100%',
          zIndex: 9999,
          animation: 'loading-bar 1.5s infinite linear',
        }} />
      )}
      
      <style>{`
        @keyframes loading-bar {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>

      <AppHeader />
      <Layout>
        <Sidebar />
        <Content
          style={{
            padding: '24px',
            background: theme === 'dark' 
              ? '#06070d'
              : 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
            flex: 1,
            overflowY: 'auto',
            minHeight: 'calc(100vh - 64px)',
            transition: 'background 0.3s ease, opacity 0.3s ease',
            opacity: isNavigating ? 0.6 : 1,
            filter: isNavigating ? 'blur(1px)' : 'none',
          }}
        >
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
          }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
