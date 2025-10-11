import React from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@th-ui/core'

// Spinner 变体配置
const spinnerVariants = cva('border-2 border-current rounded-full', {
  variants: {
    size: {
      xs: 'w-3 h-3 border-[1.5px]',
      sm: 'w-4 h-4 border-2',
      md: 'w-5 h-5 border-2',
      lg: 'w-6 h-6 border-2',
      xl: 'w-8 h-8 border-[3px]',
      '2xl': 'w-10 h-10 border-[3px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
  color?: string
}

/**
 * Spinner 加载指示器组件
 * 使用 Framer Motion 实现旋转动画
 */
export const Spinner: React.FC<SpinnerProps> = ({ size, className, color }) => {
  return (
    <motion.div
      className={cn(spinnerVariants({ size }), 'border-t-transparent', className)}
      style={color ? { borderColor: color, borderTopColor: 'transparent' } : undefined}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  )
}

Spinner.displayName = 'Spinner'
