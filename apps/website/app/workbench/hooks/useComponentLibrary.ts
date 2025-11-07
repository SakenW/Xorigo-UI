'use client'

import { useState, useMemo } from 'react'
import { ComponentExample, ComponentCategory } from '@/types/workbench'

// 组件数据配置
const componentCategories: ComponentCategory[] = [
  {
    id: 'forms',
    name: '表单组件',
    description: '智能表单、输入组件、验证器、字段管理',
    icon: '📋',
    componentCount: 18,
    subcategories: [
      {
        id: 'input',
        name: '输入组件',
        description: '文本、密码、数字输入',
        components: [
          {
            id: 'text-input',
            name: 'TextInput',
            description: '文本输入框',
            element: 'input',
            category: 'forms',
            subcategory: 'input',
            tags: ['input', 'form', 'text'],
            props: ['placeholder', 'value', 'onChange', 'disabled'],
            usage: 8,
            difficulty: 'beginner'
          },
          {
            id: 'password-input',
            name: 'PasswordInput',
            description: '密码输入框，支持强度检测和显示切换',
            element: 'input',
            category: 'forms',
            subcategory: 'input',
            tags: ['input', 'form', 'password', 'security'],
            props: ['placeholder', 'showPassword', 'strength', 'value', 'onChange'],
            usage: 4,
            difficulty: 'intermediate'
          },
          {
            id: 'number-input',
            name: 'NumberInput',
            description: '数字输入框，支持范围限制和精度控制',
            element: 'input',
            category: 'forms',
            subcategory: 'input',
            tags: ['input', 'form', 'number', 'validation'],
            props: ['min', 'max', 'step', 'precision', 'value', 'onChange'],
            usage: 5,
            difficulty: 'intermediate'
          },
          {
            id: 'email-input',
            name: 'EmailInput',
            description: '邮箱输入框，自动验证格式',
            element: 'input',
            category: 'forms',
            subcategory: 'input',
            tags: ['input', 'form', 'email', 'validation'],
            props: ['validation', 'domains', 'placeholder', 'value', 'onChange'],
            usage: 3,
            difficulty: 'intermediate'
          },
          {
            id: 'phone-input',
            name: 'PhoneInput',
            description: '手机号输入框，支持国际格式',
            element: 'input',
            category: 'forms',
            subcategory: 'input',
            tags: ['input', 'form', 'phone', 'international'],
            props: ['countryCode', 'format', 'placeholder', 'value', 'onChange'],
            usage: 3,
            difficulty: 'advanced'
          }
        ]
      },
      {
        id: 'select',
        name: '选择组件',
        description: '下拉选择、多选、单选',
        components: [
          {
            id: 'select',
            name: 'Select',
            description: '下拉选择框',
            element: 'select',
            category: 'forms',
            subcategory: 'select',
            tags: ['select', 'form', 'dropdown'],
            props: ['options', 'multiple', 'searchable', 'selected', 'onChange'],
            usage: 6,
            difficulty: 'beginner'
          },
          {
            id: 'checkbox',
            name: 'Checkbox',
            description: '复选框',
            element: 'input',
            category: 'forms',
            subcategory: 'select',
            tags: ['checkbox', 'form', 'selection'],
            props: ['checked', 'indeterminate', 'disabled', 'onChange'],
            usage: 7,
            difficulty: 'beginner'
          },
          {
            id: 'radio',
            name: 'Radio',
            description: '单选框',
            element: 'input',
            category: 'forms',
            subcategory: 'select',
            tags: ['radio', 'form', 'selection'],
            props: ['options', 'selected', 'disabled', 'onChange'],
            usage: 4,
            difficulty: 'beginner'
          },
          {
            id: 'switch',
            name: 'Switch',
            description: '开关组件',
            element: 'button',
            category: 'forms',
            subcategory: 'select',
            tags: ['switch', 'form', 'toggle'],
            props: ['checked', 'disabled', 'onChange'],
            usage: 5,
            difficulty: 'beginner'
          }
        ]
      }
    ]
  },
  {
    id: 'display',
    name: '展示组件',
    description: '标题、文本、图标、分隔符、标签',
    icon: '📝',
    componentCount: 15,
    subcategories: [
      {
        id: 'typography',
        name: '文字排版',
        description: '标题、段落、文本样式',
        components: [
          {
            id: 'heading',
            name: 'Heading',
            description: '标题组件',
            element: 'h1',
            category: 'display',
            subcategory: 'typography',
            tags: ['heading', 'title', 'typography'],
            props: ['level', 'size', 'weight', 'children'],
            usage: 12,
            difficulty: 'beginner'
          },
          {
            id: 'text',
            name: 'Text',
            description: '文本组件',
            element: 'p',
            category: 'display',
            subcategory: 'typography',
            tags: ['text', 'paragraph', 'typography'],
            props: ['size', 'color', 'weight', 'children'],
            usage: 15,
            difficulty: 'beginner'
          },
          {
            id: 'label',
            name: 'Label',
            description: '标签组件',
            element: 'label',
            category: 'display',
            subcategory: 'typography',
            tags: ['label', 'text', 'form'],
            props: ['for', 'required', 'children'],
            usage: 8,
            difficulty: 'beginner'
          }
        ]
      },
      {
        id: 'badge',
        name: '徽章标签',
        description: '状态标签、徽章、标记',
        components: [
          {
            id: 'badge',
            name: 'Badge',
            description: '徽章组件',
            element: 'span',
            category: 'display',
            subcategory: 'badge',
            tags: ['badge', 'status', 'indicator'],
            props: ['variant', 'size', 'children'],
            usage: 10,
            difficulty: 'beginner'
          },
          {
            id: 'tag',
            name: 'Tag',
            description: '标签组件',
            element: 'span',
            category: 'display',
            subcategory: 'badge',
            tags: ['tag', 'label', 'category'],
            props: ['color', 'closable', 'onClose', 'children'],
            usage: 7,
            difficulty: 'intermediate'
          }
        ]
      },
      {
        id: 'divider',
        name: '分隔分割',
        description: '分割线、间隔、布局分隔',
        components: [
          {
            id: 'divider',
            name: 'Divider',
            description: '分割线组件',
            element: 'hr',
            category: 'display',
            subcategory: 'divider',
            tags: ['divider', 'separator', 'layout'],
            props: ['orientation', 'dashed', 'text'],
            usage: 6,
            difficulty: 'beginner'
          }
        ]
      }
    ]
  },
  {
    id: 'feedback',
    name: '反馈组件',
    description: '提示、警告、消息、加载状态',
    icon: '💬',
    componentCount: 12,
    subcategories: [
      {
        id: 'alert',
        name: '警告提示',
        description: '警告、成功、错误、信息提示',
        components: [
          {
            id: 'alert',
            name: 'Alert',
            description: '警告提示组件',
            element: 'div',
            category: 'feedback',
            subcategory: 'alert',
            tags: ['alert', 'warning', 'message'],
            props: ['type', 'closable', 'showIcon', 'children'],
            usage: 9,
            difficulty: 'beginner'
          },
          {
            id: 'message',
            name: 'Message',
            description: '消息提示组件',
            element: 'div',
            category: 'feedback',
            subcategory: 'alert',
            tags: ['message', 'toast', 'notification'],
            props: ['type', 'duration', 'content', 'onClose'],
            usage: 11,
            difficulty: 'intermediate'
          }
        ]
      },
      {
        id: 'progress',
        name: '进度加载',
        description: '进度条、加载器、状态指示',
        components: [
          {
            id: 'progress',
            name: 'Progress',
            description: '进度条组件',
            element: 'div',
            category: 'feedback',
            subcategory: 'progress',
            tags: ['progress', 'bar', 'percentage'],
            props: ['percent', 'status', 'showInfo', 'strokeWidth'],
            usage: 7,
            difficulty: 'beginner'
          },
          {
            id: 'spinner',
            name: 'Spinner',
            description: '加载器组件',
            element: 'div',
            category: 'feedback',
            subcategory: 'progress',
            tags: ['spinner', 'loading', 'animation'],
            props: ['size', 'color', 'speed'],
            usage: 8,
            difficulty: 'beginner'
          }
        ]
      }
    ]
  },
  {
    id: 'navigation',
    name: '导航组件',
    description: '菜单、面包屑、分页、步骤条',
    icon: '🧭',
    componentCount: 10,
    subcategories: [
      {
        id: 'menu',
        name: '菜单导航',
        description: '导航菜单、下拉菜单、侧边栏',
        components: [
          {
            id: 'menu',
            name: 'Menu',
            description: '菜单组件',
            element: 'nav',
            category: 'navigation',
            subcategory: 'menu',
            tags: ['menu', 'navigation', 'sidebar'],
            props: ['items', 'mode', 'selectedKeys', 'onClick'],
            usage: 10,
            difficulty: 'intermediate'
          },
          {
            id: 'breadcrumb',
            name: 'Breadcrumb',
            description: '面包屑导航',
            element: 'nav',
            category: 'navigation',
            subcategory: 'menu',
            tags: ['breadcrumb', 'navigation', 'path'],
            props: ['items', 'separator'],
            usage: 6,
            difficulty: 'beginner'
          }
        ]
      },
      {
        id: 'pagination',
        name: '分页步骤',
        description: '分页器、步骤条、导航控制',
        components: [
          {
            id: 'pagination',
            name: 'Pagination',
            description: '分页组件',
            element: 'nav',
            category: 'navigation',
            subcategory: 'pagination',
            tags: ['pagination', 'page', 'navigation'],
            props: ['current', 'total', 'pageSize', 'onChange'],
            usage: 8,
            difficulty: 'intermediate'
          },
          {
            id: 'steps',
            name: 'Steps',
            description: '步骤条组件',
            element: 'div',
            category: 'navigation',
            subcategory: 'pagination',
            tags: ['steps', 'wizard', 'process'],
            props: ['current', 'items', 'direction'],
            usage: 5,
            difficulty: 'intermediate'
          }
        ]
      }
    ]
  },
  {
    id: 'layout',
    name: '布局组件',
    description: '栅格、容器、卡片、分割面板',
    icon: '📐',
    componentCount: 8,
    subcategories: [
      {
        id: 'grid',
        name: '栅格布局',
        description: '栅格系统、响应式布局',
        components: [
          {
            id: 'row',
            name: 'Row',
            description: '行组件',
            element: 'div',
            category: 'layout',
            subcategory: 'grid',
            tags: ['row', 'grid', 'layout'],
            props: ['gutter', 'align', 'justify'],
            usage: 9,
            difficulty: 'beginner'
          },
          {
            id: 'col',
            name: 'Col',
            description: '列组件',
            element: 'div',
            category: 'layout',
            subcategory: 'grid',
            tags: ['col', 'column', 'grid'],
            props: ['span', 'offset', 'push', 'pull'],
            usage: 9,
            difficulty: 'beginner'
          }
        ]
      },
      {
        id: 'container',
        name: '容器面板',
        description: '容器、卡片、分割面板',
        components: [
          {
            id: 'card',
            name: 'Card',
            description: '卡片组件',
            element: 'div',
            category: 'layout',
            subcategory: 'container',
            tags: ['card', 'container', 'panel'],
            props: ['title', 'extra', 'bordered', 'children'],
            usage: 12,
            difficulty: 'beginner'
          },
          {
            id: 'collapse',
            name: 'Collapse',
            description: '折叠面板',
            element: 'div',
            category: 'layout',
            subcategory: 'container',
            tags: ['collapse', 'accordion', 'panel'],
            props: ['items', 'activeKeys', 'onChange'],
            usage: 6,
            difficulty: 'intermediate'
          }
        ]
      }
    ]
  },
  {
    id: 'data-display',
    name: '数据展示',
    description: '表格、列表、树形控件、时间轴',
    icon: '📊',
    componentCount: 11,
    subcategories: [
      {
        id: 'table',
        name: '表格列表',
        description: '数据表格、列表展示',
        components: [
          {
            id: 'table',
            name: 'Table',
            description: '表格组件',
            element: 'table',
            category: 'data-display',
            subcategory: 'table',
            tags: ['table', 'data', 'grid'],
            props: ['columns', 'dataSource', 'pagination', 'rowSelection'],
            usage: 13,
            difficulty: 'advanced'
          },
          {
            id: 'list',
            name: 'List',
            description: '列表组件',
            element: 'div',
            category: 'data-display',
            subcategory: 'table',
            tags: ['list', 'items', 'display'],
            props: ['items', 'itemLayout', 'dataSource'],
            usage: 8,
            difficulty: 'intermediate'
          }
        ]
      },
      {
        id: 'tree',
        name: '树形结构',
        description: '树形控件、目录结构',
        components: [
          {
            id: 'tree',
            name: 'Tree',
            description: '树形组件',
            element: 'div',
            category: 'data-display',
            subcategory: 'tree',
            tags: ['tree', 'hierarchy', 'nested'],
            props: ['treeData', 'selectedKeys', 'expandedKeys', 'onSelect'],
            usage: 6,
            difficulty: 'advanced'
          },
          {
            id: 'timeline',
            name: 'Timeline',
            description: '时间轴组件',
            element: 'div',
            category: 'data-display',
            subcategory: 'tree',
            tags: ['timeline', 'history', 'events'],
            props: ['items', 'mode', 'position'],
            usage: 4,
            difficulty: 'intermediate'
          }
        ]
      }
    ]
  },
  {
    id: 'input-enhanced',
    name: '输入增强',
    description: '日期选择、颜色选择、文件上传、富文本',
    icon: '🎯',
    componentCount: 9,
    subcategories: [
      {
        id: 'picker',
        name: '选择器',
        description: '日期、时间、颜色选择器',
        components: [
          {
            id: 'datepicker',
            name: 'DatePicker',
            description: '日期选择器',
            element: 'input',
            category: 'input-enhanced',
            subcategory: 'picker',
            tags: ['date', 'picker', 'calendar'],
            props: ['value', 'onChange', 'format', 'disabled'],
            usage: 10,
            difficulty: 'intermediate'
          },
          {
            id: 'colorpicker',
            name: 'ColorPicker',
            description: '颜色选择器',
            element: 'input',
            category: 'input-enhanced',
            subcategory: 'picker',
            tags: ['color', 'picker', 'palette'],
            props: ['value', 'onChange', 'presetColors'],
            usage: 5,
            difficulty: 'intermediate'
          }
        ]
      },
      {
        id: 'upload',
        name: '上传编辑',
        description: '文件上传、富文本编辑器',
        components: [
          {
            id: 'upload',
            name: 'Upload',
            description: '文件上传组件',
            element: 'input',
            category: 'input-enhanced',
            subcategory: 'upload',
            tags: ['upload', 'file', 'drag'],
            props: ['accept', 'multiple', 'onChange', 'beforeUpload'],
            usage: 7,
            difficulty: 'advanced'
          },
          {
            id: 'editor',
            name: 'Editor',
            description: '富文本编辑器',
            element: 'div',
            category: 'input-enhanced',
            subcategory: 'upload',
            tags: ['editor', 'rich-text', 'wysiwyg'],
            props: ['value', 'onChange', 'toolbar', 'plugins'],
            usage: 4,
            difficulty: 'advanced'
          }
        ]
      }
    ]
  },
  {
    id: 'others',
    name: '其他组件',
    description: '工具类、拖拽、虚拟滚动、图片处理',
    icon: '🔧',
    componentCount: 6,
    subcategories: [
      {
        id: 'utility',
        name: '工具组件',
        description: '锚点、回到顶部、空状态',
        components: [
          {
            id: 'anchor',
            name: 'Anchor',
            description: '锚点组件',
            element: 'div',
            category: 'others',
            subcategory: 'utility',
            tags: ['anchor', 'link', 'navigation'],
            props: ['items', 'offset', 'affix'],
            usage: 3,
            difficulty: 'intermediate'
          },
          {
            id: 'backtop',
            name: 'BackTop',
            description: '回到顶部组件',
            element: 'button',
            category: 'others',
            subcategory: 'utility',
            tags: ['backtop', 'scroll', 'navigation'],
            props: ['visibilityHeight', 'onClick'],
            usage: 4,
            difficulty: 'beginner'
          },
          {
            id: 'empty',
            name: 'Empty',
            description: '空状态组件',
            element: 'div',
            category: 'others',
            subcategory: 'utility',
            tags: ['empty', 'placeholder', 'no-data'],
            props: ['image', 'description', 'children'],
            usage: 6,
            difficulty: 'beginner'
          }
        ]
      }
    ]
  }
]

export function useComponentLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedComponent, setSelectedComponent] = useState<ComponentExample | null>(null)

  // 获取当前选中的分类
  const currentCategory = useMemo(() => {
    return componentCategories.find(cat => cat.id === selectedCategory) || null
  }, [selectedCategory])

  // 获取当前选中的子分类
  const currentSubcategory = useMemo(() => {
    if (!currentCategory || !selectedSubcategory) return null
    return currentCategory.subcategories.find(sub => sub.id === selectedSubcategory) || null
  }, [currentCategory, selectedSubcategory])

  // 获取过滤后的组件
  const filteredComponents = useMemo(() => {
    let components: ComponentExample[] = []

    if (currentSubcategory) {
      components = currentSubcategory.components
    } else if (currentCategory) {
      components = currentCategory.subcategories.flatMap(sub => sub.components)
    } else {
      components = componentCategories.flatMap(cat =>
        cat.subcategories.flatMap(sub => sub.components)
      )
    }

    // 应用搜索过滤
    if (searchTerm) {
      components = components.filter(comp =>
        comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    return components
  }, [currentCategory, currentSubcategory, searchTerm])

  // 获取组件总数
  const totalComponentCount = useMemo(() => {
    return componentCategories.reduce((total, cat) =>
      total + cat.subcategories.reduce((subTotal, sub) =>
        subTotal + sub.components.length, 0
      ), 0
    )
  }, [])

  // 组件操作函数
  const handleComponentClick = (component: ComponentExample) => {
    setSelectedComponent(component)
  }

  const handleCloseDetails = () => {
    setSelectedComponent(null)
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedSubcategory('')
  }

  const handleSubcategorySelect = (categoryId: string, subcategoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedSubcategory(subcategoryId)
  }

  return {
    // 数据
    componentCategories,
    currentCategory,
    currentSubcategory,
    filteredComponents,
    totalComponentCount,
    selectedComponent,

    // 状态
    searchTerm,
    selectedCategory,
    selectedSubcategory,

    // 操作函数
    setSearchTerm,
    handleComponentClick,
    handleCloseDetails,
    handleCategorySelect,
    handleSubcategorySelect
  }
}