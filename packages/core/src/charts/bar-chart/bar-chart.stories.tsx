/**
 * BarChart Component Stories
 *
 * BarChart 组件的故事文件，展示各种使用场景和配置选项
 */

import type { Meta, StoryObj } from '@storybook/react'
import { BarChart } from './bar-chart'

// ============================================================================
// Meta Configuration
// ============================================================================

const meta = {
  title: 'Charts/BarChart',
  component: BarChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
BarChart 组件是一个功能强大的柱状图可视化组件，支持多种图表类型、方向和配置选项。

### 主要特性
- 支持垂直和水平柱状图
- 支持默认、分组、堆叠和百分比堆叠四种变体
- 内置网格线、坐标轴、图例和工具提示
- 流畅的动画过渡效果
- 完整的 TypeScript 类型支持
- 主题系统集成

### 使用场景
- 数据对比分析
- 时间序列数据展示
- 分类数据可视化
- 多系列数据对比
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: '柱状图方向'
    },
    variant: {
      control: 'select',
      options: ['default', 'grouped', 'stacked', 'percentage'],
      description: '图表变体类型'
    },
    showGrid: {
      control: 'boolean',
      description: '是否显示网格线'
    },
    showAxis: {
      control: 'boolean',
      description: '是否显示坐标轴'
    },
    showLegend: {
      control: 'boolean',
      description: '是否显示图例'
    },
    showTooltip: {
      control: 'boolean',
      description: '是否显示工具提示'
    },
    showValues: {
      control: 'boolean',
      description: '是否显示数值标签'
    },
    animate: {
      control: 'boolean',
      description: '是否启用动画'
    }
  }
} satisfies Meta<typeof BarChart>

export default meta
export { meta }

type Story = StoryObj<typeof meta>

// ============================================================================
// Base Data
// ============================================================================

const singleSeriesData = [
  {
    id: 'series-1',
    name: 'Revenue',
    color: '#3b82f6',
    data: [
      { x: 'Jan', y: 4000 },
      { x: 'Feb', y: 3000 },
      { x: 'Mar', y: 5000 },
      { x: 'Apr', y: 4500 },
      { x: 'May', y: 6000 }
    ]
  }
]

const multiSeriesData = [
  {
    id: 'desktop',
    name: 'Desktop',
    color: '#3b82f6',
    data: [
      { x: 'Q1', y: 400 },
      { x: 'Q2', y: 300 },
      { x: 'Q3', y: 500 },
      { x: 'Q4', y: 450 }
    ]
  },
  {
    id: 'mobile',
    name: 'Mobile',
    color: '#ef4444',
    data: [
      { x: 'Q1', y: 200 },
      { x: 'Q2', y: 300 },
      { x: 'Q3', y: 400 },
      { x: 'Q4', y: 350 }
    ]
  },
  {
    id: 'tablet',
    name: 'Tablet',
    color: '#10b981',
    data: [
      { x: 'Q1', y: 150 },
      { x: 'Q2', y: 180 },
      { x: 'Q3', y: 220 },
      { x: 'Q4', y: 200 }
    ]
  }
]

const negativeData = [
  {
    id: 'profit-loss',
    name: 'Profit/Loss',
    color: '#8b5cf6',
    data: [
      { x: 'Jan', y: 1200 },
      { x: 'Feb', y: -500 },
      { x: 'Mar', y: 800 },
      { x: 'Apr', y: -300 },
      { x: 'May', y: 1500 }
    ]
  }
]

// ============================================================================
// Stories
// ============================================================================

export const Default: Story = {
  name: 'Default Vertical Bar Chart',
  args: {
    data: singleSeriesData,
    width: 800,
    height: 400,
    direction: 'vertical',
    variant: 'default'
  }
}

export const Horizontal: Story = {
  name: 'Horizontal Bar Chart',
  args: {
    data: singleSeriesData,
    width: 800,
    height: 400,
    direction: 'horizontal',
    variant: 'default'
  }
}

export const Grouped: Story = {
  name: 'Grouped Bar Chart',
  args: {
    data: multiSeriesData,
    width: 900,
    height: 400,
    variant: 'grouped',
    showLegend: true,
    showValues: true
  }
}

export const Stacked: Story = {
  name: 'Stacked Bar Chart',
  args: {
    data: multiSeriesData,
    width: 900,
    height: 400,
    variant: 'stacked',
    showLegend: true,
    showValues: true
  }
}

export const Percentage: Story = {
  name: 'Percentage Stacked Bar Chart',
  args: {
    data: multiSeriesData,
    width: 900,
    height: 400,
    variant: 'percentage',
    showLegend: true
  }
}

export const WithGrid: Story = {
  name: 'With Grid Lines',
  args: {
    data: singleSeriesData,
    width: 800,
    height: 400,
    grid: { enabled: true },
    showGrid: true
  }
}

export const WithoutGrid: Story = {
  name: 'Without Grid Lines',
  args: {
    data: singleSeriesData,
    width: 800,
    height: 400,
    grid: { enabled: false },
    showGrid: false
  }
}

export const WithValues: Story = {
  name: 'With Value Labels',
  args: {
    data: singleSeriesData,
    width: 800,
    height: 400,
    showValues: true
  }
}

export const WithAxisLabels: Story = {
  name: 'With Axis Labels',
  args: {
    data: singleSeriesData,
    width: 800,
    height: 400,
    axis: {
      x: { enabled: true, label: 'Month' },
      y: { enabled: true, label: 'Revenue ($)' }
    }
  }
}

export const WithCustomColors: Story = {
  name: 'Custom Color Palette',
  args: {
    data: multiSeriesData,
    width: 900,
    height: 400,
    colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']
  }
}

export const Animated: Story = {
  name: 'Animated Chart',
  args: {
    data: multiSeriesData,
    width: 900,
    height: 400,
    animate: true,
    animationDuration: 1500,
    variant: 'grouped'
  }
}

export const NoAnimation: Story = {
  name: 'Static Chart (No Animation)',
  args: {
    data: multiSeriesData,
    width: 900,
    height: 400,
    animate: false,
    variant: 'grouped'
  }
}

export const NegativeValues: Story = {
  name: 'Chart with Negative Values',
  args: {
    data: negativeData,
    width: 800,
    height: 400,
    showValues: true
  }
}

export const Compact: Story = {
  name: 'Compact Layout',
  args: {
    data: singleSeriesData,
    width: 500,
    height: 250,
    margin: { top: 10, right: 20, bottom: 30, left: 40 },
    barGap: 2,
    barCategoryGap: 10
  }
}

export const LargeDataset: Story = {
  name: 'Large Dataset',
  args: {
    data: [
      {
        id: 'large-series',
        name: 'Data Points',
        color: '#3b82f6',
        data: Array.from({ length: 20 }, (_, i) => ({
          x: `Item ${i + 1}`,
          y: Math.floor(Math.random() * 1000) + 100
        }))
      }
    ],
    width: 1200,
    height: 400,
    showValues: false
  }
}

export const EmptyData: Story = {
  name: 'Empty Data',
  args: {
    data: [],
    width: 800,
    height: 400
  }
}

export const HiddenSeries: Story = {
  name: 'Series Visibility Toggle',
  args: {
    data: [
      {
        id: 'visible',
        name: 'Visible Series',
        color: '#3b82f6',
        visible: true,
        data: [
          { x: 'Q1', y: 400 },
          { x: 'Q2', y: 300 },
          { x: 'Q3', y: 500 }
        ]
      },
      {
        id: 'hidden',
        name: 'Hidden Series',
        color: '#ef4444',
        visible: false,
        data: [
          { x: 'Q1', y: 200 },
          { x: 'Q2', y: 300 },
          { x: 'Q3', y: 400 }
        ]
      }
    ],
    width: 800,
    height: 400,
    showLegend: true
  }
}

export const CustomTooltip: Story = {
  name: 'Custom Tooltip Configuration',
  args: {
    data: multiSeriesData,
    width: 900,
    height: 400,
    tooltip: {
      enabled: true,
      followCursor: true,
      showValue: true,
      showSeries: true,
      offset: 15
    },
    variant: 'grouped'
  }
}

export const Responsive: Story = {
  name: 'Responsive Chart',
  args: {
    data: multiSeriesData,
    width: '100%',
    height: 400,
    variant: 'stacked',
    showLegend: true
  }
}

export const DarkTheme: Story = {
  name: 'Dark Theme Support',
  args: {
    data: multiSeriesData,
    width: 900,
    height: 400,
    variant: 'grouped',
    showLegend: true
  },
  decorators: [
    (Story: any) => (
      <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
        <Story />
      </div>
    )
  ]
}

export const CustomBarSpacing: Story = {
  name: 'Custom Bar Spacing',
  args: {
    data: multiSeriesData,
    width: 900,
    height: 400,
    variant: 'grouped',
    barGap: 8,
    barCategoryGap: 30
  }
}

export const Interactive: Story = {
  name: 'Interactive Chart with Events',
  args: {
    data: multiSeriesData,
    width: 900,
    height: 400,
    variant: 'grouped',
    showValues: true,
    onBarClick: (data: any) => {
      console.log('Bar clicked:', data)
    },
    onBarHover: (data: any) => {
      console.log('Bar hovered:', data)
    }
  }
}
