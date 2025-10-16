'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Input } from '@xorigo-ui/core'
import { Typography } from '@xorigo-ui/core'
import { Avatar } from '@xorigo-ui/core'
import { cn } from '../../../lib/utils'
import type { ComponentCategory } from '../../../data/component-classification'

/**
 * 增强版组件预览卡片 - 更好地展示组件形态
 */
interface EnhancedComponentCardProps {
  component: any
  onEdit: (component: any) => void
  onCopy: (component: any) => void
  onDocs: (component: any) => void
}

/**
 * 增强版组件渲染器 - 展示多种形态和上下文
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
              <Button variant="primary" size="sm">Primary</Button>
              <Button variant="secondary" size="sm">Secondary</Button>
              <Button variant="outline" size="sm">Outline</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
              <Button variant="destructive" size="sm">Destructive</Button>
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
            <Typography variant="h2">副标题 H2</Typography>
            <Typography variant="h3">三级标题 H3</Typography>
            <Typography variant="h4">四级标题 H4</Typography>
          </div>

          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">文本样式</Typography>
            <Typography variant="body">这是正文文本，用于展示基本的段落排版效果。</Typography>
            <Typography variant="caption" className="text-muted-foreground">
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

    case 'Avatar':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">尺寸变化</Typography>
            <div className="flex items-center gap-3">
              <Avatar size="xs">XS</Avatar>
              <Avatar size="sm">SM</Avatar>
              <Avatar size="md">MD</Avatar>
              <Avatar size="lg">LG</Avatar>
              <Avatar size="xl">XL</Avatar>
            </div>
          </div>

          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">头像类型</Typography>
            <div className="flex items-center gap-3">
              <Avatar size="md">A</Avatar>
              <Avatar size="md" className="bg-blue-500 text-white">B</Avatar>
              <Avatar size="md" className="bg-green-500 text-white">C</Avatar>
            </div>
          </div>
        </div>
      )

    case 'Badge':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">颜色变体</Typography>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">尺寸变化</Typography>
            <div className="flex items-center gap-2">
              <Badge variant="default" size="sm">Small</Badge>
              <Badge variant="default" size="md">Medium</Badge>
              <Badge variant="default" size="lg">Large</Badge>
            </div>
          </div>
        </div>
      )

    case 'Card':
      return (
        <div className="space-y-4 p-4">
          <Card className="max-w-sm">
            <CardHeader>
              <h3 className="font-semibold">卡片标题</h3>
              <p className="text-sm text-muted-foreground">卡片副标题</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm">这是卡片内容区域，用于展示主要信息。</p>
              <div className="mt-4 flex gap-2">
                <Button variant="primary" size="sm">操作</Button>
                <Button variant="outline" size="sm">取消</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )

    case 'Icon':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">常用图标</Typography>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded">
                <span className="text-lg">🏠</span>
              </div>
              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded">
                <span className="text-lg">👤</span>
              </div>
              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded">
                <span className="text-lg">⚙️</span>
              </div>
              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded">
                <span className="text-lg">🔍</span>
              </div>
              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded">
                <span className="text-lg">❤️</span>
              </div>
              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded">
                <span className="text-lg">⭐</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">尺寸变化</Typography>
            <div className="flex items-center gap-3">
              <span className="text-sm">🏠</span>
              <span className="text-lg">🏠</span>
              <span className="text-xl">🏠</span>
              <span className="text-2xl">🏠</span>
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

    case 'Container':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">容器宽度限制</Typography>
            <div className="space-y-3">
              <div className="container mx-auto bg-blue-50 p-3 rounded border border-blue-200">
                <Typography variant="body" className="text-sm">Container (默认最大宽度)</Typography>
              </div>
              <div className="container mx-auto bg-green-50 p-3 rounded border border-green-200 max-w-md">
                <Typography variant="body" className="text-sm">Container (max-w-md)</Typography>
              </div>
              <div className="container mx-auto bg-purple-50 p-3 rounded border border-purple-200 max-w-sm">
                <Typography variant="body" className="text-sm">Container (max-w-sm)</Typography>
              </div>
            </div>
          </div>
        </div>
      )

    case 'Flex':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">Flex 布局示例</Typography>
            <div className="space-y-3">
              <div className="flex gap-2 bg-gray-50 p-3 rounded">
                <div className="w-8 h-8 bg-blue-500 rounded"></div>
                <div className="w-8 h-8 bg-green-500 rounded"></div>
                <div className="w-8 h-8 bg-purple-500 rounded"></div>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                <div className="w-8 h-8 bg-red-500 rounded"></div>
                <div className="w-8 h-8 bg-yellow-500 rounded"></div>
                <div className="w-8 h-8 bg-pink-500 rounded"></div>
              </div>
              <div className="flex justify-center gap-4 bg-gray-50 p-3 rounded">
                <div className="w-8 h-8 bg-indigo-500 rounded"></div>
                <div className="w-8 h-8 bg-teal-500 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'Grid':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">Grid 布局示例</Typography>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded">
                <div className="w-full h-8 bg-blue-500 rounded"></div>
                <div className="w-full h-8 bg-green-500 rounded"></div>
                <div className="w-full h-8 bg-purple-500 rounded"></div>
              </div>
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded">
                <div className="w-full h-8 bg-red-500 rounded"></div>
                <div className="w-full h-8 bg-yellow-500 rounded"></div>
                <div className="w-full h-8 bg-pink-500 rounded"></div>
                <div className="w-full h-8 bg-indigo-500 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'Box':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">Box 容器示例</Typography>
            <div className="space-y-3">
              <div className="box-border bg-blue-100 border-2 border-blue-300 p-3 rounded">
                <Typography variant="body" className="text-sm">Box with border</Typography>
              </div>
              <div className="bg-green-100 p-3 rounded shadow-md">
                <Typography variant="body" className="text-sm">Box with shadow</Typography>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Typography variant="body" className="text-sm">Box with rounded-lg</Typography>
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

    case 'Modal':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">模态框示例</Typography>
            <div className="relative">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold mb-2">模态框预览</h3>
                  <p className="text-xs text-gray-600 mb-3">这是模态框的预览效果，实际使用时会覆盖整个屏幕。</p>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm">确认</Button>
                    <Button variant="outline" size="sm">取消</Button>
                  </div>
                </div>
              </div>
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

    case 'Table':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">表格组件示例</Typography>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">张三</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">zhang@example.com</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">活跃</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">李四</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">li@example.com</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">离线</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )

    case 'Select':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">选择组件示例</Typography>
            <div className="space-y-3">
              <div className="relative">
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm">
                  <option>选择选项</option>
                  <option>选项 1</option>
                  <option>选项 2</option>
                  <option>选项 3</option>
                </select>
              </div>
              <div className="relative">
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm" disabled>
                  <option>禁用状态</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )

    case 'Checkbox':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">复选框组件示例</Typography>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700">选项 1</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" checked readOnly />
                <span className="ml-2 text-sm text-gray-700">选项 2 (已选中)</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" disabled />
                <span className="ml-2 text-sm text-gray-400">选项 3 (禁用)</span>
              </label>
            </div>
          </div>
        </div>
      )

    case 'Radio':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">单选框组件示例</Typography>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="radio" name="example" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700">选项 1</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="example" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" checked readOnly />
                <span className="ml-2 text-sm text-gray-700">选项 2 (已选中)</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="example" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" disabled />
                <span className="ml-2 text-sm text-gray-400">选项 3 (禁用)</span>
              </label>
            </div>
          </div>
        </div>
      )

    case 'Switch':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">开关组件示例</Typography>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="w-8 h-4 text-blue-600 bg-gray-200 border-gray-300 rounded focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700">开启状态</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="w-8 h-4 text-blue-600 bg-gray-200 border-gray-300 rounded focus:ring-blue-500" checked readOnly />
                <span className="ml-2 text-sm text-gray-700">关闭状态</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="w-8 h-4 text-gray-200 bg-gray-200 border-gray-300 rounded focus:ring-blue-500" disabled />
                <span className="ml-2 text-sm text-gray-400">禁用状态</span>
              </label>
            </div>
          </div>
        </div>
      )

    case 'Slider':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">滑块组件示例</Typography>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-700">音量控制</label>
                <input type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" min="0" max="100" defaultValue="50" />
              </div>
              <div>
                <label className="text-sm text-gray-700">进度控制</label>
                <input type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" min="0" max="100" defaultValue="75" />
              </div>
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

    case 'Spacer':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">间距组件</Typography>
            <div className="space-y-4">
              <div className="h-4 bg-gray-100 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      )

    case 'Panel':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">面板组件</Typography>
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-2">面板标题</h4>
              <p className="text-sm text-gray-600">面板内容区域，可以包含各种内容。</p>
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

    case 'Carousel':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">轮播组件</Typography>
            <div className="relative">
              <div className="flex space-x-2 overflow-hidden">
                <div className="min-w-full h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-medium">幻灯片 1</div>
              </div>
              <div className="flex justify-center mt-2 space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
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

    case 'Toast':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">提示消息</Typography>
            <div className="space-y-2">
              <div className="p-3 bg-gray-800 text-white rounded-lg shadow-lg flex items-center space-x-2">
                <span>✅</span>
                <span className="text-sm">操作成功</span>
              </div>
              <div className="p-3 bg-orange-500 text-white rounded-lg shadow-lg flex items-center space-x-2">
                <span>⚠️</span>
                <span className="text-sm">请注意</span>
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

    case 'Navbar':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">导航栏示例</Typography>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary-500 rounded"></div>
                  <div className="flex space-x-6">
                    <div className="w-12 h-1 bg-gray-800 rounded"></div>
                    <div className="w-12 h-1 bg-gray-400 rounded"></div>
                    <div className="w-12 h-1 bg-gray-400 rounded"></div>
                    <div className="w-12 h-1 bg-gray-400 rounded"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">登录</Button>
                  <Button variant="primary" size="sm">注册</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'Sidebar':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">侧边栏示例</Typography>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="w-48 h-64 bg-gray-50 border-r">
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <div className="w-16 h-1 bg-blue-600 rounded"></div>
                    </div>
                    <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                      <div className="w-4 h-4 bg-gray-400 rounded"></div>
                      <div className="w-16 h-1 bg-gray-600 rounded"></div>
                    </div>
                    <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                      <div className="w-4 h-4 bg-gray-400 rounded"></div>
                      <div className="w-16 h-1 bg-gray-600 rounded"></div>
                    </div>
                  </div>
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                      <div className="w-4 h-4 bg-gray-400 rounded"></div>
                      <div className="w-16 h-1 bg-gray-600 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'DataTable':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">数据表格示例</Typography>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">姓名</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">部门</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2 text-sm">#001</td>
                    <td className="px-4 py-2 text-sm">张三</td>
                    <td className="px-4 py-2 text-sm">技术部</td>
                    <td className="px-4 py-2"><span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">在职</span></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm">#002</td>
                    <td className="px-4 py-2 text-sm">李四</td>
                    <td className="px-4 py-2 text-sm">产品部</td>
                    <td className="px-4 py-2"><span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">出差</span></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm">#003</td>
                    <td className="px-4 py-2 text-sm">王五</td>
                    <td className="px-4 py-2 text-sm">市场部</td>
                    <td className="px-4 py-2"><span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">休假</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )

    case 'Dialog':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">对话框示例</Typography>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold mb-2">对话框预览</h3>
                <p className="text-xs text-gray-600 mb-3">这是对话框的预览效果，用于用户交互。</p>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm">确认</Button>
                  <Button variant="outline" size="sm">取消</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'Drawer':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">抽屉组件示例</Typography>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold mb-2">抽屉预览</h3>
                <p className="text-xs text-gray-600 mb-3">侧边抽屉的预览效果，通常从侧边滑出。</p>
                <div className="space-y-2">
                  <div className="w-full h-2 bg-gray-200 rounded"></div>
                  <div className="w-full h-2 bg-gray-200 rounded"></div>
                  <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'Popover':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">弹出框示例</Typography>
            <div className="relative">
              <Button variant="outline" size="sm">触发元素</Button>
              <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
                <p className="text-xs text-gray-700">这是弹出框内容</p>
              </div>
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

    case 'HoverCard':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">悬停卡片示例</Typography>
            <div className="relative group">
              <div className="w-16 h-16 bg-blue-100 rounded-lg border-2 border-blue-200 cursor-pointer"></div>
              <div className="absolute left-20 top-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <h4 className="text-sm font-semibold mb-1">悬停卡片</h4>
                <p className="text-xs text-gray-600">鼠标悬停时显示的详细信息</p>
              </div>
            </div>
          </div>
        </div>
      )

    case 'Lightbox':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">灯箱组件示例</Typography>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="bg-black bg-opacity-90 rounded-lg p-4 text-white">
                <h3 className="text-sm font-semibold mb-2">灯箱预览</h3>
                <p className="text-xs mb-3">全屏展示内容的预览效果</p>
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-white rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'Sheet':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">表单组件示例</Typography>
            <div className="border border-gray-200 rounded-lg p-3 bg-white">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700">字段1</label>
                  <div className="w-full h-6 bg-gray-100 rounded mt-1"></div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">字段2</label>
                  <div className="w-full h-6 bg-gray-100 rounded mt-1"></div>
                </div>
                <Button variant="primary" size="sm">提交</Button>
              </div>
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

    case 'ResponsiveLayout':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">响应式布局示例</Typography>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-800 text-white p-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 p-2">
                <div className="h-16 bg-blue-100 rounded"></div>
                <div className="h-16 bg-green-100 rounded"></div>
                <div className="h-16 bg-purple-100 rounded"></div>
              </div>
              <div className="bg-gray-100 p-2">
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'BasicHeader':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">基础头部示例</Typography>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded"></div>
                  <div className="w-20 h-1 bg-gray-800 rounded"></div>
                </div>
                <nav className="flex space-x-4">
                  <div className="w-8 h-1 bg-gray-600 rounded"></div>
                  <div className="w-8 h-1 bg-gray-600 rounded"></div>
                  <div className="w-8 h-1 bg-gray-600 rounded"></div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )

    case 'ConfigProvider':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">配置提供者示例</Typography>
            <div className="border border-gray-200 rounded-lg p-3 bg-blue-50">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm font-medium">主题配置</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded"></div>
                  <div className="w-8 h-8 bg-green-500 rounded"></div>
                  <div className="w-8 h-8 bg-purple-500 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'Portal':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">传送门组件示例</Typography>
            <div className="relative">
              <div className="border border-dashed border-gray-300 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-2">容器内容</p>
                <div className="w-16 h-16 bg-blue-100 rounded"></div>
              </div>
              <div className="absolute top-8 right-8 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                <p className="text-xs">传送内容</p>
              </div>
            </div>
          </div>
        </div>
      )

    case 'FocusTrap':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">焦点陷阱示例</Typography>
            <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
              <p className="text-xs text-blue-800 mb-3">焦点被限制在这个区域内</p>
              <div className="space-y-2">
                <Button variant="outline" size="sm">按钮 1</Button>
                <Button variant="outline" size="sm">按钮 2</Button>
                <Button variant="primary" size="sm">确认</Button>
              </div>
            </div>
          </div>
        </div>
      )

    case 'FocusScope':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">焦点作用域示例</Typography>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <p className="text-xs text-gray-600 mb-3">焦点管理区域</p>
              <div className="flex space-x-2">
                <input type="text" placeholder="输入框1" className="px-2 py-1 border rounded text-sm" />
                <input type="text" placeholder="输入框2" className="px-2 py-1 border rounded text-sm" />
              </div>
            </div>
          </div>
        </div>
      )

    case 'ScrollLock':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">滚动锁定示例</Typography>
            <div className="relative">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-2">背景内容（已锁定滚动）</p>
                <div className="space-y-1">
                  <div className="h-2 bg-gray-300 rounded"></div>
                  <div className="h-2 bg-gray-300 rounded"></div>
                  <div className="h-2 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="absolute inset-0 bg-white bg-opacity-90 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2"></div>
                  <p className="text-xs text-gray-700">滚动已锁定</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'DismissableLayer':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">可关闭层示例</Typography>
            <div className="relative">
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold mb-1">可关闭组件</h4>
                    <p className="text-xs text-gray-600">点击外部区域可关闭</p>
                  </div>
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'VisuallyHidden':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">视觉隐藏示例</Typography>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm mb-2">可见内容</p>
              <div className="sr-only bg-yellow-100 p-2 rounded">
                <p className="text-xs">屏幕阅读器可读但视觉隐藏的内容</p>
              </div>
              <div className="mt-2 p-2 bg-gray-100 rounded">
                <span className="text-xs text-gray-600">✅ 此组件包含隐藏的可访问性内容</span>
              </div>
            </div>
          </div>
        </div>
      )

    case 'Chart':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">图表组件示例</Typography>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-end justify-between h-24">
                  <div className="w-6 bg-blue-500 rounded-t" style={{ height: '60%' }}></div>
                  <div className="w-6 bg-blue-500 rounded-t" style={{ height: '80%' }}></div>
                  <div className="w-6 bg-blue-500 rounded-t" style={{ height: '40%' }}></div>
                  <div className="w-6 bg-blue-500 rounded-t" style={{ height: '90%' }}></div>
                  <div className="w-6 bg-blue-500 rounded-t" style={{ height: '70%' }}></div>
                  <div className="w-6 bg-blue-500 rounded-t" style={{ height: '50%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1月</span>
                  <span>2月</span>
                  <span>3月</span>
                  <span>4月</span>
                  <span>5月</span>
                  <span>6月</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'BarChart':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">柱状图示例</Typography>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-end space-x-2 h-20">
                  <div className="flex-1 bg-green-500 rounded-t" style={{ height: '75%' }}></div>
                  <div className="flex-1 bg-green-500 rounded-t" style={{ height: '50%' }}></div>
                  <div className="flex-1 bg-green-500 rounded-t" style={{ height: '90%' }}></div>
                  <div className="flex-1 bg-green-500 rounded-t" style={{ height: '60%' }}></div>
                  <div className="flex-1 bg-green-500 rounded-t" style={{ height: '85%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>A</span>
                  <span>B</span>
                  <span>C</span>
                  <span>D</span>
                  <span>E</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'LineChart':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">折线图示例</Typography>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="relative h-24">
                <svg className="w-full h-full">
                  <polyline
                    points="10,60 40,30 70,50 100,20 130,40 160,25"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="10" cy="60" r="3" fill="#3b82f6" />
                  <circle cx="40" cy="30" r="3" fill="#3b82f6" />
                  <circle cx="70" cy="50" r="3" fill="#3b82f6" />
                  <circle cx="100" cy="20" r="3" fill="#3b82f6" />
                  <circle cx="130" cy="40" r="3" fill="#3b82f6" />
                  <circle cx="160" cy="25" r="3" fill="#3b82f6" />
                </svg>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>周一</span>
                <span>周二</span>
                <span>周三</span>
                <span>周四</span>
                <span>周五</span>
                <span>周六</span>
              </div>
            </div>
          </div>
        </div>
      )

    case 'PieChart':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">饼图示例</Typography>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-full"></div>
                  <div className="absolute inset-0 bg-green-500 rounded-full" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 50%)' }}></div>
                  <div className="absolute inset-0 bg-yellow-500 rounded-full" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' }}></div>
                  <div className="absolute inset-0 bg-purple-500 rounded-full" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 0 100%, 0 0)' }}></div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-xs">产品A (30%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-xs">产品B (25%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-xs">产品C (25%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span className="text-xs">产品D (20%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'Gauge':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">仪表盘示例</Typography>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-center">
                <div className="relative w-24 h-12">
                  <div className="absolute inset-0 bg-gray-200 rounded-t-full"></div>
                  <div className="absolute inset-0 bg-blue-500 rounded-t-full" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 30%, 0 100%)' }}></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-center mt-2">
                <p className="text-lg font-bold text-blue-600">75%</p>
                <p className="text-xs text-gray-500">完成度</p>
              </div>
            </div>
          </div>
        </div>
      )

    case 'Stat':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">统计数字示例</Typography>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">1,234</div>
                <div className="text-xs text-gray-500">总用户</div>
                <div className="text-xs text-green-600">↑ 12%</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">89.3%</div>
                <div className="text-xs text-gray-500">转化率</div>
                <div className="text-xs text-green-600">↑ 3.2%</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-600">456</div>
                <div className="text-xs text-gray-500">订单数</div>
                <div className="text-xs text-red-600">↓ 2.1%</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-2xl font-bold text-orange-600">¥12.5K</div>
                <div className="text-xs text-gray-500">收入</div>
                <div className="text-xs text-green-600">↑ 8.7%</div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'Textarea':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">文本域组件示例</Typography>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-700">多行文本输入</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none"
                  rows={3}
                  placeholder="请输入多行文本内容..."
                  defaultValue=""
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">固定高度文本域</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows={4}
                  placeholder="这是固定高度的文本域..."
                  defaultValue="这是已经输入的示例文本内容，展示了文本域的基本使用方式。"
                />
              </div>
            </div>
          </div>
        </div>
      )

    case 'Combobox':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">组合框组件示例</Typography>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-700">搜索并选择</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="输入搜索关键词..."
                    defaultValue="Re"
                  />
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-10">
                    <div className="p-2">
                      <div className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer">React</div>
                      <div className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer">Redux</div>
                      <div className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer">Router</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'SearchInput':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">搜索输入框示例</Typography>
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
                <input
                  type="search"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="搜索组件..."
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
                <input
                  type="search"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="搜索文档..."
                  defaultValue="React"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button className="text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'Form':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">表单容器示例</Typography>
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                  <Input placeholder="请输入用户名" defaultValue="" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                  <Input placeholder="请输入邮箱" type="email" defaultValue="" />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                  <label className="text-sm text-gray-700">我同意服务条款</label>
                </div>
                <div className="flex space-x-3 pt-2">
                  <Button variant="primary" size="sm">提交</Button>
                  <Button variant="outline" size="sm">重置</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'FormField':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">表单字段组件示例</Typography>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">必填字段 *</label>
                <Input placeholder="这是必填字段" className="border-red-300" defaultValue="" />
                <p className="text-xs text-red-600">此字段为必填项</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">带帮助信息</label>
                <Input placeholder="输入内容" defaultValue="" />
                <p className="text-xs text-gray-500">请输入有效的格式，例如：user@example.com</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">错误状态</label>
                <Input placeholder="输入内容" className="border-red-500" defaultValue="无效格式" />
                <p className="text-xs text-red-600">输入格式不正确，请重新输入</p>
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

    case 'ThemeToggle':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">主题切换组件示例</Typography>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                <span className="text-sm font-medium">浅色主题</span>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-white border-2 border-gray-300">
                  <span className="inline-block h-5 w-5 transform rounded-full bg-white border-2 border-gray-300 translate-x-0"></span>
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800 text-white rounded-lg">
                <span className="text-sm font-medium">深色主题</span>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 border-2 border-blue-600">
                  <span className="inline-block h-5 w-5 transform rounded-full bg-white border-2 border-blue-600 translate-x-5"></span>
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                <span className="text-sm font-medium">自动主题</span>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-purple-500">
                  <span className="inline-block h-5 w-5 transform rounded-full bg-white border-2 border-purple-500 translate-x-2"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )

    case 'Notification':
      return (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Typography variant="body" className="text-xs text-muted-foreground">通知组件示例</Typography>
            <div className="space-y-3">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="text-blue-500 text-lg">📢</span>
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="text-sm font-semibold text-blue-800">信息通知</h4>
                    <p className="text-sm text-blue-700 mt-1">您有新的系统更新可用</p>
                    <div className="mt-2 flex space-x-2">
                      <button className="text-xs text-blue-600 hover:text-blue-800 underline">立即更新</button>
                      <button className="text-xs text-gray-600 hover:text-gray-800">稍后提醒</button>
                    </div>
                  </div>
                  <button className="ml-3 text-gray-400 hover:text-gray-600">✕</button>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="text-green-500 text-lg">✅</span>
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="text-sm font-semibold text-green-800">成功通知</h4>
                    <p className="text-sm text-green-700 mt-1">文件上传成功完成</p>
                    <div className="mt-2 flex space-x-2">
                      <button className="text-xs text-green-600 hover:text-green-800 underline">查看文件</button>
                      <button className="text-xs text-gray-600 hover:text-gray-800">关闭</button>
                    </div>
                  </div>
                  <button className="ml-3 text-gray-400 hover:text-gray-600">✕</button>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="text-red-500 text-lg">⚠️</span>
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="text-sm font-semibold text-red-800">警告通知</h4>
                    <p className="text-sm text-red-700 mt-1">您的登录会话即将过期</p>
                    <div className="mt-2 flex space-x-2">
                      <button className="text-xs text-red-600 hover:text-red-800 underline">续期登录</button>
                      <button className="text-xs text-gray-600 hover:text-gray-800">退出</button>
                    </div>
                  </div>
                  <button className="ml-3 text-gray-400 hover:text-gray-600">✕</button>
                </div>
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
      <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-gray-100/50">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center border border-primary/20">
              <span className="text-primary font-bold text-xl">
                {component.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl text-gray-900">{component.name}</h3>
              <Badge variant="outline" className="mt-2 text-xs">
                {component.category}
              </Badge>
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
      </CardHeader>

      <CardContent className="pt-0">
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
                <Badge variant="outline" className="text-xs">
                  {variants.length} 个变体
                </Badge>
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
      </CardContent>
    </Card>
  )
}