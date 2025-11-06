/**
 * @fileoverview AI代码生成引擎 - 示例演示
 * @description 演示如何使用AI代码生成引擎生成组件
 */

import { createCodeGenerator } from '../core/code-generator'
import type { ComponentSpec } from '../types'

// ============================================================================
// 示例组件规范
// ============================================================================

/**
 * 按钮组件规范
 */
const buttonSpec: ComponentSpec = {
  name: 'Button',
  description: '一个现代化的按钮组件，支持多种变体和尺寸',
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
      type: '"primary" | "secondary" | "ghost" | "link"',
      required: false,
      defaultValue: 'primary',
      description: '按钮变体'
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
      defaultValue: false,
      description: '是否禁用'
    },
    {
      name: 'loading',
      type: 'boolean',
      required: false,
      defaultValue: false,
      description: '是否加载中'
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
  variants: [
    {
      name: 'primary',
      description: '主要按钮',
      props: {},
      className: 'bg-primary-500 text-white hover:bg-primary-600'
    },
    {
      name: 'secondary',
      description: '次要按钮',
      props: {},
      className: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
    },
    {
      name: 'ghost',
      description: '幽灵按钮',
      props: {},
      className: 'text-gray-900 hover:bg-gray-100'
    }
  ],
  theming: true,
  animated: true,
  accessible: true
}

/**
 * 表单组件规范
 */
const formSpec: ComponentSpec = {
  name: 'ContactForm',
  description: '一个联系表单组件，包含多种输入字段和验证',
  type: 'compound',
  category: 'forms',
  props: [
    {
      name: 'onSubmit',
      type: '(data: FormData) => void',
      required: false,
      description: '表单提交回调'
    },
    {
      name: 'initialValues',
      type: 'Partial<FormData>',
      required: false,
      defaultValue: '{}',
      description: '初始值'
    },
    {
      name: 'validation',
      type: 'Record<string, string>',
      required: false,
      description: '验证规则'
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
      type: 'ChangeEvent<HTMLInputElement>',
      description: '字段变化事件'
    }
  ],
  theming: true,
  animated: true,
  accessible: true
}

/**
 * 数据表格组件规范
 */
const dataTableSpec: ComponentSpec = {
  name: 'UserTable',
  description: '用户数据表格，支持排序、分页、筛选和行选择',
  type: 'complex',
  category: 'layout',
  props: [
    {
      name: 'data',
      type: 'User[]',
      required: true,
      description: '表格数据'
    },
    {
      name: 'columns',
      type: 'Column<User>[]',
      required: true,
      description: '列配置'
    },
    {
      name: 'loading',
      type: 'boolean',
      required: false,
      defaultValue: false,
      description: '是否加载中'
    },
    {
      name: 'pagination',
      type: 'boolean',
      required: false,
      defaultValue: true,
      description: '是否显示分页'
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
      name: 'onSort',
      type: '(column: string, direction: "asc" | "desc") => void',
      required: false,
      description: '排序回调'
    },
    {
      name: 'onPageChange',
      type: '(page: number) => void',
      required: false,
      description: '页码变化回调'
    }
  ],
  theming: true,
  animated: true,
  accessible: true
}

// ============================================================================
// 演示函数
// ============================================================================

/**
 * 运行单个组件生成演示
 */
async function runSingleComponentDemo() {
  console.log('\n' + '='.repeat(80))
  console.log('🚀 单个组件生成演示')
  console.log('='.repeat(80) + '\n')

  const generator = createCodeGenerator({
    outputDir: './examples/generated/button',
    generateTests: true,
    generateDocs: true,
    generateStory: false,
    claudeConfig: {
      // apiKey: 'YOUR_API_KEY', // 需要设置
      model: 'claude-3-sonnet-20240229',
      maxTokens: 4000,
      temperature: 0.7
    }
  })

  try {
    const result = await generator.generate(buttonSpec)

    console.log('\n✅ 生成结果:')
    console.log(`   组件名称: ${result.spec.name}`)
    console.log(`   文件数量: ${result.stats.filesGenerated}`)
    console.log(`   代码行数: ${result.stats.linesOfCode}`)
    console.log(`   生成时间: ${result.totalTime}ms`)
    console.log(`   TypeScript错误: ${result.tsErrors?.length || 0}`)

    console.log('\n📁 生成的文件:')
    result.files.forEach(file => {
      console.log(`   - ${file.filePath} (${file.type}, ${file.generationTime}ms)`)
    })

    return result
  } catch (error) {
    console.error('❌ 生成失败:', error)
    throw error
  }
}

/**
 * 运行批量组件生成演示
 */
async function runBatchComponentsDemo() {
  console.log('\n' + '='.repeat(80))
  console.log('🚀 批量组件生成演示')
  console.log('='.repeat(80) + '\n')

  const generator = createCodeGenerator({
    outputDir: './examples/generated',
    generateTests: true,
    generateDocs: true,
    generateStory: true
  })

  const specs: ComponentSpec[] = [
    buttonSpec,
    formSpec,
    dataTableSpec
  ]

  try {
    const results = await generator.generateBatch(specs)

    console.log('\n📊 批量生成统计:')
    console.log(`   总组件数: ${results.length}`)
    console.log(`   成功数: ${results.filter(r => r.files.length > 0).length}`)
    console.log(`   失败数: ${results.filter(r => r.files.length === 0).length}`)
    console.log(`   总文件数: ${results.reduce((sum, r) => sum + r.stats.filesGenerated, 0)}`)
    console.log(`   总代码行数: ${results.reduce((sum, r) => sum + r.stats.linesOfCode, 0)}`)
    console.log(`   总耗时: ${results.reduce((sum, r) => sum + r.totalTime, 0)}ms`)

    return results
  } catch (error) {
    console.error('❌ 批量生成失败:', error)
    throw error
  }
}

/**
 * 运行性能测试
 */
async function runPerformanceTest() {
  console.log('\n' + '='.repeat(80))
  console.log('⚡ 性能测试')
  console.log('='.repeat(80) + '\n')

  const generator = createCodeGenerator({
    outputDir: './examples/generated/perf-test',
    generateTests: false,
    generateDocs: false,
    generateStory: false
  })

  const specs: ComponentSpec[] = [
    { ...buttonSpec, name: 'TestButton1' },
    { ...buttonSpec, name: 'TestButton2' },
    { ...buttonSpec, name: 'TestButton3' },
    { ...buttonSpec, name: 'TestButton4' },
    { ...buttonSpec, name: 'TestButton5' },
  ]

  const start = Date.now()

  try {
    const results = await generator.generateBatch(specs)
    const totalTime = Date.now() - start

    console.log('\n⏱️ 性能指标:')
    console.log(`   总耗时: ${totalTime}ms`)
    console.log(`   平均每组件: ${Math.round(totalTime / specs.length)}ms`)
    console.log(`   最大耗时: ${Math.max(...results.map(r => r.totalTime))}ms`)
    console.log(`   最小耗时: ${Math.min(...results.map(r => r.totalTime))}ms`)
    console.log(`   成功率: ${((results.filter(r => r.files.length > 0).length / results.length) * 100).toFixed(1)}%`)

    // 检查是否达到性能目标
    const avgTime = totalTime / specs.length
    console.log('\n🎯 性能目标对比:')
    console.log(`   <3秒 (3000ms): ${avgTime < 3000 ? '✅ 通过' : '❌ 未达标'}`)
    console.log(`   生成时间: ${avgTime.toFixed(0)}ms`)

    return {
      totalTime,
      averageTime: avgTime,
      results
    }
  } catch (error) {
    console.error('❌ 性能测试失败:', error)
    throw error
  }
}

/**
 * 运行完整演示
 */
async function runFullDemo() {
  console.log('\n')
  console.log('█' + '█'.repeat(78))
  console.log('█' + ' '.repeat(78))
  console.log('█' + '  Xorigo UI - AI代码生成引擎演示'.padEnd(78) + '█')
  console.log('█' + ' '.repeat(78))
  console.log('█' + '█'.repeat(78))
  console.log('\n')

  try {
    // 1. 单个组件生成演示
    const singleResult = await runSingleComponentDemo()

    // 等待1秒
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 2. 批量组件生成演示
    const batchResults = await runBatchComponentsDemo()

    // 等待1秒
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 3. 性能测试
    const perfResults = await runPerformanceTest()

    console.log('\n' + '='.repeat(80))
    console.log('🎉 演示完成！')
    console.log('='.repeat(80) + '\n')

    console.log('📌 下一步操作:')
    console.log('   1. 查看生成的组件代码: ./examples/generated/')
    console.log('   2. 运行测试: pnpm test')
    console.log('   3. 构建项目: pnpm build')
    console.log('')

  } catch (error) {
    console.error('\n❌ 演示过程中发生错误:', error)
    process.exit(1)
  }
}

// ============================================================================
// 主程序入口
// ============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  runFullDemo()
    .then(() => {
      console.log('\n✅ 演示程序执行完毕')
      process.exit(0)
    })
    .catch(error => {
      console.error('\n❌ 演示程序执行失败:', error)
      process.exit(1)
    })
}
