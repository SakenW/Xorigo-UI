import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Switch } from './switch'
import type { SwitchProps } from './switch'

/**
 * Switch组件的Storybook故事
 *
 * 展示了Switch组件的各种用法、状态和配置选项
 */
const meta = {
  title: 'Form/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Switch 开关组件

基于Xorigo UI七轴主题系统的开关切换组件，支持多种样式、尺寸和状态。

## 特性

- 🎨 **7种主题配方支持** - 适配所有七轴主题
- 🎭 **4种变体样式** - default, primary, success, danger, outline
- 📏 **3种尺寸规格** - sm, md, lg
- ⚡ **加载状态支持** - 内置加载指示器
- 🎯 **可访问性优先** - 完整的ARIA支持
- 🎬 **流畅动画** - Framer Motion 12驱动
- 🎪 **图标支持** - 自定义thumb图标
- 🏷️ **标签系统** - 灵活的标签和描述

## 使用指南

### 基础用法
\`\`\`tsx
<Switch label="Enable notifications" />
\`\`\`

### 受控组件
\`\`\`tsx
const [enabled, setEnabled] = useState(false)
<Switch
  checked={enabled}
  onCheckedChange={setEnabled}
  label="Auto-save"
/>
\`\`\`

### 加载状态
\`\`\`tsx
<Switch
  loading
  label="Saving..."
  defaultChecked
/>
\`\`\`

## 主题集成

Switch组件完全集成了Xorigo UI的七轴主题系统：

- **模式轴**: 自动适配浅色/深色模式
- **色调轴**: 使用主题色彩令牌
- **饱和度轴**: 色彩鲜艳度适配
- **亮度轴**: 明暗程度适配
- **密度轴**: 空间紧凑度适配
- **圆度轴**: 边角圆润度适配
- **对比度轴**: 视觉对比度适配

## 可访问性

- 支持键盘导航 (Space, Enter)
- 完整的ARIA属性
- 高对比度模式适配
- 屏幕阅读器友好
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'danger', 'outline'],
      description: '开关的视觉变体',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '开关的尺寸',
    },
    status: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
      description: '开关的状态',
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: '标签的位置',
    },
    checked: {
      control: 'boolean',
      description: '是否选中',
    },
    defaultChecked: {
      control: 'boolean',
      description: '默认是否选中',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    loading: {
      control: 'boolean',
      description: '是否显示加载状态',
    },
    label: {
      control: 'text',
      description: '标签文本',
    },
    description: {
      control: 'text',
      description: '描述文本',
    },
    onCheckedChange: {
      action: 'checkedChange',
      description: '选中状态变化回调',
    },
    onChange: {
      action: 'change',
      description: '原生change事件',
    },
  },
  args: {
    label: 'Enable notifications',
    variant: 'primary',
    size: 'md',
    status: 'default',
    labelPosition: 'right',
    checked: false,
    defaultChecked: false,
    disabled: false,
    loading: false,
    onCheckedChange: fn(),
    onChange: fn(),
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 基础开关 - 展示默认状态
 */
export const Default: Story = {
  args: {
    label: 'Enable notifications',
  },
}

/**
 * 不同变体 - 展示所有视觉变体
 */
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <Switch label="Default" variant="default" defaultChecked />
      <Switch label="Primary" variant="primary" defaultChecked />
      <Switch label="Success" variant="success" defaultChecked />
      <Switch label="Danger" variant="danger" defaultChecked />
      <Switch label="Outline" variant="outline" defaultChecked />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示所有可用的视觉变体样式',
      },
    },
  },
}

/**
 * 不同尺寸 - 展示所有尺寸规格
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Switch label="Small size" size="sm" />
      <Switch label="Medium size" size="md" defaultChecked />
      <Switch label="Large size" size="lg" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示所有可用的尺寸规格',
      },
    },
  },
}

/**
 * 状态展示 - 展示不同的状态样式
 */
export const Statuses: Story = {
  render: () => (
    <div className="space-y-4">
      <Switch label="Default status" status="default" />
      <Switch label="Error status" status="error" />
      <Switch label="Success status" status="success" defaultChecked />
      <Switch label="Warning status" status="warning" defaultChecked />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示所有可用的状态样式',
      },
    },
  },
}

/**
 * 标签位置 - 展示不同的标签位置
 */
export const LabelPositions: Story = {
  render: () => (
    <div className="space-y-4">
      <Switch label="Left label" labelPosition="left" />
      <Switch label="Right label" labelPosition="right" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示标签的不同位置配置',
      },
    },
  },
}

/**
 * 带描述 - 展示标签和描述的组合
 */
export const WithDescription: Story = {
  render: () => (
    <div className="space-y-4">
      <Switch
        label="Email notifications"
        description="Receive email updates about your account activity"
        defaultChecked
      />
      <Switch
        label="Marketing emails"
        description="Get emails about new features and special offers"
      />
      <Switch
        label="Security alerts"
        description="Important security notifications about your account"
        defaultChecked
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示带有描述文本的开关',
      },
    },
  },
}

/**
 * 禁用状态 - 展示禁用的开关
 */
export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <Switch label="Disabled (unchecked)" disabled />
      <Switch label="Disabled (checked)" disabled defaultChecked />
      <Switch label="Disabled with description" disabled description="This feature is currently unavailable" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示禁用状态下的开关',
      },
    },
  },
}

/**
 * 加载状态 - 展示加载中的开关
 */
export const Loading: Story = {
  render: () => (
    <div className="space-y-4">
      <Switch label="Loading..." loading />
      <Switch label="Processing" loading defaultChecked />
      <Switch label="Saving settings" loading description="Please wait while we save your preferences" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示加载状态下的开关，此时开关会被禁用并显示加载指示器',
      },
    },
  },
}

/**
 * 带图标 - 展示带自定义图标的开关
 */
export const WithIcons: Story = {
  render: () => {
    const SunIcon = () => <span className="text-yellow-500">☀️</span>
    const MoonIcon = () => <span className="text-blue-500">🌙</span>
    const CheckIcon = () => <span className="text-green-500">✓</span>
    const CloseIcon = () => <span className="text-red-500">✕</span>

    return (
      <div className="space-y-4">
        <Switch
          label="Dark mode"
          description="Toggle between light and dark themes"
          thumbIcon={<SunIcon />}
        />
        <Switch
          label="Auto-save"
          description="Automatically save your changes"
          defaultChecked
          thumbIcon={<CheckIcon />}
        />
        <Switch
          label="Notifications"
          description="Enable push notifications"
          thumbIcon={<CloseIcon />}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '展示带有自定义thumb图标的开关',
      },
    },
  },
}

/**
 * 受控组件 - 展示受控状态下的开关
 */
export const Controlled: Story = {
  render: () => {
    const [notifications, setNotifications] = React.useState(true)
    const [marketing, setMarketing] = React.useState(false)
    const [security, setSecurity] = React.useState(true)

    return (
      <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-2">
          Controlled Switch Demo
        </div>
        <Switch
          label="Email notifications"
          description="Receive email updates about your account"
          checked={notifications}
          onCheckedChange={setNotifications}
        />
        <Switch
          label="Marketing emails"
          description="Get emails about new features"
          checked={marketing}
          onCheckedChange={setMarketing}
        />
        <Switch
          label="Security alerts"
          description="Important security notifications"
          checked={security}
          onCheckedChange={setSecurity}
        />
        <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
          Current states: notifications={notifications.toString()}, marketing={marketing.toString()}, security={security.toString()}
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '展示受控状态下的开关，可以通过状态管理控制开关的选中状态',
      },
    },
  },
}

/**
 * 表单集成 - 展示在表单中的使用
 */
export const FormIntegration: Story = {
  render: () => {
    return (
      <form className="space-y-4 max-w-md">
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Account Settings
          </h3>

          <div className="space-y-4">
            <Switch
              label="Two-factor authentication"
              description="Add an extra layer of security to your account"
              defaultChecked
            />
            <Switch
              label="Login notifications"
              description="Get notified when someone logs into your account"
              defaultChecked
            />
            <Switch
              label="Privacy mode"
              description="Make your profile private to other users"
            />
            <Switch
              label="Data sharing"
              description="Share anonymous usage data to help improve our service"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Settings
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '展示在真实表单场景中的开关使用',
      },
    },
  },
}

/**
 * 主题适配 - 展示在不同主题下的表现
 */
export const ThemeAdaptation: Story = {
  render: () => {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Theme Adaptation Demo
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Switch组件自动适配七轴主题系统的所有配方
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Light Mode</h4>
            <div className="space-y-3">
              <Switch label="Primary" variant="primary" />
              <Switch label="Success" variant="success" defaultChecked />
              <Switch label="Danger" variant="danger" />
              <Switch label="Outline" variant="outline" defaultChecked />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-sm">Dark Mode</h4>
            <div className="space-y-3">
              <Switch label="Primary" variant="primary" />
              <Switch label="Success" variant="success" defaultChecked />
              <Switch label="Danger" variant="danger" />
              <Switch label="Outline" variant="outline" defaultChecked />
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          💡 Switch组件支持所有七轴主题配方：professional, creative, minimal, seasonal, lavender, cherry, graphite, pearl, golden, crystal
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '展示Switch组件在七轴主题系统下的自动适配能力',
      },
    },
  },
}

/**
 * 交互演示 - 展示完整的交互功能
 */
export const InteractiveDemo: Story = {
  render: () => {
    const [settings, setSettings] = React.useState({
      notifications: true,
      marketing: false,
      security: true,
      analytics: false,
      beta: true,
    })

    const handleToggle = (key: keyof typeof settings) => (value: boolean) => {
      setSettings(prev => ({ ...prev, [key]: value }))
    }

    const hasChanges = Object.entries(settings).some(([key, value]) => {
      const defaults = { notifications: true, marketing: false, security: true, analytics: false, beta: true }
      return defaults[key as keyof typeof defaults] !== value
    })

    return (
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Interactive Settings
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Toggle the switches to see real-time updates
          </p>
        </div>

        <div className="space-y-4">
          <Switch
            label="Push Notifications"
            description="Receive real-time notifications on your device"
            checked={settings.notifications}
            onCheckedChange={handleToggle('notifications')}
            variant="primary"
          />

          <Switch
            label="Marketing Communications"
            description="Email about new features and promotions"
            checked={settings.marketing}
            onCheckedChange={handleToggle('marketing')}
            variant="default"
          />

          <Switch
            label="Security Alerts"
            description="Critical security notifications"
            checked={settings.security}
            onCheckedChange={handleToggle('security')}
            variant="success"
          />

          <Switch
            label="Usage Analytics"
            description="Share anonymous usage data"
            checked={settings.analytics}
            onCheckedChange={handleToggle('analytics')}
            variant="default"
          />

          <Switch
            label="Beta Features"
            description="Access to new experimental features"
            checked={settings.beta}
            onCheckedChange={handleToggle('beta')}
            variant="outline"
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {hasChanges ? 'You have unsaved changes' : 'All settings saved'}
          </div>
          <button
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              hasChanges
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!hasChanges}
          >
            {hasChanges ? 'Save Changes' : 'Saved'}
          </button>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '展示完整的交互功能，包括状态管理和实时更新',
      },
    },
  },
}