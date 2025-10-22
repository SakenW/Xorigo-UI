/**
 * Layout 组件导出 - 符合七轴主题系统 v1.4 SSOT
 *
 * 布局组件集合 - Container, Stack, Flex, Grid, Spacer
 */

// =============================================================================
// 核心组件导出
// =============================================================================

// Container 组件系列
export {
  Container,
  containerVariants,
  Section,
  Page,
  Content,
  CardContainer
} from './container/container'
export type {
  ContainerProps,
  SectionProps
} from './container/container'

// Stack 组件系列
export {
  Stack,
  stackVariants,
  VStack,
  HStack,
  Spacer as StackSpacer,
  Divider as StackDivider
} from './stack/stack'
export type {
  StackProps,
  VStackProps,
  HStackProps,
  SpacerProps as StackSpacerProps,
  DividerProps as StackDividerProps
} from './stack/stack'

// Flex 组件系列
export {
  Flex,
  flexVariants,
  FlexItem,
  FlexCenter,
  FlexBetween,
  FlexEvenly,
  FlexSpacer
} from './flex/flex'
export type {
  FlexProps,
  FlexItemProps,
  FlexCenterProps,
  FlexBetweenProps,
  FlexEvenlyProps,
  FlexSpacerProps
} from './flex/flex'

// Grid 组件系列
export {
  Grid,
  gridVariants,
  GridItem,
  SimpleGrid,
  AspectRatioGrid
} from './grid/grid'
export type {
  GridProps,
  GridItemProps,
  SimpleGridProps,
  AspectRatioGridProps
} from './grid/grid'

// Spacer 组件系列
export {
  Spacer,
  spacerVariants,
  VSpace,
  HSpace,
  FlexSpacer as LayoutFlexSpacer,
  DividerSpace,
  createSpacer,
  createResponsiveSpacer
} from './spacer/spacer'
export type {
  SpacerProps,
  VSpaceProps,
  HSpaceProps,
  FlexSpacerProps as LayoutFlexSpacerProps,
  DividerSpaceProps
} from './spacer/spacer'

// =============================================================================
// 便捷组合导出
// =============================================================================

/**
 * 基础布局组件组合
 */
export const BaseLayout = {
  Container,
  Stack,
  Flex,
  Grid,
} as const

/**
 * 间距控制组件组合
 */
export const SpacingComponents = {
  Spacer,
  VSpace,
  HSpace,
  DividerSpace,
} as const

/**
 * 容器组件组合
 */
export const ContainerComponents = {
  Container,
  Section,
  Page,
  Content,
  CardContainer,
} as const

/**
 * 弹性布局组件组合
 */
export const FlexComponents = {
  Flex,
  FlexItem,
  FlexCenter,
  FlexBetween,
  FlexEvenly,
  FlexSpacer,
} as const

/**
 * 网格布局组件组合
 */
export const GridComponents = {
  Grid,
  GridItem,
  SimpleGrid,
  AspectRatioGrid,
} as const

/**
 * 堆叠布局组件组合
 */
export const StackComponents = {
  Stack,
  VStack,
  HStack,
  StackSpacer,
  StackDivider,
} as const

/**
 * 完整布局组件集合
 */
export const LayoutComponents = {
  ...BaseLayout,
  ...SpacingComponents,
  ...ContainerComponents,
  ...FlexComponents,
  ...GridComponents,
  ...StackComponents,
} as const

// =============================================================================
// 类型导出
// =============================================================================

/**
 * 所有布局组件的 Props 类型联合
 */
export type LayoutComponentProps =
  | ContainerProps
  | StackProps
  | FlexProps
  | GridProps
  | SpacerProps

/**
 * 布局组件方向类型
 */
export type LayoutDirection =
  | 'row'
  | 'col'
  | 'row-reverse'
  | 'col-reverse'
  | 'vertical'
  | 'horizontal'
  | 'responsive'

/**
 * 布局组件对齐类型
 */
export type LayoutAlignment =
  | 'start'
  | 'end'
  | 'center'
  | 'between'
  | 'around'
  | 'evenly'
  | 'stretch'
  | 'baseline'

/**
 * 布局组件尺寸类型
 */
export type LayoutSize =
  | 'none'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | '8xl'
  | 'auto'
  | 'full'
  | 'screen'

/**
 * 布局组件间距类型
 */
export type LayoutSpacing =
  | 'none'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'

// =============================================================================
// 默认配置导出
// =============================================================================

/**
 * 默认的 Container 配置
 */
export const defaultContainerConfig = {
  size: '7xl' as const,
  py: 'none' as const,
  px: 'sm' as const,
  centered: false,
} as const

/**
 * 默认的 Stack 配置
 */
export const defaultStackConfig = {
  direction: 'col' as const,
  spacing: 'md' as const,
  justify: 'start' as const,
  align: 'start' as const,
} as const

/**
 * 默认的 Flex 配置
 */
export const defaultFlexConfig = {
  direction: 'row' as const,
  justify: 'start' as const,
  align: 'start' as const,
  wrap: 'nowrap' as const,
  gap: 'none' as const,
} as const

/**
 * 默认的 Grid 配置
 */
export const defaultGridConfig = {
  cols: 'auto' as const,
  gap: 'md' as const,
  flow: 'row' as const,
} as const

/**
 * 默认的 Spacer 配置
 */
export const defaultSpacerConfig = {
  direction: 'vertical' as const,
  size: 'md' as const,
  visible: false,
} as const

// =============================================================================
// 工具函数导出
// =============================================================================

/**
 * 创建标准容器的便捷函数
 */
export const createStandardContainer = (props: Partial<ContainerProps> = {}) => {
  return {
    ...defaultContainerConfig,
    ...props,
  }
}

/**
 * 创建标准堆叠的便捷函数
 */
export const createStandardStack = (props: Partial<StackProps> = {}) => {
  return {
    ...defaultStackConfig,
    ...props,
  }
}

/**
 * 创建标准弹性布局的便捷函数
 */
export const createStandardFlex = (props: Partial<FlexProps> = {}) => {
  return {
    ...defaultFlexConfig,
    ...props,
  }
}

/**
 * 创建标准网格的便捷函数
 */
export const createStandardGrid = (props: Partial<GridProps> = {}) => {
  return {
    ...defaultGridConfig,
    ...props,
  }
}

/**
 * 创建标准间距的便捷函数
 */
export const createStandardSpacer = (size: LayoutSpacing = 'md') => {
  return {
    ...defaultSpacerConfig,
    size,
  }
}

// =============================================================================
// 主题集成导出
// =============================================================================

/**
 * 布局组件的主题 CSS 变量映射
 */
export const layoutThemeVariables = {
  // Container 主题变量
  '--container-bg': 'hsl(var(--background))',
  '--container-text': 'hsl(var(--foreground))',
  '--container-border': 'hsl(var(--border))',

  // Stack 主题变量
  '--stack-divider': 'hsl(var(--border))',

  // Flex 主题变量
  '--flex-gap-color': 'hsl(var(--border))',

  // Grid 主题变量
  '--grid-gap-color': 'hsl(var(--border))',

  // Spacer 主题变量
  '--spacer-bg': 'hsl(var(--muted))',
  '--spacer-border': 'hsl(var(--border))',
} as const

/**
 * 布局组件的标准主题类名
 */
export const layoutThemeClasses = {
  // 容器样式
  container: 'w-full mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-12 sm:py-16 lg:py-20',
  content: 'max-w-prose mx-auto',

  // 间距样式
  spacing: {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-10',
    '3xl': 'gap-12',
    '4xl': 'gap-16',
  },

  // 对齐样式
  alignment: {
    center: 'items-center justify-center',
    start: 'items-start justify-start',
    end: 'items-end justify-end',
    between: 'items-center justify-between',
  },

  // 方向样式
  direction: {
    row: 'flex-row',
    col: 'flex-col',
    responsive: 'flex-col sm:flex-row',
  },
} as const

// =============================================================================
// 预设布局导出
// =============================================================================

/**
 * 页面布局预设
 */
export const PageLayoutPresets = {
  // 标准页面布局
  standard: {
    container: { size: '7xl' as const, py: 'lg' as const },
    header: { direction: 'col' as const, spacing: 'md' as const },
    main: { direction: 'col' as const, spacing: 'lg' as const },
    footer: { direction: 'row' as const, justify: 'between' as const },
  },

  // 居中布局
  centered: {
    container: { centered: true, minHeight: 'screen' as const },
    content: { direction: 'col' as const, align: 'center' as const, gap: 'lg' as const },
  },

  // 侧边栏布局
  sidebar: {
    container: { direction: 'row' as const, gap: 'lg' as const },
    sidebar: { basis: '1/4' as const, shrink: '0' as const },
    main: { grow: 'true' as const, direction: 'col' as const },
  },

  // 网格布局
  grid: {
    container: { cols: 'auto' as const, gap: 'lg' as const, autoFit: true },
    item: { direction: 'col' as const, gap: 'sm' as const },
  },
} as const

/**
 * 组件布局预设
 */
export const ComponentLayoutPresets = {
  // 卡片布局
  card: {
    container: { direction: 'col' as const, gap: 'md' as const, p: 'lg' as const, background: 'card' as const },
    header: { direction: 'row' as const, justify: 'between' as const, align: 'center' as const },
    content: { direction: 'col' as const, gap: 'sm' as const },
    footer: { direction: 'row' as const, justify: 'end' as const, gap: 'sm' as const },
  },

  // 表单布局
  form: {
    container: { direction: 'col' as const, gap: 'lg' as const },
    field: { direction: 'col' as const, gap: 'sm' as const },
    actions: { direction: 'row' as const, justify: 'end' as const, gap: 'sm' as const },
  },

  // 导航布局
  navigation: {
    container: { direction: 'row' as const, justify: 'between' as const, align: 'center' as const },
    brand: { align: 'start' as const },
    links: { direction: 'row' as const, gap: 'lg' as const, align: 'center' as const },
    actions: { direction: 'row' as const, gap: 'sm' as const, align: 'center' as const },
  },

  // 列表布局
  list: {
    container: { direction: 'col' as const, gap: 'sm' as const },
    item: { direction: 'row' as const, gap: 'md' as const, align: 'center' as const },
  },
} as const