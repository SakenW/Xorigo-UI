/**
 * 增强组件预览系统
 * 为所有组件提供丰富的预览展示
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  // UI 基础组件
  Button, Card, Typography, Skeleton, Spinner, Surface, ScrollArea,
  AvatarGroup, AnimatedCard, Separator, Icon,
  // 输入控件组件
  Input, Textarea, Select, Checkbox, Radio, Switch, Slider,
  ButtonGroup, SearchInput, PasswordInput, InputNumber, Combobox,
  // 表单组件
  InputGroup,
  // 导航组件
  Menu, Breadcrumb, Pagination, Tabs,
  // 数据展示组件
  Table, Accordion, Carousel, List,
  // 反馈组件
  Alert, Loading, Progress,
} from '@xorigo-ui/core'

// 组件预览映射类型
interface ComponentPreviewProps {
  component: {
    name: string
    category: string
    description: string
  }
  className?: string
}

/**
 * 组件预览渲染器
 * 根据组件名称返回对应的预览组件
 */
export function ComponentPreviewRenderer({ component, className = '' }: ComponentPreviewProps) {
  const [activeTab, setActiveTab] = useState('preview')
  const [isChecked, setIsChecked] = useState(false)
  const [radioValue, setRadioValue] = useState('option1')
  const [switchOn, setSwitchOn] = useState(false)
  const [sliderValue, setSliderValue] = useState(50)
  const [selectValue, setSelectValue] = useState('option1')
  const [inputValue, setInputValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')

  // 渲染组件预览 - 仅包含实际存在的组件
  const renderComponentPreview = () => {
    try {
      switch (component.name) {
      // ===== UI 基础组件 =====
      case 'Button':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="primary">主要</Button>
              <Button size="sm" variant="secondary">次要</Button>
              <Button size="sm" variant="success">成功</Button>
              <Button size="sm" variant="warning">警告</Button>
              <Button size="sm" variant="danger">危险</Button>
              <Button size="sm" variant="ghost">幽灵</Button>
              <Button size="sm" variant="link">链接</Button>
              <Button size="sm" variant="outline">边框</Button>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="primary" disabled>禁用</Button>
              <Button size="sm" variant="primary" loading>加载</Button>
            </div>
          </div>
        )

      case 'Card':
        return (
          <Card className="p-3">
            <div className="text-sm font-medium mb-2">卡片标题</div>
            <p className="text-xs text-gray-600">卡片内容描述信息</p>
          </Card>
        )

      case 'Typography':
        return (
          <div className="space-y-2 text-center">
            <Typography variant="h1">H1 标题</Typography>
            <Typography variant="h3">H3 标题</Typography>
            <Typography variant="p">段落文本内容展示</Typography>
            <Typography variant="small">小号文本说明</Typography>
          </div>
        )

      case 'Skeleton':
        return (
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        )

      case 'Spinner':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <span className="text-sm">加载中...</span>
            </div>
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
        )

      case 'AnimatedCard':
        return (
          <div className="space-y-3">
            <AnimatedCard className="p-3">
              <div className="text-sm font-medium mb-2">动画卡片</div>
              <p className="text-xs text-gray-600">带有动画效果的卡片组件</p>
            </AnimatedCard>
          </div>
        )

      case 'AvatarGroup':
        return (
          <div className="flex items-center gap-3">
            <AvatarGroup
              avatars={[
                { name: "张三", src: "" },
                { name: "李四", src: "" },
                { name: "王五", src: "" },
                { name: "更多", src: "", count: 5 }
              ]}
              max={3}
            />
          </div>
        )

      // ===== 输入控件组件 =====
      case 'Input':
        return (
          <div className="space-y-2">
            <Input size="sm" placeholder="默认输入框" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <Input size="sm" variant="outlined" placeholder="轮廓样式" />
            <Input size="sm" variant="filled" placeholder="填充样式" />
            <Input size="sm" leftIcon={<span>🔍</span>} placeholder="带图标" />
            <Input size="sm" error="错误状态" placeholder="错误提示" />
          </div>
        )

      case 'Textarea':
        return (
          <Textarea
            placeholder="请输入多行文本内容..."
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            rows={3}
            className="w-full"
          />
        )

      case 'Select':
        return (
          <div className="space-y-2">
            <div className="text-sm font-medium">下拉选择框（静态预览）</div>
            <div className="flex gap-2 flex-wrap">
              <div className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm">
                选项 1
              </div>
              <div className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm">
                选项 2 ✓
              </div>
              <div className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm">
                选项 3
              </div>
            </div>
          </div>
        )

      case 'Checkbox':
        return (
          <div className="space-y-2">
            <Checkbox
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              label="复选框选项"
            />
            <Checkbox defaultChecked label="默认选中" />
            <Checkbox disabled label="禁用状态" />
          </div>
        )

      case 'Radio':
        return (
          <div className="space-y-2">
            <div className="text-sm font-medium">单选框（静态预览）</div>
            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                <span className="text-xs">选项 1</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 rounded-full relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span className="text-xs">选项 2</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                <span className="text-xs">选项 3</span>
              </div>
            </div>
          </div>
        )

      case 'Switch':
        return (
          <div className="space-y-2">
            <div className="text-sm font-medium">开关控件（静态预览）</div>
            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-6 bg-gray-300 rounded-full relative">
                  <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
                <span className="text-xs">关闭</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-6 bg-blue-600 rounded-full relative">
                  <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
                <span className="text-xs">开启</span>
              </div>
              <div className="flex items-center gap-2 opacity-50">
                <div className="w-10 h-6 bg-gray-200 rounded-full relative">
                  <div className="absolute top-1 left-1 w-4 h-4 bg-gray-400 rounded-full shadow-sm"></div>
                </div>
                <span className="text-xs">禁用</span>
              </div>
            </div>
          </div>
        )

      case 'Slider':
        return (
          <div className="space-y-3">
            <Slider
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              min={0}
              max={100}
            />
            <div className="text-center text-sm text-gray-600">
              当前值: {sliderValue}
            </div>
          </div>
        )

      case 'ButtonGroup':
        return (
          <div className="flex gap-0">
            <Button variant="outline" className="rounded-r-none">左</Button>
            <Button variant="outline" className="rounded-none border-l-0">中</Button>
            <Button variant="outline" className="rounded-l-none border-l-0">右</Button>
          </div>
        )

      case 'SearchInput':
        return (
          <SearchInput
            placeholder="搜索内容..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onSearch={() => console.log('搜索:', inputValue)}
          />
        )

      // ===== 导航组件 =====
      case 'Tabs':
        return (
          <div className="space-y-3">
            <div className="flex gap-1 border-b border-gray-200">
              <button className="px-3 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                标签页 1
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                标签页 2
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                标签页 3
              </button>
            </div>
            <div className="text-sm text-gray-600">
              标签页内容区域
            </div>
          </div>
        )

      case 'Menu':
        return (
          <div className="space-y-1">
            <div className="px-3 py-2 text-sm font-medium bg-gray-100 rounded">菜单项 1</div>
            <div className="px-3 py-2 text-sm hover:bg-gray-100 rounded">菜单项 2</div>
            <div className="px-3 py-2 text-sm hover:bg-gray-100 rounded">菜单项 3</div>
          </div>
        )

      case 'Breadcrumb':
        return (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">首页</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">分类</span>
            <span className="text-gray-400">/</span>
            <span className="text-blue-600 font-medium">当前页面</span>
          </div>
        )

      case 'Pagination':
        return (
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 text-sm border rounded hover:bg-gray-50">‹</button>
            <button className="px-2 py-1 text-sm bg-blue-600 text-white rounded">1</button>
            <button className="px-2 py-1 text-sm border rounded hover:bg-gray-50">2</button>
            <button className="px-2 py-1 text-sm border rounded hover:bg-gray-50">3</button>
            <button className="px-2 py-1 text-sm border rounded hover:bg-gray-50">›</button>
          </div>
        )

      // ===== 数据展示组件 =====
      case 'Table':
        return (
          <div className="w-full overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">姓名</th>
                  <th className="text-left py-2 px-2">年龄</th>
                  <th className="text-left py-2 px-2">城市</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-2">张三</td>
                  <td className="py-2 px-2">28</td>
                  <td className="py-2 px-2">北京</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-2">李四</td>
                  <td className="py-2 px-2">32</td>
                  <td className="py-2 px-2">上海</td>
                </tr>
              </tbody>
            </table>
          </div>
        )

      case 'List':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 border rounded">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold">A</div>
              <div>
                <div className="text-sm font-medium">列表项 1</div>
                <div className="text-xs text-gray-600">描述信息</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 border rounded">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold">B</div>
              <div>
                <div className="text-sm font-medium">列表项 2</div>
                <div className="text-xs text-gray-600">描述信息</div>
              </div>
            </div>
          </div>
        )

      case 'Accordion':
        return (
          <div className="space-y-2">
            <div className="border rounded">
              <div className="p-3 bg-gray-50 text-sm font-medium">展开项 1</div>
              <div className="p-3 text-sm text-gray-600 border-t">
                展开内容区域 1
              </div>
            </div>
            <div className="border rounded">
              <div className="p-3 text-sm font-medium">收起项 2</div>
            </div>
          </div>
        )

      // ===== 反馈组件 =====
      case 'Alert':
        return (
          <div className="space-y-2">
            <Alert variant="info">信息提示内容</Alert>
            <Alert variant="success">成功操作提示</Alert>
            <Alert variant="warning">警告信息提示</Alert>
            <Alert variant="error">错误信息提示</Alert>
          </div>
        )

      case 'Loading':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Loading size="sm" />
              <span className="text-sm">加载中...</span>
            </div>
            <Loading variant="spinner" />
            <Loading variant="dots" />
          </div>
        )

      case 'Progress':
        return (
          <div className="space-y-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
        )

      // ===== 复合组件 =====
      case 'InputGroup':
        return (
          <div className="flex">
            <Input placeholder="输入内容..." className="rounded-r-none" />
            <Button variant="primary" className="rounded-l-none">
              搜索
            </Button>
          </div>
        )

      // ===== 默认展示 =====
      default:
        return (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl font-bold">
              {component.name.charAt(0)}
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">{component.name}</div>
              <div className="text-xs text-gray-600 mt-1">
                {component.category} 组件
              </div>
            </div>
          </div>
        )
    }
    } catch (error) {
      console.error(`Component preview error for ${component.name}:`, error)
      return (
        <div className="flex flex-col items-center gap-3 p-4">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-2xl">
            ⚠️
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-red-700">预览错误</div>
            <div className="text-xs text-gray-600 mt-1">
              {component.name} 组件暂时无法预览
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {/* 标签页导航 */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'preview'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          预览
        </button>
        <button
          onClick={() => setActiveTab('states')}
          className={`px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'states'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          状态
        </button>
      </div>

      {/* 内容区域 */}
      <div className="min-h-[120px] flex items-center justify-center">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          {activeTab === 'preview' ? (
            renderComponentPreview()
          ) : (
            <div className="text-center text-sm text-gray-600">
              <div className="font-medium mb-2">组件状态展示</div>
              <div className="space-y-2">
                <div className="flex justify-center gap-2">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">Default</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Hover</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Focus</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">Disabled</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

/**
 * 导出预览组件供其他模块使用
 */
export default ComponentPreviewRenderer