/**
 * @fileoverview Field Wrapper 组件故事文件
 * @module components/form/field-wrapper/stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { FieldWrapper } from './field-wrapper';
import { Input } from '../input';
import { Textarea } from '../textarea';
import { Select } from '../select';

// 元数据配置
const meta = {
  title: '组件库/表单/Field Wrapper',
  component: FieldWrapper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Field Wrapper（字段包装器）是一个用于统一管理表单字段状态和布局的组件。

## 功能特性

- ✅ 统一的字段状态管理
- ✅ 支持标签、帮助文本、错误消息显示
- ✅ 支持前后缀显示
- ✅ 支持清除按钮
- ✅ 支持加载状态
- ✅ 支持多种变体样式
- ✅ 完整的可访问性支持
- ✅ TypeScript 类型安全
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline-solid', 'outline-dashed', 'filled', 'ghost'],
      description: '字段样式变体',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '字段尺寸',
    },
    density: {
      control: 'select',
      options: ['compact', 'comfortable', 'spacious'],
      description: '字段密度',
    },
    isDisabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    isReadOnly: {
      control: 'boolean',
      description: '是否只读',
    },
    isRequired: {
      control: 'boolean',
      description: '是否必填',
    },
    isLoading: {
      control: 'boolean',
      description: '是否加载中',
    },
    showClearButton: {
      control: 'boolean',
      description: '是否显示清除按钮',
    },
  },
} satisfies Meta<typeof FieldWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基础示例
export const 基础示例: Story = {
  args: {
    label: '用户名',
    helpText: '请输入用户名',
    children: <Input placeholder="请输入用户名" />,
  },
};

// 不同尺寸
export const 不同尺寸: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[400px]">
      <FieldWrapper label="小尺寸" size="sm">
        <Input placeholder="Small size" />
      </FieldWrapper>
      <FieldWrapper label="中等尺寸" size="md">
        <Input placeholder="Medium size" />
      </FieldWrapper>
      <FieldWrapper label="大尺寸" size="lg">
        <Input placeholder="Large size" />
      </FieldWrapper>
    </div>
  ),
};

// 不同变体
export const 不同变体: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[400px]">
      <FieldWrapper label="实线边框" variant="outline-solid">
        <Input placeholder="Outline solid" />
      </FieldWrapper>
      <FieldWrapper label="虚线边框" variant="outline-dashed">
        <Input placeholder="Outline dashed" />
      </FieldWrapper>
      <FieldWrapper label="填充样式" variant="filled">
        <Input placeholder="Filled" />
      </FieldWrapper>
      <FieldWrapper label="透明样式" variant="ghost">
        <Input placeholder="Ghost" />
      </FieldWrapper>
    </div>
  ),
};

// 不同密度
export const 不同密度: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[400px]">
      <FieldWrapper label="紧凑布局" density="compact" helpText="紧凑的间距">
        <Input placeholder="Compact density" />
      </FieldWrapper>
      <FieldWrapper label="舒适布局" density="comfortable" helpText="舒适的间距">
        <Input placeholder="Comfortable density" />
      </FieldWrapper>
      <FieldWrapper label="宽松布局" density="spacious" helpText="宽松的间距">
        <Input placeholder="Spacious density" />
      </FieldWrapper>
    </div>
  ),
};

// 错误状态
export const 错误状态: Story = {
  args: {
    label: '邮箱地址',
    errorMessage: '请输入有效的邮箱地址',
    children: <Input placeholder="请输入邮箱" />,
  },
};

// 成功状态
export const 成功状态: Story = {
  args: {
    label: '邮箱地址',
    successMessage: '邮箱格式正确',
    children: <Input defaultValue="user@example.com" />,
  },
};

// 警告状态
export const 警告状态: Story = {
  args: {
    label: '密码强度',
    warningMessage: '建议使用更复杂的密码',
    children: <Input placeholder="请输入密码" />,
  },
};

// 必填字段
export const 必填字段: Story = {
  args: {
    label: '姓名',
    isRequired: true,
    helpText: '请输入您的真实姓名',
    children: <Input placeholder="请输入姓名" />,
  },
};

// 禁用状态
export const 禁用状态: Story = {
  args: {
    label: '禁用字段',
    isDisabled: true,
    helpText: '此字段已被禁用',
    children: <Input value="禁用状态" />,
  },
};

// 只读状态
export const 只读状态: Story = {
  args: {
    label: '只读字段',
    isReadOnly: true,
    children: <Input value="只读内容" />,
  },
};

// 带前缀
export const 带前缀: Story = {
  args: {
    label: '搜索',
    prefix: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.5 11.5L7 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle
          cx="7"
          cy="7"
          r="4.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
    children: <Input placeholder="搜索..." />,
  },
};

// 带后缀
export const 带后缀: Story = {
  args: {
    label: '网站',
    suffix: <span className="text-tokens-text-tertiary">.com</span>,
    children: <Input placeholder="www.example" />,
  },
};

// 带清除按钮
export const 带清除按钮: Story = {
  args: {
    label: '搜索',
    showClearButton: true,
    children: <Input placeholder="可清除的输入框" />,
  },
};

// 加载状态
export const 加载状态: Story = {
  args: {
    label: '加载中',
    isLoading: true,
    helpText: '正在加载数据...',
    children: <Input />,
  },
};

// 组合示例：前后缀 + 清除按钮
export const 组合示例: Story = {
  render: () => {
    const [value, setValue] = useState('可编辑的内容');

    return (
      <div className="flex flex-col gap-4 w-[400px]">
        <FieldWrapper
          label="价格"
          prefix={<span className="text-tokens-text-secondary">¥</span>}
          suffix={<span className="text-tokens-text-tertiary">元</span>}
          showClearButton
          onClear={() => setValue('')}
          helpText="请输入价格"
        >
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="请输入价格"
          />
        </FieldWrapper>
      </div>
    );
  },
};

// 完整表单示例
export const 完整表单示例: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      phone: '',
      password: '',
    });

    const [errors, setErrors] = useState({
      username: '',
      email: '',
      phone: '',
      password: '',
    });

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      setErrors({ ...errors, [field]: '' });
    };

    const handleBlur = (field: string) => () => {
      if (!formData[field as keyof typeof formData]) {
        setErrors({
          ...errors,
          [field]: `${field} 是必填字段`,
        });
      }
    };

    return (
      <div className="flex flex-col gap-6 w-[500px] p-6 bg-tokens-surface-primary rounded-tokens-radius-lg shadow-tokens-shadow-sm">
        <h2 className="text-tokens-font-size-xl font-semibold text-tokens-text-primary">
          用户注册
        </h2>

        <FieldWrapper
          label="用户名"
          isRequired
          errorMessage={errors.username}
          showClearButton
          onClear={() => setFormData({ ...formData, username: '' })}
        >
          <Input
            value={formData.username}
            onChange={handleChange('username')}
            onBlur={handleBlur('username')}
            placeholder="请输入用户名"
          />
        </FieldWrapper>

        <FieldWrapper
          label="邮箱"
          isRequired
          errorMessage={errors.email}
          prefix={
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 4h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M2 6l6 4 6-4"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          }
          suffix={<span className="text-tokens-text-tertiary">@email.com</span>}
        >
          <Input
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            placeholder="请输入邮箱"
          />
        </FieldWrapper>

        <FieldWrapper
          label="手机号"
          isRequired
          errorMessage={errors.phone}
          prefix={<span className="text-tokens-text-secondary">+86</span>}
        >
          <Input
            type="tel"
            value={formData.phone}
            onChange={handleChange('phone')}
            onBlur={handleBlur('phone')}
            placeholder="请输入手机号"
          />
        </FieldWrapper>

        <FieldWrapper
          label="密码"
          isRequired
          errorMessage={errors.password}
          suffix={
            <button
              type="button"
              onClick={() => {
                // 切换密码可见性
              }}
              className="text-tokens-text-secondary hover:text-tokens-text-primary transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          }
        >
          <Input
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            onBlur={handleBlur('password')}
            placeholder="请输入密码"
          />
        </FieldWrapper>

        <button
          type="button"
          className="mt-4 px-6 py-3 bg-tokens-brand-primary text-tokens-text-primary rounded-tokens-radius-md hover:bg-tokens-brand-hover transition-colors"
        >
          提交
        </button>
      </div>
    );
  },
};

// Textarea 示例
export const Textarea示例: Story = {
  args: {
    label: '描述',
    helpText: '请详细描述您的需求',
    children: <Textarea placeholder="请输入描述..." rows={4} />,
  },
};

// Select 示例
export const Select示例: Story = {
  args: {
    label: '国家/地区',
    helpText: '请选择您所在的国家或地区',
    children: (
      <Select placeholder="请选择">
        <option value="cn">中国</option>
        <option value="us">美国</option>
        <option value="jp">日本</option>
        <option value="kr">韩国</option>
      </Select>
    ),
  },
};

// 与 InputGroup 组合使用
export const 与InputGroup组合: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[400px]">
      <FieldWrapper
        label="数量"
        prefix={<span className="text-tokens-text-secondary">-</span>}
        suffix={<span className="text-tokens-text-secondary">+</span>}
      >
        <Input placeholder="0" />
      </FieldWrapper>
    </div>
  ),
};
