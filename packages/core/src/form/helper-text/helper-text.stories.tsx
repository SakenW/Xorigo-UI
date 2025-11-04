/**
 * @fileoverview HelperText 组件 Storybook 故事
 * @description 展示 HelperText 组件的各种使用场景和状态
 */

import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from '@storybook/test'
import React from 'react'
import { HelperText, HelperTextList } from './helper-text'

// ==============================
// 元数据配置
// ==============================

const meta = {
  title: 'Forms/HelperText',
  component: HelperText,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
HelperText 组件用于在表单字段中显示帮助文本、说明信息或错误提示。

## 特性

- ✅ 支持多种状态（默认、信息、警告、错误、成功）
- ✅ 可选图标显示
- ✅ 链接支持
- ✅ 文本截断和最大行数控制
- ✅ 完全可访问（ARIA 支持）
- ✅ 动画效果
- ✅ forwardRef 支持
- ✅ 七轴主题系统集成

## 使用场景

- 表单字段的说明文字
- 错误和警告消息提示
- 帮助和提示信息
- 成功反馈消息
        `
      }
    },
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: '帮助文本内容',
    },
    status: {
      control: 'select',
      options: ['default', 'info', 'warning', 'error', 'success'],
      description: '文本状态类型',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '文本尺寸',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    showIcon: {
      control: 'boolean',
      description: '是否显示图标',
      table: {
        defaultValue: { summary: false },
      },
    },
    truncation: {
      control: 'select',
      options: ['none', 'single', 'multi'],
      description: '文本截断模式',
      table: {
        defaultValue: { summary: 'none' },
      },
    },
    maxLines: {
      control: 'number',
      min: 0,
      max: 5,
      description: '最大行数（0表示不限制）',
    },
    disabled: {
      control: 'boolean',
      description: '禁用状态',
      table: {
        defaultValue: { summary: false },
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '400px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HelperText>

export default meta

type Story = StoryObj<typeof meta>

// ==============================
// 基础故事
// ==============================

export const Default: Story = {
  args: {
    content: '这是一个帮助文本，用于说明字段的用途和要求。',
  },
  name: '默认状态',
}

export const WithChildren: Story = {
  args: {
    children: (
      <span>通过 <strong>children</strong> 渲染的内容</span>
    ),
  },
  name: '通过 Children 渲染',
}

// ==============================
// 状态变体
// ==============================

export const InfoStatus: Story = {
  args: {
    status: 'info',
    content: '请确保填写的信息准确无误。',
    showIcon: true,
  },
  name: '信息状态',
}

export const WarningStatus: Story = {
  args: {
    status: 'warning',
    content: '密码长度至少需要8个字符。',
    showIcon: true,
  },
  name: '警告状态',
}

export const ErrorStatus: Story = {
  args: {
    status: 'error',
    content: '该邮箱地址已被注册，请使用其他邮箱。',
    showIcon: true,
  },
  name: '错误状态',
}

export const SuccessStatus: Story = {
  args: {
    status: 'success',
    content: '验证成功，您的信息已保存。',
    showIcon: true,
  },
  name: '成功状态',
}

// ==============================
// 尺寸示例
// ==============================

export const SmallSize: Story = {
  args: {
    size: 'sm',
    content: '小尺寸文本，适合紧凑布局。',
    showIcon: true,
  },
  name: '小尺寸',
}

export const MediumSize: Story = {
  args: {
    size: 'md',
    content: '中等尺寸文本（默认）。',
    showIcon: true,
  },
  name: '中等尺寸',
}

export const LargeSize: Story = {
  args: {
    size: 'lg',
    content: '大尺寸文本，更易阅读。',
    showIcon: true,
  },
  name: '大尺寸',
}

// ==============================
// 带图标示例
// ==============================

export const WithIcon: Story = {
  args: {
    showIcon: true,
    content: '这是一个带有图标帮助文本示例。',
  },
  name: '带图标',
}

export const WithCustomIcon: Story = {
  args: {
    showIcon: true,
    icon: (
      <span style={{ fontSize: '16px' }}>💡</span>
    ),
    content: '使用自定义图标。',
  },
  name: '自定义图标',
}

// ==============================
// 链接示例
// ==============================

export const WithLink: Story = {
  args: {
    content: '如果您忘记密码，请点击 {1} 找回。',
    links: [
      { text: '这里', href: '/forgot-password' }
    ],
  },
  name: '带链接',
}

export const WithExternalLink: Story = {
  args: {
    content: '了解更多，请访问 {1} 或查看 {2}。',
    links: [
      { text: '官方文档', href: 'https://example.com/docs', external: true },
      { text: '使用指南', href: '/guide' }
    ],
  },
  name: '外部链接',
}

// ==============================
// 截断示例
// ==============================

export const SingleLineTruncation: Story = {
  args: {
    truncation: 'single',
    content: '这是一个非常长的文本，将被截断为单行显示，超出部分显示为省略号。',
  },
  name: '单行截断',
}

export const MultiLineTruncation: Story = {
  args: {
    truncation: 'multi',
    content: '这是一个多行文本，将被正确处理换行。',
  },
  name: '多行截断',
}

export const MaxLines: Story = {
  args: {
    maxLines: 2,
    content: '第一行内容\n第二行内容\n第三行内容\n第四行内容\n第五行内容',
  },
  name: '最大行数限制',
}

// ==============================
// 状态控制示例
// ==============================

export const Disabled: Story = {
  args: {
    disabled: true,
    content: '禁用状态的帮助文本。',
    showIcon: true,
  },
  name: '禁用状态',
}

export const HiddenText: Story = {
  args: {
    isHidden: true,
    content: '隐藏文本（屏幕阅读器可见）。',
  },
  name: '隐藏文本',
}

// ==============================
// 交互测试
// ==============================

export const LinkInteraction: Story = {
  args: {
    content: '点击 {1} 了解详情。',
    links: [
      { text: '链接', href: '#' }
    ],
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const link = canvas.getByRole('link', { name: '链接' })

    await step('点击链接', async () => {
      await userEvent.click(link)
      // 在实际应用中，这里会导航到链接地址
      expect(link).toBeInTheDocument()
    })
  },
  name: '链接交互',
}

// ==============================
// HelperTextList 示例
// ==============================

export const ListDefault: Story = {
  render: () => (
    <div style={{ maxWidth: '500px' }}>
      <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 500 }}>多条帮助文本</h4>
      <HelperTextList
        items={[
          { content: '第一条帮助信息' },
          { content: '第二条帮助信息' },
          { content: '第三条帮助信息' }
        ]}
      />
    </div>
  ),
  name: '文本列表',
}

export const ListWithStatuses: Story = {
  render: () => (
    <div style={{ maxWidth: '500px' }}>
      <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 500 }}>混合状态</h4>
      <HelperTextList
        items={[
          { content: '成功提示：操作已完成', status: 'success' },
          { content: '信息提示：请检查您的输入', status: 'info' },
          { content: '警告提示：密码强度较弱', status: 'warning' },
          { content: '错误提示：请填写必填字段', status: 'error' }
        ]}
      />
    </div>
  ),
  name: '混合状态列表',
}

export const ListWithLinks: Story = {
  render: () => (
    <div style={{ maxWidth: '500px' }}>
      <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 500 }}>带链接的列表</h4>
      <HelperTextList
        items={[
          {
            content: '查看 {1} 了解更多',
            status: 'info' as const,
            // 注意：HelperTextList 暂不支持 links prop，
            // 需要在单个 HelperText 中使用
          },
          { content: '默认状态的帮助文本' }
        ]}
      />
    </div>
  ),
  name: '列表中的链接',
}

// ==============================
// 完整表单示例
// ==============================

export const FormExample: Story = {
  render: () => (
    <form style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
          邮箱地址
        </label>
        <input
          id="email"
          type="email"
          placeholder="请输入邮箱"
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
        <div style={{ marginTop: '8px' }}>
          <HelperText
            status="info"
            content="我们将向此邮箱发送验证邮件。"
            showIcon={true}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
          密码
        </label>
        <input
          id="password"
          type="password"
          placeholder="请输入密码"
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
        <div style={{ marginTop: '8px' }}>
          <HelperText
            status="warning"
            content="密码至少需要8个字符，包含大小写字母和数字。"
            showIcon={true}
          />
        </div>
      </div>

      <div>
        <label htmlFor="confirm-password" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
          确认密码
        </label>
        <input
          id="confirm-password"
          type="password"
          placeholder="请再次输入密码"
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
        <div style={{ marginTop: '8px' }}>
          <HelperText
            status="error"
            content="两次输入的密码不一致，请重新输入。"
            showIcon={true}
          />
        </div>
      </div>

      <div>
        <label htmlFor="website" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
          个人网站
        </label>
        <input
          id="website"
          type="url"
          placeholder="https://"
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
        <div style={{ marginTop: '8px' }}>
          <HelperText
            content="如果需要，请访问 {1} 了解更多关于域名配置的信息。"
            links={[
              { text: '域名配置指南', href: '/docs/domain-setup', external: true }
            ]}
          />
        </div>
      </div>
    </form>
  ),
  name: '表单中的使用',
  parameters: {
    docs: {
      description: {
        story: '在真实表单中 HelperText 组件的使用示例，展示各种状态的帮助文本。',
      },
    },
  },
}

// ==============================
// 主题系统示例
// ==============================

export const ThemeSystem: Story = {
  render: () => (
    <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>七轴主题系统集成</h3>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 500 }}>默认状态</h4>
        <HelperText content="帮助文本示例" />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 500 }}>信息状态</h4>
        <HelperText status="info" content="信息提示文本" showIcon={true} />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 500 }}>成功状态</h4>
        <HelperText status="success" content="成功提示文本" showIcon={true} />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 500 }}>警告状态</h4>
        <HelperText status="warning" content="警告提示文本" showIcon={true} />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 500 }}>错误状态</h4>
        <HelperText status="error" content="错误提示文本" showIcon={true} />
      </div>
    </div>
  ),
  name: '主题系统集成',
  parameters: {
    docs: {
      description: {
        story: 'HelperText 组件与七轴主题系统的完整集成，支持所有设计令牌和主题切换。',
      },
    },
  },
}
