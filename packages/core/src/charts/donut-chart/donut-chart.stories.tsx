/**
 * DonutChart Component Stories
 *
 * Storybook stories for DonutChart component
 */

import type { Meta, StoryObj } from '@storybook/react'
import { DonutChart, type DonutDataPoint } from './donut-chart'

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof DonutChart> = {
  title: 'Charts/DonutChart',
  component: DonutChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
DonutChart 是图表组件库的核心组件，为图表提供环形图显示。

## 功能特性
- 可配置的内部半径和厚度
- 中心文本和副标题支持
- 百分比显示
- 图例和工具提示支持
- 交互式选择
- 主题系统集成

## 使用示例
\`\`\`tsx
const data: DonutDataPoint[] = [
  { id: '1', label: 'Desktop', value: 400, color: '#3b82f6' },
  { id: '2', label: 'Mobile', value: 300, color: '#ef4444' },
  { id: '3', label: 'Tablet', value: 200, color: '#10b981' }
]

<DonutChart
  data={data}
  showCenterText={true}
  centerText="Total Users"
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
      description: '图表数据'
    },
    innerRadius: {
      control: 'number',
      description: '环形图的内部半径比例（0-1）'
    },
    showCenterText: {
      control: 'boolean',
      description: '是否显示中心文本'
    },
    centerText: {
      control: 'text',
      description: '中心文本的内容'
    },
    centerSubtitle: {
      control: 'text',
      description: '中心文本的副标题'
    },
    showPercentage: {
      control: 'boolean',
      description: '是否显示百分比'
    },
    showLegend: {
      control: 'boolean',
      description: '是否显示图例'
    },
    showTooltip: {
      control: 'boolean',
      description: '是否显示工具提示'
    },
    showLabels: {
      control: 'boolean',
      description: '是否显示连接线'
    },
    labelPosition: {
      control: 'select',
      options: ['inside', 'outside'],
      description: '标签的位置'
    },
    startAngle: {
      control: 'number',
      description: '饼图的起始角度（度数）'
    },
    thickness: {
      control: 'number',
      description: '环形图的厚度'
    },
    interactive: {
      control: 'boolean',
      description: '是否启用选择模式'
    }
  }
}

export default meta
export { meta }
type Story = StoryObj<typeof meta>

// ============================================================================
// Sample Data
// ============================================================================

const sampleData: DonutDataPoint[] = [
  { id: '1', label: 'Desktop', value: 400, color: '#3b82f6' },
  { id: '2', label: 'Mobile', value: 300, color: '#ef4444' },
  { id: '3', label: 'Tablet', value: 200, color: '#10b981' },
  { id: '4', label: 'Other', value: 100, color: '#f59e0b' }
]

// ============================================================================
// Stories
// ============================================================================

/**
 * Basic donut chart
 */
export const Basic: Story = {
  args: {
    data: [
      { id: '1', label: 'Category A', value: 30, color: '#3b82f6' },
      { id: '2', label: 'Category B', value: 50, color: '#ef4444' },
      { id: '3', label: 'Category C', value: 20, color: '#10b981' }
    ]
  }
}

/**
 * With center text
 */
export const WithCenterText: Story = {
  args: {
    data: sampleData,
    showCenterText: true,
    centerText: '1,000',
    centerSubtitle: 'Total Users',
    showLegend: true
  }
}

/**
 * Without center text
 */
export const WithoutCenterText: Story = {
  args: {
    data: sampleData,
    showCenterText: false,
    showLegend: true
  }
}

/**
 * With percentage
 */
export const WithPercentage: Story = {
  args: {
    data: sampleData,
    showCenterText: true,
    centerText: '40%',
    centerSubtitle: 'Growth',
    showLegend: true
  }
}

/**
 * Custom inner radius
 */
export const CustomInnerRadius: Story = {
  args: {
    data: sampleData,
    innerRadius: 0.8,
    showCenterText: true,
    centerText: 'Total',
    showLegend: true
  }
}

/**
 * Thicker donut
 */
export const ThickerDonut: Story = {
  args: {
    data: sampleData,
    thickness: 40,
    showCenterText: true,
    centerText: 'Sales',
    showLegend: true
  }
}

/**
 * Custom start angle
 */
export const CustomStartAngle: Story = {
  args: {
    data: sampleData,
    startAngle: 0,
    showCenterText: true,
    centerText: 'Revenue',
    showLegend: true
  }
}

/**
 * With labels
 */
export const WithLabels: Story = {
  args: {
    data: sampleData,
    showLabels: true,
    labelPosition: 'outside',
    showLegend: true
  }
}

/**
 * Labels inside
 */
export const LabelsInside: Story = {
  args: {
    data: sampleData,
    showLabels: true,
    labelPosition: 'inside',
    showLegend: false
  }
}

/**
 * Without legend
 */
export const WithoutLegend: Story = {
  args: {
    data: sampleData,
    showLegend: false,
    showCenterText: true,
    centerText: 'Total'
  }
}

/**
 * Single segment
 */
export const SingleSegment: Story = {
  args: {
    data: [
      { id: '1', label: 'Complete', value: 100, color: '#10b981' }
    ],
    showCenterText: true,
    centerText: '100%',
    centerSubtitle: 'Complete'
  }
}

/**
 * Many segments
 */
export const ManySegments: Story = {
  args: {
    data: [
      { id: '1', label: 'Segment 1', value: 15, color: '#3b82f6' },
      { id: '2', label: 'Segment 2', value: 15, color: '#ef4444' },
      { id: '3', label: 'Segment 3', value: 15, color: '#10b981' },
      { id: '4', label: 'Segment 4', value: 15, color: '#f59e0b' },
      { id: '5', label: 'Segment 5', value: 15, color: '#8b5cf6' },
      { id: '6', label: 'Segment 6', value: 15, color: '#ec4899' },
      { id: '7', label: 'Segment 7', value: 10, color: '#06b6d4' }
    ],
    showCenterText: true,
    centerText: 'Total',
    showLegend: true
  }
}

/**
 * With custom tooltip
 */
export const CustomTooltip: Story = {
  args: {
    data: sampleData,
    showCenterText: true,
    centerText: 'Users',
    showLegend: true,
    tooltipFormatter: (data) => (
      <div>
        <p className="font-medium">{data.label}</p>
        <p>值: {data.value}</p>
        <p>占比: {((data.value / sampleData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%</p>
      </div>
    )
  }
}

/**
 * Custom size
 */
export const CustomSize: Story = {
  args: {
    data: sampleData,
    height: 400,
    width: 400,
    showCenterText: true,
    centerText: 'Custom',
    showLegend: true
  }
}

/**
 * Interactive example
 */
export const Interactive: Story = {
  args: {
    data: sampleData,
    interactive: true,
    showCenterText: true,
    centerText: 'Click to Select',
    showLegend: true
  }
}

/**
 * Sales distribution
 */
export const SalesDistribution: Story = {
  args: {
    data: [
      { id: '1', label: 'Q1 Sales', value: 250, color: '#3b82f6' },
      { id: '2', label: 'Q2 Sales', value: 180, color: '#ef4444' },
      { id: '3', label: 'Q3 Sales', value: 220, color: '#10b981' },
      { id: '4', label: 'Q4 Sales', value: 200, color: '#f59e0b' }
    ],
    showCenterText: true,
    centerText: '$850K',
    centerSubtitle: 'Total Sales',
    showLegend: true,
    innerRadius: 0.7,
    thickness: 30
  }
}

/**
 * Market share
 */
export const MarketShare: Story = {
  args: {
    data: [
      { id: '1', label: 'Company A', value: 35, color: '#3b82f6' },
      { id: '2', label: 'Company B', value: 28, color: '#ef4444' },
      { id: '3', label: 'Company C', value: 22, color: '#10b981' },
      { id: '4', label: 'Others', value: 15, color: '#f59e0b' }
    ],
    showCenterText: true,
    centerText: '100%',
    centerSubtitle: 'Market Share',
    showLegend: true,
    showLabels: true,
    labelPosition: 'outside'
  }
}

/**
 * Budget allocation
 */
export const BudgetAllocation: Story = {
  args: {
    data: [
      { id: '1', label: 'Marketing', value: 30, color: '#3b82f6' },
      { id: '2', label: 'R&D', value: 25, color: '#ef4444' },
      { id: '3', label: 'Operations', value: 20, color: '#10b981' },
      { id: '4', label: 'Sales', value: 15, color: '#f59e0b' },
      { id: '5', label: 'Admin', value: 10, color: '#8b5cf6' }
    ],
    showCenterText: true,
    centerText: '$1M',
    centerSubtitle: 'Budget',
    showLegend: true,
    innerRadius: 0.6
  }
}
