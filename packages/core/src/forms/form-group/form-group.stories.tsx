/**
 * @fileoverview FormGroup 组件 Storybook 故事文件
 * @description 展示表单组组件的各种使用场景和配置选项
 */

import type { Meta, StoryObj } from '@storybook/react'
import { FormGroup, NestedFormGroup } from './form-group'
import { Input } from '../../inputs'
import { Button } from '../primitives'
import { cn } from '../../utils'

// ============================================================================
// 元数据配置
// ============================================================================

const meta = {
  title: 'Form/FormGroup',
  component: FormGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**表单组组件**

表单组组件用于将相关表单字段进行逻辑分组，提供以下核心功能：

### 主要特性
- ✅ 表单字段组容器组件
- ✅ 支持多个相关字段的逻辑分组
- ✅ 支持组标题和描述
- ✅ 支持组级别验证
- ✅ 支持必填组标记
- ✅ 支持禁用整个组
- ✅ 支持折叠展开
- ✅ 支持网格布局
- ✅ 支持响应式设计
- ✅ 支持嵌套组
- ✅ 支持错误汇总显示
- ✅ 支持自定义间距
- ✅ TypeScript 类型安全
- ✅ React Context 集成
- ✅ 可访问性支持

### 使用场景
- 用户信息分组（基本信息、联系方式等）
- 地址信息分组（街道、城市、邮编等）
- 支付信息分组（卡号、有效期、CVV等）
- 复杂表单的步骤分组
- 可折叠的高级设置
- 多步骤表单的章节

### 技术特性
- 支持 4 种样式变体（default、bordered、ghost、filled）
- 支持 4 种尺寸（sm、md、lg、xl）
- 支持 4 种布局（single、grid、double、triple）
- 完全的类型安全
- 完整的可访问性支持
- 流畅的动画过渡
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'ghost', 'filled'],
      description: '样式变体',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: '尺寸',
    },
    layout: {
      control: 'select',
      options: ['single', 'grid', 'double', 'triple'],
      description: '内容布局',
    },
    title: {
      control: 'text',
      description: '组标题',
    },
    description: {
      control: 'text',
      description: '组描述',
    },
    helpText: {
      control: 'text',
      description: '帮助文本',
    },
    required: {
      control: 'boolean',
      description: '是否为必填组',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    collapsible: {
      control: 'boolean',
      description: '是否可折叠',
    },
    defaultCollapsed: {
      control: 'boolean',
      description: '默认折叠状态',
    },
    error: {
      control: 'text',
      description: '错误消息',
    },
    warning: {
      control: 'text',
      description: '警告消息',
    },
    info: {
      control: 'text',
      description: '信息消息',
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-4xl">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof FormGroup>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// 基础示例
// ============================================================================

export const Basic: Story = {
  args: {
    title: '基本信息',
    description: '请填写您的基本信息',
    children: (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">姓名</label>
          <Input placeholder="请输入姓名" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">邮箱</label>
          <Input type="email" placeholder="请输入邮箱" />
        </div>
      </div>
    ),
  },
}

// ============================================================================
// 样式变体
// ============================================================================

export const Variants: Story = {
  render: () => (
    <div className="space-y-6">
      <FormGroup
        variant="default"
        title="Default 变体"
        description="默认样式，带有浅色边框和背景"
      >
        <div>内容区域</div>
      </FormGroup>

      <FormGroup
        variant="bordered"
        title="Bordered 变体"
        description="更粗的边框和深色背景"
      >
        <div>内容区域</div>
      </FormGroup>

      <FormGroup
        variant="ghost"
        title="Ghost 变体"
        description="透明背景，无边框"
      >
        <div>内容区域</div>
      </FormGroup>

      <FormGroup
        variant="filled"
        title="Filled 变体"
        description="填充背景色"
      >
        <div>内容区域</div>
      </FormGroup>
    </div>
  ),
}

// ============================================================================
// 尺寸变体
// ============================================================================

export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <FormGroup
        size="sm"
        title="Small 尺寸"
        description="紧凑的尺寸，适合密集布局"
      >
        <div className="text-xs">小尺寸内容</div>
      </FormGroup>

      <FormGroup
        size="md"
        title="Medium 尺寸（默认）"
        description="标准尺寸，适合大多数场景"
      >
        <div className="text-sm">中等尺寸内容</div>
      </FormGroup>

      <FormGroup
        size="lg"
        title="Large 尺寸"
        description="更大的间距，适合重要信息"
      >
        <div className="text-base">大尺寸内容</div>
      </FormGroup>

      <FormGroup
        size="xl"
        title="Extra Large 尺寸"
        description="最大尺寸，适合页面级分组"
      >
        <div className="text-lg">超大尺寸内容</div>
      </FormGroup>
    </div>
  ),
}

// ============================================================================
// 布局模式
// ============================================================================

export const Layouts: Story = {
  render: () => (
    <div className="space-y-8">
      <FormGroup
        title="单列布局（默认）"
        description="垂直排列，适合复杂表单"
        layout="single"
      >
        <Input placeholder="字段1" />
        <Input placeholder="字段2" />
        <Input placeholder="字段3" />
      </FormGroup>

      <FormGroup
        title="网格布局"
        description="自动网格排列"
        layout="grid"
      >
        <Input placeholder="字段1" />
        <Input placeholder="字段2" />
        <Input placeholder="字段3" />
      </FormGroup>

      <FormGroup
        title="双列布局"
        description="响应式双列排列"
        layout="double"
      >
        <Input placeholder="字段1" />
        <Input placeholder="字段2" />
        <Input placeholder="字段3" />
        <Input placeholder="字段4" />
      </FormGroup>

      <FormGroup
        title="三列布局"
        description="响应式三列排列"
        layout="triple"
      >
        <Input placeholder="字段1" />
        <Input placeholder="字段2" />
        <Input placeholder="字段3" />
        <Input placeholder="字段4" />
        <Input placeholder="字段5" />
        <Input placeholder="字段6" />
      </FormGroup>
    </div>
  ),
}

// ============================================================================
// 可折叠表单组
// ============================================================================

export const Collapsible: Story = {
  args: {
    title: '高级设置',
    description: '可选的高级配置选项',
    collapsible: true,
    defaultCollapsed: true,
    children: (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">API 密钥</label>
          <Input type="password" placeholder="请输入API密钥" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">超时时间（秒）</label>
          <Input type="number" placeholder="30" />
        </div>
      </div>
    ),
  },
}

// ============================================================================
// 必填组
// ============================================================================

export const Required: Story = {
  args: {
    title: '必填信息',
    description: '以下信息为必填项',
    required: true,
    children: (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">身份证号</label>
          <Input placeholder="请输入身份证号" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">手机号码</label>
          <Input type="tel" placeholder="请输入手机号码" />
        </div>
      </div>
    ),
  },
}

// ============================================================================
// 可选组
// ============================================================================

export const Optional: Story = {
  args: {
    title: '可选信息',
    description: '以下信息可以选填',
    optional: true,
    showOptionalIndicator: true,
    children: (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">微信号</label>
          <Input placeholder="请输入微信号" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">QQ号</label>
          <Input placeholder="请输入QQ号" />
        </div>
      </div>
    ),
  },
}

// ============================================================================
// 禁用组
// ============================================================================

export const Disabled: Story = {
  args: {
    title: '已禁用组',
    description: '当前组不可编辑',
    disabled: true,
    children: (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 opacity-50">用户ID</label>
          <Input placeholder="不可编辑" disabled />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 opacity-50">创建时间</label>
          <Input placeholder="不可编辑" disabled />
        </div>
      </div>
    ),
  },
}

// ============================================================================
// 错误状态
// ============================================================================

export const WithError: Story = {
  args: {
    title: '错误示例',
    description: '显示组级别错误',
    error: '表单验证失败，请检查以下错误',
    children: (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">邮箱</label>
          <Input placeholder="请输入邮箱" className="border-red-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">密码</label>
          <Input type="password" placeholder="请输入密码" className="border-red-500" />
        </div>
      </div>
    ),
  },
}

// ============================================================================
// 警告状态
// ============================================================================

export const WithWarning: Story = {
  args: {
    title: '警告示例',
    description: '显示组级别警告',
    warning: '密码强度较弱，建议使用更复杂的密码',
    children: (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">新密码</label>
          <Input type="password" placeholder="请输入新密码" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">确认密码</label>
          <Input type="password" placeholder="请再次输入密码" />
        </div>
      </div>
    ),
  },
}

// ============================================================================
// 信息状态
// ============================================================================

export const WithInfo: Story = {
  args: {
    title: '信息提示',
    description: '显示组级别信息',
    info: '您的信息将被安全加密存储',
    children: (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">银行卡号</label>
          <Input placeholder="请输入银行卡号" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">有效期</label>
          <Input placeholder="MM/YY" />
        </div>
      </div>
    ),
  },
}

// ============================================================================
// 嵌套表单组
// ============================================================================

export const Nested: Story = {
  render: () => (
    <div className="space-y-6">
      <FormGroup
        title="用户信息"
        description="主要用户信息"
        layout="double"
      >
        <div>
          <label className="block text-sm font-medium mb-1">姓名</label>
          <Input placeholder="请输入姓名" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">邮箱</label>
          <Input type="email" placeholder="请输入邮箱" />
        </div>

        <NestedFormGroup
          title="联系方式"
          description="详细联系方式"
          depth={1}
        >
          <div>
            <label className="block text-sm font-medium mb-1">手机号码</label>
            <Input placeholder="请输入手机号码" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">固定电话</label>
            <Input placeholder="请输入固定电话" />
          </div>

          <NestedFormGroup
            title="紧急联系人"
            description="紧急情况联系人信息"
            depth={2}
          >
            <div>
              <label className="block text-sm font-medium mb-1">联系人姓名</label>
              <Input placeholder="请输入联系人姓名" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">联系人电话</label>
              <Input placeholder="请输入联系人电话" />
            </div>
          </NestedFormGroup>
        </NestedFormGroup>
      </FormGroup>
    </div>
  ),
}

// ============================================================================
// 完整表单示例
// ============================================================================

export const CompleteForm: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <FormGroup
        title="基本信息"
        description="请填写您的基本信息"
        required
        layout="double"
      >
        <div>
          <label className="block text-sm font-medium mb-1">姓名 *</label>
          <Input placeholder="请输入真实姓名" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">邮箱 *</label>
          <Input type="email" placeholder="请输入邮箱地址" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">手机号 *</label>
          <Input type="tel" placeholder="请输入手机号码" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">生日</label>
          <Input type="date" />
        </div>
      </FormGroup>

      <FormGroup
        title="地址信息"
        description="请填写您的地址信息"
        layout="single"
      >
        <div>
          <label className="block text-sm font-medium mb-1">详细地址</label>
          <Input placeholder="街道、门牌号等" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">省份</label>
            <Input placeholder="省份" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">城市</label>
            <Input placeholder="城市" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">邮编</label>
            <Input placeholder="邮编" />
          </div>
        </div>
      </FormGroup>

      <FormGroup
        title="账户设置"
        collapsible
        defaultCollapsed
      >
        <div>
          <label className="block text-sm font-medium mb-1">用户名</label>
          <Input placeholder="请输入用户名" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">密码</label>
          <Input type="password" placeholder="请输入密码" />
        </div>
      </FormGroup>

      <div className="flex justify-end space-x-3">
        <Button variant="outline">取消</Button>
        <Button>提交</Button>
      </div>
    </div>
  ),
}

// ============================================================================
// 多步骤表单示例
// ============================================================================

export const MultiStepForm: Story = {
  render: () => (
    <div className="space-y-6 max-w-3xl">
      <FormGroup
        title="步骤 1：基本信息"
        description="填写您的基本信息"
        required
        layout="double"
      >
        <div>
          <label className="block text-sm font-medium mb-1">姓名 *</label>
          <Input placeholder="请输入姓名" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">身份证号 *</label>
          <Input placeholder="请输入身份证号" />
        </div>
      </FormGroup>

      <FormGroup
        title="步骤 2：联系方式"
        description="填写您的联系方式"
        required
        layout="double"
      >
        <div>
          <label className="block text-sm font-medium mb-1">手机号码 *</label>
          <Input type="tel" placeholder="请输入手机号码" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">电子邮箱 *</label>
          <Input type="email" placeholder="请输入邮箱" />
        </div>
      </FormGroup>

      <FormGroup
        title="步骤 3：详细信息"
        description="填写详细信息（可选）"
        optional
        showOptionalIndicator
        layout="single"
      >
        <div>
          <label className="block text-sm font-medium mb-1">职业</label>
          <Input placeholder="请输入职业" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">工作单位</label>
          <Input placeholder="请输入工作单位" />
        </div>
      </FormGroup>

      <FormGroup
        title="步骤 4：确认信息"
        description="请确认您填写的信息"
        variant="ghost"
      >
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            请检查以上信息是否正确，确认后点击提交按钮。
          </p>
        </div>
      </FormGroup>

      <div className="flex justify-between">
        <Button variant="outline">上一步</Button>
        <Button>提交</Button>
      </div>
    </div>
  ),
}

// ============================================================================
// 错误汇总示例
// ============================================================================

export const ErrorSummary: Story = {
  args: {
    title: '表单验证错误',
    description: '请修复以下错误后重新提交',
    error: [
      '邮箱格式不正确',
      '密码长度不能少于8位',
    ],
    children: (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">邮箱</label>
          <Input placeholder="请输入邮箱" className="border-red-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">密码</label>
          <Input type="password" placeholder="请输入密码" className="border-red-500" />
        </div>
      </div>
    ),
  },
}

// ============================================================================
// 复杂布局示例
// ============================================================================

export const ComplexLayout: Story = {
  render: () => (
    <div className="space-y-6 max-w-4xl">
      <FormGroup
        title="个人信息"
        description="完整的个人信息表单"
        required
        layout="grid"
      >
        <div>
          <label className="block text-sm font-medium mb-1">姓名</label>
          <Input placeholder="请输入姓名" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">性别</label>
          <Input placeholder="男/女" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">年龄</label>
          <Input type="number" placeholder="请输入年龄" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">生日</label>
          <Input type="date" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">手机号</label>
          <Input type="tel" placeholder="请输入手机号" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">邮箱</label>
          <Input type="email" placeholder="请输入邮箱" />
        </div>
      </FormGroup>

      <FormGroup
        title="地址信息"
        description="详细的地址信息"
        layout="single"
      >
        <div>
          <label className="block text-sm font-medium mb-1">详细地址</label>
          <Input placeholder="街道、门牌号等" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">国家</label>
            <Input placeholder="中国" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">省份</label>
            <Input placeholder="省份" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">城市</label>
            <Input placeholder="城市" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">区县</label>
            <Input placeholder="区县" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">邮编</label>
            <Input placeholder="邮编" />
          </div>
        </div>
      </FormGroup>

      <FormGroup
        title="其他信息"
        collapsible
        defaultCollapsed
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">职业</label>
            <Input placeholder="请输入职业" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">学历</label>
            <Input placeholder="请输入学历" />
          </div>
        </div>
      </FormGroup>
    </div>
  ),
}
