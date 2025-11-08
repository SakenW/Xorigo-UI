import React, { useState } from 'react'
import {
  Button,
  TextInput,
  EmailInput,
  Card,
  Alert,
  Heading,
  useTheme,
  ThemeBridge
} from '@xorigo-ui/core'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })

  const { theme, updateTheme } = useTheme()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`提交的数据: ${JSON.stringify(formData, null, 2)}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* 头部 */}
        <header className="text-center">
          <Heading level={1}>Xorigo UI 示例项目</Heading>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            演示如何在外部项目中使用Xorigo UI组件库
          </p>
        </header>

        {/* 主题切换演示 */}
        <Card className="p-6">
          <Heading level={2} className="mb-4">主题系统</Heading>
          <div className="flex items-center gap-4">
            <span>当前主题: {theme.mode}</span>
            <Button
              variant="outline"
              onClick={() => updateTheme({
                mode: theme.mode === 'light' ? 'dark' : 'light'
              })}
            >
              切换主题
            </Button>
          </div>
        </Card>

        {/* 表单演示 */}
        <Card className="p-6">
          <Heading level={2} className="mb-4">表单组件演示</Heading>

          <Alert type="info" className="mb-6">
            这是使用Xorigo UI构建的示例表单，所有组件都支持主题切换和完整的功能。
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
              label="姓名"
              value={formData.name}
              onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
              placeholder="请输入您的姓名"
              required
            />

            <EmailInput
              label="邮箱"
              value={formData.email}
              onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
              placeholder="请输入您的邮箱"
              required
            />

            <div className="flex gap-4">
              <Button type="submit" variant="primary">
                提交
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({ name: '', email: '' })}
              >
                重置
              </Button>
            </div>
          </form>
        </Card>

        {/* 组件展示 */}
        <Card className="p-6">
          <Heading level={2} className="mb-4">按钮样式展示</Heading>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="text">Text</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

function AppWithTheme() {
  return (
    <ThemeBridge>
      <App />
    </ThemeBridge>
  )
}

export default AppWithTheme