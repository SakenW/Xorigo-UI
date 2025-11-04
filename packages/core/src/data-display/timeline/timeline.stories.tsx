/**
 * @fileoverview Timeline 组件故事文件
 * @description 时间线组件的所有使用示例和变体展示
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Timeline, TimelineItem, TimelineMarker, TimelineContent, TimelineFromData } from './timeline'
import React from 'react'

// 故事元数据
const meta = {
  title: 'Data Display/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
时间线组件用于展示按时间顺序排列的事件或活动。

## 特性

- 支持垂直和水平两种方向
- 支持多种样式变体
- 支持交替显示
- 支持折叠和展开
- 支持加载状态和空状态
- 完全响应式设计
- 集成七轴主题系统

## 使用场景

- 项目时间线展示
- 历史事件记录
- 工作流程可视化
- 活动进度展示
- 学习路径导航
        `,
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
      description: '时间线方向',
    },
    variant: {
      control: 'select',
      options: ['default', 'simple', 'filled', 'bordered'],
      description: '样式变体',
    },
    density: {
      control: 'select',
      options: ['compact', 'normal', 'loose'],
      description: '内容密度',
    },
  },
} satisfies Meta<typeof Timeline>

export default meta
type Story = StoryObj<typeof meta>

// 基础示例
export const Basic: Story = {
  args: {
    orientation: 'vertical',
    density: 'normal',
  },
  render: (args) => (
    <div className="p-8 min-w-[400px]">
      <Timeline {...args}>
        <TimelineItem>
          <TimelineMarker variant="primary">1</TimelineMarker>
          <TimelineContent>
            <div className="font-semibold">项目启动</div>
            <div className="text-sm text-muted-foreground mt-1">
              完成项目初始规划和需求分析
            </div>
            <div className="text-xs text-muted-foreground mt-2">2024-01-15</div>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineMarker variant="info">2</TimelineMarker>
          <TimelineContent>
            <div className="font-semibold">需求确认</div>
            <div className="text-sm text-muted-foreground mt-1">
              与客户确认详细需求和功能规格
            </div>
            <div className="text-xs text-muted-foreground mt-2">2024-02-01</div>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineMarker variant="success">3</TimelineMarker>
          <TimelineContent>
            <div className="font-semibold">开发完成</div>
            <div className="text-sm text-muted-foreground mt-1">
              核心功能开发完成，进入测试阶段
            </div>
            <div className="text-xs text-muted-foreground mt-2">2024-03-15</div>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  ),
}

// 水平方向
export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    density: 'normal',
  },
  render: (args) => (
    <div className="p-8 w-full max-w-4xl">
      <Timeline {...args}>
        <TimelineItem>
          <TimelineMarker variant="primary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0L16 8L8 16L0 8L8 0Z" />
            </svg>
          </TimelineMarker>
          <TimelineContent>
            <div className="font-semibold">设计</div>
            <div className="text-sm text-muted-foreground mt-1">
              UI/UX 设计
            </div>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineMarker variant="info">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3 4h10v8H3V4zm2 2v4h6V6H5z" />
            </svg>
          </TimelineMarker>
          <TimelineContent>
            <div className="font-semibold">开发</div>
            <div className="text-sm text-muted-foreground mt-1">
              功能开发
            </div>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineMarker variant="warning">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2l6 12H2L8 2zm0 4v4m0 2h.01" />
            </svg>
          </TimelineMarker>
          <TimelineContent>
            <div className="font-semibold">测试</div>
            <div className="text-sm text-muted-foreground mt-1">
              质量保证
            </div>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineMarker variant="success">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6.173 12.067L3.53 9.424l1.414-1.414 1.229 1.229 4.243-4.243 1.414 1.414-5.657 5.657z" />
            </svg>
          </TimelineMarker>
          <TimelineContent>
            <div className="font-semibold">发布</div>
            <div className="text-sm text-muted-foreground mt-1">
              产品上线
            </div>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  ),
}

// 交替显示
export const Alternate: Story = {
  args: {
    orientation: 'vertical',
    density: 'normal',
  },
  render: (args) => (
    <div className="p-8 w-full max-w-3xl">
      <Timeline {...args}>
        <TimelineItem align="alternate">
          <TimelineMarker variant="primary">1</TimelineMarker>
          <TimelineContent>
            <div className="font-semibold">左侧内容 1</div>
            <div className="text-sm text-muted-foreground mt-1">
              交替显示的时间线内容
            </div>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem align="alternate">
          <TimelineMarker variant="info">2</TimelineMarker>
          <TimelineContent>
            <div className="font-semibold">右侧内容 2</div>
            <div className="text-sm text-muted-foreground mt-1">
              内容在右侧显示
            </div>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem align="alternate">
          <TimelineMarker variant="success">3</TimelineMarker>
          <TimelineContent>
            <div className="font-semibold">左侧内容 3</div>
            <div className="text-sm text-muted-foreground mt-1">
              再次回到左侧
            </div>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  ),
}

// 不同密度
export const Density: Story = {
  render: () => (
    <div className="p-8 space-y-12 w-full max-w-2xl">
      <div>
        <h3 className="text-sm font-semibold mb-4">紧凑模式 (Compact)</h3>
        <Timeline density="compact">
          <TimelineItem>
            <TimelineMarker size="sm">1</TimelineMarker>
            <TimelineContent>
              <div className="font-semibold text-sm">紧凑内容</div>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineMarker size="sm">2</TimelineMarker>
            <TimelineContent>
              <div className="font-semibold text-sm">较少的空间</div>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-4">正常模式 (Normal)</h3>
        <Timeline density="normal">
          <TimelineItem>
            <TimelineMarker>1</TimelineMarker>
            <TimelineContent>
              <div className="font-semibold">正常内容</div>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineMarker>2</TimelineMarker>
            <TimelineContent>
              <div className="font-semibold">标准间距</div>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-4">宽松模式 (Loose)</h3>
        <Timeline density="loose">
          <TimelineItem>
            <TimelineMarker size="lg">1</TimelineMarker>
            <TimelineContent>
              <div className="font-semibold">宽松内容</div>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineMarker size="lg">2</TimelineMarker>
            <TimelineContent>
              <div className="font-semibold">更多空间</div>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>
    </div>
  ),
}

// 不同变体
export const Variants: Story = {
  render: () => (
    <div className="p-8 space-y-12 w-full max-w-2xl">
      <div>
        <h3 className="text-sm font-semibold mb-4">默认变体 (Default)</h3>
        <Timeline variant="default">
          <TimelineItem>
            <TimelineMarker variant="primary">1</TimelineMarker>
            <TimelineContent>
              <div className="font-semibold">默认样式</div>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-4">简单变体 (Simple)</h3>
        <Timeline variant="simple">
          <TimelineItem>
            <TimelineMarker variant="info" dot>1</TimelineMarker>
            <TimelineContent>
              <div className="font-semibold">简单样式</div>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-4">实心变体 (Filled)</h3>
        <Timeline variant="filled">
          <TimelineItem>
            <TimelineMarker variant="success">1</TimelineMarker>
            <TimelineContent>
              <div className="font-semibold">实心样式</div>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>
    </div>
  ),
}

// 带图标的时间线
export const WithIcons: Story = {
  render: () => (
    <div className="p-8 w-full max-w-2xl">
      <Timeline>
        <TimelineItem>
          <TimelineMarker variant="primary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0L16 8L8 16L0 8L8 0Z" />
            </svg>
          </TimelineMarker>
          <TimelineContent>
            <div className="font-semibold">设计阶段</div>
            <div className="text-sm text-muted-foreground mt-1">
              完成 UI 设计和原型制作
            </div>
            <div className="text-xs text-muted-foreground mt-2">2024-01-15</div>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineMarker variant="info">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1l3 6 6 .5-4.5 4 1.5 6L8 15l-6 2.5 1.5-6L-1 7.5 5 7l3-6z" />
            </svg>
          </TimelineMarker>
          <TimelineContent>
            <div className="font-semibold">开发阶段</div>
            <div className="text-sm text-muted-foreground mt-1">
              实现核心功能和业务逻辑
            </div>
            <div className="text-xs text-muted-foreground mt-2">2024-02-20</div>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineMarker variant="warning">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3 4h10v8H3V4zm2 2v4h6V6H5z" />
            </svg>
          </TimelineMarker>
          <TimelineContent>
            <div className="font-semibold">测试阶段</div>
            <div className="text-sm text-muted-foreground mt-1">
              进行全面测试和性能优化
            </div>
            <div className="text-xs text-muted-foreground mt-2">2024-03-10</div>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineMarker variant="success">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6.173 12.067L3.53 9.424l1.414-1.414 1.229 1.229 4.243-4.243 1.414 1.414-5.657 5.657z" />
            </svg>
          </TimelineMarker>
          <TimelineContent>
            <div className="font-semibold">发布上线</div>
            <div className="text-sm text-muted-foreground mt-1">
              产品正式发布并上线
            </div>
            <div className="text-xs text-muted-foreground mt-2">2024-04-01</div>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  ),
}

// 不同颜色的标记
export const ColorVariants: Story = {
  render: () => (
    <div className="p-8 w-full max-w-2xl">
      <Timeline>
        <TimelineItem>
          <TimelineMarker variant="default">1</TimelineMarker>
          <TimelineContent>
            <div className="font-semibold">默认颜色</div>
            <div className="text-sm text-muted-foreground mt-1">
              使用默认主题色
            </div>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineMarker variant="primary">2</TimelineMarker>
          <TimelineContent>
            <div className="font-semibold">主色调</div>
            <div className="text-sm text-muted-foreground mt-1">
              主要操作和重要步骤
            </div>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineMarker variant="success">3</TimelineMarker>
          <TimelineContent>
            <div className="font-semibold">成功状态</div>
            <div className="text-sm text-muted-foreground mt-1">
              表示完成或成功
            </div>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineMarker variant="warning">4</TimelineMarker>
          <TimelineContent>
            <div className="font-semibold">警告信息</div>
            <div className="text-sm text-muted-foreground mt-1">
              需要注意的情况
            </div>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineMarker variant="error">5</TimelineMarker>
          <TimelineContent>
            <div className="font-semibold">错误状态</div>
            <div className="text-sm text-muted-foreground mt-1">
              错误或失败的情况
            </div>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineMarker variant="info">6</TimelineMarker>
          <TimelineContent>
            <div className="font-semibold">信息提示</div>
            <div className="text-sm text-muted-foreground mt-1">
              一般信息或说明
            </div>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  ),
}

// 从数据生成
export const FromData: Story = {
  render: () => {
    const data = [
      {
        id: 1,
        date: '2024-01-15',
        title: '项目启动',
        description: '完成项目初始规划和需求分析',
        variant: 'primary' as const,
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0L16 8L8 16L0 8L8 0Z" />
          </svg>
        ),
      },
      {
        id: 2,
        date: '2024-02-20',
        title: '设计完成',
        description: 'UI/UX 设计和原型制作',
        variant: 'info' as const,
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3 4h10v8H3V4zm2 2v4h6V6H5z" />
          </svg>
        ),
      },
      {
        id: 3,
        date: '2024-03-10',
        title: '开发完成',
        description: '核心功能开发和集成测试',
        variant: 'success' as const,
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1l3 6 6 .5-4.5 4 1.5 6L8 15l-6 2.5 1.5-6L-1 7.5 5 7l3-6z" />
          </svg>
        ),
      },
    ]

    return (
      <div className="p-8 w-full max-w-2xl">
        <TimelineFromData items={data} />
      </div>
    )
  },
}

// 加载状态
export const Loading: Story = {
  render: () => (
    <div className="p-8 w-full max-w-2xl">
      <Timeline.skeleton />
    </div>
  ),
}

// 空状态
export const Empty: Story = {
  render: () => (
    <div className="p-8 w-full max-w-2xl">
      <Timeline.empty message="暂无时间线数据" />
    </div>
  ),
}
