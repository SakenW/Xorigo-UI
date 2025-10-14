/**
 * Gallery 服务端组件
 *
 * 展示 Xorigo UI 组件库的完整组件分类体系
 * 基于 9 大分类体系的组件展示
 */

import { Metadata } from 'next'
import { CategoryNavigation } from './category-navigation'
import { componentCategories } from '@/data/component-classification'
import { ComponentInfo } from '@/data/component-classification'
import { Suspense } from 'react'
import { PageErrorBoundary } from '@/components/errors'

/**
 * Gallery 服务端组件 - 展示组件库分类体系
 * 搜索和过滤功能委托给客户端组件
 */
export function GalleryServer() {
  return (
    <PageErrorBoundary
      pageName="组件库展示"
      pagePath="/gallery"
    >
      <div className="min-h-screen bg-background">
        <Suspense fallback={<GallerySkeleton />}>
          <GalleryContent />
        </Suspense>
      </div>
    </PageErrorBoundary>
  )
}

function GalleryContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Xorigo UI 组件库
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          基于 9 大分类体系的完整组件库展示，遵循原子化设计理念，
          提供高质量、可访问性、主题适配的 React 19 组件
        </p>
        <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>React 19</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span>TypeScript 5.9</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full" />
            <span>Tailwind CSS 4</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full" />
            <span>Framer Motion 12</span>
          </div>
        </div>
      </div>

      {/* 分类导航和组件展示 */}
      <CategoryNavigation
        categories={componentCategories}
      />

      {/* 页脚信息 */}
      <div className="mt-16 pt-8 border-t border-border">
        <div className="text-center text-sm text-muted-foreground">
          <p>
            基于{' '}
            <a
              href="/docs/SHARED/COMPONENT-CLASSIFICATION-SYSTEM.md"
              className="underline hover:text-foreground"
            >
              组件分类系统规范
            </a>{' '}
            的唯一事实展示
          </p>
          <p className="mt-2">
            共 {componentCategories.reduce((total, cat) => total + cat.components.length, 0)} 个组件，
            {componentCategories.length} 个分类
          </p>
        </div>
      </div>
    </div>
  )
}

function GallerySkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 标题骨架 */}
      <div className="text-center mb-12">
        <div className="h-12 bg-muted rounded-lg w-1/3 mx-auto mb-4 animate-pulse" />
        <div className="h-6 bg-muted rounded-lg w-1/2 mx-auto animate-pulse" />
      </div>

      {/* 搜索栏骨架 */}
      <div className="h-10 bg-muted rounded-lg mb-6 animate-pulse" />

      {/* 分类标签骨架 */}
      <div className="grid grid-cols-11 gap-2 mb-8">
        {Array.from({ length: 11 }).map((_, i) => (
          <div
            key={i}
            className="h-10 bg-muted rounded-lg animate-pulse"
          />
        ))}
      </div>

      {/* 组件网格骨架 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-48 bg-muted rounded-lg animate-pulse" />
            <div className="h-4 bg-muted rounded-lg w-3/4 animate-pulse" />
            <div className="h-4 bg-muted rounded-lg w-1/2 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}