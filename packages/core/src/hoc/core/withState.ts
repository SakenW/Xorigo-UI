/**
 * @fileoverview withState HOC - 状态管理高阶组件
 * @description 为组件提供状态管理功能，支持局部状态、自定义状态和状态持久化
 */

import React, { forwardRef, useState, useEffect, useMemo, useCallback } from 'react'
import { HOC, ComponentType, ComponentState, StateManager } from '../types'

/**
 * 状态配置接口
 */
export interface StateConfig<T = any> {
  initialState?: T | (() => T)
  persistKey?: string
  enablePersistence?: boolean
  enableReset?: boolean
  resetOnPropsChange?: boolean
  customReducers?: Record<string, (state: any, action: any) => any>
}

/**
 * 状态操作接口
 */
export interface StateActions<T> {
  setState: (updater: React.SetStateAction<T>) => void
  reset: () => void
  merge: (updates: Partial<T>) => void
  replace: (newState: T) => void
  [key: string]: (...args: any[]) => void
}

/**
 * 状态上下文接口
 */
export interface StateContextValue<T = ComponentState> {
  state: T
  setState: React.SetStateAction<T>
  actions: StateActions<T>
  stateManager: StateManager<T>
}

/**
 * 状态Hooks配置
 */
export interface StateHooks {
  [key: string]: () => [any, React.Dispatch<React.SetStateAction<any>>]
}

/**
 * withState HOC - 为组件注入状态管理
 *
 * @param config 状态配置选项
 * @returns 高阶组件函数
 *
 * @example
 * ```tsx
 * const StateButton = withState({
 *   initialState: { isLoading: false },
 *   enablePersistence: false
 * })(BaseButton)
 * ```
 */
export function withState<T extends Record<string, any> = {}>(
  config: StateConfig = {}
): HOC<T, T & StateContextValue> {
  return function(Component: ComponentType<T>) {
    const {
      initialState = {},
      persistKey,
      enablePersistence = false,
      enableReset = true,
      resetOnPropsChange = false,
      customReducers = {},
    } = config

    const displayName = config.displayName || `withState(${Component.displayName || Component.name || 'Component'})`

    const StateComponent = forwardRef<any, T & StateContextValue>((props, ref) => {
      const {
        state: propState,
        onStateChange,
        ...componentProps
      } = props

      // 初始化状态
      const getInitialState = () => {
        if (typeof initialState === 'function') {
          return (initialState as () => any)()
        }
        return initialState
      }

      const [internalState, setInternalState] = useState<any>(getInitialState)

      // 持久化处理
      useEffect(() => {
        if (enablePersistence && persistKey) {
          try {
            const saved = localStorage.getItem(persistKey)
            if (saved) {
              setInternalState(JSON.parse(saved))
            }
          } catch (error) {
            console.warn(`Failed to load persisted state for key: ${persistKey}`, error)
          }
        }
      }, [])

      // 状态持久化
      useEffect(() => {
        if (enablePersistence && persistKey) {
          try {
            localStorage.setItem(persistKey, JSON.stringify(internalState))
          } catch (error) {
            console.warn(`Failed to persist state for key: ${persistKey}`, error)
          }
        }
      }, [internalState, persistKey, enablePersistence])

      // props变化时重置状态
      useEffect(() => {
        if (resetOnPropsChange && propState && JSON.stringify(propState) !== JSON.stringify(internalState)) {
          setInternalState(propState)
        }
      }, [propState, resetOnPropsChange])

      // 当前状态（合并props和内部状态）
      const currentState = useMemo(() => {
        return {
          ...internalState,
          ...propState,
        }
      }, [internalState, propState])

      // 状态管理器
      const stateManager = useMemo<StateManager<any>>(() => ({
        state: currentState,
        setState: (updater) => {
          setInternalState(updater)
          if (onStateChange) {
            onStateChange(updater)
          }
        },
        resetState: () => {
          const resetState = getInitialState()
          setInternalState(resetState)
          if (onStateChange) {
            onStateChange(resetState)
          }
        },
      }), [currentState, onStateChange])

      // 状态操作函数
      const actions = useMemo<StateActions<any>>(() => ({
        setState: setInternalState,
        reset: () => {
          const resetState = getInitialState()
          setInternalState(resetState)
        },
        merge: (updates: Partial<any>) => {
          setInternalState((prev: any) => ({ ...prev, ...updates }))
        },
        replace: (newState: any) => {
          setInternalState(newState)
        },
        // 自定义操作
        toggle: (key: string) => {
          setInternalState((prev: any) => ({ ...prev, [key]: !prev[key] }))
        },
        increment: (key: string, amount = 1) => {
          setInternalState((prev: any) => ({ ...prev, [key]: (prev[key] || 0) + amount }))
        },
        decrement: (key: string, amount = 1) => {
          setInternalState((prev: any) => ({ ...prev, [key]: (prev[key] || 0) - amount }))
        },
      }), [])

      // 传递给组件的增强props
      const enhancedProps = {
        ...componentProps,
        state: currentState,
        setState: setInternalState,
        actions,
        stateManager,
      }

      return <Component ref={ref} {...enhancedProps} />
    })

    StateComponent.displayName = displayName

    return StateComponent
  }
}

// 便捷导出 - 无配置版本
export const WithState = withState({})

// 预设状态配置
export const withLoadingState = withState({
  initialState: { isLoading: false },
  persistKey: 'loadingState',
})

export const withErrorState = withState({
  initialState: { isError: false, error: null },
  persistKey: 'errorState',
})

export const withFormState = withState({
  initialState: { isSubmitting: false, isDirty: false, isValid: false },
})

export default withState
