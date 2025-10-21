/**
 * 增强的 Workbench 页面 - 服务器端组件
 * 包含丰富的头部信息、统计展示和视觉优化
 */

import { WorkbenchClient } from './workbench-client'
import { WorkbenchHeader } from './workbench-header'
import { DevelopmentSecurityMonitor } from '@/components/development-security-monitor'

/**
 * Workbench 服务器端页面
 * 增强版本包含详细的头部信息和统计数据
 */
export default function WorkbenchPage() {
  const buildTime = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      {/* 开发环境安全监控 */}
      <DevelopmentSecurityMonitor />

      {/* 客户端渲染的动画头部 */}
      <WorkbenchHeader buildTime={buildTime} />

      {/* 客户端交互区域 */}
      <WorkbenchClient />
    </div>
  )
}