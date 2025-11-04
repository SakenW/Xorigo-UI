/**
 * Collapse 组件 Storybook 故事文件
 * @version 2025.11.04
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Collapse } from './collapse'

const meta = {
  title: 'Data Display/Collapse',
  component: Collapse,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Collapse 折叠面板组件，支持单一面板的展开/折叠。

## 功能特性

- 支持控制/非控制模式
- 支持默认展开状态
- 支持自定义触发器内容
- 支持流畅的动画过渡效果
- 支持嵌套使用
- 支持懒加载模式
- 支持键盘导航（Enter/Space）
- 完整的可访问性支持（ARIA 属性）
- 支持自定义展开/折叠图标
- 支持多种变体和尺寸
- forwardRef 支持
- TypeScript 类型安全

## 使用场景

- FAQ 问答展示
- 详情信息展开/折叠
- 设置项分组
- 文档目录导航
- 商品详情展开
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'ghost'],
      description: '折叠面板变体样式',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '尺寸大小',
    },
    defaultOpen: {
      control: 'boolean',
      description: '默认展开状态（非控制模式）',
    },
    open: {
      control: 'boolean',
      description: '当前展开状态（控制模式）',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    lazy: {
      control: 'boolean',
      description: '懒加载模式（只在展开时渲染内容）',
    },
    keepMounted: {
      control: 'boolean',
      description: '是否保持内容在 DOM 中',
    },
    'aria-label': {
      control: 'text',
      description: 'ARIA 标签',
    },
    'aria-labelledby': {
      control: 'text',
      description: 'ARIA 关联标签 ID',
    },
  },
} satisfies Meta<typeof Collapse>

export default meta
type Story = StoryObj<typeof meta>

// 基础示例
export const Default: Story = {
  args: {
    children: (
      <div className="text-[var(--text-secondary)]">
        这是折叠面板的内容。您可以在这里放置任何内容，比如文本、图片或其他组件。
      </div>
    ),
  },
}

// 默认展开
export const DefaultOpen: Story = {
  args: {
    defaultOpen: true,
    children: (
      <div className="text-[var(--text-secondary)]">
        这个面板默认是展开状态。用户可以看到初始内容。
      </div>
    ),
  },
}

// 不同变体
export const Variants: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <Collapse variant="default">
        <div>Default 变体：带边框和背景色</div>
      </Collapse>
      <Collapse variant="bordered">
        <div>Bordered 变体：仅边框，无背景色</div>
      </Collapse>
      <Collapse variant="ghost">
        <div>Ghost 变体：无边框和背景色</div>
      </Collapse>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持三种变体：default（默认）、bordered（仅边框）、ghost（透明）',
      },
    },
  },
}

// 不同尺寸
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <Collapse size="sm">
        <div>Small 尺寸：小号字体和内边距</div>
      </Collapse>
      <Collapse size="md">
        <div>Medium 尺寸：中等字体和内边距</div>
      </Collapse>
      <Collapse size="lg">
        <div>Large 尺寸：大号字体和内边距</div>
      </Collapse>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持三种尺寸：sm（小号）、md（中等）、lg（大号）',
      },
    },
  },
}

// 自定义触发器
export const CustomTrigger: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <Collapse
        trigger={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-[var(--text-primary)]">点击查看详情</span>
            <div className="text-sm text-[var(--text-secondary)]">▼</div>
          </div>
        }
      >
        <div className="text-[var(--text-secondary)]">
          这里是自定义触发器的内容。您可以完全自定义触发器的外观和行为。
        </div>
      </Collapse>
      <Collapse
        trigger={
          <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg w-full cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <div className="font-medium text-[var(--text-primary)]">产品特性</div>
              <div className="text-sm text-[var(--text-secondary)]">了解我们的核心功能</div>
            </div>
          </div>
        }
      >
        <div className="text-[var(--text-secondary)]">
          <ul className="list-disc list-inside space-y-2">
            <li>高性能的渲染引擎</li>
            <li>完整的 TypeScript 支持</li>
            <li>可访问性优先设计</li>
            <li>丰富的动画效果</li>
          </ul>
        </div>
      </Collapse>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '使用自定义触发器，完全控制头部内容的外观',
      },
    },
  },
}

// 自定义图标
export const CustomIcons: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <Collapse
        expandIcon={
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3L17 10L10 17L3 10L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
        collapseIcon={
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 10H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
      >
        <div>使用自定义图标：展开时显示横线，折叠时显示十字</div>
      </Collapse>
      <Collapse
        expandIcon={
          <span className="text-2xl">➕</span>
        }
        collapseIcon={
          <span className="text-2xl">➖</span>
        }
      >
        <div>使用 Emoji 作为图标</div>
      </Collapse>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '自定义展开和折叠时的图标',
      },
    },
  },
}

// 控制模式
export const Controlled: Story = {
  render: function Render() {
    const [open, setOpen] = React.useState(false)

    return (
      <div className="space-y-4 w-full max-w-2xl">
        <div className="flex gap-2">
          <button
            onClick={() => setOpen(!open)}
            className="px-4 py-2 bg-[var(--bg-primary-action)] text-[var(--text-inverse)] rounded-md hover:opacity-90 transition-opacity"
          >
            {open ? '折叠' : '展开'}
          </button>
        </div>
        <Collapse open={open} onOpenChange={setOpen}>
          <div>这是一个受控组件。展开状态由父组件控制。</div>
        </Collapse>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '使用控制模式，父组件可以完全控制展开状态',
      },
    },
  },
}

// 懒加载
export const LazyMode: Story = {
  args: {
    lazy: true,
    children: (
      <div className="text-[var(--text-secondary)]">
        这个内容是懒加载的，只有在展开时才会渲染到 DOM 中。
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '懒加载模式可以优化性能，内容只在展开时渲染',
      },
    },
  },
}

// 禁用状态
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultOpen: true,
    children: (
      <div className="text-[var(--text-secondary)]">
        这个面板被禁用了，无法交互。
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '禁用状态下无法展开或折叠',
      },
    },
  },
}

// FAQ 示例
export const FAQ: Story = {
  render: () => (
    <div className="space-y-2 w-full max-w-2xl">
      <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">常见问题</h3>
      <Collapse
        trigger={
          <div className="text-left">
            <div className="font-medium text-[var(--text-primary)]">什么是 Xorigo UI？</div>
          </div>
        }
      >
        <div className="text-[var(--text-secondary)]">
          Xorigo UI 是一个现代化的 React UI 组件库，基于 React 19、TypeScript 5.9 和 Tailwind CSS 4 构建。
          它提供了丰富的组件、完整的主题系统和优秀的开发体验。
        </div>
      </Collapse>
      <Collapse
        trigger={
          <div className="text-left">
            <div className="font-medium text-[var(--text-primary)]">如何开始使用？</div>
          </div>
        }
      >
        <div className="text-[var(--text-secondary)]">
          您可以通过 npm 或 pnpm 安装 Xorigo UI：
          <pre className="mt-2 p-2 bg-[var(--bg-secondary)] rounded text-sm">
            <code>npm install @xorigo-ui/core</code>
          </pre>
        </div>
      </Collapse>
      <Collapse
        trigger={
          <div className="text-left">
            <div className="font-medium text-[var(--text-primary)]">支持哪些浏览器？</div>
          </div>
        }
      >
        <div className="text-[var(--text-secondary)]">
          Xorigo UI 支持所有现代浏览器，包括：
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Chrome 90+</li>
            <li>Firefox 88+</li>
            <li>Safari 14+</li>
            <li>Edge 90+</li>
          </ul>
        </div>
      </Collapse>
      <Collapse
        trigger={
          <div className="text-left">
            <div className="font-medium text-[var(--text-primary)]">是否开源？</div>
          </div>
        }
      >
        <div className="text-[var(--text-secondary)]">
          是的，Xorigo UI 是开源项目，遵循 MIT 许可证。您可以在 GitHub 上查看源码、报告问题或贡献代码。
        </div>
      </Collapse>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'FAQ 场景的实际应用示例',
      },
    },
  },
}

// 嵌套使用
export const Nested: Story = {
  render: () => (
    <div className="space-y-2 w-full max-w-2xl">
      <Collapse defaultOpen>
        <div className="text-[var(--text-secondary)]">
          外层面板内容
        </div>
        <div className="mt-2">
          <Collapse trigger={<div className="text-sm">嵌套面板</div>}>
            <div className="text-[var(--text-secondary)] text-sm">
              这是嵌套的内层面板，可以进一步展开和折叠。
            </div>
          </Collapse>
        </div>
      </Collapse>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持嵌套使用，创建多级折叠结构',
      },
    },
  },
}

// 设置面板示例
export const SettingsPanel: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">系统设置</h3>

      <Collapse
        trigger={
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2V4M10 16V18M4 10H2M18 10H16M17.66 6.34L15.66 4.34M4.34 15.66L6.34 17.66M6.34 4.34L4.34 6.34M15.66 15.66L17.66 17.66" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="font-medium text-[var(--text-primary)]">显示设置</span>
          </div>
        }
      >
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-[var(--text-secondary)]">启用暗色模式</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-[var(--text-secondary)]">显示动画效果</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span className="text-[var(--text-secondary)]">紧凑模式</span>
          </label>
        </div>
      </Collapse>

      <Collapse
        trigger={
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 17H9C5.686 5 5 5 5 5C5 5 5.686 5 9 17H15C18.314 5 19 5 19 5C19 5 18.314 5 15 17Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-medium text-[var(--text-primary)]">通知设置</span>
          </div>
        }
      >
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-[var(--text-secondary)]">邮件通知</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span className="text-[var(--text-secondary)]">推送通知</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-secondary)] text-sm">通知频率:</span>
            <select className="flex-1 px-2 py-1 rounded border border-[var(--border-primary)] bg-[var(--bg-surface)] text-[var(--text-primary)]">
              <option>实时</option>
              <option>每日</option>
              <option>每周</option>
            </select>
          </div>
        </div>
      </Collapse>

      <Collapse
        trigger={
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 1L12 7L18 7L13 11L15 17L10 13L5 17L7 11L2 7L8 7L10 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-medium text-[var(--text-primary)]">隐私设置</span>
          </div>
        }
      >
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-[var(--text-secondary)]">公开资料</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span className="text-[var(--text-secondary)]">显示在线状态</span>
          </label>
        </div>
      </Collapse>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '设置面板的实际应用示例',
      },
    },
  },
}

// 所有功能展示
export const AllFeatures: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-2xl">
      <h3 className="text-xl font-bold text-[var(--text-primary)]">Collapse 组件完整示例</h3>

      {/* 基础用法 */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-[var(--text-primary)]">基础用法</h4>
        <Collapse>
          <div className="text-[var(--text-secondary)]">基础折叠面板</div>
        </Collapse>
      </div>

      {/* 不同变体 */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-[var(--text-primary)]">三种变体</h4>
        <div className="space-y-2">
          <Collapse variant="default">
            <div>Default 变体</div>
          </Collapse>
          <Collapse variant="bordered">
            <div>Bordered 变体</div>
          </Collapse>
          <Collapse variant="ghost">
            <div>Ghost 变体</div>
          </Collapse>
        </div>
      </div>

      {/* 不同尺寸 */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-[var(--text-primary)]">三种尺寸</h4>
        <div className="space-y-2">
          <Collapse size="sm">
            <div>Small 尺寸</div>
          </Collapse>
          <Collapse size="md">
            <div>Medium 尺寸</div>
          </Collapse>
          <Collapse size="lg">
            <div>Large 尺寸</div>
          </Collapse>
        </div>
      </div>

      {/* 自定义内容 */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-[var(--text-primary)]">自定义内容</h4>
        <Collapse
          trigger={
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>带图标的自定义触发器</span>
            </div>
          }
        >
          <div className="text-[var(--text-secondary)]">
            <p>这里是可以任意自定义的内容区域。</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>支持任意 React 元素</li>
              <li>支持复杂布局</li>
              <li>支持交互式组件</li>
            </ul>
          </div>
        </Collapse>
      </div>

      {/* 懒加载 */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-[var(--text-primary)]">懒加载模式</h4>
        <Collapse lazy>
          <div className="text-[var(--text-secondary)]">
            这个内容只有在展开时才会渲染到 DOM 中，有助于优化性能。
          </div>
        </Collapse>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示所有功能特性的完整示例',
      },
    },
  },
}
