/**
 * Workbench Gallery Mode 服务端组件
 *
 * 整合两个 Gallery 系统：
 * 1. 组件分类系统 (来自 component-classification.ts)
 * 2. 配方系统 (来自 registry.readonly.ts - 如果存在)
 *
 * 遵循组件源规则：所有UI组件来自 @xorigo-ui/core
 */

import { ComponentCategory, componentCategories } from '@/data/component-classification'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Suspense } from 'react'
import { WorkbenchGalleryClient } from './workbench-gallery-client'

/**
 * Workbench Gallery 服务端组件
 * 负责数据获取和基础布局
 */
export function WorkbenchGalleryServer() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<WorkbenchGallerySkeleton />}>
        <WorkbenchGalleryContent />
      </Suspense>
    </div>
  )
}

/**
 * Gallery 内容组件
 */
function WorkbenchGalleryContent() {
  const totalComponents = componentCategories.reduce((total, cat) => total + cat.components.length, 0)
  const totalCategories = componentCategories.length

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Workbench Gallery
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          统一的组件浏览和实验平台，整合了 Gallery 的可视化展示和 Playground 的编辑功能
        </p>

        {/* 统计信息 */}
        <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span>{totalComponents} 个组件</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>{totalCategories} 个分类</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full" />
            <span>3 种模式</span>
          </div>
        </div>
      </div>

      {/* Gallery 模式选择 */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">浏览模式</h2>
            <p className="text-muted-foreground">选择您想要浏览的内容类型</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 组件分类模式 */}
              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">🎨 组件分类</h3>
                      <p className="text-sm text-muted-foreground">按功能分类浏览 Xorigo UI 组件</p>
                    </div>
                    <Badge variant="default">推荐</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm">
                      基于 9 大分类体系的完整组件库展示：
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {componentCategories.slice(0, 5).map((cat) => (
                        <Badge key={cat.id} variant="outline" className="text-xs">
                          {cat.icon} {cat.name}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="text-xs">
                        +{totalCategories - 5} 更多
                      </Badge>
                    </div>
                    <Button
                      className="w-full mt-4"
                      onClick={() => {
                        // 切换到组件分类视图
                        window.location.href = '/workbench?mode=gallery&view=components'
                      }}
                    >
                      浏览组件分类
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 配方模式 (待实现) */}
              <Card className="border-2 border-muted opacity-75">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">🎨 配方系统</h3>
                      <p className="text-sm text-muted-foreground">七轴样式配方浏览和预览</p>
                    </div>
                    <Badge variant="secondary">即将推出</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm">
                      基于 Mode、Base、Accent、Tone、Density、Motion、Surface 的配方系统
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">20+ 配方</Badge>
                      <Badge variant="outline" className="text-xs">7 维配置</Badge>
                      <Badge variant="outline" className="text-xs">实时预览</Badge>
                    </div>
                    <Button variant="outline" className="w-full mt-4" disabled>
                      配方功能开发中
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 组件分类展示区域 */}
      <WorkbenchGalleryClient categories={componentCategories} />
    </div>
  )
}

/**
 * Gallery 骨架屏
 */
function WorkbenchGallerySkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 标题骨架 */}
      <div className="text-center mb-12">
        <div className="h-12 bg-muted rounded-lg w-1/3 mx-auto mb-4 animate-pulse" />
        <div className="h-6 bg-muted rounded-lg w-1/2 mx-auto animate-pulse" />
      </div>

      {/* 模式选择骨架 */}
      <div className="h-64 bg-muted rounded-lg mb-8 animate-pulse" />

      {/* 分类标签骨架 */}
      <div className="grid grid-cols-10 gap-2 mb-8">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="h-10 bg-muted rounded-lg animate-pulse"
          />
        ))}
      </div>

      {/* 组件网格骨架 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-20 bg-muted rounded mt-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}