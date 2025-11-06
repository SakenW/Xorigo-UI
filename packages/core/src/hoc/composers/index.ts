/**
 * @fileoverview HOC组合系统模块统一导出
 * @description 提供所有HOC组合功能的统一导出点
 */

export {
  default as compose,
  composeHOCs,
  defer,
  when,
  applyVariants,
  createComposer,
  type ComposeOptions,
  type MergeFunction,
} from './compose'

export {
  default as withMergeProps,
  mergeConfigs,
  createChainMerger,
  type MergeConfig,
  type ConflictResolutionStrategy,
} from './merge'

export {
  default as withChain,
  createChainTool,
  ChainHelper,
  type ChainConfig,
  type ChainInstance,
} from './chain'

export {
  default as withDisplayName,
  setDisplayNameForChain,
  DisplayNameBuilder,
  DISPLAY_NAME_PRESETS,
  autoDisplayName,
  type DisplayNameConfig,
  type ComponentNameInfo,
} from './displayName'
