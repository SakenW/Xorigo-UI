import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'

const meta = {
  title: 'Data Display/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Badge（徽章）组件用于显示状态、标签、通知等小型信息。支持多种颜色、尺寸、变体和特殊样式。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'soft', 'ghost', 'gradient', 'glow'],
      description: '徽章的变体样式',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'gray', 'neon'],
      description: '徽章的颜色主题',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '徽章的尺寸',
    },
    shape: {
      control: 'select',
      options: ['rounded', 'pill', 'square'],
      description: '徽章的形状',
    },
    dot: {
      control: 'boolean',
      description: '是否显示为点形徽章',
    },
    count: {
      control: 'number',
      description: '显示的数字',
    },
    max: {
      control: 'number',
      description: '数字徽章的最大显示值',
    },
    closable: {
      control: 'boolean',
      description: '是否可关闭',
    },
    pulse: {
      control: 'boolean',
      description: '是否显示脉冲动画',
    },
    elevated: {
      control: 'boolean',
      description: '是否显示阴影',
    },
    status: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info', 'neutral'],
      description: '徽章的状态（用于无障碍访问）',
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

// ============= 基础示例 =============

export const Default: Story = {
  args: {
    children: 'Badge',
  },
}

// ============= 颜色变体 =============

export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge color="primary">Primary</Badge>
      <Badge color="secondary">Secondary</Badge>
      <Badge color="success">Success</Badge>
      <Badge color="warning">Warning</Badge>
      <Badge color="error">Error</Badge>
      <Badge color="info">Info</Badge>
      <Badge color="gray">Gray</Badge>
      <Badge color="neon">Neon</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持8种预定义颜色主题，基于语义化设计令牌实现。',
      },
    },
  },
}

// ============= 尺寸变体 =============

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Badge size="xs">Extra Small</Badge>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
      <Badge size="xl">Extra Large</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持5种尺寸：xs、sm、md、lg、xl，适用于不同场景。',
      },
    },
  },
}

// ============= 样式变体 =============

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge variant="solid">Solid</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="soft">Soft</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="gradient">Gradient</Badge>
      <Badge variant="glow">Glow</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '6种视觉变体：实心、描边、柔和、轮廓、渐变、发光。',
      },
    },
  },
}

// ============= 形状变体 =============

export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge shape="rounded">Rounded</Badge>
      <Badge shape="pill">Pill</Badge>
      <Badge shape="square">Square</Badge>
    </div>
  ),
}

// ============= 数字徽章 =============

export const CountBadge: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <Badge count={5}>5</Badge>
        <span className="text-sm text-gray-600">通知数量</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge count={99}>99</Badge>
        <span className="text-sm text-gray-600">高数量</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge count={150} max={100}>100+</Badge>
        <span className="text-sm text-gray-600">溢出处理</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '数字徽章支持溢出处理，自动将超过max值的数字转换为"max+"格式。',
      },
    },
  },
}

// ============= 点形徽章 =============

export const DotBadge: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="w-6 h-6 bg-gray-200 rounded"></div>
        <Badge dot color="success" className="absolute -top-1 -right-1" />
      </div>
      <div className="flex items-center gap-2">
        <Badge dot color="error" />
        <span className="text-sm text-gray-600">状态指示器</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge dot size="sm" color="warning" />
        <Badge dot size="md" color="info" />
        <Badge dot size="lg" color="success" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '点形徽章用于状态指示，支持不同尺寸和颜色。',
      },
    },
  },
}

// ============= 可关闭徽章 =============

export const ClosableBadge: Story = {
  render: () => {
    return (
      <div className="flex flex-wrap gap-4">
        <Badge closable onClose={() => alert('关闭徽章')}>
          可关闭徽章
        </Badge>
        <Badge color="success" count={3} closable onClose={() => alert('关闭数量徽章')}>
          3
        </Badge>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '支持可关闭徽章，点击关闭按钮触发回调函数。',
      },
    },
  },
}

// ============= 图标徽章 =============

export const WithIcon: Story = {
  render: () => {
    const StarIcon = (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 12.027l-4.188 2.2 0.8-4.66L1.24 6.773l4.694-0.682L8 1.8l2.066 4.291 4.694 0.682-3.372 2.794 0.8 4.66z" />
      </svg>
    )

    const AlertIcon = (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0L16 14H0L8 0zM7 11h2v2H7v-2zm0-8h2v6H7V3z" />
      </svg>
    )

    return (
      <div className="flex flex-wrap gap-4">
        <Badge icon={StarIcon}>收藏</Badge>
        <Badge icon={StarIcon} color="warning" variant="outline">
          推荐
        </Badge>
        <Badge icon={AlertIcon} color="error" variant="soft">
          警告
        </Badge>
        <Badge icon={StarIcon} />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '支持自定义图标，可与文字、数字组合使用。',
      },
    },
  },
}

// ============= 悬浮提示 =============

export const WithTitle: Story = {
  args: {
    children: '悬浮提示',
    title: '这是悬浮提示的详细内容',
  },
  parameters: {
    docs: {
      description: {
        story: '通过title属性为徽章添加悬浮提示信息。',
      },
    },
  },
}

// ============= 状态徽章 =============

export const StatusBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Badge status="success">成功</Badge>
        <Badge status="warning">警告</Badge>
        <Badge status="error">错误</Badge>
        <Badge status="info">信息</Badge>
        <Badge status="neutral">中性</Badge>
      </div>
      <p className="text-sm text-gray-600">
        状态徽章会自动添加适当的ARIA标签，提高可访问性。
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '状态徽章用于表示系统状态，自动生成语义化的aria-label。',
      },
    },
  },
}

// ============= 动画徽章 =============

export const AnimatedBadge: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge pulse color="error">新消息</Badge>
      <Badge pulse color="warning" variant="glow">
        实时通知
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持脉冲动画(pulse)，用于吸引用户注意。',
      },
    },
  },
}

// ============= 阴影徽章 =============

export const ElevatedBadge: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge elevated>带阴影</Badge>
      <Badge elevated color="primary" variant="gradient">
        渐变阴影
      </Badge>
    </div>
  ),
}

// ============= 组合使用 =============

export const ComplexExample: Story = {
  render: () => {
    const CheckIcon = (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M6.5 12.5L2.5 8.5l1.414-1.414L6.5 9.672l6.086-6.086L14 5l-7.5 7.5z" />
      </svg>
    )

    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-3">通知列表</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">系统消息</span>
              <Badge count={3} color="primary" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">任务提醒</span>
              <Badge count={1} color="warning" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">审批通知</span>
              <Badge count={5} color="info" />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">状态指示</h4>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge dot color="success" />
              <span className="text-sm text-gray-600">在线</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge dot color="error" />
              <span className="text-sm text-gray-600">离线</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge dot color="warning" pulse />
              <span className="text-sm text-gray-600">忙碌</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">标签分类</h4>
          <div className="flex flex-wrap gap-2">
            <Badge color="primary" variant="soft">React</Badge>
            <Badge color="success" variant="soft">TypeScript</Badge>
            <Badge color="info" variant="soft">UI组件</Badge>
            <Badge color="warning" variant="soft">开发中</Badge>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">评分展示</h4>
          <div className="flex items-center gap-2">
            <Badge icon={<CheckIcon />} color="success" variant="outline">
              已验证
            </Badge>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '综合使用示例：通知列表、状态指示、标签分类和评分展示。',
      },
    },
  },
}

// ============= 响应式示例 =============

export const Responsive: Story = {
  render: () => (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <Badge size="sm" color="primary">移动端</Badge>
        <Badge size="md" color="success">响应式</Badge>
        <Badge size="lg" color="info">设计</Badge>
      </div>
      <div className="flex items-center gap-2">
        <Badge count={99} />
        <Badge count={150} max={99} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '响应式设计示例，在不同屏幕尺寸下自适应布局。',
      },
    },
  },
}
