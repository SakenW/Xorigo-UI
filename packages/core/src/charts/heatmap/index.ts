/**
 * @fileoverview Heatmap 组件统一导出
 * @description 热力图组件的完整导出，包含类型定义
 *
 * 此文件是模块的公共接口，遵循以下设计原则：
 * 1. 单一导出原则 - 集中导出所有公共 API
 * 2. 命名空间清晰 - 避免命名冲突
 * 3. _tree-shaking 友好 - 支持按需导入
 * 4. 文档自动生成 - 为文档系统提供入口
 *
 * 导出内容：
 * - Heatmap 主组件
 * - HeatmapProps 类型定义
 * - HeatmapDataPoint 类型定义
 * - HeatmapSeries 类型定义
 *
 * 使用示例：
 * ```typescript
 * // 导入组件和类型
 * import { Heatmap, type HeatmapProps } from '@xorigo-ui/core/charts/heatmap'
 *
 * // 使用组件
 * const MyChart = () => {
 *   const data = [...]
 *   return <Heatmap data={data} showValues />
 * }
 * ```
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 * @since 2025-11-04
 */

// ============================================================================
// 主组件导出
// ============================================================================

/**
 * Heatmap 主组件
 * 用于数据可视化的热力图组件，通过颜色深浅表示数值大小
 *
 * @example
 * ```tsx
 * import { Heatmap } from '@xorigo-ui/core/charts/heatmap'
 *
 * const data = [
 *   {
 *     name: '产品销售',
 *     data: [
 *       { x: '北京', y: '1月', value: 120 },
 *       { x: '上海', y: '1月', value: 180 }
 *     ]
 *   }
 * ]
 *
 * <Heatmap
 *   data={data}
 *   showValues={true}
 *   showTooltip={true}
 *   showLegend={true}
 * />
 * ```
 *
 * @see {@link HeatmapProps} - 查看组件的完整 props 定义
 */
export { Heatmap } from './heatmap'

// ============================================================================
// 类型定义导出
// ============================================================================

/**
 * Heatmap 组件的完整属性类型定义
 * 包含所有必需的 prop 和可选的配置项
 *
 * @example
 * ```typescript
 * import { type HeatmapProps } from '@xorigo-ui/core/charts/heatmap'
 *
 * const props: HeatmapProps = {
 *   data: myData,
 *   showValues: true,
 *   cellGap: 4,
 *   onCellClick: (data, series) => {
 *     console.log('Cell clicked:', data)
 *   }
 * }
 * ```
 */
export type { HeatmapProps } from './heatmap'

/**
 * 热力图数据点的类型定义
 * 表示热力图中的单个数据单元
 *
 * @example
 * ```typescript
 * import { type HeatmapDataPoint } from '@xorigo-ui/core/charts/heatmap'
 *
 * const dataPoint: HeatmapDataPoint = {
 *   x: '北京',
 *   y: '1月',
 *   value: 120,
 *   category: '产品A' // 可选的扩展属性
 * }
 * ```
 */
export type { HeatmapDataPoint } from './heatmap'

/**
 * 热力图数据系列类型定义
 * 表示一个完整的数据系列，包含名称和数据点数组
 *
 * @example
 * ```typescript
 * import { type HeatmapSeries } from '@xorigo-ui/core/charts/heatmap'
 *
 * const series: HeatmapSeries = {
 *   name: '2024年销售数据',
 *   data: [
 *     { x: '北京', y: 'Q1', value: 120 },
 *     { x: '上海', y: 'Q1', value: 180 }
 *   ],
 *   visible: true // 可选属性
 * }
 * ```
 */
export type { HeatmapSeries } from './heatmap'

// ============================================================================
// 模块元数据
// ============================================================================

/**
 * 模块名称
 * 用于调试和错误信息
 */
export const __MODULE_NAME__ = 'Heatmap'

/**
 * 模块版本
 * 用于版本控制和依赖管理
 */
export const __MODULE_VERSION__ = '1.0.0'

/**
 * 模块路径
 * 用于文档系统和导入追踪
 */
export const __MODULE_PATH__ = '@xorigo-ui/core/charts/heatmap'
