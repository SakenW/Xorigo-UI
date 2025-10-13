import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Suspense } from 'react'
import { PlaygroundClient } from './playground-client'

// 预设的组件示例 - 静态数据
const componentExamples = [
  {
    id: 'button',
    name: '按钮组件',
    description: '基础按钮组件示例',
    category: 'basic',
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@xorigo-ui/core'

export default function CardExample() {
  return (
    <Card className="max-w-md">
      <img
        src="https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=200&fit=crop"
        alt="示例图片"
        className="w-full h-48 object-cover rounded-t-lg"
      />
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
    id: 'form',
    name: '表单组件',
    description: '表单输入示例',
    category: 'form',
    difficulty: 'intermediate',
    tags: ['表单', '输入', '验证'],
    code: `import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function FormExample() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(\`提交的数据: \${email}, \${password}\`)
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <h3 className="text-lg font-semibold">登录表单</h3>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              邮箱地址
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              密码
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
            />
          </div>
          <Button type="submit" className="w-full">
            登录
          </Button>
        </form>
      </CardContent>
    </Card>
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
  },
  {
    id: 'table',
    name: '表格组件',
    description: '数据表格示例',
    category: 'data',
    difficulty: 'advanced',
    tags: ['表格', '数据', '展示'],
    code: `import { Badge } from '@/components/ui/badge'
import { Button } from '@xorigo-ui/core'

export default function TableExample() {
  const data = [
    { id: 1, name: '张三', role: '开发者', status: '活跃' },
    { id: 2, name: '李四', role: '设计师', status: '活跃' },
    { id: 3, name: '王五', role: '产品经理', status: '离线' },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
              ID
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
              姓名
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
              角色
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
              状态
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {row.id}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {row.name}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {row.role}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                <Badge variant={row.status === '活跃' ? 'default' : 'secondary'}>
                  {row.status}
                </Badge>
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                <Button size="sm" variant="outline">
                  编辑
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}`,
  }
]

const categories = [
  { id: 'all', name: '全部', icon: '🎨' },
  { id: 'basic', name: '基础', icon: '🧱' },
  { id: 'layout', name: '布局', icon: '📐' },
  { id: 'form', name: '表单', icon: '📝' },
  { id: 'feedback', name: '反馈', icon: '💬' },
  { id: 'data', name: '数据', icon: '📊' },
]

/**
 * Playground 服务端组件 - 处理静态内容和数据
 * 交互逻辑委托给客户端组件，支持动态导入优化
 */
export function PlaygroundServer() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 - 纯静态内容 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          组件演练场
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          实时编辑和预览 Xorigo UI 组件，探索组件的各种配置和用法
        </p>
      </div>

      {/* 功能介绍 - 静态内容 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold mb-2">实时编辑</h3>
            <p className="text-gray-600 dark:text-gray-400">
              使用 Monaco 编辑器实时编辑代码，即时查看效果
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-lg font-semibold mb-2">热重载</h3>
            <p className="text-gray-600 dark:text-gray-400">
              代码修改后自动重新渲染，无需手动刷新
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold mb-2">多种示例</h3>
            <p className="text-gray-600 dark:text-gray-400">
              提供不同难度和类别的组件示例供学习参考
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 客户端组件 - 使用 Suspense 包装 */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                演练场加载中...
              </p>
            </div>
          </div>
        }
      >
        <PlaygroundClient
          examples={componentExamples}
          categories={categories}
        />
      </Suspense>
    </div>
  )
}