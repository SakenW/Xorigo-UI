/**
 * AreaChart Component Stories
 *
 * Storybook stories for AreaChart component
 */

import type { Meta, StoryObj } from '@storybook/react'
import { AreaChart, type AreaSeries } from './area-chart'

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof AreaChart> = {
  title: 'Charts/AreaChart',
  component: AreaChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
AreaChart 是图表组件库的核心组件，为图表提供面积图显示。

## 功能特性
- 多种面积图类型（默认、堆叠、百分比）
- 支持多个数据系列
- 可配置的颜色和透明度
- 网格线、图例、工具提示支持
- 主题系统集成

## 使用示例
\`\`\`tsx
const data: AreaSeries[] = [
  {
    name: 'Series 1',
    color: '#3b82f6',
    data: [
      { x: 1, y: 10 },
      { x: 2, y: 20 },
      { x: 3, y: 30 }
    ]
  }
]

<AreaChart
  data={data}
  type="default"
  showGrid={true}
  showLegend={true}
/>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
      description: '图表数据系列'
    },
    type: {
      control: 'select',
      options: ['default', 'stacked', 'percent'],
      description: '面积图的类型'
    },
    showGrid: {
      control: 'boolean',
      description: '是否显示网格线'
    },
    showLegend: {
      control: 'boolean',
      description: '是否显示图例'
    },
    showAxis: {
      control: 'boolean',
      description: '是否显示坐标轴'
    },
    showTooltip: {
      control: 'boolean',
      description: '是否显示工具提示'
    },
    xAxisLabel: {
      control: 'text',
      description: 'X 轴的标签'
    },
    yAxisLabel: {
      control: 'text',
      description: 'Y 轴的标签'
    },
    fillOpacity: {
      control: 'number',
      description: '填充透明度'
    },
    showStroke: {
      control: 'boolean',
      description: '是否显示面积边界线'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Sample Data
// ============================================================================

const sampleData: AreaSeries[] = [
  {
    name: 'Desktop',
    color: '#3b82f6',
    data: [
      { x: 1, y: 400 },
      { x: 2, y: 300 },
      { x: 3, y: 200 },
      { x: 4, y: 100 },
      { x: 5, y: 50 },
      { x: 6, y: 20 }
    ]
  },
  {
    name: 'Mobile',
    color: '#ef4444',
    data: [
      { x: 1, y: 200 },
      { x: 2, y: 300 },
      { x: 3, y: 250 },
      { x: 4, y: 280 },
      { x: 5, y: 320 },
      { x: 6, y: 350 }
    ]
  },
  {
    name: 'Tablet',
    color: '#10b981',
    data: [
      { x: 1, y: 100 },
      { x: 2, y: 150 },
      { x: 3, y: 180 },
      { x: 4, y: 220 },
      { x: 5, y: 260 },
      { x: 6, y: 300 }
    ]
  }
]

// ============================================================================
// Stories
// ============================================================================

/**
 * Basic area chart
 */
export const Basic: Story = {
  args: {
    data: [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 },
          { x: 4, y: 25 },
          { x: 5, y: 35 },
          { x: 6, y: 40 }
        ]
      }
    ],
    xAxisLabel: '时间',
    yAxisLabel: '数值'
  }
}

/**
 * Multiple series
 */
export const MultipleSeries: Story = {
  args: {
    data: sampleData,
    xAxisLabel: '月份',
    yAxisLabel: '用户数',
    showLegend: true
  }
}

/**
 * Stacked area chart
 */
export const Stacked: Story = {
  args: {
    data: sampleData,
    type: 'stacked',
    xAxisLabel: '月份',
    yAxisLabel: '用户数',
    showLegend: true
  }
}

/**
 * Percentage area chart
 */
export const Percentage: Story = {
  args: {
    data: sampleData,
    type: 'percent',
    xAxisLabel: '月份',
    yAxisLabel: '占比 (%)',
    showLegend: true
  }
}

/**
 * Without grid
 */
export const WithoutGrid: Story = {
  args: {
    data: sampleData,
    showGrid: false,
    xAxisLabel: '月份',
    yAxisLabel: '数值'
  }
}

/**
 * Without legend
 */
export const WithoutLegend: Story = {
  args: {
    data: sampleData,
    showLegend: false,
    xAxisLabel: '月份',
    yAxisLabel: '数值'
  }
}

/**
 * Without axis
 */
export const WithoutAxis: Story = {
  args: {
    data: sampleData,
    showAxis: false,
    showLegend: true
  }
}

/**
 * Custom fill opacity
 */
export const CustomOpacity: Story = {
  args: {
    data: sampleData,
    fillOpacity: 0.3,
    xAxisLabel: '月份',
    yAxisLabel: '数值',
    showLegend: true
  }
}

/**
 * Without stroke
 */
export const WithoutStroke: Story = {
  args: {
    data: sampleData,
    showStroke: false,
    xAxisLabel: '月份',
    yAxisLabel: '数值',
    showLegend: true
  }
}

/**
 * String x-axis values
 */
export const StringXAxis: Story = {
  args: {
    data: [
      {
        name: 'Revenue',
        color: '#3b82f6',
        data: [
          { x: 'Jan', y: 4000 },
          { x: 'Feb', y: 3000 },
          { x: 'Mar', y: 2000 },
          { x: 'Apr', y: 2780 },
          { x: 'May', y: 1890 },
          { x: 'Jun', y: 2390 }
        ]
      }
    ],
    xAxisLabel: '月份',
    yAxisLabel: '收入',
    showLegend: true
  }
}

/**
 * Custom height and width
 */
export const CustomSize: Story = {
  args: {
    data: sampleData,
    height: 400,
    width: 700,
    xAxisLabel: '月份',
    yAxisLabel: '数值',
    showLegend: true
  }
}

/**
 * With custom tooltip formatter
 */
export const CustomTooltip: Story = {
  args: {
    data: sampleData,
    xAxisLabel: '月份',
    yAxisLabel: '用户数',
    showLegend: true,
    tooltipFormatter: (data, series) => (
      <div>
        <p className="font-medium">{series.name}</p>
        <p>值: {data.y}</p>
        <p>分类: {data.x}</p>
      </div>
    )
  }
}

/**
 * Negative values
 */
export const NegativeValues: Story = {
  args: {
    data: [
      {
        name: 'Profit/Loss',
        color: '#3b82f6',
        data: [
          { x: 1, y: 100 },
          { x: 2, y: -50 },
          { x: 3, y: 75 },
          { x: 4, y: -25 },
          { x: 5, y: 125 },
          { x: 6, y: 50 }
        ]
      }
    ],
    xAxisLabel: '季度',
    yAxisLabel: '利润',
    showLegend: true
  }
}

/**
 * High contrast colors
 */
export const HighContrast: Story = {
  args: {
    data: [
      {
        name: 'Product A',
        color: '#000000',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      },
      {
        name: 'Product B',
        color: '#ff0000',
        data: [
          { x: 1, y: 15 },
          { x: 2, y: 25 },
          { x: 3, y: 35 }
        ]
      }
    ],
    xAxisLabel: '时间',
    yAxisLabel: '销售量',
    showLegend: true,
    fillOpacity: 0.7
  }
}

/**
 * Seasonal data
 */
export const SeasonalData: Story = {
  args: {
    data: [
      {
        name: 'Spring',
        color: '#10b981',
        data: [
          { x: 'Week 1', y: 20 },
          { x: 'Week 2', y: 35 },
          { x: 'Week 3', y: 45 },
          { x: 'Week 4', y: 55 }
        ]
      },
      {
        name: 'Summer',
        color: '#f59e0b',
        data: [
          { x: 'Week 1', y: 40 },
          { x: 'Week 2', y: 60 },
          { x: 'Week 3', y: 80 },
          { x: 'Week 4', y: 90 }
        ]
      },
      {
        name: 'Autumn',
        color: '#ef4444',
        data: [
          { x: 'Week 1', y: 30 },
          { x: 'Week 2', y: 25 },
          { x: 'Week 3', y: 20 },
          { x: 'Week 4', y: 15 }
        ]
      },
      {
        name: 'Winter',
        color: '#3b82f6',
        data: [
          { x: 'Week 1', y: 10 },
          { x: 'Week 2', y: 15 },
          { x: 'Week 3', y: 20 },
          { x: 'Week 4', y: 25 }
        ]
      }
    ],
    xAxisLabel: '周',
    yAxisLabel: '温度',
    showLegend: true,
    fillOpacity: 0.5
  }
}
