/**
 * @fileoverview 核心HOC模块统一导出
 * @description 提供所有核心高阶组件的统一导出点
 */

export { default as withTheme, WithTheme, withLightTheme, withDarkTheme, withSystemTheme } from './withTheme'
export type {
  ThemeConfig,
  ThemeContextValue,
} from './withTheme'

export { default as withVariant, WithVariant, withPrimaryVariant, withSecondaryVariant, withOutlineVariant, withGhostVariant, withLinkVariant } from './withVariant'
export type {
  VariantConfig,
  VariantContextValue,
} from './withVariant'

export { default as withSize, WithSize, withExtraSmallSize, withSmallSize, withMediumSize, withLargeSize, withExtraLargeSize } from './withSize'
export type {
  SizeConfig,
  SizeContextValue,
} from './withSize'

export { default as withState, WithState, withLoadingState, withErrorState, withFormState } from './withState'
export type {
  StateConfig,
  StateContextValue,
  StateActions,
} from './withState'

export { default as withValidation, WithValidation, emailValidator, phoneValidator, passwordValidator } from './withValidation'
export type {
  ValidationConfig,
  ValidationContextValue,
  ValidationResult,
} from './withValidation'

export { default as withAccessibility, WithAccessibility, withButtonA11y, withDialogA11y, withFormFieldA11y } from './withAccessibility'
export type {
  AccessibilityConfig,
  AccessibilityContextValue,
} from './withAccessibility'

export { default as withLoading, WithLoading, withDelayedLoading, withOverlayLoading, withSpinnerLoading } from './withLoading'
export type {
  LoadingConfig,
  LoadingContextValue,
} from './withLoading'

export { default as withErrorBoundary, WithErrorBoundary, withSilentErrorBoundary, withLoggingErrorBoundary, withAutoRetryErrorBoundary, DefaultErrorFallback } from './withErrorBoundary'
export type {
  ErrorBoundaryConfig,
  ErrorContextValue,
} from './withErrorBoundary'
