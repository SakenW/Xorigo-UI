'use client'

import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

/**
 * 业务场景卡片变体配置
 */
const businessScenarioCardVariants = cva(
  'group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl cursor-pointer',
  {
    variants: {
      variant: {
        default: [
          'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
          'hover:border-blue-300 dark:hover:border-blue-600',
          'hover:shadow-blue-500/10'
        ],
        primary: [
          'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20',
          'border-blue-200 dark:border-blue-800',
          'hover:border-blue-400 dark:hover:border-blue-600',
          'hover:shadow-blue-500/20'
        ],
        secondary: [
          'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20',
          'border-green-200 dark:border-green-800',
          'hover:border-green-400 dark:hover:border-green-600',
          'hover:shadow-green-500/20'
        ],
        accent: [
          'bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20',
          'border-purple-200 dark:border-purple-800',
          'hover:border-purple-400 dark:hover:border-purple-600',
          'hover:shadow-purple-500/20'
        ]
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
)

export interface BusinessScenario {
  id: string
  title: string
  description: string
  icon: string
  category: 'prototype' | 'business' | 'data' | 'layout'
  color: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'indigo'
  solutions: SolutionTemplate[]
  popularity: number // 0-100
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
}

export interface SolutionTemplate {
  id: string
  name: string
  description: string
  components: string[]
  codeAvailable: boolean
}

interface BusinessScenarioCardProps extends VariantProps<typeof businessScenarioCardVariants> {
  scenario: BusinessScenario
  onClick?: (scenario: BusinessScenario) => void
  className?: string
}

export function BusinessScenarioCard({
  scenario,
  onClick,
  variant,
  size,
  className
}: BusinessScenarioCardProps) {

  const getVariantFromColor = (color: string) => {
    switch (color) {
      case 'blue': return 'primary'
      case 'green': return 'secondary'
      case 'purple':
      case 'pink': return 'accent'
      default: return 'default'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
      case 'intermediate': return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20'
      case 'advanced': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20'
    }
  }

  const getPopularityHeat = (popularity: number) => {
    if (popularity >= 80) return '🔥 热门'
    if (popularity >= 60) return '⭐ 推荐'
    if (popularity >= 40) return '📈 常用'
    return '💡 新功能'
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(scenario)}
      className={cn(
        businessScenarioCardVariants({
          variant: variant || getVariantFromColor(scenario.color),
          size
        }),
        className
      )}
    >
      {/* 热度指示器 */}
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
          <span className="text-lg">{getPopularityHeat(scenario.popularity).split(' ')[0]}</span>
          <span className="text-gray-600 dark:text-gray-400">
            {getPopularityHeat(scenario.popularity).split(' ')[1]}
          </span>
        </span>
      </div>

      {/* 主要内容 */}
      <div className="flex flex-col h-full">
        {/* 图标和标题 */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-white/50 to-white/10 dark:from-gray-800/50 dark:to-gray-900/10 flex items-center justify-center text-2xl border border-white/20 dark:border-gray-700/20 backdrop-blur-sm">
            {scenario.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {scenario.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {scenario.description}
            </p>
          </div>
        </div>

        {/* 解决方案预览 */}
        <div className="mb-4">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            包含解决方案 ({scenario.solutions.length})
          </div>
          <div className="space-y-1">
            {scenario.solutions.slice(0, 3).map((solution) => (
              <div
                key={solution.id}
                className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400"></div>
                <span className="truncate">{solution.name}</span>
                {solution.codeAvailable && (
                  <span className="text-green-500 dark:text-green-400">✓</span>
                )}
              </div>
            ))}
            {scenario.solutions.length > 3 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                +{scenario.solutions.length - 3} 个更多解决方案...
              </div>
            )}
          </div>
        </div>

        {/* 底部信息 */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          {/* 难度和时间 */}
          <div className="flex items-center gap-3">
            <span className={cn(
              'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full',
              getDifficultyColor(scenario.difficulty)
            )}>
              {scenario.difficulty === 'beginner' && '🎯'}
              {scenario.difficulty === 'intermediate' && '🚀'}
              {scenario.difficulty === 'advanced' && '⚡'}
              {scenario.difficulty}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {scenario.estimatedTime}
            </span>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
            <button
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="查看详情"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
              title="立即使用"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 悬浮效果背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </motion.div>
  )
}