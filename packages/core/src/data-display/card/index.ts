/**
 * @fileoverview Card 组件模块统一导出
 * @description 提供 Card 组件及其子组件、类型、变体的统一入口
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 * @since 2025-11-04
 */

// =============================================================================
// 核心组件导出
// =============================================================================

export { Card } from './card'
export type { CardProps, CardVariants } from './card'

// =============================================================================
// 子组件导出
// =============================================================================

export { CardHeader } from './card'
export type { CardHeaderProps } from './card'

export { CardBody } from './card'
export type { CardBodyProps } from './card'

export { CardFooter } from './card'
export type { CardFooterProps } from './card'

// =============================================================================
// 变体配置导出
// =============================================================================

export { cardVariants } from './card'
export type { CardVariants as CardVariantProps } from './card'

// =============================================================================
// 向后兼容导出（如果需要）
// =============================================================================

// 这些导出确保旧代码仍然可以工作
// 注意：这些可能会在未来版本中移除

// =============================================================================
// 导出总结
// =============================================================================

/**
 * 导出的所有组件：
 * - Card: 主卡片组件
 * - CardHeader: 卡片头部组件
 * - CardBody: 卡片正文组件
 * - CardFooter: 卡片底部组件
 *
 * 导出的所有类型：
 * - CardProps: 主组件 Props 类型
 * - CardHeaderProps: 头部组件 Props 类型
 * - CardBodyProps: 正文组件 Props 类型
 * - CardFooterProps: 底部组件 Props 类型
 * - CardVariants: 变体配置类型
 *
 * 使用示例：
 * ```tsx
 * import { Card, CardHeader, CardBody, CardFooter } from '@xorigo-ui/core/data-display/card'
 *
 * <Card>
 *   <CardHeader title="标题" subtitle="副标题" />
 *   <CardBody>正文内容</CardBody>
 *   <CardFooter>底部内容</CardFooter>
 * </Card>
 * ```
 */
