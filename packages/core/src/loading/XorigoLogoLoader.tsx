'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'

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
 * 视觉概念：以原点为中心的能量扩散和汇聚动画
 *
 * 变体说明：
 * - default: 完整的圆形原点动画，包含波纹扩散
 * - minimal: 简约版本，只有核心原点脉动
 * - enhanced: 增强版本，带有轨道粒子和多层波纹
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
    sm: { container: 'w-16 h-16', text: 'text-xl', origin: 'w-2 h-2', orbit: 'w-12 h-12' },
    md: { container: 'w-24 h-24', text: 'text-2xl', origin: 'w-3 h-3', orbit: 'w-18 h-18' },
    lg: { container: 'w-32 h-32', text: 'text-3xl', origin: 'w-4 h-4', orbit: 'w-24 h-24' },
    xl: { container: 'w-40 h-40', text: 'text-4xl', origin: 'w-5 h-5', orbit: 'w-30 h-30' }
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
          scale: [0.8, 1, 1.05, 1],
          opacity: [0, 1, 1, 1]  // 保持可见状态
        }}
        transition={{
          duration: 1.5, // 固定进入动画时间，不依赖duration
          ease: "easeInOut"
        }}
      >
        {/* 原点背景 - 圆形渐变 */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity
          }}
        />

        {/* 波纹扩散效果 - 象征原点的能量扩散 */}
        {variant !== 'minimal' && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border border-purple-400/30"
                animate={{
                  scale: [1, 1.8, 2.5],
                  opacity: [0.6, 0.2, 0],
                }}
                transition={{
                  duration: 2,
                  ease: "easeOut",
                  repeat: Infinity,
                  delay: i * 0.7,
                  repeatDelay: i * 0.3
                }}
              />
            ))}
          </>
        )}

        {/* 轨道粒子 - 增强版 */}
        {variant === 'enhanced' && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              transformOrigin: 'center'
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              ease: "linear",
              repeat: Infinity
            }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={cn(
                  "absolute bg-gradient-to-r from-purple-300 to-cyan-300 rounded-full",
                  currentSize.origin
                )}
                style={{
                  left: '50%',
                  top: '0%',
                  transform: 'translateX(-50%) translateY(-50%)',
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: i * 0.25
                }}
              />
            ))}
          </motion.div>
        )}

        {/* 中心原点 - 象征起源的核心 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className={cn(
              "relative bg-black rounded-full flex items-center justify-center",
              size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-14 h-14' : size === 'lg' ? 'w-18 h-18' : 'w-22 h-22'
            )}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity
            }}
          >
            {/* 核心原点 */}
            <motion.div
              className={cn(
                "rounded-full bg-gradient-to-r from-purple-400 to-cyan-400",
                currentSize.origin
              )}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                repeat: Infinity
              }}
            />

            {/* X logo - 围绕原点脉动 */}
            <motion.span
              className={cn(
                "absolute text-white font-bold",
                currentSize.text
              )}
              animate={{
                scale: [0.9, 1, 0.9],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity
              }}
            >
              X
            </motion.span>
          </motion.div>
        </div>

        {/* 原点光芒 - 增强版 */}
        {variant === 'enhanced' && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(6,182,212,0.05) 50%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
              repeat: Infinity
            }}
          />
        )}
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
          {variant === 'enhanced' ? '正在从原点启动...' : '加载中...'}
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
            Xorigo UI · 组件库原点
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

export type { XorigoLogoLoaderProps }