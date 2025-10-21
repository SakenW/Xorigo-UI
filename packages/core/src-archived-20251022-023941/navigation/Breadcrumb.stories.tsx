import type { Meta, StoryObj } from '@storybook/react'
import { Breadcrumb } from './Breadcrumb'

const meta = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Breadcrumb组件用于显示用户在网站中的当前位置，并提供导航功能。'
      }
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

// 基础Breadcrumb
export const Default: Story = {
  args: {
    items: [
      { label: '首页', href: '/' },
      { label: '产品', href: '/products' },
      { label: '详情', active: true }
    ]
  }
}

export const WithoutHome: Story = {
  args: {
    items: [
      { label: '产品', href: '/products' },
      { label: '分类', href: '/products/category' },
      { label: '详情', active: true }
    ]
  }
}

// 不同变体
export const Underline: Story = {
  args: {
    variant: 'underline',
    items: [
      { label: '首页', href: '/' },
      { label: '设置', href: '/settings' },
      { label: '个人资料', active: true }
    ]
  }
}

export const Pipe: Story = {
  args: {
    variant: 'pipe',
    items: [
      { label: '首页', href: '/' },
      { label: '文档', href: '/docs' },
      { label: '组件', href: '/docs/components' },
      { label: 'Breadcrumb', active: true }
    ]
  }
}

// 尺寸变体
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">小尺寸</h4>
        <Breadcrumb
          size="sm"
          items={[
            { label: '首页', href: '/' },
            { label: '产品', href: '/products' },
            { label: '详情', active: true }
          ]}
        />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">中等尺寸</h4>
        <Breadcrumb
          size="md"
          items={[
            { label: '首页', href: '/' },
            { label: '产品', href: '/products' },
            { label: '详情', active: true }
          ]}
        />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">大尺寸</h4>
        <Breadcrumb
          size="lg"
          items={[
            { label: '首页', href: '/' },
            { label: '产品', href: '/products' },
            { label: '详情', active: true }
          ]}
        />
      </div>
    </div>
  )
}

// 自定义分隔符
export const CustomSeparator: Story = {
  args: {
    separator: '→',
    items: [
      { label: '首页', href: '/' },
      { label: '产品', href: '/products' },
      { label: '详情', active: true }
    ]
  }
}

export const IconSeparator: Story = {
  args: {
    separator: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    ),
    items: [
      { label: '首页', href: '/' },
      { label: '产品', href: '/products' },
      { label: '详情', active: true }
    ]
  }
}

// 首页图标
export const WithHomeIcon: Story = {
  args: {
    showHomeIcon: true,
    homeIcon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
    items: [
      { label: '首页', href: '/' },
      { label: '产品', href: '/products' },
      { label: '详情', active: true }
    ]
  }
}

// 长路径处理
export const LongPath: Story = {
  args: {
    maxItems: 4,
    items: [
      { label: '首页', href: '/' },
      { label: '产品分类', href: '/products' },
      { label: '电子产品', href: '/products/electronics' },
      { label: '手机', href: '/products/electronics/phones' },
      { label: '智能手机', href: '/products/electronics/phones/smartphones' },
      { label: 'iPhone', href: '/products/electronics/phones/smartphones/iphone' },
      { label: 'iPhone 15', active: true }
    ]
  }
}

// 点击处理
export const Clickable: Story = {
  args: {
    items: [
      { label: '首页', onClick: () => alert('点击了首页') },
      { label: '产品', onClick: () => alert('点击了产品') },
      { label: '详情', active: true }
    ]
  }
}

// 实际应用示例
export const ECommerce: Story = {
  render: () => (
    <div className="space-y-6 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">电商网站导航</h3>
      <Breadcrumb
        showHomeIcon={true}
        homeIcon={
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        }
        items={[
          { label: '首页', href: '/' },
          { label: '所有分类', href: '/categories' },
          { label: '电子产品', href: '/categories/electronics' },
          { label: '智能手机', href: '/categories/electronics/smartphones' },
          { label: 'iPhone 15 Pro', active: true }
        ]}
      />

      <div className="mt-6">
        <h3 className="text-lg font-semibold">文档网站导航</h3>
        <Breadcrumb
          variant="underline"
          items={[
            { label: '文档', href: '/docs' },
            { label: '组件', href: '/docs/components' },
            { label: '导航组件', href: '/docs/components/navigation' },
            { label: 'Breadcrumb', active: true }
          ]}
        />
      </div>
    </div>
  )
}

export const AdminPanel: Story = {
  render: () => (
    <div className="space-y-6 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">管理后台导航</h3>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">用户管理</h4>
          <Breadcrumb
            variant="pipe"
            items={[
              { label: '系统管理', href: '/admin' },
              { label: '用户管理', href: '/admin/users' },
              { label: '编辑用户', active: true }
            ]}
          />
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">订单管理</h4>
          <Breadcrumb
            variant="pipe"
            items={[
              { label: '订单管理', href: '/admin/orders' },
              { label: '订单详情', href: '/admin/orders/12345' },
              { label: '物流信息', active: true }
            ]}
          />
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">报表分析</h4>
          <Breadcrumb
            variant="pipe"
            maxItems={3}
            items={[
              { label: '数据分析', href: '/admin/analytics' },
              { label: '销售报表', href: '/admin/analytics/sales' },
              { label: '月度报表', href: '/admin/analytics/sales/monthly' },
              { label: '2024年10月', href: '/admin/analytics/sales/monthly/2024-10' },
              { label: '详细数据', active: true }
            ]}
          />
        </div>
      </div>
    </div>
  )
}