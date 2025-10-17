'use client'

import React from 'react'
import { Card, Button, Badge } from '@xorigo-ui/core'
import { ComponentCard, CodeBlock } from '@xorigo-ui/core'

/**
 * CardGalleryPage - Card组件画廊页面
 *
 * 功能特性：
 * - 展示 Card 组件的所有变体和布局方式
 * - 包含内容卡片、产品卡片、用户卡片等常用样式
 * - 支持嵌套组件和交互效果
 */
export default function CardGalleryPage() {
  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div className="relative mb-12 pb-8 border-b border-[var(--border-tertiary)]">
        {/* 顶部装饰线 */}
        <div className="absolute top-0 left-0 w-24 h-1.5 bg-gradient-to-r from-[var(--bg-primary-action)] via-[var(--bg-secondary-action)] to-transparent rounded-full shadow-lg shadow-[var(--bg-primary-action)]/30" />

        {/* 标题内容 */}
        <div className="mt-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--text-primary)] via-[var(--text-secondary)] to-[var(--text-primary)] bg-clip-text text-transparent">
            Card 卡片
          </h1>
          <p className="mt-3 text-base text-[var(--text-secondary)] max-w-2xl">
            展示 Card 组件的各种布局和样式。支持内容卡片、产品展示、用户资料等多种用途，提供灵活的定制选项。
          </p>

          {/* 快速统计标签 */}
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--border-secondary)] text-[var(--text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--bg-primary-action)]" />
              多种布局
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--border-secondary)] text-[var(--text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--bg-secondary-action)]" />
              嵌套支持
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--border-secondary)] text-[var(--text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--bg-success)]" />
              响应式设计
            </span>
          </div>
        </div>

        {/* 底部装饰点 */}
        <div className="absolute bottom-0 right-0 flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[var(--bg-primary-action)] animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-[var(--bg-secondary-action)] animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 rounded-full bg-[var(--bg-primary-action)]/50 animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

      {/* 瀑布流容器 */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {/* Basic Card 基础卡片 */}
        <ComponentCard
          title="Basic Card"
          subtitle="基础卡片样式"
          showcase={
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">基础卡片标题</h3>
                <p className="text-[var(--text-secondary)]">
                  这是一个基础的卡片组件，包含标题和内容区域。
                </p>
              </div>
            </Card>
          }
          usage={
            <CodeBlock
              code={`<Card>
  <div className="p-6">
    <h3 className="text-lg font-semibold mb-2">标题</h3>
    <p className="text-[var(--text-secondary)]">内容</p>
  </div>
</Card>`}
              language="tsx"
              title="基础卡片"
              copyable
            />
          }
        />

        {/* Card with Header 带头部的卡片 */}
        <ComponentCard
          title="Card with Header"
          subtitle="带头部的卡片"
          showcase={
            <Card>
              <div className="border-b border-[var(--border-secondary)] px-6 py-4">
                <h3 className="text-lg font-semibold">卡片头部</h3>
              </div>
              <div className="p-6">
                <p className="text-[var(--text-secondary)]">
                  卡片的主要内容区域，可以包含任意内容。
                </p>
              </div>
            </Card>
          }
          usage={
            <CodeBlock
              code={`<Card>
  <div className="border-b border-[var(--border-secondary)] px-6 py-4">
    <h3 className="text-lg font-semibold">头部</h3>
  </div>
  <div className="p-6">
    <p>内容区域</p>
  </div>
</Card>`}
              language="tsx"
              title="带头部的卡片"
              copyable
            />
          }
        />

        {/* Product Card 产品卡片 */}
        <ComponentCard
          title="Product Card"
          subtitle="产品展示卡片"
          showcase={
            <Card>
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg" />
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">高级版套餐</h3>
                  <Badge variant="primary">热门</Badge>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  包含所有高级功能，适合团队协作使用。
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">¥99</span>
                  <Button size="sm">立即购买</Button>
                </div>
              </div>
            </Card>
          }
          usage={
            <CodeBlock
              code={`<Card>
  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg" />
  <div className="p-4">
    <h3 className="font-semibold">产品名称</h3>
    <p className="text-sm text-[var(--text-secondary)]">产品描述</p>
    <div className="flex items-center justify-between">
      <span className="text-2xl font-bold">¥99</span>
      <Button size="sm">购买</Button>
    </div>
  </div>
</Card>`}
              language="tsx"
              title="产品卡片"
              copyable
            />
          }
        />

        {/* User Profile Card 用户资料卡片 */}
        <ComponentCard
          title="User Profile Card"
          subtitle="用户资料卡片"
          showcase={
            <Card>
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    JD
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">John Doe</h3>
                    <p className="text-[var(--text-secondary)]">产品设计师</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  专注于用户体验设计和产品创新，拥有8年设计经验。
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">关注</Button>
                  <Button variant="primary" size="sm">私信</Button>
                </div>
              </div>
            </Card>
          }
          usage={
            <CodeBlock
              code={`<Card>
  <div className="p-6">
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full" />
      <div>
        <h3 className="font-semibold">姓名</h3>
        <p className="text-[var(--text-secondary)]">职位</p>
      </div>
    </div>
    <p className="text-sm text-[var(--text-secondary)] mb-4">个人简介</p>
    <div className="flex gap-2">
      <Button variant="outline" size="sm">关注</Button>
      <Button variant="primary" size="sm">私信</Button>
    </div>
  </div>
</Card>`}
              language="tsx"
              title="用户资料卡片"
              copyable
            />
          }
        />

        {/* Stats Card 统计卡片 */}
        <ComponentCard
          title="Stats Card"
          subtitle="数据统计卡片"
          showcase={
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">月度访问量</h3>
                  <span className="text-green-500 text-sm font-medium">+12.5%</span>
                </div>
                <div className="text-3xl font-bold mb-2">45,231</div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </Card>
          }
          usage={
            <CodeBlock
              code={`<Card>
  <div className="p-6">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-semibold text-lg">统计标题</h3>
      <span className="text-green-500 text-sm font-medium">+12.5%</span>
    </div>
    <div className="text-3xl font-bold mb-2">45,231</div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
    </div>
  </div>
</Card>`}
              language="tsx"
              title="统计卡片"
              copyable
            />
          }
        />

        {/* Card Variants 卡片变体 */}
        <ComponentCard
          title="Card Variants"
          subtitle="卡片样式变体"
          showcase={
            <div className="space-y-3">
              <Card className="border-2 border-blue-200 dark:border-blue-800">
                <div className="p-4">
                  <h4 className="font-semibold text-blue-600 dark:text-blue-400">边框强调</h4>
                </div>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <div className="p-4">
                  <h4 className="font-semibold">渐变背景</h4>
                </div>
              </Card>
              <Card className="shadow-lg">
                <div className="p-4">
                  <h4 className="font-semibold">增强阴影</h4>
                </div>
              </Card>
            </div>
          }
          usage={
            <CodeBlock
              code={`<Card className="border-2 border-blue-200">
  <div className="p-4">
    <h4 className="font-semibold text-blue-600">边框强调</h4>
  </div>
</Card>
<Card className="bg-gradient-to-br from-purple-50 to-pink-50">
  <div className="p-4">
    <h4 className="font-semibold">渐变背景</h4>
  </div>
</Card>
<Card className="shadow-lg">
  <div className="p-4">
    <h4 className="font-semibold">增强阴影</h4>
  </div>
</Card>`}
              language="tsx"
              title="卡片变体"
              copyable
            />
          }
        />
      </div>
    </div>
  )
}