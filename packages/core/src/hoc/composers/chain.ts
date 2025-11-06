/**
 * @fileoverview chain HOC - 链式调用系统
 * @description 提供链式HOC调用和链式组件方法调用功能
 */

import React, { ComponentType, forwardRef, useImperativeHandle, useRef } from 'react'
import { HOC, ComponentProps } from '../types'

/**
 * 链式组件实例接口
 */
export interface ChainInstance {
  /**
   * 调用组件方法
   */
  call: (methodName: string, ...args: any[]) => any

  /**
   * 获取组件实例
   */
  getInstance: () => any

  /**
   * 检查方法是否存在
   */
  hasMethod: (methodName: string) => boolean

  /**
   * 执行链式方法
   */
  chain: (methodName: string, ...args: any[]) => ChainInstance

  /**
   * 批量执行方法
   */
  batch: (methods: Record<string, any[]>) => ChainInstance

  /**
   * 条件执行方法
   */
  when: (condition: boolean, methodName: string, ...args: any[]) => ChainInstance

  /**
   * 等待执行
   */
  wait: (delay: number, methodName: string, ...args: any[]) => Promise<ChainInstance>
}

/**
 * 链式组件配置
 */
export interface ChainConfig {
  /**
   * 自动暴露方法
   */
  autoExpose?: boolean

  /**
   * 暴露方法前缀
   */
  exposePrefix?: string

  /**
   * 暴露方法规则
   */
  exposeRules?: {
    include?: string[]
    exclude?: string[]
    transform?: (name: string) => string
  }

  /**
   * 调试模式
   */
  debug?: boolean
}

/**
 * 链式组件Hook
 */
export function useChainInstance<T = any>(
  componentRef: React.RefObject<any>,
  config: ChainConfig = {}
): ChainInstance {
  const { debug = false } = config

  const call = (methodName: string, ...args: any[]) => {
    if (debug) {
      console.log(`[chain] Calling method: ${methodName}`, args)
    }

    if (!componentRef.current) {
      throw new Error('Component instance not available')
    }

    const method = componentRef.current[methodName]
    if (typeof method !== 'function') {
      throw new Error(`Method ${methodName} not found on component`)
    }

    return method.apply(componentRef.current, args)
  }

  const getInstance = () => {
    return componentRef.current
  }

  const hasMethod = (methodName: string) => {
    return componentRef.current && typeof componentRef.current[methodName] === 'function'
  }

  const chain = (methodName: string, ...args: any[]) => {
    call(methodName, ...args)
    return createChainInstance(componentRef, config)
  }

  const batch = (methods: Record<string, any[]>) => {
    Object.entries(methods).forEach(([methodName, args]) => {
      call(methodName, ...args)
    })
    return createChainInstance(componentRef, config)
  }

  const when = (condition: boolean, methodName: string, ...args: any[]) => {
    if (condition) {
      call(methodName, ...args)
    }
    return createChainInstance(componentRef, config)
  }

  const wait = async (delay: number, methodName: string, ...args: any[]) => {
    await new Promise(resolve => setTimeout(resolve, delay))
    call(methodName, ...args)
    return createChainInstance(componentRef, config)
  }

  return {
    call,
    getInstance,
    hasMethod,
    chain,
    batch,
    when,
    wait,
  }
}

/**
 * 创建链式实例
 */
function createChainInstance<T = any>(
  componentRef: React.RefObject<any>,
  config: ChainConfig = {}
): ChainInstance {
  const { debug = false } = config

  const call = (methodName: string, ...args: any[]) => {
    if (debug) {
      console.log(`[chain] Calling method: ${methodName}`, args)
    }

    if (!componentRef.current) {
      throw new Error('Component instance not available')
    }

    const method = componentRef.current[methodName]
    if (typeof method !== 'function') {
      throw new Error(`Method ${methodName} not found on component`)
    }

    return method.apply(componentRef.current, args)
  }

  const getInstance = () => {
    return componentRef.current
  }

  const hasMethod = (methodName: string) => {
    return componentRef.current && typeof componentRef.current[methodName] === 'function'
  }

  const chain = (methodName: string, ...args: any[]) => {
    call(methodName, ...args)
    return createChainInstance(componentRef, config)
  }

  const batch = (methods: Record<string, any[]>) => {
    Object.entries(methods).forEach(([methodName, args]) => {
      call(methodName, ...args)
    })
    return createChainInstance(componentRef, config)
  }

  const when = (condition: boolean, methodName: string, ...args: any[]) => {
    if (condition) {
      call(methodName, ...args)
    }
    return createChainInstance(componentRef, config)
  }

  const wait = async (delay: number, methodName: string, ...args: any[]) => {
    await new Promise(resolve => setTimeout(resolve, delay))
    call(methodName, ...args)
    return createChainInstance(componentRef, config)
  }

  return {
    call,
    getInstance,
    hasMethod,
    chain,
    batch,
    when,
    wait,
  }
}

/**
 * withChain HOC - 为组件注入链式调用功能
 *
 * @param config 链式配置
 * @returns HOC函数
 *
 * @example
 * ```tsx
 * const ChainButton = withChain({
 *   autoExpose: true,
 *   exposeRules: {
 *     include: ['focus', 'blur', 'click']
 *   }
 * })(BaseButton)
 *
 * const buttonRef = useRef<ChainInstance>()
 * buttonRef.current.chain('focus').wait(1000, 'click')
 * ```
 */
export function withChain<T extends Record<string, any> = {}>(
  config: ChainConfig = {}
): HOC<T, T & { chainInstance: ChainInstance; ref: React.RefObject<any> }> {
  return function(Component: ComponentType<T>) {
    const {
      autoExpose = true,
      exposePrefix = '',
      exposeRules = { include: [], exclude: [] },
      debug = false,
    } = config

    const displayName = `withChain(${Component.displayName || Component.name || 'Component'})`

    const ChainComponent = forwardRef<any, T & { chainInstance: ChainInstance }>((props, ref) => {
      const internalRef = useRef<any>(null)
      const chainInstance = useChainInstance(internalRef, config)

      // 暴露组件方法
      useImperativeHandle(ref, () => internalRef.current, [internalRef.current])

      // 自动暴露方法到链式实例
      useImperativeHandle(
        internalRef,
        () => {
          const instance = internalRef.current || {}
          const instanceProxy: any = {
            ...instance,
            // 添加链式方法
            chain: chainInstance.chain,
            batch: chainInstance.batch,
            when: chainInstance.when,
            wait: chainInstance.wait,
          }

          // 自动暴露组件方法
          if (autoExpose && internalRef.current) {
            const methods = Object.getOwnPropertyNames(internalRef.current)

            methods.forEach(methodName => {
              if (typeof internalRef.current[methodName] === 'function') {
                // 应用暴露规则
                if (exposeRules.include && !exposeRules.include.includes(methodName)) {
                  return
                }

                if (exposeRules.exclude && exposeRules.exclude.includes(methodName)) {
                  return
                }

                // 转换方法名
                let exposedName = methodName
                if (exposePrefix) {
                  exposedName = `${exposePrefix}${exposedName.charAt(0).toUpperCase()}${exposedName.slice(1)}`
                }

                if (exposeRules.transform) {
                  exposedName = exposeRules.transform(exposedName)
                }

                // 添加到实例代理
                instanceProxy[exposedName] = (...args: any[]) => {
                  if (debug) {
                    console.log(`[chain] Exposed method called: ${exposedName}`, args)
                  }
                  return internalRef.current[methodName](...args)
                }
              }
            })
          }

          return instanceProxy
        },
        [internalRef.current, autoExpose, exposePrefix, exposeRules, debug]
      )

      // 传递给组件的增强props
      const enhancedProps = {
        ...props,
        ref: internalRef,
        chainInstance,
      }

      return <Component {...enhancedProps} />
    })

    ChainComponent.displayName = displayName

    return ChainComponent
  }
}

/**
 * 链式操作辅助工具
 */
export class ChainHelper {
  private instance: ChainInstance

  constructor(instance: ChainInstance) {
    this.instance = instance
  }

  /**
   * 添加方法到链
   */
  add(methodName: string, ...args: any[]): ChainHelper {
    this.instance.call(methodName, ...args)
    return this
  }

  /**
   * 条件添加方法
   */
  addIf(condition: boolean, methodName: string, ...args: any[]): ChainHelper {
    if (condition) {
      this.instance.call(methodName, ...args)
    }
    return this
  }

  /**
   * 延迟添加方法
   */
  addAfter(delay: number, methodName: string, ...args: any[]): Promise<ChainHelper> {
    return this.instance.wait(delay, methodName, ...args).then(() => this)
  }

  /**
   * 批量添加方法
   */
  addBatch(methods: Record<string, any[]>): ChainHelper {
    this.instance.batch(methods)
    return this
  }

  /**
   * 执行链
   */
  execute(): ChainInstance {
    return this.instance
  }

  /**
   * 创建新链
   */
  fork(): ChainHelper {
    return new ChainHelper(this.instance)
  }
}

/**
 * 创建链式工具
 */
export function createChainTool<T = any>(
  componentRef: React.RefObject<any>,
  config: ChainConfig = {}
) {
  const instance = useChainInstance(componentRef, config)
  return new ChainHelper(instance)
}

export default withChain
