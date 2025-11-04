/**
 * FunnelChart Component Stories
 *
 * Storybook stories for FunnelChart component
 */

import type { Meta, StoryObj } from '@storybook/react'
import { FunnelChart, type FunnelDataPoint } from './funnel-chart'

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof FunnelChart> = {
  title: 'Charts/FunnelChart',
  component: FunnelChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
FunnelChart 是图表组件库的核心组件，提供漏斗图显示功能。

## 功能特性
- 支持转化漏斗、销售漏斗等场景
- 可配置百分比、数值和标签显示
- 支持图例和工具提示
- 集成主题系统和动画效果
- 支持多种样式变体
- 响应式设计

## 使用示例
\`\`\`tsx
const data: FunnelDataPoint[] = [
  { label: '访问', value: 1000 },
  { label: '注册', value: 800 },
  { label: '激活', value: 600 },
  { label: '付费', value: 400 }
]

<FunnelChart
  data={data}
  showPercentage={true}
  showValue={true}
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
      description: '漏斗图数据'
    },
    direction: {
      control: 'select',
      options: ['top-to-bottom', 'bottom-to-top'],
      description: '漏斗图的方向'
    },
    showPercentage: {
      control: 'boolean',
      description: '是否显示百分比'
    },
    showValue: {
      control: 'boolean',
      description: '是否显示数值'
    },
    showLabel: {
      control: 'boolean',
      description: '是否显示标签'
    },
    showLegend: {
      control: 'boolean',
      description: '是否显示图例'
    },
    showTooltip: {
      control: 'boolean',
      description: '是否显示工具提示'
    },
    variant: {
      control: 'select',
      options: ['default', 'gradient', 'solid'],
      description: '漏斗图的样式变体'
    },
    showStroke: {
      control: 'boolean',
      description: '是否显示描边'
    },
    legendPosition: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: '图例位置'
    },
    stageHeight: {
      control: 'number',
      description: '阶段高度'
    },
    stageGap: {
      control: 'number',
      description: '阶段间距'
    },
    animationDuration: {
      control: 'number',
      description: '动画持续时间'
    },
    height: {
      control: 'number',
      description: '图表高度'
    },
    width: {
      control: 'text',
      description: '图表宽度'
    },
    maxWidth: {
      control: 'number',
      description: '最大宽度'
    },
    minWidth: {
      control: 'number',
      description: '最小宽度'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Sample Data
// ============================================================================

const salesFunnelData: FunnelDataPoint[] = [
  { label: '访问', value: 10000, description: '网站访问量' },
  { label: '注册', value: 8000, description: '用户注册' },
  { label: '试用', value: 6000, description: '开始试用' },
  { label: '付费', value: 4000, description: '完成付费' },
  { label: '留存', value: 2000, description: '持续使用' }
]

const conversionFunnelData: FunnelDataPoint[] = [
  { label: '首页访问', value: 5000 },
  { label: '产品页', value: 3500 },
  { label: '购物车', value: 2100 },
  { label: '结算', value: 1050 },
  { label: '完成购买', value: 630 }
]

const recruitmentFunnelData: FunnelDataPoint[] = [
  { label: '简历投递', value: 200 },
  { label: '初步筛选', value: 120 },
  { label: '面试邀请', value: 60 },
  { label: '面试通过', value: 30 },
  { label: 'Offer接受', value: 20 }
]

const customerJourneyData: FunnelDataPoint[] = [
  { label: '认知', value: 1000 },
  { label: '兴趣', value: 800 },
  { label: '考虑', value: 600 },
  { label: '购买', value: 400 },
  { label: '推荐', value: 200 }
]

// ============================================================================
// Stories
// ============================================================================

/**
 * Basic funnel chart
 */
export const Basic: Story = {
  args: {
    data: salesFunnelData
  }
}

/**
 * Sales funnel with all features enabled
 */
export const SalesFunnel: Story = {
  args: {
    data: salesFunnelData,
    showPercentage: true,
    showValue: true,
    showLabel: true,
    showLegend: true,
    showTooltip: true,
    variant: 'gradient',
    height: 400
  }
}

/**
 * Conversion funnel
 */
export const ConversionFunnel: Story = {
  args: {
    data: conversionFunnelData,
    showPercentage: true,
    showValue: true,
    showLegend: true,
    variant: 'solid',
    height: 450,
    legendPosition: 'right'
  }
}

/**
 * Recruitment funnel
 */
export const RecruitmentFunnel: Story = {
  args: {
    data: recruitmentFunnelData,
    showPercentage: true,
    showValue: true,
    showLegend: true,
    variant: 'gradient',
    height: 400,
    formatValue: (v) => `${v}人`,
    formatPercentage: (p) => `${p.toFixed(0)}%`
  }
}

/**
 * Customer journey
 */
export const CustomerJourney: Story = {
  args: {
    data: customerJourneyData,
    showPercentage: true,
    showValue: true,
    showLegend: true,
    variant: 'default',
    height: 400,
    showStroke: true
  }
}

/**
 * Without percentage
 */
export const WithoutPercentage: Story = {
  args: {
    data: salesFunnelData,
    showPercentage: false,
    showValue: true,
    showLabel: true,
    showLegend: true
  }
}

/**
 * Without value
 */
export const WithoutValue: Story = {
  args: {
    data: salesFunnelData,
    showPercentage: true,
    showValue: false,
    showLabel: true,
    showLegend: true
  }
}

/**
 * Without label
 */
export const WithoutLabel: Story = {
  args: {
    data: salesFunnelData,
    showPercentage: true,
    showValue: true,
    showLabel: false,
    showLegend: true
  }
}

/**
 * Without legend
 */
export const WithoutLegend: Story = {
  args: {
    data: salesFunnelData,
    showPercentage: true,
    showValue: true,
    showLabel: true,
    showLegend: false
  }
}

/**
 * Without tooltip
 */
export const WithoutTooltip: Story = {
  args: {
    data: salesFunnelData,
    showPercentage: true,
    showValue: true,
    showLabel: true,
    showLegend: true,
    showTooltip: false
  }
}

/**
 * Bottom to top direction
 */
export const BottomToTop: Story = {
  args: {
    data: salesFunnelData,
    direction: 'bottom-to-top',
    showPercentage: true,
    showValue: true,
    showLabel: true,
    showLegend: true
  }
}

/**
 * Default variant
 */
export const DefaultVariant: Story = {
  args: {
    data: salesFunnelData,
    variant: 'default',
    showPercentage: true,
    showValue: true,
    showLegend: true,
    height: 400
  }
}

/**
 * Gradient variant
 */
export const GradientVariant: Story = {
  args: {
    data: salesFunnelData,
    variant: 'gradient',
    showPercentage: true,
    showValue: true,
    showLegend: true,
    height: 400
  }
}

/**
 * Solid variant
 */
export const SolidVariant: Story = {
  args: {
    data: salesFunnelData,
    variant: 'solid',
    showPercentage: true,
    showValue: true,
    showLegend: true,
    height: 400,
    showStroke: false
  }
}

/**
 * Legend at top
 */
export const LegendAtTop: Story = {
  args: {
    data: salesFunnelData,
    legendPosition: 'top',
    showPercentage: true,
    showValue: true,
    showLegend: true,
    height: 450
  }
}

/**
 * Legend at right
 */
export const LegendAtRight: Story = {
  args: {
    data: salesFunnelData,
    legendPosition: 'right',
    showPercentage: true,
    showValue: true,
    showLegend: true,
    height: 400,
    width: 600
  }
}

/**
 * Legend at left
 */
export const LegendAtLeft: Story = {
  args: {
    data: salesFunnelData,
    legendPosition: 'left',
    showPercentage: true,
    showValue: true,
    showLegend: true,
    height: 400,
    width: 600
  }
}

/**
 * Custom stage height
 */
export const CustomStageHeight: Story = {
  args: {
    data: salesFunnelData,
    stageHeight: 80,
    showPercentage: true,
    showValue: true,
    showLegend: true,
    height: 450
  }
}

/**
 * Custom stage gap
 */
export const CustomStageGap: Story = {
  args: {
    data: salesFunnelData,
    stageGap: 16,
    showPercentage: true,
    showValue: true,
    showLegend: true,
    height: 400
  }
}

/**
 * Custom colors
 */
export const CustomColors: Story = {
  args: {
    data: [
      { label: '阶段 1', value: 100, color: '#ff6b6b' },
      { label: '阶段 2', value: 80, color: '#4ecdc4' },
      { label: '阶段 3', value: 60, color: '#45b7d1' },
      { label: '阶段 4', value: 40, color: '#f9ca24' },
      { label: '阶段 5', value: 20, color: '#6c5ce7' }
    ],
    showPercentage: true,
    showValue: true,
    showLegend: true,
    variant: 'solid',
    height: 400
  }
}

/**
 * Custom formatting
 */
export const CustomFormatting: Story = {
  args: {
    data: salesFunnelData,
    showPercentage: true,
    showValue: true,
    showLegend: true,
    formatValue: (v) => `¥${v.toLocaleString()}`,
    formatPercentage: (p) => `${p.toFixed(1)}%`,
    height: 400
  }
}

/**
 * Custom size
 */
export const CustomSize: Story = {
  args: {
    data: salesFunnelData,
    showPercentage: true,
    showValue: true,
    showLegend: true,
    height: 500,
    width: 700,
    maxWidth: 600,
    minWidth: 300
  }
}

/**
 * Without stroke
 */
export const WithoutStroke: Story = {
  args: {
    data: salesFunnelData,
    showPercentage: true,
    showValue: true,
    showLegend: true,
    showStroke: false,
    variant: 'gradient'
  }
}

/**
 * Small data set
 */
export const SmallDataSet: Story = {
  args: {
    data: [
      { label: '步骤 1', value: 100 },
      { label: '步骤 2', value: 50 },
      { label: '步骤 3', value: 25 }
    ],
    showPercentage: true,
    showValue: true,
    showLegend: true,
    height: 300
  }
}

/**
 * Large data set
 */
export const LargeDataSet: Story = {
  args: {
    data: [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 90 },
      { label: '阶段 3', value: 80 },
      { label: '阶段 4', value: 70 },
      { label: '阶段 5', value: 60 },
      { label: '阶段 6', value: 50 },
      { label: '阶段 7', value: 40 },
      { label: '阶段 8', value: 30 },
      { label: '阶段 9', value: 20 },
      { label: '阶段 10', value: 10 }
    ],
    showPercentage: true,
    showValue: true,
    showLegend: true,
    height: 600,
    stageHeight: 50,
    stageGap: 4
  }
}

/**
 * With custom tooltip
 */
export const CustomTooltip: Story = {
  args: {
    data: salesFunnelData,
    showPercentage: true,
    showValue: true,
    showLegend: true,
    tooltipFormatter: (data, index) => (
      <div className="space-y-1">
        <p className="font-bold text-lg">{data.label}</p>
        <p className="text-sm">数值: {data.value}</p>
        <p className="text-sm">阶段: {index + 1}</p>
        {data.description && <p className="text-sm italic">{data.description}</p>}
      </div>
    )
  }
}

/**
 * With onClick handler
 */
export const WithClickHandler: Story = {
  args: {
    data: salesFunnelData,
    showPercentage: true,
    showValue: true,
    showLegend: true,
    onStageClick: (data, index) => {
      alert(`点击了阶段 ${index + 1}: ${data.label}`)
    }
  }
}

/**
 * High contrast colors
 */
export const HighContrast: Story = {
  args: {
    data: conversionFunnelData,
    showPercentage: true,
    showValue: true,
    showLegend: true,
    variant: 'solid',
    showStroke: true,
    height: 400
  }
}

/**
 * Minimal view
 */
export const Minimal: Story = {
  args: {
    data: salesFunnelData,
    showPercentage: false,
    showValue: false,
    showLabel: true,
    showLegend: false,
    showTooltip: false,
    showStroke: false,
    variant: 'solid',
    height: 300
  }
}

/**
 * Detailed view
 */
export const Detailed: Story = {
  args: {
    data: salesFunnelData,
    showPercentage: true,
    showValue: true,
    showLabel: true,
    showLegend: true,
    showTooltip: true,
    variant: 'gradient',
    showStroke: true,
    legendPosition: 'bottom',
    stageHeight: 70,
    stageGap: 10,
    animationDuration: 1.2,
    height: 450
  }
}
