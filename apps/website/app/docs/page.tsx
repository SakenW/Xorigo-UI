import { Metadata } from 'next'
import Link from 'next/link'
import { readonlyRegistry } from '@/data/registry.readonly'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, BarChart3, Input, Layout, MessageSquare, Navigation, Palette, Shield, Stack } from 'lucide-react'

export const metadata: Metadata = {
  title: '组件文档 - Xorigo UI',
  description: 'Xorigo UI 组件库完整文档，基于白皮书 v1.0 分类体系，包含所有组件的使用指南和示例',
  keywords: ['UI组件', 'React组件', '设计系统', 'Xorigo UI', '组件分类'],
}

export default async function DocsPage() {
  // 使用 Data Layer 获取组件数据
  const components = readonlyRegistry.getComponents()
  const categoryDefinitions = readonlyRegistry.getCategories()
  const validCategories = readonlyRegistry.getValidCategories()

  // 获取统计信息
  const totalComponents = components.length
  const totalCategories = validCategories.length

  // 分类图标映射
  const categoryIcons: Record<string, any> = {
    ui: Stack,
    inputs: Input,
    forms: Layout,
    navigation: Navigation,
    layout: Layout,
    feedback: MessageSquare,
    overlays: Shield,
    datadisplay: BarChart3,
    charts: BarChart3,
    utilities: Palette
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <Badge variant="secondary" className="mb-4">
                白皮书 v1.0 分类体系
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight">
                组件文档
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Xorigo UI 组件库完整文档，基于白皮书分类体系
                <br />
                包含 {totalComponents} 个组件和 {totalCategories} 个分类
              </p>
            </div>

            {/* 统计信息 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary">{totalComponents}</div>
                  <div className="text-sm text-muted-foreground mt-1">总组件数</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-secondary-foreground">{totalCategories}</div>
                  <div className="text-sm text-muted-foreground mt-1">组件分类</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-muted-foreground mt-1">TypeScript 覆盖</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-blue-600">v1.0</div>
                  <div className="text-sm text-muted-foreground mt-1">白皮书版本</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 组件分类 */}
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">组件分类</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              基于白皮书 v1.0 的十分类体系，覆盖从基础UI到技术基元的完整组件生态
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryDefinitions
              .filter(category => validCategories.includes(category.id as any))
              .map((category) => {
                const Icon = categoryIcons[category.id] || Stack
                const categoryComponents = readonlyRegistry.getComponentsByCategory(category.id as any)
                const componentCount = categoryComponents.length

                return (
                  <Card key={category.id} className="group hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-primary/20">
                    <CardHeader className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: category.color || '#6366f1' }}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {category.name}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {category.id}
                            </CardDescription>
                          </div>
                        </div>
                        {componentCount > 0 && (
                          <Badge variant="secondary">
                            {componentCount}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {category.description}
                      </p>

                      {componentCount > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">包含组件:</span>
                            <Badge variant="outline" className="text-xs">
                              {componentCount} 个
                            </Badge>
                          </div>

                          {/* 组件预览标签 */}
                          <div className="flex flex-wrap gap-1">
                            {categoryComponents.slice(0, 3).map((component) => (
                              <Badge key={component.id} variant="secondary" className="text-xs">
                                {component.title}
                              </Badge>
                            ))}
                            {componentCount > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{componentCount - 3} 更多
                              </Badge>
                            )}
                          </div>

                          <Link href={`/docs/components/${category.id}`}>
                            <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              查看组件
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </div>
      </div>

      {/* 七轴概览 */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">七轴分类概览</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                按功能维度组织的组件分类，帮助快速找到所需组件
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  axis: 'presentation',
                  name: '呈现（UI）',
                  categories: ['ui', 'datadisplay', 'overlays', 'charts'],
                  description: '视觉原子组件和数据展示'
                },
                {
                  axis: 'interaction',
                  name: '行为（Interaction）',
                  categories: ['inputs', 'forms', 'feedback'],
                  description: '用户交互和输入控件'
                },
                {
                  axis: 'structure',
                  name: '结构（Structure）',
                  categories: ['layout', 'navigation'],
                  description: '页面布局和导航结构'
                },
                {
                  axis: 'composition',
                  name: '复合（Composition）',
                  categories: ['patterns'],
                  description: '复合模式和场景组件'
                },
                {
                  axis: 'design',
                  name: '语义（Design Tokens）',
                  categories: ['tokens'],
                  description: '设计令牌和语义系统'
                },
                {
                  axis: 'logic',
                  name: '逻辑（Logic）',
                  categories: ['utilities'],
                  description: '底层技术组件和基元'
                },
                {
                  axis: 'i18n',
                  name: '国际化（I18n）',
                  categories: ['i18n'],
                  description: '国际化和本地化组件'
                }
              ].map(({ axis, name, categories, description }) => (
                <Card key={axis}>
                  <CardHeader>
                    <CardTitle className="text-lg">{name}</CardTitle>
                    <CardDescription>{axis}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{description}</p>
                    <div className="space-y-2">
                      {categories.map((cat) => {
                        const catDef = categoryDefinitions.find(c => c.id === cat)
                        const components = readonlyRegistry.getComponentsByCategory(cat as any)
                        return (
                          <div key={cat} className="flex items-center justify-between">
                            <span className="text-sm">{catDef?.name || cat}</span>
                            <Badge
                              variant={components.length > 0 ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {components.length}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 快速导航 */}
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">快速导航</h2>
            <p className="text-muted-foreground">快速访问常用功能和页面</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>开发工具</CardTitle>
                <CardDescription>开发和测试工具</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/playground">
                  <Button variant="outline" className="w-full justify-start">
                    组件 Playground
                  </Button>
                </Link>
                <Link href="/tokens">
                  <Button variant="outline" className="w-full justify-start">
                    设计令牌浏览器
                  </Button>
                </Link>
                <Link href="/adoption">
                  <Button variant="outline" className="w-full justify-start">
                    适配矩阵
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>设计系统</CardTitle>
                <CardDescription>设计规范和指南</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/themes">
                  <Button variant="outline" className="w-full justify-start">
                    主题系统
                  </Button>
                </Link>
                <Link href="/patterns">
                  <Button variant="outline" className="w-full justify-start">
                    设计模式
                  </Button>
                </Link>
                <Link href="/guidelines">
                  <Button variant="outline" className="w-full justify-start">
                    设计指南
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>开发者资源</CardTitle>
                <CardDescription>开发文档和资源</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/api">
                  <Button variant="outline" className="w-full justify-start">
                    API 参考
                  </Button>
                </Link>
                <Link href="/migration">
                  <Button variant="outline" className="w-full justify-start">
                    迁移指南
                  </Button>
                </Link>
                <Link href="/examples">
                  <Button variant="outline" className="w-full justify-start">
                    示例项目
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}