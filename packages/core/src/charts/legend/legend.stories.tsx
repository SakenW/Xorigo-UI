/**
 * Legend Component Stories
 *
 * Storybook stories for Legend component
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Legend, type LegendItem } from './legend'

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof Legend> = {
  title: 'Charts/Legend',
  component: Legend,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Legend 是图表组件库的重要组件，为图表提供图例显示。

## 功能特性
- 多种布局方式（水平/垂直）
- 可配置的对齐方式和间距
- 自定义颜色和符号
- 交互式选择和点击
- 主题系统集成

## 使用示例
\`\`\`tsx
<Legend
  items={[
    { id: '1', label: 'Series 1', color: '#3b82f6' },
    { id: '2', label: 'Series 2', color: '#ef4444' },
    { id: '3', label: 'Series 3', color: '#10b981' }
  ]}
  orientation="horizontal"
  align="start"
/>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
      description: '图例项列表'
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: '图例的方向'
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: '图例的对齐方式'
    },
    gap: {
      control: 'number',
      description: '图例项之间的间距'
    },
    itemSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '图例项的大小'
    },
    title: {
      control: 'text',
      description: '图例的标题'
    },
    showCheck: {
      control: 'boolean',
      description: '是否显示选中状态'
    },
    interactive: {
      control: 'boolean',
      description: '是否可交互'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Stories
// ============================================================================

/**
 * Basic horizontal legend
 */
export const BasicHorizontal: Story = {
  args: {
    items: [
      { id: '1', label: 'Series 1', color: '#3b82f6' },
      { id: '2', label: 'Series 2', color: '#ef4444' },
      { id: '3', label: 'Series 3', color: '#10b981' }
    ],
    orientation: 'horizontal'
  }
}

/**
 * Vertical legend
 */
export const VerticalLegend: Story = {
  args: {
    items: [
      { id: '1', label: 'Desktop', color: '#3b82f6' },
      { id: '2', label: 'Mobile', color: '#ef4444' },
      { id: '3', label: 'Tablet', color: '#10b981' }
    ],
    orientation: 'vertical'
  }
}

/**
 * With title
 */
export const WithTitle: Story = {
  args: {
    title: '设备类型',
    items: [
      { id: '1', label: 'Desktop', color: '#3b82f6' },
      { id: '2', label: 'Mobile', color: '#ef4444' },
      { id: '3', label: 'Tablet', color: '#10b981' }
    ],
    orientation: 'horizontal'
  }
}

/**
 * Different symbol types
 */
export const DifferentSymbols: Story = {
  args: {
    items: [
      { id: '1', label: 'Circle', color: '#3b82f6', symbol: 'circle' },
      { id: '2', label: 'Square', color: '#ef4444', symbol: 'square' },
      { id: '3', label: 'Triangle', color: '#10b981', symbol: 'triangle' },
      { id: '4', label: 'Diamond', color: '#f59e0b', symbol: 'diamond' },
      { id: '5', label: 'Line', color: '#8b5cf6', symbol: 'line' }
    ],
    orientation: 'horizontal'
  }
}

/**
 * Centered alignment
 */
export const CenteredAlignment: Story = {
  args: {
    items: [
      { id: '1', label: 'Product A', color: '#3b82f6' },
      { id: '2', label: 'Product B', color: '#ef4444' },
      { id: '3', label: 'Product C', color: '#10b981' }
    ],
    orientation: 'horizontal',
    align: 'center'
  }
}

/**
 * End alignment
 */
export const EndAlignment: Story = {
  args: {
    items: [
      { id: '1', label: 'Q1', color: '#3b82f6' },
      { id: '2', label: 'Q2', color: '#ef4444' },
      { id: '3', label: 'Q3', color: '#10b981' }
    ],
    orientation: 'horizontal',
    align: 'end'
  }
}

/**
 * With checkboxes
 */
export const WithCheckboxes: Story = {
  args: {
    title: '选择系列',
    items: [
      { id: '1', label: 'Series 1', color: '#3b82f6', checked: true },
      { id: '2', label: 'Series 2', color: '#ef4444', checked: true },
      { id: '3', label: 'Series 3', color: '#10b981', checked: false }
    ],
    orientation: 'horizontal',
    showCheck: true
  }
}

/**
 * Different sizes
 */
export const DifferentSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div>
        <h4 className="text-sm font-medium mb-2">Small</h4>
        <Legend
          items={[
            { id: '1', label: 'Small Item', color: '#3b82f6' },
            { id: '2', label: 'Small Item 2', color: '#ef4444' }
          ]}
          itemSize="sm"
          orientation="horizontal"
        />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Medium</h4>
        <Legend
          items={[
            { id: '1', label: 'Medium Item', color: '#3b82f6' },
            { id: '2', label: 'Medium Item 2', color: '#ef4444' }
          ]}
          itemSize="md"
          orientation="horizontal"
        />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Large</h4>
        <Legend
          items={[
            { id: '1', label: 'Large Item', color: '#3b82f6' },
            { id: '2', label: 'Large Item 2', color: '#ef4444' }
          ]}
          itemSize="lg"
          orientation="horizontal"
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded'
  }
}

/**
 * With gaps
 */
export const WithGaps: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div>
        <h4 className="text-sm font-medium mb-2">Small Gap (8px)</h4>
        <Legend
          items={[
            { id: '1', label: 'Item 1', color: '#3b82f6' },
            { id: '2', label: 'Item 2', color: '#ef4444' }
          ]}
          gap={8}
          orientation="horizontal"
        />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Medium Gap (16px)</h4>
        <Legend
          items={[
            { id: '1', label: 'Item 1', color: '#3b82f6' },
            { id: '2', label: 'Item 2', color: '#ef4444' }
          ]}
          gap={16}
          orientation="horizontal"
        />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Large Gap (32px)</h4>
        <Legend
          items={[
            { id: '1', label: 'Item 1', color: '#3b82f6' },
            { id: '2', label: 'Item 2', color: '#ef4444' }
          ]}
          gap={32}
          orientation="horizontal"
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded'
  }
}

/**
 * Mixed visibility
 */
export const MixedVisibility: Story = {
  args: {
    items: [
      { id: '1', label: 'Visible Series', color: '#3b82f6', visible: true },
      { id: '2', label: 'Hidden Series', color: '#ef4444', visible: false },
      { id: '3', label: 'Visible Series 2', color: '#10b981', visible: true }
    ],
    orientation: 'horizontal'
  }
}

/**
 * Custom symbols
 */
export const CustomSymbols: Story = {
  args: {
    items: [
      {
        id: '1',
        label: 'Star',
        color: '#3b82f6',
        customSymbol: (
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M8 1l2.4 4.9 5.4.8-3.9 3.8.9 5.4L8 13.8l-4.8 2.1.9-5.4L.2 6.7l5.4-.8L8 1z" fill="#3b82f6" />
          </svg>
        )
      },
      {
        id: '2',
        label: 'Heart',
        color: '#ef4444',
        customSymbol: (
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M8 14s-6.5-3.6-6.5-8A3.5 3.5 0 018 3.5 3.5 3.5 0 0114.5 6c0 4.4-6.5 8-6.5 8z" fill="#ef4444" />
          </svg>
        )
      }
    ],
    orientation: 'horizontal'
  }
}

/**
 * Non-interactive legend
 */
export const NonInteractive: Story = {
  args: {
    items: [
      { id: '1', label: 'Static Item 1', color: '#3b82f6' },
      { id: '2', label: 'Static Item 2', color: '#ef4444' },
      { id: '3', label: 'Static Item 3', color: '#10b981' }
    ],
    orientation: 'horizontal',
    interactive: false
  }
}
