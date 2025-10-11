'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@th-ui/core'
import { Button } from '@th-ui/core'
import { Badge } from '@th-ui/core'
import {
  Palette,
  Layout,
  Zap,
  Accessibility,
  Code,
  Shield,
  Sparkles,
  Globe,
  ArrowRight
} from 'lucide-react'

const featuredFeatures = [
  { name: 'TypeScript 支持', description: '完整的类型定义和智能提示', icon: Code },
  { name: '可访问性', description: 'WCAG AA 标准的无障碍设计', icon: Accessibility },
  { name: '主题系统', description: '七轴样式配方系统，支持深色/浅色模式', icon: Palette },
  { name: '动画系统', description: '基于 Framer Motion 的流畅动画', icon: Zap },
  { name: '响应式设计', description: '移动优先的自适应布局', icon: Shield },
  { name: '国际化', description: '中文优先的多语言支持', icon: Globe }
]

export function ComponentPreview() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-500" />
            <Badge variant="secondary" className="text-sm font-medium">
              39+ 组件
            </Badge>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
            强大的组件库
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            基于 React 19 和 TypeScript 5.9 构建，提供 39+ 高质量组件，
            支持主题定制、动画效果和完整的可访问性
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {featuredFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.name} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-8">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  开始使用 TH-UI
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  探索完整的组件库文档，了解更多使用方法和最佳实践
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="text-base px-8 py-3">
                    查看文档
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline-solid" size="lg" className="text-base px-8 py-3">
                    GitHub
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}