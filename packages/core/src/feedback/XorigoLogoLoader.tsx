'use client'

import React from 'react'
import { motion, useReducedMotion, useAnimationFrame, useMotionValue, animate } from 'framer-motion'
import { cn } from '../utils/cn'

// ✅ 确认路径：若你的项目结构为 apps/website/src/components/ui/NavbarOriginLogo.tsx
//   并且本组件文件位于 packages/core/src/loading/XorigoLogoLoader.tsx，
//   则相对路径应该由你的打包器别名/输出结构决定。
//   此处按你上条信息的相对写法：../components/ui/NavbarOriginLogo
import NavbarOriginLogo from '../branding/NavbarOriginLogo'

export type LoaderSize = 'sm' | 'md' | 'lg' | 'xl'

export interface XorigoLogoLoaderProps {
  size?: LoaderSize
  className?: string
  /** 是否显示确定式进度条；false 时显示“不定式滑动高亮” */
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
  // ===== 黄金比例几何：用于容器与内边距推导 =====
  const φ = 1.618
  const canvas: Record<LoaderSize, number> = { sm: 64, md: 96, lg: 128, xl: 160 }
  const sizePx = canvas[size]
  // 给 Logo 留出约 8% 的“呼吸边”
  const logoSize = Math.round(sizePx * 0.84)
  const pad = Math.max(Math.round((sizePx - logoSize) / 2), 4)

  // ===== 可访问性与动效降级 =====
  const reduce = useReducedMotion()

  // ===== 进度：用 MotionValue 驱动，避免每帧 setState 重渲染 =====
  // progressMv 范围 0~100
  const progressMv = useMotionValue(0)
  // 为 aria 暴露一个节流后的数值（整数），避免每帧更新引发重渲染
  const [ariaNow, setAriaNow] = React.useState(0)

  // 帧循环：仅在确定式(showProgress)场景运行；不定式无需帧计算
  const startRef = React.useRef<number | null>(null)
  const completeRef = React.useRef(false)

  // 缓动：easeInOutCubic
  const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

  // 处理极端 duration：<=0 立即完成
  React.useEffect(() => {
    completeRef.current = false
    progressMv.set(0)

    if (!showProgress) return
    if (!(Number.isFinite(duration) && duration > 0)) {
      progressMv.set(100)
      if (!completeRef.current) {
        completeRef.current = true
        queueMicrotask(() => onComplete?.())
      }
    }
  }, [duration, showProgress, onComplete, progressMv])

  // 帧动画循环（仅确定式）
  useAnimationFrame((t) => {
    if (!showProgress) return
    if (!(Number.isFinite(duration) && duration > 0)) return
    if (completeRef.current) return

    if (startRef.current === null) startRef.current = t
    const raw = Math.min(1, (t - startRef.current) / duration)
    const eased = easeInOutCubic(raw)
    const pct = eased * 100
    progressMv.set(pct)

    if (raw >= 1 && !completeRef.current) {
      completeRef.current = true
      // 为了保证视觉上最后一帧是 100%，再安排一个微任务回调
      queueMicrotask(() => onComplete?.())
    }
  })

  // 节流同步 aria-valuenow（每 ~80ms 刷新一次）
  React.useEffect(() => {
    let stop = false
    let raf = 0
    let lastTs = 0
    const tick = (ts: number) => {
      if (stop) return
      if (ts - lastTs > 80) {
        lastTs = ts
        setAriaNow(Math.round(progressMv.get()))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      stop = true
      cancelAnimationFrame(raf)
    }
  }, [progressMv])

  // ===== 进度条动画：对 scaleX 应用“补间”，避免突兀 =====
  // 这里额外用一个平滑的 MotionValue 绑定到 style.scaleX（从 0~1）
  const scaleX = useMotionValue(0)
  React.useEffect(() => {
    // 监听 progressMv，转为 0~1，并做短时缓动（避免锯齿）
    const unsub = progressMv.on('change', (v) => {
      const target = Math.max(0, Math.min(100, v)) / 100
      // 用 framer-motion animate 驱动（tween），不会触发组件重渲染
      animate(scaleX, target, {
        type: 'tween',
        ease: 'easeOut',
        duration: 0.16,
      })
    })
    return () => unsub()
  }, [progressMv, scaleX])

  // ===== 节拍参数在“减少动效”时放缓 =====
  const spinS = reduce ? spinSeconds * 1.5 : spinSeconds
  const breatheS = reduce ? breatheSeconds * 1.5 : breatheSeconds
  const gradientS = reduce ? gradientSeconds * 1.5 : gradientSeconds

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
        <NavbarOriginLogo
          size={logoSize}
          spinSeconds={spinS}
          breatheSeconds={breatheS}
          gradientSeconds={gradientS}
          // 如果你的 Logo 支持不同渲染模式，保留此属性；否则可删除
          // @ts-ignore
          mode="hybrid"
          title="Xorigo Origin"
        />
      </motion.div>

      {/* 进度条：确定式(按 duration) 或 不定式(滑动高亮) */}
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
            aria-valuenow={ariaNow}
            aria-label="加载进度"
          >
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
              style={{ width: '100%', transformOrigin: '0 50%', scaleX }}
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
