/**
 * Xorigo UI Core - 向后兼容聚合包
 *
 * 这个包重新导出所有其他子包，提供统一的入口点
 * 符合新的架构层次设计
 */

// ============================================================================
// Layer 1: 基础设施层
// ============================================================================

// 设计令牌系统
export * from '@xorigo-ui/tokens'

// 主题系统和提供者
export * from '@xorigo-ui/system'

// 工具函数
export * from '@xorigo-ui/utils'

// AI智能系统
export * from './ai'

// 系统工具和配方库
export * from './system-tools/unified-theme-recipes'  // 统一主题配方（推荐使用）
export * from './system-tools/theme-utils'
// 旧版本配方库，保留兼容性但标记为废弃
// export * from './system-tools/complete-theme-recipes'
// export * from './system-tools/workbench-recipes'

// ============================================================================
// Layer 2: 组件层 (Components Layer) - 棕地架构 v1.5.1
// ============================================================================

// 表单组件 (包含所有输入控件)
export * from './form'

// 覆盖层组件
export * from './overlays'

// 反馈组件
export * from './feedback'

// 原子组件 (基础UI组件)
export * from './primitives'

// 数据展示组件 (包含图表和可视化)
// export * from './data-display' // 暂时注释，避免依赖问题

// 布局组件 (容器和结构)
// export * from './layout' // 暂时注释，避免依赖问题

// 导航组件 (菜单和导航)
// export * from './navigation' // 暂时注释，避免依赖问题

// 特效组件 (动画和视觉效果)
// export * from './effects' // 暂时注释，避免依赖问题

// 动画组件 (Framer Motion集成)
export * from './motion'

// 主题组件 (主题相关)
export * from './theme'

// 交互组件 (高级交互)
// export * from './interactive' // 暂时注释，避免依赖问题

// 加载组件 (加载指示器)
// export * from './loading' // 暂时注释，避免依赖问题

// 工具和实用程序
// export * from './utilities' // 暂时注释，避免依赖问题
export * from './utils'

// 展示组件 (演示和示例)
// export * from './showcase' // 暂时注释，避免依赖问题

// 服务端渲染组件
// export * from './ssr' // 暂时注释，避免依赖问题

// 基础原子组件 (Legacy - 逐步迁移)
export * from '@xorigo-ui/primitives'

// 营销页面组件（临时解决方案）
export * from './marketing-components'

// ============================================================================
// Legacy 兼容性导出
// ============================================================================

// 为了向后兼容，保留一些旧的导出别名
// export { default as default } from '@xorigo-ui/primitives' // 暂时注释掉，避免default导出问题
