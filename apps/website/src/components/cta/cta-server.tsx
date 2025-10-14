import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Star,
  Github,
  BookOpen,
  Users,
  Zap,
  CheckCircle,
  Sparkles
} from '@/components/ui/lucide-icons'
import { CTAClient } from './cta-client'

const ctaFeatures = [
  { icon: CheckCircle, text: '开箱即用的 39+ 高质量组件' },
  { icon: CheckCircle, text: 'TypeScript 支持，完整的类型定义' },
  { icon: CheckCircle, text: 'WCAG AA 可访问性标准合规' },
  { icon: CheckCircle, text: '10 种内置主题，支持深色/浅色模式' },
  { icon: CheckCircle, text: '基于 Framer Motion 的动画系统' },
  { icon: CheckCircle, text: '响应式设计，移动优先' }
]

const communityStats = [
  { value: '10K+', label: '开发者' },
  { value: '50K+', label: '月下载量' },
  { value: '1.2K+', label: 'GitHub Stars' },
  { value: '99%', label: '满意度' }
]

/**
 * CTA 服务端组件 - 静态内容展示
 * 表单交互和按钮点击委托给客户端组件
 */
export function CTAServer() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="max-w-7xl mx-auto">
        {/* 主要 CTA 区域 */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-blue-500" />
            <Badge variant="default" className="text-sm font-medium">
              开始使用
            </Badge>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl mb-6">
            准备好提升你的
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              开发体验了吗？
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            加入数千名开发者的行列，使用 Xorigo UI 构建美观、可访问、高性能的 Web 应用
          </p>

          {/* 主要按钮组 - 委托给客户端组件 */}
          <CTAClient />

          {/* 社区统计 */}
          <div className="flex flex-wrap justify-center gap-8">
            {communityStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 特性展示 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* 左侧特性列表 */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              为什么选择 Xorigo UI？
            </h3>
            <div className="space-y-4">
              {ctaFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature.text}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 右侧订阅表单 - 委托给客户端组件 */}
          <CTAClient showSubscription={true} />
        </div>

        {/* 底部快速链接 */}
        <div className="text-center">
          <div className="inline-flex items-center gap-8 text-sm text-gray-600 dark:text-gray-400">
            <a
              href="/docs"
              className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              文档
            </a>
            <a
              href="/workbench"
              className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Zap className="h-4 w-4" />
              Workbench
            </a>
            <a
              href="/workbench?mode=gallery"
              className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              组件库
            </a>
            <a
              href="https://github.com/xorigo-ui/xorigo-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}