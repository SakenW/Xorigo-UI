/**
 * Matrix工具组件 - 从@xorigo-ui/core重新导出matrix相关函数
 * 符合数据层访问规则
 */

// 从core包重新导出matrix相关函数
export {
  validateMatrix,
  calculateContrastRatio,
  simulateCVD,
  validateContrast,
  validateReadability,
  generateMarkdownReport,
  generateJSONReport,
  DEFAULT_MATRIX_CONFIG,
  STRICT_MATRIX_CONFIG,
  type MatrixConfig,
  type ValidationResult,
  type ValidationIssue,
} from '@xorigo-ui/core'