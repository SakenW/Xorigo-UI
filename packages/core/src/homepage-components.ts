// 首页专用组件导出 - 仅包含必要的组件以减少模块加载
// 这个文件专门为首页性能优化而创建

// Logo 相关
export { XorigoLogo } from './branding'

// Hero 相关
export { HeroTitle } from './typography'

// 基础组件
export { Button } from './primitives'
export { StatCard } from './data-display'

// 主题相关
export { ThemeSwitcher } from './system'

// 背景动画
export {
  AnimatedBackground,
  BreathingBackground
} from './effects'

// 可访问性
export { SkipLink } from './utils/accessibility'
export { runAccessibilityTests } from './utils/accessibility-tester'