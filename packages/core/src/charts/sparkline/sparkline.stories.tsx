/**
 * @file Sparkline 组件故事文件
 * @description Storybook 故事和示例
 * @version 1.0.0
 * @stable true
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Sparkline } from './sparkline'

// =============================================================================
// 元数据配置
// =============================================================================

const meta = {
  title: 'Charts/Sparkline',
  component: Sparkline,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Sparkline 是一个轻量级的迷你线图组件，用于展示小型趋势数据和变化。

## 特性

- ✅ 多种线型支持（直线、曲线、面积）
- ✅ 数据点和极值点标记
- ✅ 阈值线和区域标记
- ✅ 动画和交互效果
- ✅ 工具提示和悬停效果
- ✅ 百分比变化显示
- ✅ 主题系统集成
- ✅ TypeScript 类型安全
- ✅ Framer Motion 动画
- ✅ 可访问性支持

## 使用场景

- 表格中的数据摘要
- 仪表盘的趋势指示
- 列表项的迷你图表
- KPI 指标的趋势展示
- 实时数据监控
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['linear', 'curve', 'area'],
      description: '线型样式',
    },
    colorVariant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning'],
      description: '颜色变体',
    },
    showPoints: {
      control: 'boolean',
      description: '是否显示数据点',
    },
    showExtremes: {
      control: 'boolean',
      description: '是否显示极值点标记',
    },
    showThreshold: {
      control: 'boolean',
      description: '是否显示阈值线',
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
      { value: 10, label: '1月' },
      { value: 20, label: '2月' },
      { value: 15, label: '3月' },
      { value: 25, label: '4月' },
      { value: 30, label: '5月' },
    ],
    width: 120,
    height: 40,
    variant: 'linear',
    showPoints: true,
    showExtremes: false,
    showThreshold: false,
    showChange: false,
    colorVariant: 'primary',
    animated: true,
  },
} satisfies Meta<typeof Sparkline>

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
        story: '基础的迷你线图组件，展示简单的趋势数据。',
      },
    },
  },
}

// =============================================================================
// 线型变体
// =============================================================================

export const Linear: Story = {
  args: {
    variant: 'linear',
  },
  parameters: {
    docs: {
      description: {
        story: '线性模式：使用直线连接所有数据点。',
      },
    },
  },
}

export const Curve: Story = {
  args: {
    variant: 'curve',
  },
  parameters: {
    docs: {
      description: {
        story: '曲线模式：使用平滑的贝塞尔曲线连接数据点，更适合展示趋势。',
      },
    },
  },
}

export const Area: Story = {
  args: {
    variant: 'area',
  },
  parameters: {
    docs: {
      description: {
        story: '面积模式：填充曲线下方的区域，适合展示累积变化。',
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

// =============================================================================
// 展示选项
// =============================================================================

export const WithPoints: Story = {
  args: {
    showPoints: true,
  },
  parameters: {
    docs: {
      description: {
        story: '显示数据点：每个数据点都有可见的圆点标记。',
      },
    },
  },
}

export const WithExtremes: Story = {
  args: {
    showExtremes: true,
  },
  parameters: {
    docs: {
      description: {
        story: '显示极值点：自动标记最高点和最低点。',
      },
    },
  },
}

export const WithThreshold: Story = {
  args: {
    showThreshold: true,
    thresholdValue: 18,
  },
  parameters: {
    docs: {
      description: {
        story: '显示阈值线：在指定数值处显示虚线，用于对比分析。',
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
        story: '显示百分比变化：在图表右上角显示起始值和结束值的百分比变化。',
      },
    },
  },
}

// =============================================================================
// 完整功能
// =============================================================================

export const FullFeature: Story = {
  args: {
    variant: 'curve',
    showPoints: true,
    showExtremes: true,
    showThreshold: true,
    thresholdValue: 20,
    showChange: true,
    colorVariant: 'success',
    animated: true,
  },
  parameters: {
    docs: {
      description: {
        story: '完整功能展示：启用所有特性，包括曲线、点、极值、阈值和变化百分比。',
      },
    },
  },
}

// =============================================================================
// 实际应用场景
// =============================================================================

// 销售趋势数据
export const SalesTrend: Story = {
  args: {
    data: [
      { value: 120, label: '1月' },
      { value: 150, label: '2月' },
      { value: 135, label: '3月' },
      { value: 180, label: '4月' },
      { value: 220, label: '5月' },
      { value: 195, label: '6月' },
      { value: 250, label: '7月' },
    ],
    variant: 'area',
    colorVariant: 'success',
    showPoints: true,
    showChange: true,
    showExtremes: true,
  },
  parameters: {
    docs: {
      description: {
        story: '销售趋势：使用面积模式展示销售额的增长趋势。',
      },
    },
  },
}

// 用户增长数据
export const UserGrowth: Story = {
  args: {
    data: [
      { value: 1000, label: '1月' },
      { value: 1200, label: '2月' },
      { value: 1180, label: '3月' },
      { value: 1350, label: '4月' },
      { value: 1420, label: '5月' },
      { value: 1580, label: '6月' },
      { value: 1650, label: '7月' },
      { value: 1800, label: '8月' },
    ],
    variant: 'curve',
    colorVariant: 'primary',
    showPoints: true,
    showChange: true,
  },
  parameters: {
    docs: {
      description: {
        story: '用户增长：使用曲线模式展示用户数的稳定增长。',
      },
    },
  },
}

// 性能指标
export const PerformanceMetric: Story = {
  args: {
    data: [
      { value: 45, label: '00:00' },
      { value: 52, label: '04:00' },
      { value: 48, label: '08:00' },
      { value: 65, label: '12:00' },
      { value: 72, label: '16:00' },
      { value: 68, label: '20:00' },
    ],
    variant: 'linear',
    colorVariant: 'warning',
    showPoints: true,
    showThreshold: true,
    thresholdValue: 60,
    showExtremes: true,
    regions: [
      { start: 60, end: 80, color: 'yellow', opacity: 0.1 },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '性能指标：展示系统性能指标，包含阈值线和区域标记。',
      },
    },
  },
}

// 股票价格
export const StockPrice: Story = {
  args: {
    data: [
      { value: 100, label: '周一' },
      { value: 98, label: '周二' },
      { value: 102, label: '周三' },
      { value: 95, label: '周四' },
      { value: 97, label: '周五' },
      { value: 105, label: '周六' },
      { value: 110, label: '周日' },
    ],
    variant: 'curve',
    colorVariant: 'danger',
    showPoints: true,
    showChange: true,
  },
  parameters: {
    docs: {
      description: {
        story: '股票价格：展示股票价格的波动，红色表示波动较大。',
      },
    },
  },
}

// =============================================================================
// 交互示例
// =============================================================================

export const WithInteractions: Story = {
  args: {
    data: [
      { value: 10, label: 'A' },
      { value: 25, label: 'B' },
      { value: 15, label: 'C' },
      { value: 30, label: 'D' },
      { value: 22, label: 'E' },
      { value: 35, label: 'F' },
    ],
    variant: 'curve',
    showPoints: true,
    showExtremes: true,
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

// =============================================================================
// 小尺寸示例
// =============================================================================

export const Small: Story = {
  args: {
    width: 80,
    height: 24,
    showPoints: false,
  },
  parameters: {
    docs: {
      description: {
        story: '小尺寸版本：适用于表格中的紧凑展示。',
      },
    },
  },
}

export const Mini: Story = {
  args: {
    width: 60,
    height: 20,
    showPoints: false,
    variant: 'linear',
  },
  parameters: {
    docs: {
      description: {
        story: '迷你版本：极小尺寸，适用于列表项中的极简展示。',
      },
    },
  },
}
