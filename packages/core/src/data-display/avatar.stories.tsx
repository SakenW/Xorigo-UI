import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './avatar'

const meta = {
  title: 'Data Display/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Avatar 头像组件，支持图片、文字、图标三种显示形式，集成状态指示器。

## 功能特性

- 支持图片头像（带错误处理）
- 支持文字头像（自动提取姓名首字母）
- 支持图标头像
- 支持 6 种尺寸：xs/sm/md/lg/xl/2xl
- 支持 3 种形状：circle/rounded/square
- 支持状态指示器：online/offline/busy/away
- 支持悬浮提示
- 支持加载状态
- 支持自定义背景色
- 完整的 TypeScript 类型支持
- 可访问性支持（ARIA 属性）
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '头像尺寸',
    },
    shape: {
      control: 'select',
      options: ['circle', 'rounded', 'square'],
      description: '头像形状',
    },
    status: {
      control: 'select',
      options: ['online', 'offline', 'busy', 'away', 'none'],
      description: '状态指示器',
    },
    src: {
      control: 'text',
      description: '图片源地址',
    },
    name: {
      control: 'text',
      description: '姓名（用于文字头像）',
    },
    color: {
      control: 'color',
      description: '自定义背景色',
    },
    label: {
      control: 'text',
      description: '悬浮提示文本',
    },
    loading: {
      control: 'boolean',
      description: '加载状态',
    },
    clickable: {
      control: 'boolean',
      description: '是否可点击',
    },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

// 基础示例
export const Default: Story = {
  args: {
    name: 'John Doe',
  },
}

// 不同尺寸
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="John Doe" size="xs" />
      <Avatar name="John Doe" size="sm" />
      <Avatar name="John Doe" size="md" />
      <Avatar name="John Doe" size="lg" />
      <Avatar name="John Doe" size="xl" />
      <Avatar name="John Doe" size="2xl" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持 6 种尺寸：xs、sm、md、lg、xl、2xl',
      },
    },
  },
}

// 不同形状
export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="John Doe" shape="circle" />
      <Avatar name="John Doe" shape="rounded" />
      <Avatar name="John Doe" shape="square" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持 3 种形状：circle（圆形）、rounded（圆角方形）、square（方形）',
      },
    },
  },
}

// 图片头像
export const ImageAvatar: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    name: 'John Doe',
  },
  parameters: {
    docs: {
      description: {
        story: '使用图片作为头像，如果图片加载失败会自动回退到文字头像',
      },
    },
  },
}

// 文字头像
export const TextAvatars: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="John Doe" size="md" />
      <Avatar name="Jane Smith" size="md" />
      <Avatar name="Bob Johnson" size="md" />
      <Avatar name="Alice Williams" size="md" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '文字头像会自动提取姓名的首字母，背景色基于姓名生成',
      },
    },
  },
}

// 图标头像
export const IconAvatar: Story = {
  args: {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '使用自定义图标作为头像，图标优先级高于文字',
      },
    },
  },
}

// 状态指示器
export const StatusIndicators: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Avatar name="John Doe" status="online" />
        <span className="text-sm text-[var(--text-secondary)]">在线</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar name="Jane Smith" status="offline" />
        <span className="text-sm text-[var(--text-secondary)]">离线</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar name="Bob Johnson" status="busy" />
        <span className="text-sm text-[var(--text-secondary)]">忙碌</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar name="Alice Williams" status="away" />
        <span className="text-sm text-[var(--text-secondary)]">离开</span>
      </div>
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

// 组合展示
export const UserList: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar
          name="John Doe"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
          status="online"
          size="sm"
        />
        <div>
          <div className="font-medium">John Doe</div>
          <div className="text-sm text-[var(--text-secondary)]">在线</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Avatar
          name="Jane Smith"
          status="busy"
          size="sm"
        />
        <div>
          <div className="font-medium">Jane Smith</div>
          <div className="text-sm text-[var(--text-secondary)]">忙碌</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Avatar
          name="Bob Johnson"
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face"
          status="away"
          size="sm"
        />
        <div>
          <div className="font-medium">Bob Johnson</div>
          <div className="text-sm text-[var(--text-secondary)]">离开</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Avatar
          name="Alice Williams"
          status="offline"
          size="sm"
        />
        <div>
          <div className="font-medium">Alice Williams</div>
          <div className="text-sm text-[var(--text-secondary)]">离线</div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '在实际应用中的用户列表展示示例',
      },
    },
  },
}

// 加载状态
export const LoadingState: Story = {
  args: {
    loading: true,
    name: 'John Doe',
  },
  parameters: {
    docs: {
      description: {
        story: '显示加载状态时的占位符',
      },
    },
  },
}

// 自定义颜色
export const CustomColors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="John Doe" color="#FF6B6B" />
      <Avatar name="Jane Smith" color="#4ECDC4" />
      <Avatar name="Bob Johnson" color="#45B7D1" />
      <Avatar name="Alice Williams" color="#FFA07A" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持自定义背景色',
      },
    },
  },
}

// 可点击头像
export const ClickableAvatar: Story = {
  args: {
    name: 'John Doe',
    clickable: true,
  },
  render: (args) => (
    <Avatar {...args} onClick={() => alert('Avatar clicked!')} />
  ),
  parameters: {
    docs: {
      description: {
        story: '可点击的头像，带有悬浮效果',
      },
    },
  },
}

// 所有变体组合
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      {/* 不同尺寸 */}
      <div>
        <h3 className="text-sm font-medium mb-4">尺寸 (Size)</h3>
        <div className="flex items-center gap-4">
          <Avatar name="JD" size="xs" />
          <Avatar name="JD" size="sm" />
          <Avatar name="JD" size="md" />
          <Avatar name="JD" size="lg" />
          <Avatar name="JD" size="xl" />
          <Avatar name="JD" size="2xl" />
        </div>
      </div>

      {/* 不同形状 */}
      <div>
        <h3 className="text-sm font-medium mb-4">形状 (Shape)</h3>
        <div className="flex items-center gap-4">
          <Avatar name="JD" shape="circle" />
          <Avatar name="JD" shape="rounded" />
          <Avatar name="JD" shape="square" />
        </div>
      </div>

      {/* 不同状态 */}
      <div>
        <h3 className="text-sm font-medium mb-4">状态 (Status)</h3>
        <div className="flex items-center gap-4">
          <Avatar name="JD" status="online" />
          <Avatar name="JD" status="offline" />
          <Avatar name="JD" status="busy" />
          <Avatar name="JD" status="away" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '所有变体组合展示',
      },
    },
  },
}
