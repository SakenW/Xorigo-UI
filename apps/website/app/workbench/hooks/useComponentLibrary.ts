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
  }
  // ... 可以继续添加更多分类
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