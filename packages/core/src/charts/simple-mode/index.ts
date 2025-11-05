/**
 * @fileoverview Simple Mode - Simple mode utilities for chart components
 * @version 1.0.0
 * @author Xorigo UI Team
 */

export * from './utils'

export type {
  SimpleTheme,
  SimpleDataPoint,
  SimpleDataSeries
}

/**
 * BarChart specific utilities for backward compatibility
 */
export {
  validateBarChartSimpleModeProps as validateBarChartPropsSimple,
  validateBarChartAdvancedModeProps as validateBarChartPropsAdvanced
} from './utils'
