'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Button,
  Card,
  Input,
  Textarea,
  Switch,
  Checkbox,
  Badge,
  Alert,
  Spinner,
  Progress,
  Divider
} from '@xorigo-ui/core'
import { useSevenAxisTheme } from '@xorigo-ui/core'

interface ThemePreviewProps {
  recipeId?: string
  isExpanded?: boolean
  onToggleExpanded?: () => void
}

export function ThemePreview({
  recipeId,
  isExpanded = false,
  onToggleExpanded
}: ThemePreviewProps) {
  const { theme, currentRecipe, applyRecipe } = useSevenAxisTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subscribe: false
  })

  // 应用主题
  const handleApplyTheme = async () => {
    if (!recipeId) return

    setIsLoading(true)
    try {
      await applyRecipe(recipeId)
    } catch (error) {
      console.error('应用主题失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 表单处理
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <motion.div
      className={`w-full ${isExpanded ? 'max-w-6xl' : 'max-w-4xl'} mx-auto`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* 预览头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            🎨 主题预览
          </h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            查看主题在实际组件中的效果
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onToggleExpanded}
          >
            {isExpanded ? '收起' : '展开'}预览
          </Button>

          {recipeId && (
            <Button
              onClick={handleApplyTheme}
              disabled={isLoading || currentRecipe?.id === recipeId}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  应用中...
                </>
              ) : currentRecipe?.id === recipeId ? (
                '当前主题'
              ) : (
                '应用主题'
              )}
            </Button>
          )}
        </div>
      </div>

      {/* 预览网格 */}
      <div className={`grid ${isExpanded ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>

        {/* 第一列：基础组件 */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* 按钮组件展示 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              按钮组件
            </h3>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="solid" size="sm">
                  主要按钮
                </Button>
                <Button variant="outline" size="sm">
                  次要按钮
                </Button>
                <Button variant="ghost" size="sm">
                  幽灵按钮
                </Button>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="solid" size="md">
                  标准尺寸
                </Button>
                <Button variant="outline" size="lg">
                  大尺寸
                </Button>
              </div>

              <div className="flex gap-3">
                <Button variant="solid" disabled>
                  禁用状态
                </Button>
                <Button variant="outline" loading>
                  加载中
                </Button>
              </div>
            </div>
          </Card>

          {/* 表单组件展示 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              表单组件
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  文本输入
                </label>
                <Input
                  placeholder="请输入内容..."
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  leftIcon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  邮箱输入
                </label>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  多行文本
                </label>
                <Textarea
                  placeholder="请输入详细描述..."
                  rows={3}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.subscribe}
                  onCheckedChange={(checked) => handleInputChange('subscribe', checked)}
                />
                <label className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  订阅邮件通知
                </label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  checked={true}
                  readOnly
                />
                <label className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  我已阅读并同意服务条款
                </label>
              </div>
            </div>
          </Card>

          {/* 标签和徽章 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              标签和徽章
            </h3>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="solid">默认徽章</Badge>
                <Badge variant="primary">主要徽章</Badge>
                <Badge variant="success">成功徽章</Badge>
                <Badge variant="warning">警告徽章</Badge>
                <Badge variant="danger">危险徽章</Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">边框徽章</Badge>
                <Badge variant="ghost">幽灵徽章</Badge>
                <Badge size="sm">小尺寸</Badge>
                <Badge size="lg">大尺寸</Badge>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 第二列：反馈和进度组件 */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* 反馈组件 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              反馈组件
            </h3>

            <div className="space-y-4">
              <Alert variant="info" title="信息提示">
                这是一个信息提示消息，用于显示一般性信息。
              </Alert>

              <Alert variant="success" title="操作成功">
                恭喜！您的操作已成功完成。
              </Alert>

              <Alert variant="warning" title="注意提醒">
                请注意，此操作可能需要一些时间来完成。
              </Alert>

              <Alert variant="danger" title="错误提示">
                抱歉，操作失败。请检查您的输入后重试。
              </Alert>
            </div>
          </Card>

          {/* 进度和加载组件 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              进度和加载
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    上传进度
                  </span>
                  <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                    75%
                  </span>
                </div>
                <Progress value={75} />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    处理进度
                  </span>
                  <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                    45%
                  </span>
                </div>
                <Progress value={45} variant="success" />
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                    加载指示器
                  </p>
                  <div className="flex gap-3">
                    <Spinner size="sm" />
                    <Spinner size="md" />
                    <Spinner size="lg" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 分隔线和布局 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              布局组件
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-lg border" style={{
                backgroundColor: 'var(--color-surface-secondary)',
                borderColor: 'var(--color-border-default)'
              }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  卡片容器
                </h4>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  这是一个卡片容器，用于组织和展示相关内容。
                </p>
              </div>

              <Divider />

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded text-center" style={{
                  backgroundColor: 'var(--color-primary-100)',
                  color: 'var(--color-primary-700)'
                }}>
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-xs">完成项</div>
                </div>
                <div className="p-3 rounded text-center" style={{
                  backgroundColor: 'var(--color-accent-100)',
                  color: 'var(--color-accent-700)'
                }}>
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-xs">进行中</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* 主题信息面板 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="mt-6 p-6 rounded-lg border"
            style={{
              backgroundColor: 'var(--color-surface-tertiary)',
              borderColor: 'var(--color-border-default)'
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              主题信息
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  当前主题
                </h4>
                <p className="font-mono text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  {currentRecipe?.id || '未知'}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  预览主题
                </h4>
                <p className="font-mono text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  {recipeId || '无'}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  主题状态
                </h4>
                <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  {currentRecipe?.id === recipeId ? '✅ 已应用' : '🔄 待应用'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ThemePreview