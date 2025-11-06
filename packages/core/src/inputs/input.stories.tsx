'use client'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Input } from './input'
import { Mail, Lock, Search, User, Eye, EyeOff, Check, AlertCircle, AlertTriangle, X } from 'lucide-react'

// Meta 配置
const meta: Meta<typeof Input> = {
  title: 'Form/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
一个功能完整的输入框组件，支持多种变体、尺寸、状态和高级功能。

## 主要特性

- 🎨 **多种变体**: default, filled, outlined, underlined, ghost, neon
- 📏 **多种尺寸**: sm, md, lg
- 🔄 **状态管理**: default, focus, error, success, warning, disabled
- 🎯 **图标支持**: 左右图标、前缀后缀文本
- 🔒 **密码切换**: 显示/隐藏密码功能
- 🗑️ **清除功能**: 一键清空输入内容
- 📊 **字符计数**: 实时显示输入字符数量
- 🏷️ **浮动标签**: Material Design 风格浮动标签
- ♿ **可访问性**: 完整的 ARIA 支持
- 🎭 **动画效果**: 流畅的交互动画
- 🌙 **主题支持**: 完整的主题系统集成

## 使用场景

- 表单输入
- 搜索框
- 密码输入
- 数值输入
- URL/邮箱输入
- 带验证的输入框
        `
      }
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0f172a' }
      ]
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      description: '输入框变体样式',
      options: ['default', 'filled', 'outlined', 'underlined', 'ghost', 'neon']
    },
    size: {
      control: 'select',
      description: '输入框尺寸',
      options: ['sm', 'md', 'lg']
    },
    status: {
      control: 'select',
      description: '输入框状态',
      options: ['default', 'error', 'success', 'warning']
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用'
    },
    required: {
      control: 'boolean',
      description: '是否必填'
    },
    loading: {
      control: 'boolean',
      description: '加载状态'
    },
    clearable: {
      control: 'boolean',
      description: '是否可清除'
    },
    showCharCount: {
      control: 'boolean',
      description: '是否显示字符计数'
    },
    showPasswordToggle: {
      control: 'boolean',
      description: '是否显示密码切换按钮'
    },
    floatingLabel: {
      control: 'boolean',
      description: '是否使用浮动标签'
    },
    maxLength: {
      control: 'number',
      description: '最大字符长度'
    },
    placeholder: {
      control: 'text',
      description: '占位符文本'
    },
    label: {
      control: 'text',
      description: '标签文本'
    },
    helperText: {
      control: 'text',
      description: '帮助文本'
    },
    error: {
      control: 'text',
      description: '错误文本'
    },
    prefix: {
      control: 'text',
      description: '前缀文本'
    },
    suffix: {
      control: 'text',
      description: '后缀文本'
    },
    value: {
      control: 'text',
      description: '输入值（受控模式）'
    },
    defaultValue: {
      control: 'text',
      description: '默认值（非受控模式）'
    },
    type: {
      control: 'select',
      description: '输入类型',
      options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url']
    }
  },
  args: {
    placeholder: '请输入内容',
    onChange: fn()
  }
}

export default meta
type Story = StoryObj<typeof Input>

// 基础故事
export const Default: Story = {
  args: {
    placeholder: '请输入内容'
  }
}

// 带标签
export const WithLabel: Story = {
  args: {
    label: '用户名',
    placeholder: '请输入用户名'
  }
}

// 必填字段
export const Required: Story = {
  args: {
    label: '邮箱地址',
    placeholder: '请输入邮箱地址',
    required: true
  }
}

// 带帮助文本
export const WithHelperText: Story = {
  args: {
    label: '密码',
    type: 'password',
    helperText: '密码至少包含8个字符，包含字母和数字'
  }
}

// 错误状态
export const ErrorState: Story = {
  args: {
    label: '邮箱地址',
    placeholder: '请输入邮箱地址',
    error: '请输入有效的邮箱地址',
    value: 'invalid-email'
  }
}

// 成功状态
export const SuccessState: Story = {
  args: {
    label: '用户名',
    placeholder: '请输入用户名',
    validationState: 'success',
    value: 'johndoe'
  }
}

// 警告状态
export const WarningState: Story = {
  args: {
    label: '密码',
    type: 'password',
    placeholder: '请输入密码',
    validationState: 'warning',
    helperText: '密码强度较弱，建议包含特殊字符'
  }
}

// 禁用状态
export const Disabled: Story = {
  args: {
    label: '用户名',
    placeholder: '请输入用户名',
    disabled: true,
    value: '已禁用的内容'
  }
}

// 加载状态
export const Loading: Story = {
  args: {
    label: '搜索',
    placeholder: '正在搜索...',
    loading: true
  }
}

// 带左图标
export const WithLeftIcon: Story = {
  args: {
    label: '邮箱地址',
    placeholder: '请输入邮箱地址',
    leftIcon: <Mail className="w-4 h-4" />
  }
}

// 带右图标
export const WithRightIcon: Story = {
  args: {
    label: '搜索',
    placeholder: '搜索内容...',
    rightIcon: <Search className="w-4 h-4" />
  }
}

// 带前缀文本
export const WithPrefix: Story = {
  args: {
    label: '网站地址',
    placeholder: 'example.com',
    prefix: 'https://'
  }
}

// 带后缀文本
export const WithSuffix: Story = {
  args: {
    label: '价格',
    placeholder: '0.00',
    suffix: 'USD'
  }
}

// 带清除功能
export const Clearable: Story = {
  args: {
    label: '搜索内容',
    placeholder: '输入关键词进行搜索',
    clearable: true,
    defaultValue: 'some text'
  }
}

// 密码输入
export const PasswordInput: Story = {
  args: {
    label: '密码',
    type: 'password',
    placeholder: '请输入密码',
    showPasswordToggle: true,
    leftIcon: <Lock className="w-4 h-4" />
  }
}

// 字符计数
export const WithCharCount: Story = {
  args: {
    label: '个人简介',
    placeholder: '简单介绍一下自己...',
    showCharCount: true,
    maxLength: 100,
    defaultValue: '这是一段示例文本'
  }
}

// 浮动标签
export const FloatingLabel: Story = {
  args: {
    label: '用户名',
    placeholder: '请输入用户名',
    floatingLabel: true
  }
}

// 复杂组合
export const Complex: Story = {
  args: {
    label: '邮箱地址',
    placeholder: '请输入邮箱地址',
    leftIcon: <Mail className="w-4 h-4" />,
    clearable: true,
    showCharCount: true,
    maxLength: 50,
    required: true,
    helperText: '我们将使用此邮箱发送重要通知'
  }
}

// 变体展示
export const Variants: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input
        variant="default"
        placeholder="Default 变体"
        label="Default"
      />
      <Input
        variant="filled"
        placeholder="Filled 变体"
        label="Filled"
      />
      <Input
        variant="outlined"
        placeholder="Outlined 变体"
        label="Outlined"
      />
      <Input
        variant="underlined"
        placeholder="Underlined 变体"
        label="Underlined"
      />
      <Input
        variant="ghost"
        placeholder="Ghost 变体"
        label="Ghost"
      />
      <Input
        variant="neon"
        placeholder="Neon 变体"
        label="Neon"
      />
    </div>
  )
}

// 尺寸展示
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input
        size="sm"
        placeholder="小尺寸输入框"
        label="Small"
      />
      <Input
        size="md"
        placeholder="中等尺寸输入框"
        label="Medium"
      />
      <Input
        size="lg"
        placeholder="大尺寸输入框"
        label="Large"
      />
    </div>
  )
}

// 状态展示
export const States: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input
        placeholder="默认状态"
        label="Default"
      />
      <Input
        placeholder="焦点状态"
        label="Focus"
        className="ring-2 ring-blue-500"
      />
      <Input
        placeholder="成功状态"
        label="Success"
        validationState="success"
      />
      <Input
        placeholder="警告状态"
        label="Warning"
        validationState="warning"
      />
      <Input
        placeholder="错误状态"
        label="Error"
        error="这是一条错误信息"
      />
      <Input
        placeholder="禁用状态"
        label="Disabled"
        disabled
      />
    </div>
  )
}

// 表单示例
export const FormExample: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        用户注册
      </h2>

      <div className="space-y-4">
        <Input
          label="用户名"
          placeholder="请输入用户名"
          leftIcon={<User className="w-4 h-4" />}
          clearable
          showCharCount
          maxLength={20}
          required
        />

        <Input
          label="邮箱地址"
          type="email"
          placeholder="请输入邮箱地址"
          leftIcon={<Mail className="w-4 h-4" />}
          required
          helperText="我们将使用此邮箱发送验证邮件"
        />

        <Input
          label="密码"
          type="password"
          placeholder="请输入密码"
          leftIcon={<Lock className="w-4 h-4" />}
          showPasswordToggle
          showCharCount
          maxLength={32}
          required
        />

        <Input
          label="手机号码"
          type="tel"
          placeholder="请输入手机号码"
          prefix="+86"
          clearable
          maxLength={11}
        />
      </div>
    </div>
  )
}

// 搜索示例
export const SearchExample: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        搜索组件
      </h2>

      <Input
        placeholder="搜索文档、功能或帮助..."
        leftIcon={<Search className="w-4 h-4" />}
        clearable
        size="lg"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="产品搜索"
          leftIcon={<Search className="w-4 h-4" />}
          size="sm"
        />
        <Input
          placeholder="用户搜索"
          leftIcon={<Search className="w-4 h-4" />}
          size="sm"
        />
      </div>
    </div>
  )
}

// 密码管理示例
export const PasswordExample: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        密码管理
      </h2>

      <Input
        label="当前密码"
        type="password"
        placeholder="请输入当前密码"
        showPasswordToggle
        leftIcon={<Lock className="w-4 h-4" />}
      />

      <Input
        label="新密码"
        type="password"
        placeholder="请输入新密码"
        showPasswordToggle
        showCharCount
        maxLength={20}
        leftIcon={<Lock className="w-4 h-4" />}
        helperText="密码至少8位，包含字母和数字"
      />

      <Input
        label="确认新密码"
        type="password"
        placeholder="请再次输入新密码"
        showPasswordToggle
        showCharCount
        maxLength={20}
        leftIcon={<Lock className="w-4 h-4" />}
        error="两次输入的密码不一致"
      />
    </div>
  )
}

// URL输入示例
export const UrlExample: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        URL 配置
      </h2>

      <Input
        label="网站地址"
        type="url"
        placeholder="example.com"
        prefix="https://"
        suffix=".com"
        helperText="输入您的网站域名"
      />

      <Input
        label="API 端点"
        type="url"
        placeholder="api.example.com/v1"
        prefix="https://"
        clearable
      />

      <Input
        label="回调地址"
        type="url"
        placeholder="请输入完整的回调地址"
        helperText="用于 OAuth 认证的回调地址"
      />
    </div>
  )
}

// 交互演示
export const Interactive: Story = {
  render: () => {
    const [values, setValues] = React.useState({
      email: '',
      password: '',
      username: ''
    })

    const [errors, setErrors] = React.useState({
      email: '',
      password: '',
      username: ''
    })

    const validateEmail = (email: string) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email) ? '' : '请输入有效的邮箱地址'
    }

    const validatePassword = (password: string) => {
      if (password.length < 8) return '密码至少8位'
      if (!/\d/.test(password)) return '密码必须包含数字'
      if (!/[a-zA-Z]/.test(password)) return '密码必须包含字母'
      return ''
    }

    const validateUsername = (username: string) => {
      if (username.length < 3) return '用户名至少3位'
      if (!/^[a-zA-Z0-9_]+$/.test(username)) return '用户名只能包含字母、数字和下划线'
      return ''
    }

    const handleChange = (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setValues(prev => ({ ...prev, [field]: value }))

      // 实时验证
      let error = ''
      switch (field) {
        case 'email':
          error = validateEmail(value)
          break
        case 'password':
          error = validatePassword(value)
          break
        case 'username':
          error = validateUsername(value)
          break
      }

      setErrors(prev => ({ ...prev, [field]: error }))
    }

    return (
      <div className="space-y-6 w-96">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          实时验证演示
        </h2>

        <div className="space-y-4">
          <Input
            label="用户名"
            placeholder="请输入用户名"
            value={values.username}
            onChange={handleChange('username')}
            error={errors.username}
            leftIcon={<User className="w-4 h-4" />}
            clearable
            showCharCount
            maxLength={20}
            required
            validationState={errors.username ? 'error' : values.username ? 'success' : 'default'}
          />

          <Input
            label="邮箱地址"
            type="email"
            placeholder="请输入邮箱地址"
            value={values.email}
            onChange={handleChange('email')}
            error={errors.email}
            leftIcon={<Mail className="w-4 h-4" />}
            clearable
            required
            validationState={errors.email ? 'error' : values.email ? 'success' : 'default'}
          />

          <Input
            label="密码"
            type="password"
            placeholder="请输入密码"
            value={values.password}
            onChange={handleChange('password')}
            error={errors.password}
            leftIcon={<Lock className="w-4 h-4" />}
            showPasswordToggle
            showCharCount
            maxLength={32}
            required
            helperText="密码至少8位，包含字母和数字"
            validationState={errors.password ? 'error' : values.password ? 'success' : 'default'}
          />
        </div>

        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="text-sm font-medium mb-2">当前状态：</h3>
          <pre className="text-xs text-gray-600 dark:text-gray-400">
            {JSON.stringify({ values, errors }, null, 2)}
          </pre>
        </div>
      </div>
    )
  }
}

// 深色模式示例
export const DarkMode: Story = {
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  },
  render: () => (
    <div className="space-y-4 w-80">
      <Input
        label="邮箱地址"
        placeholder="请输入邮箱地址"
        leftIcon={<Mail className="w-4 h-4" />}
        clearable
      />
      <Input
        label="密码"
        type="password"
        placeholder="请输入密码"
        showPasswordToggle
        leftIcon={<Lock className="w-4 h-4" />}
      />
      <Input
        label="搜索"
        placeholder="搜索内容..."
        leftIcon={<Search className="w-4 h-4" />}
        clearable
      />
    </div>
  )
}