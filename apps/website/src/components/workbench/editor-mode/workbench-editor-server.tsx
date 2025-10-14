/**
 * Workbench Editor Mode 服务端组件
 *
 * 整合 Playground 功能，提供组件演练场
 * 遵循组件源规则：所有UI组件来自@xorigo-ui/core
 */

import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Suspense } from 'react'
import { WorkbenchEditorClient } from './workbench-editor-client'

// 组件示例数据 - 静态数据，来自 Playground
// 注意：这些只是代码字符串，不包含组件定义
const componentExamples = [
  {
    id: 'button',
    name: '按钮组件',
    description: '基础按钮组件示例',
    category: 'base',
    difficulty: 'beginner',
    tags: ['UI', '交互', '基础'],
    code: `import { Button } from '@xorigo-ui/core'

export default function ButtonExample() {
  return (
    <div className="space-x-4">
      <Button variant="primary">主要按钮</Button>
      <Button variant="secondary">次要按钮</Button>
      <Button variant="outline">边框按钮</Button>
      <Button variant="ghost">幽灵按钮</Button>
    </div>
  )
}`,
  },
  {
    id: 'card',
    name: '卡片组件',
    description: '卡片布局示例',
    category: 'layout',
    difficulty: 'beginner',
    tags: ['布局', '容器', '展示'],
    code: `import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'

export default function CardExample() {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <h3 className="text-lg font-semibold">卡片标题</h3>
        <Badge variant="default">示例</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          这是一个卡片组件的示例内容，展示了卡片的完整功能。
        </p>
        <Button>查看详情</Button>
      </CardContent>
    </Card>
  )
}`,
  },
  {
    id: 'input',
    name: '输入框组件',
    description: '表单输入示例',
    category: 'form',
    difficulty: 'beginner',
    tags: ['表单', '输入', '验证'],
    code: `import { Input } from '@xorigo-ui/core'
import { useState } from 'react'

export default function InputExample() {
  const [value, setValue] = useState('')

  return (
    <div className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-2">
          基础输入框
        </label>
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="请输入内容"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">
          密码输入框
        </label>
        <Input
          type="password"
          placeholder="请输入密码"
        />
      </div>
    </div>
  )
}`,
  },
  {
    id: 'badge',
    name: '徽章组件',
    description: '标签和徽章示例',
    category: 'base',
    difficulty: 'beginner',
    tags: ['UI', '标签', '展示'],
    code: `import { Badge } from '@xorigo-ui/core'

export default function BadgeExample() {
  return (
    <div className="space-x-2 space-y-2">
      <Badge variant="default">默认徽章</Badge>
      <Badge variant="secondary">次要徽章</Badge>
      <Badge variant="outline">边框徽章</Badge>
      <Badge variant="destructive">危险徽章</Badge>
    </div>
  )
}`,
  },
  {
    id: 'modal',
    name: '模态框组件',
    description: '弹窗交互示例',
    category: 'feedback',
    difficulty: 'intermediate',
    tags: ['弹窗', '交互', '反馈'],
    code: `import { Button } from '@xorigo-ui/core'
import { useState } from 'react'

export default function ModalExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="text-center">
      <Button onClick={() => setIsOpen(true)}>
        打开模态框
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">模态框标题</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              这是一个模态框的内容区域。
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                取消
              </Button>
              <Button onClick={() => setIsOpen(false)}>
                确认
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}`,
  }
]

// 分类数据
const categories = [
  { id: 'all', name: '全部', icon: '🎨' },
  { id: 'base', name: '基础', icon: '🧱' },
  { id: 'layout', name: '布局', icon: '📐' },
  { id: 'form', name: '表单', icon: '📝' },
  { id: 'feedback', name: '反馈', icon: '💬' },
]

/**
 * Workbench Editor Mode 服务端组件
 * 处理静态内容和数据，交互逻辑委托给客户端组件
 */
export function WorkbenchEditorServer() {
  return (
    <div className="min-h-screen bg-background">
      {/* 页面标题 - 纯静态内容 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          Workbench Editor
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          实时编辑和预览 Xorigo UI 组件，从 Gallery 跳转或选择预设示例
        </p>

        {/* 功能统计 */}
        <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span>{componentExamples.length} 个示例</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>Monaco 编辑器</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full" />
            <span>实时预览</span>
          </div>
        </div>
      </div>

      {/* 功能介绍 - 静态内容 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold mb-2">实时编辑</h3>
            <p className="text-muted-foreground">
              使用 Monaco 编辑器实时编辑代码，即时查看效果
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-lg font-semibold mb-2">热重载</h3>
            <p className="text-muted-foreground">
              代码修改后自动重新渲染，无需手动刷新
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold mb-2">无缝跳转</h3>
            <p className="text-muted-foreground">
              从 Gallery 直接跳转到 Editor，无缝工作流程
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 客户端组件 - 使用 Suspense 包装 */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                编辑器加载中...
              </p>
            </div>
          </div>
        }
      >
        <WorkbenchEditorClient
          examples={componentExamples}
          categories={categories}
        />
      </Suspense>
    </div>
  )
}