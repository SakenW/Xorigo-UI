'use client'

import { Heading } from './heading'
import { Text } from './text'
import { Caption } from './caption'

// Typography 组件集合导出
export { Heading } from './heading'
export { Text } from './text'
export { Caption } from './caption'

export type { HeadingProps } from './heading'
export type { TextProps } from './text'
export type { CaptionProps } from './caption'

// Typography 组件集合
export const Typography = {
  Heading,
  Text,
  Caption,
} as const