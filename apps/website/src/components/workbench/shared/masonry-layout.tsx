'use client'

import React from 'react'

export interface MasonryLayoutProps {
  children: React.ReactNode
  columns?: number
  gap?: number
  className?: string
}

export const MasonryLayout: React.FC<MasonryLayoutProps> = ({
  children,
  columns = 3,
  gap = 16,
  className = ''
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`
      }}
    >
      {children}
    </div>
  )
}

export default MasonryLayout