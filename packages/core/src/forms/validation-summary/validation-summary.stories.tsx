/**
 * @fileoverview ValidationSummary 组件 Storybook 故事
 * @author Xorigo UI Team
 * @version 0.1.0
 */

import type { Meta, StoryObj } from '@storybook/react'
import { ValidationSummary, type ValidationSummaryItem } from './validation-summary'
import { userEvent, within } from '@storybook/testing-library'
import { expect } from '@storybook/test'

// ==============================
// Meta 配置
// ==============================

const meta = {
  title: 'Forms/ValidationSummary',
  component: ValidationSummary,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# ValidationSummary 组件

ValidationSummary 是一个用于显示表单校验结果汇总的组件。它能够展示多个字段的错误信息，支持分组显示、跳转到错误字段、自动滚动等高级功能。

## 特性

- ✅ 显示所有字段校验错误
- ✅ 支持按字段分组显示
- ✅ 支持错误级别分类
- ✅ 支持跳转到错误字段
- ✅ 支持错误计数显示
- ✅ 支持自动滚动定位
- ✅ 支持可关闭状态
- ✅ 支持自定义错误渲染
- ✅ 支持图标显示
- ✅ 支持响应式设计
- ✅ 支持深色主题
- ✅ 完整的可访问性支持

## 使用场景

- 表单提交前的校验结果展示
- 分步表单的错误汇总
- 多字段校验的状态反馈
- 错误导航和快速定位

## 技术特性

- React 19 + TypeScript 5.9
- Tailwind CSS 4
- Framer Motion 12 动画
- 七轴主题系统集成
- 完整的 TypeScript 类型支持
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'warning', 'info', 'success'],
      description: '组件变体样式'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '组件尺寸'
    },
    severity: {
      control: 'select',
      options: ['critical', 'major', 'minor'],
      description: '严重程度级别'
    },
    layout: {
      control: 'select',
      options: ['list', 'grouped', 'compact'],
      description: '布局模式'
    },
    grouped: {
      control: 'boolean',
      description: '是否启用分组模式'
    },
    dismissible: {
      control: 'boolean',
      description: '是否可关闭'
    },
    hideWhenEmpty: {
      control: 'boolean',
      description: '是否在无错误时隐藏'
    },
    hideCount: {
      control: 'boolean',
      description: '是否隐藏错误计数'
    },
    autoScroll: {
      control: 'boolean',
      description: '是否自动滚动到组件'
    },
    disableNavigation: {
      control: 'boolean',
      description: '禁用跳转功能'
    }
  }
} satisfies Meta<typeof ValidationSummary>

export default meta

type Story = StoryObj<typeof meta>

// ==============================
// 故事数据
// ==============================

const defaultItems: ValidationSummaryItem[] = [
  {
    id: 'email-error',
    name: 'email',
    label: '邮箱地址',
    message: '请输入有效的邮箱地址',
    status: 'error',
    severity: 'major',
    code: 'INVALID_EMAIL',
    group: '基本信息',
    fieldId: 'email-input'
  },
  {
    id: 'password-error',
    name: 'password',
    label: '密码',
    message: '密码至少需要 8 个字符，包含大小写字母、数字和特殊字符',
    status: 'error',
    severity: 'critical',
    code: 'PASSWORD_TOO_SHORT',
    group: '基本信息',
    fieldId: 'password-input'
  },
  {
    id: 'confirm-password-error',
    name: 'confirmPassword',
    label: '确认密码',
    message: '两次输入的密码不一致',
    status: 'error',
    severity: 'major',
    code: 'PASSWORD_MISMATCH',
    group: '基本信息',
    fieldId: 'confirm-password-input'
  },
  {
    id: 'phone-warning',
    name: 'phone',
    label: '手机号',
    message: '建议使用手机号码格式：13800138000',
    status: 'warning',
    severity: 'minor',
    group: '联系信息',
    fieldId: 'phone-input'
  },
  {
    id: 'address-error',
    name: 'address',
    label: '地址',
    message: '请输入完整的地址信息，包括省、市、区、街道',
    status: 'error',
    severity: 'major',
    group: '联系信息',
    fieldId: 'address-input'
  },
  {
    id: 'zipcode-error',
    name: 'zipcode',
    label: '邮政编码',
    message: '请输入正确的邮政编码',
    status: 'error',
    severity: 'minor',
    group: '联系信息',
    fieldId: 'zipcode-input'
  }
]

// ==============================
// 基础故事
// ==============================

export const Default: Story = {
  args: {
    items: defaultItems,
    title: '校验错误'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 验证组件渲染
    await expect(canvas.getByText('校验错误')).toBeInTheDocument()
    await expect(canvas.getByText('6 个错误')).toBeInTheDocument()

    // 验证错误项目渲染
    await expect(canvas.getByText('请输入有效的邮箱地址')).toBeInTheDocument()
    await expect(canvas.getByText('密码至少需要 8 个字符')).toBeInTheDocument()

    // 验证分组
    await expect(canvas.getByText('基本信息')).toBeInTheDocument()
    await expect(canvas.getByText('联系信息')).toBeInTheDocument()
  }
}

// ==============================
// 不同严重程度的故事
// ==============================

export const CriticalErrors: Story = {
  args: {
    items: [
      {
        id: 'critical-1',
        name: 'password',
        label: '密码',
        message: '密码不符合安全要求',
        status: 'error',
        severity: 'critical',
        code: 'WEAK_PASSWORD',
        group: '安全',
        fieldId: 'password-input'
      }
    ],
    severity: 'critical',
    title: '严重错误'
  }
}

export const MajorErrors: Story = {
  args: {
    items: [
      {
        id: 'major-1',
        name: 'email',
        label: '邮箱',
        message: '请输入有效的邮箱地址',
        status: 'error',
        severity: 'major'
      },
      {
        id: 'major-2',
        name: 'phone',
        label: '手机号',
        message: '手机号格式不正确',
        status: 'error',
        severity: 'major'
      }
    ],
    severity: 'major',
    title: '主要错误'
  }
}

export const MinorErrors: Story = {
  args: {
    items: [
      {
        id: 'minor-1',
        name: 'username',
        label: '用户名',
        message: '建议使用更复杂的用户名',
        status: 'warning',
        severity: 'minor'
      }
    ],
    severity: 'minor',
    title: '轻微问题'
  }
}

// ==============================
// 不同变体的故事
// ==============================

export const Destructive: Story = {
  args: {
    items: defaultItems,
    variant: 'destructive',
    title: '危险状态'
  }
}

export const Warning: Story = {
  args: {
    items: [
      {
        id: 'warning-1',
        name: 'session',
        label: '会话',
        message: '您的会话将在 5 分钟后过期',
        status: 'warning',
        severity: 'major'
      }
    ],
    variant: 'warning',
    title: '警告信息'
  }
}

export const Info: Story = {
  args: {
    items: [
      {
        id: 'info-1',
        name: 'info',
        label: '提示',
        message: '请仔细阅读用户协议',
        status: 'info',
        severity: 'minor'
      }
    ],
    variant: 'info',
    title: '提示信息'
  }
}

export const Success: Story = {
  args: {
    items: [
      {
        id: 'success-1',
        name: 'success',
        label: '成功',
        message: '所有校验通过',
        status: 'success',
        severity: 'minor'
      }
    ],
    variant: 'success',
    title: '成功状态'
  }
}

// ==============================
// 不同尺寸的故事
// ==============================

export const SmallSize: Story = {
  args: {
    items: defaultItems.slice(0, 3),
    size: 'sm',
    title: '小尺寸'
  }
}

export const MediumSize: Story = {
  args: {
    items: defaultItems.slice(0, 3),
    size: 'md',
    title: '中等尺寸'
  }
}

export const LargeSize: Story = {
  args: {
    items: defaultItems.slice(0, 3),
    size: 'lg',
    title: '大尺寸'
  }
}

// ==============================
// 不同布局模式的故事
// ==============================

export const ListLayout: Story = {
  args: {
    items: defaultItems.slice(0, 4),
    layout: 'list',
    grouped: false,
    title: '列表布局'
  }
}

export const GroupedLayout: Story = {
  args: {
    items: defaultItems,
    layout: 'grouped',
    grouped: true,
    title: '分组布局'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 验证分组显示
    await expect(canvas.getByText('基本信息 (3)')).toBeInTheDocument()
    await expect(canvas.getByText('联系信息 (3)')).toBeInTheDocument()

    // 测试分组折叠
    const groupHeader = canvas.getByText('基本信息')
    await userEvent.click(groupHeader.closest('button')!)

    await expect(canvas.queryByText('请输入有效的邮箱地址')).not.toBeInTheDocument()
  }
}

export const CompactLayout: Story = {
  args: {
    items: defaultItems.slice(0, 4),
    layout: 'compact',
    grouped: false,
    title: '紧凑布局'
  }
}

// ==============================
// 功能特性故事
// ==============================

export const Dismissible: Story = {
  args: {
    items: defaultItems.slice(0, 3),
    dismissible: true,
    onDismiss: () => alert('组件已关闭'),
    title: '可关闭'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const dismissButton = canvas.getByLabelText('关闭错误汇总')
    await userEvent.click(dismissButton)
  }
}

export const WithNavigation: Story = {
  args: {
    items: defaultItems.slice(0, 3),
    onNavigateToField: (item) => {
      alert(`跳转到字段: ${item.label || item.name}`)
    },
    title: '带导航功能',
    grouped: false
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 验证跳转按钮存在
    const navButtons = canvas.getAllByLabelText(/跳转到字段/)
    expect(navButtons.length).toBeGreaterThan(0)

    // 点击第一个跳转按钮
    await userEvent.click(navButtons[0])
  }
}

export const WithoutNavigation: Story = {
  args: {
    items: defaultItems.slice(0, 3),
    disableNavigation: true,
    title: '禁用导航',
    grouped: false
  }
}

export const WithCopy: Story = {
  args: {
    items: defaultItems.slice(0, 3),
    title: '带复制功能',
    grouped: false
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 验证复制按钮
    await expect(canvas.getByText('复制错误')).toBeInTheDocument()

    const copyButton = canvas.getByLabelText('复制错误消息')
    await userEvent.click(copyButton)

    // 验证复制状态变化
    await expect(await canvas.findByText('已复制')).toBeInTheDocument()
  }
}

export const AutoScroll: Story = {
  args: {
    items: defaultItems,
    autoScroll: true,
    scrollOffset: 100,
    title: '自动滚动',
    id: 'auto-scroll-demo'
  }
}

// ==============================
// 计数和显示选项故事
// ==============================

export const HideCount: Story = {
  args: {
    items: defaultItems.slice(0, 3),
    hideCount: true,
    title: '隐藏计数'
  }
}

export const CustomCountTemplate: Story = {
  args: {
    items: defaultItems,
    countTemplate: '发现 {count} 个问题需要处理',
    title: '自定义计数文本'
  }
}

export const ShowWhenEmpty: Story = {
  args: {
    items: [],
    hideWhenEmpty: false,
    title: '空状态显示'
  }
}

export const MaxItems: Story = {
  args: {
    items: defaultItems,
    maxItems: 3,
    onShowMore: () => alert('显示更多错误'),
    showMoreText: '查看更多',
    title: '最大显示项目数'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 验证显示更多按钮
    await expect(canvas.getByText('查看更多')).toBeInTheDocument()
    await expect(canvas.getByText('+3')).toBeInTheDocument()
  }
}

// ==============================
// 分组功能故事
// ==============================

export const CollapsibleGroups: Story = {
  args: {
    items: defaultItems,
    grouped: true,
    defaultExpandedGroups: ['基本信息'],
    onExpandedGroupsChange: (groups) => {
      console.log('Expanded groups:', groups)
    },
    title: '可折叠分组'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 验证基本信息分组已展开
    await expect(canvas.getByText('请输入有效的邮箱地址')).toBeInTheDocument()

    // 验证联系信息分组默认折叠
    await expect(canvas.queryByText('请输入完整的地址信息')).not.toBeInTheDocument()
  }
}

export const AllGroupsExpanded: Story = {
  args: {
    items: defaultItems,
    grouped: true,
    expanded: true,
    title: '全部展开'
  }
}

export const CustomExpandIcons: Story = {
  args: {
    items: defaultItems,
    grouped: true,
    expandIcon: <span>▶</span>,
    collapseIcon: <span>▼</span>,
    title: '自定义展开图标'
  }
}

// ==============================
// 自定义样式故事
// ==============================

export const CustomTitle: Story = {
  args: {
    items: defaultItems.slice(0, 3),
    title: '表单校验失败 - 请检查以下项目',
    title: '表单校验失败 - 请检查以下项目',
    countTemplate: '共 {count} 处错误'
  }
}

export const CustomIcon: Story = {
  args: {
    items: defaultItems.slice(0, 3),
    icon: <span className="text-2xl">⚠️</span>,
    title: '自定义图标'
  }
}

export const CustomClassName: Story = {
  args: {
    items: defaultItems.slice(0, 3),
    className: 'border-2 border-dashed border-gray-400',
    title: '自定义样式'
  }
}

// ==============================
// 复杂场景故事
// ==============================

export const ComplexFormErrors: Story = {
  args: {
    items: [
      // 基本信息组
      {
        id: 'email-error',
        name: 'email',
        label: '邮箱地址',
        message: '请输入有效的邮箱地址',
        status: 'error',
        severity: 'critical',
        code: 'INVALID_EMAIL',
        group: '基本信息',
        fieldId: 'email-input'
      },
      {
        id: 'password-error',
        name: 'password',
        label: '密码',
        message: '密码至少需要 8 个字符',
        status: 'error',
        severity: 'critical',
        code: 'WEAK_PASSWORD',
        group: '基本信息',
        fieldId: 'password-input'
      },
      {
        id: 'username-warning',
        name: 'username',
        label: '用户名',
        message: '用户名已被占用',
        status: 'warning',
        severity: 'major',
        group: '基本信息',
        fieldId: 'username-input'
      },
      // 联系信息组
      {
        id: 'phone-error',
        name: 'phone',
        label: '手机号',
        message: '请输入正确的手机号',
        status: 'error',
        severity: 'major',
        code: 'INVALID_PHONE',
        group: '联系信息',
        fieldId: 'phone-input'
      },
      {
        id: 'address-error',
        name: 'address',
        label: '地址',
        message: '地址不能为空',
        status: 'error',
        severity: 'major',
        group: '联系信息',
        fieldId: 'address-input'
      },
      // 支付信息组
      {
        id: 'card-error',
        name: 'cardNumber',
        label: '卡号',
        message: '请输入有效的信用卡号',
        status: 'error',
        severity: 'critical',
        code: 'INVALID_CARD',
        group: '支付信息',
        fieldId: 'card-input'
      }
    ],
    variant: 'destructive',
    severity: 'critical',
    grouped: true,
    dismissible: true,
    onDismiss: () => alert('已关闭'),
    title: '复杂表单错误汇总',
    countTemplate: '{count} 项校验失败'
  }
}

// ==============================
// 无障碍访问故事
// ==============================

export const Accessibility: Story = {
  args: {
    items: defaultItems.slice(0, 2),
    title: '可访问性支持',
    ariaDescription: '此组件包含表单校验错误信息，使用 aria-live 属性进行通知'
  },
  parameters: {
    docs: {
      description: {
        story: `
此组件完全支持可访问性标准：

- ✅ 具有正确的 ARIA 角色 (role="alert")
- ✅ 使用 aria-live="polite" 进行状态通知
- ✅ 所有按钮都有可访问的标签
- ✅ 支持键盘导航
- ✅ 正确的焦点管理
        `
      }
    }
  }
}

// ==============================
// 响应式设计故事
// ==============================

export const Responsive: Story = {
  args: {
    items: defaultItems,
    grouped: true,
    title: '响应式设计'
  },
  parameters: {
    docs: {
      description: {
        story: `
组件在不同屏幕尺寸下的表现：

- 移动端 (< 640px)：单列布局，紧凑间距
- 平板端 (640px - 1024px)：适配中等间距
- 桌面端 (> 1024px)：完整布局，优化间距
        `
      }
    }
  },
  render: (args) => (
    <div className="w-full max-w-4xl">
      <ValidationSummary {...args} />
    </div>
  )
}

// ==============================
// 主题系统故事
// ==============================

export const LightTheme: Story = {
  args: {
    items: defaultItems.slice(0, 3),
    title: '浅色主题'
  },
  parameters: {
    docs: {
      description: {
        story: '组件在浅色主题下的默认样式'
      }
    }
  }
}

export const DarkTheme: Story = {
  args: {
    items: defaultItems.slice(0, 3),
    title: '深色主题'
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    },
    docs: {
      description: {
        story: '组件在深色主题下的样式，自动适配七轴主题系统'
      }
    }
  }
}
