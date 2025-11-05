/**
 * @fileoverview FormErrorBanner 组件 Storybook 故事
 * @file FormErrorBanner.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react'
import { FormErrorBanner } from './form-error-banner'
import { userEvent, within, expect } from '@storybook/test'

// ==============================
// 元数据配置
// ==============================

const meta = {
  title: '表单组件/FormErrorBanner',
  component: FormErrorBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '表单错误横幅组件，用于显示表单级别的全局错误信息，支持多种错误类型、自动消失、重试功能和详细的错误展示。'
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'warning', 'info', 'success'],
      description: '错误横幅的状态变体'
    },
    severity: {
      control: 'select',
      options: ['critical', 'major', 'minor'],
      description: '错误的严重程度'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '组件尺寸'
    },
    errorType: {
      control: 'select',
      options: ['validation', 'network', 'server', 'permission', 'unknown'],
      description: '错误类型（影响图标显示）'
    },
    visible: {
      control: 'boolean',
      description: '是否显示'
    },
    autoDismiss: {
      control: 'number',
      description: '自动消失延迟（毫秒，0表示不自动消失）'
    },
    dismissible: {
      control: 'boolean',
      description: '是否可手动关闭'
    },
    fixed: {
      control: 'boolean',
      description: '是否固定定位'
    },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'top-full'],
      description: '固定位置'
    },
    showIcon: {
      control: 'boolean',
      description: '是否显示图标'
    },
    showDetailsToggle: {
      control: 'boolean',
      description: '是否显示详情切换按钮'
    }
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '800px', padding: '20px' }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof FormErrorBanner>

export default meta
type Story = StoryObj<typeof meta>

// ==============================
// 基础示例
// ==============================

export const 基础用法: Story = {
  args: {
    message: '提交失败，请检查输入的信息是否正确。',
    variant: 'destructive',
    severity: 'major',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText('提交失败，请检查输入的信息是否正确。')).toBeInTheDocument()
  }
}

export const 不同严重程度: Story = {
  args: {
    message: '这是一个严重错误，可能影响整个表单提交。',
    variant: 'destructive',
    severity: 'critical',
  },
  parameters: {
    docs: {
      description: {
        story: '展示 critical 严重程度的错误横幅，通常用于阻止表单提交的严重错误。'
      }
    }
  }
}

export const 警告错误: Story = {
  args: {
    message: '网络连接不稳定，部分数据可能未保存。',
    variant: 'warning',
    severity: 'major',
  },
  parameters: {
    docs: {
      description: {
        story: '警告类型的错误，通常用于非致命的错误情况。'
      }
    }
  }
}

export const 信息提示: Story = {
  args: {
    message: '表单提交需要额外验证，请稍候。',
    variant: 'info',
    severity: 'minor',
  },
  parameters: {
    docs: {
      description: {
        story: '信息类型的提示，不是错误但需要用户关注。'
      }
    }
  }
}

export const 成功提示: Story = {
  args: {
    message: '表单提交成功！',
    variant: 'success',
    severity: 'minor',
  },
  parameters: {
    docs: {
      description: {
        story: '成功状态的横幅，用于显示操作成功的反馈。'
      }
    }
  }
}

// ==============================
// 错误类型示例
// ==============================

export const 验证错误: Story = {
  args: {
    message: '表单验证失败，请检查以下错误：',
    errorType: 'validation',
    variant: 'destructive',
    severity: 'major',
    details: `错误详情：
- 邮箱地址格式不正确
- 手机号码缺少区号
- 密码强度不符合要求（至少8位，包含大小写字母和数字）`,
    defaultExpanded: true
  },
  parameters: {
    docs: {
      description: {
        story: '验证错误类型，显示表单字段验证失败的详细错误信息。'
      }
    }
  }
}

export const 网络错误: Story = {
  args: {
    message: '网络连接失败，请检查网络设置或稍后重试。',
    errorType: 'network',
    variant: 'warning',
    severity: 'major',
    onRetry: () => alert('正在重试...'),
  },
  parameters: {
    docs: {
      description: {
        story: '网络错误类型，提供重试功能帮助用户恢复。'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const retryButton = canvas.getByText('重试')
    await userEvent.click(retryButton)
  }
}

export const 服务器错误: Story = {
  args: {
    message: '服务器内部错误，错误代码：500',
    errorType: 'server',
    variant: 'destructive',
    severity: 'critical',
    code: 'SERVER_ERROR_500',
    details: `错误堆栈：
Error: Internal Server Error
    at /api/submit (line 42)
    at async handleSubmit (line 128)
    at async processForm (line 256)`,
    defaultExpanded: false
  },
  parameters: {
    docs: {
      description: {
        story: '服务器错误类型，显示服务器端错误和错误堆栈。'
      }
    }
  }
}

export const 权限错误: Story = {
  args: {
    message: '权限不足，无法提交表单。',
    errorType: 'permission',
    variant: 'warning',
    severity: 'major',
    actions: [
      {
        text: '申请权限',
        onClick: () => alert('正在申请权限...')
      },
      {
        text: '联系管理员',
        external: true,
        onClick: () => window.open('mailto:admin@example.com', '_blank')
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: '权限错误类型，提供申请权限或联系管理员的操作按钮。'
      }
    }
  }
}

export const 未知错误: Story = {
  args: {
    message: '发生未知错误，请稍后重试。',
    errorType: 'unknown',
    variant: 'destructive',
    severity: 'major',
    onRetry: () => alert('正在重试...')
  },
  parameters: {
    docs: {
      description: {
        story: '未知错误类型，通用错误处理。'
      }
    }
  }
}

// ==============================
// 交互功能示例
// ==============================

export const 可关闭: Story = {
  args: {
    message: '这是一个可以手动关闭的错误提示。',
    variant: 'warning',
    dismissible: true,
    onDismiss: () => alert('错误横幅已关闭')
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const dismissButton = canvas.getByLabelText('关闭')
    await userEvent.click(dismissButton)
  }
}

export const 自动消失: Story = {
  args: {
    message: '这条消息将在3秒后自动消失。',
    variant: 'success',
    autoDismiss: 3000,
    dismissible: false,
  },
  parameters: {
    docs: {
      description: {
        story: '自动消失的错误横幅，适用于临时性提示信息。'
      }
    }
  }
}

export const 带重试功能: Story = {
  args: {
    message: '提交失败，请检查网络连接。',
    variant: 'warning',
    severity: 'major',
    onRetry: () => alert('正在重试提交...'),
    retryButtonText: '重新提交',
  },
  parameters: {
    docs: {
      description: {
        story: '提供重试按钮的错误横幅，允许用户重新尝试失败的操作。'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const retryButton = canvas.getByText('重新提交')
    await userEvent.click(retryButton)
  }
}

export const 详情展开: Story = {
  args: {
    message: '表单提交遇到多个错误。',
    variant: 'destructive',
    severity: 'major',
    details: `错误详情：
1. 邮箱地址无效：user@example.co（缺少域名后缀）
2. 手机号格式错误：+86 138 0000（缺少区号）
3. 密码不符合要求：长度不足8位
4. 年龄格式错误：请输入数字

建议：
- 请仔细检查所有必填字段
- 确保邮箱格式为 user@domain.com
- 密码长度至少8位，包含大小写字母和数字`,
    showDetailsToggle: true,
    detailsShowText: '查看详细错误',
    detailsHideText: '隐藏错误详情',
    defaultExpanded: false
  },
  parameters: {
    docs: {
      description: {
        story: '支持展开/折叠详情信息的错误横幅，用于显示大量错误详情。'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggleButton = canvas.getByText('查看详细错误')
    await userEvent.click(toggleButton)
  }
}

export const 带操作按钮: Story = {
  args: {
    message: '表单数据验证失败。',
    variant: 'destructive',
    severity: 'major',
    actions: [
      {
        text: '清除数据',
        onClick: () => alert('已清除数据')
      },
      {
        text: '导入示例',
        variant: 'secondary',
        onClick: () => alert('正在导入示例数据...')
      },
      {
        text: '帮助文档',
        external: true,
        icon: <span>📖</span>,
        onClick: () => window.open('https://docs.example.com', '_blank')
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: '提供多个操作按钮的错误横幅，帮助用户快速解决问题。'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const buttons = canvas.getAllByRole('button')
    await userEvent.click(buttons[0])
  }
}

export const 复制错误代码: Story = {
  args: {
    message: '提交过程中发生错误。',
    variant: 'destructive',
    code: 'FORM_ERROR_0x4A2B',
    onCopy: (text) => alert(`已复制：${text}`)
  },
  parameters: {
    docs: {
      description: {
        story: '显示错误代码并支持复制功能，便于问题追踪和反馈。'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const copyButton = canvas.getByText('复制错误')
    await userEvent.click(copyButton)
    await expect(canvas.getByText('已复制')).toBeInTheDocument()
  }
}

// ==============================
// 布局变体示例
// ==============================

export const 紧凑模式: Story = {
  args: {
    message: '这是一个紧凑的错误提示。',
    variant: 'warning',
    severity: 'minor',
    layout: 'compact',
  },
  parameters: {
    docs: {
      description: {
        story: '紧凑布局模式，适用于空间有限的场景。'
      }
    }
  }
}

export宽敞模式: Story = {
  args: {
    message: '这是一个宽敞的错误提示。',
    variant: 'info',
    severity: 'minor',
    layout: 'spacious',
  },
  parameters: {
    docs: {
      description: {
        story: '宽敞布局模式，提供更多内边距。'
      }
    }
  }
}

export const 大尺寸: Story = {
  args: {
    message: '这是一个大尺寸的错误提示。',
    variant: 'warning',
    size: 'lg',
    severity: 'major',
    onRetry: () => alert('正在重试...')
  },
  parameters: {
    docs: {
      description: {
        story: '大尺寸错误横幅，适用于重要错误提示。'
      }
    }
  }
}

export const 小尺寸: Story = {
  args: {
    message: '小尺寸错误提示。',
    variant: 'warning',
    size: 'sm',
    severity: 'minor',
  },
  parameters: {
    docs: {
      description: {
        story: '小尺寸错误横幅，适用于次要错误提示。'
      }
    }
  }
}

// ==============================
// 固定定位示例
// ==============================

export const 固定在顶部: Story = {
  args: {
    message: '这是一个固定在顶部的错误提示。',
    variant: 'warning',
    fixed: true,
    position: 'top',
    dismissible: true,
    onDismiss: () => alert('已关闭固定横幅')
  },
  parameters: {
    docs: {
      description: {
        story: '固定在页面顶部的错误横幅，始终可见直到用户关闭或自动消失。'
      }
    }
  },
  decorators: [
    (Story) => (
      <div style={{
        width: '100%',
        maxWidth: '800px',
        height: '600px',
        padding: '20px',
        border: '1px solid #ccc'
      }}>
        <div style={{ height: '100px', background: '#f0f0f0', marginBottom: '20px' }}>
          页面内容区域
        </div>
        <Story />
      </div>
    )
  ]
}

export const 固定在底部: Story = {
  args: {
    message: '这是一个固定在底部的成功提示。',
    variant: 'success',
    fixed: true,
    position: 'bottom',
    autoDismiss: 5000
  },
  parameters: {
    docs: {
      description: {
        story: '固定在页面底部的提示横幅。'
      }
    }
  }
}

export const 紧跟表单顶部: Story = {
  args: {
    message: '表单验证失败，请检查以下错误。',
    variant: 'destructive',
    fixed: true,
    position: 'top-full',
    details: `验证错误：
- 邮箱格式不正确
- 手机号无效
- 密码强度不足`,
    defaultExpanded: true
  },
  parameters: {
    docs: {
      description: {
        story: '固定在表单顶部的错误横幅，紧跟表单元素。'
      }
    }
  }
}

// ==============================
// 组合示例
// ==============================

export const 复杂示例: Story = {
  args: {
    message: '表单提交遇到严重错误，操作被阻止。',
    variant: 'destructive',
    severity: 'critical',
    code: 'CRITICAL_ERROR_0x9F7E',
    details: `错误堆栈：
Error: Critical form validation failed
    at FormValidator.validate (validator.js:42:17)
    at FormHandler.submit (handler.js:128:23)
    at async processForm (form.js:256:34)
    at async handleSubmit (submit.js:89:45)

错误详情：
1. 表单数据验证失败
   - 邮箱地址格式错误
   - 手机号无效
   - 必填字段缺失

2. 服务器响应异常
   - HTTP 500 内部服务器错误
   - 数据库连接超时
   - 事务回滚

3. 权限检查失败
   - 用户角色不足
   - 操作被拒绝
   - 需要管理员权限

建议解决方案：
- 检查输入数据格式是否正确
- 联系系统管理员获取必要权限
- 稍后重试或联系技术支持
- 错误代码：CRITICAL_ERROR_0x9F7E`,
    showDetailsToggle: true,
    detailsShowText: '查看完整错误堆栈',
    detailsHideText: '隐藏错误堆栈',
    onRetry: () => alert('正在重新提交...'),
    retryButtonText: '重新尝试提交',
    actions: [
      {
        text: '保存为草稿',
        onClick: () => alert('已保存为草稿')
      },
      {
        text: '联系支持',
        external: true,
        icon: <span>📞</span>,
        onClick: () => window.open('mailto:support@example.com?subject=Critical Error 0x9F7E', '_blank')
      }
    ],
    code: 'CRITICAL_ERROR_0x9F7E',
    onCopy: (text) => {
      console.log('复制错误代码:', text)
      navigator.clipboard?.writeText(text)
      alert('已复制错误代码到剪贴板')
    }
  },
  parameters: {
    docs: {
      description: {
        story: '一个包含所有功能的复杂错误横幅示例：严重错误、详细堆栈、重试功能、操作按钮、错误代码和复制功能。'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 点击展开详情
    const detailsButton = canvas.getByText('查看完整错误堆栈')
    await userEvent.click(detailsButton)

    // 点击重试按钮
    const retryButton = canvas.getByText('重新尝试提交')
    await userEvent.click(retryButton)

    // 点击操作按钮
    const actionButtons = canvas.getAllByText('保存为草稿')
    await userEvent.click(actionButtons[0])
  }
}

export const 成功提交示例: Story = {
  args: {
    message: '表单提交成功！您的数据已保存。',
    variant: 'success',
    severity: 'minor',
    code: 'SUCCESS_2024_11_04',
    autoDismiss: 3000,
    dismissible: false,
    actions: [
      {
        text: '查看提交结果',
        onClick: () => alert('正在跳转到结果页面...')
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: '成功状态提示示例，显示表单提交成功的反馈。'
      }
    }
  }
}

export const 网络错误自动重试: Story = {
  args: {
    message: '网络连接失败，正在自动重试...',
    variant: 'warning',
    severity: 'major',
    errorType: 'network',
    autoDismiss: 5000,
    onRetry: () => {
      console.log('自动重试中...')
      alert('网络重试功能已触发')
    }
  },
  parameters: {
    docs: {
      description: {
        story: '网络错误自动重试示例，适合需要自动恢复的场景。'
      }
    }
  }
}

// ==============================
// 无障碍示例
// ==============================

export const 无障碍支持: Story = {
  args: {
    message: '这是一个重视无障碍访问的错误提示。',
    variant: 'warning',
    severity: 'major',
    showIcon: true,
    dismissible: true,
    onRetry: () => alert('重试功能已触发'),
    onDismiss: () => alert('横幅已关闭'),
    onCopy: (text) => {
      navigator.clipboard?.writeText(text)
      alert('已复制错误代码')
    }
  },
  parameters: {
    docs: {
      description: {
        story: '展示完整的无障碍功能支持：正确的 ARIA 属性、键盘导航、屏幕阅读器支持。'
      }
    }
  }
}
