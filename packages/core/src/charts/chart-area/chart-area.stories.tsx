/**
 * ChartArea Component Stories
 *
 * Storybook stories for ChartArea component
 */

import type { Meta, StoryObj } from '@storybook/react'
import { ChartArea, type AreaSeries } from './chart-area'

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof ChartArea> = {
  title: 'Charts/ChartArea',
  component: ChartArea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
ChartArea 是图表组件库的核心容器组件，为图表提供面积图可视化区域。

## 功能特性
- 多种面积图类型（默认、堆叠、百分比、流向）
- 支持渐变填充和数据点标记
- 阈值线显示和自定义样式
- 完整的动画和交互支持
- 主题系统深度集成

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

<ChartArea
  data={data}
  type="default"
  showGrid={true}
  showLegend={true}
  showMarkers={false}
  thresholdLines={[
    {
      y: 15,
      color: '#ef4444',
      label: 'Target',
      showLabel: true
    }
  ]}
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
      options: ['default', 'stacked', 'percent', 'stream'],
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
    },
    strokeWidth: {
      control: 'number',
      description: '边界线宽度'
    },
    showMarkers: {
      control: 'boolean',
      description: '是否显示数据点标记'
    },
    markerSize: {
      control: 'number',
      description: '数据点标记的大小'
    },
    fillType: {
      control: 'select',
      options: ['solid', 'gradient', 'pattern'],
      description: '区域填充类型'
    },
    animationDuration: {
      control: 'number',
      description: '动画持续时间（毫秒）'
    }
  }
}

export default meta
export { meta }
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
 * Stream area chart
 */
export const Stream: Story = {
  args: {
    data: sampleData,
    type: 'stream',
    xAxisLabel: '月份',
    yAxisLabel: '数值',
    showLegend: true
  }
}

/**
 * With gradient fill
 */
export const GradientFill: Story = {
  args: {
    data: [
      {
        name: 'Revenue',
        color: '#3b82f6',
        fillGradient: {
          from: '#3b82f6',
          to: '#8b5cf6'
        },
        data: [
          { x: 1, y: 400 },
          { x: 2, y: 300 },
          { x: 3, y: 200 },
          { x: 4, y: 278 },
          { x: 5, y: 189 },
          { x: 6, y: 239 }
        ]
      }
    ],
    xAxisLabel: '月份',
    yAxisLabel: '收入',
    showLegend: true,
    fillType: 'gradient'
  }
}

/**
 * With data markers
 */
export const WithMarkers: Story = {
  args: {
    data: [
      {
        name: 'Temperature',
        color: '#f59e0b',
        markerStyle: {
          size: 6,
          color: '#ffffff',
          borderColor: '#f59e0b',
          borderWidth: 2
        },
        data: [
          { x: 1, y: 20 },
          { x: 2, y: 25 },
          { x: 3, y: 30 },
          { x: 4, y: 28 },
          { x: 5, y: 35 },
          { x: 6, y: 32 }
        ]
      }
    ],
    xAxisLabel: '周',
    yAxisLabel: '温度 (°C)',
    showLegend: true,
    showMarkers: true,
    markerSize: 6
  }
}

/**
 * With threshold lines
 */
export const WithThresholdLines: Story = {
  args: {
    data: [
      {
        name: 'Performance',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 15 },
          { x: 3, y: 20 },
          { x: 4, y: 18 },
          { x: 5, y: 22 },
          { x: 6, y: 25 }
        ]
      }
    ],
    xAxisLabel: '时间',
    yAxisLabel: '性能指标',
    showLegend: true,
    thresholdLines: [
      {
        y: 15,
        color: '#ef4444',
        label: 'Minimum Target',
        showLabel: true
      },
      {
        y: 20,
        color: '#10b981',
        label: 'Target',
        showLabel: true
      }
    ]
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
 * Custom stroke width
 */
export const CustomStrokeWidth: Story = {
  args: {
    data: sampleData,
    strokeWidth: 3,
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
 * Negative values with threshold
 */
export const NegativeValuesWithThreshold: Story = {
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
    showLegend: true,
    thresholdLines: [
      {
        y: 0,
        color: '#6b7280',
        label: 'Break Even',
        showLabel: true
      }
    ]
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
 * Seasonal data with markers and threshold
 */
export const SeasonalData: Story = {
  args: {
    data: [
      {
        name: 'Spring',
        color: '#10b981',
        markerStyle: {
          size: 5,
          color: '#10b981'
        },
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
        markerStyle: {
          size: 5,
          color: '#f59e0b'
        },
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
        markerStyle: {
          size: 5,
          color: '#ef4444'
        },
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
        markerStyle: {
          size: 5,
          color: '#3b82f6'
        },
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
    showMarkers: true,
    fillOpacity: 0.5,
    thresholdLines: [
      {
        y: 30,
        color: '#8b5cf6',
        label: 'Average',
        showLabel: true
      }
    ]
  }
}

/**
 * Fast animation
 */
export const FastAnimation: Story = {
  args: {
    data: sampleData,
    xAxisLabel: '月份',
    yAxisLabel: '数值',
    showLegend: true,
    animationDuration: 300
  }
}

/**
 * Slow animation
 */
export const SlowAnimation: Story = {
  args: {
    data: sampleData,
    xAxisLabel: '月份',
    yAxisLabel: '数值',
    showLegend: true,
    animationDuration: 2000
  }
}
