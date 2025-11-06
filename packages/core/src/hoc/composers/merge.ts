/**
 * @fileoverview mergeProps HOC - 属性合并策略
 * @description 提供多种属性合并策略和智能属性合并功能
 */

import React, { ComponentType } from 'react'
import { HOC, PropsMergeStrategy } from '../types'
import { MERGE_STRATEGIES } from './compose'

/**
 * 属性冲突解决策略
 */
export interface ConflictResolutionStrategy {
  /**
   * 属性名称映射
   */
  map?: Record<string, string>

  /**
   * 属性别名
   */
  aliases?: Record<string, string>

  /**
   * 忽略的属性
   */
  omit?: string[]

  /**
   * 只保留的属性
   */
  pick?: string[]

  /**
   * 重命名的属性
   */
  rename?: Record<string, string>

  /**
   * 自定义转换函数
   */
  transform?: (value: any, key: string, props: Record<string, any>) => any
}

/**
 * 合并配置接口
 */
export interface MergeConfig {
  strategy?: PropsMergeStrategy
  conflictResolution?: ConflictResolutionStrategy
  deepMerge?: boolean
  filterFalsy?: boolean
  customMerger?: (ownProps: any, hocProps: any, key: string) => any
}

/**
 * 默认冲突解决策略
 */
const DEFAULT_CONFLICT_RESOLUTION: Required<ConflictResolutionStrategy> = {
  map: {},
  aliases: {},
  omit: [],
  pick: [],
  rename: {},
  transform: (value) => value,
}

/**
 * 深度合并对象
 */
function deepMerge(target: any, source: any): any {
  if (typeof target !== 'object' || target === null) return source
  if (typeof source !== 'object' || source === null) return source

  const result = Array.isArray(target) ? [...target] : { ...target }

  for (const [key, value] of Object.entries(source)) {
    if (Array.isArray(value)) {
      result[key] = value.map(item =>
        typeof item === 'object' && item !== null
          ? deepMerge({}, item)
          : item
      )
    } else if (typeof value === 'object' && value !== null) {
      result[key] = deepMerge(target[key] || {}, value)
    } else {
      result[key] = value
    }
  }

  return result
}

/**
 * 应用冲突解决策略
 */
function applyConflictResolution(
  props: Record<string, any>,
  resolution: Required<ConflictResolutionStrategy>
): Record<string, any> {
  let processed = { ...props }

  // 1. 处理pick（只保留指定的属性）
  if (resolution.pick.length > 0) {
    const picked: Record<string, any> = {}
    resolution.pick.forEach(key => {
      if (key in processed) {
        picked[key] = processed[key]
      }
    })
    processed = picked
  }

  // 2. 处理omit（忽略指定的属性）
  if (resolution.omit.length > 0) {
    resolution.omit.forEach(key => {
      delete processed[key]
    })
  }

  // 3. 处理rename（重命名属性）
  if (Object.keys(resolution.rename).length > 0) {
    const renamed: Record<string, any> = {}
    Object.entries(resolution.rename).forEach(([oldName, newName]) => {
      if (oldName in processed) {
        renamed[newName] = processed[oldName]
      }
    })
    processed = { ...processed, ...renamed }
  }

  // 4. 处理aliases（别名映射）
  if (Object.keys(resolution.aliases).length > 0) {
    const aliased: Record<string, any> = {}
    Object.entries(resolution.aliases).forEach(([alias, original]) => {
      if (original in processed) {
        aliased[alias] = processed[original]
      }
    })
    processed = { ...processed, ...aliased }
  }

  // 5. 应用转换函数
  if (resolution.transform) {
    Object.entries(processed).forEach(([key, value]) => {
      processed[key] = resolution.transform(value, key, processed)
    })
  }

  return processed
}

/**
 * 智能属性合并
 */
function smartMerge(
  ownProps: Record<string, any>,
  hocProps: Record<string, any>,
  config: MergeConfig
): Record<string, any> {
  const {
    strategy = 'override',
    conflictResolution,
    deepMerge = false,
    filterFalsy = false,
    customMerger,
  } = config

  // 解析冲突解决策略
  const resolution = {
    ...DEFAULT_CONFLICT_RESOLUTION,
    ...conflictResolution,
  }

  // 预处理属性
  let processedOwnProps = applyConflictResolution(ownProps, resolution)
  let processedHocProps = applyConflictResolution(hocProps, resolution)

  // 过滤虚值
  if (filterFalsy) {
    processedOwnProps = Object.fromEntries(
      Object.entries(processedOwnProps).filter(([_, value]) => value !== undefined && value !== null)
    )
    processedHocProps = Object.fromEntries(
      Object.entries(processedHocProps).filter(([_, value]) => value !== undefined && value !== null)
    )
  }

  // 执行合并
  let merged: Record<string, any>

  if (customMerger) {
    // 自定义合并器
    merged = { ...processedOwnProps }
    Object.entries(processedHocProps).forEach(([key, hocValue]) => {
      merged[key] = customMerger(processedOwnProps[key], hocValue, key)
    })
  } else if (strategy === 'custom') {
    throw new Error('Custom merge strategy must provide customMerger')
  } else if (strategy === 'merge' && deepMerge) {
    // 深度合并
    merged = deepMerge(processedOwnProps, processedHocProps)
  } else {
    // 标准合并策略
    const mergeFunction = MERGE_STRATEGIES[strategy]
    merged = mergeFunction(processedOwnProps, processedHocProps)
  }

  return merged
}

/**
 * withMergeProps HOC - 提供属性合并功能
 *
 * @param config 合并配置
 * @returns HOC函数
 *
 * @example
 * ```tsx
 * const MergedButton = withMergeProps({
 *   strategy: 'merge',
 *   deepMerge: true,
 *   conflictResolution: {
 *     omit: ['className'],
 *     rename: { size: 'buttonSize' }
 *   }
 * })(BaseButton)
 * ```
 */
export function withMergeProps<T extends Record<string, any> = {}>(
  config: MergeConfig = {}
): HOC<T, T> {
  return function(Component: ComponentType<T>) {
    const displayName = `withMergeProps(${Component.displayName || Component.name || 'Component'})`

    const MergedComponent = React.forwardRef<any, T>((props, ref) => {
      // 执行智能合并
      const mergedProps = smartMerge({}, props, config)

      return <Component ref={ref} {...mergedProps} />
    })

    MergedComponent.displayName = displayName

    return MergedComponent
  }
}

/**
 * 预定义合并策略
 */
export const mergeConfigs = {
  /**
   * 样式类合并
   */
  classNameMerge: {
    strategy: 'concatenate' as PropsMergeStrategy,
    conflictResolution: {
      aliases: { class: 'className' },
      omit: ['style'],
    },
  } as MergeConfig,

  /**
   * 事件处理合并
   */
  eventMerge: {
    strategy: 'custom' as PropsMergeStrategy,
    customMerger: (ownValue: any, hocValue: any, key: string) => {
      if (key.startsWith('on') && typeof ownValue === 'function' && typeof hocValue === 'function') {
        return (...args: any[]) => {
          ownValue(...args)
          hocValue(...args)
        }
      }
      return hocValue || ownValue
    },
  } as MergeConfig,

  /**
   * 深度对象合并
   */
  deepObjectMerge: {
    strategy: 'merge' as PropsMergeStrategy,
    deepMerge: true,
    filterFalsy: true,
  } as MergeConfig,

  /**
   * 样式合并
   */
  styleMerge: {
    strategy: 'merge' as PropsMergeStrategy,
    conflictResolution: {
      pick: ['style'],
    },
    deepMerge: true,
  } as MergeConfig,
}

/**
 * 链式合并工具
 */
export function createChainMerger(configs: MergeConfig[]) {
  return function mergeChain(ownProps: Record<string, any>, hocProps: Record<string, any>) {
    let result = { ...ownProps }

    configs.forEach(config => {
      result = smartMerge(result, hocProps, config)
    })

    return result
  }
}

export default withMergeProps
