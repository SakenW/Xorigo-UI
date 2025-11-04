/**
 * @fileoverview ZodAdapter 组件故事
 * @description Zod 验证适配器组件的使用示例和交互演示
 */

import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { z } from 'zod'
import { ZodAdapter } from './zod-adapter'
import { Input } from '../../form/input'
import { Select } from '../../form/select'
import { Textarea } from '../../form/textarea'
import { Checkbox } from '../../form/checkbox'
import { Button } from '../../primitives'

// ==============================
// Meta Configuration
// ==============================

const meta = {
  title: 'Forms/ZodAdapter',
  component: ZodAdapter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
ZodAdapter 是一个基于 Zod 的表单验证适配器组件，提供类型安全的表单验证功能。

## 功能特性
- ✅ Zod 模式验证适配器组件
- ✅ 将 Zod 验证与 Xorigo UI 组件集成
- ✅ 支持实时验证
- ✅ 支持异步验证
- ✅ 支持字段级验证
- ✅ 支持自定义错误消息
- ✅ 支持验证时机控制
- ✅ 支持条件验证
- ✅ 支持数组和对象验证
- ✅ 支持嵌套对象验证
- ✅ 支持类型推断
- ✅ 支持错误格式化
- ✅ TypeScript 类型安全
- ✅ Zod 深度集成
- ✅ 可访问性支持

## 使用场景
- 表单数据验证
- 用户输入校验
- 复杂表单逻辑
- 类型安全的表单处理
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
    validateOnChange: {
      control: 'boolean',
      description: '是否在值改变时验证',
    },
    validateOnBlur: {
      control: 'boolean',
      description: '是否在失去焦点时验证',
    },
    showValidationErrors: {
      control: 'boolean',
      description: '是否显示验证错误',
    },
    showSubmitButton: {
      control: 'boolean',
      description: '是否显示提交按钮',
    },
    showResetButton: {
      control: 'boolean',
      description: '是否显示重置按钮',
    },
  },
} satisfies Meta<typeof ZodAdapter>

export default meta
type Story = StoryObj<typeof meta>

// ==============================
// Base Schemas
// ==============================

// 基础用户注册模式
const userSchema = z.object({
  username: z
    .string()
    .min(3, '用户名至少需要3个字符')
    .max(20, '用户名不能超过20个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z
    .string()
    .min(8, '密码至少需要8个字符')
    .regex(/[A-Z]/, '密码必须包含一个大写字母')
    .regex(/[0-9]/, '密码必须包含一个数字'),
  confirmPassword: z.string(),
  age: z.number().min(18, '年龄必须至少18岁').max(100, '年龄不能超过100岁'),
  website: z.string().url('请输入有效的网址').optional().or(z.literal('')),
  bio: z.string().max(500, '个人简介不能超过500个字符').optional(),
  agree: z.boolean().refine((val) => val === true, '您必须同意服务条款'),
}).refine((data) => data.password === data.confirmPassword, {
  message: '密码不匹配',
  path: ['confirmPassword'],
})

// 产品模式
const productSchema = z.object({
  name: z.string().min(2, '产品名称至少需要2个字符'),
  description: z.string().min(10, '产品描述至少需要10个字符'),
  price: z.number().min(0, '价格不能为负数'),
  category: z.enum(['electronics', 'clothing', 'books', 'other']),
  tags: z.array(z.string()).min(1, '至少需要一个标签'),
  inStock: z.boolean(),
  specifications: z.object({
    weight: z.number().positive('重量必须为正数'),
    dimensions: z.object({
      width: z.number().positive('宽度必须为正数'),
      height: z.number().positive('高度必须为正数'),
      depth: z.number().positive('深度必须为正数'),
    }),
  }),
})

// 联系表单模式
const contactSchema = z.object({
  name: z.string().min(2, '姓名至少需要2个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  subject: z.string().min(5, '主题至少需要5个字符'),
  message: z.string().min(10, '消息至少需要10个字符'),
  priority: z.enum(['low', 'medium', 'high']),
})

// ==============================
// Basic Example
// ==============================

export const Basic: Story = {
  args: {
    schema: userSchema,
    variant: 'default',
    size: 'md',
    validateOnChange: true,
    validateOnBlur: true,
    showValidationErrors: true,
    showSubmitButton: true,
    showResetButton: false,
  },
  render: (args) => {
    const [values, setValues] = useState<any>({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: 18,
      website: '',
      bio: '',
      agree: false,
    })

    const handleSubmit = (data: any) => {
      alert('表单提交成功！\n' + JSON.stringify(data, null, 2))
    }

    return (
      <div style={{ width: '500px' }}>
        <ZodAdapter
          {...args}
          initialValues={values}
          onSubmit={(values) => {
            handleSubmit(values)
          }}
        >
          {({ getFieldProps }) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label htmlFor="username">用户名</label>
                <Input
                  id="username"
                  type="text"
                  {...getFieldProps('username')}
                  placeholder="请输入用户名"
                />
              </div>

              <div>
                <label htmlFor="email">邮箱</label>
                <Input
                  id="email"
                  type="email"
                  {...getFieldProps('email')}
                  placeholder="请输入邮箱"
                />
              </div>

              <div>
                <label htmlFor="password">密码</label>
                <Input
                  id="password"
                  type="password"
                  {...getFieldProps('password')}
                  placeholder="请输入密码"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword">确认密码</label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...getFieldProps('confirmPassword')}
                  placeholder="请再次输入密码"
                />
              </div>

              <div>
                <label htmlFor="age">年龄</label>
                <Input
                  id="age"
                  type="number"
                  {...getFieldProps('age')}
                  placeholder="请输入年龄"
                />
              </div>

              <div>
                <label htmlFor="website">网站</label>
                <Input
                  id="website"
                  type="url"
                  {...getFieldProps('website')}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label htmlFor="bio">个人简介</label>
                <Textarea
                  id="bio"
                  {...getFieldProps('bio')}
                  placeholder="请输入个人简介"
                  rows={4}
                />
              </div>

              <div>
                <Checkbox
                  {...getFieldProps('agree')}
                  label="我同意服务条款"
                />
              </div>
            </div>
          )}
        </ZodAdapter>
      </div>
    )
  },
}

// ==============================
// Minimal Variant
// ==============================

export const Minimal: Story = {
  args: {
    schema: contactSchema,
    variant: 'minimal',
    size: 'md',
    validateOnChange: true,
    validateOnBlur: true,
    showValidationErrors: true,
    showSubmitButton: true,
    showResetButton: false,
  },
  render: (args) => {
    const [values, setValues] = useState<any>({
      name: '',
      email: '',
      subject: '',
      message: '',
      priority: 'medium',
    })

    const handleSubmit = (data: any) => {
      alert('联系表单提交成功！\n' + JSON.stringify(data, null, 2))
    }

    return (
      <div style={{ width: '500px' }}>
        <ZodAdapter
          {...args}
          initialValues={values}
          onSubmit={(values) => {
            handleSubmit(values)
          }}
        >
          {({ getFieldProps }) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label htmlFor="name-min">姓名</label>
                <Input
                  id="name-min"
                  type="text"
                  {...getFieldProps('name')}
                  placeholder="请输入姓名"
                />
              </div>

              <div>
                <label htmlFor="email-min">邮箱</label>
                <Input
                  id="email-min"
                  type="email"
                  {...getFieldProps('email')}
                  placeholder="请输入邮箱"
                />
              </div>

              <div>
                <label htmlFor="subject-min">主题</label>
                <Input
                  id="subject-min"
                  type="text"
                  {...getFieldProps('subject')}
                  placeholder="请输入主题"
                />
              </div>

              <div>
                <label htmlFor="message-min">消息</label>
                <Textarea
                  id="message-min"
                  {...getFieldProps('message')}
                  placeholder="请输入消息"
                  rows={4}
                />
              </div>

              <div>
                <label htmlFor="priority-min">优先级</label>
                <Select
                  id="priority-min"
                  {...getFieldProps('priority')}
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </Select>
              </div>
            </div>
          )}
        </ZodAdapter>
      </div>
    )
  },
}

// ==============================
// Bordered Variant
// ==============================

export const Bordered: Story = {
  args: {
    schema: productSchema,
    variant: 'bordered',
    size: 'md',
    validateOnChange: true,
    validateOnBlur: true,
    showValidationErrors: true,
    showSubmitButton: true,
    showResetButton: true,
  },
  render: (args) => {
    const [values, setValues] = useState<any>({
      name: '',
      description: '',
      price: 0,
      category: 'electronics',
      tags: [],
      inStock: true,
      specifications: {
        weight: 0,
        dimensions: {
          width: 0,
          height: 0,
          depth: 0,
        },
      },
    })

    const handleSubmit = (data: any) => {
      alert('产品表单提交成功！\n' + JSON.stringify(data, null, 2))
    }

    return (
      <div style={{ width: '500px' }}>
        <ZodAdapter
          {...args}
          initialValues={values}
          onSubmit={(values) => {
            handleSubmit(values)
          }}
        >
          {({ getFieldProps }) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label htmlFor="prod-name">产品名称</label>
                <Input
                  id="prod-name"
                  type="text"
                  {...getFieldProps('name')}
                  placeholder="请输入产品名称"
                />
              </div>

              <div>
                <label htmlFor="prod-desc">产品描述</label>
                <Textarea
                  id="prod-desc"
                  {...getFieldProps('description')}
                  placeholder="请输入产品描述"
                  rows={3}
                />
              </div>

              <div>
                <label htmlFor="prod-price">价格</label>
                <Input
                  id="prod-price"
                  type="number"
                  {...getFieldProps('price')}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="prod-category">类别</label>
                <Select
                  id="prod-category"
                  {...getFieldProps('category')}
                >
                  <option value="electronics">电子产品</option>
                  <option value="clothing">服装</option>
                  <option value="books">图书</option>
                  <option value="other">其他</option>
                </Select>
              </div>

              <div>
                <label htmlFor="prod-weight">重量 (kg)</label>
                <Input
                  id="prod-weight"
                  type="number"
                  step="0.1"
                  {...getFieldProps('specifications.weight')}
                  placeholder="0.0"
                />
              </div>

              <div>
                <Checkbox
                  {...getFieldProps('inStock')}
                  label="有库存"
                />
              </div>
            </div>
          )}
        </ZodAdapter>
      </div>
    )
  },
}

// ==============================
// Different Sizes
// ==============================

export const Sizes: Story = {
  render: () => {
    const [values, setValues] = useState<any>({
      name: '',
      email: '',
    })

    const handleSubmit = (data: any) => {
      alert('表单提交成功！\n' + JSON.stringify(data, null, 2))
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '500px' }}>
        <div>
          <h3>Small Size</h3>
          <ZodAdapter
            schema={contactSchema.pick({ name: true, email: true })}
            initialValues={values}
            size="sm"
            onSubmit={(values) => handleSubmit(values)}
          >
            {({ getFieldProps }) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label htmlFor="size-sm-name">姓名</label>
                  <Input
                    id="size-sm-name"
                    type="text"
                    {...getFieldProps('name')}
                    placeholder="请输入姓名"
                  />
                </div>
                <div>
                  <label htmlFor="size-sm-email">邮箱</label>
                  <Input
                    id="size-sm-email"
                    type="email"
                    {...getFieldProps('email')}
                    placeholder="请输入邮箱"
                  />
                </div>
              </div>
            )}
          </ZodAdapter>
        </div>

        <div>
          <h3>Medium Size (Default)</h3>
          <ZodAdapter
            schema={contactSchema.pick({ name: true, email: true })}
            initialValues={values}
            size="md"
            onSubmit={(values) => handleSubmit(values)}
          >
            {({ getFieldProps }) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label htmlFor="size-md-name">姓名</label>
                  <Input
                    id="size-md-name"
                    type="text"
                    {...getFieldProps('name')}
                    placeholder="请输入姓名"
                  />
                </div>
                <div>
                  <label htmlFor="size-md-email">邮箱</label>
                  <Input
                    id="size-md-email"
                    type="email"
                    {...getFieldProps('email')}
                    placeholder="请输入邮箱"
                  />
                </div>
              </div>
            )}
          </ZodAdapter>
        </div>

        <div>
          <h3>Large Size</h3>
          <ZodAdapter
            schema={contactSchema.pick({ name: true, email: true })}
            initialValues={values}
            size="lg"
            onSubmit={(values) => handleSubmit(values)}
          >
            {({ getFieldProps }) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label htmlFor="size-lg-name">姓名</label>
                  <Input
                    id="size-lg-name"
                    type="text"
                    {...getFieldProps('name')}
                    placeholder="请输入姓名"
                  />
                </div>
                <div>
                  <label htmlFor="size-lg-email">邮箱</label>
                  <Input
                    id="size-lg-email"
                    type="email"
                    {...getFieldProps('email')}
                    placeholder="请输入邮箱"
                  />
                </div>
              </div>
            )}
          </ZodAdapter>
        </div>

        <div>
          <h3>Extra Large Size</h3>
          <ZodAdapter
            schema={contactSchema.pick({ name: true, email: true })}
            initialValues={values}
            size="xl"
            onSubmit={(values) => handleSubmit(values)}
          >
            {({ getFieldProps }) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label htmlFor="size-xl-name">姓名</label>
                  <Input
                    id="size-xl-name"
                    type="text"
                    {...getFieldProps('name')}
                    placeholder="请输入姓名"
                  />
                </div>
                <div>
                  <label htmlFor="size-xl-email">邮箱</label>
                  <Input
                    id="size-xl-email"
                    type="email"
                    {...getFieldProps('email')}
                    placeholder="请输入邮箱"
                  />
                </div>
              </div>
            )}
          </ZodAdapter>
        </div>
      </div>
    )
  },
}

// ==============================
// Async Validation
// ==============================

export const AsyncValidation: Story = {
  args: {
    schema: userSchema.extend({
      username: z
        .string()
        .min(3, '用户名至少需要3个字符')
        .max(20, '用户名不能超过20个字符')
        .refine(async (val) => {
          // 模拟异步用户名检查
          await new Promise(resolve => setTimeout(resolve, 500))
          const takenUsernames = ['admin', 'root', 'test', 'user']
          return !takenUsernames.includes(val.toLowerCase())
        }, '用户名已被使用'),
    }),
    variant: 'default',
    size: 'md',
    validateOnBlur: true,
    showSubmitButton: true,
  },
  render: (args) => {
    const [values, setValues] = useState<any>({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: 18,
      agree: false,
    })

    const handleSubmit = (data: any) => {
      alert('表单提交成功！\n' + JSON.stringify(data, null, 2))
    }

    return (
      <div style={{ width: '500px' }}>
        <ZodAdapter
          {...args}
          initialValues={values}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ getFieldProps }) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label htmlFor="async-username">用户名</label>
                <Input
                  id="async-username"
                  type="text"
                  {...getFieldProps('username')}
                  placeholder="输入 'admin' 或 'root' 查看异步验证"
                />
                <small>注意：输入 'admin'、'root'、'test'、'user' 会触发已使用错误</small>
              </div>

              <div>
                <label htmlFor="async-email">邮箱</label>
                <Input
                  id="async-email"
                  type="email"
                  {...getFieldProps('email')}
                  placeholder="请输入邮箱"
                />
              </div>
            </div>
          )}
        </ZodAdapter>
      </div>
    )
  },
}

// ==============================
// Conditional Validation
// ==============================

export const ConditionalValidation: Story = {
  args: {
    schema: z.object({
      hasBusinessAddress: z.boolean(),
      homeAddress: z.string().min(5, '家庭地址至少需要5个字符'),
      businessAddress: z.string().optional(),
      businessName: z.string().optional(),
    }).refine(
      (data) => {
        if (data.hasBusinessAddress) {
          return data.businessAddress && data.businessAddress.length >= 5
        }
        return true
      },
      {
        message: '请输入有效的营业地址',
        path: ['businessAddress'],
      }
    ).refine(
      (data) => {
        if (data.hasBusinessAddress) {
          return data.businessName && data.businessName.length >= 2
        }
        return true
      },
      {
        message: '请输入有效的企业名称',
        path: ['businessName'],
      }
    ),
    variant: 'default',
    size: 'md',
    validateOnChange: true,
    showSubmitButton: true,
  },
  render: (args) => {
    const [values, setValues] = useState<any>({
      hasBusinessAddress: false,
      homeAddress: '',
      businessAddress: '',
      businessName: '',
    })

    const handleSubmit = (data: any) => {
      alert('表单提交成功！\n' + JSON.stringify(data, null, 2))
    }

    return (
      <div style={{ width: '500px' }}>
        <ZodAdapter
          {...args}
          initialValues={values}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ getFieldProps, values: formValues }) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <Checkbox
                  {...getFieldProps('hasBusinessAddress')}
                  label="我有营业地址"
                />
              </div>

              <div>
                <label htmlFor="home-addr">家庭地址</label>
                <Input
                  id="home-addr"
                  type="text"
                  {...getFieldProps('homeAddress')}
                  placeholder="请输入家庭地址"
                />
              </div>

              {formValues.hasBusinessAddress && (
                <>
                  <div>
                    <label htmlFor="business-addr">营业地址</label>
                    <Input
                      id="business-addr"
                      type="text"
                      {...getFieldProps('businessAddress')}
                      placeholder="请输入营业地址"
                    />
                  </div>

                  <div>
                    <label htmlFor="business-name">企业名称</label>
                    <Input
                      id="business-name"
                      type="text"
                      {...getFieldProps('businessName')}
                      placeholder="请输入企业名称"
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </ZodAdapter>
      </div>
    )
  },
}

// ==============================
// Array Validation
// ==============================

export const ArrayValidation: Story = {
  args: {
    schema: z.object({
      skills: z.array(
        z.object({
          name: z.string().min(2, '技能名称至少需要2个字符'),
          level: z.enum(['beginner', 'intermediate', 'advanced']),
        })
      ).min(1, '至少需要一种技能'),
      hobbies: z.array(z.string()).min(1, '至少需要一个爱好'),
    }),
    variant: 'default',
    size: 'md',
    validateOnChange: true,
    showSubmitButton: true,
  },
  render: (args) => {
    const [values, setValues] = useState<any>({
      skills: [{ name: '', level: 'beginner' }],
      hobbies: [],
    })

    const handleSubmit = (data: any) => {
      alert('表单提交成功！\n' + JSON.stringify(data, null, 2))
    }

    return (
      <div style={{ width: '500px' }}>
        <ZodAdapter
          {...args}
          initialValues={values}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ getFieldProps }) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label>技能</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Input
                    type="text"
                    {...getFieldProps('skills.0.name')}
                    placeholder="请输入技能名称"
                  />
                  <Select
                    {...getFieldProps('skills.0.level')}
                  >
                    <option value="beginner">初级</option>
                    <option value="intermediate">中级</option>
                    <option value="advanced">高级</option>
                  </Select>
                </div>
                <small>添加更多技能需要动态表单管理</small>
              </div>

              <div>
                <label htmlFor="hobbies">爱好</label>
                <Input
                  id="hobbies"
                  type="text"
                  {...getFieldProps('hobbies.0')}
                  placeholder="请输入爱好"
                />
                <small>添加更多爱好需要动态表单管理</small>
              </div>
            </div>
          )}
        </ZodAdapter>
      </div>
    )
  },
}

// ==============================
// Disabled State
// ==============================

export const Disabled: Story = {
  args: {
    schema: contactSchema,
    variant: 'default',
    size: 'md',
    disabled: true,
    showSubmitButton: true,
  },
  render: (args) => {
    const [values, setValues] = useState<any>({
      name: '禁用状态',
      email: 'disabled@example.com',
      subject: '不可编辑',
      message: '表单处于禁用状态',
      priority: 'medium',
    })

    const handleSubmit = (data: any) => {
      alert('表单提交成功！\n' + JSON.stringify(data, null, 2))
    }

    return (
      <div style={{ width: '500px' }}>
        <ZodAdapter
          {...args}
          initialValues={values}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ getFieldProps }) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label htmlFor="disabled-name">姓名</label>
                <Input
                  id="disabled-name"
                  type="text"
                  {...getFieldProps('name')}
                  placeholder="请输入姓名"
                />
              </div>

              <div>
                <label htmlFor="disabled-email">邮箱</label>
                <Input
                  id="disabled-email"
                  type="email"
                  {...getFieldProps('email')}
                  placeholder="请输入邮箱"
                />
              </div>
            </div>
          )}
        </ZodAdapter>
      </div>
    )
  },
}

// ==============================
// With Context
// ==============================

export const WithContext: Story = {
  args: {
    schema: userSchema,
    variant: 'default',
    size: 'md',
    showSubmitButton: true,
  },
  render: (args) => {
    const [values, setValues] = useState<any>({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: 18,
      agree: false,
    })

    const handleSubmit = (data: any) => {
      alert('表单提交成功！\n' + JSON.stringify(data, null, 2))
    }

    const FormWithContext = () => {
      const { values, errors, touched, isValid, isDirty, getFieldProps } = useZodAdapter()

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '12px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            <h4>表单状态</h4>
            <div>是否有效: {isValid.toString()}</div>
            <div>是否已修改: {isDirty.toString()}</div>
            <div>已触摸字段: {Object.keys(touched).filter(key => touched[key]).join(', ') || '无'}</div>
            <div>错误数量: {Object.keys(errors).length}</div>
          </div>

          <div>
            <label htmlFor="ctx-username">用户名</label>
            <Input
              id="ctx-username"
              type="text"
              {...getFieldProps('username')}
              placeholder="请输入用户名"
            />
          </div>

          <div>
            <label htmlFor="ctx-email">邮箱</label>
            <Input
              id="ctx-email"
              type="email"
              {...getFieldProps('email')}
              placeholder="请输入邮箱"
            />
          </div>

          <Button
            type="button"
            disabled={!isValid || !isDirty}
            onClick={() => handleSubmit(values)}
          >
            自定义提交按钮
          </Button>
        </div>
      )
    }

    return (
      <div style={{ width: '500px' }}>
        <ZodAdapter
          {...args}
          initialValues={values}
          onSubmit={(values) => handleSubmit(values)}
          showSubmitButton={false}
        >
          <FormWithContext />
        </ZodAdapter>
      </div>
    )
  },
}

// ==============================
// Custom Submit/Reset
// ==============================

export const CustomButtons: Story = {
  args: {
    schema: contactSchema,
    variant: 'default',
    size: 'md',
    showSubmitButton: false,
    showResetButton: false,
  },
  render: (args) => {
    const [values, setValues] = useState<any>({
      name: '',
      email: '',
      subject: '',
      message: '',
      priority: 'medium',
    })

    const handleSubmit = (data: any) => {
      alert('表单提交成功！\n' + JSON.stringify(data, null, 2))
    }

    return (
      <div style={{ width: '500px' }}>
        <ZodAdapter
          {...args}
          initialValues={values}
          onSubmit={(values) => handleSubmit(values)}
          onReset={() => {
            alert('表单已重置')
          }}
        >
          {({ getFieldProps }) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label htmlFor="custom-name">姓名</label>
                <Input
                  id="custom-name"
                  type="text"
                  {...getFieldProps('name')}
                  placeholder="请输入姓名"
                />
              </div>

              <div>
                <label htmlFor="custom-email">邮箱</label>
                <Input
                  id="custom-email"
                  type="email"
                  {...getFieldProps('email')}
                  placeholder="请输入邮箱"
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <Button variant="outline" type="reset">
                  清除
                </Button>
                <Button type="submit">
                  发送
                </Button>
              </div>
            </div>
          )}
        </ZodAdapter>
      </div>
    )
  },
}
