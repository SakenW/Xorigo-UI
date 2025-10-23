'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../foundations/utils/cn'
import { XorigoLogo } from '../../branding'

export type LoaderSize = 'sm' | 'md' | 'lg' | 'xl'

export interface XorigoLogoLoaderProps {
  size?: LoaderSize
  className?: string
  /** 是否显示确定式进度条；false 时显示"不定式滑动高亮" */
  showProgress?: boolean
  /** 总时长（毫秒），用于确定式进度与完成回调；<=0 将视为立即完成 */
  duration?: number
  /** 触达 duration 后触发一次 */
  onComplete?: () => void
  /**
   * 将节拍传给 Logo：整环旋转与渐变相位
   * - spinSeconds：Logo 整体旋转一圈秒数
   * - gradientSeconds：Logo 渐变相位一圈秒数（推荐略大于 spin）
   * - breatheSeconds：Logo 呼吸节奏
   */
  spinSeconds?: number
  gradientSeconds?: number
  breatheSeconds?: number
  variant?: 'minimal' | 'standard' | 'enhanced'
}

export const XorigoLogoLoader: React.FC<XorigoLogoLoaderProps> = ({
  size = 'md',
  className,
  showProgress = true,
  duration = 2000,
  onComplete,
  spinSeconds = 8,
  gradientSeconds = 12,
  breatheSeconds = 3,
  variant = 'standard',
}) => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
      onComplete?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onComplete])

  if (isLoaded) return null

  // ===== 黄金比例几何：用于容器与内边距推导 =====
  const φ = 1.618
  const canvas: Record<LoaderSize, number> = { sm: 64, md: 96, lg: 128, xl: 160 }
  const sizePx = canvas[size]
  // 给 Logo 留出约 8% 的"呼吸边"
  const logoSize = Math.round(sizePx * 0.84)
  const pad = Math.max(Math.round((sizePx - logoSize) / 2), 4)

  // ===== variant 样式变化 =====
  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return 'gap-2'
      case 'enhanced':
        return 'gap-6'
      default:
        return 'gap-4'
    }
  }

  return (
    <motion.div
      className={cn('flex flex-col items-center justify-center select-none', getVariantStyles(), className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.6, 1] }}
    >
      {/* Logo 容器：只负责排版与轻入场 */}
      <motion.div
        className="relative"
        style={{ width: sizePx, height: sizePx, padding: pad }}
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        aria-hidden
      >
        <XorigoLogo
          size={logoSize}
          spinSeconds={spinSeconds}
          breatheSeconds={breatheSeconds}
          gradientSeconds={gradientSeconds}
          mode="hybrid"
          title="Xorigo Logo"
          glow={variant === 'enhanced'}
        />
      </motion.div>

      {/* 进度条：确定式(按 duration) 或 不定式(滑动高亮) */}
      {variant !== 'minimal' && (
        <div className="w-full max-w-[320px]">
          {showProgress ? (
            <div
              className={cn(
                'relative w-full overflow-hidden rounded-full bg-black/20',
                size === 'sm' ? 'h-[4px]' : size === 'md' ? 'h-[6px]' : 'h-[8px]'
              )}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round((Date.now() % duration) / duration * 100)}
              aria-label="加载进度"
            >
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: duration / 1000, ease: "easeOut" }}
                style={{ transformOrigin: '0 50%' }}
              />
            </div>
          ) : (
            // 不定式：一条滑动高亮
            <div
              className={cn(
                'relative w-full overflow-hidden rounded-full bg-black/20',
                size === 'sm' ? 'h-[4px]' : size === 'md' ? 'h-[6px]' : 'h-[8px]'
              )}
              role="progressbar"
              aria-label="加载中"
            >
              <motion.div
                className="absolute top-0 bottom-0 w-1/3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                initial={{ x: '-40%' }}
                animate={{ x: '120%' }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default XorigoLogoLoader