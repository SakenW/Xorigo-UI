'use client'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Checkbox } from './checkbox'

/**
 * Checkbox 复选框组件故事文件
 *
 * 展示了各种使用场景和配置选项的 Checkbox 组件示例
 */
const meta = {
  title: 'Form/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
 Checkbox 是一个功能完整的复选框组件，支持以下特性：

 - ✅ 四种视觉变体：default、filled、outlined、neon
 - 📏 三种尺寸：sm、md、lg
 - 🎨 状态管理：normal、error、success、warning
 - 🔄 Indeterminate 状态支持
 - 📍 标签位置：左侧或右侧
 - ♿ 完整的可访问性支持
 - 🎭 Framer Motion 动画效果
 - 🌙 七轴主题系统集成
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outlined', 'neon'],
      description: '复选框的视觉变体样式',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '复选框的尺寸大小',
    },
    status: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
      description: '复选框的状态样式',
    },
    labelPosition: {
      control: 'select',
      options: ['right', 'left'],
      description: '标签相对于复选框的位置',
    },
    checked: {
      control: 'boolean',
      description: '是否选中（受控模式）',
    },
    defaultChecked: {
      control: 'boolean',
      description: '默认是否选中（非受控模式）',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    required: {
      control: 'boolean',
      description: '是否必填',
    },
    indeterminate: {
      control: 'boolean',
      description: '是否为半选状态',
    },
    error: {
      control: 'text',
      description: '错误信息',
    },
    helperText: {
      control: 'text',
      description: '帮助文本',
    },
    className: {
      control: 'text',
      description: '自定义 CSS 类名',
    },
  },
  args: {
    children: '选项',
    checked: false,
    disabled: false,
    required: false,
    indeterminate: false,
    variant: 'default',
    size: 'md',
    status: 'default',
    labelPosition: 'right',
    onChange: fn(),
    onIndeterminateChange: fn(),
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 基础复选框示例
 */
export const Default: Story = {
  args: {
    children: '我同意服务条款',
  },
}

/**
 * 不同尺寸的复选框
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Checkbox size="sm">小尺寸复选框</Checkbox>
        <span className="text-sm text-gray-500">sm</span>
      </div>
      <div className="flex items-center space-x-4">
        <Checkbox size="md">默认尺寸复选框</Checkbox>
        <span className="text-sm text-gray-500">md</span>
      </div>
      <div className="flex items-center space-x-4">
        <Checkbox size="lg">大尺寸复选框</Checkbox>
        <span className="text-sm text-gray-500">lg</span>
      </div>
    </div>
  ),
}

/**
 * 不同视觉变体
 */
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Checkbox variant="default" defaultChecked>
          默认变体
        </Checkbox>
        <span className="text-sm text-gray-500">default</span>
      </div>
      <div className="flex items-center space-x-4">
        <Checkbox variant="filled" defaultChecked>
          填充变体
        </Checkbox>
        <span className="text-sm text-gray-500">filled</span>
      </div>
      <div className="flex items-center space-x-4">
        <Checkbox variant="outlined" defaultChecked>
          轮廓变体
        </Checkbox>
        <span className="text-sm text-gray-500">outlined</span>
      </div>
      <div className="flex items-center space-x-4">
        <Checkbox variant="neon" defaultChecked>
          霓虹变体
        </Checkbox>
        <span className="text-sm text-gray-500">neon</span>
      </div>
    </div>
  ),
}

/**
 * 不同状态样式
 */
export const Statuses: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Checkbox status="default" defaultChecked>
          默认状态
        </Checkbox>
        <span className="text-sm text-gray-500">default</span>
      </div>
      <div className="flex items-center space-x-4">
        <Checkbox status="success" defaultChecked>
          成功状态
        </Checkbox>
        <span className="text-sm text-gray-500">success</span>
      </div>
      <div className="flex items-center space-x-4">
        <Checkbox status="warning" defaultChecked>
          警告状态
        </Checkbox>
        <span className="text-sm text-gray-500">warning</span>
      </div>
      <div className="flex items-center space-x-4">
        <Checkbox status="error" defaultChecked>
          错误状态
        </Checkbox>
        <span className="text-sm text-gray-500">error</span>
      </div>
    </div>
  ),
}

/**
 * Indeterminate 状态示例
 */
export const Indeterminate: Story = {
  render: () => {
    const [parentChecked, setParentChecked] = React.useState(false)
    const [parentIndeterminate, setParentIndeterminate] = React.useState(true)
    const [child1Checked, setChild1Checked] = React.useState(true)
    const [child2Checked, setChild2Checked] = React.useState(false)
    const [child3Checked, setChild3Checked] = React.useState(true)

    React.useEffect(() => {
      const checkedCount = [child1Checked, child2Checked, child3Checked].filter(Boolean).length
      setParentChecked(checkedCount === 3)
      setParentIndeterminate(checkedCount > 0 && checkedCount < 3)
    }, [child1Checked, child2Checked, child3Checked])

    const handleParentChange = () => {
      const newState = !parentChecked
      setParentChecked(newState)
      setParentIndeterminate(false)
      setChild1Checked(newState)
      setChild2Checked(newState)
      setChild3Checked(newState)
    }

    return (
      <div className="space-y-3">
        <Checkbox
          checked={parentChecked}
          indeterminate={parentIndeterminate}
          onChange={handleParentChange}
          labelPosition="left"
        >
          选择所有选项
        </Checkbox>

        <div className="ml-6 space-y-2">
          <Checkbox checked={child1Checked} onChange={(e) => setChild1Checked(e.target.checked)}>
            选项 1
          </Checkbox>
          <Checkbox checked={child2Checked} onChange={(e) => setChild2Checked(e.target.checked)}>
            选项 2
          </Checkbox>
          <Checkbox checked={child3Checked} onChange={(e) => setChild3Checked(e.target.checked)}>
            选项 3
          </Checkbox>
        </div>
      </div>
    )
  },
}

/**
 * 标签位置示例
 */
export const LabelPositions: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox labelPosition="right" defaultChecked>
        右侧标签（默认）
      </Checkbox>
      <Checkbox labelPosition="left" defaultChecked>
        左侧标签
      </Checkbox>
    </div>
  ),
}

/**
 * 帮助文本和错误信息示例
 */
export const HelperText: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <Checkbox helperText="这将启用高级功能">
          启用高级选项
        </Checkbox>
      </div>

      <div>
        <Checkbox
          error="请先阅读并同意服务条款"
          helperText="您必须同意服务条款才能继续"
        >
          我同意服务条款
        </Checkbox>
      </div>

      <div>
        <Checkbox
          status="success"
          helperText="验证成功！您可以选择这个选项"
          defaultChecked
        >
          已验证选项
        </Checkbox>
      </div>
    </div>
  ),
}

/**
 * 禁用状态示例
 */
export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox disabled>
        禁用的未选中复选框
      </Checkbox>
      <Checkbox disabled defaultChecked>
        禁用的已选中复选框
      </Checkbox>
      <Checkbox disabled indeterminate>
        禁用的半选状态复选框
      </Checkbox>
      <Checkbox disabled error="此项已被禁用">
        禁用的错误状态复选框
      </Checkbox>
    </div>
  ),
}

/**
 * 必填状态示例
 */
export const Required: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox required>
        必填选项
      </Checkbox>
      <Checkbox required error="此项为必填项">
        必填且有错误的选项
      </Checkbox>
      <Checkbox required helperText="这是一个必填选项">
        带帮助文本的必填选项
      </Checkbox>
    </div>
  ),
}

/**
 * 表单集成示例
 */
export const FormIntegration: Story = {
  render: () => {
    const [formData, setFormData] = React.useState({
      notifications: true,
      newsletter: false,
      terms: false,
    })

    const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.checked
      }))
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      alert('表单数据：' + JSON.stringify(formData, null, 2))
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-6 p-6 border rounded-lg max-w-md">
        <h3 className="text-lg font-semibold">用户设置</h3>

        <div className="space-y-4">
          <Checkbox
            name="notifications"
            checked={formData.notifications}
            onChange={handleChange('notifications')}
            helperText="接收重要更新和通知"
          >
            启用通知
          </Checkbox>

          <Checkbox
            name="newsletter"
            checked={formData.newsletter}
            onChange={handleChange('newsletter')}
            helperText="订阅我们的新闻通讯"
          >
            订阅新闻通讯
          </Checkbox>

          <Checkbox
            name="terms"
            checked={formData.terms}
            onChange={handleChange('terms')}
            required
            error={!formData.terms ? '必须同意服务条款' : undefined}
          >
            我同意服务条款和隐私政策
          </Checkbox>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          保存设置
        </button>
      </form>
    )
  },
}

/**
 * 分组使用示例
 */
export const CheckboxGroup: Story = {
  render: () => {
    const [selectedItems, setSelectedItems] = React.useState<string[]>(['option1', 'option3'])

    const categories = [
      {
        name: '编程语言',
        items: [
          { id: 'option1', label: 'JavaScript' },
          { id: 'option2', label: 'TypeScript' },
          { id: 'option3', label: 'Python' },
        ]
      },
      {
        name: '框架',
        items: [
          { id: 'option4', label: 'React' },
          { id: 'option5', label: 'Vue' },
          { id: 'option6', label: 'Angular' },
        ]
      }
    ]

    const handleItemChange = (itemId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        setSelectedItems(prev => [...prev, itemId])
      } else {
        setSelectedItems(prev => prev.filter(id => id !== itemId))
      }
    }

    const handleCategoryChange = (categoryIndex: number) => {
      const category = categories[categoryIndex]
      const allSelected = category.items.every(item => selectedItems.includes(item.id))

      if (allSelected) {
        setSelectedItems(prev => prev.filter(id =>
          !category.items.some(item => item.id === id)
        ))
      } else {
        setSelectedItems(prev => [
          ...prev.filter(id => !category.items.some(item => item.id === id)),
          ...category.items.map(item => item.id)
        ])
      }
    }

    return (
      <div className="space-y-6 p-6 border rounded-lg max-w-md">
        <h3 className="text-lg font-semibold">技术栈选择</h3>

        {categories.map((category, categoryIndex) => {
          const selectedCount = category.items.filter(item =>
            selectedItems.includes(item.id)
          ).length

          return (
            <div key={category.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{category.name}</h4>
                <span className="text-sm text-gray-500">
                  已选择 {selectedCount}/{category.items.length}
                </span>
              </div>

              <div
                role="group"
                aria-label={`${category.name}选项`}
                className="space-y-2"
              >
                <Checkbox
                  checked={selectedCount === category.items.length}
                  indeterminate={selectedCount > 0 && selectedCount < category.items.length}
                  onChange={() => handleCategoryChange(categoryIndex)}
                  labelPosition="left"
                >
                  全选
                </Checkbox>

                <div className="ml-6 space-y-2">
                  {category.items.map(item => (
                    <Checkbox
                      key={item.id}
                      checked={selectedItems.includes(item.id)}
                      onChange={handleItemChange(item.id)}
                    >
                      {item.label}
                    </Checkbox>
                  ))}
                </div>
              </div>
            </div>
          )
        })}

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600">
            已选择: {selectedItems.length} 项
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {selectedItems.join(', ') || '未选择任何项'}
          </p>
        </div>
      </div>
    )
  },
}

/**
 * 主题适配示例
 */
export const ThemeVariants: Story = {
  render: () => (
    <div className="space-y-6 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">主题适配展示</h3>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium">基础变体</h4>
          <div className="space-y-2">
            <Checkbox variant="default" defaultChecked>默认变体</Checkbox>
            <Checkbox variant="filled" defaultChecked>填充变体</Checkbox>
            <Checkbox variant="outlined" defaultChecked>轮廓变体</Checkbox>
            <Checkbox variant="neon" defaultChecked>霓虹变体</Checkbox>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">状态变体</h4>
          <div className="space-y-2">
            <Checkbox status="success" defaultChecked>成功状态</Checkbox>
            <Checkbox status="warning" defaultChecked>警告状态</Checkbox>
            <Checkbox status="error" defaultChecked>错误状态</Checkbox>
            <Checkbox disabled>禁用状态</Checkbox>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">尺寸对比</h4>
        <div className="flex items-end space-x-4">
          <Checkbox size="sm" defaultChecked>小尺寸</Checkbox>
          <Checkbox size="md" defaultChecked>默认尺寸</Checkbox>
          <Checkbox size="lg" defaultChecked>大尺寸</Checkbox>
        </div>
      </div>
    </div>
  ),
}

/**
 * 交互式示例
 */
export const Interactive: Story = {
  render: () => {
    const [state, setState] = React.useState({
      accepted: false,
      newsletter: false,
      notifications: true,
      indeterminateState: true,
    })

    const updateState = (key: keyof typeof state) => (value: boolean) => {
      setState(prev => ({ ...prev, [key]: value }))
    }

    return (
      <div className="space-y-6 p-6 border rounded-lg max-w-md">
        <h3 className="text-lg font-semibold">交互式示例</h3>

        <div className="space-y-4">
          <Checkbox
            checked={state.accepted}
            onChange={(e) => updateState('accepted')(e.target.checked)}
            helperText={state.accepted ? '感谢您的接受！' : '请接受以继续'}
          >
            接受条款
          </Checkbox>

          <Checkbox
            checked={state.newsletter}
            onChange={(e) => updateState('newsletter')(e.target.checked)}
            disabled={!state.accepted}
            helperText={!state.accepted ? '需要先接受条款' : '订阅我们的新闻通讯'}
          >
            订阅新闻通讯
          </Checkbox>

          <Checkbox
            checked={state.notifications}
            onChange={(e) => updateState('notifications')(e.target.checked)}
          >
            接收通知
          </Checkbox>

          <Checkbox
            checked={false}
            indeterminate={state.indeterminateState}
            onChange={() => updateState('indeterminateState')(!state.indeterminateState)}
            onIndeterminateChange={updateState('indeterminateState')}
          >
            半选状态示例
          </Checkbox>
        </div>

        <div className="p-4 bg-gray-50 rounded text-sm">
          <p className="font-medium mb-2">当前状态：</p>
          <pre className="text-xs bg-white p-2 rounded border">
            {JSON.stringify(state, null, 2)}
          </pre>
        </div>
      </div>
    )
  },
}