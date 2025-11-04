/**
 * @file MiniChart 组件故事文件
 * @description Storybook 故事和示例
 * @version 1.0.0
 * @stable true
 */

import type { Meta, StoryObj } from '@storybook/react'
import { MiniChart } from './mini-chart'

// =============================================================================
// 元数据配置
// =============================================================================

const meta = {
  title: 'Charts/MiniChart',
  component: MiniChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
MiniChart 是一个多类型的迷你数据可视化组件，支持线图、面积图、柱状图、饼图和环形图。

## 特性

- ✅ 支持多种图表类型（线图、面积图、柱状图、饼图、环形图）
- ✅ 紧凑布局和最小尺寸设计
- ✅ 趋势指示（上升/下降/持平）
- ✅ 百分比变化显示
- ✅ 颜色编码（绿色/红色/灰色）
- ✅ 工具提示和交互
- ✅ 主题系统集成
- ✅ TypeScript 类型安全
- ✅ Framer Motion 动画
- ✅ 可访问性支持

## 使用场景

- 数据密集型表格中的迷你图表
- 卡片中的趋势展示
- KPI 指标的迷你可视化
- 列表项的数据摘要
- 仪表盘的紧凑图表
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['line', 'area', 'bar', 'pie', 'donut'],
      description: '图表类型',
    },
    colorVariant: {
      control: 'select',
      options: ['primary', 'success', 'danger', 'warning', 'neutral'],
      description: '颜色变体',
    },
    trendMode: {
      control: 'select',
      options: ['auto', 'up', 'down', 'neutral'],
      description: '趋势模式',
    },
    compact: {
      control: 'boolean',
      description: '紧凑模式',
    },
    showTrend: {
      control: 'boolean',
      description: '是否显示趋势指示',
    },
    showChange: {
      control: 'boolean',
      description: '是否显示百分比变化',
    },
    animated: {
      control: 'boolean',
      description: '是否启用动画',
    },
  },
  args: {
    data: [
      { value: 10, label: 'A' },
      { value: 20, label: 'B' },
      { value: 15, label: 'C' },
      { value: 25, label: 'D' },
      { value: 30, label: 'E' },
    ],
    width: 120,
    height: 60,
    type: 'line',
    compact: false,
    showTrend: false,
    showChange: false,
    trendMode: 'auto',
    colorVariant: 'primary',
    animated: true,
  },
} satisfies Meta<typeof MiniChart>

export default meta
export { meta }
type Story = StoryObj<typeof meta>

// =============================================================================
// 基础示例
// =============================================================================

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '基础的迷你图表组件，展示简单的趋势数据。',
      },
    },
  },
}

// =============================================================================
// 图表类型
// =============================================================================

export const Line: Story = {
  args: {
    type: 'line',
  },
  parameters: {
    docs: {
      description: {
        story: '线图：使用直线连接数据点，适合展示趋势变化。',
      },
    },
  },
}

export const Area: Story = {
  args: {
    type: 'area',
  },
  parameters: {
    docs: {
      description: {
        story: '面积图：填充曲线下方的区域，适合展示累积变化。',
      },
    },
  },
}

export const Bar: Story = {
  args: {
    type: 'bar',
  },
  parameters: {
    docs: {
      description: {
        story: '柱状图：使用柱状条展示数据，适合比较不同类别的值。',
      },
    },
  },
}

export const Pie: Story = {
  args: {
    type: 'pie',
    data: [
      { value: 30, label: 'A', color: '#3b82f6' },
      { value: 20, label: 'B', color: '#10b981' },
      { value: 25, label: 'C', color: '#f59e0b' },
      { value: 25, label: 'D', color: '#ef4444' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '饼图：使用扇形展示各部分占总量的比例，适合展示占比关系。',
      },
    },
  },
}

export const Donut: Story = {
  args: {
    type: 'donut',
    data: [
      { value: 30, label: 'A', color: '#3b82f6' },
      { value: 20, label: 'B', color: '#10b981' },
      { value: 25, label: 'C', color: '#f59e0b' },
      { value: 25, label: 'D', color: '#ef4444' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '环形图：中心空心的饼图，更现代的展示方式。',
      },
    },
  },
}

// =============================================================================
// 颜色变体
// =============================================================================

export const Primary: Story = {
  args: {
    colorVariant: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: '主要颜色变体：蓝色系。',
      },
    },
  },
}

export const Success: Story = {
  args: {
    colorVariant: 'success',
  },
  parameters: {
    docs: {
      description: {
        story: '成功颜色变体：绿色系，常用于正增长数据。',
      },
    },
  },
}

export const Danger: Story = {
  args: {
    colorVariant: 'danger',
  },
  parameters: {
    docs: {
      description: {
        story: '危险颜色变体：红色系，常用于负增长或警示数据。',
      },
    },
  },
}

export const Warning: Story = {
  args: {
    colorVariant: 'warning',
  },
  parameters: {
    docs: {
      description: {
        story: '警告颜色变体：黄色系，常用于需要注意的数据。',
      },
    },
  },
}

export const Neutral: Story = {
  args: {
    colorVariant: 'neutral',
  },
  parameters: {
    docs: {
      description: {
        story: '中性颜色变体：灰色系，适用于中性数据。',
      },
    },
  },
}

// =============================================================================
// 趋势指示
// =============================================================================

export const WithTrend: Story = {
  args: {
    showTrend: true,
  },
  parameters: {
    docs: {
      description: {
        story: '显示趋势指示：在图表右上角显示趋势方向和百分比变化。',
      },
    },
  },
}

export const WithChange: Story = {
  args: {
    showChange: true,
  },
  parameters: {
    docs: {
      description: {
        story: '显示百分比变化：在图表右下角显示起始值和结束值的百分比变化。',
      },
    },
  },
}

export const BothIndicators: Story = {
  args: {
    showTrend: true,
    showChange: true,
  },
  parameters: {
    docs: {
      description: {
        story: '同时显示趋势和百分比变化。',
      },
    },
  },
}

// =============================================================================
// 趋势模式
// =============================================================================

export const AutoTrend: Story = {
  args: {
    trendMode: 'auto',
    showTrend: true,
  },
  parameters: {
    docs: {
      description: {
        story: '自动模式：自动检测趋势方向。',
      },
    },
  },
}

export const UpTrend: Story = {
  args: {
    trendMode: 'up',
    showTrend: true,
  },
  parameters: {
    docs: {
      description: {
        story: '强制上升：即使数据下降也显示上升趋势。',
      },
    },
  },
}

export const DownTrend: Story = {
  args: {
    trendMode: 'down',
    showTrend: true,
  },
  parameters: {
    docs: {
      description: {
        story: '强制下降：即使数据上升也显示下降趋势。',
      },
    },
  },
}

// =============================================================================
// 紧凑模式
// =============================================================================

export const Compact: Story = {
  args: {
    compact: true,
    width: 80,
    height: 40,
  },
  parameters: {
    docs: {
      description: {
        story: '紧凑模式：减少内边距，适用于空间受限的场景。',
      },
    },
  },
}

export const SmallSize: Story = {
  args: {
    width: 60,
    height: 30,
  },
  parameters: {
    docs: {
      description: {
        story: '小尺寸版本：适用于表格中的紧凑展示。',
      },
    },
  },
}

export const MiniSize: Story = {
  args: {
    width: 40,
    height: 24,
  },
  parameters: {
    docs: {
      description: {
        story: '极小尺寸：适用于列表项中的极简展示。',
      },
    },
  },
}

// =============================================================================
// 完整功能
// =============================================================================

export const FullFeature: Story = {
  args: {
    type: 'line',
    showTrend: true,
    showChange: true,
    colorVariant: 'success',
    animated: true,
  },
  parameters: {
    docs: {
      description: {
        story: '完整功能展示：启用所有特性，包括趋势指示和百分比变化。',
      },
    },
  },
}

// =============================================================================
// 实际应用场景
// =============================================================================

// 销售趋势
export const SalesTrend: Story = {
  args: {
    type: 'area',
    data: [
      { value: 120, label: '1月' },
      { value: 150, label: '2月' },
      { value: 135, label: '3月' },
      { value: 180, label: '4月' },
      { value: 220, label: '5月' },
      { value: 195, label: '6月' },
      { value: 250, label: '7月' },
    ],
    colorVariant: 'success',
    showTrend: true,
    width: 150,
    height: 70,
  },
  parameters: {
    docs: {
      description: {
        story: '销售趋势：使用面积图展示销售额的增长趋势。',
      },
    },
  },
}

// 性能指标对比
export const PerformanceComparison: Story = {
  args: {
    type: 'bar',
    data: [
      { value: 45, label: 'CPU' },
      { value: 32, label: '内存' },
      { value: 28, label: '磁盘' },
      { value: 18, label: '网络' },
    ],
    colorVariant: 'warning',
    compact: true,
    width: 100,
    height: 50,
  },
  parameters: {
    docs: {
      description: {
        story: '性能指标对比：使用柱状图展示系统各指标的占用情况。',
      },
    },
  },
}

// 市场份额
export const MarketShare: Story = {
  args: {
    type: 'donut',
    data: [
      { value: 35, label: '产品A', color: '#3b82f6' },
      { value: 25, label: '产品B', color: '#10b981' },
      { value: 20, label: '产品C', color: '#f59e0b' },
      { value: 20, label: '其他', color: '#6b7280' },
    ],
    showTrend: false,
    width: 80,
    height: 80,
    innerRadiusRatio: 0.6,
  },
  parameters: {
    docs: {
      description: {
        story: '市场份额：使用环形图展示各产品的市场份额占比。',
      },
    },
  },
}

// 用户增长
export const UserGrowth: Story = {
  args: {
    type: 'line',
    data: [
      { value: 1000, label: '1月' },
      { value: 1200, label: '2月' },
      { value: 1180, label: '3月' },
      { value: 1350, label: '4月' },
      { value: 1420, label: '5月' },
      { value: 1580, label: '6月' },
      { value: 1650, label: '7月' },
    ],
    colorVariant: 'primary',
    showTrend: true,
    showChange: true,
    width: 140,
    height: 60,
  },
  parameters: {
    docs: {
      description: {
        story: '用户增长：使用线图展示用户数的稳定增长趋势。',
      },
    },
  },
}

// 股票价格波动
export const StockPrice: Story = {
  args: {
    type: 'area',
    data: [
      { value: 100, label: '周一' },
      { value: 98, label: '周二' },
      { value: 102, label: '周三' },
      { value: 95, label: '周四' },
      { value: 97, label: '周五' },
      { value: 105, label: '周六' },
      { value: 110, label: '周日' },
    ],
    colorVariant: 'danger',
    showTrend: true,
    width: 130,
    height: 60,
  },
  parameters: {
    docs: {
      description: {
        story: '股票价格：展示股票价格的波动，红色表示整体上升但有波动。',
      },
    },
  },
}

// =============================================================================
// 交互示例
// =============================================================================

export const WithInteractions: Story = {
  args: {
    type: 'line',
    showTrend: true,
    renderTooltip: (point) => (
      <div className="text-center">
        <div className="font-bold">{point.value}</div>
        <div className="text-xs opacity-75">{point.label}</div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '交互示例：鼠标悬停显示自定义工具提示，试试悬停在图表上！',
      },
    },
  },
}
