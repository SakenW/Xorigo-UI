import dynamic from 'next/dynamic'
import React from 'react'
import { ComponentType } from 'react'
import { LoadingSpinner } from '@/src/components/loading'

/**
 * 动态导入配置选项
 */
interface DynamicImportOptions {
  ssr?: boolean
  loading?: React.ComponentType
  loadingText?: string
}

/**
 * 创建动态导入的 HOC
 * 提供统一的加载状态和配置
 */
export function createDynamicImport<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: DynamicImportOptions = {}
) {
  const {
    ssr = false,
    loading,
    loadingText = "加载中..."
  } = options

  return dynamic(importFn, {
    ssr,
    loading: loading || (() => (
      <LoadingSpinner
        size="lg"
        text={loadingText}
        className="min-h-[200px]"
      />
    ))
  })
}

/**
 * 常用的动态导入配置
 */
export const dynamicImportConfigs = {
  // 编辑器类组件
  editor: {
    ssr: false,
    loadingText: "编辑器加载中..."
  },

  // 图表类组件
  chart: {
    ssr: false,
    loadingText: "图表加载中..."
  },

  // 复杂交互组件
  interactive: {
    ssr: false,
    loadingText: "组件加载中..."
  },

  // 代码编辑器
  codeEditor: {
    ssr: false,
    loadingText: "代码编辑器加载中..."
  },

  // 第三方组件
  thirdParty: {
    ssr: false,
    loadingText: "第三方组件加载中..."
  }
} as const

/**
 * 常用组件的动态导入工厂函数
 */
export const createEditorImport = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) => createDynamicImport(importFn, dynamicImportConfigs.editor)

export const createChartImport = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) => createDynamicImport(importFn, dynamicImportConfigs.chart)

export const createInteractiveImport = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) => createDynamicImport(importFn, dynamicImportConfigs.interactive)

export const createCodeEditorImport = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) => createDynamicImport(importFn, dynamicImportConfigs.codeEditor)

export const createThirdPartyImport = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) => createDynamicImport(importFn, dynamicImportConfigs.thirdParty)