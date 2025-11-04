/**
 * GridLines 组件默认配置
 *
 * 提供网格线组件的默认配置选项，
 * 可以通过修改这些配置来自定义网格线的外观和行为。
 */

// 默认网格线配置
export const defaultGridLineConfig = {
  // 水平网格线默认配置
  horizontal: {
    count: 5,
    color: 'currentColor',
    variant: 'default' as const,
    opacity: 'subtle' as const,
    showLabels: true,
  },

  // 垂直网格线默认配置
  vertical: {
    count: 6,
    color: 'currentColor',
    variant: 'default' as const,
    opacity: 'subtle' as const,
    showLabels: true,
  },

  // 坐标轴默认配置
  axes: {
    showAxes: true,
    axisStyle: 'default' as const,
    axisColor: 'currentColor',
  },

  // 动画默认配置
  animation: {
    animated: true,
    animationDuration: 0.8,
    animationDelay: 0,
  },
}

// 预定义的网格线主题样式
export const gridLineThemes = {
  // 简洁样式 - 细线、淡色
  minimal: {
    horizontal: {
      count: 5,
      color: 'currentColor',
      variant: 'default' as const,
      opacity: 'subtle' as const,
    },
    vertical: {
      count: 6,
      color: 'currentColor',
      variant: 'default' as const,
      opacity: 'subtle' as const,
    },
  },

  // 强调样式 - 粗线、深色
  emphasized: {
    horizontal: {
      count: 5,
      color: 'currentColor',
      variant: 'bold' as const,
      opacity: 'strong' as const,
    },
    vertical: {
      count: 6,
      color: 'currentColor',
      variant: 'bold' as const,
      opacity: 'strong' as const,
    },
  },

  // 虚线样式 - 用于特殊标记
  dashed: {
    horizontal: {
      count: 5,
      color: 'currentColor',
      variant: 'dashed' as const,
      opacity: 'medium' as const,
    },
    vertical: {
      count: 6,
      color: 'currentColor',
      variant: 'dashed' as const,
      opacity: 'medium' as const,
    },
  },

  // 点线样式 - 用于辅助信息
  dotted: {
    horizontal: {
      count: 5,
      color: 'currentColor',
      variant: 'dotted' as const,
      opacity: 'medium' as const,
    },
    vertical: {
      count: 6,
      color: 'currentColor',
      variant: 'dotted' as const,
      opacity: 'medium' as const,
    },
  },
}

// 常用边距预设
export const commonMargins = {
  // 紧凑布局
  compact: {
    top: 10,
    right: 20,
    bottom: 30,
    left: 40,
  },

  // 标准布局
  standard: {
    top: 20,
    right: 30,
    bottom: 40,
    left: 50,
  },

  // 宽松布局
  spacious: {
    top: 30,
    right: 40,
    bottom: 50,
    left: 60,
  },

  // 适合标签较多的图表
  labelRich: {
    top: 20,
    right: 40,
    bottom: 60,
    left: 60,
  },
}

// 导出所有配置
export default defaultGridLineConfig
