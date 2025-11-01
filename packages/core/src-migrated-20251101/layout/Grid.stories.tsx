import type { Meta, StoryObj } from '@storybook/react'
import { Grid } from './Grid'

const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    cols: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 'none', 'subgrid'],
      description: '网格列数',
    },
    rows: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6, 'none', 'subgrid'],
      description: '网格行数',
    },
    gap: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12],
      description: '网格间距',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    cols: 3,
    gap: 4,
    children: Array.from({ length: 9 }, (_, i) => (
      <div
        key={i}
        className="bg-gradient-to-br from-blue-400 to-purple-600 text-white p-4 rounded-lg shadow-md flex items-center justify-center font-semibold"
      >
        {i + 1}
      </div>
    )),
  },
}

export const TwoColumns: Story = {
  args: {
    cols: 2,
    gap: 6,
    children: [
      <div key="1" className="bg-blue-500 text-white p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">第一列</h3>
        <p className="text-blue-100">主要内容区域</p>
      </div>,
      <div key="2" className="bg-green-500 text-white p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">第二列</h3>
        <p className="text-green-100">侧边栏内容</p>
      </div>,
    ],
  },
}

export const FourColumns: Story = {
  args: {
    cols: 4,
    gap: 4,
    children: Array.from({ length: 8 }, (_, i) => (
      <div
        key={i}
        className="bg-gradient-to-br from-indigo-400 to-purple-600 text-white p-4 rounded-lg shadow-md"
      >
        <h4 className="font-semibold mb-1">卡片 {i + 1}</h4>
        <p className="text-sm opacity-90">网格布局示例</p>
      </div>
    )),
  },
}

export const ResponsiveGrid: Story = {
  args: {
    cols: 1,
    gap: 6,
    className: 'bg-gray-50 p-6 rounded-xl',
    children: Array.from({ length: 6 }, (_, i) => (
      <div
        key={i}
        className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
      >
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mr-3"></div>
          <h3 className="text-lg font-semibold">项目 {i + 1}</h3>
        </div>
        <p className="text-gray-600 mb-3">这是一个响应式网格项目，在不同屏幕尺寸下会自动调整布局。</p>
        <div className="flex gap-2">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">标签 1</span>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">标签 2</span>
        </div>
      </div>
    )),
  },
}

export const ComplexLayout: Story = {
  args: {
    cols: 12,
    gap: 4,
    className: 'min-h-96 bg-gray-100 p-4 rounded-lg',
    children: [
      // 头部
      <div key="header" className="col-span-12 bg-blue-500 text-white p-4 rounded-lg mb-4">
        <h2 className="text-xl font-bold">页面头部 (12列)</h2>
      </div>,
      // 侧边栏
      <div key="sidebar" className="col-span-3 bg-purple-500 text-white p-4 rounded-lg">
        <h3 className="font-semibold mb-2">侧边栏 (3列)</h3>
        <div className="space-y-2 text-sm">
          <div className="bg-white/20 p-2 rounded">导航项 1</div>
          <div className="bg-white/20 p-2 rounded">导航项 2</div>
          <div className="bg-white/20 p-2 rounded">导航项 3</div>
        </div>
      </div>,
      // 主内容
      <div key="main" className="col-span-6 bg-green-500 text-white p-4 rounded-lg">
        <h3 className="font-semibold mb-2">主内容 (6列)</h3>
        <p className="text-sm mb-3">这是主要内容区域，占据6列宽度。</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/20 p-2 rounded text-xs">子内容 1</div>
          <div className="bg-white/20 p-2 rounded text-xs">子内容 2</div>
        </div>
      </div>,
      // 右侧栏
      <div key="aside" className="col-span-3 bg-orange-500 text-white p-4 rounded-lg">
        <h3 className="font-semibold mb-2">右侧栏 (3列)</h3>
        <div className="space-y-2 text-sm">
          <div className="bg-white/20 p-2 rounded">广告位 1</div>
          <div className="bg-white/20 p-2 rounded">广告位 2</div>
        </div>
      </div>,
      // 底部
      <div key="footer" className="col-span-12 bg-gray-700 text-white p-4 rounded-lg mt-4">
        <h3 className="font-semibold">页面底部 (12列)</h3>
      </div>,
    ],
  },
}

export const DifferentGaps: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">不同间距示例</h3>
        <div className="space-y-6">
          {[0, 2, 4, 6, 8].map((gap) => (
            <div key={gap} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Gap: {gap}</h4>
              <Grid cols={4} gap={gap}>
                {Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-blue-400 to-purple-600 text-white p-3 rounded text-sm font-medium"
                  >
                    项目 {i + 1}
                  </div>
                ))}
              </Grid>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">所有列数变体</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 6].map((cols) => (
            <div key={cols} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Columns: {cols}</h4>
              <Grid cols={cols} gap={2}>
                {Array.from({ length: cols * 2 }, (_, i) => (
                  <div
                    key={i}
                    className="bg-blue-500 text-white p-2 rounded text-xs text-center"
                  >
                    {i + 1}
                  </div>
                ))}
              </Grid>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}