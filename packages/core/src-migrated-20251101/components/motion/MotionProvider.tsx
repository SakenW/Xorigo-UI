import React, { createContext, useContext, useEffect, useState } from 'react'

/**
 * MotionProvider 上下文
 * 用于全局控制动画行为，支持SSR环境
 */
interface MotionContextType {
  /**
   * 是否启用动画
   * SSR环境下默认为false，客户端水合后可设置为true
   */
  isMotionEnabled: boolean

  /**
   * 用户是否偏好减少动画
   */
  prefersReducedMotion: boolean

  /**
   * 设置动画启用状态
   */
  setMotionEnabled: (enabled: boolean) => void
}

const MotionContext = createContext<MotionContextType>({
  isMotionEnabled: false,
  prefersReducedMotion: false,
  setMotionEnabled: () => {}
})

/**
 * MotionProvider 组件属性
 */
export interface MotionProviderProps {
  children: React.ReactNode
  /**
   * 是否在客户端水合后自动启用动画
   * @default true
   */
  enableOnHydrate?: boolean
  /**
   * 动画延迟时间（毫秒）
   * @default 0
   */
  delay?: number
  /**
   * 强制启用动画（忽略用户偏好设置）
   * @default false
   */
  force?: boolean
}

/**
 * MotionProvider 组件
 *
 * 提供全局动画控制，解决SSR环境下的动画兼容性问题
 *
 * @example
 * ```tsx
 * <MotionProvider enableOnHydrate delay={100}>
 *   <App>
 *     <AnimatedComponent />
 *   </App>
 * </MotionProvider>
 * ```
 */
export const MotionProvider: React.FC<MotionProviderProps> = ({
  children,
  enableOnHydrate = true,
  delay = 0,
  force = false
}) => {
  const [isMotionEnabled, setIsMotionEnabled] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // 检测用户动画偏好
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // 客户端水合检测
  useEffect(() => {
    setIsHydrated(true)

    if (enableOnHydrate) {
      const timer = setTimeout(() => {
        setIsMotionEnabled(true)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [enableOnHydrate, delay])

  // 计算实际动画启用状态
  const shouldEnableMotion = force || (isMotionEnabled && !prefersReducedMotion)

  const contextValue: MotionContextType = {
    isMotionEnabled: shouldEnableMotion,
    prefersReducedMotion,
    setMotionEnabled: setIsMotionEnabled
  }

  return (
    <MotionContext.Provider value={contextValue}>
      {children}
    </MotionContext.Provider>
  )
}

/**
 * 使用Motion上下文的Hook
 */
export const useMotion = () => {
  const context = useContext(MotionContext)

  if (!context) {
    throw new Error('useMotion must be used within a MotionProvider')
  }

  return context
}

/**
 * 检测是否在服务端环境
 */
const isServer = typeof window === 'undefined'

/**
 * SSR安全的动画组件基础Hook
 */
export const useSSRSafeAnimation = (
  animationEnabled: boolean,
  fallbackAnimation?: any
) => {
  // 服务端始终禁用动画
  if (isServer) {
    return {
      animate: fallbackAnimation || {},
      initial: {},
      transition: { duration: 0 }
    }
  }

  // 客户端根据配置启用动画
  if (animationEnabled) {
    return {
      animate: undefined,
      initial: undefined,
      transition: undefined
    }
  }

  // 客户端禁用动画时的fallback
  return {
    animate: fallbackAnimation || {},
    initial: {},
    transition: { duration: 0 }
  }
}