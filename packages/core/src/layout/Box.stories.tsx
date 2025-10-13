import type { Meta, StoryObj } from '@storybook/react'
import { Box } from './Box'

const meta: Meta<typeof Box> = {
  title: 'Layout/Box',
  component: Box,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    display: {
      control: 'select',
      options: ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'hidden'],
      description: '显示类型',
    },
    padding: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12],
      description: '内边距',
    },
    margin: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 'auto'],
      description: '外边距',
    },
    borderRadius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'],
      description: '圆角',
    },
    backgroundColor: {
      control: 'select',
      options: ['transparent', 'current', 'primary', 'secondary', 'success', 'warning', 'error', 'gray', 'white', 'black'],
      description: '背景颜色',
    },
    border: {
      control: 'select',
      options: [0, 1, 2, 4, 8],
      description: '边框宽度',
    },
    borderColor: {
      control: 'select',
      options: ['transparent', 'current', 'primary', 'secondary', 'success', 'warning', 'error', 'gray', 'white', 'black'],
      description: '边框颜色',
    },
    shadow: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'inner'],
      description: '阴影',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <div className="text-center">基础 Box 组件</div>,
    padding: 4,
    backgroundColor: 'gray',
  },
}

export const Card: Story = {
  args: {
    padding: 6,
    margin: 4,
    borderRadius: 'lg',
    backgroundColor: 'white',
    border: 1,
    borderColor: 'gray',
    shadow: 'md',
    children: (
      <div>
        <h3 className="text-lg font-semibold mb-2">卡片标题</h3>
        <p className="text-gray-600">这是一个使用 Box 组件构建的卡片布局示例。</p>
      </div>
    ),
  },
}

export const Button: Story = {
  args: {
    display: 'inline-block',
    padding: 3,
    margin: 2,
    borderRadius: 'md',
    backgroundColor: 'primary',
    shadow: 'md',
    children: <span className="text-white font-medium">按钮样式</span>,
  },
}

export const Alert: Story = {
  args: {
    padding: 4,
    margin: 2,
    borderRadius: 'md',
    backgroundColor: 'warning',
    border: 1,
    borderColor: 'warning',
    children: (
      <div className="flex items-center">
        <span className="text-yellow-800 font-medium">⚠️ 警告</span>
        <span className="text-yellow-700 ml-2">这是一个警告信息</span>
      </div>
    ),
  },
}

export const FlexContainer: Story = {
  args: {
    display: 'flex',
    padding: 4,
    backgroundColor: 'gray',
    borderRadius: 'lg',
    children: [
      <div key="1" className="bg-blue-500 text-white px-3 py-1 rounded mr-2">项目 1</div>,
      <div key="2" className="bg-green-500 text-white px-3 py-1 rounded mr-2">项目 2</div>,
      <div key="3" className="bg-purple-500 text-white px-3 py-1 rounded">项目 3</div>,
    ],
  },
}

export const GridLayout: Story = {
  args: {
    display: 'grid',
    padding: 6,
    backgroundColor: 'gray',
    borderRadius: 'lg',
    className: 'grid-cols-3 gap-4',
    children: Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="bg-white p-3 rounded text-center text-sm">
        网格项目 {i + 1}
      </div>
    )),
  },
}

export const Avatar: Story = {
  args: {
    width: '100px',
    height: '100px',
    borderRadius: 'full',
    backgroundColor: 'primary',
    display: 'flex',
    className: 'items-center justify-center',
    children: (
      <span className="text-white text-2xl font-bold">JD</span>
    ),
  },
}

export const Badge: Story = {
  args: {
    display: 'inline-block',
    padding: 1,
    borderRadius: 'full',
    backgroundColor: 'success',
    children: (
      <span className="text-green-700 text-xs font-medium px-2">新功能</span>
    ),
  },
}

export const Modal: Story = {
  args: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 'xl',
    border: 1,
    borderColor: 'gray',
    shadow: '2xl',
    className: 'z-50',
    children: (
      <div className="max-w-md">
        <h2 className="text-xl font-bold mb-4">模态框标题</h2>
        <p className="text-gray-600 mb-6">这是一个模态框内容示例，使用 Box 组件构建。</p>
        <div className="flex justify-end gap-3">
          <Box
            display="inline-block"
            padding={2}
            borderRadius="md"
            backgroundColor="gray"
            className="cursor-pointer"
          >
            取消
          </Box>
          <Box
            display="inline-block"
            padding={2}
            borderRadius="md"
            backgroundColor="primary"
            className="cursor-pointer"
          >
            <span className="text-white">确认</span>
          </Box>
        </div>
      </div>
    ),
  },
}

export const Sidebar: Story = {
  args: {
    width: '250px',
    minHeight: '400px',
    padding: 6,
    backgroundColor: 'gray',
    borderRadius: 'lg',
    children: (
      <div className="space-y-4">
        <div className="text-lg font-semibold">侧边栏</div>
        <div className="space-y-2">
          <Box padding={3} borderRadius="md" backgroundColor="white" className="cursor-pointer hover:bg-gray-50">
            🏠 首页
          </Box>
          <Box padding={3} borderRadius="md" backgroundColor="white" className="cursor-pointer hover:bg-gray-50">
            📊 仪表板
          </Box>
          <Box padding={3} borderRadius="md" backgroundColor="white" className="cursor-pointer hover:bg-gray-50">
            ⚙️ 设置
          </Box>
        </div>
      </div>
    ),
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">基础样式变体</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['none', 'sm', 'md', 'lg'] as const).map((radius) => (
            <Box key={radius} borderRadius={radius} padding={4} backgroundColor="gray" className="text-center">
              <div className="mb-2 font-medium">BorderRadius: {radius}</div>
              <div className="text-sm text-gray-600">圆角示例</div>
            </Box>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">阴影变体</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((shadow) => (
            <Box key={shadow} shadow={shadow} padding={4} backgroundColor="white" borderRadius="lg" className="text-center">
              <div className="mb-2 font-medium">Shadow: {shadow}</div>
              <div className="text-sm text-gray-600">阴影示例</div>
            </Box>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">背景色变体</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {(['white', 'gray', 'primary', 'success', 'warning'] as const).map((color) => (
            <Box key={color} backgroundColor={color} padding={4} borderRadius="lg" className="text-center">
              <div className="mb-2 font-medium">Bg: {color}</div>
              <div className={`text-sm ${color === 'white' ? 'text-gray-700' : 'text-white'}`}>背景色示例</div>
            </Box>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">显示类型变体</h3>
        <div className="space-y-4">
          {(['block', 'inline-block', 'flex', 'grid'] as const).map((display) => (
            <div key={display} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Display: {display}</h4>
              <Box display={display} backgroundColor="blue" padding={3} borderRadius="md" className="text-white">
                {display === 'block' && <div>块级元素，占据整行</div>}
                {display === 'inline-block' && <div>行内块元素，可设置宽高</div>}
                {display === 'flex' && (
                  <div className="flex gap-2">
                    <span className="bg-white/20 px-2 py-1 rounded">Flex 项目 1</span>
                    <span className="bg-white/20 px-2 py-1 rounded">Flex 项目 2</span>
                  </div>
                )}
                {display === 'grid' && (
                  <div className="grid grid-cols-2 gap-2">
                    <span className="bg-white/20 px-2 py-1 rounded text-center">网格 1</span>
                    <span className="bg-white/20 px-2 py-1 rounded text-center">网格 2</span>
                  </div>
                )}
              </Box>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}