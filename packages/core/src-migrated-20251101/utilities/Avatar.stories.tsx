import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarGroup, AvatarWithPresence } from './Avatar'

const meta = {
  title: 'Utilities/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Avatar组件用于显示用户头像，支持图片、文本回退、状态指示和分组显示。'
      }
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

// 基础Avatar
export const Default: Story = {
  args: {
    fallback: 'John Doe'
  }
}

export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    alt: 'John Doe',
    fallback: 'John Doe'
  }
}

export const WithInitials: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar fallback="John Doe" />
      <Avatar fallback="Jane Smith" />
      <Avatar fallback="张三" />
      <Avatar fallback="李四" />
      <Avatar fallback="王五" />
    </div>
  )
}

// 尺寸变体
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="xs" fallback="XS" />
      <Avatar size="sm" fallback="SM" />
      <Avatar size="md" fallback="MD" />
      <Avatar size="lg" fallback="LG" />
      <Avatar size="xl" fallback="XL" />
      <Avatar size="2xl" fallback="2XL" />
    </div>
  )
}

// 颜色变体
export const Variants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar variant="default" fallback="Default" />
      <Avatar variant="primary" fallback="Primary" />
      <Avatar variant="secondary" fallback="Secondary" />
      <Avatar variant="success" fallback="Success" />
      <Avatar variant="warning" fallback="Warning" />
      <Avatar variant="error" fallback="Error" />
      <Avatar variant="info" fallback="Info" />
    </div>
  )
}

// 状态指示
export const WithStatus: Story = {
  render: () => (
    <div className="flex gap-4">
      <AvatarWithPresence
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
        fallback="John"
        presence="online"
        showPresence
      />
      <AvatarWithPresence
        fallback="Jane"
        presence="away"
        showPresence
      />
      <AvatarWithPresence
        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"
        fallback="Bob"
        presence="busy"
        showPresence
      />
      <AvatarWithPresence
        fallback="Alice"
        presence="offline"
        showPresence
      />
    </div>
  )
}

// AvatarGroup
export const Group: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">基本分组</h3>
        <AvatarGroup>
          <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" fallback="JD" />
          <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" fallback="JS" />
          <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" fallback="TW" />
          <Avatar src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face" fallback="EB" />
          <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&crop=face" fallback="MK" />
        </AvatarGroup>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">限制数量</h3>
        <AvatarGroup max={3}>
          <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" fallback="JD" />
          <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" fallback="JS" />
          <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" fallback="TW" />
          <Avatar src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face" fallback="EB" />
          <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&crop=face" fallback="MK" />
          <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" fallback="AB" />
        </AvatarGroup>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">带状态分组</h3>
        <AvatarGroup>
          <AvatarWithPresence
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
            fallback="JD"
            presence="online"
            showPresence
          />
          <AvatarWithPresence
            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"
            fallback="JS"
            presence="offline"
            showPresence
          />
          <AvatarWithPresence
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
            fallback="TW"
            presence="away"
            showPresence
          />
        </AvatarGroup>
      </div>
    </div>
  )
}

// 实际应用示例
export const UserProfile: Story = {
  render: () => (
    <div className="space-y-6 p-6 border rounded-lg max-w-md">
      <div className="flex items-center gap-4">
        <AvatarWithPresence
          size="xl"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
          fallback="John Doe"
          presence="online"
          showPresence
          variant="primary"
        />
        <div>
          <h2 className="text-xl font-semibold">John Doe</h2>
          <p className="text-gray-600">前端开发工程师</p>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status="online" />
            <span className="text-sm text-gray-500">在线</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">邮箱</span>
          <span>john.doe@example.com</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">部门</span>
          <Badge variant="primary" size="sm">技术部</Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">状态</span>
          <Badge variant="success" size="sm">活跃</Badge>
        </div>
      </div>
    </div>
  )
}

export const TeamMembers: Story = {
  render: () => (
    <div className="space-y-4 p-6 border rounded-lg max-w-md">
      <h3 className="text-lg font-semibold">项目团队成员</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AvatarWithPresence
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
              fallback="JD"
              presence="online"
              showPresence
            />
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-sm text-gray-600">项目经理</p>
            </div>
          </div>
          <Badge variant="primary" size="sm">Leader</Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AvatarWithPresence
              src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"
              fallback="JS"
              presence="online"
              showPresence
            />
            <div>
              <p className="font-medium">Jane Smith</p>
              <p className="text-sm text-gray-600">UI设计师</p>
            </div>
          </div>
          <Badge variant="secondary" size="sm">Design</Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AvatarWithPresence
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
              fallback="TW"
              presence="away"
              showPresence
            />
            <div>
              <p className="font-medium">Tom Wilson</p>
              <p className="text-sm text-gray-600">前端开发</p>
            </div>
          </div>
          <Badge variant="success" size="sm">Dev</Badge>
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">其他成员</span>
          <AvatarGroup max={5}>
            <Avatar src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face" fallback="EB" />
            <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&crop=face" fallback="MK" />
            <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" fallback="AB" />
            <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" fallback="CD" />
            <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" fallback="EF" />
          </AvatarGroup>
        </div>
      </div>
    </div>
  )
}