/**
 * Button Component Stories - 按钮组件 Storybook 故事
 *
 * 展示 Button 组件的所有变体、尺寸、状态和用例。
 * 包含交互式演示和主题切换功能。
 *
 * @version 1.0.0
 * @category Stories
 * @since Xorigo UI v1.5.1
 */

import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Button } from './button'

/**
 * Button component metadata - 按钮组件元数据
 */
const meta: Meta<typeof Button> = {
  title: 'Inputs/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
一个现代化的按钮组件，支持多种变体、尺寸和状态。完全集成 Xorigo UI 主题系统，
确保在所有主题下的一致性表现。

## 特性
- 🎨 多种视觉变体 (primary, secondary, outline, ghost)
- 📏 三种尺寸规格 (sm, md, lg)
- ⚡ 加载状态支持
- ♿ 完整的可访问性支持
- 🎭 Framer Motion 动画效果
- 🌙 主题系统集成
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
      description: '按钮的视觉变体'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '按钮的尺寸大小'
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用按钮'
    },
    loading: {
      control: 'boolean',
      description: '是否显示加载状态'
    },
    children: {
      control: 'text',
      description: '按钮内容'
    },
    onClick: {
      action: 'clicked',
      description: '点击事件处理函数'
    }
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    children: 'Button',
    onClick: fn()
  }
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default story - 默认故事
 */
export const Default: Story = {
  args: {
    children: 'Default Button'
  }
}

/**
 * Variant stories - 变体故事
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示所有可用的按钮变体样式。'
      }
    }
  }
}

/**
 * Size stories - 尺寸故事
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示三种不同的按钮尺寸。'
      }
    }
  }
}

/**
 * State stories - 状态故事
 */
export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
      <Button loading disabled>
        Loading & Disabled
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示按钮的不同状态：正常、禁用和加载中。'
      }
    }
  }
}

/**
 * Interactive story - 交互式故事
 */
export const Interactive: Story = {
  render: () => {
    const [count, setCount] = React.useState(0)

    return (
      <div className="flex flex-col gap-4 items-center">
        <div className="text-lg font-semibold">
          Click count: {count}
        </div>
        <Button onClick={() => setCount(count + 1)}>
          Click me ({count})
        </Button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '交互式示例，展示按钮的事件处理能力。'
      }
    }
  }
}

/**
 * With icons story - 带图标的故事
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Item
      </Button>
      <Button variant="outline">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Cancel
      </Button>
      <Button variant="ghost">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Upload
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示如何将图标与按钮结合使用。'
      }
    }
  }
}

/**
 * Form integration story - 表单集成故事
 */
export const FormIntegration: Story = {
  render: () => (
    <form className="flex flex-col gap-4 max-w-sm" onSubmit={(e) => {
      e.preventDefault()
      alert('Form submitted!')
    }}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter your email"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Submit</Button>
        <Button variant="outline" type="button">
          Cancel
        </Button>
      </div>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示按钮在表单中的使用方式。'
      }
    }
  }
}

/**
 * Loading states story - 加载状态故事
 */
export const LoadingStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button loading>Loading Primary</Button>
      <Button variant="secondary" loading>
        Loading Secondary
      </Button>
      <Button variant="outline" loading>
        Loading Outline
      </Button>
      <Button variant="ghost" loading>
        Loading Ghost
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示不同变体在加载状态下的表现。'
      }
    }
  }
}

/**
 * Accessibility story - 可访问性故事
 */
export const Accessibility: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button aria-label="Add new item to cart">
        🛒 Add to Cart
      </Button>
      <Button aria-describedby="button-help">
        Get Help
      </Button>
      <p id="button-help" className="text-sm text-gray-600">
        This button will open the help documentation in a new tab.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示按钮的可访问性特性和 ARIA 属性的使用。'
      }
    }
  }
}

/**
 * Theme showcase story - 主题展示故事
 */
export const ThemeShowcase: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-4 items-center">
        <h3 className="w-full text-lg font-semibold">Light Theme</h3>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center bg-gray-900 text-white p-4 rounded-lg">
        <h3 className="w-full text-lg font-semibold">Dark Theme (Simulated)</h3>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示按钮在不同主题下的表现。实际项目中会通过 CSS 变量自动适配。'
      }
    }
  }
}

/**
 * Playground story - 游乐场故事
 */
export const Playground: Story = {
  args: {
    children: 'Custom Button',
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false
  },
  parameters: {
    docs: {
      description: {
        story: '使用控制面板自定义按钮属性，实时预览效果。'
      }
    }
  }
}