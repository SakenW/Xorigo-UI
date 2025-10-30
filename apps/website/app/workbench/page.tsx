/**
 * 增强的 Workbench 页面 - 服务器端组件
 * 包含丰富的头部信息、统计展示和视觉优化
 */

import { WorkbenchClient } from './workbench-client'
import { DevelopmentSecurityMonitor } from '@/components/development-security-monitor'

/**
 * Workbench 服务器端页面
 * 简化版本，移除重复的头部内容，专注于工作台功能
 */
export default function WorkbenchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      {/* 开发环境安全监控 */}
      <DevelopmentSecurityMonitor />

      {/* 客户端交互区域 - 包含导航和所有功能 */}
      <WorkbenchClient />
    </div>
  )
}