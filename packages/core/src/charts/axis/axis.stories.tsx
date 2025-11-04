/**
 * Axis Component Stories
 *
 * Storybook stories for Axis component
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Axis } from './axis'

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof Axis> = {
  title: 'Charts/Axis',
  component: Axis,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Axis 是图表组件库的核心组件，为图表提供 X 轴和 Y 轴支持。

## 功能特性
- X 轴和 Y 轴支持
- 可配置的位置和样式
- 刻度值和标签支持
- 网格线显示
- 自定义颜色和样式
- 主题系统集成

## 使用示例
\`\`\`tsx
<Axis
  type="x"
  label="时间"
  ticks={[
    { value: 0, label: '1月' },
    { value: 1, label: '2月' },
    { value: 2, label: '3月' }
  ]}
  showGrid={true}
/>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['x', 'y'],
      description: '坐标轴类型'
    },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: '坐标轴的位置'
    },
    label: {
      control: 'text',
      description: '坐标轴的标签'
    },
    ticks: {
      control: 'object',
      description: '坐标轴的刻度值'
    },
    showGrid: {
      control: 'boolean',
      description: '是否显示网格线'
    },
    showTickLabels: {
      control: 'boolean',
      description: '是否显示刻度标签'
    },
    tickLabelRotation: {
      control: 'number',
      description: '刻度标签的旋转角度'
    },
    gridColor: {
      control: 'text',
      description: '网格线的颜色'
    },
    axisColor: {
      control: 'text',
      description: '坐标轴的颜色'
    }
  }
}

export default meta
export { meta }
type Story = StoryObj<typeof meta>

// ============================================================================
// Stories
// ============================================================================

/**
 * X Axis with labels
 */
export const XAxisWithLabels: Story = {
  args: {
    type: 'x',
    label: '月份',
    ticks: [
      { value: 0, label: '1月' },
      { value: 1, label: '2月' },
      { value: 2, label: '3月' },
      { value: 3, label: '4月' },
      { value: 4, label: '5月' },
      { value: 5, label: '6月' }
    ],
    showGrid: true
  }
}

/**
 * Y Axis with labels
 */
export const YAxisWithLabels: Story = {
  args: {
    type: 'y',
    label: '销售额 (万元)',
    ticks: [
      { value: 0, label: '0' },
      { value: 20, label: '20' },
      { value: 40, label: '40' },
      { value: 60, label: '60' },
      { value: 80, label: '80' },
      { value: 100, label: '100' }
    ],
    showGrid: true
  }
}

/**
 * X Axis without grid
 */
export const XAxisWithoutGrid: Story = {
  args: {
    type: 'x',
    label: '产品类别',
    ticks: [
      { value: 0, label: '电子产品' },
      { value: 1, label: '服装' },
      { value: 2, label: '食品' },
      { value: 3, label: '图书' }
    ],
    showGrid: false
  }
}

/**
 * X Axis with rotation
 */
export const XAxisWithRotation: Story = {
  args: {
    type: 'x',
    label: '日期',
    ticks: [
      { value: 0, label: '2024-01-01' },
      { value: 1, label: '2024-01-02' },
      { value: 2, label: '2024-01-03' },
      { value: 3, label: '2024-01-04' }
    ],
    tickLabelRotation: 45,
    showGrid: true
  }
}

/**
 * Custom colors
 */
export const CustomColors: Story = {
  args: {
    type: 'x',
    label: '季度',
    ticks: [
      { value: 0, label: 'Q1' },
      { value: 1, label: 'Q2' },
      { value: 2, label: 'Q3' },
      { value: 3, label: 'Q4' }
    ],
    axisColor: '#2563eb',
    gridColor: '#94a3b8',
    showGrid: true
  }
}

/**
 * Without tick labels
 */
export const WithoutTickLabels: Story = {
  args: {
    type: 'x',
    label: '年份',
    ticks: [
      { value: 2020, label: '2020' },
      { value: 2021, label: '2021' },
      { value: 2022, label: '2022' },
      { value: 2023, label: '2023' },
      { value: 2024, label: '2024' }
    ],
    showTickLabels: false,
    showGrid: true
  }
}

/**
 * Both X and Y axes together
 */
export const BothAxes: Story = {
  render: () => (
    <svg width="500" height="300" viewBox="0 0 500 300">
      {/* Y Axis */}
      <Axis
        type="y"
        label="数值"
        ticks={[
          { value: 0, label: '0' },
          { value: 25, label: '25' },
          { value: 50, label: '50' },
          { value: 75, label: '75' },
          { value: 100, label: '100' }
        ]}
        showGrid={true}
      />
      {/* X Axis */}
      <Axis
        type="x"
        label="类别"
        ticks={[
          { value: 0, label: 'A' },
          { value: 1, label: 'B' },
          { value: 2, label: 'C' },
          { value: 3, label: 'D' },
          { value: 4, label: 'E' }
        ]}
        showGrid={true}
        position="bottom"
      />
    </svg>
  ),
  parameters: {
    layout: 'padded'
  }
}

/**
 * Numeric values
 */
export const NumericValues: Story = {
  args: {
    type: 'x',
    label: '数值范围',
    ticks: [
      { value: 0 },
      { value: 10 },
      { value: 20 },
      { value: 30 },
      { value: 40 },
      { value: 50 }
    ],
    showGrid: true
  }
}

/**
 * String values
 */
export const StringValues: Story = {
  args: {
    type: 'x',
    label: '类别',
    ticks: [
      { value: 'cat', label: '猫' },
      { value: 'dog', label: '狗' },
      { value: 'bird', label: '鸟' },
      { value: 'fish', label: '鱼' }
    ],
    showGrid: true
  }
}
