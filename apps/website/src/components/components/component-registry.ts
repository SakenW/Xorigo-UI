/**
 * 组件注册表 - 来自@xorigo-ui/core的组件元数据
 */

// 组件分类定义
export interface ComponentMeta {
  id: string
  name: string
  description: string
  category: ComponentCategory
  tags: ComponentTag[]
  props: PropMeta[]
  variants: VariantMeta[]
  examples: ExampleMeta[]
  accessibility?: AccessibilityInfo
  importPath: string
  isExperimental?: boolean
  isDeprecated?: boolean
  deprecationMessage?: string
}

export interface PropMeta {
  name: string
  type: string
  required: boolean
  defaultValue?: string
  description: string
  options?: string[]
}

export interface VariantMeta {
  name: string
  values: string[]
  defaultValue?: string
  description: string
}

export interface ExampleMeta {
  title: string
  description: string
  code: string
  format: 'react' | 'vue' | 'html'
  isDefault?: boolean
}

export interface AccessibilityInfo {
  features: string[]
  notes: string[]
  warnings?: string[]
}

export type ComponentCategory =
  | 'ui'          // UI 基础组件
  | 'inputs'      // 输入控件
  | 'form'        // 表单容器
  | 'navigation'  // 导航结构
  | 'layout'      // 布局分区
  | 'feedback'    // 反馈状态
  | 'overlays'    // 弹层遮罩
  | 'datadisplay' // 数据展示
  | 'charts'      // 数据可视化
  | 'utilities'   // 技术基元

export type ComponentTag =
  | 'basic'       // 基础组件
  | 'advanced'    // 高级组件
  | 'experimental' // 实验性组件
  | 'responsive'  // 响应式
  | 'animated'    // 动画支持
  | 'accessible'  // 无障碍支持

// 组件分类信息
export const componentCategories: Record<ComponentCategory, {
  name: string
  description: string
  icon: string
}> = {
  ui: {
    name: 'UI 基础组件',
    description: '按钮、卡片、输入框等基础UI元素',
    icon: '🎨'
  },
  inputs: {
    name: '输入控件',
    description: '输入框、选择器、复选框等表单输入组件',
    icon: '📝'
  },
  form: {
    name: '表单容器',
    description: '表单验证、字段集合等表单逻辑组件',
    icon: '📋'
  },
  navigation: {
    name: '导航结构',
    description: '菜单、面包屑、分页等导航组件',
    icon: '🧭'
  },
  layout: {
    name: '布局分区',
    description: '容器、网格、分割等布局组件',
    icon: '📐'
  },
  feedback: {
    name: '反馈状态',
    description: '提示、加载、进度等反馈组件',
    icon: '💬'
  },
  overlays: {
    name: '弹层遮罩',
    description: '对话框、抽屉、提示等覆盖层组件',
    icon: '🎭'
  },
  datadisplay: {
    name: '数据展示',
    description: '表格、列表、折叠面板等数据呈现组件',
    icon: '📊'
  },
  charts: {
    name: '数据可视化',
    description: '图表、仪表盘、统计等可视化组件',
    icon: '📈'
  },
  utilities: {
    name: '技术基元',
    description: '头像、徽章、分隔线等技术底层组件',
    icon: '🛠️'
  }
}

// 组件元数据注册表
export const componentRegistry: ComponentMeta[] = [
  // UI 基础组件
  {
    id: 'button',
    name: 'Button',
    description: '基础按钮组件，支持多种变体和尺寸',
    category: 'ui',
    tags: ['basic', 'responsive', 'accessible'],
    props: [
      {
        name: 'variant',
        type: '"primary" | "secondary" | "outline" | "ghost" | "link"',
        required: false,
        defaultValue: 'primary',
        description: '按钮变体样式'
      },
      {
        name: 'size',
        type: '"sm" | "md" | "lg"',
        required: false,
        defaultValue: 'md',
        description: '按钮尺寸'
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: '是否禁用'
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: '是否显示加载状态'
      },
      {
        name: 'onClick',
        type: '(event: MouseEvent) => void',
        required: false,
        description: '点击事件处理函数'
      }
    ],
    variants: [
      {
        name: 'variant',
        values: ['primary', 'secondary', 'outline', 'ghost', 'link'],
        defaultValue: 'primary',
        description: '按钮变体'
      },
      {
        name: 'size',
        values: ['sm', 'md', 'lg'],
        defaultValue: 'md',
        description: '按钮尺寸'
      }
    ],
    examples: [
      {
        title: '基础按钮',
        description: '默认样式的主要按钮',
        code: `import { Button } from '@xorigo-ui/core'

function Example() {
  return (
    <Button onClick={() => console.log('clicked')}>
      点击按钮
    </Button>
  )
}`,
        format: 'react',
        isDefault: true
      },
      {
        title: '不同变体',
        description: '展示各种按钮变体',
        code: `import { Button } from '@xorigo-ui/core'

function Example() {
  return (
    <div className="flex gap-2">
      <Button variant="primary">主要</Button>
      <Button variant="secondary">次要</Button>
      <Button variant="outline">边框</Button>
      <Button variant="ghost">幽灵</Button>
    </div>
  )
}`,
        format: 'react'
      }
    ],
    accessibility: {
      features: [
        '键盘导航支持',
        'ARIA 按钮角色',
        '焦点管理',
        '屏幕阅读器支持'
      ],
      notes: [
        '按钮具有适当的焦点指示器',
        '支持 Enter 和 Space 键激活',
        '禁用状态通过 aria-disabled 属性标识'
      ]
    },
    importPath: '@xorigo-ui/core'
  },
  {
    id: 'card',
    name: 'Card',
    description: '卡片容器组件，用于内容分组和展示',
    category: 'ui',
    tags: ['basic', 'responsive'],
    props: [
      {
        name: 'variant',
        type: '"default" | "outlined" | "elevated"',
        required: false,
        defaultValue: 'default',
        description: '卡片变体样式'
      },
      {
        name: 'padding',
        type: '"none" | "sm" | "md" | "lg"',
        required: false,
        defaultValue: 'md',
        description: '内边距大小'
      }
    ],
    variants: [
      {
        name: 'variant',
        values: ['default', 'outlined', 'elevated'],
        defaultValue: 'default',
        description: '卡片样式变体'
      }
    ],
    examples: [
      {
        title: '基础卡片',
        description: '默认样式的卡片容器',
        code: `import { Card, CardContent, CardHeader } from '@xorigo-ui/core'

function Example() {
  return (
    <Card>
      <CardHeader title="卡片标题">
      </CardHeader>
      <CardContent>
        <p>卡片内容区域</p>
      </CardContent>
    </Card>
  )
}`,
        format: 'react',
        isDefault: true
      }
    ],
    accessibility: {
      features: [
        '语义化 HTML 结构',
        '适当的标题层级',
        '内容分组清晰'
      ],
      notes: [
        '使用语义化的 HTML5 标签',
        '支持屏幕阅读器的结构化导航'
      ]
    },
    importPath: '@xorigo-ui/core'
  },
  {
    id: 'input',
    name: 'Input',
    description: '基础输入框组件，支持多种输入类型',
    category: 'inputs',
    tags: ['basic', 'responsive', 'accessible'],
    props: [
      {
        name: 'type',
        type: '"text" | "email" | "password" | "number" | "search"',
        required: false,
        defaultValue: 'text',
        description: '输入类型'
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        description: '占位符文本'
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: '是否禁用'
      },
      {
        name: 'error',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: '是否显示错误状态'
      },
      {
        name: 'value',
        type: 'string',
        required: false,
        description: '输入值（受控模式）'
      },
      {
        name: 'onChange',
        type: '(value: string) => void',
        required: false,
        description: '值变化回调'
      }
    ],
    variants: [
      {
        name: 'type',
        values: ['text', 'email', 'password', 'number', 'search'],
        defaultValue: 'text',
        description: '输入类型'
      },
      {
        name: 'state',
        values: ['default', 'error', 'disabled'],
        defaultValue: 'default',
        description: '输入状态'
      }
    ],
    examples: [
      {
        title: '基础输入框',
        description: '默认样式的文本输入框',
        code: `import { Input } from '@xorigo-ui/core'

function Example() {
  return (
    <Input
      placeholder="请输入内容"
      onChange={(value) => console.log(value)}
    />
  )
}`,
        format: 'react',
        isDefault: true
      },
      {
        title: '不同类型',
        description: '展示各种输入类型',
        code: `import { Input } from '@xorigo-ui/core'

function Example() {
  return (
    <div className="space-y-2">
      <Input type="email" placeholder="邮箱地址" />
      <Input type="password" placeholder="密码" />
      <Input type="number" placeholder="数字" />
    </div>
  )
}`,
        format: 'react'
      }
    ],
    accessibility: {
      features: [
        '表单标签关联',
        '错误状态提示',
        '键盘导航支持',
        '屏幕阅读器支持'
      ],
      notes: [
        '建议配合 label 使用或通过 aria-label 提供标签',
        '错误状态通过 aria-invalid 属性标识',
        '支持 Tab 键导航'
      ]
    },
    importPath: '@xorigo-ui/core'
  },
  {
    id: 'modal',
    name: 'Modal',
    description: '模态对话框组件，用于重要操作确认',
    category: 'overlays',
    tags: ['advanced', 'accessible'],
    props: [
      {
        name: 'open',
        type: 'boolean',
        required: true,
        description: '是否打开模态框'
      },
      {
        name: 'onClose',
        type: '() => void',
        required: true,
        description: '关闭回调函数'
      },
      {
        name: 'title',
        type: 'string',
        required: false,
        description: '模态框标题'
      },
      {
        name: 'size',
        type: '"sm" | "md" | "lg" | "xl"',
        required: false,
        defaultValue: 'md',
        description: '模态框尺寸'
      },
      {
        name: 'closeOnOverlayClick',
        type: 'boolean',
        required: false,
        defaultValue: 'true',
        description: '点击遮罩是否关闭'
      }
    ],
    variants: [
      {
        name: 'size',
        values: ['sm', 'md', 'lg', 'xl'],
        defaultValue: 'md',
        description: '模态框尺寸'
      }
    ],
    examples: [
      {
        title: '基础模态框',
        description: '包含标题和内容的模态对话框',
        code: `import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter, Button } from '@xorigo-ui/core'
import { useState } from 'react'

function Example() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>打开模态框</Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>确认操作</ModalTitle>
          </ModalHeader>
          <p>您确定要执行此操作吗？</p>
          <ModalFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setOpen(false)}>
              确认
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}`,
        format: 'react',
        isDefault: true
      }
    ],
    accessibility: {
      features: [
        '焦点陷阱管理',
        'Escape 键关闭',
        'ARIA 角色和属性',
        '屏幕阅读器公告'
      ],
      notes: [
        '打开时焦点移到模态框内第一个可聚焦元素',
        '关闭时焦点返回触发元素',
        '通过 aria-describedby 关联描述内容',
        '支持键盘导航和操作'
      ],
      warnings: [
        '避免在模态框内放置另一个模态框',
        '确保模态框内容不会过多导致滚动问题'
      ]
    },
    importPath: '@xorigo-ui/core'
  },
  {
    id: 'tabs',
    name: 'Tabs',
    description: '标签页组件，用于内容分组和切换',
    category: 'navigation',
    tags: ['basic', 'accessible', 'responsive'],
    props: [
      {
        name: 'defaultValue',
        type: 'string',
        required: false,
        description: '默认选中的标签值'
      },
      {
        name: 'value',
        type: 'string',
        required: false,
        description: '当前选中的标签值（受控模式）'
      },
      {
        name: 'onValueChange',
        type: '(value: string) => void',
        required: false,
        description: '标签切换回调'
      },
      {
        name: 'orientation',
        type: '"horizontal" | "vertical"',
        required: false,
        defaultValue: 'horizontal',
        description: '标签排列方向'
      }
    ],
    variants: [
      {
        name: 'orientation',
        values: ['horizontal', 'vertical'],
        defaultValue: 'horizontal',
        description: '排列方向'
      }
    ],
    examples: [
      {
        title: '基础标签页',
        description: '水平排列的标签页组件',
        code: `import { Tabs, TabsList, TabsTrigger, TabsContent } from '@xorigo-ui/core'

function Example() {
  return (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">账户</TabsTrigger>
        <TabsTrigger value="password">密码</TabsTrigger>
        <TabsTrigger value="settings">设置</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <h3>账户信息</h3>
        <p>这里是账户相关的内容</p>
      </TabsContent>
      <TabsContent value="password">
        <h3>密码设置</h3>
        <p>这里是密码相关的内容</p>
      </TabsContent>
      <TabsContent value="settings">
        <h3>系统设置</h3>
        <p>这里是设置相关的内容</p>
      </TabsContent>
    </Tabs>
  )
}`,
        format: 'react',
        isDefault: true
      }
    ],
    accessibility: {
      features: [
        '键盘导航支持',
        'ARIA 标签页角色',
        '屏幕阅读器支持',
        '焦点管理'
      ],
      notes: [
        '支持左右箭头键切换标签',
        '使用 ARIA 角色和属性标识结构',
        '标签面板与标签正确关联'
      ]
    },
    importPath: '@xorigo-ui/core'
  },
  {
    id: 'alert',
    name: 'Alert',
    description: '警告提示组件，用于信息反馈',
    category: 'feedback',
    tags: ['basic', 'accessible'],
    props: [
      {
        name: 'variant',
        type: '"info" | "success" | "warning" | "error"',
        required: false,
        defaultValue: 'info',
        description: '提示类型'
      },
      {
        name: 'title',
        type: 'string',
        required: false,
        description: '提示标题'
      },
      {
        name: 'closable',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: '是否可关闭'
      },
      {
        name: 'onClose',
        type: '() => void',
        required: false,
        description: '关闭回调'
      }
    ],
    variants: [
      {
        name: 'variant',
        values: ['info', 'success', 'warning', 'error'],
        defaultValue: 'info',
        description: '提示类型'
      }
    ],
    examples: [
      {
        title: '信息提示',
        description: '不同类型的警告提示',
        code: `import { Alert } from '@xorigo-ui/core'

function Example() {
  return (
    <div className="space-y-2">
      <Alert variant="info" title="信息提示">
        这是一条信息提示
      </Alert>
      <Alert variant="success" title="操作成功">
        操作已成功完成
      </Alert>
      <Alert variant="warning" title="警告">
        请注意此操作可能带来的影响
      </Alert>
      <Alert variant="error" title="错误">
        操作失败，请重试
      </Alert>
    </div>
  )
}`,
        format: 'react',
        isDefault: true
      }
    ],
    accessibility: {
      features: [
        'ARIA 角色和属性',
        '颜色对比度符合标准',
        '屏幕阅读器支持'
      ],
      notes: [
        '通过 aria-live 属性实现实时区域',
        '使用适当的 ARIA 角色标识提示类型',
        '颜色不是唯一的信息传达方式'
      ]
    },
    importPath: '@xorigo-ui/core'
  }
]

// 工具函数
export function getComponentById(id: string): ComponentMeta | undefined {
  return componentRegistry.find(component => component.id === id)
}

export function getComponentsByCategory(category: ComponentCategory): ComponentMeta[] {
  return componentRegistry.filter(component => component.category === category)
}

export function getComponentsByTag(tag: ComponentTag): ComponentMeta[] {
  return componentRegistry.filter(component => component.tags.includes(tag))
}

export function searchComponents(query: string): ComponentMeta[] {
  const lowercaseQuery = query.toLowerCase()
  return componentRegistry.filter(component =>
    component.name.toLowerCase().includes(lowercaseQuery) ||
    component.description.toLowerCase().includes(lowercaseQuery) ||
    component.tags.some(tag => tag.includes(lowercaseQuery as ComponentTag))
  )
}

export function getComponentCategories(): ComponentCategory[] {
  return Object.keys(componentCategories) as ComponentCategory[]
}