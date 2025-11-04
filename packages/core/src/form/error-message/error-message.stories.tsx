/**
 * @fileoverview ErrorMessage 组件 Storybook 故事文件
 * @description 展示 ErrorMessage 组件的各种使用场景
 */

import type { Meta, StoryObj } from '@storybook/react'
import { ErrorMessage, ErrorMessageList, ErrorMessageGroup } from './error-message'

// ==============================
// Meta 配置
// ==============================

const meta: Meta<typeof ErrorMessage> = {
  title: 'Forms/ErrorMessage',
  component: ErrorMessage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**ErrorMessage 组件** - 表单字段错误消息组件

## 功能特性
- ✅ 支持多种错误类型显示（default、destructive、warning、info、success）
- ✅ 支持严重程度分级（critical、major、minor、info）
- ✅ 支持图标和视觉标识
- ✅ 支持动画显示/隐藏
- ✅ 支持可关闭状态
- ✅ 支持操作按钮（重试/操作）
- ✅ 支持HTML内容渲染
- ✅ 支持代码高亮
- ✅ 支持隐藏文本（屏幕阅读器可见）
- ✅ TypeScript 类型安全
- ✅ React forwardRef 支持
- ✅ 可访问性支持（ARIA）
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'warning', 'info', 'success'],
      description: '错误消息的状态变体',
    },
    severity: {
      control: 'select',
      options: ['critical', 'major', 'minor', 'info'],
      description: '错误消息的严重程度',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '组件尺寸',
    },
    status: {
      control: 'select',
      options: ['default', 'destructive', 'warning', 'info', 'success'],
      description: '错误消息状态（用于图标和颜色）',
    },
    showIcon: {
      control: 'boolean',
      description: '是否显示状态图标',
    },
    showCodeStyle: {
      control: 'boolean',
      description: '是否使用代码样式显示',
    },
    truncation: {
      control: 'select',
      options: ['none', 'single', 'multi'],
      description: '文本截断模式',
    },
    maxLines: {
      control: 'number',
      description: '最大显示行数',
    },
    dismissible: {
      control: 'boolean',
      description: '是否可关闭',
    },
    disabled: {
      control: 'boolean',
      description: '禁用状态',
    },
    isHidden: {
      control: 'boolean',
      description: '隐藏文本（屏幕阅读器可见）',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ==============================
// 基础故事
// ==============================

export const Default: Story = {
  args: {
    content: '请输入有效的邮箱地址',
    status: 'default',
    severity: 'minor',
  },
  parameters: {
    docs: {
      description: {
        story: '默认状态的错误消息，显示验证错误。',
      },
    },
  },
}

export const Destructive: Story = {
  args: {
    content: '用户名或密码错误，请重试',
    variant: 'destructive',
    severity: 'major',
  },
  parameters: {
    docs: {
      description: {
        story: '破坏性错误，用于需要用户立即关注的严重错误。',
      },
    },
  },
}

export const Warning: Story = {
  args: {
    content: '您的密码强度较弱，建议更换为更安全的密码',
    variant: 'warning',
    severity: 'minor',
  },
  parameters: {
    docs: {
      description: {
        story: '警告消息，用于提示用户注意但不阻止操作的情况。',
      },
    },
  },
}

export const Info: Story = {
  args: {
    content: '验证码已发送到您的邮箱，请查收',
    variant: 'info',
    severity: 'info',
  },
  parameters: {
    docs: {
      description: {
        story: '信息提示，用于提供非错误的信息性消息。',
      },
    },
  },
}

export const Success: Story = {
  args: {
    content: '注册成功，欢迎使用 Xorigo UI',
    variant: 'success',
    severity: 'info',
  },
  parameters: {
    docs: {
      description: {
        story: '成功消息，用于显示操作成功或验证通过的情况。',
      },
    },
  },
}

// ==============================
// 严重程度故事
// ==============================

export const Critical: Story = {
  args: {
    content: '系统出现严重错误，请立即联系技术支持',
    severity: 'critical',
    variant: 'destructive',
    code: 'ERR_500',
  },
  parameters: {
    docs: {
      description: {
        story: '严重错误，需要用户立即关注和采取行动。',
      },
    },
  },
}

export const Major: Story = {
  args: {
    content: '保存失败，请检查网络连接后重试',
    severity: 'major',
    variant: 'destructive',
    code: 'ERR_003',
  },
  parameters: {
    docs: {
      description: {
        story: '重要错误，影响当前操作但不会导致系统崩溃。',
      },
    },
  },
}

export const Minor: Story = {
  args: {
    content: '请完善您的个人信息',
    severity: 'minor',
    variant: 'warning',
  },
  parameters: {
    docs: {
      description: {
        story: '轻微错误或提示，用于非关键性问题。',
      },
    },
  },
}

// ==============================
// 功能特性故事
// ==============================

export const WithCode: Story = {
  args: {
    content: 'AUTH_TOKEN_EXPIRED',
    showCodeStyle: true,
    code: 'ERR_401',
  },
  parameters: {
    docs: {
      description: {
        story: '使用代码样式显示错误代码或技术错误消息。',
      },
    },
  },
}

export const WithActions: Story = {
  args: {
    content: '邮箱验证失败，请检查邮箱地址或重新发送验证码',
    severity: 'major',
    actions: [
      {
        text: '重新发送',
        onClick: () => alert('重新发送验证码'),
        icon: <span>↻</span>,
      },
      {
        text: '更改邮箱',
        onClick: () => alert('跳转到邮箱修改'),
        icon: <span>✏️</span>,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '带有操作按钮的错误消息，允许用户采取纠正行动。',
      },
    },
  },
}

export const Dismissible: Story = {
  args: {
    content: '此功能将在下个版本中移除，请尽快迁移',
    variant: 'warning',
    severity: 'major',
    dismissible: true,
    onDismiss: () => alert('错误消息已关闭'),
  },
  parameters: {
    docs: {
      description: {
        story: '可关闭的错误消息，用户可以手动关闭。',
      },
    },
  },
}

export const WithoutIcon: Story = {
  args: {
    content: '错误消息（无图标）',
    showIcon: false,
  },
  parameters: {
    docs: {
      description: {
        story: '隐藏图标的错误消息，适用于简洁布局。',
      },
    },
  },
}

export const WithCustomIcon: Story = {
  args: {
    content: '自定义图标错误消息',
    icon: <span role="img" aria-label="错误">❌</span>,
  },
  parameters: {
    docs: {
      description: {
        story: '使用自定义图标的错误消息。',
      },
    },
  },
}

// ==============================
// 尺寸变体故事
// ==============================

export const Small: Story = {
  args: {
    content: '小型错误消息',
    size: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: '小尺寸错误消息，适用于紧凑布局。',
      },
    },
  },
}

export const Large: Story = {
  args: {
    content: '大型错误消息',
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: '大尺寸错误消息，适用于需要强调的场景。',
      },
    },
  },
}

// ==============================
// 多行和截断故事
// ==============================

export const MultiLine: Story = {
  args: {
    content: '这是一个较长的错误消息，用来测试多行文本的显示效果。消息可能会占用多行空间，需要确保布局正确。',
    maxLines: 2,
  },
  parameters: {
    docs: {
      description: {
        story: '多行错误消息，支持最大行数限制。',
      },
    },
  },
}

export const Truncated: Story = {
  args: {
    content: '这是一个会被截断的非常非常长的错误消息文本，用于测试截断功能是否正常工作',
    truncation: 'single',
  },
  parameters: {
    docs: {
      description: {
        story: '单行截断的错误消息，超出部分显示省略号。',
      },
    },
  },
}

// ==============================
// 状态故事
// ==============================

export const Disabled: Story = {
  args: {
    content: '禁用状态的错误消息',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: '禁用状态的错误消息，所有交互被禁用。',
      },
    },
  },
}

export const Hidden: Story = {
  args: {
    content: '隐藏文本（屏幕阅读器可见）',
    isHidden: true,
  },
  parameters: {
    docs: {
      description: {
        story: '隐藏文本但屏幕阅读器仍然可以读取的设置。',
      },
    },
  },
}

// ==============================
// 列表故事
// ==============================

export const MultipleMessages: Story = {
  render: () => (
    <div style={{ minWidth: '400px' }}>
      <ErrorMessageList
        items={[
          {
            id: '1',
            content: '邮箱格式不正确',
            status: 'destructive',
            severity: 'major',
            code: 'ERR_001',
          },
          {
            id: '2',
            content: '密码长度至少 8 位',
            status: 'destructive',
            severity: 'minor',
            code: 'ERR_002',
          },
          {
            id: '3',
            content: '验证码不能为空',
            status: 'destructive',
            severity: 'critical',
            code: 'ERR_003',
          },
        ]}
        title="请修复以下错误"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '显示多个错误消息的列表，自动添加动画效果。',
      },
    },
  },
}

export const WithListActions: Story = {
  render: () => (
    <div style={{ minWidth: '400px' }}>
      <ErrorMessageList
        items={[
          {
            id: '1',
            content: '文件上传失败',
            status: 'destructive',
            severity: 'major',
            actions: [
              {
                text: '重试',
                onClick: () => alert('重试上传'),
              },
            ],
          },
          {
            id: '2',
            content: '格式不支持',
            status: 'warning',
            severity: 'minor',
            actions: [
              {
                text: '查看支持格式',
                onClick: () => alert('打开帮助文档'),
              },
            ],
          },
        ]}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '列表中的每个错误消息都可以有独立的操作按钮。',
      },
    },
  },
}

// ==============================
// Group 故事
// ==============================

export const ErrorGroup: Story = {
  render: () => (
    <div style={{ minWidth: '400px' }}>
      <ErrorMessageGroup
        items={[
          {
            id: '1',
            content: '用户名不能为空',
            status: 'destructive',
            severity: 'major',
          },
          {
            id: '2',
            content: '密码强度不足',
            status: 'destructive',
            severity: 'minor',
          },
        ]}
        title="表单验证错误"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'ErrorMessageGroup 与 ErrorMessageList 功能相同，提供别名便于使用。',
      },
    },
  },
}

// ==============================
// 组合使用故事
// ==============================

export const InFormContext: Story = {
  render: () => (
    <form style={{ minWidth: '400px', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
          邮箱地址
        </label>
        <input
          id="email"
          type="email"
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ef4444',
            borderRadius: '6px',
            fontSize: '14px',
          }}
          placeholder="example@domain.com"
        />
        <ErrorMessage
          content="请输入有效的邮箱地址"
          status="destructive"
          severity="major"
          fieldId="email"
          showIcon={true}
        />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
          密码
        </label>
        <input
          id="password"
          type="password"
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ef4444',
            borderRadius: '6px',
            fontSize: '14px',
          }}
          placeholder="至少 8 位字符"
        />
        <ErrorMessage
          content="密码长度至少 8 位"
          status="destructive"
          severity="minor"
          fieldId="password"
          showIcon={true}
        />
      </div>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: '在表单上下文中的错误消息示例，展示与输入框的关联。',
      },
    },
  },
}

// ==============================
// 高级使用故事
// ==============================

export const ComplexExample: Story = {
  render: () => {
    const [isVisible, setIsVisible] = React.useState(true)
    const [errorCount, setErrorCount] = React.useState(3)

    const handleDismiss = () => {
      setIsVisible(false)
    }

    const handleRetry = () => {
      alert('重试操作')
      setErrorCount(0)
      setIsVisible(false)
    }

    const items = errorCount > 0 ? Array.from({ length: errorCount }, (_, i) => ({
      id: `err-${i}`,
      content: `错误 ${i + 1}: 操作失败，请检查后重试`,
      status: 'destructive' as const,
      severity: i === 0 ? 'critical' as const : 'major' as const,
      code: `ERR_${100 + i}`,
      actions: i === 0 ? [{
        text: '重试',
        onClick: handleRetry,
        icon: <span>↻</span>,
      }] : undefined,
    })) : []

    return (
      <div style={{ minWidth: '500px' }}>
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={() => setErrorCount(3)}
            style={{
              padding: '8px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginRight: '8px',
            }}
          >
            显示 3 个错误
          </button>
          <button
            onClick={() => setErrorCount(1)}
            style={{
              padding: '8px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginRight: '8px',
            }}
          >
            显示 1 个错误
          </button>
          <button
            onClick={() => setErrorCount(0)}
            style={{
              padding: '8px 16px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            清除错误
          </button>
        </div>

        {isVisible && errorCount > 0 && (
          <ErrorMessageList
            items={items}
            title={`发现 ${errorCount} 个错误`}
            dismissible={true}
            onDismiss={handleDismiss}
            animation={true}
          />
        )}

        {errorCount === 0 && (
          <div style={{
            padding: '16px',
            background: '#d1fae5',
            color: '#065f46',
            borderRadius: '6px',
            border: '1px solid #10b981',
          }}>
            ✓ 所有错误已解决
          </div>
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '复杂使用示例，展示动态错误消息管理和交互功能。',
      },
    },
  },
}
