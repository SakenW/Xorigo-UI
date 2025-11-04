import type { Meta, StoryObj } from '@storybook/react'
import { ChipDisplay } from './chip-display'

const meta = {
  title: 'Data Display/ChipDisplay',
  component: ChipDisplay,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
ChipDisplay 展示型芯片组件，用于显示标签、状态、信息等内容。

## 功能特性

- 支持 6 种颜色：primary/secondary/success/warning/error/info
- 支持 4 种变体：solid/soft/outline/ghost
- 支持 4 种尺寸：xs/sm/md/lg
- 支持左侧图标和右侧图标
- 支持头像显示
- 支持状态指示器（dot）
- 支持选中状态和禁用状态
- 支持可关闭模式
- 支持文本截断和工具提示
- 支持点击事件和动画效果
- 完整的 TypeScript 类型支持
- 可访问性支持（ARIA 属性）
- 响应式设计
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description: '芯片颜色',
    },
    variant: {
      control: 'select',
      options: ['solid', 'soft', 'outline', 'ghost'],
      description: '变体类型',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: '芯片尺寸',
    },
    label: {
      control: 'text',
      description: '芯片文本内容',
    },
    leftIcon: {
      control: false,
      description: '左侧图标',
    },
    rightIcon: {
      control: false,
      description: '右侧图标',
    },
    avatar: {
      control: 'text',
      description: '头像图片地址',
    },
    isSelected: {
      control: 'boolean',
      description: '是否选中',
    },
    isDisabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    isClosable: {
      control: 'boolean',
      description: '是否可关闭',
    },
    status: {
      control: 'select',
      options: ['online', 'offline', 'busy', 'away'],
      description: '状态指示器',
    },
    maxWidth: {
      control: 'number',
      description: '最大宽度（像素）',
    },
    clickable: {
      control: 'boolean',
      description: '是否可点击（带动画）',
    },
  },
} satisfies Meta<typeof ChipDisplay>

export default meta
type Story = StoryObj<typeof meta>

// 基础示例
export const Default: Story = {
  args: {
    label: 'Default Chip',
  },
}

// 不同颜色
export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <ChipDisplay label="Primary" color="primary" />
      <ChipDisplay label="Secondary" color="secondary" />
      <ChipDisplay label="Success" color="success" />
      <ChipDisplay label="Warning" color="warning" />
      <ChipDisplay label="Error" color="error" />
      <ChipDisplay label="Info" color="info" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持 6 种颜色：primary、secondary、success、warning、error、info',
      },
    },
  },
}

// 不同变体
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <ChipDisplay label="Solid" variant="solid" />
      <ChipDisplay label="Soft" variant="soft" />
      <ChipDisplay label="Outline" variant="outline" />
      <ChipDisplay label="Ghost" variant="ghost" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持 4 种变体：solid（实心）、soft（柔和）、outline（描边）、ghost（透明）',
      },
    },
  },
}

// 不同尺寸
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <ChipDisplay label="XS" size="xs" />
      <ChipDisplay label="SM" size="sm" />
      <ChipDisplay label="MD" size="md" />
      <ChipDisplay label="LG" size="lg" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持 4 种尺寸：xs、sm、md、lg',
      },
    },
  },
}

// 带图标
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <ChipDisplay
        label="With Left Icon"
        leftIcon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        }
      />
      <ChipDisplay
        label="With Right Icon"
        rightIcon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        }
      />
      <ChipDisplay
        label="With Both Icons"
        leftIcon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        }
        rightIcon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        }
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持左侧图标、右侧图标或同时显示两个图标',
      },
    },
  },
}

// 带头像
export const WithAvatar: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <ChipDisplay
        label="John Doe"
        avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
      />
      <ChipDisplay
        label="Jane Smith"
        avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face"
        size="sm"
      />
      <ChipDisplay
        label="Bob Johnson"
        avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face"
        size="lg"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持头像显示，如果图片加载失败会自动回退到文字显示',
      },
    },
  },
}

// 状态指示器
export const StatusIndicators: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <ChipDisplay label="Online" status="online" color="success" />
      <ChipDisplay label="Offline" status="offline" color="secondary" />
      <ChipDisplay label="Busy" status="busy" color="error" />
      <ChipDisplay label="Away" status="away" color="warning" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持 4 种状态指示器：online（在线）、offline（离线）、busy（忙碌）、away（离开）',
      },
    },
  },
}

// 选中状态
export const SelectedStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <ChipDisplay label="Not Selected" isSelected={false} />
      <ChipDisplay label="Selected" isSelected={true} />
      <ChipDisplay label="Disabled" isDisabled={true} />
      <ChipDisplay label="Selected & Disabled" isSelected={true} isDisabled={true} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持选中状态、禁用状态，以及两者的组合',
      },
    },
  },
}

// 可关闭芯片
export const Closable: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <ChipDisplay
        label="Closable Chip"
        isClosable={true}
        onClose={(e) => {
          e.stopPropagation()
          alert('Chip closed!')
        }}
      />
      <ChipDisplay
        label="Multiple"
        isClosable={true}
        onClose={(e) => {
          e.stopPropagation()
          alert('Closed!')
        }}
      />
      <ChipDisplay
        label="Disabled Close"
        isDisabled={true}
        isClosable={true}
        onClose={() => alert('This should not fire')}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持可关闭模式，显示关闭按钮，点击可触发关闭事件',
      },
    },
  },
}

// 文本截断
export const TextTruncation: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <ChipDisplay label="Short Text" maxWidth={100} />
      </div>
      <div className="flex flex-wrap gap-2">
        <ChipDisplay
          label="This is a very long text that will be truncated"
          maxWidth={120}
          showTooltip={true}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持文本截断，当文本超过最大宽度时会截断并显示省略号，可选择显示工具提示',
      },
    },
  },
}

// 颜色变体组合
export const ColorVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Solid</h3>
        <div className="flex flex-wrap gap-2">
          <ChipDisplay label="Primary" variant="solid" color="primary" />
          <ChipDisplay label="Secondary" variant="solid" color="secondary" />
          <ChipDisplay label="Success" variant="solid" color="success" />
          <ChipDisplay label="Warning" variant="solid" color="warning" />
          <ChipDisplay label="Error" variant="solid" color="error" />
          <ChipDisplay label="Info" variant="solid" color="info" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Soft</h3>
        <div className="flex flex-wrap gap-2">
          <ChipDisplay label="Primary" variant="soft" color="primary" />
          <ChipDisplay label="Secondary" variant="soft" color="secondary" />
          <ChipDisplay label="Success" variant="soft" color="success" />
          <ChipDisplay label="Warning" variant="soft" color="warning" />
          <ChipDisplay label="Error" variant="soft" color="error" />
          <ChipDisplay label="Info" variant="soft" color="info" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Outline</h3>
        <div className="flex flex-wrap gap-2">
          <ChipDisplay label="Primary" variant="outline" color="primary" />
          <ChipDisplay label="Secondary" variant="outline" color="secondary" />
          <ChipDisplay label="Success" variant="outline" color="success" />
          <ChipDisplay label="Warning" variant="outline" color="warning" />
          <ChipDisplay label="Error" variant="outline" color="error" />
          <ChipDisplay label="Info" variant="outline" color="info" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Ghost</h3>
        <div className="flex flex-wrap gap-2">
          <ChipDisplay label="Primary" variant="ghost" color="primary" />
          <ChipDisplay label="Secondary" variant="ghost" color="secondary" />
          <ChipDisplay label="Success" variant="ghost" color="success" />
          <ChipDisplay label="Warning" variant="ghost" color="warning" />
          <ChipDisplay label="Error" variant="ghost" color="error" />
          <ChipDisplay label="Info" variant="ghost" color="info" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '所有颜色与变体的组合展示',
      },
    },
  },
}

// 实际应用场景
export const RealWorldExamples: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">用户标签</h3>
        <div className="flex flex-wrap gap-2">
          <ChipDisplay
            label="John Doe"
            avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
            status="online"
            color="success"
          />
          <ChipDisplay
            label="Jane Smith"
            avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face"
            status="busy"
            color="error"
          />
          <ChipDisplay
            label="Bob Johnson"
            avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face"
            status="away"
            color="warning"
          />
          <ChipDisplay
            label="Alice Williams"
            status="offline"
            color="secondary"
          />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">状态标签</h3>
        <div className="flex flex-wrap gap-2">
          <ChipDisplay label="Active" color="success" variant="soft" />
          <ChipDisplay label="Pending" color="warning" variant="soft" />
          <ChipDisplay label="Rejected" color="error" variant="soft" />
          <ChipDisplay label="Draft" color="secondary" variant="outline" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">分类标签</h3>
        <div className="flex flex-wrap gap-2">
          <ChipDisplay label="React" color="info" />
          <ChipDisplay label="TypeScript" color="primary" />
          <ChipDisplay label="Frontend" color="secondary" />
          <ChipDisplay label="UI Component" color="info" variant="outline" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">可删除的筛选器</h3>
        <div className="flex flex-wrap gap-2">
          <ChipDisplay
            label="JavaScript"
            isClosable={true}
            onClose={(e) => {
              e.stopPropagation()
              alert('Removed JavaScript')
            }}
          />
          <ChipDisplay
            label="CSS"
            isClosable={true}
            onClose={(e) => {
              e.stopPropagation()
              alert('Removed CSS')
            }}
          />
          <ChipDisplay
            label="HTML"
            isClosable={true}
            onClose={(e) => {
              e.stopPropagation()
              alert('Removed HTML')
            }}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '在实际应用中的使用示例',
      },
    },
  },
}

// 可点击芯片
export const Clickable: Story = {
  args: {
    label: 'Clickable Chip',
    clickable: true,
  },
  render: (args) => (
    <ChipDisplay
      {...args}
      onClick={() => alert('Chip clicked!')}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: '可点击的芯片，带有悬浮和点击动画效果',
      },
    },
  },
}
