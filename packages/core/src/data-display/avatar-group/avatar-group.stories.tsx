import type { Meta, StoryObj } from '@storybook/react'
import { AvatarGroup } from './avatar-group'
import { Avatar } from '../avatar'

const meta = {
  title: 'Data Display/Avatar Group',
  component: AvatarGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Avatar Group 头像组组件，用于显示多个头像的组合。

## 功能特性

- 支持多种排列方式：水平/垂直/网格
- 支持最大显示数量控制
- 支持溢出头像折叠显示
- 支持工具提示展开
- 支持多种叠加效果：堆叠/扩散/无重叠
- 支持间距控制：紧密/正常/宽松
- 支持尺寸继承（6种尺寸）
- 支持形状继承（3种形状）
- 支持状态指示器传递
- 支持自定义溢出内容
- 支持响应式设计
- 支持加载状态
- 完整的 TypeScript 类型支持
- 集成七轴主题系统
- 流畅的动画效果

## 使用场景

- 团队成员列表展示
- 聊天群组头像
- 用户互动列表
- 权限组展示
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    max: {
      control: { type: 'number', min: 0, max: 20 },
      description: '最大显示数量',
    },
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
    layout: {
      control: 'select',
      options: ['horizontal', 'vertical', 'grid'],
      description: '排列方式',
    },
    spacing: {
      control: 'select',
      options: ['tight', 'normal', 'loose'],
      description: '间距控制',
    },
    overlap: {
      control: 'select',
      options: ['stack', 'spread', 'none'],
      description: '叠加模式',
    },
    maxItemsSm: {
      control: { type: 'number', min: 0, max: 20 },
      description: '移动端最大显示数',
    },
    animate: {
      control: 'boolean',
      description: '启用动画',
    },
    loading: {
      control: 'boolean',
      description: '加载状态',
    },
  },
} satisfies Meta<typeof AvatarGroup>

export default meta
type Story = StoryObj<typeof meta>

// 基础示例
export const Default: Story = {
  args: {
    max: 5,
    children: (
      <>
        <Avatar name="John Doe" />
        <Avatar name="Jane Smith" />
        <Avatar name="Bob Johnson" />
        <Avatar name="Alice Williams" />
        <Avatar name="Charlie Brown" />
        <Avatar name="David Wilson" />
        <Avatar name="Emma Davis" />
      </>
    ),
  },
}

// 不同最大数量
export const DifferentMax: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-4">max=3</h3>
        <AvatarGroup max={3}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
          <Avatar name="Alice Williams" />
          <Avatar name="Charlie Brown" />
        </AvatarGroup>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">max=7</h3>
        <AvatarGroup max={7}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
          <Avatar name="Alice Williams" />
          <Avatar name="Charlie Brown" />
          <Avatar name="David Wilson" />
          <Avatar name="Emma Davis" />
        </>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">max=10</h3>
        <AvatarGroup max={10}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
          <Avatar name="Alice Williams" />
          <Avatar name="Charlie Brown" />
        </AvatarGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '根据 max 属性控制显示的头像数量，超出的头像会显示为溢出数字',
      },
    },
  },
}

// 不同排列方式
export const Layouts: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-4">水平排列 (horizontal)</h3>
        <AvatarGroup layout="horizontal">
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
          <Avatar name="Alice Williams" />
          <Avatar name="Charlie Brown" />
          <Avatar name="David Wilson" />
        </AvatarGroup>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">垂直排列 (vertical)</h3>
        <AvatarGroup layout="vertical">
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
          <Avatar name="Alice Williams" />
          <Avatar name="Charlie Brown" />
          <Avatar name="David Wilson" />
        </AvatarGroup>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">网格排列 (grid)</h3>
        <AvatarGroup layout="grid" max={8}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
          <Avatar name="Alice Williams" />
          <Avatar name="Charlie Brown" />
          <Avatar name="David Wilson" />
          <Avatar name="Emma Davis" />
          <Avatar name="Frank Miller" />
        </AvatarGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持 3 种排列方式：horizontal（水平）、vertical（垂直）、grid（网格）',
      },
    },
  },
}

// 不同间距
export const Spacing: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-4">紧密间距 (tight)</h3>
        <AvatarGroup spacing="tight" max={5}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
          <Avatar name="Alice Williams" />
          <Avatar name="Charlie Brown" />
        </AvatarGroup>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">正常间距 (normal)</h3>
        <AvatarGroup spacing="normal" max={5}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
          <Avatar name="Alice Williams" />
          <Avatar name="Charlie Brown" />
        </AvatarGroup>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">宽松间距 (loose)</h3>
        <AvatarGroup spacing="loose" max={5}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
          <Avatar name="Alice Williams" />
          <Avatar name="Charlie Brown" />
        </AvatarGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '控制头像之间的间距：tight（紧密）、normal（正常）、loose（宽松）',
      },
    },
  },
}

// 不同叠加模式
export const OverlapModes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-4">堆叠模式 (stack)</h3>
        <AvatarGroup overlap="stack" max={6}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
          <Avatar name="Alice Williams" />
          <Avatar name="Charlie Brown" />
          <Avatar name="David Wilson" />
        </AvatarGroup>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">扩散模式 (spread)</h3>
        <AvatarGroup overlap="spread" max={6}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
          <Avatar name="Alice Williams" />
          <Avatar name="Charlie Brown" />
          <Avatar name="David Wilson" />
        </AvatarGroup>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">无重叠 (none)</h3>
        <AvatarGroup overlap="none" max={6}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
          <Avatar name="Alice Williams" />
          <Avatar name="Charlie Brown" />
          <Avatar name="David Wilson" />
        </AvatarGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '控制头像的叠加效果：stack（堆叠）、spread（扩散）、none（无重叠）',
      },
    },
  },
}

// 不同尺寸
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-4">尺寸对比</h3>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <AvatarGroup size="xs" max={4}>
              <Avatar name="John Doe" />
              <Avatar name="Jane Smith" />
              <Avatar name="Bob Johnson" />
              <Avatar name="Alice Williams" />
            </AvatarGroup>
            <span className="text-sm text-[var(--text-secondary)]">xs</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AvatarGroup size="sm" max={4}>
              <Avatar name="John Doe" />
              <Avatar name="Jane Smith" />
              <Avatar name="Bob Johnson" />
              <Avatar name="Alice Williams" />
            </AvatarGroup>
            <span className="text-sm text-[var(--text-secondary)]">sm</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AvatarGroup size="md" max={4}>
              <Avatar name="John Doe" />
              <Avatar name="Jane Smith" />
              <Avatar name="Bob Johnson" />
              <Avatar name="Alice Williams" />
            </AvatarGroup>
            <span className="text-sm text-[var(--text-secondary)]">md</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AvatarGroup size="lg" max={4}>
              <Avatar name="John Doe" />
              <Avatar name="Jane Smith" />
              <Avatar name="Bob Johnson" />
              <Avatar name="Alice Williams" />
            </AvatarGroup>
            <span className="text-sm text-[var(--text-secondary)]">lg</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AvatarGroup size="xl" max={4}>
              <Avatar name="John Doe" />
              <Avatar name="Jane Smith" />
              <Avatar name="Bob Johnson" />
              <Avatar name="Alice Williams" />
            </AvatarGroup>
            <span className="text-sm text-[var(--text-secondary)]">xl</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AvatarGroup size="2xl" max={4}>
              <Avatar name="John Doe" />
              <Avatar name="Jane Smith" />
              <Avatar name="Bob Johnson" />
              <Avatar name="Alice Williams" />
            </AvatarGroup>
            <span className="text-sm text-[var(--text-secondary)]">2xl</span>
          </div>
        </div>
      </div>
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

// 状态指示器传递
export const WithStatus: Story = {
  render: () => (
    <div className="space-y-6">
      <AvatarGroup max={5}>
        <Avatar name="John Doe" status="online" />
        <Avatar name="Jane Smith" status="busy" />
        <Avatar name="Bob Johnson" status="away" />
        <Avatar name="Alice Williams" status="offline" />
        <Avatar name="Charlie Brown" status="online" />
        <Avatar name="David Wilson" status="offline" />
        <Avatar name="Emma Davis" status="busy" />
      </AvatarGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatar 组件的状态指示器会自动传递给 AvatarGroup',
      },
    },
  },
}

// 图片头像
export const WithImages: Story = {
  render: () => (
    <AvatarGroup max={6}>
      <Avatar
        name="John Doe"
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
      />
      <Avatar
        name="Jane Smith"
        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
      />
      <Avatar
        name="Bob Johnson"
        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face"
      />
      <Avatar
        name="Alice Williams"
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face"
      />
      <Avatar
        name="Charlie Brown"
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
      />
      <Avatar
        name="David Wilson"
        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face"
      />
      <Avatar name="Emma Davis" />
    </AvatarGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持图片头像，图片加载失败时会自动回退到文字头像',
      },
    },
  },
}

// 自定义溢出内容
export const CustomOverflow: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-4">自定义溢出文本</h3>
        <AvatarGroup
          max={3}
          overflowTooltip={(count) => `还有 ${count} 位成员在线`}
        >
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
          <Avatar name="Alice Williams" />
          <Avatar name="Charlie Brown" />
        </AvatarGroup>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">自定义溢出内容</h3>
        <AvatarGroup
          max={3}
          overflowContent={
            <div className="flex items-center justify-center w-full h-full">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          }
        >
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
          <Avatar name="Alice Williams" />
          <Avatar name="Charlie Brown" />
        </AvatarGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持自定义溢出工具提示文本和溢出内容',
      },
    },
  },
}

// 团队展示示例
export const TeamExample: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">开发团队</h3>
        <AvatarGroup
          max={6}
          size="lg"
          spacing="normal"
          overlap="stack"
          overflowTooltip={(count) => `还有 ${count} 位团队成员`}
        >
          <Avatar
            name="John Doe"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
            status="online"
          />
          <Avatar
            name="Jane Smith"
            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
            status="busy"
          />
          <Avatar
            name="Bob Johnson"
            status="online"
            name="Bob Johnson"
          />
          <Avatar
            name="Alice Williams"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face"
            status="away"
          />
          <Avatar
            name="Charlie Brown"
            status="online"
          />
          <Avatar
            name="David Wilson"
            status="offline"
          />
          <Avatar
            name="Emma Davis"
            status="busy"
          />
          <Avatar
            name="Frank Miller"
            status="online"
          />
        </AvatarGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '团队成员展示的实际应用场景',
      },
    },
  },
}

// 加载状态
export const LoadingState: Story = {
  args: {
    loading: true,
    max: 5,
  },
  parameters: {
    docs: {
      description: {
        story: '显示加载状态时的占位符动画',
      },
    },
  },
}

// 禁用动画
export const NoAnimation: Story = {
  args: {
    animate: false,
    max: 5,
    children: (
      <>
        <Avatar name="John Doe" />
        <Avatar name="Jane Smith" />
        <Avatar name="Bob Johnson" />
        <Avatar name="Alice Williams" />
        <Avatar name="Charlie Brown" />
        <Avatar name="David Wilson" />
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '禁用动画以提升性能或满足设计需求',
      },
    },
  },
}

// 响应式示例
export const Responsive: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-4">移动端 maxItemsSm=3</h3>
        <AvatarGroup
          max={5}
          maxItemsSm={3}
          overflowTooltip={(count) => `还有 ${count} 位成员`}
        >
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
          <Avatar name="Alice Williams" />
          <Avatar name="Charlie Brown" />
          <Avatar name="David Wilson" />
          <Avatar name="Emma Davis" />
        </AvatarGroup>
        <p className="text-xs text-[var(--text-secondary)] mt-2">
          在小屏幕设备上将只显示 3 个头像
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持响应式配置，移动端可以显示不同数量的头像',
      },
    },
  },
}

// 聊天群组示例
export const ChatGroupExample: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="border border-[var(--border-primary)] rounded-lg p-4 max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">项目讨论组</h3>
          <span className="text-sm text-[var(--text-secondary)]">12 位成员</span>
        </div>
        <AvatarGroup
          max={5}
          size="sm"
          spacing="tight"
          overlap="stack"
          overflowTooltip={(count) => `还有 ${count} 位成员`}
          onOverflowClick={() => alert('显示所有成员')}
        >
          <Avatar name="John Doe" status="online" />
          <Avatar name="Jane Smith" status="busy" />
          <Avatar name="Bob Johnson" status="away" />
          <Avatar name="Alice Williams" status="online" />
          <Avatar name="Charlie Brown" status="offline" />
          <Avatar name="David Wilson" status="online" />
          <Avatar name="Emma Davis" status="busy" />
          <Avatar name="Frank Miller" status="away" />
          <Avatar name="Grace Lee" status="online" />
          <Avatar name="Henry Wang" status="offline" />
          <Avatar name="Ivy Chen" status="online" />
          <Avatar name="Jack Zhang" status="busy" />
        </AvatarGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '聊天群组头像的实际应用示例',
      },
    },
  },
}

// 所有变体组合
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-12">
      {/* 布局变体 */}
      <div>
        <h3 className="text-sm font-medium mb-4">布局 (Layout)</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-2">horizontal</p>
            <AvatarGroup layout="horizontal" max={4}>
              <Avatar name="User 1" />
              <Avatar name="User 2" />
              <Avatar name="User 3" />
              <Avatar name="User 4" />
            </AvatarGroup>
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-2">vertical</p>
            <AvatarGroup layout="vertical" max={4}>
              <Avatar name="User 1" />
              <Avatar name="User 2" />
              <Avatar name="User 3" />
              <Avatar name="User 4" />
            </AvatarGroup>
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-2">grid</p>
            <AvatarGroup layout="grid" max={6}>
              <Avatar name="User 1" />
              <Avatar name="User 2" />
              <Avatar name="User 3" />
              <Avatar name="User 4" />
              <Avatar name="User 5" />
              <Avatar name="User 6" />
            </AvatarGroup>
          </div>
        </div>
      </div>

      {/* 间距变体 */}
      <div>
        <h3 className="text-sm font-medium mb-4">间距 (Spacing)</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-2">tight</p>
            <AvatarGroup spacing="tight" max={4}>
              <Avatar name="User 1" />
              <Avatar name="User 2" />
              <Avatar name="User 3" />
              <Avatar name="User 4" />
            </AvatarGroup>
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-2">normal</p>
            <AvatarGroup spacing="normal" max={4}>
              <Avatar name="User 1" />
              <Avatar name="User 2" />
              <Avatar name="User 3" />
              <Avatar name="User 4" />
            </AvatarGroup>
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-2">loose</p>
            <AvatarGroup spacing="loose" max={4}>
              <Avatar name="User 1" />
              <Avatar name="User 2" />
              <Avatar name="User 3" />
              <Avatar name="User 4" />
            </AvatarGroup>
          </div>
        </div>
      </div>

      {/* 叠加变体 */}
      <div>
        <h3 className="text-sm font-medium mb-4">叠加 (Overlap)</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-2">stack</p>
            <AvatarGroup overlap="stack" max={5}>
              <Avatar name="User 1" />
              <Avatar name="User 2" />
              <Avatar name="User 3" />
              <Avatar name="User 4" />
              <Avatar name="User 5" />
            </AvatarGroup>
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-2">spread</p>
            <AvatarGroup overlap="spread" max={5}>
              <Avatar name="User 1" />
              <Avatar name="User 2" />
              <Avatar name="User 3" />
              <Avatar name="User 4" />
              <Avatar name="User 5" />
            </AvatarGroup>
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-2">none</p>
            <AvatarGroup overlap="none" max={5}>
              <Avatar name="User 1" />
              <Avatar name="User 2" />
              <Avatar name="User 3" />
              <Avatar name="User 4" />
              <Avatar name="User 5" />
            </AvatarGroup>
          </div>
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
