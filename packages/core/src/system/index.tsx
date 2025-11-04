/**
 * 🎭 System 系统能力统一导出 - v2025.11.03
 *
 * 跨组件机制，支撑所有组件的系统能力
 * 主题、响应式、可访问性、国际化等核心系统
 *
 * @version 2025.11.03
 * @category System
 * @layer system
 */

// 主题系统
export {
  ThemeProvider,
  useTheme,
  ThemeEngine,
  type SevenAxisTheme,
  type ThemeRecipe,
  type ThemeContextValue
} from './theming-engine'

// 响应式断点系统
export {
  breakpoints,
  type Breakpoint,
  type ResponsiveValue,
  type ScreenSize,
  useMediaQuery,
  useScreenSize,
  useResponsive,
  HiddenAt,
  ShowAt,
  Mobile,
  Tablet,
  Desktop,
  ResponsiveHelper,
  generateResponsiveCSSVariables,
  getCurrentBreakpoint,
  getResponsiveValue,
  createMediaQuery
} from './breakpoints-responsive'

// 颜色模式系统
export {
  ColorModeProvider,
  useColorMode,
  ColorModeHelper,
  type ColorMode,
  type ContrastMode,
  type ColorModeConfig,
  type ColorModeContextValue
} from './color-modes'

// 可访问性系统
export {
  AccessibilityProvider,
  useAccessibility,
  SkipLink,
  useFocusTrap,
  ScreenReaderAnnouncement,
  VisuallyHidden,
  LiveRegion,
  AccessibilityHelper,
  type AccessibilityContextValue
} from './accessibility-system'

// 国际化系统
export {
  I18nProvider,
  useI18n,
  DirectionToggle,
  LanguageSelector,
  I18nHelper,
  localeConfigs,
  defaultLocaleConfig,
  type Language,
  type TextDirection,
  type LocaleConfig,
  type I18nContextValue
} from './internationalization'

// RTL 书写方向支持
export {
  RTLProvider,
  useRTL,
  RTLStyle,
  LogicalMargin,
  useLogicalSpacing,
  RTLHelper,
  RTLLanguages,
  defaultRTLConfig,
  type RTLConfig,
  type RTLContextValue
} from './direction-rtl'

// 便捷别名
export const system = {
  theme: {
    ThemeProvider,
    useTheme,
    ThemeEngine
  },
  responsive: {
    breakpoints,
    useMediaQuery,
    useScreenSize,
    ResponsiveHelper
  },
  colorMode: {
    ColorModeProvider,
    useColorMode,
    ColorModeHelper
  },
  accessibility: {
    AccessibilityProvider,
    useAccessibility,
    AccessibilityHelper
  },
  i18n: {
    I18nProvider,
    useI18n,
    I18nHelper
  },
  rtl: {
    RTLProvider,
    useRTL,
    RTLHelper
  }
}

// 组合提供者组件
export function SystemProviders({
  children,
  theme = {},
  colorMode = {},
  accessibility = {},
  i18n = {},
  rtl = {}
}: {
  children: React.ReactNode
  theme?: Partial<Parameters<typeof ThemeProvider>[0]>
  colorMode?: Partial<Parameters<typeof ColorModeProvider>[0]>
  accessibility?: Partial<Parameters<typeof AccessibilityProvider>[0]>
  i18n?: Partial<Parameters<typeof I18nProvider>[0]>
  rtl?: Partial<Parameters<typeof RTLProvider>[0]>
}) {
  return (
    <ThemeProvider {...theme}>
      <ColorModeProvider {...colorMode}>
        <AccessibilityProvider {...accessibility}>
          <I18nProvider {...i18n}>
            <RTLProvider {...rtl}>
              {children}
            </RTLProvider>
          </I18nProvider>
        </AccessibilityProvider>
      </ColorModeProvider>
    </ThemeProvider>
  )
}