import { Card, CardContent } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import {
  Palette,
  Layout,
  Zap,
  Accessibility,
  Code,
  Shield,
  Sparkles,
  Globe,
  Layers,
  Type
} from 'lucide-react'
import { FeaturesClient } from './features-client'

const features = [
  {
    icon: Sparkles,
    title: '样式配方系统',
    description: '七轴样式配方系统，提供无限的样式组合可能性',
    badge: '创新',
    color: 'blue'
  },
  {
    icon: Palette,
    title: 'OKLCH 颜色引擎',
    description: '基于 OKLCH 颜色空间的现代颜色系统，支持感知均匀',
    badge: '色彩',
    color: 'green'
  },
  {
    icon: Layout,
    title: '39个核心组件',
    description: '完整的 UI 组件库，覆盖所有常见使用场景',
    badge: '组件',
    color: 'purple'
  },
  {
    icon: Zap,
    title: 'Framer Motion 动画',
    description: '内置 Framer Motion 12 动画系统，流畅的交互体验',
    badge: '动画',
    color: 'orange'
  },
  {
    icon: Accessibility,
    title: 'WCAG AA 标准',
    description: '完全符合 WCAG AA 无障碍标准，包容性设计',
    badge: '无障碍',
    color: 'indigo'
  },
  {
    icon: Shield,
    title: 'TypeScript 支持',
    description: '完整的 TypeScript 类型定义，优秀的开发体验',
    badge: '类型安全',
    color: 'red'
  },
  {
    icon: Code,
    title: '代码质量',
    description: '高质量的代码实现，通过严格的测试验证',
    badge: '质量',
    color: 'cyan'
  },
  {
    icon: Globe,
    title: '国际化支持',
    description: '内置 i18n 国际化系统，中文优先的多语言支持',
    badge: '多语言',
    color: 'teal'
  }
]

/**
 * Features 服务端组件 - 静态内容展示
 * 悬停交互委托给客户端组件
 */
export function FeaturesServer() {
  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    indigo: 'from-indigo-500 to-indigo-600',
    red: 'from-red-500 to-red-600',
    cyan: 'from-cyan-500 to-cyan-600',
    teal: 'from-teal-500 to-teal-600'
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            核心特性
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Xorigo UI 提供了现代化的组件库开发体验
          </p>
        </div>

        {/* 特性卡片 - 委托给客户端组件处理交互 */}
        <FeaturesClient features={features} colorMap={colorMap} />

        {/* 底部统计 */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span>7轴配方</span>
            </div>
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span>类型安全</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>无障碍设计</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}