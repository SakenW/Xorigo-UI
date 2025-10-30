'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import {
  Bot,
  MessageSquare,
  X,
  Sparkles,
  Zap
} from 'lucide-react'
import { Button } from '@xorigo-ui/core'

// ============================================================================
// 样式变体定义
// ============================================================================

const buttonVariants = cva(
  'fixed z-40 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300',
  {
    variants: {
      position: {
        'bottom-right': 'bottom-6 right-6',
        'bottom-left': 'bottom-6 left-6',
        'top-right': 'top-6 right-6',
        'top-left': 'top-6 left-6'
      },
      variant: {
        default: 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white',
        success: 'bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white',
        warning: 'bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white'
      }
    },
    defaultVariants: {
      position: 'bottom-right',
      variant: 'default'
    }
  }
)

// ============================================================================
// 组件属性接口
// ============================================================================

interface FloatingAIButtonProps {
  className?: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  variant?: 'default' | 'success' | 'warning'
  isOpen?: boolean
  onToggle?: () => void
  showBadge?: boolean
  badgeContent?: string | number
  tooltip?: string
}

// ============================================================================
// 主组件
// ============================================================================

export function FloatingAIButton({
  className,
  position = 'bottom-right',
  variant = 'default',
  isOpen = false,
  onToggle,
  showBadge = false,
  badgeContent,
  tooltip = 'AI 智能助手'
}: FloatingAIButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = useCallback(() => {
    onToggle?.()
  }, [onToggle])

  return (
    <>
      {/* 浮动按钮 */}
      <motion.div
        className={cn(buttonVariants({ position, variant }), className)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        title={tooltip}
      >
        {/* 脉冲动画效果 */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
            style={{
              background: variant === 'default'
                ? 'linear-gradient(to bottom right, rgb(59, 130, 246), rgb(147, 51, 234))'
                : variant === 'success'
                ? 'linear-gradient(to bottom right, rgb(34, 197, 94), rgb(16, 185, 129))'
                : 'linear-gradient(to bottom right, rgb(249, 115, 22), rgb(239, 68, 68))'
            }}
          />
        )}

        {/* 图标 */}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Bot className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 徽章 */}
        {showBadge && badgeContent && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
          >
            {badgeContent}
          </motion.div>
        )}

        {/* 悬停效果 */}
        {isHovered && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "absolute bottom-full mb-2 px-3 py-1 text-sm text-white rounded-lg whitespace-nowrap",
              "bg-gray-900 dark:bg-gray-800 shadow-lg"
            )}
            style={{
              transformOrigin: position.includes('right') ? 'bottom right' : 'bottom left'
            }}
          >
            {tooltip}
            <div className={cn(
              "absolute w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45",
              position.includes('right') ? 'right-2' : 'left-2',
              "-bottom-1"
            )} />
          </motion.div>
        )}
      </motion.div>

      {/* 粒子效果 */}
      <AnimatePresence>
        {isHovered && !isOpen && (
          <motion.div
            className="fixed pointer-events-none"
            style={{
              left: position.includes('right') ? 'auto' : position.includes('left') ? '80px' : '50%',
              right: position.includes('right') ? '80px' : 'auto',
              top: position.includes('bottom') ? 'auto' : position.includes('top') ? '80px' : '50%',
              bottom: position.includes('bottom') ? '80px' : 'auto',
              transform: 'translate(-50%, -50%)'
            }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: variant === 'default'
                    ? 'linear-gradient(45deg, #3b82f6, #9333ea)'
                    : variant === 'success'
                    ? 'linear-gradient(45deg, #22c55e, #10b981)'
                    : 'linear-gradient(45deg, #f97316, #ef4444)',
                  left: `${Math.cos((i * 60) * Math.PI / 180) * 30}px`,
                  top: `${Math.sin((i * 60) * Math.PI / 180) * 30}px`
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ============================================================================
// 快速提示组件
// ============================================================================

interface QuickTipProps {
  isVisible: boolean
  message: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

export function QuickTip({ isVisible, message, position = 'bottom-right' }: QuickTipProps) {
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-24 right-6'
      case 'bottom-left':
        return 'bottom-24 left-6'
      case 'top-right':
        return 'top-24 right-6'
      case 'top-left':
        return 'top-24 left-6'
      default:
        return 'bottom-24 right-6'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          className={cn(
            "fixed z-40 max-w-xs p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700",
            getPositionClasses()
          )}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {message}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// 快捷键提示组件
// ============================================================================

interface KeyboardHintProps {
  isVisible: boolean
  shortcut: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

export function KeyboardHint({ isVisible, shortcut, position = 'bottom-right' }: KeyboardHintProps) {
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-24 right-6'
      case 'bottom-left':
        return 'bottom-24 left-6'
      case 'top-right':
        return 'top-24 right-6'
      case 'top-left':
        return 'top-24 left-6'
      default:
        return 'bottom-24 right-6'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={cn(
            "fixed z-40 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-lg shadow-lg",
            getPositionClasses()
          )}
        >
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-gray-700 dark:bg-gray-900 rounded text-xs border border-gray-600">
              Ctrl
            </kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-gray-700 dark:bg-gray-900 rounded text-xs border border-gray-600">
              {shortcut}
            </kbd>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}