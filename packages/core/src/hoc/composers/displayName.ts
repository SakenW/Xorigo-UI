/**
 * @fileoverview displayName HOC - 显示名称管理
 * @description 为HOC和组件提供自动化的显示名称管理
 */

import React, { ComponentType } from 'react'

/**
 * 显示名称配置
 */
export interface DisplayNameConfig {
  /**
   * 自定义前缀
   */
  prefix?: string

  /**
   * 自定义后缀
   */
  suffix?: string

  /**
   * 显示名称生成函数
   */
  generate?: (componentName: string) => string

  /**
   * 是否保留原始名称
   */
  preserveOriginal?: boolean

  /**
   * 分隔符
   */
  separator?: string
}

/**
 * 组件名称信息
 */
export interface ComponentNameInfo {
  originalName: string
  hocNames: string[]
  finalName: string
  displayName: string
}

/**
 * 解析组件名称
 */
function parseComponentName(component: ComponentType<any>): string {
  if (typeof component === 'function') {
    // 函数组件
    if (component.displayName) {
      return component.displayName
    }

    if (component.name) {
      return component.name
    }

    return 'Component'
  }

  if (typeof component === 'object' && component !== null) {
    // 类组件
    if (component.displayName) {
      return component.displayName
    }

    if (component.type && component.type.name) {
      return component.type.name
    }

    if (component.name) {
      return component.name
    }

    return 'Component'
  }

  return 'Component'
}

/**
 * 生成显示名称
 */
function generateDisplayName(
  componentName: string,
  hocNames: string[],
  config: DisplayNameConfig
): string {
  const {
    prefix = '',
    suffix = '',
    generate,
    preserveOriginal = true,
    separator = ' → ',
  } = config

  if (generate) {
    return generate(componentName)
  }

  let name = ''

  // 添加前缀
  if (prefix) {
    name += prefix + (separator || ' ')
  }

  // 添加HOC链
  if (hocNames.length > 0) {
    name += hocNames.join(separator)
    name += (preserveOriginal || !componentName) ? separator + componentName : ''
  } else {
    name += componentName
  }

  // 添加后缀
  if (suffix) {
    name += (separator || ' ') + suffix
  }

  return name
}

/**
 * 提取HOC名称
 */
function extractHocNames(hoc: any): string {
  const hocStr = hoc.toString()

  // 匹配函数名
  const nameMatch = hocStr.match(/function\s+([A-Za-z]\w*)|const\s+([A-Za-z]\w*)\s*=/)
  if (nameMatch) {
    return nameMatch[1] || nameMatch[2] || 'HOC'
  }

  // 匹配withXxx模式
  const withMatch = hocStr.match(/with([A-Za-z]\w*)/)
  if (withMatch) {
    return `with${withMatch[1]}`
  }

  // 匹配箭头函数
  const arrowMatch = hocStr.match(/return\s+\(.*?\)\s*=>\s*function\s+([A-Za-z]\w*)/)
  if (arrowMatch) {
    return arrowMatch[1] || 'HOC'
  }

  return 'HOC'
}

/**
 * withDisplayName HOC - 为组件注入显示名称管理
 *
 * @param config 显示名称配置
 * @returns HOC函数
 *
 * @example
 * ```tsx
 * const EnhancedComponent = withDisplayName({
 *   prefix: 'Enhanced',
 *   suffix: 'Wrapper'
 * })(BaseComponent)
 * ```
 */
export function withDisplayName<T = {}>(
  config: DisplayNameConfig = {}
): HOC<T, T> {
  return function(Component: ComponentType<T>) {
    const displayName = generateDisplayName(
      Component.displayName || Component.name || 'Component',
      [],
      config
    )

    const NamedComponent = React.forwardRef<any, T>((props, ref) => {
      return <Component ref={ref} {...props} />
    })

    NamedComponent.displayName = displayName

    return NamedComponent
  }
}

/**
 * 设置HOC链的显示名称
 *
 * @param Component 基础组件
 * @param hocs HOC数组
 * @param config 配置选项
 * @returns 带显示名称的组件
 *
 * @example
 * ```tsx
 * const EnhancedButton = setDisplayNameForChain(
 *   BaseButton,
 *   [withTheme, withVariant('primary'), withSize('md')],
 *   { separator: ' > ' }
 * )
 * ```
 */
export function setDisplayNameForChain<T = {}>(
  Component: ComponentType<T>,
  hocs: any[],
  config: DisplayNameConfig = {}
) {
  const componentName = parseComponentName(Component)
  const hocNames = hocs.map(extractHocNames)
  const displayName = generateDisplayName(componentName, hocNames, config)

  // 创建显示名称配置对象
  const ConfiguredComponent = withDisplayName({
    ...config,
    generate: () => displayName,
  })

  return ConfiguredComponent(Component)
}

/**
 * 创建显示名称构建器
 */
export class DisplayNameBuilder {
  private config: DisplayNameConfig
  private componentName: string = ''
  private hocNames: string[] = []

  constructor(config: DisplayNameConfig = {}) {
    this.config = config
  }

  /**
   * 设置组件名
   */
  setComponentName(name: string): DisplayNameBuilder {
    this.componentName = name
    return this
  }

  /**
   * 添加HOC名称
   */
  addHoc(name: string): DisplayNameBuilder {
    this.hocNames.push(name)
    return this
  }

  /**
   * 批量添加HOC名称
   */
  addHocs(names: string[]): DisplayNameBuilder {
    this.hocNames.push(...names)
    return this
  }

  /**
   * 从HOC函数提取名称
   */
  extractFromHoc(hoc: any): DisplayNameBuilder {
    const hocName = extractHocNames(hoc)
    this.hocNames.push(hocName)
    return this
  }

  /**
   * 从HOC数组提取名称
   */
  extractFromHocs(hocs: any[]): DisplayNameBuilder {
    hocs.forEach(hoc => {
      const hocName = extractHocNames(hoc)
      this.hocNames.push(hocName)
    })
    return this
  }

  /**
   * 生成显示名称
   */
  build(): string {
    return generateDisplayName(this.componentName, this.hocNames, this.config)
  }

  /**
   * 应用到组件
   */
  apply<T>(Component: ComponentType<T>): ComponentType<T> {
    const displayName = this.build()

    const NamedComponent = React.forwardRef<any, T>((props, ref) => {
      return <Component ref={ref} {...props} />
    })

    NamedComponent.displayName = displayName

    return NamedComponent
  }

  /**
   * 获取组件信息
   */
  getInfo(): ComponentNameInfo {
    return {
      originalName: this.componentName,
      hocNames: [...this.hocNames],
      finalName: this.build(),
      displayName: this.build(),
    }
  }
}

/**
 * 预设显示名称配置
 */
export const DISPLAY_NAME_PRESETS = {
  development: {
    separator: ' | ',
    preserveOriginal: true,
    suffix: '(Dev)',
  } as DisplayNameConfig,

  production: {
    separator: ' → ',
    preserveOriginal: false,
  } as DisplayNameConfig,

  debug: {
    separator: ' > ',
    preserveOriginal: true,
    generate: (name: string) => `[Debug] ${name}`,
  } as DisplayNameConfig,
}

/**
 * 自动推断显示名称
 */
export function autoDisplayName(
  Component: ComponentType<any>,
  config: DisplayNameConfig = {}
): ComponentType<any> {
  const componentName = parseComponentName(Component)

  return withDisplayName({
    ...config,
    generate: () => {
      const builder = new DisplayNameBuilder(config)
      builder.setComponentName(componentName)
      return builder.build()
    },
  })(Component)
}

export default withDisplayName
