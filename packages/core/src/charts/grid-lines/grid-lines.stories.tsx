import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { GridLines } from './grid-lines'
import type { GridLinesProps } from './grid-lines'

const meta = {
  title: 'Charts/GridLines',
  component: GridLines,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'GridLines 组件用于在图表中显示网格线和坐标轴，支持水平和垂直方向，具有丰富的自定义选项。'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical', 'both'],
      description: '网格线方向'
    },
    variant: {
      control: 'select',
      options: ['default', 'dashed', 'dotted', 'bold'],
      description: '网格线样式变体'
    },
    opacity: {
      control: 'select',
      options: ['subtle', 'medium', 'strong'],
      description: '网格线透明度'
    },
    showAxes: {
      control: 'boolean',
      description: '是否显示坐标轴'
    },
    axisStyle: {
      control: 'select',
      options: ['default', 'bold', 'none'],
      description: '坐标轴样式'
    },
    animated: {
      control: 'boolean',
      description: '是否启用动画'
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: '图表主题'
    }
  },
  decorators: [
    (Story) => (
      <div className="p-4 bg-white dark:bg-gray-900 rounded-lg" style={{ width: '600px', height: '400px' }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof GridLines>

export default meta
type Story = StoryObj<typeof meta>

// 基础示例
export const Basic: Story = {
  args: {
    width: 500,
    height: 300,
    direction: 'both',
    dataRange: {
      min: 0,
      max: 100,
      labels: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    margin: { top: 20, right: 30, bottom: 40, left: 50 }
  }
}

// 仅水平网格线
export const HorizontalOnly: Story = {
  args: {
    ...Basic.args,
    direction: 'horizontal'
  }
}

// 仅垂直网格线
export const VerticalOnly: Story = {
  args: {
    ...Basic.args,
    direction: 'vertical'
  }
}

// 虚线样式
export const DashedStyle: Story = {
  args: {
    width: 500,
    height: 300,
    direction: 'both',
    horizontal: {
      variant: 'dashed',
      opacity: 'medium'
    },
    vertical: {
      variant: 'dashed',
      opacity: 'medium'
    },
    dataRange: {
      min: 0,
      max: 100,
      labels: ['Q1', 'Q2', 'Q3', 'Q4']
    },
    margin: { top: 20, right: 30, bottom: 40, left: 50 }
  }
}

// 点线样式
export const DottedStyle: Story = {
  args: {
    width: 500,
    height: 300,
    direction: 'both',
    horizontal: {
      variant: 'dotted',
      opacity: 'strong'
    },
    vertical: {
      variant: 'dotted',
      opacity: 'strong'
    },
    dataRange: {
      min: 0,
      max: 100,
      labels: ['A', 'B', 'C', 'D', 'E', 'F']
    },
    margin: { top: 20, right: 30, bottom: 40, left: 50 }
  }
}

// 粗线样式
export const BoldStyle: Story = {
  args: {
    width: 500,
    height: 300,
    direction: 'both',
    horizontal: {
      variant: 'bold',
      opacity: 'strong'
    },
    vertical: {
      variant: 'bold',
      opacity: 'strong'
    },
    dataRange: {
      min: 0,
      max: 100,
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    },
    margin: { top: 20, right: 30, bottom: 40, left: 50 }
  }
}

// 无坐标轴
export const NoAxes: Story = {
  args: {
    ...Basic.args,
    showAxes: false,
    axisStyle: 'none'
  }
}

// 粗坐标轴
export const BoldAxes: Story = {
  args: {
    ...Basic.args,
    axisStyle: 'bold'
  }
}

// 无标签
export const NoLabels: Story = {
  args: {
    ...Basic.args,
    horizontal: {
      showLabels: false
    },
    vertical: {
      showLabels: false
    }
  }
}

// 自定义标签格式
export const CustomLabelFormat: Story = {
  args: {
    width: 500,
    height: 300,
    direction: 'both',
    horizontal: {
      showLabels: true,
      formatLabel: (index: number, value: number | string) => {
        if (typeof value === 'number') {
          return `${value}%`
        }
        return value as string
      }
    },
    vertical: {
      showLabels: true,
      formatLabel: (index: number, value: number | string) => {
        return `Label ${index + 1}`
      }
    },
    dataRange: {
      min: 0,
      max: 100,
      labels: ['January', 'February', 'March', 'April', 'May']
    },
    margin: { top: 20, right: 30, bottom: 40, left: 50 }
  }
}

// 自定义数量
export const CustomCount: Story = {
  args: {
    width: 500,
    height: 300,
    direction: 'both',
    horizontal: {
      count: 10,
      opacity: 'subtle'
    },
    vertical: {
      count: 12,
      opacity: 'subtle'
    },
    dataRange: {
      min: 0,
      max: 100
    },
    margin: { top: 20, right: 30, bottom: 40, left: 50 }
  }
}

// 强透明度
export const StrongOpacity: Story = {
  args: {
    width: 500,
    height: 300,
    direction: 'both',
    horizontal: {
      opacity: 'strong'
    },
    vertical: {
      opacity: 'strong'
    },
    dataRange: {
      min: 0,
      max: 100,
      labels: ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4']
    },
    margin: { top: 20, right: 30, bottom: 40, left: 50 }
  }
}

// 无动画
export const NoAnimation: Story = {
  args: {
    ...Basic.args,
    animated: false,
    animationDuration: 0
  }
}

// 自定义动画
export const CustomAnimation: Story = {
  args: {
    width: 500,
    height: 300,
    direction: 'both',
    animationDuration: 1.5,
    animationDelay: 0.5,
    dataRange: {
      min: 0,
      max: 100,
      labels: ['2020', '2021', '2022', '2023', '2024']
    },
    margin: { top: 20, right: 30, bottom: 40, left: 50 }
  }
}

// 暗色主题
export const DarkTheme: Story = {
  args: {
    ...Basic.args,
    theme: 'dark'
  },
  decorators: [
    (Story) => (
      <div className="p-4 bg-gray-900 rounded-lg" style={{ width: '600px', height: '400px' }}>
        <Story />
      </div>
    )
  ]
}

// 完整配置示例
export const FullConfiguration: Story = {
  args: {
    width: 500,
    height: 300,
    direction: 'both',
    horizontal: {
      count: 8,
      color: 'currentColor',
      variant: 'default',
      opacity: 'medium',
      showLabels: true,
      formatLabel: (index: number, value: number | string) => {
        const num = typeof value === 'number' ? value : index * 12.5
        return `${num.toFixed(1)}%`
      }
    },
    vertical: {
      count: 6,
      color: 'currentColor',
      variant: 'default',
      opacity: 'medium',
      showLabels: true,
      formatLabel: (index: number, value: number | string) => {
        const labels = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025']
        return labels[index] || `Period ${index + 1}`
      }
    },
    showAxes: true,
    axisStyle: 'default',
    axisColor: 'currentColor',
    animated: true,
    animationDuration: 1.0,
    animationDelay: 0.2,
    theme: 'light',
    dataRange: {
      min: 0,
      max: 100,
      labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025']
    },
    margin: { top: 20, right: 30, bottom: 40, left: 50 },
    className: 'chart-grid',
    labelClassName: 'text-xs font-medium'
  }
}
