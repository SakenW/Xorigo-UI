'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../utils/cn'

// 导入原点Logo组件
import NavbarOriginLogo from '../components/ui/NavbarOriginLogo'

export type LoaderSize = 'sm' | 'md' | 'lg' | 'xl'

export interface XorigoLogoLoaderProps {
  size?: LoaderSize
  className?: string
  showProgress?: boolean
  /** 总时长（毫秒），用于确定式进度与完成回调 */
  duration?: number
  /** 完成时回调（触达 duration 后触发一次） */
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
}) => {
  // ===== 黄金比例几何：只用于容器与内边距推导（Logo 自己也基于黄金比例） =====
  const φ = 1.618
  const canvas: Record<LoaderSize, number> = { sm: 64, md: 96, lg: 128, xl: 160 }
  const sizePx = canvas[size]

  // 给 Logo 留出 8% 的“呼吸边”（避免贴边），并按 φ 做微调
  const logoSize = Math.round(sizePx * 0.84)
  const pad = Math.max(Math.round((sizePx - logoSize) / 2), 4)

  // ===== 可访问性与动效降级 =====
  const reduce = useReducedMotion()

  // ===== rAF 确定式进度 =====
  const [progress, setProgress] = React.useState(0)
  const didCompleteRef = React.useRef(false)

  React.useEffect(() => {
    let raf = 0
    let start: number | null = null
    didCompleteRef.current = false

    const easeInOutCubic = (x: number) =>
      x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2

    const loop = (t: number) => {
      if (start === null) start = t
      const pct = Math.min(1, (t - start) / duration)
      setProgress(easeInOutCubic(pct) * 100)
      if (pct < 1) raf = requestAnimationFrame(loop)
      else if (!didCompleteRef.current) {
        didCompleteRef.current = true
        onComplete?.()
      }
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [duration, onComplete])

  // ===== UI =====
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 select-none', className)}>
      {/* 圆形容器：只负责排版与轻入场；核心视觉交给 NavbarOriginLogo */}
      <motion.div
        className="relative"
        style={{ width: sizePx, height: sizePx, padding: pad }}
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        aria-hidden
      >
        {/* 中间就是你的 LOGO（混合模式更有生命感） */}
        <NavbarOriginLogo
          // 尺寸传入：Logo 会在自身内部按黄金比例绘制外环与中心点
          size={logoSize}
          // 三个节拍参数与 Loader 对齐，便于全局“律动一致”
          spinSeconds={reduce ? spinSeconds * 1.5 : spinSeconds}
          breatheSeconds={reduce ? breatheSeconds * 1.5 : breatheSeconds}
          gradientSeconds={reduce ? gradientSeconds * 1.5 : gradientSeconds}
          // 保持品牌色系；有需要你也可以把 ringStops 透传为主题色数组
          // ringStops={['var(--color-purple-500)', 'var(--color-pink-400)', 'var(--color-cyan-400)', 'var(--color-cyan-500)', 'var(--color-purple-500)']}
          // 建议默认混合模式（若你的 Logo 支持 mode，使用 'hybrid'；若不支持，此行可删）
          // @ts-ignore 兼容你先前的实现：如果没有此 prop，TS 会忽略
          mode="hybrid"
          // 读屏标题（非必须）
          title="Xorigo Origin"
        />
      </motion.div>

      {/* 进度条：与 Logo 节拍协调（不动画容器宽度，只用 scaleX） */}
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
            aria-valuenow={Math.round(progress)}
            aria-label="加载进度"
          >
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
              style={{ width: '100%', transformOrigin: '0 50%' }}
              animate={{ scaleX: progress / 100 }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.16 }}
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
              transition={{ duration: reduce ? 1.6 : 1.1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default XorigoLogoLoader
