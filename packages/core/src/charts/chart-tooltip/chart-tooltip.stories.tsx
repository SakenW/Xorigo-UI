/**
 * ChartTooltip Component Stories
 *
 * Storybook stories for ChartTooltip component
 */

import type { Meta, StoryObj } from '@storybook/react'
import { ChartTooltip, type TooltipData } from './chart-tooltip'

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof ChartTooltip> = {
  title: 'Charts/ChartTooltip',
  component: ChartTooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
ChartTooltip 是图表组件库的重要组件，为图表提供统一的提示信息显示。

## 功能特性
- 多种显示位置和样式
- 可配置的内容格式
- 动画过渡效果
- 主题系统集成
- 无障碍访问支持

## 使用示例
\`\`\`tsx
const tooltipData: TooltipData = {
  id: '1',
  title: 'Tooltip Title',
  content: 'Tooltip Content',
  x: 100,
  y: 100
}

<ChartTooltip
  data={tooltipData}
  visible={true}
  position="top"
  variant="default"
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
      description: '提示数据'
    },
    visible: {
      control: 'boolean',
      description: '提示的显示状态'
    },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right', 'center'],
      description: '提示的位置'
    },
    showArrow: {
      control: 'boolean',
      description: '是否显示箭头'
    },
    variant: {
      control: 'select',
      options: ['default', 'card', 'minimal'],
      description: '提示的变体'
    },
    maxWidth: {
      control: 'number',
      description: '提示的最大宽度'
    },
    offset: {
      control: 'number',
      description: '提示的偏移量'
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
 * Basic tooltip
 */
export const Basic: Story = {
  args: {
    data: {
      id: '1',
      title: 'Tooltip Title',
      content: 'This is the tooltip content',
      x: 200,
      y: 100
    },
    visible: true,
    position: 'top'
  }
}

/**
 * Different positions
 */
export const DifferentPositions: Story = {
  render: () => (
    <div className="relative" style={{ width: '500px', height: '300px', backgroundColor: '#f3f4f6' }}>
      {/* Center reference point */}
      <div
        className="absolute w-2 h-2 bg-blue-500 rounded-full"
        style={{ left: '250px', top: '150px' }}
      />

      <ChartTooltip
        data={{
          id: '1',
          content: 'Top Position',
          x: 250,
          y: 150
        }}
        visible={true}
        position="top"
        offset={20}
      />

      <ChartTooltip
        data={{
          id: '2',
          content: 'Bottom Position',
          x: 250,
          y: 150
        }}
        visible={true}
        position="bottom"
        offset={20}
      />

      <ChartTooltip
        data={{
          id: '3',
          content: 'Left Position',
          x: 250,
          y: 150
        }}
        visible={true}
        position="left"
        offset={20}
      />

      <ChartTooltip
        data={{
          id: '4',
          content: 'Right Position',
          x: 250,
          y: 150
        }}
        visible={true}
        position="right"
        offset={20}
      />
    </div>
  ),
  parameters: {
    layout: 'padded'
  }
}

/**
 * Different variants
 */
export const DifferentVariants: Story = {
  render: () => (
    <div className="relative" style={{ width: '400px', height: '300px', backgroundColor: '#f3f4f6' }}>
      {/* Reference points */}
      <div className="absolute" style={{ left: '50px', top: '50px' }}>
        <div className="w-2 h-2 bg-blue-500 rounded-full" />
        <ChartTooltip
          data={{
            id: '1',
            title: 'Default Variant',
            content: 'This is the default variant',
            x: 0,
            y: 0
          }}
          visible={true}
          position="bottom"
        />
      </div>

      <div className="absolute" style={{ left: '200px', top: '50px' }}>
        <div className="w-2 h-2 bg-blue-500 rounded-full" />
        <ChartTooltip
          data={{
            id: '2',
            title: 'Card Variant',
            content: 'This is the card variant with more styling',
            x: 0,
            y: 0
          }}
          visible={true}
          position="bottom"
          variant="card"
        />
      </div>

      <div className="absolute" style={{ left: '350px', top: '50px' }}>
        <div className="w-2 h-2 bg-blue-500 rounded-full" />
        <ChartTooltip
          data={{
            id: '3',
            content: 'Minimal',
            x: 0,
            y: 0
          }}
          visible={true}
          position="bottom"
          variant="minimal"
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded'
  }
}

/**
 * With custom content
 */
export const CustomContent: Story = {
  args: {
    data: {
      id: '1',
      title: 'Custom Content',
      content: (
        <div>
          <p className="font-medium">Custom React Content</p>
          <ul className="mt-1 list-disc list-inside">
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </div>
      ),
      x: 200,
      y: 100
    },
    visible: true,
    position: 'top'
  }
}

/**
 * Without arrows
 */
export const WithoutArrows: Story = {
  args: {
    data: {
      id: '1',
      title: 'No Arrow',
      content: 'This tooltip has no arrow',
      x: 200,
      y: 100
    },
    visible: true,
    position: 'top',
    showArrow: false
  }
}

/**
 * Wide tooltip
 */
export const WideTooltip: Story = {
  args: {
    data: {
      id: '1',
      title: 'Wide Tooltip',
      content: 'This is a wider tooltip with more content to demonstrate the maxWidth property',
      x: 200,
      y: 100
    },
    visible: true,
    position: 'top',
    maxWidth: 300
  }
}

/**
 * Numeric value tooltip
 */
export const NumericValue: Story = {
  args: {
    data: {
      id: '1',
      title: 'Sales Data',
      content: 'Revenue: $123,456',
      value: 123456,
      x: 200,
      y: 100
    },
    visible: true,
    position: 'top'
  }
}

/**
 * Color-coded tooltip
 */
export const ColorCoded: Story = {
  args: {
    data: {
      id: '1',
      title: 'Data Point',
      content: 'Value: 85%',
      color: '#3b82f6',
      x: 200,
      y: 100
    },
    visible: true,
    position: 'top'
  }
}

/**
 * Interactive example
 */
export const Interactive: Story = {
  render: () => {
    const [tooltipData, setTooltipData] = React.useState<TooltipData | null>(null)
    const [visible, setVisible] = React.useState(false)

    const handleMouseEnter = (x: number, y: number) => {
      setTooltipData({
        id: '1',
        title: 'Hover Data',
        content: `Position: (${x}, ${y})`,
        x,
        y
      })
      setVisible(true)
    }

    const handleMouseLeave = () => {
      setVisible(false)
    }

    return (
      <div
        className="relative"
        style={{ width: '500px', height: '300px', backgroundColor: '#f3f4f6' }}
        onMouseLeave={handleMouseLeave}
      >
        {/* Interactive areas */}
        <div
          className="absolute w-16 h-16 bg-blue-500 opacity-20 rounded cursor-pointer"
          style={{ left: '50px', top: '50px' }}
          onMouseEnter={() => handleMouseEnter(100, 100)}
        />
        <div
          className="absolute w-16 h-16 bg-green-500 opacity-20 rounded cursor-pointer"
          style={{ left: '200px', top: '100px' }}
          onMouseEnter={() => handleMouseEnter(250, 150)}
        />
        <div
          className="absolute w-16 h-16 bg-purple-500 opacity-20 rounded cursor-pointer"
          style={{ left: '350px', top: '150px' }}
          onMouseEnter={() => handleMouseEnter(400, 200)}
        />

        <ChartTooltip
          data={tooltipData || undefined}
          visible={visible}
          position="top"
          offset={10}
        />
      </div>
    )
  },
  parameters: {
    layout: 'padded'
  }
}

/**
 * With delay
 */
export const WithDelay: Story = {
  args: {
    data: {
      id: '1',
      title: 'Delayed Tooltip',
      content: 'This tooltip appears with a delay',
      x: 200,
      y: 100
    },
    visible: true,
    position: 'top',
    delay: 500
  }
}
