import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { FormItem } from './form-item'

const meta = {
  title: 'Forms/FormItem',
  component: FormItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'FormItem 是一个表单项容器组件，用于包装单个字段及其相关元素。它支持标签、输入框、帮助文本、错误消息等多种元素，并提供多种布局变体和状态管理。',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'stacked', 'inline', 'horizontal', 'vertical'],
      description: '布局变体',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: '尺寸',
    },
    required: {
      control: 'boolean',
      description: '是否为必填项',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    readonly: {
      control: 'boolean',
      description: '是否只读',
    },
    showRequiredIndicator: {
      control: 'boolean',
      description: '是否显示必填指示器',
    },
    showOptionalIndicator: {
      control: 'boolean',
      description: '是否显示可选指示器',
    },
    showStatusIndicator: {
      control: 'boolean',
      description: '是否显示状态指示器',
    },
  },
} satisfies Meta<typeof FormItem>

export default meta
type Story = StoryObj<typeof meta>

// ==============================
// 基本用法
// ==============================

export const BasicUsage: Story = {
  args: {
    label: 'Username',
    variant: 'default',
  },
  render: (args) => {
    return (
      <div className="w-[400px]">
        <FormItem {...args}>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter username"
          />
        </FormItem>
      </div>
    )
  },
}

// ==============================
// 变体示例
// ==============================

export const Variants: Story = {
  render: () => (
    <div className="w-full max-w-4xl space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-3">Default</h3>
        <div className="w-[400px]">
          <FormItem label="Default Field" variant="default">
            <input className="w-full px-3 py-2 border rounded-md" />
          </FormItem>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Stacked</h3>
        <div className="w-[400px]">
          <FormItem label="Stacked Field" variant="stacked">
            <input className="w-full px-3 py-2 border rounded-md" />
          </FormItem>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Inline</h3>
        <div className="w-[400px]">
          <FormItem label="Inline Field" variant="inline">
            <input className="w-full px-3 py-2 border rounded-md" />
          </FormItem>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Horizontal</h3>
        <div className="w-[600px]">
          <FormItem label="Horizontal Field" variant="horizontal">
            <input className="w-full px-3 py-2 border rounded-md" />
          </FormItem>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Vertical</h3>
        <div className="w-[400px]">
          <FormItem label="Vertical Field" variant="vertical">
            <input className="w-full px-3 py-2 border rounded-md" />
          </FormItem>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'FormItem 提供5种布局变体：default（默认）、stacked（堆叠）、inline（内联）、horizontal（水平）和vertical（垂直）。',
      },
    },
  },
}

// ==============================
// 尺寸示例
// ==============================

export const Sizes: Story = {
  render: () => (
    <div className="w-full max-w-4xl space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Small</h3>
        <div className="w-[400px]">
          <FormItem size="sm" label="Small Field">
            <input className="w-full px-2 py-1 border rounded-md text-sm" />
          </FormItem>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Medium</h3>
        <div className="w-[400px]">
          <FormItem size="md" label="Medium Field">
            <input className="w-full px-3 py-2 border rounded-md" />
          </FormItem>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Large</h3>
        <div className="w-[400px]">
          <FormItem size="lg" label="Large Field">
            <input className="w-full px-4 py-3 border rounded-md text-base" />
          </FormItem>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Extra Large</h3>
        <div className="w-[400px]">
          <FormItem size="xl" label="Extra Large Field">
            <input className="w-full px-5 py-4 border rounded-md text-lg" />
          </FormItem>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'FormItem 支持4种尺寸：sm（小）、md（中）、lg（大）和xl（特大）。',
      },
    },
  },
}

// ==============================
// 必填和可选字段
// ==============================

export const RequiredFields: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <FormItem label="Required Field" required>
        <input className="w-full px-3 py-2 border rounded-md" />
      </FormItem>

      <FormItem label="Optional Field" optional showOptionalIndicator={true}>
        <input className="w-full px-3 py-2 border rounded-md" />
      </FormItem>

      <FormItem
        label="Required without indicator"
        required={true}
        showRequiredIndicator={false}
      >
        <input className="w-full px-3 py-2 border rounded-md" />
      </FormItem>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '使用 required 和 showRequiredIndicator 属性控制必填指示器，使用 optional 和 showOptionalIndicator 控制可选指示器。',
      },
    },
  },
}

// ==============================
// 错误状态
// ==============================

export const WithError: Story = {
  args: {
    label: 'Email',
    error: 'Invalid email address',
  },
  render: (args) => {
    return (
      <div className="w-[400px]">
        <FormItem {...args}>
          <input
            type="email"
            className="w-full px-3 py-2 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </FormItem>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '当字段有错误时，显示红色错误消息。',
      },
    },
  },
}

// ==============================
// 警告状态
// ==============================

export const WithWarning: Story = {
  args: {
    label: 'Password',
    warning: 'Password should be at least 8 characters',
  },
  render: (args) => {
    return (
      <div className="w-[400px]">
        <FormItem {...args}>
          <input
            type="password"
            className="w-full px-3 py-2 border border-yellow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </FormItem>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '显示黄色警告消息，适用于需要用户注意但不一定是错误的情况。',
      },
    },
  },
}

// ==============================
// 成功状态
// ==============================

export const WithSuccess: Story = {
  args: {
    label: 'Username',
    success: 'Username is available',
  },
  render: (args) => {
    return (
      <div className="w-[400px]">
        <FormItem {...args}>
          <input
            type="text"
            className="w-full px-3 py-2 border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </FormItem>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '显示绿色成功消息，适用于验证通过或操作成功的情况。',
      },
    },
  },
}

// ==============================
// 信息提示
// ==============================

export const WithInfo: Story = {
  args: {
    label: 'API Key',
    info: 'Keep your API key secret and never share it publicly',
  },
  render: (args) => {
    return (
      <div className="w-[400px]">
        <FormItem {...args}>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </FormItem>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '显示蓝色信息消息，用于提供额外的指导或说明。',
      },
    },
  },
}

// ==============================
// 描述文本和帮助文本
// ==============================

export const WithDescription: Story = {
  args: {
    label: 'Email',
    description: 'We will never share your email address',
  },
  render: (args) => {
    return (
      <div className="w-[400px]">
        <FormItem {...args}>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </FormItem>
      </div>
    )
  },
}

export const WithHelpText: Story = {
  args: {
    label: 'Search',
    helpText: 'Enter at least 3 characters',
  },
  render: (args) => {
    return (
      <div className="w-[400px]">
        <FormItem {...args}>
          <input
            type="search"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </FormItem>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'helpText 用于显示实时帮助信息，会在显示时带有淡入动画。',
      },
    },
  },
}

// ==============================
// 禁用状态
// ==============================

export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    disabled: true,
  },
  render: (args) => {
    return (
      <div className="w-[400px]">
        <FormItem {...args}>
          <input
            type="text"
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </FormItem>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '禁用状态下字段不可编辑，容器显示半透明和禁用光标。',
      },
    },
  },
}

// ==============================
// 只读状态
// ==============================

export const Readonly: Story = {
  args: {
    label: 'Readonly Field',
    readonly: true,
  },
  render: (args) => {
    return (
      <div className="w-[400px]">
        <FormItem {...args}>
          <input
            type="text"
            value="Readonly value"
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </FormItem>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '只读状态下字段可见但不可编辑，容器显示透明度效果。',
      },
    },
  },
}

// ==============================
// 状态指示器
// ==============================

export const WithStatusIndicator: Story = {
  args: {
    label: 'Field with Indicator',
    error: 'Error message',
    showStatusIndicator: true,
  },
  render: (args) => {
    return (
      <div className="w-[400px]">
        <FormItem {...args}>
          <input className="w-full px-3 py-2 border rounded-md pr-10" />
        </FormItem>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'showStatusIndicator 属性会在输入框右侧显示状态图标。',
      },
    },
  },
}

// ==============================
// 完整表单示例
// ==============================

export const CompleteForm: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
      const newErrors: Record<string, string> = {}

      if (!formData.name) {
        newErrors.name = 'Name is required'
      }

      if (!formData.email) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid'
      }

      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters'
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (validateForm()) {
        alert('Form submitted successfully!')
      }
    }

    return (
      <div className="w-[500px] p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-6">Sign Up Form</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormItem
            label="Full Name"
            required
            error={errors.name}
          >
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </FormItem>

          <FormItem
            label="Email Address"
            required
            error={errors.email}
            description="We'll never share your email"
          >
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </FormItem>

          <FormItem
            label="Password"
            required
            error={errors.password}
            helpText="Must be at least 8 characters"
          >
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </FormItem>

          <FormItem
            label="Confirm Password"
            required
            error={errors.confirmPassword}
          >
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </FormItem>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition mt-4"
          >
            Create Account
          </button>
        </form>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '完整的表单示例，展示了多种状态的组合使用。',
      },
    },
  },
}

// ==============================
// 水平布局表单
// ==============================

export const HorizontalLayout: Story = {
  render: () => {
    return (
      <div className="w-[700px] p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-6">User Profile</h2>

        <div className="space-y-4">
          <FormItem variant="horizontal" label="First Name" required>
            <input className="w-full px-3 py-2 border rounded-md" />
          </FormItem>

          <FormItem variant="horizontal" label="Last Name" required>
            <input className="w-full px-3 py-2 border rounded-md" />
          </FormItem>

          <FormItem
            variant="horizontal"
            label="Email"
            required
            error="Email is required"
          >
            <input className="w-full px-3 py-2 border rounded-md" />
          </FormItem>

          <FormItem variant="horizontal" label="Phone" optional showOptionalIndicator>
            <input className="w-full px-3 py-2 border rounded-md" />
          </FormItem>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '使用 horizontal 变体创建更紧凑的表单布局，标签和输入框在同一行。',
      },
    },
  },
}
