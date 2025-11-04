/**
 * 📋 KeyValueList 组件故事文件
 *
 * @version 2025.11.04
 * @category Data Display
 */

import type { Meta, StoryObj } from '@storybook/react'
import { KeyValueList, KeyValueItem, KeyValueListProps, KeyValueItem as KeyValueItemType } from './key-value-list'
import React from 'react'

// 模拟 framer-motion
const MockMotion = ({ children, ...props }: any) => <div {...props}>{children}</div>
const MockAnimatePresence = ({ children }: any) => <>{children}</>

const meta = {
  title: 'Data Display/KeyValueList',
  component: KeyValueList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
KeyValueList 是一个用于展示键值对信息的组件，支持多种布局和交互功能。

## 功能特性
- ✅ 多种布局方式（垂直、水平、两列）
- ✅ 支持尺寸和密度控制
- ✅ 复制功能
- ✅ 编辑功能
- ✅ 分组显示
- ✅ 可折叠分组
- ✅ 空状态和加载状态
- ✅ 隐藏空值选项
- ✅ 自定义对齐方式
- ✅ React 组件值支持
- ✅ 响应式设计
- ✅ 可访问性支持
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'bordered', 'filled'],
      description: '视觉变体',
    },
    layout: {
      control: 'select',
      options: ['vertical', 'horizontal', 'twoColumn', 'auto'],
      description: '布局方式',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '尺寸大小',
    },
    density: {
      control: 'select',
      options: ['compact', 'normal', 'spacious'],
      description: '密度控制',
    },
    alignItems: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end'],
      description: '项目对齐方式',
    },
    valueAlign: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: '值对齐方式',
    },
    keyAlign: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: '键对齐方式',
    },
  },
} satisfies Meta<typeof KeyValueList>

export default meta
type Story = StoryObj<typeof meta>

// ===== 基础示例 =====
export const Default: Story = {
  args: {
    items: [
      { key: 'name', label: '姓名', value: '张三' },
      { key: 'age', label: '年龄', value: 25 },
      { key: 'email', label: '邮箱', value: 'zhangsan@example.com' },
      { key: 'phone', label: '电话', value: '138****8888' },
    ],
  },
}

// ===== 不同变体 =====
export const Outline: Story = {
  args: {
    items: [
      { key: 'name', label: '姓名', value: '张三' },
      { key: 'age', label: '年龄', value: 25 },
    ],
    variant: 'outline',
  },
}

export const Ghost: Story = {
  args: {
    items: [
      { key: 'name', label: '姓名', value: '张三' },
      { key: 'age', label: '年龄', value: 25 },
    ],
    variant: 'ghost',
  },
}

export const Bordered: Story = {
  args: {
    items: [
      { key: 'name', label: '姓名', value: '张三' },
      { key: 'age', label: '年龄', value: 25 },
    ],
    variant: 'bordered',
  },
}

export const Filled: Story = {
  args: {
    items: [
      { key: 'name', label: '姓名', value: '张三' },
      { key: 'age', label: '年龄', value: 25 },
    ],
    variant: 'filled',
  },
}

// ===== 不同布局 =====
export const VerticalLayout: Story = {
  args: {
    items: [
      { key: 'name', label: '姓名', value: '张三' },
      { key: 'age', label: '年龄', value: 25 },
      { key: 'email', label: '邮箱', value: 'zhangsan@example.com' },
      { key: 'phone', label: '电话', value: '138****8888' },
    ],
    layout: 'vertical',
  },
}

export const HorizontalLayout: Story = {
  args: {
    items: [
      { key: 'name', label: '姓名', value: '张三' },
      { key: 'age', label: '年龄', value: 25 },
      { key: 'email', label: '邮箱', value: 'zhangsan@example.com' },
    ],
    layout: 'horizontal',
  },
}

export const TwoColumnLayout: Story = {
  args: {
    items: [
      { key: 'name', label: '姓名', value: '张三' },
      { key: 'age', label: '年龄', value: 25 },
      { key: 'email', label: '邮箱', value: 'zhangsan@example.com' },
      { key: 'phone', label: '电话', value: '138****8888' },
    ],
    layout: 'twoColumn',
  },
}

// ===== 不同尺寸 =====
export const SmallSize: Story = {
  args: {
    items: [
      { key: 'name', label: '姓名', value: '张三' },
      { key: 'age', label: '年龄', value: 25 },
    ],
    size: 'sm',
  },
}

export const LargeSize: Story = {
  args: {
    items: [
      { key: 'name', label: '姓名', value: '张三' },
      { key: 'age', label: '年龄', value: 25 },
    ],
    size: 'lg',
  },
}

// ===== 不同密度 =====
export const CompactDensity: Story = {
  args: {
    items: [
      { key: 'name', label: '姓名', value: '张三' },
      { key: 'age', label: '年龄', value: 25 },
      { key: 'email', label: '邮箱', value: 'zhangsan@example.com' },
    ],
    density: 'compact',
  },
}

export const SpaciousDensity: Story = {
  args: {
    items: [
      { key: 'name', label: '姓名', value: '张三' },
      { key: 'age', label: '年龄', value: 25 },
    ],
    density: 'spacious',
  },
}

// ===== 复制功能 =====
export const WithCopy: Story = {
  args: {
    items: [
      {
        key: 'email',
        label: '邮箱',
        value: 'zhangsan@example.com',
        copyable: true,
      },
      {
        key: 'phone',
        label: '电话',
        value: '138****8888',
        copyable: true,
      },
    ],
    copyable: true,
  },
}

// ===== 编辑功能 =====
export const WithEdit: Story = {
  args: {
    items: [
      {
        key: 'name',
        label: '姓名',
        value: '张三',
        editable: true,
      },
      {
        key: 'age',
        label: '年龄',
        value: 25,
        editable: true,
      },
    ],
    allowEdit: true,
  },
}

// ===== 分组显示 =====
export const WithGroups: Story = {
  args: {
    groups: [
      {
        title: '基本信息',
        items: [
          { key: 'name', label: '姓名', value: '张三' },
          { key: 'age', label: '年龄', value: 25 },
          { key: 'gender', label: '性别', value: '男' },
        ],
      },
      {
        title: '联系信息',
        items: [
          { key: 'email', label: '邮箱', value: 'zhangsan@example.com' },
          { key: 'phone', label: '电话', value: '138****8888' },
        ],
      },
      {
        title: '其他信息',
        items: [
          { key: 'address', label: '地址', value: '北京市朝阳区' },
        ],
      },
    ],
  },
}

// ===== 可折叠分组 =====
export const CollapsibleGroups: Story = {
  args: {
    groups: [
      {
        title: '基本信息',
        items: [
          { key: 'name', label: '姓名', value: '张三' },
          { key: 'age', label: '年龄', value: 25 },
        ],
        collapsible: true,
        defaultExpanded: true,
      },
      {
        title: '联系信息',
        items: [
          { key: 'email', label: '邮箱', value: 'zhangsan@example.com' },
        ],
        collapsible: true,
        defaultExpanded: false,
      },
      {
        title: '其他信息',
        items: [
          { key: 'note', label: '备注', value: '这是一个备注信息' },
        ],
        collapsible: true,
        defaultExpanded: false,
      },
    ],
    collapsibleGroups: true,
  },
}

// ===== 自定义对齐 =====
export const CustomAlign: Story = {
  args: {
    items: [
      { key: 'left', label: '左对齐', value: 'Left' },
      { key: 'center', label: '居中', value: 'Center' },
      { key: 'right', label: '右对齐', value: 'Right' },
    ],
    keyAlign: 'left',
    valueAlign: 'right',
    alignItems: 'flex-start',
  },
}

// ===== 隐藏空值 =====
export const HideEmptyValues: Story = {
  args: {
    items: [
      { key: 'name', label: '姓名', value: '张三' },
      { key: 'age', label: '年龄', value: '' },
      { key: 'email', label: '邮箱', value: 'zhangsan@example.com' },
      { key: 'phone', label: '电话', value: null },
      { key: 'address', label: '地址', value: undefined },
      { key: 'score', label: '分数', value: 0 },
    ],
    items: [
      { key: 'name', label: '姓名', value: '张三', hideWhenEmpty: true },
      { key: 'age', label: '年龄', value: '', hideWhenEmpty: true },
      { key: 'email', label: '邮箱', value: 'zhangsan@example.com', hideWhenEmpty: true },
      { key: 'phone', label: '电话', value: null, hideWhenEmpty: true },
      { key: 'address', label: '地址', value: undefined, hideWhenEmpty: true },
      { key: 'score', label: '分数', value: 0, hideWhenEmpty: true },
    ],
  },
}

// ===== 加载状态 =====
export const Loading: Story = {
  args: {
    loading: true,
  },
}

// ===== 空状态 =====
export const Empty: Story = {
  args: {
    items: [],
    emptyText: '暂无数据，请添加内容',
  },
}

// ===== React 组件值 =====
export const ReactComponentValue: Story = {
  args: {
    items: [
      {
        key: 'name',
        label: '姓名',
        value: (
          <span style={{ color: 'blue', fontWeight: 'bold' }}>
            张三
          </span>
        ),
      },
      {
        key: 'status',
        label: '状态',
        value: (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              background: '#10b981',
              color: 'white',
              fontSize: '12px',
            }}
          >
            活跃
          </span>
        ),
      },
      {
        key: 'tags',
        label: '标签',
        value: (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {['React', 'TypeScript', 'UI'].map(tag => (
              <span
                key={tag}
                style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: '#f3f4f6',
                  fontSize: '12px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        ),
      },
    ],
  },
}

// ===== 复杂示例：用户资料 =====
export const UserProfile: Story = {
  args: {
    groups: [
      {
        title: '个人信息',
        icon: <span>👤</span>,
        items: [
          { key: 'name', label: '姓名', value: '张三' },
          { key: 'email', label: '邮箱', value: 'zhangsan@example.com', copyable: true },
          { key: 'phone', label: '手机号', value: '138****8888', copyable: true },
          { key: 'gender', label: '性别', value: '男' },
          { key: 'birthday', label: '生日', value: '1995-06-15' },
        ],
        collapsible: true,
      },
      {
        title: '职业信息',
        icon: <span>💼</span>,
        items: [
          { key: 'company', label: '公司', value: 'Xorigo Tech' },
          { key: 'position', label: '职位', value: '前端工程师' },
          { key: 'department', label: '部门', value: '产品研发部' },
          { key: 'location', label: '工作地', value: '北京市朝阳区' },
        ],
        collapsible: true,
      },
      {
        title: '账户设置',
        icon: <span>⚙️</span>,
        items: [
          { key: 'username', label: '用户名', value: 'zhangsan', editable: true },
          { key: 'level', label: '等级', value: 'VIP' },
          { key: 'points', label: '积分', value: 12580 },
        ],
        collapsible: true,
        defaultExpanded: false,
      },
    ],
    variant: 'bordered',
    density: 'normal',
    copyable: true,
    collapsibleGroups: true,
  },
}

// ===== 仪表板指标 =====
export const DashboardMetrics: Story = {
  args: {
    items: [
      {
        key: 'visits',
        label: '总访问量',
        value: '125,430',
        color: 'primary',
      },
      {
        key: 'users',
        label: '活跃用户',
        value: '8,394',
        color: 'success',
      },
      {
        key: 'revenue',
        label: '总收入',
        value: '¥982,500',
        color: 'primary',
      },
      {
        key: 'conversion',
        label: '转化率',
        value: '3.24%',
        color: 'warning',
      },
      {
        key: 'bounce',
        label: '跳出率',
        value: '42.1%',
        color: 'error',
      },
      {
        key: 'avgTime',
        label: '平均停留',
        value: '5m 32s',
        color: 'muted',
      },
    ],
    layout: 'twoColumn',
    variant: 'filled',
    size: 'md',
    density: 'spacious',
  },
}

// ===== 预设组件示例 =====
export const SimpleList: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '20px', width: '100%' }}>
      <div>
        <h3>Simple Key Value List</h3>
        <SimpleKeyValueList
          items={[
            { key: 'name', label: '姓名', value: '张三' },
            { key: 'age', label: '年龄', value: 25 },
          ]}
        />
      </div>

      <div>
        <h3>Card Key Value List</h3>
        <CardKeyValueList
          items={[
            { key: 'name', label: '姓名', value: '张三' },
            { key: 'age', label: '年龄', value: 25 },
          ]}
        />
      </div>

      <div>
        <h3>Bordered Key Value List</h3>
        <BorderedKeyValueList
          items={[
            { key: 'name', label: '姓名', value: '张三' },
            { key: 'age', label: '年龄', value: 25 },
          ]}
        />
      </div>

      <div>
        <h3>Filled Key Value List</h3>
        <FilledKeyValueList
          items={[
            { key: 'name', label: '姓名', value: '张三' },
            { key: 'age', label: '年龄', value: 25 },
          ]}
        />
      </div>
    </div>
  ),
}

// 导入预设组件
const { SimpleKeyValueList, CardKeyValueList, BorderedKeyValueList, FilledKeyValueList } = require('./key-value-list')

// ===== 文档化示例：完整 API =====
export const APIReference: Story = {
  args: {
    items: [
      {
        key: 'variant',
        label: 'variant',
        value: '"default" | "outline" | "ghost" | "bordered" | "filled"',
      },
      {
        key: 'layout',
        label: 'layout',
        value: '"vertical" | "horizontal" | "twoColumn" | "auto"',
      },
      {
        key: 'size',
        label: 'size',
        value: '"sm" | "md" | "lg"',
      },
      {
        key: 'density',
        label: 'density',
        value: '"compact" | "normal" | "spacious"',
      },
      {
        key: 'copyable',
        label: 'copyable',
        value: 'boolean',
      },
      {
        key: 'editable',
        label: 'editable',
        value: 'boolean',
      },
      {
        key: 'collapsibleGroups',
        label: 'collapsibleGroups',
        value: 'boolean',
      },
      {
        key: 'alignItems',
        label: 'alignItems',
        value: '"flex-start" | "center" | "flex-end"',
      },
      {
        key: 'valueAlign',
        label: 'valueAlign',
        value: '"left" | "center" | "right"',
      },
      {
        key: 'keyAlign',
        label: 'keyAlign',
        value: '"left" | "center" | "right"',
      },
    ],
    variant: 'ghost',
    size: 'sm',
  },
}

// ===== 交互测试 =====
export const InteractiveTest: Story = {
  args: {
    items: [
      {
        key: 'name',
        label: '姓名',
        value: '张三',
        editable: true,
        copyable: true,
      },
      {
        key: 'email',
        label: '邮箱',
        value: 'zhangsan@example.com',
        copyable: true,
      },
      {
        key: 'phone',
        label: '电话',
        value: '138****8888',
        copyable: true,
      },
    ],
    variant: 'outline',
    size: 'md',
    density: 'normal',
    copyable: true,
    allowEdit: true,
  },
}
