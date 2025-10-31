'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { ColorUtils, SmartPaletteGenerator } from '../utils/container-aware-colors'

export interface ContainerAwareColors {
  ringStops: string[]
  centerColor: string
  haloGradient: { start: string; end: string }
  backgroundColor: { r: number; g: number; b: number }
  isLightBackground: boolean
}

export interface UseContainerAwareColorsOptions {
  /**
   * 是否启用容器感知模式
   * @default false
   */
  containerAware?: boolean

  /**
   * 检测间隔（毫秒）
   * @default 1000
   */
  detectInterval?: number

  /**
   * 默认颜色方案（当检测失败时使用）
   */
  fallbackColors?: {
    ringStops?: string[]
    centerColor?: string
  }

  /**
   * 颜色生成选项
   */
  colorOptions?: {
    vibrant?: boolean
    count?: number
    minContrast?: number
  }
}

const DEFAULT_FALLBACK = {
  ringStops: ['#d946ef', '#f472b6', '#22d3ee', '#06b6d4', '#d946ef'],
  centerColor: '#ffffff'
}

/**
 * 容器感知颜色 Hook
 * 自动检测容器背景色并生成适配的颜色方案
 */
export function useContainerAwareColors(
  elementRef: React.RefObject<HTMLElement>,
  options: UseContainerAwareColorsOptions = {}
): ContainerAwareColors | null {
  const {
    containerAware = false,
    detectInterval = 1000,
    fallbackColors = DEFAULT_FALLBACK,
    colorOptions = {}
  } = options

  const [colors, setColors] = useState<ContainerAwareColors | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * 解析 CSS 变量值
   */
  const resolveCSSVariable = useCallback((value: string, computedStyle: CSSStyleDeclaration): string => {
    if (!value.startsWith('var(')) return value

    const varName = value.slice(4, -1).trim()
    const resolved = computedStyle.getPropertyValue(varName).trim()

    if (!resolved) return value

    // 递归解析嵌套的 CSS 变量
    return resolveCSSVariable(resolved, computedStyle)
  }, [])

  /**
   * 检测元素背景色
   */
  const detectBackgroundColor = useCallback((element: HTMLElement): { r: number; g: number; b: number } | null => {
    if (!element) return null

    try {
      const computedStyle = getComputedStyle(element)
      let bgColor = computedStyle.backgroundColor
      let parent = element.parentElement

      // 特殊处理：检查是否在导航栏中（优先检查，避免被透明背景干扰）
      let isInNavbar = false
      let currentElement = element
      while (currentElement && currentElement !== document.body) {
        if (currentElement.getAttribute('aria-label') === '主导航' ||
            currentElement.getAttribute('role') === 'navigation' ||
            currentElement.className.includes('navbar') ||
            currentElement.className.includes('nav') ||
            currentElement.className.includes('header') ||
            currentElement.className.includes('navigation')) {
          isInNavbar = true
          break
        }
        currentElement = currentElement.parentElement
      }

      // 如果在导航栏中，智能检测导航栏的实际背景状态
      if (isInNavbar) {
        // 检查导航栏元素的背景色
        const navbarElement = currentElement
        const navbarStyle = getComputedStyle(navbarElement)

        // 检查是否滚动（通过背景色判断）
        if (navbarStyle.backgroundColor === 'rgba(0, 0, 0, 0)' ||
            navbarStyle.backgroundColor === 'transparent') {
          // 未滚动状态：导航栏透明，使用页面背景色
          bgColor = getComputedStyle(document.body).backgroundColor
        } else {
          // 已滚动状态：导航栏有半透明背景，检测透明度
          const bgMatch = navbarStyle.backgroundColor.match(/rgba?\(([^)]+)\)/)
          if (bgMatch) {
            const values = bgMatch[1].split(',').map(v => parseFloat(v.trim()))
            const alpha = values[3] ?? 1

            if (alpha < 0.95) {
              // 半透明背景：根据透明度计算等效背景色
              // 玻璃背景通常是白色/黑色 + 透明度
              if (navbarStyle.backgroundColor.includes('255')) {
                // 白色半透明 -> 浅色背景
                bgColor = 'rgb(240, 240, 240)'
              } else {
                // 黑色半透明 -> 深色背景
                bgColor = 'rgb(20, 20, 20)'
              }
            } else {
              // 接近不透明，直接使用检测到的颜色
              bgColor = navbarStyle.backgroundColor
            }
          } else {
            // 无法解析，使用深色作为默认
            bgColor = 'rgb(20, 20, 20)'
          }
        }
      } else {
        // 非导航栏元素的标准检测逻辑
        if (bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)') {
          while (parent && parent !== document.body) {
            const parentStyle = getComputedStyle(parent)
            bgColor = parentStyle.backgroundColor

            // 检查父元素的背景色是否有效
            if (bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
              break
            }

            // 检查父元素是否有渐变背景
            if (parentStyle.backgroundImage && parentStyle.backgroundImage !== 'none') {
              // 如果有渐变背景，尝试解析第一个颜色停止点
              const bgImage = parentStyle.backgroundImage
              const colorMatch = bgImage.match(/rgb\([^)]+\)/)
              if (colorMatch) {
                const rgbColor = ColorUtils.parseColor(colorMatch[0])
                if (rgbColor) {
                  bgColor = `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`
                  break
                }
              }
            }

            parent = parent.parentElement
          }

          // 如果还是透明，使用 body 背景色
          if (!parent || parent === document.body) {
            bgColor = getComputedStyle(document.body).backgroundColor
          }
        }
      }

      // 解析 CSS 变量
      bgColor = resolveCSSVariable(bgColor, computedStyle)

      // 解析颜色值
      const color = ColorUtils.parseColor(bgColor)

      if (color) {
        console.log('🎯 最终检测到的背景色:', `rgb(${color.r}, ${color.g}, ${color.b})`)
        return { r: color.r, g: color.g, b: color.b }
      }

      return null
    } catch (error) {
      console.warn('Failed to detect background color:', error)
      return null
    }
  }, [resolveCSSVariable])

  /**
   * 生成适配的颜色方案
   */
  const generateAdaptiveColors = useCallback((bgColor: { r: number; g: number; b: number }): ContainerAwareColors => {
    const ringStops = SmartPaletteGenerator.generateAdaptivePalette(
      bgColor.r,
      bgColor.g,
      bgColor.b,
      colorOptions
    )

    const centerColor = SmartPaletteGenerator.generateCenterColor(
      bgColor.r,
      bgColor.g,
      bgColor.b,
      ringStops
    )

    const haloGradient = SmartPaletteGenerator.generateHaloGradient(
      bgColor.r,
      bgColor.g,
      bgColor.b
    )

    const isLightBackground = ColorUtils.isLightColor(bgColor.r, bgColor.g, bgColor.b)

    return {
      ringStops,
      centerColor,
      haloGradient,
      backgroundColor: bgColor,
      isLightBackground
    }
  }, [colorOptions])

  /**
   * 检测并更新颜色
   */
  const updateColors = useCallback(() => {
    const element = elementRef.current
    if (!element) return

    if (!containerAware) {
      // 非容器感知模式，使用默认颜色
      const defaultColors: ContainerAwareColors = {
        ringStops: fallbackColors.ringStops!,
        centerColor: fallbackColors.centerColor!,
        haloGradient: {
          start: 'rgba(168,85,247,0.18)',
          end: 'rgba(6,182,212,0.08)'
        },
        backgroundColor: { r: 255, g: 255, b: 255 },
        isLightBackground: true
      }
      setColors(defaultColors)
      return
    }

    const bgColor = detectBackgroundColor(element)

    if (bgColor) {
      const adaptiveColors = generateAdaptiveColors(bgColor)
      setColors(adaptiveColors)
    } else {
      // 检测失败，使用 fallback 颜色
      const fallbackResultColors: ContainerAwareColors = {
        ringStops: fallbackColors.ringStops!,
        centerColor: fallbackColors.centerColor!,
        haloGradient: {
          start: 'rgba(168,85,247,0.18)',
          end: 'rgba(6,182,212,0.08)'
        },
        backgroundColor: { r: 255, g: 255, b: 255 },
        isLightBackground: true
      }
      setColors(fallbackResultColors)
    }
  }, [elementRef, containerAware, detectBackgroundColor, generateAdaptiveColors, fallbackColors.ringStops, fallbackColors.centerColor])

  // 初始化检测
  useEffect(() => {
    updateColors()
  }, [updateColors])

  // 减少定期检测频率，避免性能问题
  useEffect(() => {
    if (!containerAware || detectInterval <= 0) return

    intervalRef.current = setInterval(() => {
      updateColors()
    }, Math.max(detectInterval, 2000)) // 最少2秒间隔

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [containerAware, detectInterval, updateColors])

  // 监听主题变化（通过 MutationObserver）
  useEffect(() => {
    if (!containerAware) return

    const element = elementRef.current
    if (!element) return

    const observer = new MutationObserver(() => {
      updateColors()
    })

    // 监听 document.documentElement 的属性变化（如 data-theme）
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class', 'style']
    })

    // 监听父元素的 style 变化
    let parent = element.parentElement
    while (parent && parent !== document.body) {
      observer.observe(parent, {
        attributes: true,
        attributeFilter: ['class', 'style']
      })
      parent = parent.parentElement
    }

    return () => {
      observer.disconnect()
    }
  }, [containerAware, elementRef, updateColors])

  return colors
}