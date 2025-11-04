import React, { useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { cn } from '../utils'
import { ChevronDownIcon } from '../primitives/icon'

/**
 * ComponentCard 组件变体配置
 */
const componentCardVariants = cva(
  // 基础样式 - 极淡边框 + 始终可见的阴影
  'relative flex flex-col rounded-2xl transition-all duration-300 overflow-hidden break-inside-avoid-column group',
  {
    variants: {
      variant: {
        default: [
          'bg-[var(--bg-primary)]',
          // 极淡边框 (5% 透明度黑色) + 默认可见阴影
          'ring-1 ring-inset ring-black/5',
          'shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]',
          'hover:ring-black/10',
          'hover:shadow-[0_8px_24px_rgba(0,0,0,0.12),0_2px_4px_rgba(0,0,0,0.06)]',
          'hover:-translate-y-1',
        ].join(' '),
        elevated: [
          'bg-[var(--bg-primary)]',
          'ring-1 ring-inset ring-black/8',
          'shadow-[0_4px_12px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)]',
          'hover:ring-black/15',
          'hover:shadow-[0_12px_32px_rgba(0,0,0,0.16),0_4px_8px_rgba(0,0,0,0.08)]',
          'hover:-translate-y-1.5',
        ].join(' '),
        ghost: [
          'bg-[var(--bg-secondary)]/20',
          'ring-1 ring-inset ring-black/5',
          'shadow-[0_1px_4px_rgba(0,0,0,0.04)]',
          'hover:bg-[var(--bg-secondary)]/30',
          'hover:ring-black/10',
          'hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]',
          'hover:-translate-y-0.5',
        ].join(' '),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ComponentCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentCardVariants> {
  /** 卡片标题 */
  title: string
  /** 卡片副标题 */
  subtitle?: string
  /** 样式展示区内容（始终可见） */
  showcase: React.ReactNode
  /** 用法代码区内容（可折叠） */
  usage?: React.ReactNode
  /** 初始展开状态 */
  defaultExpanded?: boolean
  /** 展开状态改变回调 */
  onExpandChange?: (expanded: boolean) => void
}

/**
 * ComponentCard - 组件展示卡片
 *
 * 功能特性：
 * - 样式展示区（Showcase）：始终可见，展示所有组件变体/尺寸/状态
 * - 用法代码区（Usage）：可折叠，展开后显示代码示例
 * - 底部展开条交互：微妙的展开/收起触发器
 * - 平滑动画过渡
 * - 瀑布流友好（break-inside-avoid）
 *
 * @example
 * ```tsx
 * <ComponentCard
 *   title="Variants"
 *   subtitle="所有外观一目了然"
 *   showcase={
 *     <div className="flex gap-2">
 *       <Button variant="primary">Primary</Button>
 *       <Button variant="secondary">Secondary</Button>
 *     </div>
 *   }
 *   usage={
 *     <CodeBlock code={`<Button variant="primary">Click me</Button>`} />
 *   }
 * />
 * ```
 */
export const ComponentCard = forwardRef<HTMLDivElement, ComponentCardProps>(
  (
    {
      className,
      variant,
      title,
      subtitle,
      showcase,
      usage,
      defaultExpanded = false,
      onExpandChange,
      ...props
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded)

    /**
     * 切换展开状态
     */
    const toggleExpanded = () => {
      const newState = !isExpanded
      setIsExpanded(newState)
      onExpandChange?.(newState)
    }

    /**
     * 是否有用法区内容
     */
    const hasUsage = Boolean(usage)

    return (
      <div
        ref={ref}
        className={cn(componentCardVariants({ variant }), className)}
        {...props}
      >
        {/* 标题区 - 简洁设计 */}
        <div className="relative px-6 py-5">
          <h3 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* 样式展示区 - 始终可见 */}
        <div className="px-6 pb-6">
          {showcase}
        </div>

        {/* 用法代码区 - 可折叠 */}
        {hasUsage && (
          <>
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                  className="overflow-hidden"
                >
                  {/* 代码区域分隔线 - 极淡渐变 */}
                  <div className="h-px bg-gradient-to-r from-transparent via-black/8 to-transparent" />

                  {/* 代码展示区 - 简洁布局 */}
                  <div className="relative px-6 py-6 bg-gradient-to-b from-black/[0.02] to-transparent">

                    {/* 标题区 - 增强信息层次 */}
                    <div className="flex items-center justify-between mb-4 pl-3">
                      <div className="flex items-center gap-3">
                        {/* 代码图标指示器 */}
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--bg-primary-action)]/10 border border-[var(--bg-primary-action)]/20">
                          <svg className="w-4 h-4 text-[var(--bg-primary-action)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                            代码示例
                          </h4>
                          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                            复制下方代码即可使用
                          </p>
                        </div>
                      </div>

                      {/* 代码语言标签 */}
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--bg-primary-action)]/10 text-[var(--bg-primary-action)] border border-[var(--bg-primary-action)]/20">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          TypeScript
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--bg-secondary-action)]/10 text-[var(--bg-secondary-action)] border border-[var(--bg-secondary-action)]/20">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                          React
                        </span>
                      </div>
                    </div>

                    {/* 代码内容区 */}
                    <div className="pl-3">
                      {usage}
                    </div>

                    {/* 底部提示信息 */}
                    <div className="mt-4 pl-3 flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>代码示例已针对当前主题优化，支持亮暗模式自动切换</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 底部展开条 - 优雅设计 */}
            <button
              type="button"
              onClick={toggleExpanded}
              className={cn(
                'relative flex items-center justify-center gap-2 w-full py-3 px-6',
                'bg-gradient-to-b from-transparent to-black/[0.02]',
                'hover:to-black/[0.04]',
                'text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                'border-t border-black/5',
                'transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-inset',
                'group/expand'
              )}
              aria-expanded={isExpanded}
              aria-controls={`usage-${title}`}
            >

              {/* 展开/收起图标 */}
              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center justify-center"
              >
                <ChevronDownIcon size="sm" />
              </motion.span>

              {/* 展开/收起文本 */}
              <span>
                {isExpanded ? '收起代码示例' : '查看代码示例'}
              </span>

              {/* 快捷键提示 */}
              <span className="ml-auto text-xs text-[var(--text-tertiary)] opacity-0 group-hover/expand:opacity-100 transition-opacity">
                点击展开
              </span>
            </button>
          </>
        )}
      </div>
    )
  }
)

ComponentCard.displayName = 'ComponentCard'
