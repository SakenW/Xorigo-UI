/**
 * Workbench 客户端组件 - 全新智能工作台 v2.0
 * 基于ComponentCard优雅设计语言的智能组件搜索、编辑和预览系统
 * 集成开发环境安全检测
 */

'use client'

import { SmartWorkbench } from '../../src/components/workbench/smart-workbench/smart-workbench'
import { useDevelopmentInit, initializeDevelopmentEnvironment } from '@/app-init'

export function WorkbenchClient() {
  // 初始化开发环境安全检测
  useDevelopmentInit()

  // 全局初始化（只执行一次）
  if (typeof window !== 'undefined') {
    initializeDevelopmentEnvironment()
  }

  return <SmartWorkbench />
}