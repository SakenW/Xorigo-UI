'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface XorigoLogoLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'minimal' | 'enhanced'
  className?: string
  showProgress?: boolean
  duration?: number
  onComplete?: () => void
}

/**
 * Xorigo Logo 加载组件
 *
 * 语义：Xorigo 代表"原点" - 组件库的起源和核心
 *
 * 变体说明：
 * - default: 完整的加载动画，包含背景渐变和进度条
 * - minimal: 简约版本，只有Logo旋转
 * - enhanced: 增强版本，带有粒子效果和多层动画
 */
export const XorigoLogoLoader = ({
  size = 'md',
  variant = 'default',
  className,
  showProgress = true,
  duration = 2000,
  onComplete
}: XorigoLogoLoaderProps) => {
  const [progress, setProgress] = React.useState(0)
  const [isComplete, setIsComplete] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsComplete(true)
            onComplete?.()
          }, 300)
          return 100
        }
        return prev + Math.random() * 20
      })
    }, 60)

    return () => clearInterval(interval)
  }, [duration, onComplete])

  if (!mounted) return null

  // 尺寸配置
  const sizeConfig = {
    sm: { container: 'w-16 h-16', text: 'text-xl', icon: 'text-lg' },
    md: { container: 'w-24 h-24', text: 'text-2xl', icon: 'text-2xl' },
    lg: { container: 'w-32 h-32', text: 'text-3xl', icon: 'text-3xl' },
    xl: { container: 'w-40 h-40', text: 'text-4xl', icon: 'text-4xl' }
  }

  const currentSize = sizeConfig[size]

  if (isComplete) return null

  return (
    <div className={cn("flex flex-col items-center justify-center gap-6", className)}>
      <motion.div
        className={cn(
          "relative",
          currentSize.container,
          "transition-all duration-300 ease-out"
        )}
        animate={{
          scale: [0.8, 1, 1.2, 1],
          opacity: [0, 1, 1, 0]
        }}
        transition={{
          duration: duration / 2,
          ease: "easeInOut"
        }}
        onAnimationComplete={() => {
          if (variant !== 'minimal') {
            // 开始内部动画
          }
        }}
      >
        {/* 背景渐变层 */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: {
              duration: 3,
              ease: "linear",
              repeat: Infinity
            },
            scale: {
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity
            }
          }}
        />

        {/* 脉冲效果层 - 增强版 */}
        {variant === 'enhanced' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/60 to-cyan-500/60 rounded-2xl blur-md"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity
            }}
          />
        )}

        {/* 粒子效果 - 增强版 */}
        {variant === 'enhanced' && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [1, 0, 1],
                  opacity: [0.8, 0.4, 0.8],
                  x: [0, Math.cos(i * 60) * 40],
                  y: [0, Math.sin(i * 60) * 40]
                }}
                transition={{
                  duration: 3,
                  ease: "linear",
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              />
            ))}
          </>
        )}

        {/* Logo 文字 */}
        <div className={cn(
          "relative w-full h-full flex items-center justify-center text-white font-bold",
          currentSize.text
        )}>
          <span className="relative z-10">X</span>

          {/* X 豉字的原点含义 - 脉冲效果 */}
          {variant === 'enhanced' && (
            <>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                style={{
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                animate={{
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity
                }}
              >
                X
              </motion.div>

              {/* 原点含义的视觉化 - 小圆点 */}
              <motion.div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity
                }}
              />

              <motion.div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 1, 0.8],
                  delay: 0.75
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity
                }}
              />
            </>
          )}
        </div>

        {/* 边框效果 - 增强版 */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            border: '2px solid rgba(255, 255, 255, 0.1)',
            boxShadow: variant === 'enhanced'
              ? '0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(6, 182, 212, 0.2)'
              : '0 0 10px rgba(168, 85, 247, 0.2)'
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            boxShadow: variant === 'enhanced'
              ? [
                '0 0 20px rgba(168, 85, 247, 0.3)',
                '0 0 40px rgba(6, 182, 212, 0.2)',
                '0 0 20px rgba(168, 85, 247, 0.3)'
              ]
              : ['0 0 10px rgba(168, 85, 247, 0.2)']
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeat: Infinity
          }}
        />
      </motion.div>

      {/* 进度条 */}
      {showProgress && variant !== 'minimal' && (
        <motion.div
          className={cn(
            "w-full overflow-hidden rounded-full",
            size === 'sm' ? 'h-1' : size === 'md' ? 'h-1.5' : 'h-2',
            'bg-black/20'
          )}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: duration / 4, delay: duration / 8 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 80 }}
          />
        </motion.div>
      )}

      {/* 加载文字 - 增强版 */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.p
          className={cn(
            "text-gray-400 font-medium",
            size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
          )}
        >
          {variant === 'enhanced' ? '正在初始化 Xorigo UI...' : '加载中...'}
        </motion.p>

        {variant === 'enhanced' && (
          <motion.p
            className={cn(
              "text-gray-500 text-xs mt-1",
              "opacity-70"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            组件库原点
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}

// 预设的常用配置
export const XorigoLogoLoaderPresets = {
  // 快速加载 - 小尺寸，短时间
  fast: { size: 'sm' as const, variant: 'minimal' as const, duration: 1000, showProgress: false },

  // 标准加载 - 中等尺寸，标准时间
  standard: { size: 'md' as const, variant: 'default' as const, duration: 2000 },

  // 完整加载 - 大尺寸，长时间，带增强效果
  full: { size: 'lg' as const, variant: 'enhanced' as const, duration: 3000 },

  // 沉浸式加载 - 最大尺寸，增强效果
  immersive: { size: 'xl' as const, variant: 'enhanced' as const, duration: 4000 }
} as const

// 便捷的工厂函数
export const createXorigoLoader = (preset: keyof typeof XorigoLogoLoaderPresets) => {
  return (props: Partial<XorigoLogoLoaderProps>) => (
    <XorigoLogoLoader {...XorigoLogoLoaderPresets[preset]} {...props} />
  )
}

// 导出常用的预设组件
export const FastXorigoLoader = createXorigoLoader('fast')
export const StandardXorigoLoader = createXorigoLoader('standard')
export const FullXorigoLoader = createXorigoLoader('full')
export const ImmersiveXorigoLoader = createXorigoLoader('immersive')