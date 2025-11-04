/**
 * ChipDisplay 展示型芯片组件
 *
 * 用于显示标签、状态、信息等内容的展示型芯片组件。
 * 支持多种颜色、变体和尺寸，集成七轴主题系统。
 *
 * @example
 * ```tsx
 * import { ChipDisplay } from '@xorigo-ui/core'
 *
 * // 基础使用
 * <ChipDisplay label="Default Chip" />
 *
 * // 带颜色
 * <ChipDisplay label="Success" color="success" />
 *
 * // 带图标
 * <ChipDisplay
 *   label="With Icon"
 *   leftIcon={<Icon />}
 * />
 *
 * // 带头像
 * <ChipDisplay
 *   label="John Doe"
 *   avatar="https://example.com/avatar.jpg"
 * />
 *
 * // 可关闭
 * <ChipDisplay
 *   label="Closable"
 *   isClosable={true}
 *   onClose={(e) => console.log('Closed')}
 * />
 * ```
 */

export { ChipDisplay, chipVariants, iconSizeVariants } from './chip-display'
export type { ChipDisplayVariants } from './chip-display'
