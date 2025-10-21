import { useMemo } from 'react'
import { useTheme } from '@xorigo-ui/system'

/**
 * Neon 主题样式 Hook
 * 抽取重复的 neon 主题样式逻辑，提供一致的主题体验
 */
export const useNeonTheme = (variant?: string) => {
  const { themeConfig } = useTheme()

  const neonStyles = useMemo(() => {
    const baseNeonStyles = {
      boxShadow: `0 0 15px ${themeConfig.glow}`,
      borderColor: themeConfig.colors?.[400] as string,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)' as const,
    }

    // 根据不同组件类型调整样式
    switch (variant) {
      case 'button':
        return {
          ...baseNeonStyles,
          boxShadow: `0 0 10px ${themeConfig.glow}, 0 0 20px ${themeConfig.glow}`,
          textShadow: `0 0 5px ${themeConfig.colors?.[400]}`,
        }

      case 'input':
        return {
          ...baseNeonStyles,
          boxShadow: `0 0 5px ${themeConfig.glow}, inset 0 0 5px rgba(0, 0, 0, 0.5)`,
          caretColor: themeConfig.colors?.[400],
        }

      case 'card':
        return {
          ...baseNeonStyles,
          boxShadow: `0 0 20px ${themeConfig.glow}, 0 0 40px ${themeConfig.glow}`,
          border: `1px solid ${themeConfig.colors?.[400]}`,
        }

      case 'modal':
        return {
          ...baseNeonStyles,
          boxShadow: `0 0 30px ${themeConfig.glow}, 0 0 60px ${themeConfig.glow}`,
        }

      case 'tooltip':
        return {
          ...baseNeonStyles,
          boxShadow: `0 0 10px ${themeConfig.glow}`,
        }

      default:
        return baseNeonStyles
    }
  }, [themeConfig, variant])

  const neonClasses = useMemo(() => {
    const baseClasses = `
      text-[var(--text-info)]
      border-[var(--border-info)]
      bg-black/80
      transition-all duration-300
    `

    const variantClasses = {
      button: `
        hover:bg-[var(--bg-info)]/20
        hover:shadow-[0_0_20px_var(--glow-info)]
        hover:scale-105
      `,
      input: `
        focus:bg-[var(--bg-info)]/10
        focus:border-[var(--border-info)]
        focus:shadow-[0_0_15px_var(--glow-info)]
      `,
      card: `
        hover:shadow-[0_0_25px_var(--glow-info)]
      `,
      modal: `
        border-[var(--border-info)]
      `,
      tooltip: `
        backdrop-blur-sm
      `,
    }

    return cn(
      baseClasses.trim(),
      variant && variantClasses[variant as keyof typeof variantClasses]
    )
  }, [variant])

  return {
    styles: neonStyles,
    classes: neonClasses,
    color: themeConfig.colors?.[400],
    glow: themeConfig.glow,
  }
}

// 主题变体类型定义
export type NeonVariant = 'button' | 'input' | 'card' | 'modal' | 'tooltip' | undefined

// 组件状态类型安全辅助函数
export const createStatusProps = <T extends Record<string, any>>(
  status: string,
  baseProps: T
): T => {
  return {
    ...baseProps,
    status: status as T['status'],
  }
}

// 组件变体类型安全辅助函数
export const createVariantProps = <T extends Record<string, any>>(
  variant: string,
  baseProps: T
): T => {
  return {
    ...baseProps,
    variant: variant as T['variant'],
  }
}