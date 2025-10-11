'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@th-ui/core'

export interface AvatarProps {
  src?: string
  alt?: string
  fallback?: React.ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  shape?: 'circle' | 'square'
  status?: 'online' | 'offline' | 'away' | 'busy'
  statusPosition?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'
  bordered?: boolean
  className?: string
  onClick?: () => void
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  fallback,
  size = 'md',
  shape = 'circle',
  status,
  statusPosition = 'bottom-right',
  bordered = false,
  className,
  onClick,
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  }

  const statusSizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  }

  const statusPositionClasses = {
    'top-right': 'top-0 right-0',
    'bottom-right': 'bottom-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-left': 'bottom-0 left-0',
  }

  const statusColorClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  }

  const showImage = src && !imageError
  const showFallback = !showImage

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <motion.div
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden',
        'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
        shape === 'circle' ? 'rounded-full' : 'rounded-lg',
        bordered && 'ring-2 ring-white dark:ring-gray-800',
        onClick && 'cursor-pointer',
        sizeClasses[size],
        className
      )}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {showImage && (
        <motion.img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {showFallback && (
        <div className="flex items-center justify-center w-full h-full font-medium">
          {fallback || (
            typeof alt === 'string' && alt ? (
              getInitials(alt)
            ) : (
              <svg
                className={size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )
          )}
        </div>
      )}

      {status && (
        <span
          className={cn(
            'absolute rounded-full ring-2 ring-white dark:ring-gray-800',
            statusSizeClasses[size],
            statusPositionClasses[statusPosition],
            statusColorClasses[status]
          )}
        />
      )}
    </motion.div>
  )
}

// Avatar Group Component
export interface AvatarGroupProps {
  children: React.ReactNode
  max?: number
  size?: AvatarProps['size']
  className?: string
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max = 5,
  size = 'md',
  className,
}) => {
  const childrenArray = React.Children.toArray(children)
  const displayedAvatars = childrenArray.slice(0, max)
  const remainingCount = childrenArray.length - max

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  }

  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      {displayedAvatars.map((child, index) => (
        <div
          key={index}
          className="relative ring-2 ring-white dark:ring-gray-800 rounded-full"
          style={{ zIndex: displayedAvatars.length - index }}
        >
          {child}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            'relative flex items-center justify-center',
            'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200',
            'rounded-full ring-2 ring-white dark:ring-gray-800',
            'font-medium',
            sizeClasses[size]
          )}
          style={{ zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  )
}

export default { Avatar, AvatarGroup }
