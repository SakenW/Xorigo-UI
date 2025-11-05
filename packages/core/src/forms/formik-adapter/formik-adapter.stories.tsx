import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { FormikAdapter } from './formik-adapter'
import { Input } from '../../inputs'
import { Select } from '../../select'
import { Textarea } from '../../textarea'
import { Button } from '../primitives'

const meta = {
  title: 'Forms/FormikAdapter',
  component: FormikAdapter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
FormikAdapter 是一个表单适配器组件，它将 Formik 表单状态与 Xorigo UI 组件集成。
提供完整的表单验证、错误处理和状态管理功能。

## 特性

- ✅ Formik 表单库深度集成
- ✅ 支持表单验证和错误处理
- ✅ 支持异步验证和字段级验证
- ✅ 支持提交状态管理和重置功能
- ✅ 支持默认值设置和表单禁用状态
- ✅ 支持实时验证和错误消息映射
- ✅ TypeScript 类型安全
- ✅ 可访问性支持

## 使用场景

- 表单状态管理和验证
- 用户注册和登录表单
- 数据录入和编辑表单
- 多步骤表单向导
- 复杂表单逻辑
- 与第三方表单库集成
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'minimal', 'bordered'],
      description: '表单变体样式',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: '表单尺寸',
    },
    showSubmitButton: {
      control: 'boolean',
      description: '是否显示提交按钮',
    },
    showResetButton: {
      control: 'boolean',
      description: '是否显示重置按钮',
    },
    disabled: {
      control: 'boolean',
      description: '禁用表单',
    },
    adapterReadonly: {
      control: 'boolean',
      description: '只读模式',
    },
  },
} satisfies Meta<typeof FormikAdapter>

export default meta
type Story = StoryObj<typeof meta>

// ==============================
// 基本用法
// ==============================

export const Basic: Story = {
  args: {
    initialValues: {
      email: '',
      password: '',
    },
    variant: 'default',
    size: 'md',
    showSubmitButton: true,
    showResetButton: false,
  },
  render: (args) => (
    <div className="w-[400px]">
      <FormikAdapter
        {...args}
        onSubmit={(values) => {
          console.log('提交表单:', values)
          alert('表单提交成功！')
        }}
      >
        {(formik) => (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                邮箱
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...formik.getFieldProps('email')}
                error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                密码
              </label>
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                {...formik.getFieldProps('password')}
                error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
              />
            </div>
          </div>
        )}
      </FormikAdapter>
    </div>
  ),
}

// ==============================
// 带验证的表单
// ==============================

export const WithValidation: Story = {
  args: {
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    variant: 'default',
    size: 'md',
  },
  render: (args) => (
    <div className="w-[400px]">
      <FormikAdapter
        {...args}
        validate={(values) => {
          const errors: any = {}

          if (!values.name) {
            errors.name = '请输入姓名'
          }

          if (!values.email) {
            errors.email = '请输入邮箱'
          } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = '邮箱格式不正确'
          }

          if (!values.password) {
            errors.password = '请输入密码'
          } else if (values.password.length < 8) {
            errors.password = '密码至少 8 位'
          }

          if (!values.confirmPassword) {
            errors.confirmPassword = '请确认密码'
          } else if (values.password !== values.confirmPassword) {
            errors.confirmPassword = '两次密码输入不一致'
          }

          return errors
        }}
        onSubmit={(values) => {
          console.log('表单验证通过:', values)
          alert('注册成功！')
        }}
      >
        {(formik) => (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                姓名
              </label>
              <Input
                id="name"
                placeholder="请输入姓名"
                {...formik.getFieldProps('name')}
                error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                邮箱
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...formik.getFieldProps('email')}
                error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                密码
              </label>
              <Input
                id="password"
                type="password"
                placeholder="至少 8 位"
                {...formik.getFieldProps('password')}
                error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                确认密码
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="再次输入密码"
                {...formik.getFieldProps('confirmPassword')}
                error={
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                    ? formik.errors.confirmPassword
                    : undefined
                }
              />
            </div>
          </div>
        )}
      </FormikAdapter>
    </div>
  ),
}

// ==============================
// 异步验证
// ==============================

export const WithAsyncValidation: Story = {
  args: {
    initialValues: {
      username: '',
      email: '',
    },
    variant: 'default',
    size: 'md',
  },
  render: (args) => (
    <div className="w-[400px]">
      <FormikAdapter
        {...args}
        validate={(values) => {
          const errors: any = {}

          if (!values.username) {
            errors.username = '请输入用户名'
          }

          if (!values.email) {
            errors.email = '请输入邮箱'
          }

          return errors
        }}
        validateField={(name) => {
          const formik = (window as any).__formik
          if (name === 'username' && formik.values.username) {
            // 模拟异步验证
            return new Promise((resolve) => {
              setTimeout(() => {
                const exists = ['admin', 'test', 'user'].includes(formik.values.username.toLowerCase())
                if (exists) {
                  resolve('用户名已存在')
                } else {
                  resolve(undefined)
                }
              }, 500)
            })
          }
        }}
        onSubmit={(values) => {
          console.log('异步验证通过:', values)
          alert('表单提交成功！')
        }}
      >
        {(formik) => {
          ;(window as any).__formik = formik
          return (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  用户名
                </label>
                <Input
                  id="username"
                  placeholder="输入用户名"
                  {...formik.getFieldProps('username')}
                  onBlur={() => {
                    formik.validateField('username')
                    formik.setFieldTouched('username', true)
                  }}
                  error={
                    formik.touched.username && formik.errors.username
                      ? formik.errors.username
                      : undefined
                  }
                />
                <p className="mt-1 text-xs text-gray-500">
                  试试输入 'admin'、'test' 或 'user' 查看异步验证
                </p>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  邮箱
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...formik.getFieldProps('email')}
                  error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
                />
              </div>
            </div>
          )
        }}
      </FormikAdapter>
    </div>
  ),
}

// ==============================
// 变体样式
// ==============================

export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
      <div>
        <h3 className="text-sm font-semibold mb-3">Default Variant</h3>
        <div className="w-[350px]">
          <FormikAdapter
            variant="default"
            initialValues={{ email: '', password: '' }}
            onSubmit={(values) => console.log(values)}
          >
            {(formik) => (
              <div className="space-y-4">
                <Input
                  placeholder="邮箱"
                  {...formik.getFieldProps('email')}
                />
                <Input
                  type="password"
                  placeholder="密码"
                  {...formik.getFieldProps('password')}
                />
              </div>
            )}
          </FormikAdapter>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Minimal Variant</h3>
        <div className="w-[350px]">
          <FormikAdapter
            variant="minimal"
            initialValues={{ email: '', password: '' }}
            onSubmit={(values) => console.log(values)}
          >
            {(formik) => (
              <div className="space-y-2">
                <Input
                  placeholder="邮箱"
                  {...formik.getFieldProps('email')}
                />
                <Input
                  type="password"
                  placeholder="密码"
                  {...formik.getFieldProps('password')}
                />
              </div>
            )}
          </FormikAdapter>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Bordered Variant</h3>
        <div className="w-[350px]">
          <FormikAdapter
            variant="bordered"
            initialValues={{ email: '', password: '' }}
            onSubmit={(values) => console.log(values)}
          >
            {(formik) => (
              <div className="space-y-3">
                <Input
                  placeholder="邮箱"
                  {...formik.getFieldProps('email')}
                />
                <Input
                  type="password"
                  placeholder="密码"
                  {...formik.getFieldProps('password')}
                />
              </div>
            )}
          </FormikAdapter>
        </div>
      </div>
    </div>
  ),
}

// ==============================
// 尺寸变体
// ==============================

export const Sizes: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      <div className="space-y-6">
        <h3 className="text-sm font-semibold">Small Size</h3>
        <div className="w-[350px]">
          <FormikAdapter
            size="sm"
            initialValues={{ email: '' }}
            onSubmit={(values) => console.log(values)}
          >
            {(formik) => (
              <Input
                placeholder="Small input"
                {...formik.getFieldProps('email')}
              />
            )}
          </FormikAdapter>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-sm font-semibold">Large Size</h3>
        <div className="w-[350px]">
          <FormikAdapter
            size="lg"
            initialValues={{ email: '' }}
            onSubmit={(values) => console.log(values)}
          >
            {(formik) => (
              <Input
                placeholder="Large input"
                {...formik.getFieldProps('email')}
              />
            )}
          </FormikAdapter>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-sm font-semibold">Extra Large Size</h3>
        <div className="w-[350px]">
          <FormikAdapter
            size="xl"
            initialValues={{ email: '' }}
            onSubmit={(values) => console.log(values)}
          >
            {(formik) => (
              <Input
                placeholder="Extra Large input"
                {...formik.getFieldProps('email')}
              />
            )}
          </FormikAdapter>
        </div>
      </div>
    </div>
  ),
}

// ==============================
// 禁用和只读状态
// ==============================

export const DisabledState: Story = {
  args: {
    initialValues: {
      email: 'user@example.com',
    },
    variant: 'default',
    size: 'md',
  },
  render: (args) => (
    <div className="w-[400px] space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Disabled Form</h3>
        <FormikAdapter
          {...args}
          disabled={true}
          onSubmit={(values) => console.log(values)}
        >
          {(formik) => (
            <Input
              placeholder="Disabled input"
              {...formik.getFieldProps('email')}
            />
          )}
        </FormikAdapter>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Readonly Form</h3>
        <FormikAdapter
          {...args}
          adapterReadonly={true}
          onSubmit={(values) => console.log(values)}
        >
          {(formik) => (
            <Input
              placeholder="Readonly input"
              {...formik.getFieldProps('email')}
            />
          )}
        </FormikAdapter>
      </div>
    </div>
  ),
}

// ==============================
// 复杂表单示例
// ==============================

export const ComplexForm: Story = {
  args: {
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      address: '',
      bio: '',
    },
    variant: 'default',
    size: 'md',
  },
  render: (args) => (
    <div className="w-[500px]">
      <FormikAdapter
        {...args}
        validate={(values) => {
          const errors: any = {}

          if (!values.firstName) errors.firstName = '请输入名字'
          if (!values.lastName) errors.lastName = '请输入姓氏'
          if (!values.email) {
            errors.email = '请输入邮箱'
          } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = '邮箱格式不正确'
          }
          if (!values.phone) errors.phone = '请输入手机号'
          if (!values.country) errors.country = '请选择国家'
          if (!values.city) errors.city = '请输入城市'
          if (!values.address) errors.address = '请输入地址'

          return errors
        }}
        onSubmit={(values) => {
          console.log('复杂表单提交:', values)
          alert('表单提交成功！')
        }}
      >
        {(formik) => (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">名字</label>
                <Input
                  placeholder="名字"
                  {...formik.getFieldProps('firstName')}
                  error={
                    formik.touched.firstName && formik.errors.firstName
                      ? formik.errors.firstName
                      : undefined
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">姓氏</label>
                <Input
                  placeholder="姓氏"
                  {...formik.getFieldProps('lastName')}
                  error={
                    formik.touched.lastName && formik.errors.lastName
                      ? formik.errors.lastName
                      : undefined
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">邮箱</label>
              <Input
                type="email"
                placeholder="your@email.com"
                {...formik.getFieldProps('email')}
                error={
                  formik.touched.email && formik.errors.email ? formik.errors.email : undefined
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">手机号</label>
              <Input
                type="tel"
                placeholder="请输入手机号"
                {...formik.getFieldProps('phone')}
                error={
                  formik.touched.phone && formik.errors.phone ? formik.errors.phone : undefined
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">国家</label>
                <Select
                  {...formik.getFieldProps('country')}
                  onChange={(value) => formik.setFieldValue('country', value)}
                  value={formik.values.country}
                  placeholder="选择国家"
                >
                  <option value="china">中国</option>
                  <option value="usa">美国</option>
                  <option value="japan">日本</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">城市</label>
                <Input
                  placeholder="城市"
                  {...formik.getFieldProps('city')}
                  error={
                    formik.touched.city && formik.errors.city ? formik.errors.city : undefined
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">地址</label>
              <Input
                placeholder="详细地址"
                {...formik.getFieldProps('address')}
                error={
                  formik.touched.address && formik.errors.address
                    ? formik.errors.address
                    : undefined
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">个人简介</label>
              <Textarea
                placeholder="介绍一下自己..."
                rows={4}
                {...formik.getFieldProps('bio')}
              />
            </div>
          </div>
        )}
      </FormikAdapter>
    </div>
  ),
}

// ==============================
// 使用 Hooks
// ==============================

export const UsingHooks: Story = {
  args: {
    initialValues: {
      title: '',
      description: '',
      category: '',
    },
    variant: 'default',
    size: 'md',
  },
  render: (args) => (
    <div className="w-[400px]">
      <FormikAdapter
        {...args}
        onSubmit={(values) => {
          console.log('使用 Hooks 提交:', values)
          alert('表单提交成功！')
        }}
      >
        <FormContent />
      </FormikAdapter>
    </div>
  ),
}

// 辅助组件：演示如何使用 hooks
const FormContent = () => {
  const form = useFormikForm()
  const { field: titleField, meta: titleMeta } = useFormikField('title')

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">标题</label>
        <Input
          placeholder="输入标题"
          {...titleField}
          error={titleMeta.touched && titleMeta.error ? titleMeta.error : undefined}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">描述</label>
        <Textarea
          placeholder="输入描述"
          rows={3}
          {...form.getFieldProps('description')}
          error={
            form.touched.description && form.errors.description
              ? form.errors.description
              : undefined
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">分类</label>
        <Select
          {...form.getFieldProps('category')}
          onChange={(value) => form.setFieldValue('category', value)}
          value={form.values.category}
          placeholder="选择分类"
        >
          <option value="tech">技术</option>
          <option value="design">设计</option>
          <option value="business">商业</option>
        </Select>
      </div>

      <div className="pt-2 text-xs text-gray-500">
        <p>表单状态:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>有效: {form.isValid ? '是' : '否'}</li>
          <li>已修改: {form.dirty ? '是' : '否'}</li>
          <li>提交中: {form.isSubmitting ? '是' : '否'}</li>
          <li>字段数: {Object.keys(form.values).length}</li>
        </ul>
      </div>
    </div>
  )
}
