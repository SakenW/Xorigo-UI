import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Palette,
  Eye,
  Layers,
  Type,
  Sparkles,
  Copy,
  CheckCircle,
  Zap,
  Globe,
  Settings,
  ArrowRight
} from 'lucide-react'

export const metadata: Metadata = {
  title: '设计令牌 | Xorigo UI',
  description: '探索 Xorigo UI 的设计令牌系统，包含颜色、字体、间距等设计变量的完整定义',
  keywords: ['Xorigo UI', '设计令牌', 'Design Tokens', '设计系统', '变量'],
}

export default function TokensPage() {
  const tokenCategories = [
    {
      title: '颜色令牌',
      description: '基于 OKLCH 颜色空间的现代颜色系统',
      icon: Palette,
      items: [
        { name: 'Primary Colors', value: '#3B82F6', description: '主要颜色系列' },
        { name: 'Semantic Colors', value: '#EF4444', description: '语义化颜色' },
        { name: 'Neutral Colors', value: '#6B7280', description: '中性色系列' },
        { name: 'Surface Colors', value: '#F9FAFB', description: '背景和表面颜色' }
      ]
    },
    {
      title: '字体令牌',
      description: '完整的排版系统，支持多种字重和大小',
      icon: Type,
      items: [
        { name: 'Font Families', value: 'Inter, sans-serif', description: '字体族定义' },
        { name: 'Font Sizes', value: '14px - 64px', description: '字体大小范围' },
        { name: 'Font Weights', value: '400 - 800', description: '字重范围' },
        { name: 'Line Heights', value: '1.25 - 2', description: '行高系统' }
      ]
    },
    {
      title: '间距令牌',
      description: '一致的间距系统，确保视觉和谐',
      icon: Layers,
      items: [
        { name: 'Spacing Scale', value: '4px - 128px', description: '间距刻度' },
        { name: 'Component Spacing', value: '8px - 32px', description: '组件间距' },
        { name: 'Layout Spacing', value: '16px - 64px', description: '布局间距' },
        { name: 'Section Spacing', value: '64px - 192px', description: '区块间距' }
      ]
    }
  ]

  const features = [
    {
      icon: Eye,
      title: '感知均匀',
      description: '基于 OKLCH 颜色空间，确保颜色变化在视觉上是均匀的'
    },
    {
      icon: Globe,
      title: '国际化支持',
      description: '支持多种语言的排版需求，包括中文优化'
    },
    {
      icon: Zap,
      title: '动态切换',
      description: '支持深色/浅色模式的无缝切换'
    },
    {
      icon: Settings,
      title: '可定制',
      description: '所有令牌都可以覆盖和自定义，满足品牌需求'
    }
  ]

  const usageExamples = [
    {
      title: '在组件中使用',
      code: `import { colors } from '@xorigo-ui/tokens'

const Button = styled.button\`
  background-color: \${colors.primary[500]};
  color: \${colors.text.onPrimary};
  padding: \${tokens.spacing[16]} \${tokens.spacing[24]};
\``,
      language: 'typescript'
    },
    {
      title: '在 CSS 中使用',
      code: `.button {
  background-color: var(--color-primary-500);
  color: var(--color-text-on-primary);
  padding: var(--spacing-16) var(--spacing-24);
  font-family: var(--font-sans);
}`,
      language: 'css'
    },
    {
      title: '主题定制',
      code: `const customTheme = {
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a',
    }
  }
}`,
      language: 'typescript'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-8"
          >
            ← 返回首页
          </Link>

          <div className="inline-flex items-center gap-2 mb-6">
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
              设计系统
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              OKLCH 颜色
            </Badge>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-6xl mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              设计令牌
            </span>
            <br />
            系统
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
            完整的设计令牌系统，确保视觉一致性和可维护性。基于现代标准，支持动态主题切换。
          </p>
        </div>

        {/* Token Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tokenCategories.map((category, index) => {
            const Icon = category.icon
            return (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {category.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900 dark:text-white">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.description}
                        </div>
                      </div>
                      <div className="ml-3 px-2 py-1 bg-white dark:bg-gray-700 rounded text-xs font-mono text-gray-700 dark:text-gray-300">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              核心特性
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              现代化的设计令牌系统，提供强大的功能
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              使用示例
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              了解如何在项目中使用设计令牌
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {usageExamples.map((example, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{example.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{example.code}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={() => navigator.clipboard.writeText(example.code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Token Browser */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              令牌浏览器
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  颜色令牌预览
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { color: 'bg-blue-500', label: 'Primary' },
                    { color: 'bg-green-500', label: 'Success' },
                    { color: 'bg-yellow-500', label: 'Warning' },
                    { color: 'bg-red-500', label: 'Error' },
                    { color: 'bg-purple-500', label: 'Purple' },
                    { color: 'bg-pink-500', label: 'Pink' },
                    { color: 'bg-gray-500', label: 'Gray' },
                    { color: 'bg-indigo-500', label: 'Indigo' }
                  ].map((color, index) => (
                    <div key={index} className="text-center">
                      <div className={`w-full h-12 ${color.color} rounded-lg mb-1`} />
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {color.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  间距令牌预览
                </h3>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 6, 8].map((spacing, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="text-sm text-gray-600 dark:text-gray-400 w-16">
                        {spacing * 4}px
                      </div>
                      <div
                        className="bg-blue-500 rounded"
                        style={{ width: `${spacing * 8}px`, height: '8px' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              开始使用设计令牌
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              在你的项目中集成 Xorigo UI 设计令牌，体验一致的设计系统
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100"
                onClick={() => window.location.href = '/docs'}
              >
                查看文档
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-purple-600"
                onClick={() => window.open('https://github.com/xorigo-ui/xorigo-ui', '_blank')}
              >
                GitHub 仓库
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}