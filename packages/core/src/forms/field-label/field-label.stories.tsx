import type { Meta, StoryObj } from '@storybook/react';
import { FieldLabel, FieldLabelDescription } from './field-label';
import { Input } from '@/form/input';

/**
 * FieldLabel组件故事集
 */
const meta: Meta<typeof FieldLabel> = {
  title: 'Form/FieldLabel',
  component: FieldLabel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
FieldLabel组件是表单字段标签组件，提供了完整的表单字段标签功能。

## 功能特性
- ✅ 支持必填标记显示
- ✅ 支持可选标记显示
- ✅ 支持隐藏标签（屏幕阅读器可见）
- ✅ 支持图标集成
- ✅ 支持自定义样式
- ✅ 支持禁用状态
- ✅ 支持点击聚焦关联输入框
- ✅ 支持HTML标签可配置
- ✅ 支持描述文本
- ✅ TypeScript 类型安全
- ✅ React Context 集成
- ✅ 可访问性支持

## 使用场景
- 表单输入框的标签
- 表单字段的必填标记
- 字段描述文本显示
- 无障碍表单标签
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['default', 'secondary'],
      description: '标签变体',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: '标签尺寸',
    },
    isRequired: {
      control: 'boolean',
      description: '是否为必填字段',
    },
    isHidden: {
      control: 'boolean',
      description: '是否隐藏标签（屏幕阅读器可见）',
    },
    isDisabled: {
      control: 'boolean',
      description: '是否禁用状态',
    },
    icon: {
      control: 'text',
      description: '标签图标（emoji或文字）',
    },
    description: {
      control: 'text',
      description: '标签描述文本',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基础使用示例
 */
export const Basic: Story = {
  args: {
    htmlFor: 'basic-input',
    children: '用户名',
  },
  render: (args) => (
    <div className="w-[300px] space-y-2">
      <FieldLabel {...args} />
      <Input id="basic-input" placeholder="请输入用户名" />
    </div>
  ),
};

/**
 * 必填字段示例
 */
export const Required: Story = {
  args: {
    htmlFor: 'required-input',
    children: '邮箱地址',
    isRequired: true,
  },
  render: (args) => (
    <div className="w-[300px] space-y-2">
      <FieldLabel {...args} />
      <Input id="required-input" type="email" placeholder="请输入邮箱" />
    </div>
  ),
};

/**
 * 带描述的字段标签
 */
export const WithDescription: Story = {
  args: {
    htmlFor: 'desc-input',
    children: '密码',
    description: '密码长度至少8位，包含字母和数字',
  },
  render: (args) => (
    <div className="w-[300px] space-y-2">
      <FieldLabel {...args} />
      <Input id="desc-input" type="password" placeholder="请输入密码" />
    </div>
  ),
};

/**
 * 带图标的字段标签
 */
export const WithIcon: Story = {
  args: {
    htmlFor: 'icon-input',
    children: '手机号',
    icon: '📱',
    description: '请输入11位手机号码',
  },
  render: (args) => (
    <div className="w-[300px] space-y-2">
      <FieldLabel {...args} />
      <Input id="icon-input" placeholder="请输入手机号" />
    </div>
  ),
};

/**
 * 次要标签示例
 */
export const Secondary: Story = {
  args: {
    htmlFor: 'secondary-input',
    variant: 'secondary',
    children: '备注信息',
    description: '可选填写，提供更多相关信息',
  },
  render: (args) => (
    <div className="w-[300px] space-y-2">
      <FieldLabel {...args} />
      <Input id="secondary-input" placeholder="请输入备注" />
    </div>
  ),
};

/**
 * 不同尺寸示例
 */
export const Sizes: Story = {
  args: {
    htmlFor: 'size-input',
    children: '尺寸示例',
    size: 'md',
  },
  render: (args) => (
    <div className="w-[300px] space-y-4">
      <div className="space-y-2">
        <FieldLabel {...args} size="sm" htmlFor="size-sm">
          小号标签 (sm)
        </FieldLabel>
        <Input id="size-sm" size="sm" placeholder="小号输入框" />
      </div>
      <div className="space-y-2">
        <FieldLabel {...args} size="md" htmlFor="size-md">
          中号标签 (md)
        </FieldLabel>
        <Input id="size-md" size="md" placeholder="中号输入框" />
      </div>
      <div className="space-y-2">
        <FieldLabel {...args} size="lg" htmlFor="size-lg">
          大号标签 (lg)
        </FieldLabel>
        <Input id="size-lg" size="lg" placeholder="大号输入框" />
      </div>
    </div>
  ),
};

/**
 * 隐藏标签示例（屏幕阅读器可见）
 */
export const Hidden: Story = {
  args: {
    htmlFor: 'hidden-input',
    children: '搜索关键词',
    isHidden: true,
    description: '此标签对视觉隐藏，对屏幕阅读器可见',
  },
  render: (args) => (
    <div className="w-[300px] space-y-2">
      <FieldLabel {...args} />
      <Input id="hidden-input" placeholder="搜索..." />
    </div>
  ),
};

/**
 * 禁用状态示例
 */
export const Disabled: Story = {
  args: {
    htmlFor: 'disabled-input',
    children: '禁用标签',
    isDisabled: true,
    description: '此标签处于禁用状态',
  },
  render: (args) => (
    <div className="w-[300px] space-y-2">
      <FieldLabel {...args} />
      <Input id="disabled-input" disabled placeholder="禁用输入框" />
    </div>
  ),
};

/**
 * 完整表单示例
 */
export const FormExample: Story = {
  render: () => (
    <div className="w-[400px] space-y-6 p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
      <h3 className="text-lg font-semibold text-[var(--foreground)]">
        用户注册表单
      </h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <FieldLabel
            htmlFor="register-username"
            isRequired
            icon="👤"
          >
            用户名
          </FieldLabel>
          <Input
            id="register-username"
            placeholder="请输入用户名"
          />
        </div>

        <div className="space-y-2">
          <FieldLabel
            htmlFor="register-email"
            isRequired
            icon="📧"
          >
            邮箱地址
          </FieldLabel>
          <Input
            id="register-email"
            type="email"
            placeholder="请输入邮箱地址"
          />
        </div>

        <div className="space-y-2">
          <FieldLabel
            htmlFor="register-phone"
            isRequired
            icon="📱"
          >
            手机号码
          </FieldLabel>
          <Input
            id="register-phone"
            placeholder="请输入手机号码"
          />
          <FieldLabelDescription>
            我们将发送验证码到此号码
          </FieldLabelDescription>
        </div>

        <div className="space-y-2">
          <FieldLabel
            htmlFor="register-password"
            isRequired
            icon="🔒"
            description="密码长度至少8位，建议包含大小写字母、数字和特殊字符"
          >
            密码
          </FieldLabel>
          <Input
            id="register-password"
            type="password"
            placeholder="请输入密码"
          />
        </div>

        <div className="space-y-2">
          <FieldLabel
            htmlFor="register-bio"
            variant="secondary"
            icon="📝"
          >
            个人简介
          </FieldLabel>
          <Input
            id="register-bio"
            placeholder="简单介绍一下自己（可选）"
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * FieldLabelDescription组件示例
 */
export const DescriptionComponent: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="desc-demo"
          className="text-base font-medium text-[var(--foreground)]"
        >
          标签文本
        </label>
        <FieldLabelDescription id="desc-demo">
          这是一个独立的描述文本组件，可以单独使用
        </FieldLabelDescription>
        <Input id="desc-demo" placeholder="示例输入框" />
      </div>
    </div>
  ),
};
