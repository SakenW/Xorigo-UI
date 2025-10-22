/**
 * Xorigo UI Primitives 组件聚合导出 - 符合七轴主题系统 v1.4 SSOT
 *
 * UI 基元组件 - 可组合的无样式或轻样式原子组件与可达性基元
 * 从 ui 目录迁移至 primitives 目录，集成新设计令牌系统
 */

// =============================================================================
// 核心原子组件 - 符合组件 API 标准
// =============================================================================

// Button - 按钮组件：尺寸/变体/状态
export * from './button/button'

// Card - 卡片组件：信息容器/复合组件
export * from './card/card'

// Surface - 表面容器：层级/背景/投影
export * from './surface/surface'

// =============================================================================
// 工具函数导出
// =============================================================================

export { cn } from '../foundations/utils/cn'

// =============================================================================
// 组件类型导出
// =============================================================================

export type {
  ButtonProps,
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
  SurfaceProps,
  SurfaceDecorationProps,
} from './button/button'

// =============================================================================
// 组件变体导出
// =============================================================================

export { buttonVariants } from './button/button'
export { cardVariants } from './card/card'
export { surfaceVariants } from './surface/surface'

// =============================================================================
// 默认导出
// =============================================================================

/**
 * Primitives 组件集合
 *
 * 包含所有基础原子组件，符合七轴主题系统 v1.4 SSOT 规范
 */
export const primitives = {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Surface,
  SurfaceDecoration,
} as const

// =============================================================================
// 组件使用指南
// =============================================================================

/**
 * 组件使用示例：
 *
 * ```typescript
 * import { Button, Card, Surface } from '@xorigo-ui/core/primitives'
 *
 * // 使用 Button 组件
 * <Button variant="primary" size="md" loading={false}>
 *   点击按钮
 * </Button>
 *
 * // 使用 Card 组件
 * <Card variant="elevated" size="md" hoverable>
 *   <CardHeader>
 *     <CardTitle>卡片标题</CardTitle>
 *     <CardDescription>卡片描述</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     卡片内容
 *   </CardContent>
 * </Card>
 *
 * // 使用 Surface 组件
 * <Surface variant="glass" size="lg" interactive="hover">
 *   <div>表面内容</div>
 * </Surface>
 * ```
 */
