/**
 * Workbench Module - 整合Gallery+Playground的统一工作台
 * 遵循组件源规则：所有UI组件来自@xorigo-ui/core
 */

'use client'

import { useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Suspense } from 'react'
import { WorkbenchProvider } from '@/components/workbench/workbench-context'
import { ModeSwitcher } from '@/components/workbench/shared/mode-switcher'
import type { ViewMode } from '@/components/workbench/workbench-types'

/**
 * Workbench Gallery Mode 组件
 */
import { WorkbenchGalleryServer } from '@/components/workbench/gallery-mode/workbench-gallery-server'

function GalleryMode() {
  return <WorkbenchGalleryServer />
}

/**
 * Workbench Editor Mode 组件
 */
import { WorkbenchEditorServer } from '@/components/workbench/editor-mode/workbench-editor-server'

function EditorMode() {
  return <WorkbenchEditorServer />
}

/**
 * Workbench Split Mode 组件 - 左右分屏显示Gallery和Editor
 */
function SplitMode() {
  return (
    <div className="flex h-full">
      {/* 左侧：画廊浏览 */}
      <div className="w-1/2 border-r border-border overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-shrink-0 p-4 border-b border-border bg-card">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              🎨 组件画廊
              <Badge variant="secondary" className="text-xs">选择组件</Badge>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              浏览和选择要编辑的组件配方
            </p>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="p-4">
              <WorkbenchGalleryServer />
            </div>
          </div>
        </div>
      </div>

      {/* 右侧：代码编辑器 */}
      <div className="w-1/2 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-shrink-0 p-4 border-b border-border bg-card">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              ✏️ 代码编辑器
              <Badge variant="secondary" className="text-xs">实时预览</Badge>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              编辑选中的组件并实时预览效果
            </p>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="p-4">
              <WorkbenchEditorServer />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Workbench 主页面组件
 */
function WorkbenchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // 从 URL 参数获取初始模式
  const initialMode = (searchParams.get('mode') as ViewMode) || 'gallery'
  const [currentMode, setCurrentMode] = useState<ViewMode>(initialMode)

  // 模式切换处理
  const handleModeChange = useCallback((mode: ViewMode) => {
    setCurrentMode(mode)

    // 更新 URL 参数
    const params = new URLSearchParams(searchParams.toString())
    if (mode === 'gallery') {
      params.delete('mode')
    } else {
      params.set('mode', mode)
    }

    const newUrl = `/workbench${params.toString() ? `?${params.toString()}` : ''}`
    router.replace(newUrl, { scroll: false })
  }, [searchParams, router])

  return (
    <WorkbenchProvider initialMode={initialMode}>
      <div className="min-h-screen bg-background flex flex-col">
        {/* 页面头部 */}
        <header className="border-b bg-card flex-shrink-0">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold">Workbench</h1>
                <Badge variant="outline">Beta</Badge>
                <Badge variant="secondary" className="text-xs">
                  整合 Gallery + Playground
                </Badge>
              </div>

              <ModeSwitcher
                currentMode={currentMode}
                availableModes={['gallery', 'editor', 'split']}
                onModeChange={handleModeChange}
              />
            </div>

            {/* 模式说明 */}
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                {currentMode === 'gallery' && '🎨 浏览组件库配方，支持搜索和过滤'}
                {currentMode === 'editor' && '✏️ 实时编辑代码并预览效果'}
                {currentMode === 'split' && '📱 画廊和编辑器并排显示'}
              </p>
            </div>
          </div>
        </header>

        {/* 主内容区域 */}
        <div className="flex-1">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">加载 Workbench 中...</p>
                </div>
              </div>
            }
          >
            {currentMode === 'gallery' && <GalleryMode />}
            {currentMode === 'editor' && <EditorMode />}
            {currentMode === 'split' && <SplitMode />}
          </Suspense>
        </div>

        {/* 页面底部 */}
        <footer className="border-t bg-card flex-shrink-0">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Workbench v1.0 - 统一组件工作台</span>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-xs">
                  组件源规则: 100% 合规
                </Badge>
                <span>•</span>
                <span>模式: {currentMode}</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </WorkbenchProvider>
  )
}

/**
 * Workbench 页面 - 默认导出
 */
export default function WorkbenchPage() {
  return <WorkbenchContent />
}