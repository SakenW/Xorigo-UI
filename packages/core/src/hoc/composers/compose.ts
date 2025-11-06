/**
 * @fileoverview compose HOC - HOC组合函数
 * @description 提供强大的HOC组合功能，支持链式调用和属性合并
 */

import React, { ComponentType } from 'react'
import { HOC, PropsMergeStrategy, HOCOptions, ComponentProps } from '../types'

/**
 * Compose选项接口
 */
export interface ComposeOptions {
  strategy?: PropsMergeStrategy
  displayName?: string
  enableMemo?: boolean
  debug?: boolean
}

/**
 * 合并策略函数类型
 */
export type MergeFunction = (
  ownProps: Record<string, any>,
  hocProps: Record<string, any>
) => Record<string, any>

/**
 * 默认属性合并策略
 */
export const MERGE_STRATEGIES: Record<PropsMergeStrategy, MergeFunction> = {
  override: (ownProps, hocProps) => ({ ...ownProps, ...hocProps }),
  merge: (ownProps, hocProps) => {
    const merged: Record<string, any> = { ...ownProps }
    Object.entries(hocProps).forEach(([key, value]) => {
      if (merged[key] && typeof merged[key] === 'object' && typeof value === 'object' && !Array.isArray(merged[key])) {
        merged[key] = { ...merged[key], ...value }
      } else {
        merged[key] = value
      }
    })
    return merged
  },
  concatenate: (ownProps, hocProps) => {
    const merged: Record<string, any> = { ...ownProps }
    Object.entries(hocProps).forEach(([key, value]) => {
      if (Array.isArray(merged[key]) && Array.isArray(value)) {
        merged[key] = [...merged[key], ...value]
      } else if (typeof merged[key] === 'string' && typeof value === 'string') {
        merged[key] = `${merged[key]} ${value}`
      } else {
        merged[key] = value
      }
    })
    return merged
  },
  custom: () => {
    throw new Error('Custom merge strategy must be implemented')
  },
}

/**
 * 组合多个HOC为一个HOC
 *
 * @param hocs 要组合的HOC数组
 * @param options 组合选项
 * @returns 组合后的HOC
 *
 * @example
 * ```tsx
 * const EnhancedButton = compose([
 *   withTheme({ mode: 'dark' }),
 *   withVariant('primary'),
 *   withSize('md')
 * ])(BaseButton)
 * ```
 */
export function compose<T = {}>(
  hocs: HOC[],
  options: ComposeOptions = {}
): HOC<any, any> {
  const {
    strategy = 'override',
    displayName,
    enableMemo = true,
    debug = false,
  } = options

  // 合并策略
  const mergeFunction = MERGE_STRATEGIES[strategy]
  const customMerge = strategy === 'custom' ? options.strategy : undefined

  if (debug) {
    console.log('[compose] Starting composition with', hocs.length, 'HOCs')
    console.log('[compose] Options:', options)
  }

  return function(BaseComponent: ComponentType<any>) {
    // 从右到左组合HOC
    const WrappedComponent = hocs.reduceRight(
      (EnhancedComponent, hoc) => hoc(EnhancedComponent),
      BaseComponent
    )

    // 生成displayName
    const composedDisplayName = displayName || `compose(${[
      'Component',
      ...hocs.map(hoc => {
        const hocStr = hoc.toString()
        const match = hocStr.match(/return function\s+(\w+)|return\s+\((\w+)\)\s*=>|with([A-Z]\w+)/)
        return match?.[1] || match?.[2] || match?.[3] || 'HOC'
      })
    ].join(' → ')})`

    // 创建最终组件
    const FinalComponent = React.forwardRef<any, ComponentProps<typeof WrappedComponent>>(
      (props, ref) => {
        if (debug) {
          console.log('[compose] Rendering composed component with props:', props)
        }

        // 应用合并策略
        const mergedProps = customMerge
          ? customMerge(props, {})
          : mergeFunction(props, {})

        return <WrappedComponent ref={ref} {...mergedProps} />
      }
    )

    FinalComponent.displayName = composedDisplayName

    // 性能优化：React.memo
    if (enableMemo) {
      const MemoizedComponent = React.memo(FinalComponent, (prevProps, nextProps) => {
        if (debug) {
          console.log('[compose] Memo comparison:', { prevProps, nextProps })
        }
        // 简单的浅比较
        return JSON.stringify(prevProps) === JSON.stringify(nextProps)
      })

      MemoizedComponent.displayName = composedDisplayName
      return MemoizedComponent
    }

    return FinalComponent
  }
}

/**
 * 链式组合HOC的便捷方法
 *
 * @param baseComponent 基础组件
 * @returns 链式组合对象
 *
 * @example
 * ```tsx
 * const Button = compose()
 *   .withHOC(withTheme({ mode: 'dark' }))
 *   .withHOC(withVariant('primary'))
 *   .withHOC(withSize('md'))
 *   .apply(BaseButton)
 * ```
 */
export function createComposer<T = {}>() {
  const hocs: HOC[] = []
  const options: ComposeOptions = {}

  return {
    /**
     * 添加HOC到组合链
     */
    withHOC(hoc: HOC, hocOptions?: HOCOptions) {
      hocs.push(hoc)
      if (hocOptions?.displayName) {
        options.displayName = hocOptions.displayName
      }
      return this
    },

    /**
     * 设置组合选项
     */
    withOptions(newOptions: Partial<ComposeOptions>) {
      Object.assign(options, newOptions)
      return this
    },

    /**
     * 应用组合到组件
     */
    apply(Component: ComponentType<T>) {
      return compose(hocs, options)(Component)
    },
  }
}

/**
 * 简化的compose函数，支持直接传入组件进行组合
 *
 * @param component 基础组件
 * @param hocs 要应用的HOC数组
 * @param options 组合选项
 * @returns 增强后的组件
 *
 * @example
 * ```tsx
 * const EnhancedButton = composeHOCs(BaseButton, [
 *   withTheme,
 *   withVariant('primary'),
 *   withSize('md')
 * ])
 * ```
 */
export function composeHOCs<T = {}>(
  component: ComponentType<T>,
  hocs: HOC[],
  options?: ComposeOptions
) {
  return compose(hocs, options)(component)
}

/**
 * 延迟组合HOC
 *
 * @param hocs HOC数组
 * @param options 组合选项
 * @returns 延迟执行的组合函数
 *
 * @example
 * ```tsx
 * const enhance = defer([
 *   withTheme,
 *   withVariant('primary'),
 *   withSize('md')
 * ])
 *
 * const Button = enhance(BaseButton)
 * ```
 */
export function defer<T = {}>(
  hocs: HOC[],
  options?: ComposeOptions
) {
  return function(Component: ComponentType<T>) {
    return compose(hocs, options)(Component)
  }
}

/**
 * 条件性应用HOC
 *
 * @param condition 条件函数
 * @param hoc 要应用的HOC
 * @returns 条件HOC
 *
 * @example
 * ```tsx
 * const ConditionalButton = compose([
 *   withTheme,
 *   when(() => process.env.NODE_ENV === 'development')(
 *     withDebugOverlay
 *   ),
 *   withVariant('primary')
 * ])(BaseButton)
 * ```
 */
export function when<T extends ComponentType<any>>(
  condition: () => boolean,
  hoc: HOC
) {
  return function(Component: ComponentType<any>) {
    if (condition()) {
      return hoc(Component)
    }
    return Component
  }
}

/**
 * 批量应用多个HOC变体
 *
 * @param baseHoc 基础HOC
 * @param variants 变体数组
 * @returns 变体HOC组合
 *
 * @example
 * ```tsx
 * const ButtonVariants = applyVariants(withVariant, [
 *   { name: 'primary', config: { defaultVariant: 'primary' } },
 *   { name: 'secondary', config: { defaultVariant: 'secondary' } },
 *   { name: 'outline', config: { defaultVariant: 'outline' } }
 * ])
 *
 * const PrimaryButton = ButtonVariants.primary(BaseButton)
 * ```
 */
export function applyVariants(
  baseHoc: HOC,
  variants: Array<{ name: string; config?: any }>
) {
  const result: Record<string, HOC> = {}

  variants.forEach(({ name, config }) => {
    result[name] = baseHoc(config || {})
  })

  return result
}

export default compose
