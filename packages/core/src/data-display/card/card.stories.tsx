/**
 * @fileoverview Card 组件故事文件
 * @description 展示 Card 组件的所有变体、状态和使用方式
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 * @since 2025-11-04
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardBody, CardFooter } from './card'
import { Button } from '../../primitives/button'
import { Badge } from '../../primitives/badge'

// =============================================================================
// 故事元数据
// =============================================================================

const meta: Meta<typeof Card> = {
  title: 'Data Display/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
数据展示卡片组件，支持多种变体、状态和交互。

## 功能特性

- **多种视觉变体**: default, elevated, bordered, filled, glass, gradient, neon, interactive
- **灵活的内容结构**: 支持子组件（CardHeader, CardBody, CardFooter）
- **丰富的交互状态**: hoverable, loading, disabled, selected
- **媒体内容支持**: 图片、视频等，支持多种位置和宽高比
- **徽章系统**: 支持不同颜色的徽章标记
- **可访问性**: 完整的键盘导航和 ARIA 属性
- **动画效果**: 基于 Framer Motion 的流畅动画

## 变体说明

- **default**: 默认样式，适合大多数场景
- **elevated**: 突出显示，带有阴影
- **bordered**: 强调边框的样式
- **filled**: 填充背景色
- **glass**: 玻璃拟态效果
- **gradient**: 渐变背景
- **neon**: 霓虹发光效果
- **interactive**: 专门的交互卡片样式

## 使用场景

- 数据面板卡片
- 产品展示卡片
- 文章预览卡片
- 统计信息卡片
- 活动或事件卡片
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'elevated',
        'bordered',
        'filled',
        'glass',
        'gradient',
        'neon',
        'interactive',
      ],
      description: '卡片变体',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    shadowLevel: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '阴影层级',
      table: {
        defaultValue: { summary: 'sm' },
      },
    },
    roundness: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
      description: '圆角大小',
      table: {
        defaultValue: { summary: 'lg' },
      },
    },
    loading: {
      control: 'boolean',
      description: '加载状态',
    },
    disabled: {
      control: 'boolean',
      description: '禁用状态',
    },
    selected: {
      control: 'boolean',
      description: '选中状态',
    },
    hoverable: {
      control: 'boolean',
      description: '悬停效果',
    },
    mediaPosition: {
      control: 'select',
      options: ['top', 'left', 'right', 'cover'],
      description: '媒体内容位置',
    },
    mediaAspectRatio: {
      control: 'select',
      options: ['16/9', '4/3', '1/1', '21/9'],
      description: '媒体宽高比',
    },
    badgeColor: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description: '徽章颜色',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// =============================================================================
// 基础故事
// =============================================================================

export const Default: Story = {
  args: {
    children: (
      <>
        <CardHeader title="默认卡片" subtitle="这是一个默认样式的卡片" />
        <CardBody>
          <p className="text-sm text-[var(--text-secondary)]">
            卡片是用于组织和展示相关信息的容器组件。它可以包含标题、内容、操作按钮等元素。
          </p>
        </CardBody>
        <CardFooter>
          <Button size="sm">了解更多</Button>
        </CardFooter>
      </>
    ),
  },
}

// =============================================================================
// 变体故事
// =============================================================================

export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <Card variant="default">
        <CardHeader title="Default" />
        <CardBody>默认样式</CardBody>
      </Card>

      <Card variant="elevated">
        <CardHeader title="Elevated" />
        <CardBody>突出显示</CardBody>
      </Card>

      <Card variant="bordered">
        <CardHeader title="Bordered" />
        <CardBody>边框强调</CardBody>
      </Card>

      <Card variant="filled">
        <CardHeader title="Filled" />
        <CardBody>填充背景</CardBody>
      </Card>

      <Card variant="glass">
        <CardHeader title="Glass" />
        <CardBody>玻璃拟态</CardBody>
      </Card>

      <Card variant="gradient">
        <CardHeader title="Gradient" />
        <CardBody>渐变背景</CardBody>
      </Card>

      <Card variant="neon">
        <CardHeader title="Neon" />
        <CardBody>霓虹效果</CardBody>
      </Card>

      <Card variant="interactive">
        <CardHeader title="Interactive" />
        <CardBody>交互样式</CardBody>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示所有可用的变体样式',
      },
    },
  },
}

// =============================================================================
// 阴影层级故事
// =============================================================================

export const ShadowLevels: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <Card shadowLevel="xs">
        <CardHeader title="XS Shadow" />
        <CardBody>最小阴影</CardBody>
      </Card>

      <Card shadowLevel="md">
        <CardHeader title="MD Shadow" />
        <CardBody>中等阴影</CardBody>
      </Card>

      <Card shadowLevel="xl">
        <CardHeader title="XL Shadow" />
        <CardBody>大阴影</CardBody>
      </Card>
    </div>
  ),
}

// =============================================================================
// 圆角故事
// =============================================================================

export const Roundness: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <Card roundness="none">
        <CardHeader title="No Radius" />
        <CardBody>无圆角</CardBody>
      </Card>

      <Card roundness="lg">
        <CardHeader title="Large Radius" />
        <CardBody>大圆角</CardBody>
      </Card>

      <Card roundness="full">
        <CardHeader title="Full Radius" />
        <CardBody>全圆角</CardBody>
      </Card>
    </div>
  ),
}

// =============================================================================
// 状态故事
// =============================================================================

export const States: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <Card loading>
        <CardHeader title="加载中" />
        <CardBody>内容加载中...</CardBody>
      </Card>

      <Card disabled>
        <CardHeader title="禁用状态" />
        <CardBody>此卡片已禁用</CardBody>
      </Card>

      <Card selected>
        <CardHeader title="已选中" />
        <CardBody>这是一个已选中的卡片</CardBody>
      </Card>

      <Card badge="新品" badgeColor="primary">
        <CardHeader title="带徽章" />
        <CardBody>右上角有徽章标记</CardBody>
      </Card>
    </div>
  ),
}

// =============================================================================
// 交互故事
// =============================================================================

export const Interactive: Story = {
  args: {
    variant: 'interactive',
    onClick: () => alert('卡片被点击了！'),
    children: (
      <>
        <CardHeader title="可点击卡片" />
        <CardBody>点击这个卡片试试看</CardBody>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '可点击的交互卡片，支持键盘导航',
      },
    },
  },
}

// =============================================================================
// 媒体内容故事
// =============================================================================

export const WithMedia: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <Card
        media={
          <img
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80&auto=format&fit=crop"
            alt="示例图片"
            className="w-full h-full object-cover"
          />
        }
      >
        <CardHeader title="媒体顶部" />
        <CardBody>媒体内容位于卡片顶部</CardBody>
      </Card>

      <Card
        media={
          <img
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80&auto=format&fit=crop"
            alt="示例图片"
            className="w-full h-full object-cover"
          />
        }
        mediaPosition="left"
      >
        <CardBody>媒体内容位于左侧</CardBody>
      </Card>
    </div>
  ),
}

// =============================================================================
// 徽章故事
// =============================================================================

export const WithBadge: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <Card badge="新品" badgeColor="primary">
        <CardHeader title="产品卡片" subtitle="最新发布的产品" />
        <CardBody>这是一个展示新产品的卡片</CardBody>
      </Card>

      <Card badge="推荐" badgeColor="success">
        <CardHeader title="推荐内容" subtitle="编辑精选" />
        <CardBody>这是一个推荐内容的卡片</CardBody>
      </Card>

      <Card badge="热门" badgeColor="warning">
        <CardHeader title="热门话题" />
        <CardBody>这是一个热门话题的卡片</CardBody>
      </Card>

      <Card badge="重要" badgeColor="error">
        <CardHeader title="重要通知" />
        <CardBody>这是一个重要通知的卡片</CardBody>
      </Card>
    </div>
  ),
}

// =============================================================================
// 复杂内容故事
// =============================================================================

export const ComplexContent: Story = {
  render: () => (
    <div className="p-6">
      <Card
        variant="elevated"
        media={
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop"
            alt="数据分析"
            className="w-full h-full object-cover"
          />
        }
        badge="分析报告"
        badgeColor="primary"
        actions={
          <Button variant="ghost" size="sm">
            分享
          </Button>
        }
      >
        <CardHeader
          title="Q4 数据分析报告"
          subtitle="2024年第四季度业务数据概览"
        />
        <CardBody>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">总收入</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">¥1,234,567</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">用户增长</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">+23.5%</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">转化率</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">4.8%</p>
              </div>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              本季度我们在用户获取和留存方面取得了显著进展，收入同比增长35%，超出预期目标。
            </p>
          </div>
        </CardBody>
        <CardFooter align="between">
          <span className="text-sm text-[var(--text-tertiary)]">更新于 2 天前</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">查看详情</Button>
            <Button size="sm">下载报告</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  ),
}

// =============================================================================
// 完整功能展示
// =============================================================================

export const AllFeatures: Story = {
  render: () => (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
        Card 组件完整功能展示
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 产品卡片示例 */}
        <Card
          variant="elevated"
          hoverable
          media={
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&auto=format&fit=crop"
              alt="产品图片"
              className="w-full h-full object-cover"
            />
          }
          badge="新品"
          badgeColor="primary"
        >
          <CardHeader
            title="智能手表 Pro"
            subtitle="最新款智能手表"
          />
          <CardBody>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              配备先进健康监测功能，支持50+运动模式，14天超长续航。
            </p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-[var(--text-primary)]">¥2,999</span>
              <span className="text-sm text-[var(--text-tertiary)] line-through">¥3,599</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★★★★★</span>
              <span className="text-xs text-[var(--text-tertiary)]">(128 评价)</span>
            </div>
          </CardBody>
          <CardFooter align="between">
            <Button size="sm" className="flex-1">加入购物车</Button>
            <Button variant="ghost" size="sm">收藏</Button>
          </CardFooter>
        </Card>

        {/* 文章卡片示例 */}
        <Card
          variant="glass"
          hoverable
          mediaPosition="cover"
          media={
            <img
              src="https://images.unsplash.com/photo-1486312338219-ce68e2c6b21d?w=1200&q=80&auto=format&fit=crop"
              alt="文章封面"
              className="w-full h-full object-cover"
            />
          }
        >
          <div className="relative bg-[var(--bg-primary)]/90 backdrop-blur-md p-6 m-0">
            <CardHeader
              title="现代前端开发的最佳实践"
              subtitle="技术分享 · 10分钟阅读"
            />
            <CardBody>
              <p className="text-sm text-[var(--text-secondary)]">
                探讨在2025年现代前端开发中最重要的技术趋势、开发模式以及最佳实践指南。
              </p>
            </CardBody>
            <CardFooter align="between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-sm font-medium">
                  张三
                </div>
                <span className="text-xs text-[var(--text-tertiary)]">2024-11-01</span>
              </div>
              <Button variant="ghost" size="sm">阅读更多</Button>
            </CardFooter>
          </div>
        </Card>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示卡片组件在实际场景中的应用',
      },
    },
  },
}
