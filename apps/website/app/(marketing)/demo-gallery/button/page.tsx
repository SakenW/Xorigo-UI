'use client'

import React from 'react'
import { Button } from '@xorigo-ui/core'
import { ComponentCard, CodeBlock } from '@xorigo-ui/core'

/**
 * ButtonGalleryPage - Button组件画廊页面
 *
 * 功能特性：
 * - 瀑布流布局展示所有变体、尺寸、状态
 * - 每个卡片包含样式展示 + 可折叠的代码示例
 * - 紧凑精致的网格布局，最大化空间利用
 * - 响应式设计（1列/2列/3列）
 */
export default function ButtonGalleryPage() {
  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div className="mb-8 pb-6 border-b-2 border-[var(--border-secondary)]">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          按钮 Button
        </h1>
        <p className="mt-2 text-base text-[var(--text-tertiary)]">
          展示 Button 组件的所有变体、尺寸和状态。支持多种视觉风格，提供完整的交互反馈和无障碍支持。
        </p>

        {/* 快速导航 */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--bg-primary-action)]/10 text-[var(--bg-primary-action)] border border-[var(--bg-primary-action)]/20">
            11 种变体
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--bg-secondary-action)]/10 text-[var(--bg-secondary-action)] border border-[var(--bg-secondary-action)]/20">
            6 种尺寸
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--bg-success)]/10 text-[var(--bg-success)] border border-[var(--bg-success)]/20">
            完整无障碍支持
          </span>
        </div>
      </div>

      {/* 瀑布流容器 - 优化间距和响应式 */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {/* 变体展示 */}
        <ComponentCard
          variant="default"
          title="变体样式"
          subtitle="11 种按钮外观变体"
          showcase={
            <div className="grid grid-cols-2 gap-3">
              <Button variant="primary">主要按钮</Button>
              <Button variant="secondary">次要按钮</Button>
              <Button variant="success">成功按钮</Button>
              <Button variant="warning">警告按钮</Button>
              <Button variant="danger">危险按钮</Button>
              <Button variant="ghost">幽灵按钮</Button>
              <Button variant="link">链接按钮</Button>
              <Button variant="outline">边框按钮</Button>
            </div>
          }
          usage={
            <CodeBlock
              code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="danger">Danger</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="outline">Outline</Button>`}
              language="tsx"
              title="变体示例"
              copyable
            />
          }
        />

        {/* 尺寸展示 - 使用 default 样式 */}
        <ComponentCard
          variant="default"
          title="尺寸规格"
          subtitle="从 xs 到 2xl 共 6 种尺寸"
          showcase={
            <div className="flex flex-col items-center gap-2">
              <Button size="xs" variant="primary">超小按钮</Button>
              <Button size="sm" variant="primary">小型按钮</Button>
              <Button size="md" variant="primary">中等按钮</Button>
              <Button size="lg" variant="primary">大型按钮</Button>
              <Button size="xl" variant="primary">超大按钮</Button>
              <Button size="2xl" variant="primary">特大按钮</Button>
            </div>
          }
          usage={
            <CodeBlock
              code={`<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
<Button size="2xl">2X Large</Button>`}
              language="tsx"
              title="尺寸示例"
              copyable
            />
          }
        />

        {/* 状态展示 */}
        <ComponentCard
          variant="default"
          title="交互状态"
          subtitle="默认、禁用、加载等状态"
          showcase={
            <div className="grid grid-cols-2 gap-3">
              <Button variant="primary">默认状态</Button>
              <Button variant="primary" disabled>禁用状态</Button>
              <Button variant="primary" loading>加载状态</Button>
              <Button variant="secondary" loading loadingText="处理中">
                加载文本
              </Button>
            </div>
          }
          usage={
            <CodeBlock
              code={`<Button variant="primary">Default</Button>
<Button variant="primary" disabled>Disabled</Button>
<Button variant="primary" loading>Loading</Button>
<Button variant="secondary" loading loadingText="处理中">
  Loading Text
</Button>`}
              language="tsx"
              title="状态示例"
              copyable
            />
          }
        />

        {/* 图标按钮 */}
        <ComponentCard
          variant="default"
          title="图标组合"
          subtitle="左图标、右图标、纯图标按钮"
          showcase={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" leftIcon={<span>→</span>}>
                左侧图标
              </Button>
              <Button variant="secondary" rightIcon={<span>←</span>}>
                右侧图标
              </Button>
              <Button variant="ghost" iconOnly ariaLabel="星标">
                ☆
              </Button>
              <Button variant="outline" iconOnly ariaLabel="搜索">
                🔍
              </Button>
              <Button variant="primary" iconOnly ariaLabel="设置">
                ⚙
              </Button>
            </div>
          }
          usage={
            <CodeBlock
              code={`<Button variant="primary" leftIcon={<Icon name="arrow-right" />}>
  Left Icon
</Button>
<Button variant="secondary" rightIcon={<Icon name="arrow-left" />}>
  Right Icon
</Button>
<Button variant="ghost" iconOnly ariaLabel="星标">
  <Icon name="star" />
</Button>`}
              language="tsx"
              title="图标示例"
              copyable
            />
          }
        />

        {/* 全宽按钮 - 使用 default 样式 */}
        <ComponentCard
          variant="default"
          title="全宽布局"
          subtitle="占满容器宽度的按钮"
          showcase={
            <div className="flex flex-col gap-2">
              <Button variant="primary" fullWidth>
                全宽主要按钮
              </Button>
              <Button variant="secondary" fullWidth>
                全宽次要按钮
              </Button>
              <Button variant="outline" fullWidth>
                全宽边框按钮
              </Button>
            </div>
          }
          usage={
            <CodeBlock
              code={`<Button variant="primary" fullWidth>
  Full Width Primary
</Button>
<Button variant="secondary" fullWidth>
  Full Width Secondary
</Button>`}
              language="tsx"
              title="全宽示例"
              copyable
            />
          }
        />

        {/* 特殊效果 */}
        <ComponentCard
          variant="default"
          title="特殊效果"
          subtitle="玻璃态、霓虹光、渐变边框"
          showcase={
            <div className="flex flex-col gap-3">
              <Button variant="glass">Glass 玻璃态</Button>
              <Button variant="neon">Neon 霓虹光</Button>
              <Button variant="gradientOutline">Gradient 渐变边框</Button>
            </div>
          }
          usage={
            <CodeBlock
              code={`<Button variant="glass">Glass 玻璃态</Button>
<Button variant="neon">Neon 霓虹光</Button>
<Button variant="gradientOutline">Gradient 渐变边框</Button>`}
              language="tsx"
              title="特殊变体示例"
              copyable
            />
          }
        />

        {/* 组合用法 */}
        <ComponentCard
          variant="default"
          title="组合示例"
          subtitle="尺寸、图标、状态的组合使用"
          showcase={
            <div className="grid grid-cols-2 gap-3">
              <Button variant="primary" size="sm" leftIcon={<span>+</span>}>
                新建
              </Button>
              <Button variant="danger" size="sm" rightIcon={<span>×</span>}>
                删除
              </Button>
              <Button variant="success" size="md" loading>
                保存中
              </Button>
              <Button variant="outline" size="md" disabled>
                已禁用
              </Button>
            </div>
          }
          usage={
            <CodeBlock
              code={`<Button variant="primary" size="sm" leftIcon={<Icon name="plus" />}>
  新建
</Button>
<Button variant="danger" size="sm" rightIcon={<Icon name="x" />}>
  删除
</Button>
<Button variant="success" size="md" loading>
  保存中
</Button>`}
              language="tsx"
              title="组合示例"
              copyable
            />
          }
        />
      </div>
    </div>
  )
}
