/**
 * @fileoverview PieChart 组件故事文件
 * @author Xorigo UI Team
 * @version 1.0.0
 */

import type { Meta, StoryObj } from '@storybook/react'
import { PieChart } from './pie-chart'

// ============================================================================
// 基础元数据
// ============================================================================

const meta = {
  title: 'Charts/PieChart',
  component: PieChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**PieChart 饼图组件**是一个功能完整的数据可视化组件，支持多种饼图变体和交互功能。

## 主要特性

- 📊 **多种变体**: 标准饼图、环形饼图、爆炸式饼图、同心饼图
- 🎨 **主题集成**: 完美集成七轴主题系统，支持自定义颜色
- 📈 **数据展示**: 支持百分比显示、数据标签、图例
- 🎭 **动画效果**: 基于 Framer Motion 的流畅动画
- 🖱️ **交互功能**: 鼠标悬停、工具提示、高亮显示
- ♿ **可访问性**: 完整的 ARIA 标签和键盘导航支持
- 📏 **响应式**: 支持多种尺寸，适应不同容器

## 使用场景

- 市场份额分析
- 销售数据分布
- 用户群体分析
- 资源占用统计
- 投票结果展示

## 技术特性

- React 19 + TypeScript 5.9
- Framer Motion 12 动画
- SVG 渲染，性能优化
- 设计令牌系统
- forwardRef 支持
`
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['standard', 'donut', 'exploded', 'nested'],
      description: '饼图变体类型'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: '组件尺寸'
    },
    showPercentage: {
      control: 'boolean',
      description: '是否显示百分比'
    },
    showLabels: {
      control: 'boolean',
      description: '是否显示数据标签'
    },
    showLegend: {
      control: 'boolean',
      description: '是否显示图例'
    },
    legendPosition: {
      control: 'select',
      options: ['right', 'left', 'top', 'bottom'],
      description: '图例位置'
    }
  }
} satisfies Meta<typeof PieChart>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// 基础故事
// ============================================================================

export const 默认: Story = {
  args: {
    data: [
      { label: '类别A', value: 30, color: 'hsl(220, 90%, 56%)' },
      { label: '类别B', value: 25, color: 'hsl(180, 90%, 56%)' },
      { label: '类别C', value: 20, color: 'hsl(140, 90%, 56%)' },
      { label: '类别D', value: 25, color: 'hsl(260, 90%, 56%)' }
    ],
    variant: 'standard',
    size: 'md',
    showPercentage: true,
    showLabels: true,
    showLegend: true
  }
}

// ============================================================================
// 环形饼图故事
// ============================================================================

export const 环形饼图: Story = {
  args: {
    ...默认.args,
    variant: 'donut',
    centerText: (
      <div className="text-center">
        <div className="text-2xl font-bold">100%</div>
        <div className="text-sm text-muted-foreground">总计</div>
      </div>
    )
  }
}

// ============================================================================
// 爆炸式饼图故事
// ============================================================================

export const 爆炸式饼图: Story = {
  args: {
    data: [
      { label: '主要项', value: 40, highlighted: true, color: 'hsl(220, 90%, 56%)' },
      { label: '项目A', value: 20, color: 'hsl(180, 90%, 56%)' },
      { label: '项目B', value: 20, color: 'hsl(140, 90%, 56%)' },
      { label: '项目C', value: 20, color: 'hsl(260, 90%, 56%)' }
    ],
    variant: 'exploded',
    explodeOffset: 15,
    showPercentage: true,
    showLegend: true
  }
}

// ============================================================================
// 多尺寸展示故事
// ============================================================================

export const 多尺寸展示: Story = {
  render: () => (
    <div className="flex gap-8 flex-wrap">
      <div className="flex flex-col items-center">
        <h3 className="text-sm font-medium mb-2">小尺寸</h3>
        <PieChart
          data={[
            { label: 'A', value: 40, color: 'hsl(220, 90%, 56%)' },
            { label: 'B', value: 35, color: 'hsl(180, 90%, 56%)' },
            { label: 'C', value: 25, color: 'hsl(140, 90%, 56%)' }
          ]}
          size="sm"
          showLegend={false}
        />
      </div>

      <div className="flex flex-col items-center">
        <h3 className="text-sm font-medium mb-2">中尺寸</h3>
        <PieChart
          data={[
            { label: 'A', value: 40, color: 'hsl(220, 90%, 56%)' },
            { label: 'B', value: 35, color: 'hsl(180, 90%, 56%)' },
            { label: 'C', value: 25, color: 'hsl(140, 90%, 56%)' }
          ]}
          size="md"
          showLegend={false}
        />
      </div>

      <div className="flex flex-col items-center">
        <h3 className="text-sm font-medium mb-2">大尺寸</h3>
        <PieChart
          data={[
            { label: 'A', value: 40, color: 'hsl(220, 90%, 56%)' },
            { label: 'B', value: 35, color: 'hsl(180, 90%, 56%)' },
            { label: 'C', value: 25, color: 'hsl(140, 90%, 56%)' }
          ]}
          size="lg"
          showLegend={false}
        />
      </div>

      <div className="flex flex-col items-center">
        <h3 className="text-sm font-medium mb-2">超大尺寸</h3>
        <PieChart
          data={[
            { label: 'A', value: 40, color: 'hsl(220, 90%, 56%)' },
            { label: 'B', value: 35, color: 'hsl(180, 90%, 56%)' },
            { label: 'C', value: 25, color: 'hsl(140, 90%, 56%)' }
          ]}
          size="xl"
          showLegend={false}
        />
      </div>
    </div>
  )
}

// ============================================================================
// 功能开关故事
// ============================================================================

export const 功能开关展示: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-2">隐藏百分比和标签</h3>
        <PieChart
          data={[
            { label: '类别A', value: 30, color: 'hsl(220, 90%, 56%)' },
            { label: '类别B', value: 25, color: 'hsl(180, 90%, 56%)' },
            { label: '类别C', value: 20, color: 'hsl(140, 90%, 56%)' },
            { label: '类别D', value: 25, color: 'hsl(260, 90%, 56%)' }
          ]}
          showPercentage={false}
          showLabels={false}
          showLegend={true}
          legendPosition="bottom"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">仅显示图例</h3>
        <PieChart
          data={[
            { label: '类别A', value: 30, color: 'hsl(220, 90%, 56%)' },
            { label: '类别B', value: 25, color: 'hsl(180, 90%, 56%)' },
            { label: '类别C', value: 20, color: 'hsl(140, 90%, 56%)' },
            { label: '类别D', value: 25, color: 'hsl(260, 90%, 56%)' }
          ]}
          showPercentage={false}
          showLabels={false}
          showLegend={true}
          showTooltip={false}
        />
      </div>
    </div>
  )
}

// ============================================================================
// 实际用例故事
// ============================================================================

export const 市场份额分析: Story = {
  args: {
    data: [
      { label: '移动端', value: 45, color: 'hsl(220, 90%, 56%)' },
      { label: '桌面端', value: 30, color: 'hsl(180, 90%, 56%)' },
      { label: '平板端', value: 15, color: 'hsl(140, 90%, 56%)' },
      { label: '其他', value: 10, color: 'hsl(260, 90%, 56%)' }
    ],
    variant: 'donut',
    size: 'lg',
    centerText: (
      <div className="text-center">
        <div className="text-xl font-bold">100%</div>
        <div className="text-xs text-muted-foreground">市场份额</div>
      </div>
    ),
    showPercentage: true,
    showLegend: true,
    legendPosition: 'right'
  }
}

export const 销售数据分析: Story = {
  args: {
    data: [
      { label: '电子产品', value: 35, color: 'hsl(220, 90%, 56%)' },
      { label: '服装', value: 25, color: 'hsl(180, 90%, 56%)' },
      { label: '食品', value: 20, color: 'hsl(140, 90%, 56%)' },
      { label: '图书', value: 12, color: 'hsl(260, 90%, 56%)' },
      { label: '其他', value: 8, color: 'hsl(320, 90%, 56%)' }
    ],
    variant: 'standard',
    size: 'md',
    showPercentage: true,
    showLegend: true,
    legendPosition: 'bottom',
    showTooltip: true
  }
}

export const 用户群体分布: Story = {
  args: {
    data: [
      { label: '18-24岁', value: 20, color: 'hsl(220, 90%, 56%)' },
      { label: '25-34岁', value: 35, color: 'hsl(180, 90%, 56%)' },
      { label: '35-44岁', value: 25, color: 'hsl(140, 90%, 56%)' },
      { label: '45-54岁', value: 12, color: 'hsl(260, 90%, 56%)' },
      { label: '55岁以上', value: 8, color: 'hsl(320, 90%, 56%)' }
    ],
    variant: 'exploded',
    size: 'lg',
    explodeOffset: 10,
    showPercentage: true,
    showLegend: true,
    legendPosition: 'right'
  }
}

// ============================================================================
// 颜色主题故事
// ============================================================================

export const 自定义颜色主题: Story = {
  args: {
    data: [
      { label: '红色系', value: 30, color: '#ef4444' },
      { label: '橙色系', value: 25, color: '#f97316' },
      { label: '黄色系', value: 20, color: '#eab308' },
      { label: '绿色系', value: 15, color: '#22c55e' },
      { label: '蓝色系', value: 10, color: '#3b82f6' }
    ],
    colorTheme: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'],
    variant: 'donut',
    showPercentage: true,
    showLegend: true,
    legendPosition: 'bottom'
  }
}

// ============================================================================
// 图例位置故事
// ============================================================================

export const 图例位置展示: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <h3 className="text-sm font-medium mb-2">右侧图例</h3>
        <PieChart
          data={[
            { label: '类别A', value: 30, color: 'hsl(220, 90%, 56%)' },
            { label: '类别B', value: 25, color: 'hsl(180, 90%, 56%)' },
            { label: '类别C', value: 20, color: 'hsl(140, 90%, 56%)' },
            { label: '类别D', value: 25, color: 'hsl(260, 90%, 56%)' }
          ]}
          showLegend={true}
          legendPosition="right"
          size="sm"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">底部图例</h3>
        <PieChart
          data={[
            { label: '类别A', value: 30, color: 'hsl(220, 90%, 56%)' },
            { label: '类别B', value: 25, color: 'hsl(180, 90%, 56%)' },
            { label: '类别C', value: 20, color: 'hsl(140, 90%, 56%)' },
            { label: '类别D', value: 25, color: 'hsl(260, 90%, 56%)' }
          ]}
          showLegend={true}
          legendPosition="bottom"
          size="sm"
        />
      </div>
    </div>
  )
}

// ============================================================================
// 空状态故事
// ============================================================================

export const 空状态: Story = {
  args: {
    data: [],
    emptyText: '暂无数据可显示',
    variant: 'donut'
  }
}

export const 全零数据: Story = {
  args: {
    data: [
      { label: '类别A', value: 0 },
      { label: '类别B', value: 0 }
    ],
    emptyText: '所有数据均为零',
    variant: 'standard'
  }
}

// ============================================================================
// 交互演示故事
// ============================================================================

export const 交互演示: Story = {
  args: {
    data: [
      { label: '可点击项A', value: 35, color: 'hsl(220, 90%, 56%)' },
      { label: '可点击项B', value: 30, color: 'hsl(180, 90%, 56%)' },
      { label: '可点击项C', value: 20, color: 'hsl(140, 90%, 56%)' },
      { label: '可点击项D', value: 15, color: 'hsl(260, 90%, 56%)' }
    ],
    variant: 'donut',
    showTooltip: true,
    showPercentage: true,
    showLegend: true,
    size: 'lg'
  },
  parameters: {
    docs: {
      description: {
        story: '将鼠标悬停在扇形上查看交互效果和工具提示。'
      }
    }
  }
}
