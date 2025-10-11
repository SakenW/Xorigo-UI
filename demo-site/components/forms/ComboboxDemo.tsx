import React, { useState } from 'react'
import { Combobox } from '../../../src/components/ui/Combobox'
import { Card } from '../../../src/components/ui/Card'

export default function ComboboxDemo() {
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('react')
  const [value3, setValue3] = useState('en')

  // 框架选项
  const frameworkOptions = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'solid', label: 'Solid' },
    { value: 'preact', label: 'Preact' },
    { value: 'next', label: 'Next.js', disabled: true },
  ]

  // 语言选项（带分组）
  const languageOptions = [
    { value: 'zh', label: '简体中文', group: '中文' },
    { value: 'zh-tw', label: '繁体中文', group: '中文' },
    { value: 'en', label: 'English', group: 'English' },
    { value: 'en-us', label: 'English (US)', group: 'English' },
    { value: 'en-uk', label: 'English (UK)', group: 'English' },
    { value: 'ja', label: '日本語', group: 'その他' },
    { value: 'ko', label: '한국어', group: 'その他' },
    { value: 'fr', label: 'Français', group: 'Europe' },
    { value: 'de', label: 'Deutsch', group: 'Europe' },
    { value: 'es', label: 'Español', group: 'Europe' },
  ]

  // 国家选项
  const countryOptions = [
    { value: 'cn', label: '🇨🇳 中国' },
    { value: 'us', label: '🇺🇸 美国' },
    { value: 'jp', label: '🇯🇵 日本' },
    { value: 'kr', label: '🇰🇷 韩国' },
    { value: 'uk', label: '🇬🇧 英国' },
    { value: 'fr', label: '🇫🇷 法国' },
    { value: 'de', label: '🇩🇪 德国' },
    { value: 'ca', label: '🇨🇦 加拿大' },
    { value: 'au', label: '🇦🇺 澳大利亚' },
  ]

  // 水果选项
  const fruitOptions = [
    { value: 'apple', label: '🍎 苹果' },
    { value: 'banana', label: '🍌 香蕉' },
    { value: 'cherry', label: '🍒 樱桃' },
    { value: 'grape', label: '🍇 葡萄' },
    { value: 'orange', label: '🍊 橙子' },
    { value: 'strawberry', label: '🍓 草莓' },
    { value: 'watermelon', label: '🍉 西瓜' },
    { value: 'peach', label: '🍑 桃子' },
  ]

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        📝 表单组件 - 组合选择框 (Combobox)
      </h2>

      <Card>
        <div className="space-y-8">
          {/* 基础使用 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">基础样式</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <Combobox
                label="选择框架"
                placeholder="请选择前端框架"
                options={frameworkOptions}
                value={value1}
                onValueChange={(val) => {
                  console.log('选择框架:', val)
                  setValue1(val)
                }}
                helperText="选择您最喜欢的前端框架"
              />

              <Combobox
                label="预选值"
                options={frameworkOptions}
                value={value2}
                onValueChange={setValue2}
              />

              <Combobox
                label="禁用状态"
                options={frameworkOptions}
                disabled
              />

              <Combobox
                label="可清除"
                options={frameworkOptions}
                clearable
                placeholder="可清除选择"
              />
            </div>
          </div>

          {/* 不同尺寸 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">尺寸变体</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
              <Combobox
                label="小尺寸"
                size="sm"
                options={frameworkOptions}
              />

              <Combobox
                label="中尺寸 (默认)"
                size="md"
                options={frameworkOptions}
              />

              <Combobox
                label="大尺寸"
                size="lg"
                options={frameworkOptions}
              />
            </div>
          </div>

          {/* 不同变体 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">样式变体</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <Combobox
                label="默认样式"
                variant="default"
                options={frameworkOptions}
              />

              <Combobox
                label="填充样式"
                variant="filled"
                options={frameworkOptions}
              />

              <Combobox
                label="描边样式"
                variant="outlined"
                options={frameworkOptions}
              />

              <Combobox
                label="下划线样式"
                variant="underlined"
                options={frameworkOptions}
              />
            </div>
          </div>

          {/* 分组选项 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">分组选项</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <Combobox
                label="选择语言"
                options={languageOptions}
                value={value3}
                onValueChange={setValue3}
                placeholder="请选择语言"
                helperText="支持多种语言分组"
              />

              <Combobox
                label="非可搜索"
                options={languageOptions}
                searchable={false}
                placeholder="点击选择"
              />
            </div>
          </div>

          {/* 表情符号选项 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">带图标的选项</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <Combobox
                label="选择国家"
                options={countryOptions}
                placeholder="搜索国家..."
                searchPlaceholder="输入国家名称"
              />

              <Combobox
                label="选择水果"
                options={fruitOptions}
                placeholder="搜索水果..."
                emptyText="没有找到该水果"
                clearable
              />
            </div>
          </div>

          {/* 错误状态 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">错误状态</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <Combobox
                label="带错误提示"
                options={frameworkOptions}
                error="请选择一个有效的框架"
              />

              <Combobox
                label="必填项验证"
                options={countryOptions}
                error={!value1 ? '此字段为必填项' : undefined}
                helperText="选择后错误消失"
              />
            </div>
          </div>

          {/* 长列表展示 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">长列表滚动</h3>
            <div className="max-w-md">
              <Combobox
                label="选择城市"
                options={[
                  { value: 'beijing', label: '北京' },
                  { value: 'shanghai', label: '上海' },
                  { value: 'guangzhou', label: '广州' },
                  { value: 'shenzhen', label: '深圳' },
                  { value: 'hangzhou', label: '杭州' },
                  { value: 'nanjing', label: '南京' },
                  { value: 'wuhan', label: '武汉' },
                  { value: 'chengdu', label: '成都' },
                  { value: 'xian', label: '西安' },
                  { value: 'chongqing', label: '重庆' },
                  { value: 'tianjin', label: '天津' },
                  { value: 'suzhou', label: '苏州' },
                  { value: 'zhengzhou', label: '郑州' },
                  { value: 'changsha', label: '长沙' },
                  { value: 'shenyang', label: '沈阳' },
                ]}
                placeholder="搜索城市..."
                searchPlaceholder="输入城市名称"
                clearable
                helperText="支持中文拼音搜索"
              />
            </div>
          </div>

          {/* 实际应用示例 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">实际应用示例</h3>
            <div className="max-w-2xl">
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg space-y-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-white">用户配置表单</h4>

                <Combobox
                  label="首选语言"
                  options={languageOptions}
                  value={value3}
                  onValueChange={setValue3}
                  placeholder="选择您的首选语言"
                  clearable
                />

                <Combobox
                  label="时区"
                  options={[
                    { value: 'utc+8', label: 'UTC+8 (北京时间)', group: '亚洲' },
                    { value: 'utc+9', label: 'UTC+9 (东京时间)', group: '亚洲' },
                    { value: 'utc-5', label: 'UTC-5 (纽约时间)', group: '美洲' },
                    { value: 'utc-8', label: 'UTC-8 (洛杉矶时间)', group: '美洲' },
                    { value: 'utc+0', label: 'UTC+0 (伦敦时间)', group: '欧洲' },
                    { value: 'utc+1', label: 'UTC+1 (巴黎时间)', group: '欧洲' },
                  ]}
                  placeholder="选择时区"
                  searchPlaceholder="搜索时区..."
                />

                <div className="flex justify-end gap-2 mt-4">
                  <button className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                    取消
                  </button>
                  <button className="px-4 py-2 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors">
                    保存设置
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
