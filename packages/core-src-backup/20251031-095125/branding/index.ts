/**
 * Xorigo UI 品牌组件 - 项目专属品牌标识
 *
 * 包含 Xorigo 品牌Logo和相关品牌元素
 * 支持智能容器感知颜色适配
 */

export type { XorigoLogoProps } from './xorigo-logo'
export type { Mode } from './xorigo-logo'
export { XorigoLogo } from './xorigo-logo'

// 容器感知颜色工具导出
export type { ContainerAwareColors, UseContainerAwareColorsOptions } from '../hooks/useContainerAwareColors'
export { useContainerAwareColors } from '../hooks/useContainerAwareColors'
export { ColorUtils, SmartPaletteGenerator } from '../utils/container-aware-colors'

// 兼容性导出 - 保持向后兼容
export type { XorigoLogoProps as NavbarOriginLogoProps } from './xorigo-logo'
export { XorigoLogo as NavbarOriginLogo } from './xorigo-logo'