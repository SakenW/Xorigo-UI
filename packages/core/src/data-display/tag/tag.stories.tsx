import type { Meta, StoryObj } from '@storybook/react'
import { Tag, TagGroup } from './tag'
import { useState } from 'react'

const meta = {
  title: 'Data Display/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tag（标签）组件用于显示分类、状态、属性等信息。支持多种颜色、尺寸、变体、可删除和可选择功能。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'soft', 'ghost', 'gradient', 'neon'],
      description: '标签的变体样式',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'gray'],
      description: '标签的颜色主题',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '标签的尺寸',
    },
    shape: {
      control: 'select',
      options: ['rounded', 'pill', 'square'],
      description: '标签的形状',
    },
    removable: {
      control: 'boolean',
      description: '是否可删除',
    },
    selectable: {
      control: 'boolean',
      description: '是否可选择',
    },
    selected: {
      control: 'boolean',
      description: '是否已选中',
    },
    animated: {
      control: 'boolean',
      description: '是否显示动画',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
  },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

// ============= 基础示例 =============

export const Default: Story = {
  args: {
    children: 'Tag',
  },
}

// ============= 颜色变体 =============

export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Tag color="primary">Primary</Tag>
      <Tag color="secondary">Secondary</Tag>
      <Tag color="success">Success</Tag>
      <Tag color="warning">Warning</Tag>
      <Tag color="error">Error</Tag>
      <Tag color="info">Info</Tag>
      <Tag color="gray">Gray</Tag>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持7种预定义颜色主题，基于语义化设计令牌实现。',
      },
    },
  },
}

// ============= 尺寸变体 =============

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Tag size="xs">Extra Small</Tag>
      <Tag size="sm">Small</Tag>
      <Tag size="md">Medium</Tag>
      <Tag size="lg">Large</Tag>
      <Tag size="xl">Extra Large</Tag>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持5种尺寸：xs、sm、md、lg、xl，适用于不同场景。',
      },
    },
  },
}

// ============= 样式变体 =============

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Tag variant="solid">Solid</Tag>
      <Tag variant="outline">Outline</Tag>
      <Tag variant="soft">Soft</Tag>
      <Tag variant="ghost">Ghost</Tag>
      <Tag variant="gradient">Gradient</Tag>
      <Tag variant="neon">Neon</Tag>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '6种视觉变体：实心、描边、柔和、轮廓、渐变、发光。',
      },
    },
  },
}

// ============= 形状变体 =============

export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Tag shape="rounded">Rounded</Tag>
      <Tag shape="pill">Pill</Tag>
      <Tag shape="square">Square</Tag>
    </div>
  ),
}

// ============= 可删除标签 =============

export const Removable: Story = {
  render: () => {
    const [tags, setTags] = useState([
      { id: 1, label: 'React', color: 'primary' as const },
      { id: 2, label: 'TypeScript', color: 'info' as const },
      { id: 3, label: 'UI组件', color: 'success' as const },
    ])

    const handleRemove = (id: number) => {
      setTags(tags.filter(tag => tag.id !== id))
    }

    return (
      <div className="flex flex-wrap gap-4">
        {tags.map(tag => (
          <Tag
            key={tag.id}
            color={tag.color}
            removable
            onRemove={() => handleRemove(tag.id)}
          >
            {tag.label}
          </Tag>
        ))}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '支持可删除标签，点击删除按钮移除标签。',
      },
    },
  },
}

// ============= 可选择标签 =============

export const Selectable: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null)

    return (
      <div className="flex flex-wrap gap-4">
        <Tag
          selectable
          selected={selected === '选项1'}
          onSelect={(isSelected) => setSelected(isSelected ? '选项1' : null)}
        >
          选项1
        </Tag>
        <Tag
          selectable
          selected={selected === '选项2'}
          onSelect={(isSelected) => setSelected(isSelected ? '选项2' : null)}
        >
          选项2
        </Tag>
        <Tag
          selectable
          selected={selected === '选项3'}
          onSelect={(isSelected) => setSelected(isSelected ? '选项3' : null)}
        >
          选项3
        </Tag>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '支持可选择标签，点击切换选中状态，带有视觉反馈。',
      },
    },
  },
}

// ============= 图标标签 =============

export const WithIcon: Story = {
  render: () => {
    const StarIcon = (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 12.027l-4.188 2.2 0.8-4.66L1.24 6.773l4.694-0.682L8 1.8l2.066 4.291 4.694 0.682-3.372 2.794 0.8 4.66z" />
      </svg>
    )

    const CheckIcon = (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M6.5 12.5L2.5 8.5l1.414-1.414L6.5 9.672l6.086-6.086L14 5l-7.5 7.5z" />
      </svg>
    )

    return (
      <div className="flex flex-wrap gap-4">
        <Tag icon={StarIcon}>收藏</Tag>
        <Tag icon={<CheckIcon />} color="success" variant="outline">
          已验证
        </Tag>
        <Tag icon={StarIcon} color="warning" variant="soft">
          推荐
        </Tag>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '支持自定义图标，可与文字组合使用。',
      },
    },
  },
}

// ============= 禁用状态 =============

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Tag disabled>禁用标签</Tag>
      <Tag disabled selectable selected>
        禁用且已选中
      </Tag>
      <Tag disabled removable onRemove={() => {}}>
        禁用可删除
      </Tag>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '禁用状态下的标签不会响应用户交互。',
      },
    },
  },
}

// ============= 动画标签 =============

export const Animated: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Tag animated>动画标签</Tag>
      <Tag animated color="primary" variant="solid">
        渐入动画
      </Tag>
      <Tag animated color="error" variant="neon">
        发光效果
      </Tag>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持动画效果，标签进入时会有缩放和淡入动画。',
      },
    },
  },
}

// ============= 标签组合使用 =============

export const ComplexExample: Story = {
  render: () => {
    const [tags, setTags] = useState([
      { id: 1, label: 'JavaScript', color: 'warning' as const, variant: 'soft' as const },
      { id: 2, label: 'React', color: 'primary' as const, variant: 'soft' as const },
      { id: 3, label: 'TypeScript', color: 'info' as const, variant: 'soft' as const },
    ])

    const handleRemove = (id: number) => {
      setTags(tags.filter(tag => tag.id !== id))
    }

    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-3">技术栈标签</h4>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Tag
                key={tag.id}
                color={tag.color}
                variant={tag.variant}
                removable
                onRemove={() => handleRemove(tag.id)}
              >
                {tag.label}
              </Tag>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">状态标签</h4>
          <div className="flex flex-wrap gap-2">
            <Tag color="success" variant="outline">已完成</Tag>
            <Tag color="warning" variant="outline">进行中</Tag>
            <Tag color="error" variant="outline">已取消</Tag>
            <Tag color="info" variant="outline">待审核</Tag>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">优先级标签</h4>
          <div className="flex flex-wrap gap-2">
            <Tag color="error" variant="solid" size="sm">
              高优先级
            </Tag>
            <Tag color="warning" variant="soft" size="sm">
              中优先级
            </Tag>
            <Tag color="info" variant="ghost" size="sm">
              低优先级
            </Tag>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '综合使用示例：技术栈、状态和优先级标签。',
      },
    },
  },
}

// ============= TagGroup 基本用法 =============

export const TagGroupBasic: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">默认间距</h4>
        <TagGroup>
          <Tag>标签1</Tag>
          <Tag>标签2</Tag>
          <Tag>标签3</Tag>
        </TagGroup>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">紧凑间距</h4>
        <TagGroup spacing="tight">
          <Tag>标签1</Tag>
          <Tag>标签2</Tag>
          <Tag>标签3</Tag>
        </TagGroup>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">宽松间距</h4>
        <TagGroup spacing="loose">
          <Tag>标签1</Tag>
          <Tag>标签2</Tag>
          <Tag>标签3</Tag>
        </TagGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'TagGroup组件用于管理多个标签的布局和间距。',
      },
    },
  },
}

// ============= TagGroup 溢出处理 =============

export const TagGroupOverflow: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-2">省略号模式</h4>
        <TagGroup max={3} overflowType="ellipsis">
          <Tag>标签1</Tag>
          <Tag>标签2</Tag>
          <Tag>标签3</Tag>
          <Tag>标签4</Tag>
          <Tag>标签5</Tag>
        </TagGroup>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">下拉模式</h4>
        <TagGroup max={3} overflowType="dropdown">
          <Tag>标签1</Tag>
          <Tag>标签2</Tag>
          <Tag>标签3</Tag>
          <Tag>标签4</Tag>
          <Tag>标签5</Tag>
        </TagGroup>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">隐藏模式</h4>
        <TagGroup max={3} overflowType="hidden">
          <Tag>标签1</Tag>
          <Tag>标签2</Tag>
          <Tag>标签3</Tag>
          <Tag>标签4</Tag>
          <Tag>标签5</Tag>
        </TagGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '支持3种溢出处理模式：省略号、下拉和隐藏。',
      },
    },
  },
}

// ============= TagGroup 单选模式 =============

export const TagGroupSingle: Story = {
  render: () => {
    const [selected, setSelected] = useState<number[]>([])

    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">选择分类</h4>
          <TagGroup
            selectionMode="single"
            selectedValues={selected}
            onSelectionChange={setSelected}
          >
            <Tag>前端开发</Tag>
            <Tag>后端开发</Tag>
            <Tag>全栈开发</Tag>
            <Tag>移动开发</Tag>
          </TagGroup>
        </div>
        <p className="text-sm text-gray-600">已选择: {selected.length > 0 ? selected[0] : '无'}</p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '单选模式下只能选择一个标签。',
      },
    },
  },
}

// ============= TagGroup 多选模式 =============

export const TagGroupMultiple: Story = {
  render: () => {
    const [selected, setSelected] = useState<number[]>([])

    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">选择技能</h4>
          <TagGroup
            selectionMode="multiple"
            selectedValues={selected}
            onSelectionChange={setSelected}
          >
            <Tag color="primary">JavaScript</Tag>
            <Tag color="success">TypeScript</Tag>
            <Tag color="info">React</Tag>
            <Tag color="warning">Vue</Tag>
            <Tag color="error">Node.js</Tag>
            <Tag color="secondary">Python</Tag>
          </TagGroup>
        </div>
        <p className="text-sm text-gray-600">已选择: {selected.length} 个技能</p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '多选模式下可以选择多个标签。',
      },
    },
  },
}

// ============= 响应式示例 =============

export const Responsive: Story = {
  render: () => (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <Tag size="sm" color="primary">移动端</Tag>
        <Tag size="md" color="success">响应式</Tag>
        <Tag size="lg" color="info">设计</Tag>
      </div>
      <div className="flex items-center gap-2">
        <Tag color="warning" variant="soft">TypeScript</Tag>
        <Tag color="primary" variant="soft">React</Tag>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '响应式设计示例，在不同屏幕尺寸下自适应布局。',
      },
    },
  },
}
