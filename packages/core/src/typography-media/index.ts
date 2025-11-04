/**
 * 📝 Typography & Media 统一导出 - v2025.11.03
 *
 * 文本与媒体组件分类
 * 包含排版、代码、图片、视频等组件
 *
 * @version 2025.11.03
 * @category Typography & Media
 * @layer component
 */

// 文本组件
export {
  Heading,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  type HeadingProps,
  type HeadingLevel
} from './heading'

export {
  Text,
  Paragraph,
  Span,
  Small,
  Strong,
  Em,
  type TextProps,
  type TextSize
} from './text'

export {
  Blockquote,
  type BlockquoteProps
} from './blockquote'

export {
  Code,
  Pre,
  InlineCode,
  CodeBlock,
  type CodeProps,
  type PreProps
} from './code'

// 媒体组件
export {
  Image,
  ResponsiveImage,
  Avatar,
  type ImageProps,
  type ResponsiveImageProps,
  type AvatarProps,
  type ObjectPosition,
  type ImageLoadingState
} from './image'

export {
  Video,
  type VideoProps,
  type VideoSource,
  type PlaybackState
} from './video'

// 类型导出
export type {
  // Text & Typography
  HeadingLevel,
  TextSize,
  ObjectPosition,
  ImageLoadingState,
  PlaybackState
}