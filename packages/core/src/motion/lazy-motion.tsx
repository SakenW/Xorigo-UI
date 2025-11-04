import React, { Suspense, lazy } from 'react'
import { useMotion } from './motion-provider'

/**
 * 懒加载动画组件的HOC
 * 用于优化SSR性能，延迟加载动画相关的重型组件
 */
export interface LazyMotionProps {
  /**
   * 需要懒加载的组件
   */
  component: React.ComponentType<any>
  /**
   * 组件属性
   */
  props?: Record<string, any>
  /**
   * 加载中的fallback组件
   */
  fallback?: React.ReactNode
  /**
   * 延迟加载时间（毫秒）
   */
  delay?: number
}

/**
 * 创建懒加载动画组件
 */
export const createLazyMotionComponent = <P extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFunc)

  return React.forwardRef<any, P>((props, ref) => {
    const { isMotionEnabled } = useMotion()

    // 如果动画被禁用，返回静态渲染
    if (!isMotionEnabled) {
      return fallback || <div {...props} ref={ref} />
    }

    return (
      <Suspense fallback={fallback || <div />}>
        <LazyComponent {...props} ref={ref} />
      </Suspense>
    )
  })
}

/**
 * 懒加载动画组件包装器
 */
export const LazyMotion: React.FC<LazyMotionProps> = ({
  component: Component,
  props = {},
  fallback,
  delay = 0
}) => {
  const { isMotionEnabled } = useMotion()
  const [shouldRender, setShouldRender] = React.useState(delay === 0)

  React.useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setShouldRender(true)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [delay])

  // 如果动画被禁用，直接渲染组件
  if (!isMotionEnabled) {
    return <Component {...props} />
  }

  // 延迟渲染
  if (!shouldRender) {
    return <>{fallback}</>
  }

  return <Component {...props} />
}

LazyMotion.displayName = 'LazyMotion'