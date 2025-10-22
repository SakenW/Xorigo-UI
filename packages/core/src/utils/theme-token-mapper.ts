/**
 * Xorigo UI 主题令牌映射工具
 *
 * 统一管理七轴主题系统的 CSS 变量映射
 * 确保所有组件使用一致的令牌命名规范
 */

import type { ThemeRecipe, ThemeColors } from '../system/theme-axis-controller'

// === 主题令牌映射接口 ===
export interface ThemeTokenMap {
  // 背景色令牌
  backgrounds: {
    primary: string
    secondary: string
    tertiary: string
    quaternary: string
  }

  // 文字色令牌
  text: {
    primary: string
    secondary: string
    tertiary: string
    quaternary: string
    inverse: string
  }

  // 边框色令牌
  borders: {
    primary: string
    secondary: string
    tertiary: string
    focus: string
  }

  // 功能色令牌
  functional: {
    success: string
    error: string
    warning: string
    info: string
  }

  // 功能色上的文字色令牌
  functionalText: {
    onSuccess: string
    onError: string
    onWarning: string
    onInfo: string
  }

  // 主题色令牌
  primary: {
    main: string
    foreground: string
    light: string
    dark: string
  }

  // 次要主题色令牌
  secondary: {
    main: string
    foreground: string
    light: string
    dark: string
  }

  // 交互令牌
  interactive: {
    hover: string
    active: string
    focus: string
    disabled: string
  }

  // 密度令牌
  density: {
    scale: string
    spacing: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
    }
  }

  // 动效令牌
  motion: {
    duration: {
      fast: string
      normal: string
      slow: string
    }
    easing: {
      ease: string
      easeIn: string
      easeOut: string
      easeInOut: string
    }
  }

  // 表面效果令牌
  surface: {
    shadow: string
    blur: string
    opacity: string
  }
}

// === 主题令牌映射生成器 ===
export function generateThemeTokenMap(theme: ThemeRecipe): ThemeTokenMap {
  const tokens = theme.tokens

  return {
    backgrounds: {
      primary: 'var(--xor-bg-primary)',
      secondary: 'var(--xor-bg-secondary)',
      tertiary: 'var(--xor-bg-tertiary)',
      quaternary: 'var(--xor-bg-quaternary)',
    },

    text: {
      primary: 'var(--xor-text-primary)',
      secondary: 'var(--xor-text-secondary)',
      tertiary: 'var(--xor-text-tertiary)',
      quaternary: 'var(--xor-text-quaternary)',
      inverse: 'var(--xor-text-inverse)',
    },

    borders: {
      primary: 'var(--xor-border-primary)',
      secondary: 'var(--xor-border-secondary)',
      tertiary: 'var(--xor-border-tertiary)',
      focus: 'var(--xor-border-focus)',
    },

    functional: {
      success: 'var(--xor-success)',
      error: 'var(--xor-error)',
      warning: 'var(--xor-warning)',
      info: 'var(--xor-info)',
    },

    functionalText: {
      onSuccess: 'var(--xor-text-on-success)',
      onError: 'var(--xor-text-on-error)',
      onWarning: 'var(--xor-text-on-warning)',
      onInfo: 'var(--xor-text-on-info)',
    },

    primary: {
      main: 'var(--xor-primary)',
      foreground: 'var(--xor-text-on-primary)',
      light: 'var(--xor-primary-light)',
      dark: 'var(--xor-primary-dark)',
    },

    secondary: {
      main: 'var(--xor-secondary)',
      foreground: 'var(--xor-text-on-secondary)',
      light: 'var(--xor-secondary-light)',
      dark: 'var(--xor-secondary-dark)',
    },

    interactive: {
      hover: 'var(--xor-interactive-hover)',
      active: 'var(--xor-interactive-active)',
      focus: 'var(--xor-interactive-focus)',
      disabled: 'var(--xor-interactive-disabled)',
    },

    density: {
      scale: 'var(--xor-density-scale)',
      spacing: {
        xs: 'var(--xor-spacing-xs)',
        sm: 'var(--xor-spacing-sm)',
        md: 'var(--xor-spacing-md)',
        lg: 'var(--xor-spacing-lg)',
        xl: 'var(--xor-spacing-xl)',
      },
    },

    motion: {
      duration: {
        fast: 'var(--xor-motion-duration-fast)',
        normal: 'var(--xor-motion-duration)',
        slow: 'var(--xor-motion-duration-slow)',
      },
      easing: {
        ease: 'var(--xor-motion-easing)',
        easeIn: 'var(--xor-motion-easing-in)',
        easeOut: 'var(--xor-motion-easing-out)',
        easeInOut: 'var(--xor-motion-easing-in-out)',
      },
    },

    surface: {
      shadow: 'var(--xor-surface-shadow)',
      blur: 'var(--xor-surface-blur)',
      opacity: 'var(--xor-surface-opacity)',
    },
  }
}

// === React Hook for Theme Tokens ===
export function useThemeTokens(): ThemeTokenMap {
  // 这里会在实际使用时从 useTheme 获取 theme 对象
  // 为了避免循环依赖，这里返回一个默认的令牌映射
  // 实际组件中应该使用 generateThemeTokenMap(theme)

  return {
    backgrounds: {
      primary: 'var(--xor-bg-primary)',
      secondary: 'var(--xor-bg-secondary)',
      tertiary: 'var(--xor-bg-tertiary)',
      quaternary: 'var(--xor-bg-quaternary)',
    },

    text: {
      primary: 'var(--xor-text-primary)',
      secondary: 'var(--xor-text-secondary)',
      tertiary: 'var(--xor-text-tertiary)',
      quaternary: 'var(--xor-text-quaternary)',
      inverse: 'var(--xor-text-inverse)',
    },

    borders: {
      primary: 'var(--xor-border-primary)',
      secondary: 'var(--xor-border-secondary)',
      tertiary: 'var(--xor-border-tertiary)',
      focus: 'var(--xor-border-focus)',
    },

    functional: {
      success: 'var(--xor-success)',
      error: 'var(--xor-error)',
      warning: 'var(--xor-warning)',
      info: 'var(--xor-info)',
    },

    functionalText: {
      onSuccess: 'var(--xor-text-on-success)',
      onError: 'var(--xor-text-on-error)',
      onWarning: 'var(--xor-text-on-warning)',
      onInfo: 'var(--xor-text-on-info)',
    },

    primary: {
      main: 'var(--xor-primary)',
      foreground: 'var(--xor-text-on-primary)',
      light: 'var(--xor-primary-light)',
      dark: 'var(--xor-primary-dark)',
    },

    secondary: {
      main: 'var(--xor-secondary)',
      foreground: 'var(--xor-text-on-secondary)',
      light: 'var(--xor-secondary-light)',
      dark: 'var(--xor-secondary-dark)',
    },

    interactive: {
      hover: 'var(--xor-interactive-hover)',
      active: 'var(--xor-interactive-active)',
      focus: 'var(--xor-interactive-focus)',
      disabled: 'var(--xor-interactive-disabled)',
    },

    density: {
      scale: 'var(--xor-density-scale)',
      spacing: {
        xs: 'var(--xor-spacing-xs)',
        sm: 'var(--xor-spacing-sm)',
        md: 'var(--xor-spacing-md)',
        lg: 'var(--xor-spacing-lg)',
        xl: 'var(--xor-spacing-xl)',
      },
    },

    motion: {
      duration: {
        fast: 'var(--xor-motion-duration-fast)',
        normal: 'var(--xor-motion-duration)',
        slow: 'var(--xor-motion-duration-slow)',
      },
      easing: {
        ease: 'var(--xor-motion-easing)',
        easeIn: 'var(--xor-motion-easing-in)',
        easeOut: 'var(--xor-motion-easing-out)',
        easeInOut: 'var(--xor-motion-easing-in-out)',
      },
    },

    surface: {
      shadow: 'var(--xor-surface-shadow)',
      blur: 'var(--xor-surface-blur)',
      opacity: 'var(--xor-surface-opacity)',
    },
  }
}

// === 便捷工具函数 ===

/**
 * 为组件生成标准化的主题样式
 */
export function createThemeStyles(theme: ThemeRecipe, customTokens?: Record<string, string>): React.CSSProperties {
  const tokenMap = generateThemeTokenMap(theme)

  return {
    // 基础令牌映射 - 使用完整的主题颜色系统
    '--xor-bg-primary': theme.colors.background.primary,
    '--xor-bg-secondary': theme.colors.background.secondary,
    '--xor-bg-tertiary': theme.colors.background.tertiary,
    '--xor-text-primary': theme.colors.text.primary,
    '--xor-text-secondary': theme.colors.text.secondary,
    '--xor-text-tertiary': theme.colors.text.tertiary,
    '--xor-border-primary': theme.colors.border.primary,
    '--xor-primary': theme.colors.primary,
    '--xor-secondary': theme.colors.secondary,
    '--xor-success': theme.colors.success,
    '--xor-error': theme.colors.error,
    '--xor-warning': theme.colors.warning,
    '--xor-info': theme.colors.info,
    '--xor-text-on-primary': theme.colors.primaryForeground,
    '--xor-text-on-secondary': theme.colors.secondaryForeground,
    '--xor-text-on-success': theme.colors.onSuccess,
    '--xor-text-on-error': theme.colors.onError,
    '--xor-text-on-warning': theme.colors.onWarning,
    '--xor-text-on-info': theme.colors.onInfo,

    // 自定义令牌
    ...customTokens,
  }
}

/**
 * 验证令牌是否符合命名规范
 */
export function validateTokenName(tokenName: string): boolean {
  return /^--xor-[a-zA-Z0-9-]+$/.test(tokenName)
}

/**
 * 规范化令牌名称
 */
export function normalizeTokenName(tokenName: string): string {
  if (tokenName.startsWith('--xor-')) {
    return tokenName
  }

  // 移除现有的前缀
  const cleanName = tokenName.replace(/^--/, '')

  // 添加统一前缀
  return `--xor-${cleanName}`
}

/**
 * 检查组件中是否使用了硬编码颜色
 */
export function findHardcodedColors(className: string): string[] {
  const hardcodedPatterns = [
    /bg-(red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-\d+/g,
    /text-(red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-\d+/g,
    /border-(red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-\d+/g,
  ]

  const issues: string[] = []

  hardcodedPatterns.forEach(pattern => {
    const matches = className.match(pattern)
    if (matches) {
      issues.push(...matches)
    }
  })

  return [...new Set(issues)]
}