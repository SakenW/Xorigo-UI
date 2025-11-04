/**
 * ChartContainer Component Stories
 *
 * Storybook stories for ChartContainer component
 */

import type { Meta, StoryObj } from '@storybook/react'
import { ChartContainer } from './chart-container'

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof ChartContainer> = {
  title: 'Charts/ChartContainer',
  component: ChartContainer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
ChartContainer 是图表组件库的基础容器，为各种图表提供统一的布局和样式。

## 功能特性
- 响应式布局支持
- 可配置的内边距和外边距
- 宽高比控制
- 图例位置配置
- 网格线显示控制
- 无障碍访问支持
- 主题系统集成

## 使用示例
\`\`\`tsx
<ChartContainer
  title="销售数据"
  height={300}
  legendPosition="top"
  showGrid={true}
>
  <LineChart data={salesData} />
</ChartContainer>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: '图表的标题'
    },
    ariaLabel: {
      control: 'text',
      description: '图表的描述性文本（用于无障碍访问）'
    },
    height: {
      control: 'number',
      description: '图表的高度'
    },
    aspectRatio: {
      control: 'number',
      description: '图表的宽高比（仅在未设置高度时生效）'
    },
    padding: {
      control: 'number',
      description: '容器的内边距'
    },
    margin: {
      control: 'text',
      description: '容器的外边距'
    },
    legendPosition: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right', 'none'],
      description: '图例的位置'
    },
    showGrid: {
      control: 'boolean',
      description: '是否显示网格线'
    },
    className: {
      control: 'text',
      description: '容器的样式类名'
    },
    style: {
      control: 'object',
      description: '自定义样式'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Stories
// ============================================================================

/**
 * Basic usage story
 */
export const Basic: Story = {
  args: {
    title: '基础图表容器',
    children: (
      <div className="flex items-center justify-center h-full bg-[var(--color-surface-elevated)] rounded">
        <p className="text-[var(--color-text-secondary)]">图表内容区域</p>
      </div>
    )
  }
}

/**
 * Different legend positions
 */
export const LegendPositions: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <ChartContainer title="顶部图例" legendPosition="top">
        <div className="flex items-center justify-center h-full bg-blue-50 rounded">顶部图例内容</div>
      </ChartContainer>

      <ChartContainer title="底部图例" legendPosition="bottom">
        <div className="flex items-center justify-center h-full bg-green-50 rounded">底部图例内容</div>
      </ChartContainer>

      <ChartContainer title="左侧图例" legendPosition="left">
        <div className="flex items-center justify-center h-full bg-yellow-50 rounded">左侧图例内容</div>
      </ChartContainer>

      <ChartContainer title="右侧图例" legendPosition="right">
        <div className="flex items-center justify-center h-full bg-purple-50 rounded">右侧图例内容</div>
      </ChartContainer>
    </div>
  ),
  parameters: {
    layout: 'padded'
  }
}

/**
 * Different sizes and padding
 */
export const SizesAndPadding: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px' }}>
      <ChartContainer title="小尺寸" height={200} padding={10}>
        <div className="flex items-center justify-center h-full bg-gray-50 rounded text-sm">200px 高度</div>
      </ChartContainer>

      <ChartContainer title="中等尺寸" height={300} padding={20}>
        <div className="flex items-center justify-center h-full bg-gray-50 rounded text-sm">300px 高度</div>
      </ChartContainer>

      <ChartContainer title="大尺寸" height={400} padding={30}>
        <div className="flex items-center justify-center h-full bg-gray-50 rounded text-sm">400px 高度</div>
      </ChartContainer>
    </div>
  ),
  parameters: {
    layout: 'padded'
  }
}

/**
 * With and without grid
 */
export const GridOptions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px' }}>
      <ChartContainer title="显示网格" showGrid={true}>
        <div className="flex items-center justify-center h-full bg-blue-50 rounded">带网格线的图表</div>
      </ChartContainer>

      <ChartContainer title="隐藏网格" showGrid={false}>
        <div className="flex items-center justify-center h-full bg-green-50 rounded">不带网格线的图表</div>
      </ChartContainer>
    </div>
  ),
  parameters: {
    layout: 'padded'
  }
}

/**
 * With custom styling
 */
export const CustomStyling: Story = {
  args: {
    title: '自定义样式',
    className: 'custom-chart-container',
    style: {
      border: '2px solid var(--color-primary-500)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    children: (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded">
        <p className="text-[var(--color-text-primary)]">自定义样式示例</p>
      </div>
    )
  }
}

/**
 * Complex chart example
 */
export const ComplexChart: Story = {
  args: {
    title: '复杂图表示例',
    height: 350,
    padding: 20,
    legendPosition: 'top',
    showGrid: true,
    children: (
      <div className="relative h-full">
        {/* 模拟图表内容 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 400 250">
            {/* 模拟折线图 */}
            <polyline
              points="20,200 80,150 140,120 200,100 260,130 320,80 380,60"
              fill="none"
              stroke="var(--color-primary-500)"
              strokeWidth="3"
            />
            {/* 模拟数据点 */}
            <circle cx="20" cy="200" r="4" fill="var(--color-primary-500)" />
            <circle cx="80" cy="150" r="4" fill="var(--color-primary-500)" />
            <circle cx="140" cy="120" r="4" fill="var(--color-primary-500)" />
            <circle cx="200" cy="100" r="4" fill="var(--color-primary-500)" />
            <circle cx="260" cy="130" r="4" fill="var(--color-primary-500)" />
            <circle cx="320" cy="80" r="4" fill="var(--color-primary-500)" />
            <circle cx="380" cy="60" r="4" fill="var(--color-primary-500)" />
            {/* 模拟网格线 */}
            <line x1="20" y1="200" x2="380" y2="200" stroke="var(--color-border)" strokeWidth="1" opacity="0.3" />
            <line x1="20" y1="150" x2="380" y2="150" stroke="var(--color-border)" strokeWidth="1" opacity="0.3" />
            <line x1="20" y1="100" x2="380" y2="100" stroke="var(--color-border)" strokeWidth="1" opacity="0.3" />
            <line x1="20" y1="50" x2="380" y2="50" stroke="var(--color-border)" strokeWidth="1" opacity="0.3" />
          </svg>
        </div>
      </div>
    )
  }
}

/**
 * Responsive example
 */
export const Responsive: Story = {
  args: {
    title: '响应式图表',
    aspectRatio: 16 / 9,
    children: (
      <div className="flex items-center justify-center h-full bg-gradient-to-r from-blue-100 to-purple-100 rounded">
        <p className="text-[var(--color-text-primary)]">响应式图表容器</p>
        <p className="text-sm text-[var(--color-text-secondary)] ml-2">16:9 宽高比</p>
      </div>
    )
  },
  parameters: {
    layout: 'padded'
  }
}
