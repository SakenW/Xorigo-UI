'use client'

import React from 'react'
import { motion } from 'framer-motion'

export type Size = 'sm' | 'md' | 'lg' | 'xl'
export type AsTag = 'h1' | 'h2' | 'h3' | 'div'

export interface HeroTitleProps {
  /** 标题文字（也可用 children 传入富文本） */
  text?: string
  /** 自定义标签（默认 h1） */
  as?: AsTag
  /** 尺寸预设 */
  size?: Size
  /** 自定义类名 */
  className?: string
  /** 是否显示光束效果层（包含主光束和副光束） */
  shine?: boolean
  /** 是否显示脉冲光晕层 */
  glow?: boolean
  /** 是否显示 3D 透视效果 */
  enable3D?: boolean
  /** 渐变颜色序列（CSS 变量或颜色值均可） */
  gradientStops?: string[]
  /** 主光束颜色（影响亮度层） */
  beamColor?: string
  /** 副光束颜色 */
  beamSecondaryColor?: string
  /** 光晕颜色 */
  glowColor?: string
  /** 动画总时长（基础值） */
  flowDurationSec?: number
  /** 主光束动画时长 */
  beamDuration?: number
  /** 副光束动画时长 */
  beamSecondaryDuration?: number
  /** 光晕动画时长 */
  glowDuration?: number
  /** 入场动画延迟时间 */
  entranceDelay?: number
  /** 无障碍：读屏文本（不传则用纯文本内容） */
  ariaLabel?: string
  /** 子内容，优先于 text，可放入内联元素 */
  children?: React.ReactNode
}

/**
 * HeroTitle 超炫彩标题组件（文本可插拔）
 *
 * 支持多层动画效果、3D透视、光束流动、脉冲光晕
 *
 * 用法示例：
 * ```tsx
 * // 基础用法
 * <HeroTitle text="Xorigo UI" />
 *
 * // 富文本支持
 * <HeroTitle>任意 <em>富文本</em> 标题</HeroTitle>
 *
 * // 自定义配色
 * <HeroTitle text="自定义配色" gradientStops={['#3b82f6', '#8b5cf6', '#ec4899']} />
 *
 * // 完整配置
 * <HeroTitle
 *   text="Xorigo UI"
 *   size="xl"
 *   shine={true}
 *   glow={true}
 *   enable3D={true}
 *   gradientStops={['#a855f7', '#ec4899', '#06b6d4', '#10b981', '#f59e0b']}
 *   flowDurationSec={25}
 *   entranceDelay={0.2}
 * />
 * ```
 */
export const HeroTitle: React.FC<HeroTitleProps> = ({
  text,
  as = 'h1',
  size = 'xl',
  className = '',
  shine = true,
  glow = true,
  enable3D = true,
  gradientStops = [
    '#a855f7', // purple-500
    '#ec4899', // pink-500
    '#06b6d4', // cyan-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#ec4899', // pink-500 (back to pink)
    '#a855f7', // purple-500
    '#06b6d4', // cyan-500
    '#a855f7', // purple-500 (cycle complete)
  ],
  beamColor = 'rgba(255,255,255,0.5)',
  beamSecondaryColor = 'rgba(139, 92, 246, 0.4)',
  glowColor = 'rgba(6, 182, 212, 0.3)',
  flowDurationSec = 25,
  beamDuration = 4,
  beamSecondaryDuration = 6,
  glowDuration = 5,
  entranceDelay = 0.2,
  ariaLabel,
  children,
}) => {
  // 文字来源：children > text > 占位
  const content = children ?? text ?? 'Hero Title'

  // 尺寸映射（Tailwind 类）
  const sizeClass: Record<Size, string> = {
    sm: 'text-4xl md:text-5xl lg:text-6xl',
    md: 'text-5xl md:text-6xl lg:text-7xl',
    lg: 'text-6xl md:text-7xl lg:text-8xl',
    xl: 'text-7xl md:text-8xl lg:text-9xl',
  }

  // 组装线性渐变
  const gradient = `linear-gradient(110deg, ${gradientStops.join(', ')})`

  const Tag = as as React.ElementType

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: entranceDelay }}
      aria-label={ariaLabel ?? (typeof content === 'string' ? content : undefined)}
    >
      {/* 外层留白避免溢出裁切 */}
      <div className={`relative px-6 py-6 overflow-visible ${className}`}>
        <Tag
          className={`${sizeClass[size]} font-bold mb-12 leading-relaxed`}
          style={{
            perspective: enable3D ? '800px' : undefined,
            transformStyle: enable3D ? 'preserve-3d' : undefined,
            lineHeight: '1.3'
          }}
        >
          {/* 3D 效果增强层 */}
          {enable3D && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                textShadow: '0px 4px 8px rgba(0,0,0,0.4)',
                filter: 'blur(0.3px)'
              }}
            />
          )}
          <motion.span
            className="inline-block relative pb-4"
            animate={enable3D ? {
              rotateX: [0, 12, 0, 0, 0],
              rotateY: [0, 0, 0, 8, 0],
              scale: [1, 1.05, 1, 1, 1]
            } : {}}
            transition={enable3D ? {
              rotateX: {
                duration: 10,
                ease: 'easeInOut',
                repeat: Infinity,
                times: [0, 0.3, 0.4, 0.6, 1]
              },
              rotateY: {
                duration: 8,
                ease: 'easeInOut',
                repeat: Infinity,
                times: [0, 0.3, 0.5, 0.7, 1]
              },
              scale: {
                duration: 6,
                ease: 'easeInOut',
                repeat: Infinity,
                times: [0, 0.2, 0.4, 0.8, 1]
              }
            } : {}}
          >
            {/* 第1层：基础渐变文字（无缝流动） */}
            <motion.div
              className="relative"
              style={{
                background: gradient,
                backgroundSize: '400% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '200% 50%', '300% 50%', '400% 50%'] }}
              transition={{ duration: flowDurationSec, ease: 'linear', repeat: Infinity }}
            >
              {content}
            </motion.div>

            {/* 第2层：主光束（可关） */}
            {shine && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${beamColor} 50%, transparent 100%)`,
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  mixBlendMode: 'overlay',
                }}
                animate={{ backgroundPosition: ['-200% 0%', '200% 0%'] }}
                transition={{ duration: beamDuration, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.5 }}
              >
                {content}
              </motion.div>
            )}

            {/* 第3层：副光束（反向，可关） */}
            {shine && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${beamSecondaryColor} 50%, transparent 100%)`,
                  backgroundSize: '150% 100%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  mixBlendMode: 'screen',
                }}
                animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
                transition={{ duration: beamSecondaryDuration, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
              >
                {content}
              </motion.div>
            )}

            {/* 第4层：脉冲光晕（可关） */}
            {glow && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  mixBlendMode: 'color-dodge',
                }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{
                  duration: glowDuration,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatDelay: 0.8
                }}
              >
                {content}
              </motion.div>
            )}
          </motion.span>
        </Tag>
      </div>
    </motion.div>
  )
}

HeroTitle.displayName = 'HeroTitle'