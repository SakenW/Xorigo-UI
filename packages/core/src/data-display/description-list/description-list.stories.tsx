/**
 * @fileoverview Description List Component Stories
 * @description 描述列表组件的 Storybook 故事文件，展示各种使用场景
 * @author Xorigo UI Team
 * @version 1.0.0
 */

import type { Meta, StoryObj } from '@storybook/react';
import { DescriptionList } from './description-list';
import {
  React,
  TypeScript,
  Vite,
  Palette,
  Layers,
  Code,
  Zap,
  Globe,
  Database,
  Shield,
  Palette as PaletteIcon,
  Cpu,
  Moon,
  Sun,
} from 'lucide-react';

// ============================================================================
// 元数据配置
// ============================================================================

const meta = {
  title: 'Data Display/Description List',
  component: DescriptionList,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
描述列表组件用于展示术语和定义的对应关系，支持多种布局模式、分组显示和交互功能。

## 特性
- 支持垂直/水平/自动布局
- 支持分组和可折叠功能
- 支持图标显示
- 支持一键复制
- 支持自定义渲染
- 完全响应式设计
- 优秀的可访问性支持

## 使用场景
- 文档页面术语解释
- 产品功能特性展示
- API 文档参数说明
- 技术栈信息展示
- 配置项说明文档
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['vertical', 'horizontal', 'auto'],
      description: '布局变体',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '组件尺寸',
    },
    density: {
      control: 'select',
      options: ['compact', 'normal', 'comfortable'],
      description: '间距密度',
    },
    showIcons: {
      control: 'boolean',
      description: '是否显示图标',
    },
    showDividers: {
      control: 'boolean',
      description: '是否显示分隔线',
    },
    copyable: {
      control: 'boolean',
      description: '是否启用复制功能',
    },
    collapsible: {
      control: 'boolean',
      description: '是否支持折叠（对分组生效）',
    },
    defaultCollapsed: {
      control: 'boolean',
      description: '默认是否折叠',
    },
    label: {
      control: 'text',
      description: '列表标题',
    },
    ariaLabel: {
      control: 'text',
      description: 'aria-label 属性',
    },
  },
  args: {
    variant: 'auto',
    size: 'md',
    density: 'normal',
    showIcons: false,
    showDividers: false,
    copyable: false,
    collapsible: false,
    defaultCollapsed: false,
  },
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// 基础故事
// ============================================================================

export const Default: Story = {
  args: {
    label: '前端技术栈',
    items: [
      {
        term: 'React',
        description: '用于构建用户界面的 JavaScript 库，由 Facebook 开发并开源',
      },
      {
        term: 'TypeScript',
        description: '带类型检查的 JavaScript 超集，提供更好的开发体验',
      },
      {
        term: 'Vite',
        description: '下一代前端构建工具，提供极快的开发服务器启动',
      },
      {
        term: 'Tailwind CSS',
        description: '实用优先的 CSS 框架，快速构建现代化界面',
      },
    ],
  },
};

// ============================================================================
// 布局变体故事
// ============================================================================

export const VerticalLayout: Story = {
  name: '垂直布局',
  args: {
    variant: 'vertical',
    label: '垂直布局',
    items: [
      {
        term: 'React',
        description: '用于构建用户界面的 JavaScript 库',
      },
      {
        term: 'TypeScript',
        description: '带类型检查的 JavaScript 超集',
      },
      {
        term: 'Vite',
        description: '下一代前端构建工具',
      },
    ],
  },
};

export const HorizontalLayout: Story = {
  name: '水平布局',
  args: {
    variant: 'horizontal',
    label: '水平布局',
    items: [
      {
        term: 'React',
        description: '用于构建用户界面的 JavaScript 库',
      },
      {
        term: 'TypeScript',
        description: '带类型检查的 JavaScript 超集',
      },
      {
        term: 'Vite',
        description: '下一代前端构建工具',
      },
    ],
  },
};

export const AutoLayout: Story = {
  name: '自动布局',
  args: {
    variant: 'auto',
    label: '自动布局（响应式）',
    items: [
      {
        term: 'React',
        description: '用于构建用户界面的 JavaScript 库',
      },
      {
        term: 'TypeScript',
        description: '带类型检查的 JavaScript 超集',
      },
      {
        term: 'Vite',
        description: '下一代前端构建工具',
      },
      {
        term: 'Tailwind CSS',
        description: '实用优先的 CSS 框架',
      },
    ],
  },
};

// ============================================================================
// 图标展示故事
// ============================================================================

export const WithIcons: Story = {
  name: '带图标',
  args: {
    label: '前端技术栈',
    showIcons: true,
    items: [
      {
        term: 'React',
        description: '用于构建用户界面的 JavaScript 库',
        icon: <React size={18} />,
      },
      {
        term: 'TypeScript',
        description: '带类型检查的 JavaScript 超集',
        icon: <TypeScript size={18} />,
      },
      {
        term: 'Vite',
        description: '下一代前端构建工具',
        icon: <Zap size={18} />,
      },
      {
        term: 'Tailwind CSS',
        description: '实用优先的 CSS 框架',
        icon: <Palette size={18} />,
      },
    ],
  },
};

// ============================================================================
// 尺寸变体故事
// ============================================================================

export const SmallSize: Story = {
  name: '小尺寸',
  args: {
    size: 'sm',
    label: '小尺寸',
    items: [
      {
        term: 'React',
        description: '用于构建用户界面的 JavaScript 库',
      },
      {
        term: 'TypeScript',
        description: '带类型检查的 JavaScript 超集',
      },
    ],
  },
};

export const MediumSize: Story = {
  name: '中等尺寸',
  args: {
    size: 'md',
    label: '中等尺寸',
    items: [
      {
        term: 'React',
        description: '用于构建用户界面的 JavaScript 库',
      },
      {
        term: 'TypeScript',
        description: '带类型检查的 JavaScript 超集',
      },
    ],
  },
};

export const LargeSize: Story = {
  name: '大尺寸',
  args: {
    size: 'lg',
    label: '大尺寸',
    items: [
      {
        term: 'React',
        description: '用于构建用户界面的 JavaScript 库',
      },
      {
        term: 'TypeScript',
        description: '带类型检查的 JavaScript 超集',
      },
    ],
  },
};

// ============================================================================
// 密度变体故事
// ============================================================================

export const CompactDensity: Story = {
  name: '紧密密度',
  args: {
    density: 'compact',
    label: '紧密密度',
    items: [
      {
        term: 'React',
        description: '用于构建用户界面',
      },
      {
        term: 'TypeScript',
        description: '带类型检查的 JavaScript',
      },
    ],
  },
};

export const NormalDensity: Story = {
  name: '正常密度',
  args: {
    density: 'normal',
    label: '正常密度',
    items: [
      {
        term: 'React',
        description: '用于构建用户界面',
      },
      {
        term: 'TypeScript',
        description: '带类型检查的 JavaScript',
      },
    ],
  },
};

export const ComfortableDensity: Story = {
  name: '舒适密度',
  args: {
    density: 'comfortable',
    label: '舒适密度',
    items: [
      {
        term: 'React',
        description: '用于构建用户界面',
      },
      {
        term: 'TypeScript',
        description: '带类型检查的 JavaScript',
      },
    ],
  },
};

// ============================================================================
// 复制功能故事
// ============================================================================

export const WithCopyFeature: Story = {
  name: '可复制',
  args: {
    label: '技术栈信息',
    copyable: true,
    items: [
      {
        term: 'React',
        description: '用于构建用户界面的 JavaScript 库',
        value: 'React',
      },
      {
        term: 'TypeScript',
        description: '带类型检查的 JavaScript 超集',
        value: 'TypeScript',
      },
      {
        term: 'Vite',
        description: '下一代前端构建工具',
        value: 'Vite',
      },
    ],
  },
};

// ============================================================================
// 分组功能故事
// ============================================================================

export const WithGroups: Story = {
  name: '分组显示',
  args: {
    groups: [
      {
        title: '前端框架',
        icon: <Layers size={18} />,
        items: [
          {
            term: 'React',
            description: '用于构建用户界面的 JavaScript 库',
            icon: <React size={16} />,
          },
          {
            term: 'Vue',
            description: '渐进式 JavaScript 框架',
            icon: <Code size={16} />,
          },
        ],
      },
      {
        title: '构建工具',
        icon: <Cpu size={18} />,
        items: [
          {
            term: 'Vite',
            description: '下一代前端构建工具',
            icon: <Zap size={16} />,
          },
          {
            term: 'Webpack',
            description: '模块打包器',
            icon: <Database size={16} />,
          },
        ],
      },
      {
        title: '样式方案',
        icon: <PaletteIcon size={18} />,
        items: [
          {
            term: 'Tailwind CSS',
            description: '实用优先的 CSS 框架',
          },
          {
            term: 'Sass',
            description: 'CSS 预处理语言',
          },
        ],
      },
    ],
  },
};

export const WithCollapsibleGroups: Story = {
  name: '可折叠分组',
  args: {
    groups: [
      {
        title: '前端框架',
        icon: <Layers size={18} />,
        collapsible: true,
        defaultCollapsed: true,
        items: [
          {
            term: 'React',
            description: '用于构建用户界面的 JavaScript 库',
          },
          {
            term: 'Vue',
            description: '渐进式 JavaScript 框架',
          },
        ],
      },
      {
        title: '构建工具',
        icon: <Cpu size={18} />,
        collapsible: true,
        defaultCollapsed: false,
        items: [
          {
            term: 'Vite',
            description: '下一代前端构建工具',
          },
          {
            term: 'Webpack',
            description: '模块打包器',
          },
        ],
      },
    ],
  },
};

export const WithCollapsibleAndCopy: Story = {
  name: '分组 + 复制功能',
  args: {
    copyable: true,
    groups: [
      {
        title: '前端框架',
        icon: <Layers size={18} />,
        collapsible: true,
        items: [
          {
            term: 'React',
            description: '用于构建用户界面的 JavaScript 库',
            value: 'React',
          },
          {
            term: 'Vue',
            description: '渐进式 JavaScript 框架',
            value: 'Vue',
          },
        ],
      },
      {
        title: '构建工具',
        icon: <Cpu size={18} />,
        collapsible: true,
        items: [
          {
            term: 'Vite',
            description: '下一代前端构建工具',
            value: 'Vite',
          },
          {
            term: 'Webpack',
            description: '模块打包器',
            value: 'Webpack',
          },
        ],
      },
    ],
  },
};

// ============================================================================
// 实际使用场景故事
// ============================================================================

export const API Documentation: Story = {
  name: 'API 文档示例',
  args: {
    label: 'API 参数说明',
    variant: 'horizontal',
    items: [
      {
        term: 'method',
        description: 'HTTP 请求方法',
        icon: <Code size={16} />,
      },
      {
        term: 'endpoint',
        description: 'API 端点地址',
        icon: <Globe size={16} />,
      },
      {
        term: 'headers',
        description: '请求头配置对象',
        icon: <Shield size={16} />,
      },
      {
        term: 'body',
        description: '请求体数据（可选）',
        icon: <Database size={16} />,
      },
    ],
  },
};

export const Product Features: Story = {
  name: '产品功能特性',
  args: {
    label: 'Xorigo UI 特性',
    showIcons: true,
    items: [
      {
        term: '响应式设计',
        description: '完美适配各种屏幕尺寸和设备类型',
        icon: <Globe size={18} />,
      },
      {
        term: '主题系统',
        description: '支持多种主题和自定义主题配置',
        icon: <Palette size={18} />,
      },
      {
        term: '类型安全',
        description: '完整的 TypeScript 类型支持',
        icon: <Shield size={18} />,
      },
      {
        term: '高性能',
        description: '优化的渲染性能，轻量级打包体积',
        icon: <Zap size={18} />,
      },
      {
        term: '国际化',
        description: '内置国际化支持，多语言无缝切换',
        icon: <Globe size={18} />,
      },
      {
        term: '可访问性',
        description: '符合 WCAG 标准，支持屏幕阅读器',
        icon: <Shield size={18} />,
      },
    ],
  },
};

export const ConfigurationGuide: Story = {
  name: '配置指南',
  args: {
    label: '主题配置',
    variant: 'vertical',
    size: 'sm',
    density: 'compact',
    items: [
      {
        term: 'mode',
        description: '主题模式：light（浅色）、dark（深色）或 auto（跟随系统）',
      },
      {
        term: 'hue',
        description: '色调值：0-360 之间的数值',
      },
      {
        term: 'saturation',
        description: '饱和度：0-100 之间的百分比值',
      },
      {
        term: 'lightness',
        description: '亮度：0-100 之间的百分比值',
      },
      {
        term: 'density',
        description: '密度：compact（紧密）、normal（正常）或 comfortable（舒适）',
      },
      {
        term: 'roundness',
        description: '圆角：0-100 之间的百分比值',
      },
      {
        term: 'contrast',
        description: '对比度：normal（标准）或 high（高对比）',
      },
    ],
  },
};

export const DarkModeShowcase: Story = {
  name: '深色模式展示',
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  args: {
    label: '深色模式效果',
    showIcons: true,
    items: [
      {
        term: 'Moon',
        description: '深色主题，支持自动和手动切换',
        icon: <Moon size={18} />,
      },
      {
        term: 'Sun',
        description: '浅色主题，明亮清晰',
        icon: <Sun size={18} />,
      },
      {
        term: 'Auto',
        description: '跟随系统设置自动切换',
        icon: <Globe size={18} />,
      },
    ],
  },
};

// ============================================================================
// 自定义渲染故事
// ============================================================================

export const WithCustomRendering: Story = {
  name: '自定义渲染',
  args: {
    label: '自定义项目渲染',
    renderCustomItem: (item, index) => {
      return (
        <div
          key={index}
          className="p-4 rounded-lg border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            {item.icon && (
              <div className="p-2 rounded-md bg-primary/10 text-primary">
                {item.icon}
              </div>
            )}
            <div className="flex-1">
              <div className="font-semibold text-foreground">{item.term}</div>
              <div className="text-sm text-foreground-muted">{item.description}</div>
            </div>
          </div>
        </div>
      );
    },
    items: [
      {
        term: '自定义项目 1',
        description: '这是一个自定义渲染的项目',
        icon: <Code size={20} />,
      },
      {
        term: '自定义项目 2',
        description: '这是另一个自定义渲染的项目',
        icon: <Zap size={20} />,
      },
    ],
  },
};

// ============================================================================
// 组合故事
// ============================================================================

export const FullFeatured: Story = {
  name: '完整功能',
  args: {
    label: '完整功能展示',
    variant: 'auto',
    size: 'md',
    density: 'normal',
    showIcons: true,
    showDividers: false,
    copyable: true,
    items: [
      {
        term: 'React 19',
        description: '最新版本，包含并发特性和改进的性能',
        value: 'React 19',
        icon: <React size={18} />,
      },
      {
        term: 'TypeScript 5.9',
        description: '最新版本，提供更好的类型推断和开发体验',
        value: 'TypeScript 5.9',
        icon: <TypeScript size={18} />,
      },
      {
        term: 'Vite 5',
        description: '极快的构建工具，支持热更新和现代化开发',
        value: 'Vite 5',
        icon: <Zap size={18} />,
      },
    ],
  },
};
