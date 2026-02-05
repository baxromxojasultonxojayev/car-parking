'use client'

import { Card } from 'antd'
import { ReactNode } from 'react'
import { useThemeStore } from '../../store/themeStore'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'

interface StatCardProps {
  title: string
  value: number | string
  icon: ReactNode
  color: string
  trend?: number
  suffix?: string
}

export const StatCard = ({ title, value, icon, color, trend, suffix }: StatCardProps) => {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <Card
      style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
          : '#ffffff',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f0f0f0',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
      styles={{
        body: {
          padding: '20px',
        },
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '13px',
              color: isDark ? 'rgba(255,255,255,0.6)' : '#8c8c8c',
              marginBottom: '8px',
              fontWeight: 500,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: isDark ? '#fff' : '#1a1a2e',
              lineHeight: 1.2,
              display: 'flex',
              alignItems: 'baseline',
              gap: '4px',
            }}
          >
            {value}
            {suffix && (
              <span style={{ fontSize: '14px', fontWeight: 500, color: isDark ? 'rgba(255,255,255,0.6)' : '#8c8c8c' }}>
                {suffix}
              </span>
            )}
          </div>
          {trend !== undefined && (
            <div
              style={{
                marginTop: '8px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: trend >= 0 ? '#52c41a' : '#ff4d4f',
              }}
            >
              {trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              <span>{Math.abs(trend)}%</span>
              <span style={{ color: isDark ? 'rgba(255,255,255,0.45)' : '#8c8c8c' }}>vs last week</span>
            </div>
          )}
        </div>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            color: color,
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  )
}
