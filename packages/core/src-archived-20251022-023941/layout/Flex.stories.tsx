import type { Meta, StoryObj } from '@storybook/react'
import { Flex } from './Flex'

const meta: Meta<typeof Flex> = {
  title: 'Layout/Flex',
  component: Flex,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['row', 'col', 'row-reverse', 'col-reverse'],
      description: 'Flex 方向',
    },
    wrap: {
      control: 'select',
      options: ['nowrap', 'wrap', 'wrap-reverse'],
      description: 'Flex 换行',
    },
    justify: {
      control: 'select',
      options: ['start', 'end', 'center', 'between', 'around', 'evenly'],
      description: '主轴对齐',
    },
    align: {
      control: 'select',
      options: ['start', 'end', 'center', 'baseline', 'stretch'],
      description: '交叉轴对齐',
    },
    gap: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12],
      description: '间距',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: [
      <div key="1" className="bg-blue-500 text-white p-4 rounded">Item 1</div>,
      <div key="2" className="bg-green-500 text-white p-4 rounded">Item 2</div>,
      <div key="3" className="bg-purple-500 text-white p-4 rounded">Item 3</div>,
    ],
  },
}

export const Column: Story = {
  args: {
    direction: 'col',
    gap: 4,
    children: [
      <div key="1" className="bg-blue-500 text-white p-4 rounded">Item 1</div>,
      <div key="2" className="bg-green-500 text-white p-4 rounded">Item 2</div>,
      <div key="3" className="bg-purple-500 text-white p-4 rounded">Item 3</div>,
    ],
  },
}

export const Center: Story = {
  args: {
    justify: 'center',
    align: 'center',
    className: 'h-64 bg-gray-100',
    children: [
      <div key="1" className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">居中项目</div>,
    ],
  },
}

export const SpaceBetween: Story = {
  args: {
    justify: 'between',
    className: 'bg-gray-50 p-4 rounded-lg',
    children: [
      <div key="1" className="bg-blue-500 text-white p-4 rounded">左侧项目</div>,
      <div key="2" className="bg-green-500 text-white p-4 rounded">中间项目</div>,
      <div key="3" className="bg-purple-500 text-white p-4 rounded">右侧项目</div>,
    ],
  },
}

export const Wrap: Story = {
  args: {
    wrap: 'wrap',
    gap: 4,
    children: Array.from({ length: 8 }, (_, i) => (
      <div
        key={i}
        className="bg-gradient-to-br from-blue-400 to-purple-600 text-white p-4 rounded-lg shadow-md"
      >
        Item {i + 1}
      </div>
    )),
  },
}

export const AlignEnd: Story = {
  args: {
    align: 'end',
    gap: 4,
    className: 'h-32 bg-gray-100',
    children: [
      <div key="1" className="bg-blue-500 text-white p-2 rounded">小项目</div>,
      <div key="2" className="bg-green-500 text-white p-6 rounded-lg">大项目</div>,
      <div key="3" className="bg-purple-500 text-white p-4 rounded">中项目</div>,
    ],
  },
}

export const ResponsiveFlex: Story = {
  args: {
    direction: 'col',
    justify: 'center',
    align: 'center',
    gap: 6,
    className: 'min-h-64 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl',
    children: [
      <div key="1" className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-2">响应式卡片 1</h3>
        <p className="text-gray-600">移动端垂直排列</p>
      </div>,
      <div key="2" className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-2">响应式卡片 2</h3>
        <p className="text-gray-600">桌面端水平排列</p>
      </div>,
      <div key="3" className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-2">响应式卡片 3</h3>
        <p className="text-gray-600">灵活适配各种屏幕</p>
      </div>,
    ],
  },
}

export const NavigationExample: Story = {
  args: {
    justify: 'between',
    align: 'center',
    className: 'bg-white shadow-md p-4 rounded-lg',
    children: [
      <div key="1" className="text-xl font-bold text-gray-800">Logo</div>,
      <div key="2" className="flex gap-6">
        <span className="text-gray-600 hover:text-blue-600 cursor-pointer">首页</span>
        <span className="text-gray-600 hover:text-blue-600 cursor-pointer">产品</span>
        <span className="text-gray-600 hover:text-blue-600 cursor-pointer">关于</span>
      </div>,
      <div key="3" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
        登录
      </div>,
    ],
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">方向变体</h3>
        <div className="space-y-4">
          {(['row', 'col', 'row-reverse', 'col-reverse'] as const).map((direction) => (
            <div key={direction} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Direction: {direction}</h4>
              <Flex direction={direction} gap={2}>
                <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm">A</div>
                <div className="bg-green-500 text-white px-3 py-1 rounded text-sm">B</div>
                <div className="bg-purple-500 text-white px-3 py-1 rounded text-sm">C</div>
              </Flex>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">对齐变体</h3>
        <div className="space-y-4">
          {(['start', 'center', 'end', 'between', 'around', 'evenly'] as const).map((justify) => (
            <div key={justify} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Justify: {justify}</h4>
              <Flex justify={justify} gap={2}>
                <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm">A</div>
                <div className="bg-green-500 text-white px-3 py-1 rounded text-sm">B</div>
                <div className="bg-purple-500 text-white px-3 py-1 rounded text-sm">C</div>
              </Flex>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}