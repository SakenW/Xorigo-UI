import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'

// 按钮状态组件
interface ButtonStatesProps {
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  success?: boolean
  error?: boolean
  disabled?: boolean
  onClick?: () => void
}

export const ButtonStates: React.FC<ButtonStatesProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  success = false,
  error = false,
  disabled = false,
  onClick
}) => {
  const [isPressed, setIsPressed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseDown = () => setIsPressed(true)
  const handleMouseUp = () => setIsPressed(false)
  const handleMouseLeave = () => {
    setIsPressed(false)
    setIsHovered(false)
  }
  const handleMouseEnter = () => setIsHovered(true)

  const getStateStyles = () => {
    if (disabled) return 'opacity-50 cursor-not-allowed'
    if (loading) return 'cursor-wait'
    if (error) return 'bg-red-600 hover:bg-red-700 text-white'
    if (success) return 'bg-green-600 hover:bg-green-700 text-white'
    if (isPressed) return 'scale-95'
    if (isHovered) return 'scale-105'
    return ''
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white'
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white'
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white'
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  }

  return (
    <motion.button
      className={cn(
        'px-4 py-2 rounded-md font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        getVariantStyles(),
        getStateStyles(),
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled || loading}
    >
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center"
          >
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </motion.div>
        )}

        {success && !loading && (
          <motion.div
            key="success"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}

        {error && !loading && !success && (
          <motion.div
            key="error"
            initial={{ x: -10 }}
            animate={{ x: 0 }}
            exit={{ x: 10 }}
            className="flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.div>
        )}

        {!loading && !success && !error && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// 输入框状态组件
interface InputStatesProps {
  label: string
  placeholder?: string
  error?: string
  success?: string
  loading?: boolean
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export const InputStates: React.FC<InputStatesProps> = ({
  label,
  placeholder,
  error,
  success,
  loading = false,
  disabled = false,
  value = '',
  onChange,
  className
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const getStateClasses = () => {
    let classes = 'border transition-all duration-200'

    if (disabled) {
      classes += ' bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
    } else if (error) {
      classes += ' border-red-500 focus:ring-red-500'
    } else if (success) {
      classes += ' border-green-500 focus:ring-green-500'
    } else if (isFocused) {
      classes += ' border-blue-500 focus:ring-blue-500'
    } else if (isHovered) {
      classes += ' border-gray-400 dark:border-gray-500'
    } else {
      classes += ' border-gray-300 dark:border-gray-600'
    }

    return classes
  }

  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full px-3 py-2 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
            'focus:outline-none focus:ring-1 focus:ring-offset-0',
            getStateClasses()
          )}
        />

        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {success && !loading && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}

        {error && !loading && (
          <motion.div
            initial={{ x: -10 }}
            animate={{ x: 0 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}

        {success && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-green-600 dark:text-green-400"
          >
            {success}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// 卡片状态组件
interface CardStatesProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  hover?: boolean
  loading?: boolean
  error?: boolean
  empty?: boolean
  className?: string
}

export const CardStates: React.FC<CardStatesProps> = ({
  children,
  title,
  subtitle,
  hover = true,
  loading = false,
  error = false,
  empty = false,
  className
}) => {
  const [isHovered, setIsHovered] = useState(false)

  if (loading) {
    return (
      <div className={cn('p-6 bg-white dark:bg-gray-800 rounded-lg shadow', className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn('p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg', className)}
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">加载失败</h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">请稍后重试</p>
          </div>
        </div>
      </motion.div>
    )
  }

  if (empty) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600', className)}
      >
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">暂无数据</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">没有找到相关内容</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={cn(
        'p-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700',
        'transition-all duration-200',
        hover && isHovered && 'shadow-lg transform -translate-y-1',
        className
      )}
      onMouseEnter={() => hover && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={hover ? { y: -2 } : undefined}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
      )}

      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  )
}

// 进度状态组件
interface ProgressStatesProps {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'warning' | 'danger'
  animated?: boolean
  className?: string
}

export const ProgressStates: React.FC<ProgressStatesProps> = ({
  value,
  max = 100,
  label,
  showValue = true,
  size = 'md',
  color = 'primary',
  animated = true,
  className
}) => {
  const percentage = (value / max) * 100

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-2'
      case 'md': return 'h-3'
      case 'lg': return 'h-4'
      default: return 'h-3'
    }
  }

  const getColorClasses = () => {
    switch (color) {
      case 'primary': return 'bg-blue-500'
      case 'success': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'danger': return 'bg-red-500'
      default: return 'bg-blue-500'
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div className={cn('w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden', getSizeClasses())}>
        <motion.div
          className={cn('h-full', getColorClasses())}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: animated ? 1 : 0,
            ease: 'easeOut'
          }}
        />
      </div>
    </div>
  )
}

export default {
  ButtonStates,
  InputStates,
  CardStates,
  ProgressStates
}
