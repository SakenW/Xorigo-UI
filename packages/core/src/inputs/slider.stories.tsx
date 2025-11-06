'use client'
import type { Meta, StoryObj } from '@storybook/react'
import { Slider } from './slider'

const meta = {
  title: 'Form/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Slider 组件是一个功能完整的滑块选择器，支持单值和范围选择、垂直和水平方向、自定义标记点等功能。

## 主要特性

- **单值和范围选择**: 支持单个数值或数值范围选择
- **双向操作**: 支持垂直和水平方向
- **标记点支持**: 可在滑块上显示自定义标记点
- **实时数值显示**: 可选的数值标签和输入框
- **主题集成**: 完整支持 Xorigo UI 设计令牌
- **动画效果**: 三种动画变体（default、smooth、bounce）
- **可访问性**: 完整的键盘导航和屏幕阅读器支持
- **TypeScript**: 完整的类型定义

## 使用示例

### 基础单值滑块
\`\`\`tsx
<Slider value={50} min={0} max={100} />
\`\`\`

### 范围滑块
\`\`\`tsx
<Slider value={[25, 75]} min={0} max={100} />
\`\`\`

### 带标记点的滑块
\`\`\`tsx
const marks = [
  { value: 0, label: '最小' },
  { value: 50, label: '中间' },
  { value: 100, label: '最大' }
]
<Slider value={50} showMarks marks={marks} />
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      description: '滑块值 - 单值或范围值',
      control: {
        type: 'object',
      },
    },
    defaultValue: {
      description: '默认值 - 非受控模式',
      control: {
        type: 'object',
      },
    },
    min: {
      description: '最小值',
      control: {
        type: 'number',
        min: -1000,
        max: 1000,
      },
    },
    max: {
      description: '最大值',
      control: {
        type: 'number',
        min: -1000,
        max: 1000,
      },
    },
    step: {
      description: '步长',
      control: {
        type: 'number',
        min: 0.1,
        max: 100,
        step: 0.1,
      },
    },
    disabled: {
      description: '是否禁用',
      control: 'boolean',
    },
    orientation: {
      description: '滑块方向',
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    showMarks: {
      description: '是否显示标记点',
      control: 'boolean',
    },
    showLabel: {
      description: '是否显示数值标签',
      control: 'boolean',
    },
    showInput: {
      description: '是否显示输入框',
      control: 'boolean',
    },
    variant: {
      description: '动画变体',
      control: 'select',
      options: ['default', 'smooth', 'bounce'],
    },
    size: {
      description: '尺寸',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      description: '颜色主题',
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error'],
    },
    label: {
      description: '标签文本',
      control: 'text',
    },
    helperText: {
      description: '帮助文本',
      control: 'text',
    },
    error: {
      description: '错误信息',
      control: 'text',
    },
  },
  args: {
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    orientation: 'horizontal',
    showMarks: false,
    showLabel: true,
    showInput: false,
    variant: 'default',
    size: 'md',
    color: 'primary',
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

// 基础单值滑块
export const Default: Story = {
  args: {
    label: '音量控制',
    helperText: '拖动滑块调整音量大小',
  },
}

// 范围滑块
export const Range: Story = {
  args: {
    value: [25, 75],
    label: '价格范围',
    helperText: '选择价格区间',
    showLabel: true,
  },
}

// 垂直滑块
export const Vertical: Story = {
  args: {
    value: 60,
    orientation: 'vertical',
    label: '进度条',
    helperText: '当前进度',
  },
  parameters: {
    layout: 'padded',
  },
}

// 带标记点的滑块
export const WithMarks: Story = {
  args: {
    value: 50,
    showMarks: true,
    marks: [
      { value: 0, label: '0%' },
      { value: 25, label: '25%' },
      { value: 50, label: '50%' },
      { value: 75, label: '75%' },
      { value: 100, label: '100%' },
    ],
    label: '完成度',
    helperText: '任务完成百分比',
  },
}

// 带输入框的滑块
export const WithInput: Story = {
  args: {
    value: 65,
    showInput: true,
    showLabel: true,
    label: '温度设置',
    helperText: '设置目标温度（°C）',
    min: 16,
    max: 30,
    step: 0.5,
    formatValue: (val) => `${val}°C`,
  },
}

// 范围滑块带输入框
export const RangeWithInput: Story = {
  args: {
    value: [200, 800],
    showInput: true,
    showLabel: true,
    label: '预算范围',
    helperText: '设置项目预算范围（元）',
    min: 0,
    max: 1000,
    formatValue: (val) => `¥${val}`,
  },
}

// 不同尺寸
export const Sizes: Story = {
  render: () => (
    <div className="space-y-8 w-80">
      <div>
        <h3 className="text-lg font-semibold mb-4">小尺寸 (Small)</h3>
        <Slider value={30} size="sm" label="小滑块" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">中等尺寸 (Medium)</h3>
        <Slider value={50} size="md" label="中等滑块" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">大尺寸 (Large)</h3>
        <Slider value={70} size="lg" label="大滑块" />
      </div>
    </div>
  ),
}

// 不同颜色主题
export const Colors: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <div>
        <h3 className="text-lg font-semibold mb-4">主色调 (Primary)</h3>
        <Slider value={60} color="primary" label="主色调滑块" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">次要色调 (Secondary)</h3>
        <Slider value={60} color="secondary" label="次要色调滑块" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">成功色调 (Success)</h3>
        <Slider value={60} color="success" label="成功色调滑块" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">警告色调 (Warning)</h3>
        <Slider value={60} color="warning" label="警告色调滑块" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">错误色调 (Error)</h3>
        <Slider value={60} color="error" label="错误色调滑块" />
      </div>
    </div>
  ),
}

// 不同动画变体
export const Variants: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <div>
        <h3 className="text-lg font-semibold mb-4">默认动画 (Default)</h3>
        <Slider value={50} variant="default" label="默认动画" helperText="标准过渡动画" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">平滑动画 (Smooth)</h3>
        <Slider value={50} variant="smooth" label="平滑动画" helperText="缓动过渡动画" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">弹性动画 (Bounce)</h3>
        <Slider value={50} variant="bounce" label="弹性动画" helperText="弹性过渡动画" />
      </div>
    </div>
  ),
}

// 状态变体
export const States: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <div>
        <h3 className="text-lg font-semibold mb-4">正常状态</h3>
        <Slider value={50} label="正常滑块" helperText="滑块处于正常状态" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">禁用状态</h3>
        <Slider value={50} disabled label="禁用滑块" helperText="滑块已禁用" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">错误状态</h3>
        <Slider value={50} label="错误滑块" error="数值超出有效范围" />
      </div>
    </div>
  ),
}

// 自定义格式化
export const CustomFormat: Story = {
  args: {
    value: 65,
    showLabel: true,
    showInput: true,
    label: '折扣设置',
    helperText: '设置商品折扣百分比',
    min: 0,
    max: 100,
    formatValue: (val) => `${val}% 折扣`,
  },
}

// 小数步长
export const DecimalStep: Story = {
  args: {
    value: 3.7,
    showLabel: true,
    showInput: true,
    label: '评分设置',
    helperText: '设置产品评分（0-5分）',
    min: 0,
    max: 5,
    step: 0.1,
    formatValue: (val) => `${val} 分`,
  },
}

// 负数范围
export const NegativeRange: Story = {
  args: {
    value: -10,
    showLabel: true,
    showInput: true,
    label: '温度调节',
    helperText: '设置温度偏移量',
    min: -50,
    max: 50,
    formatValue: (val) => `${val > 0 ? '+' : ''}${val}°C`,
  },
}

// 复杂组合示例
export const ComplexExample: Story = {
  render: () => {
    const [priceRange, setPriceRange] = React.useState([200, 800])
    const [rating, setRating] = React.useState(4.2)
    const [quantity, setQuantity] = React.useState(150)

    return (
      <div className="space-y-8 w-96 p-6 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">产品筛选器</h2>

        <div>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={2000}
            step={50}
            showMarks
            showInput
            showLabel
            marks={[
              { value: 0, label: '¥0' },
              { value: 500, label: '¥500' },
              { value: 1000, label: '¥1000' },
              { value: 1500, label: '¥1500' },
              { value: 2000, label: '¥2000' },
            ]}
            color="primary"
            label="价格范围"
            helperText="选择商品价格区间"
            formatValue={(val) => `¥${val}`}
          />
        </div>

        <div>
          <Slider
            value={rating}
            onValueChange={setRating}
            min={0}
            max={5}
            step={0.1}
            showInput
            showLabel
            color="success"
            label="最低评分"
            helperText="筛选最低评分要求"
            formatValue={(val) => `${val} ⭐`}
          />
        </div>

        <div>
          <Slider
            value={quantity}
            onValueChange={setQuantity}
            min={0}
            max={500}
            step={10}
            showLabel
            color="warning"
            label="库存数量"
            helperText="最小库存要求"
            formatValue={(val) => `${val} 件`}
          />
        </div>

        <div className="pt-4 border-t border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-secondary)]">
            当前筛选条件：价格 ¥{priceRange[0]}-¥{priceRange[1]}，评分 {rating} 星以上，库存 {quantity} 件以上
          </p>
        </div>
      </div>
    )
  },
  parameters: {
    layout: 'centered',
  },
}