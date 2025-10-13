/**
 * 性能优化工具函数
 */

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 懒加载图片
 */
export function lazyLoadImage(
  imgElement: HTMLImageElement,
  src: string,
  callback?: () => void
) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = src
          img.onload = () => {
            callback?.()
            observer.unobserve(img)
          }
        }
      })
    },
    {
      rootMargin: '50px'
    }
  )

  observer.observe(imgElement)
}

/**
 * 预加载资源
 */
export function preloadResource(url: string, as: 'script' | 'style' | 'image') {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = url
  link.as = as
  document.head.appendChild(link)
}

/**
 * 批量预加载图片
 */
export function preloadImages(urls: string[]) {
  urls.forEach(url => preloadResource(url, 'image'))
}

/**
 * 内存使用监控
 */
export function getMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576),
      total: Math.round(memory.totalJSHeapSize / 1048576),
      limit: Math.round(memory.jsHeapSizeLimit / 1048576)
    }
  }
  return null
}

/**
 * 组件渲染性能监控
 */
export function measureRenderTime(componentName: string) {
  return function<T extends ComponentType<any>>(Component: T): T {
    const MeasuredComponent = (props: any) => {
      React.useEffect(() => {
        const startTime = performance.now()

        return () => {
          const endTime = performance.now()
          console.log(`${componentName} 渲染时间: ${(endTime - startTime).toFixed(2)}ms`)
        }
      })

      return React.createElement(Component, props)
    }

    return MeasuredComponent as T
  }
}