/**
 * @fileoverview GaugeChart 组件故事文件
 * @component Charts/GaugeChart
 * @stable true
 */

import type { Meta, StoryObj } from '@storybook/react'
import { GaugeChart } from './gauge-chart'

// =============================================================================
// 元数据配置
// =============================================================================

const meta = {
  title: 'Charts/GaugeChart',
  component: GaugeChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '仪表图组件用于显示单个数值在指定范围内的进度和状态。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100, step: 1 },
      description: '当前数值',
    },
    min: {
      control: { type: 'number' },
      description: '最小值',
    },
    max: {
      control: { type: 'number' },
      description: '最大值',
    },
    thresholds: {
      control: 'object',
      description: '阈值配置（warning: 警告值, danger: 危险值）',
    },
    label: {
      control: 'text',
      description: '仪表盘标签',
    },
    unit: {
      control: 'text',
      description: '显示单位',
    },
    decimals: {
      control: { type: 'number', min: 0, max: 5 },
      description: '小数位数',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: '组件尺寸',
    },
    shape: {
      control: 'select',
      options: ['semi', 'full'],
      description: '仪表盘形状',
    },
    showPointer: {
      control: 'boolean',
      description: '是否显示指针',
    },
    showThresholds: {
      control: 'boolean',
      description: '是否显示阈值线',
    },
    animated: {
      control: 'boolean',
      description: '是否显示动画',
    },
    color: {
      control: 'color',
      description: '自定义颜色',
    },
  },
} satisfies Meta<typeof GaugeChart>

export default meta
export { meta }
type Story = StoryObj<typeof meta>

// =============================================================================
// 基础故事
// =============================================================================

export const Default: Story = {
  args: {
    value: 75,
    min: 0,
    max: 100,
    label: '使用率',
    unit: '%',
  },
}

export const SemiCircle: Story = {
  args: {
    value: 68,
    min: 0,
    max: 100,
    label: 'CPU',
    unit: '%',
    shape: 'semi',
  },
}

export const FullCircle: Story = {
  args: {
    value: 75,
    min: 0,
    max: 100,
    label: '完成度',
    unit: '%',
    shape: 'full',
  },
}

// =============================================================================
// 不同尺寸
// =============================================================================

export const Small: Story = {
  args: {
    value: 75,
    size: 'sm',
    label: '小型',
    unit: '%',
  },
}

export const Large: Story = {
  args: {
    value: 75,
    size: 'lg',
    label: '大型',
    unit: '%',
  },
}

export const ExtraLarge: Story = {
  args: {
    value: 75,
    size: 'xl',
    label: '超大',
    unit: '%',
  },
}

// =============================================================================
// 阈值示例
// =============================================================================

export const WithThresholds: Story = {
  args: {
    value: 75,
    min: 0,
    max: 100,
    label: '系统负载',
    unit: '%',
    thresholds: {
      warning: 60,
      danger: 80,
    },
  },
}

export const WarningState: Story = {
  args: {
    value: 65,
    min: 0,
    max: 100,
    label: '警告状态',
    unit: '%',
    thresholds: {
      warning: 60,
      danger: 80,
    },
  },
}

export const DangerState: Story = {
  args: {
    value: 85,
    min: 0,
    max: 100,
    label: '危险状态',
    unit: '%',
    thresholds: {
      warning: 60,
      danger: 80,
    },
  },
}

// =============================================================================
// 数值范围示例
// =============================================================================

export const NegativeRange: Story = {
  args: {
    value: -5,
    min: -10,
    max: 10,
    label: '温度',
    unit: '°C',
  },
}

export const CustomRange: Story = {
  args: {
    value: 75,
    min: 50,
    max: 150,
    label: '速度',
    unit: 'km/h',
  },
}

export const HighPrecision: Story = {
  args: {
    value: 75.567,
    min: 0,
    max: 100,
    label: '精度',
    unit: '%',
    decimals: 2,
  },
}

// =============================================================================
// 功能演示
// =============================================================================

export const WithoutPointer: Story = {
  args: {
    value: 75,
    label: '无指针',
    unit: '%',
    showPointer: false,
  },
}

export const WithoutThresholds: Story = {
  args: {
    value: 75,
    label: '无阈值线',
    unit: '%',
    thresholds: {
      warning: 60,
      danger: 80,
    },
    showThresholds: false,
  },
}

export const WithoutAnimation: Story = {
  args: {
    value: 75,
    label: '无动画',
    unit: '%',
    animated: false,
  },
}

// =============================================================================
// 自定义样式示例
// =============================================================================

export const CustomColor: Story = {
  args: {
    value: 75,
    label: '自定义颜色',
    unit: '%',
    color: '#10B981',
  },
}

export const Gradient: Story = {
  args: {
    value: 75,
    label: '渐变',
    unit: '%',
    variant: 'gradient',
  },
}

// =============================================================================
// 单位示例
// =============================================================================

export const Percentage: Story = {
  args: {
    value: 85,
    label: '完成百分比',
    unit: '%',
  },
}

export const Temperature: Story = {
  args: {
    value: 23.5,
    label: '温度',
    unit: '°C',
    decimals: 1,
  },
}

export const Speed: Story = {
  args: {
    value: 120,
    label: '速度',
    unit: 'km/h',
  },
}

export const Battery: Story = {
  args: {
    value: 45,
    label: '电池电量',
    unit: '%',
  },
}

export const Memory: Story = {
  args: {
    value: 68,
    label: '内存使用',
    unit: '%',
    thresholds: {
      warning: 70,
      danger: 90,
    },
  },
}

export const Storage: Story = {
  args: {
    value: 42,
    label: '存储使用',
    unit: '%',
    thresholds: {
      warning: 60,
      danger: 80,
    },
  },
}

// =============================================================================
// 组合示例
// =============================================================================

export const SystemMonitoring: Story = {
  args: {
    value: 72,
    label: '系统负载',
    unit: '%',
    thresholds: {
      warning: 65,
      danger: 85,
    },
    size: 'md',
    shape: 'semi',
    animated: true,
  },
}

export const PerformanceMetric: Story = {
  args: {
    value: 88,
    label: '性能评分',
    unit: '分',
    thresholds: {
      warning: 60,
      danger: 40,
    },
    size: 'lg',
    shape: 'full',
    decimals: 1,
    animated: true,
  },
}

// =============================================================================
// 响应式示例
// =============================================================================

export const Responsive: Story = {
  render: (args) => (
    <div className="flex gap-8 items-end">
      <div className="text-center">
        <GaugeChart {...args} size="sm" />
        <p className="mt-2 text-sm text-surface-500">Small</p>
      </div>
      <div className="text-center">
        <GaugeChart {...args} size="md" />
        <p className="mt-2 text-sm text-surface-500">Medium</p>
      </div>
      <div className="text-center">
        <GaugeChart {...args} size="lg" />
        <p className="mt-2 text-sm text-surface-500">Large</p>
      </div>
      <div className="text-center">
        <GaugeChart {...args} size="xl" />
        <p className="mt-2 text-sm text-surface-500">Extra Large</p>
      </div>
    </div>
  ),
  args: {
    value: 75,
    label: '响应式',
    unit: '%',
  },
}

// =============================================================================
// 交互式故事
// =============================================================================

export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = React.useState(50)

    return (
      <div className="flex flex-col items-center gap-4">
        <GaugeChart
          {...args}
          value={value}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-64"
        />
        <p className="text-sm text-surface-600">
          拖动滑块改变值: {value}
        </p>
      </div>
    )
  },
  args: {
    label: '可交互',
    unit: '%',
  },
}
