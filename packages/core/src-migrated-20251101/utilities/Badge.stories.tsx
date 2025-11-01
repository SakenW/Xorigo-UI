import type { Meta, StoryObj } from '@storybook/react'
import { Badge, StatusBadge, CountBadge, NewBadge, FeaturedBadge } from './Badge'

const meta = {
  title: 'Utilities/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Badge组件用于显示状态、计数或分类信息。支持多种变体、尺寸和专用类型。'
      }
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

// 基础Badge
export const Default: Story = {
  args: {
    children: 'Default Badge'
  }
}

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary'
  }
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success'
  }
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning'
  }
}

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'Error'
  }
}

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info'
  }
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline'
  }
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive'
  }
}

// 尺寸变体
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">XS:</span>
        <Badge size="xs">Extra Small</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">SM:</span>
        <Badge size="sm">Small</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">MD:</span>
        <Badge size="md">Medium</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">LG:</span>
        <Badge size="lg">Large</Badge>
      </div>
    </div>
  )
}

// 点状Badge
export const Dots: Story = {
  render: () => (
    <div className="flex gap-4">
      <StatusBadge status="online" />
      <StatusBadge status="offline" />
      <StatusBadge status="away" />
      <StatusBadge status="busy" />
    </div>
  )
}

// 计数Badge
export const CountBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            📧
          </div>
          <CountBadge value={5} />
        </div>
        <div className="relative">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            🔔
          </div>
          <CountBadge value={99} />
        </div>
        <div className="relative">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            💬
          </div>
          <CountBadge value={156} max={99} />
        </div>
        <div className="relative">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            📱
          </div>
          <CountBadge value={0} showZero />
        </div>
      </div>
    </div>
  )
}

// 特殊Badge
export const SpecialBadges: Story = {
  render: () => (
    <div className="flex gap-4">
      <NewBadge />
      <FeaturedBadge />
      <Badge variant="success">✓ Verified</Badge>
      <Badge variant="warning">⚠ Beta</Badge>
      <Badge variant="error">🚨 Critical</Badge>
    </div>
  )
}

// 组合示例
export const StatusList: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">用户状态</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 border rounded">
          <span>张三</span>
          <div className="flex items-center gap-2">
            <StatusBadge status="online" />
            <Badge variant="success" size="sm">在线</Badge>
          </div>
        </div>
        <div className="flex items-center justify-between p-2 border rounded">
          <span>李四</span>
          <div className="flex items-center gap-2">
            <StatusBadge status="away" />
            <Badge variant="warning" size="sm">离开</Badge>
          </div>
        </div>
        <div className="flex items-center justify-between p-2 border rounded">
          <span>王五</span>
          <div className="flex items-center gap-2">
            <StatusBadge status="busy" />
            <Badge variant="error" size="sm">忙碌</Badge>
          </div>
        </div>
        <div className="flex items-center justify-between p-2 border rounded">
          <span>赵六</span>
          <div className="flex items-center gap-2">
            <StatusBadge status="offline" />
            <Badge variant="secondary" size="sm">离线</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ProductTags: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">产品标签</h3>
      <div className="flex flex-wrap gap-2">
        <Badge variant="primary">前端开发</Badge>
        <Badge variant="secondary">UI设计</Badge>
        <Badge variant="outline">React</Badge>
        <Badge variant="success">TypeScript</Badge>
        <Badge variant="warning">Beta</Badge>
        <NewBadge />
        <FeaturedBadge />
      </div>
    </div>
  )
}