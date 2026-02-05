'use client'

import { Tag } from 'antd'
import { STATUS_COLORS } from '../../types'

interface StatusTagProps {
  status: string
  size?: 'small' | 'default'
}

export const StatusTag = ({ status, size = 'default' }: StatusTagProps) => {
  const color = STATUS_COLORS[status] || 'default'
  
  return (
    <Tag 
      color={color} 
      style={{ 
        borderRadius: '6px',
        fontWeight: 500,
        fontSize: size === 'small' ? '11px' : '12px',
        padding: size === 'small' ? '0 6px' : '2px 8px',
      }}
    >
      {status.replace(/_/g, ' ')}
    </Tag>
  )
}
