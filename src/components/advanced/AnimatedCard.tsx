import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../theme/ThemeProvider'
import { cn } from '../../utils/cn'

export interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'glass' | 'gradient' | 'neumorphic'
  hover?: boolean
  interactive?: boolean
  onClick?: () => void
  delay?: number
  duration?: number
}

const cardVariants = {
  default: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -4, scale: 1.02 },
    tap: { scale: 0.98 },
  },
  glass: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    hover: { scale: 1.05, rotateX: 5, rotateY: 5 },
    tap: { scale: 0.95 },
  },
  gradient: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    hover: { x: 5, scale: 1.03 },
    tap: { scale: 0.97 },
  },
  neumorphic: {
    initial: { opacity: 0, rotate: -5 },
    animate: { opacity: 1, rotate: 0 },
    hover: { rotate: 2, scale: 1.02 },
    tap: { scale: 0.98 },
  },
}

const getCardStyles = (variant: string) => {
  switch (variant) {
    case 'glass':
      return 'bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg'
    case 'gradient':
      return 'bg-linear-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-xs border border-white/10'
    case 'neumorphic':
      return 'bg-gray-100 dark:bg-gray-900 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-8px_-8px_16px_rgba(255,255,255,0.1)] border-0'
    default:
      return 'bg-white dark:bg-gray-800 shadow-xs border border-gray-200 dark:border-gray-700'
  }
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  variant = 'default',
  hover = true,
  interactive = false,
  onClick,
  delay = 0,
  duration = 0.3,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const { themeConfig } = useTheme()

  const handleMouseEnter = () => {
    if (hover) setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleTapStart = () => {
    if (interactive) setIsPressed(true)
  }

  const handleTapEnd = () => {
    setIsPressed(false)
  }

  return (
    <motion.div
      className={cn(
        'rounded-xl p-6 cursor-pointer transition-all duration-300',
        getCardStyles(variant),
        className
      )}
      variants={cardVariants[variant]}
      initial="initial"
      animate="animate"
      whileHover={hover ? 'hover' : undefined}
      whileTap={interactive ? 'tap' : undefined}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTapStart={handleTapStart}
      onTap={handleTapEnd}
      onTapCancel={handleTapEnd}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <AnimatePresence>
        {(isHovered || isPressed) && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {variant === 'gradient' && (
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: themeConfig.gradient,
                  opacity: 0.1,
                }}
              />
            )}
            {variant === 'glass' && (
              <div className="absolute inset-0 bg-white/5 dark:bg-black/5 rounded-xl" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

AnimatedCard.displayName = 'AnimatedCard'
