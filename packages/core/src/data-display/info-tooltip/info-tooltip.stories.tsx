/**
 * InfoTooltip Component Stories
 *
 * Storybook stories for InfoTooltip component
 */

import type { Meta, StoryObj } from '@storybook/react'
import { InfoTooltip, type InfoTooltipProps } from './info-tooltip'

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof InfoTooltip> = {
  title: 'Data Display/InfoTooltip',
  component: InfoTooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
InfoTooltip 是信息提示组件，为用户提供上下文相关的信息提示。

## 功能特性
- 支持多种触发方式（hover、click、focus）
- 可配置位置（top、bottom、left、right）
- 支持延迟显示
- 可配置箭头显示
- 支持不同变体和尺寸
- 支持强制显示模式
- 完全可访问性支持

## 使用示例
\`\`\`tsx
<InfoTooltip content="这是提示内容">
  <button>悬停查看</button>
</InfoTooltip>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: '提示内容'
    },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: '提示框位置'
    },
    trigger: {
      control: 'select',
      options: ['hover', 'click', 'focus'],
      description: '触发方式'
    },
    variant: {
      control: 'select',
      options: ['default', 'inverted'],
      description: '提示框变体'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '提示框大小'
    },
    showArrow: {
      control: 'boolean',
      description: '是否显示箭头'
    },
    delay: {
      control: 'number',
      description: '延迟显示时间（毫秒）'
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用'
    },
    forceShow: {
      control: 'boolean',
      description: '强制显示（用于演示）'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Stories
// ============================================================================

/**
 * Default tooltip with hover trigger
 */
export const Default: Story = {
  args: {
    content: '这是一个信息提示',
    children: <button className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-md">悬停查看</button>
  }
}

/**
 * Tooltip on top position
 */
export const TopPosition: Story = {
  args: {
    content: '顶部位置的提示',
    position: 'top',
    children: <button className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-md">顶部提示</button>
  }
}

/**
 * Tooltip on bottom position
 */
export const BottomPosition: Story = {
  args: {
    content: '底部位置的提示',
    position: 'bottom',
    children: <button className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-md">底部提示</button>
  }
}

/**
 * Tooltip on left position
 */
export const LeftPosition: Story = {
  args: {
    content: '左侧位置的提示',
    position: 'left',
    children: <button className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-md">左侧提示</button>
  }
}

/**
 * Tooltip on right position
 */
export const RightPosition: Story = {
  args: {
    content: '右侧位置的提示',
    position: 'right',
    children: <button className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-md">右侧提示</button>
  }
}

/**
 * Click trigger tooltip
 */
export const ClickTrigger: Story = {
  args: {
    content: '点击触发的提示',
    trigger: 'click',
    children: <button className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-md">点击查看</button>
  }
}

/**
 * Focus trigger tooltip
 */
export const FocusTrigger: Story = {
  args: {
    content: '焦点触发的提示',
    trigger: 'focus',
    children: <input type="text" className="px-4 py-2 border border-[var(--color-border)] rounded-md" placeholder="聚焦查看" />
  }
}

/**
 * Without arrow
 */
export const WithoutArrow: Story = {
  args: {
    content: '没有箭头的提示',
    showArrow: false,
    children: <button className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-md">无箭头</button>
  }
}

/**
 * Small size tooltip
 */
export const SmallSize: Story = {
  args: {
    content: '小尺寸提示',
    size: 'sm',
    children: <button className="px-3 py-1 bg-[var(--color-primary-500)] text-white rounded-md text-sm">小尺寸</button>
  }
}

/**
 * Large size tooltip
 */
export const LargeSize: Story = {
  args: {
    content: '大尺寸提示',
    size: 'lg',
    children: <button className="px-6 py-3 bg-[var(--color-primary-500)] text-white rounded-md text-lg">大尺寸</button>
  }
}

/**
 * Inverted variant tooltip
 */
export const InvertedVariant: Story = {
  args: {
    content: '反转变体提示',
    variant: 'inverted',
    children: <button className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md">反转样式</button>
  }
}

/**
 * Delayed tooltip
 */
export const DelayedTooltip: Story = {
  args: {
    content: '延迟显示的提示',
    delay: 500,
    children: <button className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-md">延迟 500ms</button>
  }
}

/**
 * Disabled tooltip
 */
export const DisabledTooltip: Story = {
  args: {
    content: '禁用的提示',
    disabled: true,
    children: <button className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-md opacity-50 cursor-not-allowed">禁用状态</button>
  }
}

/**
 * Complex content tooltip
 */
export const ComplexContent: Story = {
  args: {
    content: (
      <div>
        <div className="font-semibold mb-1">详细说明</div>
        <div className="text-sm">这里是更详细的信息内容，可以包含多行文本和各种元素。</div>
      </div>
    ),
    children: <button className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-md">复杂内容</button>
  }
}

/**
 * Always visible tooltip (for documentation)
 */
export const AlwaysVisible: Story = {
  args: {
    content: '始终显示的提示（用于演示）',
    forceShow: true,
    children: <button className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-md">始终可见</button>
  }
}

/**
 * Multiple tooltips example
 */
export const MultipleTooltips: Story = {
  render: () => (
    <div className="flex gap-4">
      <InfoTooltip content="顶部提示" position="top">
        <button className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-md">上</button>
      </InfoTooltip>
      <InfoTooltip content="右侧提示" position="right">
        <button className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-md">右</button>
      </InfoTooltip>
      <InfoTooltip content="底部提示" position="bottom">
        <button className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-md">下</button>
      </InfoTooltip>
      <InfoTooltip content="左侧提示" position="left">
        <button className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-md">左</button>
      </InfoTooltip>
    </div>
  )
}

/**
 * With icon button
 */
export const WithIconButton: Story = {
  args: {
    content: '信息提示内容',
    children: (
      <button className="w-6 h-6 rounded-full bg-[var(--color-primary-500)] text-white text-sm flex items-center justify-center">
        i
      </button>
    )
  }
}

/**
 * With form field
 */
export const WithFormField: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">密码</label>
      <InfoTooltip content="密码长度至少8位，包含大小写字母和数字">
        <button className="w-4 h-4 rounded-full bg-[var(--color-border)] text-[var(--color-text-secondary)] text-xs flex items-center justify-center">
          ?
        </button>
      </InfoTooltip>
      <input type="password" className="px-3 py-2 border border-[var(--color-border)] rounded-md" />
    </div>
  )
}
