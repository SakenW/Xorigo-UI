import React from 'react'
import { GradientText } from './GradientText'
import { GradientBackground } from './GradientBackground'
import { GradientBorder } from './GradientBorder'
import { GradientOverlay } from './GradientOverlay'

// 扩展的渐变预设方案
export const extendedGradientPresets = {
  // === 品牌色彩系 ===

  // 经典紫色到青色（Xorigo UI 主色调）
  purpleCyan: {
    from: 'from-purple-400',
    via: 'via-purple-500',
    to: 'to-cyan-400',
    description: '经典紫色到青色渐变',
    usage: '品牌主色调，适用于标题、按钮、卡片等主要元素'
  },

  // 深紫到蓝
  purpleBlue: {
    from: 'from-purple-600',
    via: 'via-purple-700',
    to: 'to-blue-600',
    description: '深紫色到蓝色渐变',
    usage: '深色主题背景，导航栏，侧边栏'
  },

  // === 自然色彩系 ===

  // 日落渐变
  sunset: {
    from: 'from-orange-400',
    via: 'via-pink-500',
    to: 'to-purple-600',
    description: '温暖的日落渐变',
    usage: '背景装饰，英雄区域，促销横幅'
  },

  // 海洋渐变
  ocean: {
    from: 'from-blue-400',
    via: 'via-cyan-500',
    to: 'to-teal-600',
    description: '清新的海洋渐变',
    usage: '科技感背景，数据可视化，清爽主题'
  },

  // 森林渐变
  forest: {
    from: 'from-green-400',
    via: 'via-emerald-500',
    to: 'to-teal-600',
    description: '自然的森林渐变',
    usage: '环保主题，健康应用，自然背景'
  },

  // === 火热色彩系 ===

  // 火焰渐变
  fire: {
    from: 'from-red-500',
    via: 'via-orange-500',
    to: 'to-yellow-500',
    description: '热烈的火焰渐变',
    usage: '警告提示，重要通知，促销标签'
  },

  // 热情渐变
  passion: {
    from: 'from-red-600',
    via: 'via-pink-600',
    to: 'to-rose-600',
    description: '热情的红色渐变',
    usage: '爱情主题，节日装饰，紧急提示'
  },

  // === 优雅色彩系 ===

  // 星空渐变
  galaxy: {
    from: 'from-indigo-500',
    via: 'via-purple-500',
    to: 'to-pink-500',
    description: '梦幻的星空渐变',
    usage: '创意背景，艺术设计，夜间主题'
  },

  // 黄金渐变
  gold: {
    from: 'from-yellow-400',
    via: 'via-amber-500',
    to: 'to-orange-500',
    description: '奢华的金色渐变',
    usage: '高端产品，VIP标识，成就徽章'
  },

  // === 科技色彩系 ===

  // 赛博朋克
  cyberpunk: {
    from: 'from-purple-500',
    via: 'via-pink-500',
    to: 'to-cyan-500',
    description: '赛博朋克风格渐变',
    usage: '科技主题，游戏界面，未来感设计'
  },

  // 数字蓝
  digitalBlue: {
    from: 'from-blue-500',
    via: 'via-blue-600',
    to: 'to-indigo-700',
    description: '数字蓝色渐变',
    usage: '企业应用，数据平台，专业界面'
  },

  // === 单色系 ===

  // 灰阶渐变
  monochrome: {
    from: 'from-gray-400',
    via: 'via-gray-600',
    to: 'to-gray-800',
    description: '经典灰阶渐变',
    usage: '简约设计，中性背景，分隔区域'
  },

  // 暗夜渐变
  darkNight: {
    from: 'from-gray-900',
    via: 'via-gray-800',
    to: 'to-gray-700',
    description: '深色夜晚渐变',
    usage: '深色主题，夜间模式，背景渐变'
  }
}

// 渐变预设组件属性类型
export type GradientPresetKey = keyof typeof extendedGradientPresets

// 渐变预设组件接口
export interface GradientPresetProps {
  preset: GradientPresetKey
  type?: 'text' | 'background' | 'border' | 'overlay'
  children?: React.ReactNode
  className?: string
  animated?: boolean
  opacity?: number
}

// 统一的渐变预设组件
export const GradientPreset: React.FC<GradientPresetProps> = ({
  preset,
  type = 'background',
  children,
  className,
  animated = false,
  opacity = 1,
  ...props
}) => {
  const presetConfig = extendedGradientPresets[preset]

  if (!presetConfig) {
    console.warn(`Gradient preset "${preset}" not found`)
    return null
  }

  const colors = {
    from: presetConfig.from,
    via: presetConfig.via,
    to: presetConfig.to
  }

  switch (type) {
    case 'text':
      return (
        <GradientText
          preset={preset as any}
          animated={animated}
          className={className}
          {...props}
        >
          {children}
        </GradientText>
      )

    case 'border':
      return (
        <GradientBorder
          preset={preset as any}
          animated={animated}
          className={className}
          {...props}
        >
          {children}
        </GradientBorder>
      )

    case 'overlay':
      return (
        <GradientOverlay
          colors={colors}
          animated={animated}
          opacity={opacity}
          className={className}
          {...props}
        />
      )

    case 'background':
    default:
      return (
        <GradientBackground
          colors={colors}
          animated={animated}
          opacity={opacity}
          className={className}
          {...props}
        >
          {children}
        </GradientBackground>
      )
  }
}

// 预设选择器组件
export interface GradientPresetSelectorProps {
  selectedPreset?: GradientPresetKey
  onPresetChange: (preset: GradientPresetKey) => void
  className?: string
}

export const GradientPresetSelector: React.FC<GradientPresetSelectorProps> = ({
  selectedPreset = 'purpleCyan',
  onPresetChange,
  className
}) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {Object.entries(extendedGradientPresets).map(([key, config]) => (
        <div
          key={key}
          className={`
            relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200
            hover:scale-105 hover:shadow-lg
            ${selectedPreset === key ? 'ring-2 ring-purple-500 ring-offset-2' : ''}
          `}
          onClick={() => onPresetChange(key as GradientPresetKey)}
        >
          <div
            className={`
              h-16 w-full ${config.from} ${config.via} ${config.to}
              bg-gradient-to-r
            `}
          />
          <div className="p-2 bg-white dark:bg-gray-800">
            <div className="text-xs font-medium text-gray-900 dark:text-white">
              {key}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {config.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// 渐变预设展示组件
export interface GradientPresetShowcaseProps {
  className?: string
  filterCategories?: Array<'brand' | 'nature' | 'fire' | 'elegant' | 'tech' | 'mono'>
}

export const GradientPresetShowcase: React.FC<GradientPresetShowcaseProps> = ({
  className,
  filterCategories
}) => {
  const allPresets = Object.entries(extendedGradientPresets)

  const filteredPresets = allPresets.filter(([key, config]) => {
    if (!filterCategories || filterCategories.length === 0) return true

    const categoryMap = {
      brand: ['purpleCyan', 'purpleBlue'],
      nature: ['sunset', 'ocean', 'forest'],
      fire: ['fire', 'passion'],
      elegant: ['galaxy', 'gold'],
      tech: ['cyberpunk', 'digitalBlue'],
      mono: ['monochrome', 'darkNight']
    }

    return filterCategories.some(category =>
      categoryMap[category]?.includes(key)
    )
  })

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {filteredPresets.map(([key, config]) => (
        <div key={key} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* 渐变预览区域 */}
          <div className={`h-32 ${config.from} ${config.via} ${config.to} bg-gradient-to-r relative`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <GradientText
                preset={key as any}
                className="text-2xl font-bold"
              >
                {key}
              </GradientText>
            </div>
          </div>

          {/* 信息区域 */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {config.description}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {config.usage}
            </p>

            {/* 颜色代码 */}
            <div className="space-y-1">
              <div className="text-xs font-mono bg-gray-100 dark:bg-gray-700 rounded p-2">
                {config.from} {config.via} {config.to}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default GradientPreset