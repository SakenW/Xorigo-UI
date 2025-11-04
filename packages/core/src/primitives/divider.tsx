/**
 * Divider - 分隔线组件
 *
 * 临时的基础分隔线组件实现
 */

import React from 'react'

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed' | 'dotted'
  thickness?: 'thin' | 'medium' | 'thick'
}

export const Divider = ({
  className = '',
  orientation = 'horizontal',
  variant = 'solid',
  thickness = 'thin',
  ...props
}: DividerProps) => {
  const baseClasses = orientation === 'horizontal' ? 'w-full' : 'h-full'

  const variantClasses = {
    solid: 'border-gray-200',
    dashed: 'border-dashed border-gray-300',
    dotted: 'border-dotted border-gray-300'
  }

  const thicknessClasses = {
    thin: 'border-t',
    medium: 'border-t-2',
    thick: 'border-t-4'
  }

  const verticalThicknessClasses = {
    thin: 'border-l',
    medium: 'border-l-2',
    thick: 'border-l-4'
  }

  const finalThicknessClasses = orientation === 'horizontal'
    ? thicknessClasses[thickness]
    : verticalThicknessClasses[thickness]

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${finalThicknessClasses} ${className}`}
      {...props}
    />
  )
}