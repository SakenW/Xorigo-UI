import type { Meta, StoryObj } from '@storybook/react'
import { ColorPicker } from './ColorPicker'

const meta: Meta<typeof ColorPicker> = {
  title: 'primitives/ColorPicker',
  component: ColorPicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValue: '#FF6B6B',
  },
}

export const Minimal: Story = {
  args: {
    variant: 'minimal',
    defaultValue: '#4ECDC4',
  },
}

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    defaultValue: '#45B7D1',
  },
}

export const WithAlpha: Story = {
  args: {
    showAlpha: true,
    defaultValue: '#FF6B6B',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    defaultValue: '#95E77E',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    defaultValue: '#A78BFA',
  },
}

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    defaultValue: '#F472B6',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: '#9CA3AF',
  },
}

export const CustomPresetColors: Story = {
  args: {
    presetColors: [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#F8B739'
    ],
    defaultValue: '#4ECDC4',
  },
}

export const Interactive: Story = {
  render: () => {
    const [color, setColor] = useState('#FF6B6B')

    return (
      <div className="space-y-4 p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            交互式颜色选择器
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            当前选择的颜色: <code className="bg-gray-100 px-2 py-1 rounded">{color}</code>
          </p>
        </div>

        <div className="flex justify-center">
          <ColorPicker
            value={color}
            onChange={setColor}
            showAlpha
            variant="elevated"
            size="lg"
          />
        </div>

        <div className="text-center">
          <div
            className="w-32 h-32 mx-auto rounded-lg border-2 border-gray-300"
            style={{ backgroundColor: color }}
          />
          <p className="text-sm text-gray-600 mt-2">
            颜色预览区域
          </p>
        </div>
      </div>
    )
  },
}

export const SizeComparison: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-6">
      <div className="text-center">
        <ColorPicker size="sm" defaultValue="#FF6B6B" />
        <p className="text-xs text-gray-600 mt-2">Small</p>
      </div>
      <div className="text-center">
        <ColorPicker size="md" defaultValue="#4ECDC4" />
        <p className="text-xs text-gray-600 mt-2">Medium</p>
      </div>
      <div className="text-center">
        <ColorPicker size="lg" defaultValue="#45B7D1" />
        <p className="text-xs text-gray-600 mt-2">Large</p>
      </div>
      <div className="text-center">
        <ColorPicker size="xl" defaultValue="#96CEB4" />
        <p className="text-xs text-gray-600 mt-2">Extra Large</p>
      </div>
    </div>
  ),
}

export const VariantComparison: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-6">
      <div className="text-center">
        <ColorPicker variant="default" defaultValue="#FF6B6B" />
        <p className="text-xs text-gray-600 mt-2">Default</p>
      </div>
      <div className="text-center">
        <ColorPicker variant="minimal" defaultValue="#4ECDC4" />
        <p className="text-xs text-gray-600 mt-2">Minimal</p>
      </div>
      <div className="text-center">
        <ColorPicker variant="elevated" defaultValue="#45B7D1" />
        <p className="text-xs text-gray-600 mt-2">Elevated</p>
      </div>
    </div>
  ),
}