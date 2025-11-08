'use client'

import React from 'react'

interface TextRendererProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  color?: string
  weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
  children?: React.ReactNode
}

export default function TextRenderer({
  size = 'md',
  color = '#374151',
  weight = 'normal',
  children = '这是一段文本示例。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
}: TextRendererProps) {
  const getSizeClass = () => {
    const sizeMap = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl'
    }
    return sizeMap[size] || 'text-base'
  }

  const getWeightClass = () => {
    const weightMap = {
      thin: 'font-thin',
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
      black: 'font-black'
    }
    return weightMap[weight] || 'font-normal'
  }

  return (
    <div className="w-full">
      <p className={`
        ${getSizeClass()} ${getWeightClass()}
        leading-relaxed
        dark:text-gray-300
      `} style={{ color }}>
        {children}
      </p>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 space-y-1">
        <div>大小: {size}</div>
        <div>颜色: {color}</div>
        <div>字重: {weight}</div>
      </div>
    </div>
  )
}