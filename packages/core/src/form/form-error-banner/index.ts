/**
 * @fileoverview FormErrorBanner 组件模块导出
 * @file index.ts
 *
 * 表单错误横幅组件模块
 * 提供表单级别的全局错误信息显示，支持多种错误类型、自动消失、重试功能和详细的错误展示
 */

// ============================================================================
// 主组件导出
// ============================================================================

export { FormErrorBanner } from './form-error-banner'
export type { FormErrorBannerProps } from './form-error-banner'

// ============================================================================
// 样式变体导出
// ============================================================================

export {
  errorBannerVariants,
  bannerIconVariants,
  actionButtonVariants,
  secondaryButtonVariants,
  collapseButtonVariants,
} from './form-error-banner'

// ============================================================================
// 类型导出
// ============================================================================

export type { ErrorAction } from './form-error-banner'

// ============================================================================
// 模块信息
// ============================================================================

/**
 * FormErrorBanner - 表单错误横幅组件
 *
 * 功能特性：
 * ✅ 全局错误横幅显示
 * ✅ 5种错误类型支持（validation/network/server/permission/unknown）
 * ✅ 自动消失和手动关闭
 * ✅ 重试功能和自定义操作按钮
 * ✅ 详情展开/折叠
 * ✅ 固定定位支持
 * ✅ 错误代码复制
 * ✅ 多状态和严重程度
 * ✅ 动画效果（基于 Framer Motion）
 * ✅ 完整的可访问性支持
 * ✅ TypeScript 类型安全
 *
 * 使用示例：
 *
 * ```tsx
 * import { FormErrorBanner } from '@xorigo-ui/core'
 *
 * // 基础用法
 * <FormErrorBanner
 *   message="表单验证失败"
 *   variant="destructive"
 *   severity="major"
 * />
 *
 * // 带重试功能
 * <FormErrorBanner
 *   message="提交失败"
 *   errorType="network"
 *   onRetry={handleRetry}
 * />
 *
 * // 固定在顶部
 * <FormErrorBanner
 *   message="全局错误提示"
 *   fixed={true}
 *   position="top"
 *   autoDismiss={5000}
 * />
 *
 * // 带详情展开
 * <FormErrorBanner
 *   message="服务器错误"
 *   code="ERROR_500"
 *   details="详细错误堆栈..."
 *   showDetailsToggle={true}
 * />
 *
 * // 带操作按钮
 * <FormErrorBanner
 *   message="权限不足"
 *   actions={[
 *     { text: '申请权限', onClick: handleRequest },
 *     { text: '联系管理员', onClick: handleContact }
 *   ]}
 * />
 * ```
 */

// ============================================================================
// 版本信息
// ============================================================================

export const FORmErrorBanner_VERSION = '1.0.0'
export const FORM_ERROR_BANNER_CATEGORY = 'forms'
export const FORM_ERROR_BANNER_LAYER = 'component'
export const FORM_ERROR_BANNER_STABILITY = 'stable'
