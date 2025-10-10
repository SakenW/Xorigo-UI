import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className,
}) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  }

  const defaultHeight = variant === 'text' ? '1em' : variant === 'circular' ? '40px' : '200px'
  const defaultWidth = variant === 'circular' ? '40px' : '100%'

  const style: React.CSSProperties = {
    width: width || defaultWidth,
    height: height || defaultHeight,
  }

  return (
    <motion.div
      className={cn(
        'bg-gray-200 dark:bg-gray-700',
        variantClasses[variant],
        animation === 'pulse' && 'animate-pulse',
        className
      )}
      style={style}
      {...(animation === 'wave' && {
        animate: {
          backgroundPosition: ['200% 0', '-200% 0'],
        },
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        },
        style: {
          ...style,
          background:
            'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
          backgroundSize: '200% 100%',
        },
      })}
    />
  )
}

// SkeletonGroup - 预设的组合骨架屏
export interface SkeletonGroupProps {
  type?: 'card' | 'list' | 'article' | 'profile' | 'table'
  count?: number
  className?: string
}

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
  type = 'card',
  count = 1,
  className,
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="space-y-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Skeleton variant="rectangular" height="200px" />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="40%" />
          </div>
        )

      case 'list':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" width="48px" height="48px" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="60%" />
              </div>
            </div>
          </div>
        )

      case 'article':
        return (
          <div className="space-y-4">
            <Skeleton variant="text" width="70%" height="2em" />
            <Skeleton variant="rectangular" height="300px" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="80%" />
          </div>
        )

      case 'profile':
        return (
          <div className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Skeleton variant="circular" width="80px" height="80px" />
            <div className="flex-1 space-y-3">
              <Skeleton variant="text" width="50%" height="1.5em" />
              <Skeleton variant="text" width="30%" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
            </div>
          </div>
        )

      case 'table':
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </div>
            ))}
          </div>
        )

      default:
        return <Skeleton />
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  )
}

export default { Skeleton, SkeletonGroup }
