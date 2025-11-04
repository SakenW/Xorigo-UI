/**
 * @fileoverview StatisticCard 组件故事文件
 * @description 通过 Storybook 展示 StatisticCard 的各种用法和变体
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 * @since 2025-11-04
 */

import type { Meta, StoryObj } from '@storybook/react'
import { StatisticCard } from './statistic-card'
import { ThemeProvider } from '@xorigo-ui/system'

// =============================================================================
// 元数据配置
// =============================================================================

const meta = {
  title: 'Data Display/StatisticCard',
  component: StatisticCard,
  tags: ['autodocs'],
  decorators: [
    (Story: any) => (
      <ThemeProvider>
        <div style={{ padding: '20px', backgroundColor: 'var(--bg-app)' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'elevated',
        'filled',
        'gradient',
        'glass',
        'success',
        'warning',
        'error',
        'info',
      ],
      description: '卡片变体',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '卡片尺寸',
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right', 'top'],
      description: '图标位置',
    },
    chartType: {
      control: 'select',
      options: ['line', 'bar', 'area'],
      description: '图表类型',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'StatisticCard 是一个高级数据统计展示组件，支持趋势图表、格式化显示、多维度对比等功能。',
      },
    },
  },
} satisfies Meta<typeof StatisticCard>

export default meta
type Story = StoryObj<typeof meta>

// =============================================================================
// 基础故事
// =============================================================================

export const Default: Story = {
  args: {
    label: '总收入',
    value: '￥1,234,567',
  },
}

export const WithTrend: Story = {
  args: {
    label: '总收入',
    value: '￥1,234,567',
    trend: {
      value: 12,
      direction: 'up',
      label: '较上月',
    },
  },
}

export const WithDownTrend: Story = {
  args: {
    label: '总支出',
    value: '￥567,890',
    trend: {
      value: 8,
      direction: 'down',
      label: '较上月',
    },
  },
}

export const WithNeutralTrend: Story = {
  args: {
    label: '转化率',
    value: '85%',
    trend: {
      value: 0,
      direction: 'neutral',
      label: '无变化',
    },
  },
}

export const WithIcon: Story = {
  args: {
    label: '总收入',
    value: '￥1,234,567',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    ),
  },
}

export const WithIconRight: Story = {
  args: {
    label: '总收入',
    value: '￥1,234,567',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    ),
    iconPosition: 'right',
  },
}

export const WithIconTop: Story = {
  args: {
    label: '总收入',
    value: '￥1,234,567',
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    ),
    iconPosition: 'top',
  },
}

// =============================================================================
// 变体故事
// =============================================================================

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
      <StatisticCard
        variant="default"
        label="默认样式"
        value="￥1,234,567"
      />
      <StatisticCard
        variant="elevated"
        label="突出样式"
        value="￥1,234,567"
      />
      <StatisticCard
        variant="filled"
        label="填充样式"
        value="￥1,234,567"
      />
      <StatisticCard
        variant="gradient"
        label="渐变样式"
        value="￥1,234,567"
      />
      <StatisticCard
        variant="glass"
        label="玻璃拟态"
        value="￥1,234,567"
      />
      <StatisticCard
        variant="success"
        label="成功样式"
        value="￥1,234,567"
      />
      <StatisticCard
        variant="warning"
        label="警告样式"
        value="￥1,234,567"
      />
      <StatisticCard
        variant="error"
        label="错误样式"
        value="￥1,234,567"
      />
      <StatisticCard
        variant="info"
        label="信息样式"
        value="￥1,234,567"
      />
    </div>
  ),
}

// =============================================================================
// 尺寸故事
// =============================================================================

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <StatisticCard
        size="sm"
        label="小尺寸"
        value="￥1,234,567"
      />
      <StatisticCard
        size="md"
        label="中尺寸"
        value="￥1,234,567"
      />
      <StatisticCard
        size="lg"
        label="大尺寸"
        value="￥1,234,567"
      />
    </div>
  ),
}

// =============================================================================
// 数值格式化故事
// =============================================================================

export const NumberFormatting: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
      <StatisticCard
        label="带前缀"
        value={1234567}
        prefix="￥"
      />
      <StatisticCard
        label="带后缀"
        value={85}
        suffix="%"
      />
      <StatisticCard
        label="货币格式"
        value={1234567.89}
        currency="￥"
        precision={2}
      />
      <StatisticCard
        label="禁用千分位"
        value={1234567}
        noThousandSeparator
      />
      <StatisticCard
        label="小数位数"
        value={85.5555}
        precision={1}
      />
      <StatisticCard
        label="自定义格式化"
        value={1234567}
        formatValue={(value) => `¥${value.toLocaleString()}`}
      />
    </div>
  ),
}

// =============================================================================
// 对比数据故事
// =============================================================================

export const WithComparison: Story = {
  args: {
    label: '总收入',
    value: 1234567,
    comparison: {
      label: '上月',
      value: 1000000,
      type: 'increase',
    },
  },
}

export const ComparisonDecrease: Story = {
  args: {
    label: '总支出',
    value: 900000,
    comparison: {
      label: '上月',
      value: 1000000,
      type: 'decrease',
    },
  },
}

// =============================================================================
// 图表故事
// =============================================================================

export const WithLineChart: Story = {
  args: {
    label: '月度收入',
    value: '￥1,234,567',
    chartData: [
      { value: 10, label: '1月' },
      { value: 15, label: '2月' },
      { value: 12, label: '3月' },
      { value: 18, label: '4月' },
      { value: 22, label: '5月' },
      { value: 19, label: '6月' },
    ],
    chartType: 'line',
  },
}

export const WithBarChart: Story = {
  args: {
    label: '月度收入',
    value: '￥1,234,567',
    chartData: [
      { value: 10, label: '1月' },
      { value: 15, label: '2月' },
      { value: 12, label: '3月' },
      { value: 18, label: '4月' },
      { value: 22, label: '5月' },
      { value: 19, label: '6月' },
    ],
    chartType: 'bar',
  },
}

export const WithAreaChart: Story = {
  args: {
    label: '月度收入',
    value: '￥1,234,567',
    chartData: [
      { value: 10, label: '1月' },
      { value: 15, label: '2月' },
      { value: 12, label: '3月' },
      { value: 18, label: '4月' },
      { value: 22, label: '5月' },
      { value: 19, label: '6月' },
    ],
    chartType: 'area',
  },
}

export const CompleteExample: Story = {
  args: {
    label: '月度总收入',
    value: 1234567,
    trend: {
      value: 12,
      direction: 'up',
      label: '较上月',
    },
    comparison: {
      label: '去年同期',
      value: 980000,
      type: 'increase',
    },
    chartData: [
      { value: 10, label: '1月' },
      { value: 15, label: '2月' },
      { value: 12, label: '3月' },
      { value: 18, label: '4月' },
      { value: 22, label: '5月' },
      { value: 19, label: '6月' },
    ],
    chartType: 'line',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    ),
    prefix: '￥',
    precision: 0,
  },
}

// =============================================================================
// 状态故事
// =============================================================================

export const LoadingState: Story = {
  args: {
    label: '总收入',
    value: '￥1,234,567',
    loading: true,
  },
}

export const ErrorState: Story = {
  args: {
    label: '总收入',
    value: '￥1,234,567',
    error: true,
    errorMessage: '数据获取失败',
  },
}

// =============================================================================
// 实际用例故事
// =============================================================================

export const RevenueCard: Story = {
  render: () => (
    <StatisticCard
      variant="success"
      label="本月收入"
      value={2456789}
      prefix="￥"
      precision={0}
      trend={{
        value: 15.8,
        direction: 'up',
        label: '较上月',
      }}
      comparison={{
        label: '上月',
        value: 2123456,
        type: 'increase',
      }}
      chartData={[
        { value: 1800000, label: '7月' },
        { value: 1900000, label: '8月' },
        { value: 2000000, label: '9月' },
        { value: 2100000, label: '10月' },
        { value: 2123456, label: '11月' },
        { value: 2456789, label: '12月' },
      ]}
      chartType="line"
      icon={
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      }
    />
  ),
}

export const UserGrowthCard: Story = {
  render: () => (
    <StatisticCard
      variant="info"
      label="新增用户"
      value={1234}
      suffix="人"
      trend={{
        value: 23.5,
        direction: 'up',
        label: '较上周',
      }}
      chartData={[
        { value: 800, label: '周一' },
        { value: 950, label: '周二' },
        { value: 1100, label: '周三' },
        { value: 1050, label: '周四' },
        { value: 1200, label: '周五' },
        { value: 1234, label: '周六' },
      ]}
      chartType="bar"
      icon={
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      }
    />
  ),
}

export const ConversionRateCard: Story = {
  render: () => (
    <StatisticCard
      variant="warning"
      label="转化率"
      value={85.5}
      suffix="%"
      precision={1}
      trend={{
        value: 3.2,
        direction: 'up',
        label: '较昨日',
      }}
      comparison={{
        label: '目标',
        value: '90%',
        type: 'increase',
      }}
      chartData={[
        { value: 80 },
        { value: 82 },
        { value: 81 },
        { value: 83 },
        { value: 85 },
        { value: 85.5 },
      ]}
      chartType="area"
      icon={
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      }
    />
  ),
}

export const DashboardGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
      <StatisticCard
        variant="success"
        label="总收入"
        value={2456789}
        prefix="￥"
        precision={0}
        trend={{
          value: 15.8,
          direction: 'up',
          label: '较上月',
        }}
        icon={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        }
      />
      <StatisticCard
        variant="info"
        label="活跃用户"
        value={12345}
        suffix="人"
        trend={{
          value: 8.3,
          direction: 'up',
          label: '较上周',
        }}
        icon={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        }
      />
      <StatisticCard
        variant="warning"
        label="转化率"
        value={85.5}
        suffix="%"
        precision={1}
        trend={{
          value: 3.2,
          direction: 'up',
          label: '较昨日',
        }}
        icon={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        }
      />
      <StatisticCard
        variant="error"
        label="跳出率"
        value={23.5}
        suffix="%"
        precision={1}
        trend={{
          value: 2.1,
          direction: 'down',
          label: '较昨日',
        }}
        icon={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        }
      />
    </div>
  ),
}
