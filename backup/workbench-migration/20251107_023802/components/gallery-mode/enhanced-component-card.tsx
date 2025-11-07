'use client'

import { useState } from 'react'
import { Card } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Input } from '@xorigo-ui/core'
import { cn } from '../../../lib/utils'
import type { ComponentCategory } from '../../../data/component-classification'

/**
 * 增强版组件预览卡片 - 仅包含实际存在的组件
 */
interface EnhancedComponentCardProps {
  component: any
  onEdit: (component: any) => void
  onCopy: (component: any) => void
  onDocs: (component: any) => void
}

/**
 * 增强版组件渲染器 - 仅显示实际存在的组件
 */
function EnhancedComponentRenderer({ componentName, variant = 'default' }: { componentName: string, variant?: string }) {
  switch (componentName) {
    case 'Button':
      return (
        <div className="space-y-4 p-4">
          {/* 不同尺寸展示 */}
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">尺寸变化</Typography>
            <div className="flex items-center gap-2">
              <Button variant="primary" size="sm">小型</Button>
              <Button variant="primary" size="md">中型</Button>
              <Button variant="primary" size="lg">大型</Button>
            </div>
          </div>

          {/* 不同变体展示 */}
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">样式变体</Typography>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="sm">主要</Button>
              <Button variant="secondary" size="sm">次要</Button>
              <Button variant="outline" size="sm">边框</Button>
              <Button variant="ghost" size="sm">幽灵</Button>
            </div>
          </div>

          {/* 状态展示 */}
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">状态变化</Typography>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="sm">正常</Button>
              <Button variant="primary" size="sm" disabled>禁用</Button>
              <Button variant="primary" size="sm" className="opacity-75">加载中</Button>
            </div>
          </div>
        </div>
      )

    case 'Typography':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-3">
            <Typography variant="h1">主标题 H1</Typography>
            <Typography variant="h3">三级标题 H3</Typography>
          </div>

          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">文本样式</Typography>
            <Typography variant="body">这是正文文本，用于展示基本的段落排版效果。</Typography>
            <Typography variant="small" className="text-muted-foreground">
              这是小号文本，用于辅助信息展示。
            </Typography>
          </div>
        </div>
      )

    case 'Input':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-3">
            <Input placeholder="文本输入框" defaultValue="" />
            <Input placeholder="邮箱输入框" type="email" defaultValue="" />
            <Input placeholder="密码输入框" type="password" defaultValue="" />
            <Input placeholder="搜索框" type="search" defaultValue="" />
          </div>

          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">状态展示</Typography>
            <div className="space-y-2">
              <Input placeholder="正常状态" defaultValue="" />
              <Input placeholder="禁用状态" disabled defaultValue="" />
              <Input placeholder="错误状态" className="border-red-500" defaultValue="" />
            </div>
          </div>
        </div>
      )

    case 'Card':
      return (
        <div className="space-y-4 p-4">
          <Card className="max-w-sm">
            <div className="p-4">
              <h3 className="font-semibold mb-2">卡片标题</h3>
              <p className="text-sm text-muted-foreground mb-4">卡片副标题</p>
              <p className="text-sm">这是卡片内容区域，用于展示主要信息。</p>
              <div className="mt-4 flex gap-2">
                <Button variant="primary" size="sm">操作</Button>
                <Button variant="outline" size="sm">取消</Button>
              </div>
            </div>
          </Card>
        </div>
      )

    case 'Skeleton':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">骨架屏</Typography>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        </div>
      )

    case 'Spinner':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">旋转器</Typography>
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
            </div>
          </div>
        </div>
      )

    case 'AnimatedCard':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">动画卡片示例</Typography>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="relative">
                <div className="animate-pulse">
                  <h3 className="text-sm font-semibold mb-2">动画卡片</h3>
                  <p className="text-xs opacity-90">带有动画效果的卡片组件</p>
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'AvatarGroup':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">头像组</Typography>
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white">A</div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white">B</div>
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white">C</div>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium border-2 border-white">+3</div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'Separator':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">水平分隔线</Typography>
            <div className="space-y-3">
              <div className="border-t border-gray-300"></div>
              <div className="border-t-2 border-gray-400"></div>
              <div className="border-t border-dashed border-gray-300"></div>
            </div>
          </div>

          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">垂直分隔线</Typography>
            <div className="flex items-center gap-4">
              <span>内容1</span>
              <div className="w-px h-8 bg-gray-300"></div>
              <span>内容2</span>
              <div className="w-px h-8 border-l-2 border-gray-400"></div>
              <span>内容3</span>
            </div>
          </div>
        </div>
      )

    case 'ScrollArea':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">滚动区域</Typography>
            <div className="h-32 overflow-y-auto border rounded-lg p-3 bg-gray-50">
              <div className="space-y-2">
                <div className="h-8 bg-blue-100 rounded"></div>
                <div className="h-8 bg-green-100 rounded"></div>
                <div className="h-8 bg-purple-100 rounded"></div>
                <div className="h-8 bg-yellow-100 rounded"></div>
                <div className="h-8 bg-pink-100 rounded"></div>
                <div className="h-8 bg-indigo-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'Tabs':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">标签页组件</Typography>
            <div className="border-b border-gray-200">
              <div className="flex space-x-8">
                <button className="py-2 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600">
                  标签页 1
                </button>
                <button className="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                  标签页 2
                </button>
                <button className="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                  标签页 3
                </button>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <Typography variant="body" className="text-sm">标签页 1 的内容</Typography>
            </div>
          </div>
        </div>
      )

    case 'Alert':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">警告提示示例</Typography>
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-blue-400">ℹ️</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-800">这是一个信息提示</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 p-3 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-green-400">✅</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-800">这是一个成功提示</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 p-3 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-red-400">❌</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">这是一个错误提示</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'Menu':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">菜单组件示例</Typography>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                    <span className="mr-3">📄</span>文件
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                    <span className="mr-3">✏️</span>编辑
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                    <span className="mr-3">🔍</span>查找
                  </button>
                  <div className="border-t border-gray-100 my-2"></div>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                    <span className="mr-3">⚙️</span>设置
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'Breadcrumb':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">面包屑导航示例</Typography>
            <div className="space-y-3">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">首页</a>
                  </li>
                  <li>
                    <span className="text-gray-300">/</span>
                  </li>
                  <li>
                    <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">产品</a>
                  </li>
                  <li>
                    <span className="text-gray-300">/</span>
                  </li>
                  <li>
                    <span className="text-gray-900 text-sm font-medium">详情</span>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      )

    case 'Pagination':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">分页组件</Typography>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border rounded text-sm">上一页</button>
              <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">1</button>
              <button className="px-3 py-1 border rounded text-sm">2</button>
              <button className="px-3 py-1 border rounded text-sm">3</button>
              <span className="text-sm">...</span>
              <button className="px-3 py-1 border rounded text-sm">10</button>
              <button className="px-3 py-1 border rounded text-sm">下一页</button>
            </div>
          </div>
        </div>
      )

    case 'Accordion':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">手风琴组件</Typography>
            <div className="border rounded-lg">
              <div className="p-3 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="font-medium">标题 1</span>
                  <span className="text-gray-500">▼</span>
                </div>
              </div>
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <span className="font-medium">标题 2</span>
                  <span className="text-gray-500">▶</span>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">标题 3</span>
                  <span className="text-gray-500">▶</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'List':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">列表组件</Typography>
            <div className="border rounded-lg divide-y">
              <div className="p-3 hover:bg-gray-50">列表项目 1</div>
              <div className="p-3 hover:bg-gray-50">列表项目 2</div>
              <div className="p-3 hover:bg-gray-50">列表项目 3</div>
            </div>
          </div>
        </div>
      )

    case 'Progress':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">进度条组件示例</Typography>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">下载进度</span>
                  <span className="text-sm text-gray-500">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">上传进度</span>
                  <span className="text-sm text-gray-500">30%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'Loading':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">加载状态</Typography>
            <div className="flex items-center justify-center h-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      )

    case 'Kbd':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">键盘按键</Typography>
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Ctrl</div>
              <div className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">C</div>
              <div className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Enter</div>
              <div className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Esc</div>
            </div>
          </div>
        </div>
      )

    case 'Code':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">代码块</Typography>
            <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm">
              <div className="text-green-400">const</div>
              <div className="text-blue-400"> greeting</div>
              <div className="text-white"> = </div>
              <div className="text-yellow-300">"Hello, World!"</div>
              <div className="text-white">;</div>
            </div>
          </div>
        </div>
      )

    case 'Surface':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">表面组件</Typography>
            <div className="space-y-2">
              <div className="p-4 bg-white border rounded-lg shadow-sm">卡片表面</div>
              <div className="p-4 bg-gray-100 rounded-lg">灰色表面</div>
              <div className="p-4 bg-gray-900 text-white rounded-lg">深色表面</div>
            </div>
          </div>
        </div>
      )

    case 'Tooltip':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">工具提示示例</Typography>
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="w-6 h-6 bg-blue-500 rounded-full cursor-help"></div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  提示信息
                </div>
              </div>
              <div className="relative group">
                <div className="w-6 h-6 bg-green-500 rounded-full cursor-help"></div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  另一个提示
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'ButtonGroup':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">按钮组示例</Typography>
            <div className="space-y-3">
              <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
                <Button variant="outline" size="sm" className="rounded-none border-r-0">左</Button>
                <Button variant="outline" size="sm" className="rounded-none border-r-0">中</Button>
                <Button variant="outline" size="sm" className="rounded-none">右</Button>
              </div>
              <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
                <Button variant="primary" size="sm" className="rounded-none border-r-0">主要</Button>
                <Button variant="secondary" size="sm" className="rounded-none border-r-0">次要</Button>
                <Button variant="outline" size="sm" className="rounded-none">边框</Button>
              </div>
            </div>
          </div>
        </div>
      )

    case 'InputGroup':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">输入组示例</Typography>
            <div className="space-y-3">
              <div className="flex border border-gray-300 rounded-lg">
                <span className="px-3 py-2 bg-gray-100 border-r border-gray-300 text-sm">@</span>
                <input type="text" placeholder="用户名" className="flex-1 px-3 py-2 text-sm" />
              </div>
              <div className="flex border border-gray-300 rounded-lg">
                <input type="text" placeholder="网站地址" className="flex-1 px-3 py-2 text-sm" />
                <span className="px-3 py-2 bg-gray-100 border-l border-gray-300 text-sm">.com</span>
              </div>
            </div>
          </div>
        </div>
      )

    case 'AdvancedCard':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">高级卡片组件示例</Typography>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">高级功能卡片</h3>
                  <p className="text-sm opacity-90">具有丰富交互和动画效果</p>
                </div>
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-lg">⭐</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">实时数据同步</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm">智能分析处理</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-sm">高级安全保护</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button variant="secondary" size="sm" className="bg-white bg-opacity-20 border-white border-opacity-30 text-white hover:bg-opacity-30">了解更多</Button>
                <Button variant="outline" size="sm" className="border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-10">立即使用</Button>
              </div>
            </div>
          </div>
        </div>
      )

    default:
      return (
        <div className="p-8 border border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <div className="text-4xl mb-3 text-muted-foreground">
              {componentName.charAt(0)}
            </div>
            <p className="text-sm text-muted-foreground font-medium">{componentName}</p>
            <p className="text-xs text-muted-foreground mt-2">组件预览开发中...</p>
          </div>
        </div>
      )
  }
}

export { EnhancedComponentRenderer }

export function EnhancedComponentCard({
  component,
  onEdit,
  onCopy,
  onDocs
}: EnhancedComponentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!component || !component.name) {
    return null
  }

  // 获取组件可用变体
  const variants = component.variants || []

  return (
    <Card className={cn(
      "group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20",
      isExpanded ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
    )}>
      {/* 卡片头部 - 组件信息 */}
      <div className="pb-4 bg-gradient-to-r from-gray-50 to-gray-100/50 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center border border-primary/20">
              <span className="text-primary font-bold text-xl">
                {component.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl text-gray-900">{component.name}</h3>
              <span className="mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {component.category}
              </span>
            </div>
          </div>

          {/* 展开按钮 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isExpanded ? '收起' : '展开'}
          </Button>
        </div>

        {/* 组件描述 */}
        <p className="text-sm text-gray-600 leading-relaxed mt-3">
          {component.description}
        </p>
      </div>

      <div className="pt-0 p-4">
        <div className="space-y-6">
          {/* 增强版组件预览区域 - 更大的展示空间 */}
          <div className={cn(
            "bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 overflow-hidden",
            isExpanded ? "min-h-[400px]" : "min-h-[300px]"
          )}>
            <div className="p-4">
              <div className="flex items-center justify-center min-h-[250px]">
                <EnhancedComponentRenderer
                  componentName={component.name}
                  variant="default"
                />
              </div>
            </div>

            {/* 预览区域底部装饰 */}
            <div className="h-2 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent"></div>
          </div>

          {/* 变体选择器（如果有变体） */}
          {variants.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Typography variant="body" className="text-sm font-medium text-gray-700">
                  组件变体
                </Typography>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {variants.length} 个变体
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant: string) => (
                  <button
                    key={variant}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-lg border transition-all duration-200",
                      "hover:border-primary hover:bg-primary/5 hover:text-primary",
                      "focus:outline-none focus:ring-2 focus:ring-primary/20"
                    )}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 操作按钮区域 */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(component)}
              className="flex-1 hover:bg-primary/5 hover:border-primary hover:text-primary"
            >
              编辑
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCopy(component)}
              className="flex-1 hover:bg-primary/5 hover:border-primary hover:text-primary"
            >
              复制
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDocs(component)}
              className="flex-1 hover:bg-primary/5 hover:border-primary hover:text-primary"
            >
              文档
            </Button>
          </div>

          {/* 展开时的额外信息 */}
          {isExpanded && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="body" className="text-sm font-medium text-gray-700 mb-2">
                    快速预览
                  </Typography>
                  <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                    点击上方操作按钮进行编辑、复制或查看详细文档
                  </div>
                </div>
                <div>
                  <Typography variant="body" className="text-sm font-medium text-gray-700 mb-2">
                    组件信息
                  </Typography>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>分类: {component.category}</div>
                    <div>变体: {variants.length} 个</div>
                    <div>状态: 可用</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}