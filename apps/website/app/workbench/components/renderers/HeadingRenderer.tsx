'use client'

import React from 'react'

interface HeadingRendererProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
  weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
  children?: React.ReactNode
}

export default function HeadingRenderer({
  level = 1,
  size = '2xl',
  weight = 'bold',
  children = '这是一个标题示例'
}: HeadingRendererProps) {
  const getSizeClass = () => {
    const sizeMap = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-md',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl'
    }
    return sizeMap[size] || 'text-2xl'
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
    return weightMap[weight] || 'font-bold'
  }

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <div className="w-full">
      <HeadingTag className={`
        ${getSizeClass()} ${getWeightClass()}
        text-gray-900 dark:text-white
        mb-2
      `}>
        {children}
      </HeadingTag>
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <div>级别: H{level}</div>
        <div>大小: {size}</div>
        <div>字重: {weight}</div>
      </div>
    </div>
  )
}