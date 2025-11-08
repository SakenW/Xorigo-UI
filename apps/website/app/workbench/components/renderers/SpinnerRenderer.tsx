'use client'

import React from 'react'

interface SpinnerRendererProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  speed?: 'slow' | 'normal' | 'fast'
}

export default function SpinnerRenderer({
  size = 'md',
  color = '#3B82F6',
  speed = 'normal'
}: SpinnerRendererProps) {
  const getSizeClass = () => {
    const sizeMap = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    }
    return sizeMap[size]
  }

  const getAnimationClass = () => {
    const speedMap = {
      slow: 'animate-spin-slow',
      normal: 'animate-spin',
      fast: 'animate-spin-fast'
    }
    return speedMap[speed]
  }

  return (
    <div className="w-full flex items-center justify-center space-x-3">
      <div className={`${getSizeClass()} ${getAnimationClass()}`} style={{ color }}>
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        加载中... | 大小: {size} | 速度: {speed}
      </div>
    </div>
  )
}