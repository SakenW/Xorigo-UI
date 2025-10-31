/**
 * Workbench 客户端组件 - Phase 2 集成版本
 * 整合实时预览、Monaco编辑器、配方编辑、开发工具和性能优化
 * Phase 2 Workbench集成任务完成版
 */

'use client'

import { IntegratedWorkbench } from '../../src/components/workbench/workbench-integrated'
import { useDevelopmentInit, initializeDevelopmentEnvironment } from '@/app-init'

export function WorkbenchClient() {
  // 初始化开发环境安全检测
  useDevelopmentInit()

  // 全局初始化（只执行一次）
  if (typeof window !== 'undefined') {
    initializeDevelopmentEnvironment()
  }

  return (
    <div className="h-screen">
      <IntegratedWorkbench
        config={{
          initialMode: 'preview',
          autoSave: true,
          autoSaveInterval: 30000,
          livePreview: true,
          enablePerformanceMonitoring: true,
          theme: {
            mode: 'default',
            recipeSupport: true
          },
          layout: {
            direction: 'horizontal',
            sidebarWidth: 256,
            showMinimap: true
          }
        }}
        onStateChange={(state) => {
          console.log('Workbench状态更新:', state)
        }}
        onCodeChange={(code) => {
          console.log('代码更新，长度:', code.length)
        }}
        onSave={(data) => {
          console.log('保存数据:', data)
          // 这里可以实现实际的保存逻辑
        }}
        onError={(error) => {
          console.error('Workbench错误:', error)
        }}
      />
    </div>
  )
}