import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@xorigo-ui/system'
import { semanticColors } from '@xorigo-ui/tokens'
import { cn } from '../utils'

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
      return 'bg-[var(--bg-glass)] backdrop-blur-md border-[var(--border-glass)] shadow-lg'
    case 'gradient':
      return 'bg-linear-to-br from-[var(--bg-primary-action)]/20 to-[var(--bg-secondary-action)]/20 backdrop-blur-xs border-[var(--border-glass)]'
    case 'neumorphic':
      return 'bg-[var(--bg-tertiary)] shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)] border-0'
    default:
      return 'bg-[var(--bg-secondary)] shadow-xs border-[var(--border-primary)]'
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
              <div className="absolute inset-0 bg-[var(--bg-glass)] rounded-xl" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

AnimatedCard.displayName = 'AnimatedCard'
