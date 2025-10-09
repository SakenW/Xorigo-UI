import React, { useState } from 'react'
import { Select } from '../../../src/components/Select'
import { Card } from '../../../src/components/Card'

export default function SelectDemo() {
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('react')

  const frameworkOptions = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
  ]

  const countryOptions = [
    { value: 'cn', label: '中国' },
    { value: 'us', label: '美国' },
    { value: 'jp', label: '日本' },
    { value: 'kr', label: '韩国' },
    { value: 'uk', label: '英国', disabled: true },
  ]

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">📝 表单组件 - 选择框</h2>
      <Card>
        <div className="space-y-6">
          {/* 基础选择框 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">基础样式</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <Select
                label="选择框架"
                placeholder="请选择框架"
                options={frameworkOptions}
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
              />
              <Select
                label="预选值"
                options={frameworkOptions}
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
              />
              <Select
                label="禁用状态"
                options={frameworkOptions}
                disabled
              />
              <Select
                label="必填项"
                options={countryOptions}
                required
                placeholder="选择国家"
              />
            </div>
          </div>

          {/* 不同尺寸 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">尺寸变体</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
              <Select
                label="小尺寸"
                selectSize="sm"
                options={frameworkOptions}
              />
              <Select
                label="中尺寸 (默认)"
                selectSize="md"
                options={frameworkOptions}
              />
              <Select
                label="大尺寸"
                selectSize="lg"
                options={frameworkOptions}
              />
            </div>
          </div>

          {/* 不同变体 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">样式变体</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <Select
                label="默认样式"
                variant="default"
                options={frameworkOptions}
              />
              <Select
                label="填充样式"
                variant="filled"
                options={frameworkOptions}
              />
              <Select
                label="描边样式"
                variant="outlined"
                options={frameworkOptions}
              />
              <Select
                label="下划线样式"
                variant="underlined"
                options={frameworkOptions}
              />
            </div>
          </div>

          {/* 帮助文本和错误 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">帮助文本与错误</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <Select
                label="带帮助文本"
                options={frameworkOptions}
                helperText="选择您最喜欢的前端框架"
              />
              <Select
                label="带错误提示"
                options={countryOptions}
                error="请选择一个有效的国家"
              />
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
