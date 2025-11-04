/**
 * Avatar Group Component
 * 头像组组件
 *
 * 用于显示多个头像的组合，支持多种排列方式、溢出折叠、工具提示等功能。
 * 基于七轴主题系统设计，确保在不同主题下的一致性。
 *
 * @module AvatarGroup
 */

export { AvatarGroup } from './avatar-group'
export { avatarGroupVariants, overflowVariants } from './avatar-group'
export type {
  AvatarGroupProps,
  AvatarGroupVariants,
  OverflowVariants,
} from './avatar-group'

// 重新导出 Avatar 以便用户可以直接使用
export { Avatar } from '../avatar'
export type { AvatarProps, AvatarVariants, StatusVariants } from '../avatar'
