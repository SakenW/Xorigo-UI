import type { Meta, StoryObj } from '@storybook/react'
import { Container } from './Container'

const meta: Meta<typeof Container> = {
  title: 'Layout/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', 'full', 'fluid'],
      description: '容器最大宽度',
    },
    center: {
      control: 'boolean',
      description: '是否居中显示',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <div className="bg-gray-100 p-8 rounded-lg">
        <h2 className="text-xl font-bold mb-4">默认容器</h2>
        <p className="text-gray-600">这是一个默认大小的容器 (lg)</p>
      </div>
    ),
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: (
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold mb-2">小容器</h3>
        <p className="text-blue-700">max-w-screen-sm (640px)</p>
      </div>
    ),
  },
}

export const Large: Story = {
  args: {
    size: 'xl',
    children: (
      <div className="bg-green-50 p-8 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold mb-2">大容器</h3>
        <p className="text-green-700">max-w-screen-xl (1280px)</p>
      </div>
    ),
  },
}

export const Fluid: Story = {
  args: {
    size: 'fluid',
    center: false,
    children: (
      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold mb-2">流体容器</h3>
        <p className="text-purple-700">无最大宽度限制，不居中</p>
      </div>
    ),
  },
}

export const FullWidth: Story = {
  args: {
    size: 'full',
    children: (
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h3 className="text-lg font-semibold mb-2">全宽容器</h3>
        <p className="text-red-700">max-w-full (100vw)</p>
      </div>
    ),
  },
}

export const ResponsiveSizes: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-semibold mb-2">响应式容器</h4>
          <p className="text-yellow-700 text-sm">
            容器会根据屏幕尺寸自动调整内边距：<br />
            • 移动端: px-4<br />
            • 平板: px-6<br />
            • 桌面: px-8
          </p>
        </div>
      </div>
    ),
  },
}

export const CustomContent: Story = {
  args: {
    size: 'lg',
    children: (
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">自定义内容示例</h2>
        <p className="mb-4">容器可以包含任何内容，包括复杂的布局和样式。</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
            <h5 className="font-semibold mb-2">特性 1</h5>
            <p className="text-sm">响应式设计</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
            <h5 className="font-semibold mb-2">特性 2</h5>
            <p className="text-sm">灵活布局</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
            <h5 className="font-semibold mb-2">特性 3</h5>
            <p className="text-sm">易于定制</p>
          </div>
        </div>
      </div>
    ),
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">所有尺寸变体</h3>
        <div className="space-y-4">
          {(['sm', 'md', 'lg', 'xl', '2xl', 'full', 'fluid'] as const).map((size) => (
            <Container key={size} size={size} className="mb-4">
              <div className="bg-gray-50 p-4 rounded border">
                <h4 className="font-medium">Size: {size}</h4>
                <p className="text-sm text-gray-600">容器大小演示</p>
              </div>
            </Container>
          ))}
        </div>
      </div>
    </div>
  ),
}