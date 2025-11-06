/**
 * @fileoverview 生成示例组件
 * @description 使用AI代码生成引擎生成实际的示例组件
 */

import { generateComponents } from '../index'
import type { ComponentSpec } from '../types'

// ============================================================================
// 示例组件定义
// ============================================================================

/**
 * Example 1: 现代化按钮组件
 */
const modernButtonSpec: ComponentSpec = {
  name: 'ModernButton',
  description: '现代化设计系统的按钮组件，支持多种变体和动画效果',
  type: 'base',
  category: 'primitives',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: '按钮显示内容'
    },
    {
      name: 'variant',
      type: '"primary" | "secondary" | "outline" | "ghost"',
      required: false,
      defaultValue: 'primary',
      description: '按钮视觉变体'
    },
    {
      name: 'size',
      type: '"sm" | "md" | "lg" | "xl"',
      required: false,
      defaultValue: 'md',
      description: '按钮尺寸大小'
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      defaultValue: false,
      description: '是否禁用按钮'
    },
    {
      name: 'loading',
      type: 'boolean',
      required: false,
      defaultValue: false,
      description: '是否显示加载状态'
    },
    {
      name: 'fullWidth',
      type: 'boolean',
      required: false,
      defaultValue: false,
      description: '是否全宽度'
    },
    {
      name: 'leftIcon',
      type: 'ReactNode',
      required: false,
      description: '左侧图标'
    },
    {
      name: 'rightIcon',
      type: 'ReactNode',
      required: false,
      description: '右侧图标'
    },
    {
      name: 'onClick',
      type: '(event: MouseEvent<HTMLButtonElement>) => void',
      required: false,
      description: '点击事件处理器'
    }
  ],
  events: [
    {
      name: 'click',
      type: 'MouseEvent<HTMLButtonElement>',
      description: '鼠标点击事件'
    }
  ],
  variants: [
    {
      name: 'primary',
      description: '主要按钮，用于主要操作',
      props: { variant: 'primary' },
      className: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500'
    },
    {
      name: 'secondary',
      description: '次要按钮，用于次要操作',
      props: { variant: 'secondary' },
      className: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500'
    },
    {
      name: 'outline',
      description: '轮廓按钮，保持原有背景色',
      props: { variant: 'outline' },
      className: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
    },
    {
      name: 'ghost',
      description: '幽灵按钮，透明背景',
      props: { variant: 'ghost' },
      className: 'text-gray-700 hover:bg-gray-100'
    }
  ],
  dependencies: [
    {
      name: 'cn',
      type: 'utils',
      importPath: '@xorigo-ui/utils',
      required: true
    }
  ],
  theming: true,
  animated: true,
  accessible: true,
  examples: [
    {
      title: '基础用法',
      code: '<ModernButton>Click me</ModernButton>',
      description: '基础按钮示例'
    },
    {
      title: '带图标',
      code: '<ModernButton leftIcon={<Icon />}>带图标的按钮</ModernButton>',
      description: '带左侧图标的按钮'
    },
    {
      title: '加载状态',
      code: '<ModernButton loading>加载中...</ModernButton>',
      description: '显示加载状态的按钮'
    }
  ]
}

/**
 * Example 2: 用户表单组件
 */
const userFormSpec: ComponentSpec = {
  name: 'UserForm',
  description: '完整的用户表单组件，包含验证和多种输入类型',
  type: 'compound',
  category: 'forms',
  props: [
    {
      name: 'initialData',
      type: 'UserData',
      required: false,
      defaultValue: '{}',
      description: '表单初始数据'
    },
    {
      name: 'onSubmit',
      type: '(data: UserData) => void | Promise<void>',
      required: true,
      description: '表单提交处理函数'
    },
    {
      name: 'onCancel',
      type: '() => void',
      required: false,
      description: '取消按钮处理函数'
    },
    {
      name: 'submitLabel',
      type: 'string',
      required: false,
      defaultValue: '提交',
      description: '提交按钮文本'
    },
    {
      name: 'cancelLabel',
      type: 'string',
      required: false,
      defaultValue: '取消',
      description: '取消按钮文本'
    },
    {
      name: 'mode',
      type: '"create" | "edit"',
      required: false,
      defaultValue: 'create',
      description: '表单模式：创建或编辑'
    }
  ],
  events: [
    {
      name: 'submit',
      type: 'FormEvent<HTMLFormElement>',
      description: '表单提交事件'
    },
    {
      name: 'change',
      type: 'ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>',
      description: '字段值改变事件'
    },
    {
      name: 'validate',
      type: '(field: string, value: any) => string | null',
      description: '字段验证事件'
    }
  ],
  theming: true,
  animated: true,
  accessible: true,
  examples: [
    {
      title: '创建用户',
      code: '<UserForm mode="create" onSubmit={handleSubmit} />',
      description: '创建新用户表单'
    },
    {
      title: '编辑用户',
      code: '<UserForm mode="edit" initialData={user} onSubmit={handleUpdate} />',
      description: '编辑现有用户表单'
    }
  ]
}

/**
 * Example 3: 产品数据表格组件
 */
const productTableSpec: ComponentSpec = {
  name: 'ProductTable',
  description: '产品数据表格，支持排序、分页、筛选和批量操作',
  type: 'complex',
  category: 'layout',
  props: [
    {
      name: 'products',
      type: 'Product[]',
      required: true,
      description: '产品数据数组'
    },
    {
      name: 'loading',
      type: 'boolean',
      required: false,
      defaultValue: false,
      description: '是否显示加载状态'
    },
    {
      name: 'pagination',
      type: 'boolean',
      required: false,
      defaultValue: true,
      description: '是否显示分页器'
    },
    {
      name: 'pageSize',
      type: 'number',
      required: false,
      defaultValue: 10,
      description: '每页显示数量'
    },
    {
      name: 'selectable',
      type: 'boolean',
      required: false,
      defaultValue: true,
      description: '是否可选择行'
    },
    {
      name: 'searchable',
      type: 'boolean',
      required: false,
      defaultValue: true,
      description: '是否显示搜索框'
    },
    {
      name: 'onSort',
      type: '(column: string, direction: "asc" | "desc") => void',
      required: false,
      description: '排序回调函数'
    },
    {
      name: 'onFilter',
      type: '(filters: Record<string, any>) => void',
      required: false,
      description: '筛选回调函数'
    },
    {
      name: 'onPageChange',
      type: '(page: number) => void',
      required: false,
      description: '页码变化回调函数'
    },
    {
      name: 'onSelectionChange',
      type: '(selectedIds: string[]) => void',
      required: false,
      description: '选择变化回调函数'
    },
    {
      name: 'onEdit',
      type: '(product: Product) => void',
      required: false,
      description: '编辑产品回调'
    },
    {
      name: 'onDelete',
      type: '(productId: string) => void',
      required: false,
      description: '删除产品回调'
    }
  ],
  events: [
    {
      name: 'sort',
      type: 'string',
      description: '排序事件'
    },
    {
      name: 'filter',
      type: 'Record<string, any>',
      description: '筛选事件'
    },
    {
      name: 'pageChange',
      type: 'number',
      description: '页码变化事件'
    },
    {
      name: 'selectionChange',
      type: 'string[]',
      description: '选择变化事件'
    }
  ],
  theming: true,
  animated: true,
  accessible: true,
  examples: [
    {
      title: '基础表格',
      code: '<ProductTable products={products} />',
      description: '显示所有产品的表格'
    },
    {
      title: '可选择和分页',
      code: '<ProductTable products={products} selectable pagination onSelectionChange={handleSelect} />',
      description: '支持选择和分页的表格'
    }
  ]
}

/**
 * Example 4: 导航菜单组件
 */
const navMenuSpec: ComponentSpec = {
  name: 'NavMenu',
  description: '响应式导航菜单组件，支持多级菜单和移动端适配',
  type: 'compound',
  category: 'navigation',
  props: [
    {
      name: 'items',
      type: 'NavItem[]',
      required: true,
      description: '菜单项数据'
    },
    {
      name: 'orientation',
      type: '"horizontal" | "vertical"',
      required: false,
      defaultValue: 'horizontal',
      description: '菜单方向'
    },
    {
      name: 'variant',
      type: '"default" | "pills" | "underline"',
      required: false,
      defaultValue: 'default',
      description: '菜单样式变体'
    },
    {
      name: 'collapsed',
      type: 'boolean',
      required: false,
      defaultValue: false,
      description: '是否折叠（移动端）'
    },
    {
      name: 'onItemClick',
      type: '(item: NavItem) => void',
      required: false,
      description: '菜单项点击回调'
    },
    {
      name: 'onToggle',
      type: '(collapsed: boolean) => void',
      required: false,
      description: '折叠状态变化回调'
    }
  ],
  theming: true,
  animated: true,
  accessible: true
}

/**
 * Example 5: 通知提醒组件
 */
const notificationSpec: ComponentSpec = {
  name: 'Notification',
  description: '通知提醒组件，支持多种类型和位置',
  type: 'base',
  category: 'feedback',
  props: [
    {
      name: 'type',
      type: '"info" | "success" | "warning" | "error"',
      required: false,
      defaultValue: 'info',
      description: '通知类型'
    },
    {
      name: 'title',
      type: 'string',
      required: false,
      description: '通知标题'
    },
    {
      name: 'message',
      type: 'string',
      required: true,
      description: '通知内容'
    },
    {
      name: 'dismissible',
      type: 'boolean',
      required: false,
      defaultValue: true,
      description: '是否可手动关闭'
    },
    {
      name: 'autoHide',
      type: 'boolean',
      required: false,
      defaultValue: false,
      description: '是否自动隐藏'
    },
    {
      name: 'duration',
      type: 'number',
      required: false,
      defaultValue: 5000,
      description: '自动隐藏延迟（毫秒）'
    },
    {
      name: 'position',
      type: '"top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center"',
      required: false,
      defaultValue: 'top-right',
      description: '通知位置'
    },
    {
      name: 'onClose',
      type: '() => void',
      required: false,
      description: '关闭回调'
    }
  ],
  events: [
    {
      name: 'close',
      type: '() => void',
      description: '通知关闭事件'
    }
  ],
  variants: [
    {
      name: 'info',
      description: '信息通知',
      props: { type: 'info' },
      className: 'bg-blue-50 text-blue-900 border-blue-200'
    },
    {
      name: 'success',
      description: '成功通知',
      props: { type: 'success' },
      className: 'bg-green-50 text-green-900 border-green-200'
    },
    {
      name: 'warning',
      description: '警告通知',
      props: { type: 'warning' },
      className: 'bg-yellow-50 text-yellow-900 border-yellow-200'
    },
    {
      name: 'error',
      description: '错误通知',
      props: { type: 'error' },
      className: 'bg-red-50 text-red-900 border-red-200'
    }
  ],
  theming: true,
  animated: true,
  accessible: true
}

// ============================================================================
// 生成示例
// ============================================================================

async function generateAllExamples() {
  console.log('\n' + '='.repeat(80))
  console.log('🎨 Xorigo UI - AI代码生成引擎')
  console.log('📦 生成示例组件')
  console.log('='.repeat(80) + '\n')

  const specs: ComponentSpec[] = [
    modernButtonSpec,
    userFormSpec,
    productTableSpec,
    navMenuSpec,
    notificationSpec
  ]

  console.log(`📋 准备生成 ${specs.length} 个示例组件:\n`)

  specs.forEach((spec, index) => {
    console.log(`   ${index + 1}. ${spec.name}`)
    console.log(`      类型: ${spec.type}`)
    console.log(`      描述: ${spec.description}`)
    console.log(`      属性数: ${spec.props.length}`)
    if (spec.variants) {
      console.log(`      变体数: ${spec.variants.length}`)
    }
    console.log('')
  })

  try {
    const startTime = Date.now()

    const results = await generateComponents(specs, {
      outputDir: './examples/generated',
      generateTests: true,
      generateDocs: true,
      generateStory: true
    })

    const totalTime = Date.now() - startTime

    console.log('\n' + '='.repeat(80))
    console.log('✅ 生成完成!')
    console.log('='.repeat(80) + '\n')

    console.log('📊 生成统计:\n')
    console.log(`   总组件数: ${results.length}`)
    console.log(`   成功数: ${results.filter(r => r.files.length > 0).length}`)
    console.log(`   失败数: ${results.filter(r => r.files.length === 0).length}`)
    console.log(`   总文件数: ${results.reduce((sum, r) => sum + r.stats.filesGenerated, 0)}`)
    console.log(`   总代码行数: ${results.reduce((sum, r) => sum + r.stats.linesOfCode, 0)}`)
    console.log(`   总耗时: ${totalTime}ms`)

    const avgTime = totalTime / results.length
    console.log(`   平均每组件: ${Math.round(avgTime)}ms`)

    console.log('\n📁 生成的文件:\n')
    results.forEach(result => {
      console.log(`   ${result.spec.name}:`)
      result.files.forEach(file => {
        console.log(`      - ${file.filePath.split('/').pop()} (${file.type})`)
      })
      console.log('')
    })

    console.log('🎯 质量检查:\n')
    console.log(`   生成时间 < 3秒: ${avgTime < 3000 ? '✅' : '❌'} (${avgTime.toFixed(0)}ms)`)
    const successRate = (results.filter(r => r.files.length > 0).length / results.length) * 100
    console.log(`   成功率 > 90%: ${successRate > 90 ? '✅' : '❌'} (${successRate.toFixed(1)}%)`)

    console.log('\n📝 文件位置:')
    console.log(`   ${process.cwd()}/packages/ai/src/examples/generated/\n`)

    console.log('🚀 下一步:')
    console.log('   1. 查看生成的组件: examples/generated/')
    console.log('   2. 运行测试: cd packages/ai && pnpm test')
    console.log('   3. 构建包: cd packages/ai && pnpm build')
    console.log('')

  } catch (error) {
    console.error('\n❌ 生成失败:', error)
    process.exit(1)
  }
}

// ============================================================================
// 执行
// ============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllExamples()
    .then(() => {
      console.log('✅ 示例组件生成完成!')
      process.exit(0)
    })
    .catch(error => {
      console.error('❌ 示例组件生成失败:', error)
      process.exit(1)
    })
}
