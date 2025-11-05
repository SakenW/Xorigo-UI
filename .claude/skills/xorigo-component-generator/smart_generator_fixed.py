#!/usr/bin/env python3
"""
Xorigo UI 组件生成器 v2025.11.05 - 智能增强版
集成 zoxide 路径管理和高级智能推断功能
"""

import os
import re
import sys
import subprocess
from pathlib import Path
from typing import Dict, List, Optional, Tuple

class SmartComponentGenerator:
    def __init__(self, base_path: str = None):
        # 智能路径检测和初始化
        self.base_path = Path(base_path) if base_path else self._detect_project_path()

        # 验证项目结构
        if not self._validate_project_structure():
            raise ValueError("❌ 无效的 Xorigo UI 项目路径")

        # v2025.11.05 架构 - 17个组件分类 + 智能增强 (基于文档: component-taxonomy-v2025.11.03.yaml)
        self.component_categories = {
            # 系统层 - Foundations
            "foundations": {
                "description": "🔹 Foundations · 设计基础 - 静态设计令牌与基础样式",
                "examples": ["ColorSystem", "TypographySystem", "SpacingSystem", "RadiusSystem", "ShadowSystem"],
                "auto_features": ["tokens", "constants", "variables", "export"],
                "complexity": "system",
                "dependencies": ["css-variables", "design-tokens"]
            },

            # 系统层 - System
            "system": {
                "description": "🔹 System · 系统能力 - 跨组件机制，支撑所有组件",
                "examples": ["ThemingEngine", "BreakpointsResponsive", "ColorModes", "AccessibilitySystem"],
                "auto_features": ["themeIntegration", "provider", "hooks", "utils"],
                "complexity": "system",
                "dependencies": ["next-themes", "zustand", "@radix-ui/react-accessibility"]
            },

            # 原子级组件
            "primitives": {
                "description": "🔷 Primitives · 原子级组件 - 少而精，高复用、跨大量组件的「砖」",
                "examples": ["Box", "Surface", "Flex", "Stack", "Text", "ButtonBase", "InputBase"],
                "auto_features": ["variants", "accessibility", "forwardRef", "composition"],
                "complexity": "basic",
                "dependencies": ["react", "framer-motion", "class-variance-authority"]
            },

            # 组件层 - Layout
            "layout": {
                "description": "📐 Layout · 布局 - 页面级布局和容器组件",
                "examples": ["Container", "SimpleGrid", "Wrap", "SplitView", "Divider", "AppLayout"],
                "auto_features": ["responsive", "gap", "alignment", "direction"],
                "complexity": "medium",
                "dependencies": ["@radix-ui/react-separator", "react-resizable"]
            },

            # 组件层 - Navigation
            "navigation": {
                "description": "🧭 Navigation · 导航 - 页面导航和路由相关组件",
                "examples": ["Navbar", "Sidebar", "Tabs", "Menu", "Breadcrumb", "Pagination"],
                "auto_features": ["keyboard", "routerIntegration", "activeStates", "dropdown"],
                "complexity": "high",
                "dependencies": ["@radix-ui/react-navigation-menu", "react-router-dom"]
            },

            # 组件层 - Inputs
            "inputs": {
                "description": "🎯 Inputs & Controls · 输入与控制 - 能改变状态或提交数据的可交互控件",
                "examples": ["Button", "Input", "Select", "Checkbox", "Radio", "Switch", "Slider", "ColorPicker"],
                "auto_features": ["validation", "errorStates", "labelIntegration", "variants"],
                "complexity": "medium",
                "dependencies": ["react-hook-form", "zod", "@radix-ui/react-"]
            },

            # 组件层 - Forms (注: 实际项目 core/src/ 中使用单数 'form' 目录)
            "forms": {
                "description": "📝 Forms · 表单结构与校验 - 表单数据管理、校验逻辑、多步表单",
                "examples": ["Form", "FormProvider", "FormField", "FieldWrapper", "ValidationSummary"],
                "auto_features": ["validation", "errorHandling", "stateManagement", "adapters"],
                "complexity": "high",
                "dependencies": ["react-hook-form", "zod", "@hookform/resolvers"]
            },

            # 组件层 - Data Display
            "data-display": {
                "description": "📊 Data Display · 数据展示 - 不改变数据，只负责展示",
                "examples": ["Table", "DataGrid", "List", "Card", "Badge", "Avatar", "StatisticCard"],
                "auto_features": ["pagination", "sorting", "filtering", "selection"],
                "complexity": "high",
                "dependencies": ["tanstack-react-table", "@tanstack/react-virtual"]
            },

            # 组件层 - Typography & Media
            "typography-media": {
                "description": "🎨 Typography & Media · 文本与媒体 - 文本内容和媒体展示组件",
                "examples": ["Text", "Heading", "Paragraph", "Code", "Image", "VideoPlayer", "AudioPlayer"],
                "auto_features": ["semantic", "responsive", "truncation", "colorIntegration"],
                "complexity": "basic",
                "dependencies": ["@radix-ui/react-typography", "react-player"]
            },

            # 组件层 - Charts
            "charts": {
                "description": "📈 Charts · 图表（可视化）- 数据可视化图表组件（支持简单模式和高级模式）",
                "examples": ["LineChart", "BarChart", "PieChart", "AreaChart", "RadarChart", "GaugeChart"],
                "auto_features": ["simpleMode", "advancedMode", "presetThemes", "dataTransformation", "motion", "accessibility"],
                "complexity": "high",
                "dependencies": ["framer-motion", "react", "simple-mode-utils"],
                "supportsModeSwitching": True
            },

            # 组件层 - Feedback
            "feedback": {
                "description": "🔔 Feedback & Status · 反馈与状态 - 所有Loading都归这里",
                "examples": ["Toast", "Alert", "Banner", "Spinner", "Progress", "Skeleton", "EmptyState"],
                "auto_features": ["autoDismiss", "variants", "positioning", "stacking"],
                "complexity": "medium",
                "dependencies": ["sonner", "@radix-ui/react-toast"]
            },

            # 组件层 - Overlays
            "overlays": {
                "description": "🎭 Overlays · 浮层 - 覆盖当前内容、打断或补充当前流程",
                "examples": ["Modal", "Dialog", "Drawer", "Popover", "Tooltip", "Lightbox"],
                "auto_features": ["portal", "focusTrap", "escapeHandling", "backdrop"],
                "complexity": "high",
                "dependencies": ["@radix-ui/react-dialog", "@radix-ui/react-popover"]
            },

            # 组件层 - Interactive
            "interactive": {
                "description": "⚡ Interactive · 高阶交互 - 复杂交互模式，不放简单按钮、开关",
                "examples": ["DragDrop", "SortableList", "VirtualList", "InfiniteScroll", "Carousel", "CommandPalette"],
                "auto_features": ["gestures", "keyboard", "drag-drop", "virtualization", "autoPlay"],
                "complexity": "high",
                "dependencies": ["@dnd-kit/core", "@dnd-kit/sortable", "@tanstack/react-virtual", "embla-carousel-react"]
            },

            # 组件层 - Utilities
            "utilities": {
                "description": "🛠️ Utilities · 工具性组件 - 辅助其他组件工作，功能上不直接归某一大类",
                "examples": ["Transition", "Fade", "Scale", "ErrorBoundary", "FocusTrap", "ClickAwayListener"],
                "auto_features": ["portal", "transition", "hooks", "utils"],
                "complexity": "medium",
                "dependencies": ["framer-motion", "react-transition-group"]
            },

            # 组合层 - Blocks
            "blocks": {
                "description": "🎪 Blocks · 组合区块 - 通用场景的拼装块，不写死具体业务/品牌",
                "examples": ["HeroSection", "FeatureSection", "PricingSection", "KPIOverview", "StatsGrid"],
                "auto_features": ["composition", "customizable", "slots", "theming"],
                "complexity": "high",
                "dependencies": ["react", "framer-motion"]
            },

            # 组合层 - Templates
            "templates": {
                "description": "📄 Templates · 页面模板 - 页面级骨架结构，只在设计文档/示例项目中存在",
                "examples": ["AuthPageTemplate", "LandingPageTemplate", "DashboardTemplate", "WizardTemplate"],
                "auto_features": ["layout", "slots", "navigation", "themes"],
                "complexity": "block",
                "dependencies": ["react-router-dom", "next-themes"]
            },

            # 组合层 - Labs
            "labs": {
                "description": "🧪 Labs · 实验组件 - 稳定性维度的实验组件，API可能变化",
                "examples": ["NewDateRangePicker", "GuidedTour", "AIChat", "Carousel3D"],
                "auto_features": ["experimental", "featureFlags", "beta", "testing"],
                "complexity": "high",
                "dependencies": ["react", "framer-motion"]
            }
        }

        # 增强的智能分类映射 - 加权匹配 (基于17个分类)
        self.category_keywords = {
            "foundations": {
                "keywords": ["color", "typography", "spacing", "radius", "shadow", "motion", "z-index", "icon", "token", "design-token"],
                "weight": 1.5,
                "priority": 5
            },
            "system": {
                "keywords": ["theme", "provider", "recipe", "switcher", "config", "system", "breakpoint", "responsive", "accessibility", "i18n", "direction"],
                "weight": 1.4,
                "priority": 5
            },
            "primitives": {
                "keywords": ["box", "surface", "flex", "stack", "grid", "inline", "spacer", "text", "heading", "visually-hidden", "button-base", "input-base", "clickable", "pressable", "overlay-base", "portal", "dismissable-layer", "scroll-area"],
                "weight": 1.2,
                "priority": 2
            },
            "layout": {
                "keywords": ["container", "page-container", "simple-grid", "wrap", "split-view", "resizable-panel", "space", "gap", "divider", "app-layout"],
                "weight": 1.2,
                "priority": 3
            },
            "navigation": {
                "keywords": ["navbar", "topbar", "sidebar", "sidenav", "app-shell", "tabs", "segmented-control", "menu", "nav-menu", "contextual-menu", "breadcrumb", "pagination", "stepper", "nav-link", "link", "skip-nav"],
                "weight": 1.4,
                "priority": 4
            },
            "inputs": {
                "keywords": ["button", "icon-button", "button-group", "input", "textarea", "number-input", "search-input", "select", "combobox", "autocomplete", "checkbox", "checkbox-group", "radio", "radio-group", "switch", "toggle", "slider", "range-slider", "rating", "color-picker", "date-picker", "time-picker", "datetime-picker", "file-upload", "upload-button", "chip", "toggle-group"],
                "weight": 1.4,
                "priority": 4
            },
            "forms": {
                "keywords": ["form", "form-provider", "form-field", "form-item", "field-wrapper", "field-label", "helper-text", "error-message", "fieldset", "legend", "form-layout", "form-group", "validation-summary", "form-error-banner", "rhf-adapter", "formik-adapter", "zod-adapter"],
                "weight": 1.3,
                "priority": 3
            },
            "data-display": {
                "keywords": ["card", "statistic-card", "badge", "tag", "chip-display", "avatar", "avatar-group", "list", "list-item", "table", "data-grid", "description-list", "key-value-list", "timeline", "steps", "accordion", "collapse", "info-tooltip"],
                "weight": 1.3,
                "priority": 3
            },
            "typography-media": {
                "keywords": ["text", "heading", "paragraph", "code", "kbd", "mark", "quote", "highlight", "inline-code", "image", "responsive-image", "aspect-ratio", "video", "video-player", "audio", "audio-player", "icon"],
                "weight": 1.1,
                "priority": 2
            },
            "charts": {
                "keywords": ["chart", "line", "bar", "pie", "area", "radar", "gauge", "heatmap", "funnel", "scatter", "bubble", "candlestick", "kpi", "metric", "visualization", "graph", "plot", "sparkline", "mini-chart"],
                "weight": 1.4,
                "priority": 4
            },
            "feedback": {
                "keywords": ["alert", "inline-alert", "banner", "announcement", "toast", "snackbar", "notification", "result", "empty-state", "empty", "skeleton", "skeleton-text", "skeleton-avatar", "skeleton-block", "spinner", "loader", "progress", "progress-bar", "circular-progress", "status-dot", "status-badge", "pill", "inline-error", "form-error"],
                "weight": 1.2,
                "priority": 3
            },
            "overlays": {
                "keywords": ["modal", "dialog", "confirm-dialog", "drawer", "side-panel", "popover", "hover-card", "tooltip", "context-menu", "lightbox", "image-preview", "fullscreen-overlay"],
                "weight": 1.3,
                "priority": 4
            },
            "interactive": {
                "keywords": ["drag-drop", "draggable", "droppable", "sortable-list", "sortable-grid", "virtual-list", "infinite-scroll", "carousel", "slider-carousel", "scroll-area", "command-palette", "spotlight", "quick-search", "hotkeys", "shortcuts", "keymap", "tour", "walkthrough", "coachmark", "resizable", "splitter", "resize-handle", "swipeable", "gesture-based"],
                "weight": 1.4,
                "priority": 4
            },
            "utilities": {
                "keywords": ["transition", "collapse-transition", "fade", "scale", "responsive", "media-query", "hide-at", "show-at", "error-boundary", "suspense-boundary", "click-away-listener", "outside-click-handler", "focus-trap"],
                "weight": 1.2,
                "priority": 3
            },
            "blocks": {
                "keywords": ["hero-section", "feature-section", "pricing-section", "faq-section", "testimonial-section", "call-to-action-section", "kpi-overview", "stats-grid", "filter-bar", "chart-panel", "activity-feed", "auth-card", "login-section", "register-section", "reset-password-section"],
                "weight": 1.3,
                "priority": 3
            },
            "templates": {
                "keywords": ["auth-page-template", "landing-page-template", "dashboard-template", "wizard-template", "template", "page-template"],
                "weight": 1.2,
                "priority": 2
            },
            "labs": {
                "keywords": ["labs", "experimental", "beta", "new", "3d", "ai", "guided-tour", "date-range-picker"],
                "weight": 1.1,
                "priority": 1
            }
        }

    def _detect_project_path(self) -> Path:
        """智能检测项目路径"""
        # 首先尝试 zoxide
        try:
            result = subprocess.run(['zoxide', 'query', 'Xorigo'],
                                  capture_output=True, text=True, check=True)
            zoxide_path = result.stdout.strip()
            if zoxide_path and Path(zoxide_path).exists():
                print(f"🎯 使用 zoxide 检测到项目路径: {zoxide_path}")
                return Path(zoxide_path) / "packages/core/src"
        except (subprocess.CalledProcessError, FileNotFoundError):
            pass

        # 备用路径检测
        possible_paths = [
            Path.cwd() / "packages/core/src",
            Path.home() / "project/Xorigo-UI/packages/core/src",
            Path("/home/saken/project/Xorigo-UI/packages/core/src")
        ]

        for path in possible_paths:
            if path.exists() and (path / "primitives").exists():
                print(f"🔍 检测到项目路径: {path}")
                return path

        # 默认路径
        default_path = Path("/home/saken/project/Xorigo-UI/packages/core/src")
        print(f"📍 使用默认项目路径: {default_path}")
        return default_path

    def _validate_project_structure(self) -> bool:
        """验证项目结构 (基于17个分类)"""
        required_dirs = ["primitives", "form", "overlays", "data-display", "navigation", "charts", "feedback", "layout"]

        for dir_name in required_dirs:
            if not (self.base_path / dir_name).exists():
                print(f"⚠️ 缺少目录: {dir_name}")
                return False

        print("✅ 项目结构验证通过 (支持17个分类)")
        return True

    def infer_component_category(self, component_name: str) -> Tuple[str, float]:
        """智能推断组件分类 - 加权匹配算法"""
        name_lower = component_name.lower()

        # 计算每个分类的加权分数
        category_scores = {}

        for category, config in self.category_keywords.items():
            score = 0
            keyword_matches = 0

            for keyword in config["keywords"]:
                if keyword in name_lower:
                    # 完全匹配得分更高
                    if keyword == name_lower:
                        score += 2.0
                    else:
                        score += 1.0
                    keyword_matches += 1

            # 应用权重和优先级
            if keyword_matches > 0:
                score *= config["weight"]
                # 优先级加分
                score += config["priority"] * 0.1

            category_scores[category] = score

        # 找到最高分的分类
        best_category = max(category_scores.items(), key=lambda x: x[1])

        # 如果分数太低，使用默认分类
        if best_category[1] < 0.5:
            print(f"⚠️ 未找到明确匹配，使用默认分类: primitives")
            return "primitives", 0.0

        print(f"🎯 智能推断: {component_name} → {best_category[0]} (置信度: {best_category[1]:.2f})")
        return best_category

    def normalize_component_name(self, component_name: str) -> Tuple[str, str, str]:
        """标准化组件名称 - 增强版"""
        # 移除常见前缀和后缀
        name = re.sub(r'^(ui|react|component|xorigo)', '', component_name, flags=re.IGNORECASE).strip()
        name = re.sub(r'(component|element|widget|control)$', '', name, flags=re.IGNORECASE).strip()

        # PascalCase 格式
        name_pascal = ''.join(word.capitalize() for word in re.split(r'[-_\s]+', name))

        # kebab-case 格式
        name_kebab = re.sub(r'([A-Z])', r'-\1', name_pascal).lower().lstrip('-')

        # camelCase 格式
        name_camel = name_pascal[0].lower() + name_pascal[1:] if name_pascal else ''

        return name_pascal, name_kebab, name_camel

    def infer_component_features(self, component_name: str, category: str) -> List[str]:
        """智能推断组件需要的功能 - 增强版"""
        name_lower = component_name.lower()
        base_features = self.component_categories[category]["auto_features"].copy()

        # 基于组件名称推断额外功能
        additional_features = []

        # 数据相关组件
        if any(keyword in name_lower for keyword in ["table", "data", "list", "grid"]):
            additional_features.extend(["sorting", "pagination", "filtering", "selection", "search"])

        # 对话框类组件
        if any(keyword in name_lower for keyword in ["dialog", "modal", "drawer", "sheet"]):
            additional_features.extend(["size", "backdrop", "closeButton", "escapeKey", "portal"])

        # 输入类组件
        if any(keyword in name_lower for keyword in ["input", "field", "text", "form"]):
            additional_features.extend(["placeholder", "disabled", "error", "label", "validation", "helper"])

        # 按钮类组件
        if "button" in name_lower:
            additional_features.extend(["loading", "icon", "size", "variant", "href", "type"])

        # 菜单类组件
        if any(keyword in name_lower for keyword in ["menu", "dropdown", "select"]):
            additional_features.extend(["items", "trigger", "placement", "offset", "keyboard"])

        # 颜色相关组件
        if any(keyword in name_lower for keyword in ["color", "theme", "palette"]):
            additional_features.extend(["presets", "alpha", "format", "swatches"])

        # 加载相关组件
        if any(keyword in name_lower for keyword in ["loading", "spinner", "progress"]):
            additional_features.extend(["indeterminate", "animated", "size", "color"])

        # 导航相关组件
        if any(keyword in name_lower for keyword in ["nav", "breadcrumb", "tab", "pagination"]):
            additional_features.extend(["active", "keyboard", "router", "responsive"])

        return list(set(base_features + additional_features))

    def generate_component(self, component_name: str, custom_features: Optional[List[str]] = None):
        """智能生成组件 - 增强版"""
        print(f"🚀 开始生成 Xorigo UI v2025.11.05 组件: {component_name}")

        # 标准化名称
        name_pascal, name_kebab, name_camel = self.normalize_component_name(component_name)

        if not name_pascal:
            print("❌ 无效的组件名称")
            return

        # 智能推断分类
        category, confidence = self.infer_component_category(component_name)

        # 推断功能
        auto_features = self.infer_component_features(component_name, category)
        features = list(set(auto_features + (custom_features or [])))

        # 获取复杂度
        complexity = self.component_categories[category]["complexity"]

        print(f"📁 分类: {category} (置信度: {confidence:.2f})")
        print(f"🏷️ 名称: {name_pascal} ({name_kebab})")
        print(f"⚡ 功能: {', '.join(features)}")
        print(f"🔧 复杂度: {complexity}")

        # 创建目录结构
        component_dir = self.base_path / category / name_pascal
        self.ensure_directory(component_dir)

        # 生成文件
        files_created = []

        # 主组件文件
        main_file = component_dir / f"{name_pascal}.tsx"
        content = self._generate_component_content(name_pascal, name_kebab, category, features)
        self._write_file(main_file, content)
        files_created.append(main_file)

        # 生成测试文件
        test_file = component_dir / f"{name_pascal}.test.tsx"
        test_content = self._generate_test_content(name_pascal, category, features)
        self._write_file(test_file, test_content)
        files_created.append(test_file)

        # 生成 Storybook 文件
        stories_file = component_dir / f"{name_pascal}.stories.tsx"
        stories_content = self._generate_stories_content(name_pascal, category, features)
        self._write_file(stories_file, stories_content)
        files_created.append(stories_file)

        # 生成导出文件
        index_file = component_dir / "index.ts"
        index_content = self._generate_index_content(name_pascal)
        self._write_file(index_file, index_content)
        files_created.append(index_file)

        # 更新分类导出
        self._update_category_export(category, name_pascal)

        print(f"✅ 组件生成完成!")
        print(f"📂 位置: {component_dir}")
        print(f"📄 文件: {len(files_created)} 个")

        # 生成使用示例
        self._print_usage_example(name_pascal, category, features)

    def ensure_directory(self, directory: Path):
        """确保目录存在"""
        directory.mkdir(parents=True, exist_ok=True)

    def _write_file(self, file_path: Path, content: str):
        """写入文件"""
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

    def _generate_component_content(self, name_pascal: str, name_kebab: str, category: str, features: List[str]) -> str:
        """生成主组件内容 - 智能增强版（支持图表组件模式切换）"""

        # 检查是否为图表组件
        if category == "charts":
            return self._generate_chart_component_content(name_pascal, name_kebab, features)

        # 基础导入
        imports = [
            "'use client'",
            "import { forwardRef } from 'react'",
            "import { cva, type VariantProps } from 'class-variance-authority'",
            "import { motion } from 'framer-motion'",
            "import { cn } from '../../foundations/utils/cn'",
            "import {",
            "  generateAriaProps,",
            "  generateKeyboardNavigation,",
            "  type AriaAttributes,",
            "} from '../../utils/accessibility'"
        ]

        # 生成变体定义
        variants = self._generate_variants(name_kebab, features, category)

        # 生成 Props 接口
        props_interface = self._generate_props_interface(name_pascal, features, category)

        # 生成组件实现
        component_implementation = self._generate_component_implementation(name_pascal, name_kebab, features, category)

        # 组装完整内容
        content = "\n".join(imports) + "\n\n" + variants + "\n\n" + props_interface + "\n\n" + component_implementation

        return content

    def _generate_chart_component_content(self, name_pascal: str, name_kebab: str, features: List[str]) -> str:
        """生成图表组件内容 - 支持简单模式和高级模式"""

        # 导入（包含simple-mode工具）
        imports = """'use client'
import React, { forwardRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import {
  SimpleTheme,
  transformSimpleData,
  SIMPLE_PRESETS,
  validateSimpleModeProps,
  validateAdvancedModeProps,
} from '../simple-mode/utils'

// ============================================================================
// Types
// ============================================================================

export interface DataPoint {
  x: string | number
  y: number
}

export interface DataSeries {
  id: string
  name: string
  data: DataPoint[]
  color?: string
}

// ============================================================================
// Props Interface (支持简单模式和高级模式)
// ============================================================================

export interface """ + name_pascal + """Props {
  /**
   * === Simple Mode ===
   * Simplified data format (mutually exclusive with data)
   */
  simpleData?: Array<[string | number, number]> | Array<{ x: string | number, y: number }>

  /**
   * Simple mode: Chart title
   */
  title?: string

  /**
   * Simple mode: X-axis label
   */
  xAxis?: string

  /**
   * Simple mode: Y-axis label
   */
  yAxis?: string

  /**
   * Simple mode: Preset theme
   * @default 'business'
   */
  theme?: SimpleTheme

  /**
   * === Advanced Mode ===
   * Data series (mutually exclusive with simpleData)
   */
  data?: DataSeries[]

  /**
   * Advanced mode: Grid configuration
   */
  grid?: {
    enabled: boolean
    color?: string
    opacity?: number
  }

  /**
   * Advanced mode: Axis configuration
   */
  axis?: {
    x: { enabled: boolean; tickCount?: number; label?: string }
    y: { enabled: boolean; tickCount?: number; label?: string }
  }

  /**
   * Advanced mode: Legend configuration
   */
  legend?: { enabled: boolean; position?: 'top' | 'right' | 'bottom' | 'left' }

  /**
   * Advanced mode: Tooltip configuration
   */
  tooltip?: { enabled: boolean; showValue?: boolean }

  /**
   * === Common Props ===
   * Chart dimensions
   */
  width?: number
  height?: number

  /**
   * Animation
   */
  animate?: boolean
  animationDuration?: number

  /**
   * Colors
   */
  colors?: string[]

  /**
   * Additional CSS class name
   */
  className?: string

  /**
   * Children content
   */
  children?: React.ReactNode

  /**
   * Event handlers
   */
  onDataPointClick?: (data: DataPoint & { seriesId: string }) => void

  // Inherited from forwardRef
  ref?: React.Ref<SVGSVGElement>
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

// ============================================================================
// Component Implementation (模式切换)
// ============================================================================

const """ + name_pascal + """ = forwardRef<SVGSVGElement, """ + name_pascal + """Props>(
  (
    {
      simpleData,
      title,
      xAxis,
      yAxis,
      theme = 'business',
      data,
      width = 800,
      height = 400,
      grid,
      axis,
      legend = { enabled: true, position: 'top' },
      tooltip = { enabled: true, showValue: true },
      animate = true,
      animationDuration = 1000,
      colors = DEFAULT_COLORS,
      className,
      children,
      onDataPointClick,
    },
    ref
  ) => {
    // Auto-detect mode
    const mode = useMemo(() => {
      if (simpleData && !data) {
        validateSimpleModeProps({ simpleData, data })
        return 'simple'
      }
      if (data && !simpleData) {
        validateAdvancedModeProps({ simpleData, data })
        return 'advanced'
      }
      throw new Error('""" + name_pascal + """: Must provide either "simpleData" (simple mode) or "data" (advanced mode), but not both')
    }, [simpleData, data])

    // Get preset configuration for simple mode
    const preset = useMemo(() => {
      if (mode === 'simple') {
        return SIMPLE_PRESETS[theme]
      }
      return null
    }, [mode, theme])

    // Transform simple mode props to advanced mode format
    const advancedModeProps = useMemo(() => {
      if (mode !== 'simple') return null

      // Transform data to series format
      const transformedSeries = transformSimpleData(
        simpleData!,
        title || yAxis || 'Data'
      )[0]

      return {
        data: [transformedSeries],
        width,
        height,
        grid: grid || preset?.grid,
        axis: {
          ...(axis || preset?.axis),
          x: {
            ...(axis?.x || preset?.axis?.x),
            label: xAxis
          },
          y: {
            ...(axis?.y || preset?.axis?.y),
            label: yAxis
          }
        },
        legend: legend || preset?.legend,
        tooltip: tooltip || preset?.tooltip,
        animate: animate !== undefined ? animate : preset?.animate,
        animationDuration: animationDuration || preset?.animationDuration || 1000,
        colors,
        className,
        children,
        onDataPointClick
      }
    }, [
      mode,
      simpleData,
      title,
      yAxis,
      xAxis,
      theme,
      preset,
      width,
      height,
      grid,
      axis,
      legend,
      tooltip,
      animate,
      animationDuration,
      colors,
      className,
      children,
      onDataPointClick
    ])

    // Render in simple mode
    if (mode === 'simple') {
      return (
        <div className={cn('""" + name_kebab + """', className)}>
          {title && (
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {title}
            </h3>
          )}
          <Advanced""" + name_pascal + """ ref={ref} {...advancedModeProps!} />
        </div>
      )
    }

    // Render in advanced mode
    return (
      <Advanced""" + name_pascal + """
        ref={ref}
        data={data!}
        width={width}
        height={height}
        grid={grid || { enabled: true }}
        axis={axis || { x: { enabled: true }, y: { enabled: true } }}
        legend={legend}
        tooltip={tooltip}
        animate={animate}
        animationDuration={animationDuration || 1000}
        colors={colors}
        className={className}
        children={children}
        onDataPointClick={onDataPointClick}
      />
    )
  }
)

// Advanced component (core implementation)
const Advanced""" + name_pascal + """ = forwardRef<SVGSVGMLElement, Omit<""" + name_pascal + """Props, 'simpleData' | 'title' | 'xAxis' | 'yAxis' | 'theme'>>(
  (
    {
      data,
      width = 800,
      height = 400,
      grid = { enabled: true },
      axis = { x: { enabled: true }, y: { enabled: true } },
      legend = { enabled: true, position: 'top' },
      tooltip = { enabled: true, showValue: true },
      animate = true,
      animationDuration = 1000,
      colors = DEFAULT_COLORS,
      className,
      children,
      onDataPointClick,
    },
    ref
  ) => {
    // TODO: Implement advanced chart logic here
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        className={cn('overflow-visible', className)}
        role="img"
        aria-label=\"""" + name_pascal + """ visualization\"
      >
        <title>""" + name_pascal + """</title>
        <desc>Advanced """ + name_pascal + """ component</desc>
        {children}
      </svg>
    )
  }
)

""" + name_pascal + """.displayName = '""" + name_pascal + """'
Advanced""" + name_pascal + """.displayName = 'Advanced""" + name_pascal + """'

// ============================================================================
// Default Props
// ============================================================================

""" + name_pascal + """.defaultProps = {
  width: 800,
  height: 400,
  theme: 'business',
  animate: true
}

Advanced""" + name_pascal + """.defaultProps = {
  width: 800,
  height: 400,
  grid: { enabled: true },
  axis: { x: { enabled: true }, y: { enabled: true } },
  legend: { enabled: true, position: 'top' },
  tooltip: { enabled: true, showValue: true },
  animate: true,
  animationDuration: 1000
}

// ============================================================================
// Export
// ============================================================================

export default """ + name_pascal + """
export { """ + name_pascal + """, Advanced""" + name_pascal + """ }

export type {
  """ + name_pascal + """Props,
  DataPoint,
  DataSeries,
  SimpleTheme
}"""

        return imports

    def _generate_component_implementation(self, name_pascal: str, name_kebab: str, features: List[str], category: str) -> str:
        """生成组件实现 - 修复语法错误版本"""

        # 基础参数
        params = [
            "className",
            "variant",
            "size",
            "children",
            "disabled",
            "onClick"
        ]

        # 根据功能添加参数
        if "loading" in features:
            params.extend(["loading = false", "loadingText = 'Loading...'"])

        if "error" in features:
            params.extend(["error = false", "errorMessage"])

        if "validation" in features:
            params.extend(["required = false", "invalid = false"])

        component_params = "\n".join(f"    {param}" for param in params)

        # 动画属性
        motion_attrs = {
            "whileHover": "{ scale: 1.02 }",
            "whileTap": "{ scale: 0.98 }"
        }

        # motion 属性字符串格式化 - 修复语法错误
        motion_attrs_list = [f'"{k}": {v}' for k, v in motion_attrs.items()]
        motion_attrs_str = ",\n      ".join(motion_attrs_list)

        return f"""const {name_pascal} = forwardRef<HTMLDivElement, {name_pascal}Props>(
  ({component_params},
  ref) => {{
    // 生成 ARIA 属性
    const ariaProps = generateAriaProps('{name_pascal}', {{
      disabled,
      // 动态属性根据功能添加
    }})

    // 生成键盘导航处理
    const keyboardHandlers = generateKeyboardNavigation('{name_pascal}', {{
      onClick
    }})

    return (
      <motion.div
        ref={ref}
        className={cn({name_kebab}Variants({{ variant, size, loading, error }}), className)}
        disabled={disabled || loading}
        {{
          ...ariaProps,
          ...keyboardHandlers,
          {motion_attrs_str}
        }}
      >
        {loading ? (
          <>
            <motion.div
              className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              animate={{{{{
                rotate: 360
              }}}}}
              transition={{{{{
                duration: 1, repeat: Infinity, ease: "linear"
              }}}}}
            />
            {loadingText}
          </>
        ) : (
          children
        )}
      </motion.div>
    )
  }}
)

{name_pascal}.displayName = '{name_pascal}'

export {{ {name_pascal} }}"""

    def _generate_variants(self, name_kebab: str, features: List[str], category: str) -> str:
        """生成变体定义 - 分类定制版"""

        # 根据分类选择基础样式
        base_styles = {
            "primitives": "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
            "form": "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "data-display": "relative overflow-auto",
            "feedback": "fixed top-4 right-4 z-50 flex items-center space-x-2 rounded-lg border p-4 shadow-lg transition-all duration-300",
            "layout": "flex",
            "navigation": "flex items-center space-x-1",
            "typography": "",
            "branding": "flex items-center space-x-2"
        }

        base_classes = base_styles.get(category, base_styles["primitives"])

        # 根据分类定制变体
        variants_config = {
            "variant": self._get_category_variants(category),
            "size": self._get_category_sizes(category)
        }

        # 根据功能调整变体
        if "loading" in features:
            variants_config["loading"] = {
                "true": "cursor-wait opacity-75",
                "false": ""
            }

        if "error" in features:
            variants_config["error"] = {
                "true": "border-red-500 text-red-900 focus:ring-red-500",
                "false": ""
            }

        return f"""export const {name_kebab}Variants = cva(
  "{base_classes}",
  {{
    variants: {self._format_variants_config(variants_config)},
    defaultVariants: {{
      variant: '{self._get_default_variant(category)}',
      size: '{self._get_default_size(category)}'
    }}
  }}
)"""

    def _get_category_variants(self, category: str) -> Dict[str, str]:
        """获取分类特定变体"""
        variants_map = {
            "primitives": {
                "primary": "bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] focus:ring-[var(--color-primary-500)] shadow-md hover:shadow-lg",
                "secondary": "bg-[var(--color-surface-primary)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] hover:bg-[var(--color-surface-secondary)] focus:ring-[var(--color-border-default)]",
                "outline": "bg-transparent text-[var(--color-primary-500)] border border-[var(--color-primary-500)] hover:bg-[var(--color-primary-500)] hover:text-white focus:ring-[var(--color-primary-500)]",
                "ghost": "bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)] focus:ring-[var(--color-border-default)]"
            },
            "form": {
                "default": "border-input bg-background",
                "filled": "border-transparent bg-muted",
                "outlined": "border-2 border-input bg-transparent"
            },
            "data-display": {
                "default": "border-border bg-background",
                "striped": "border-border bg-background odd:bg-muted/50",
                "bordered": "border-2 border-border",
                "minimal": "border-0 bg-transparent"
            }
        }

        return variants_map.get(category, variants_map["primitives"])

    def _get_category_sizes(self, category: str) -> Dict[str, str]:
        """获取分类特定尺寸"""
        sizes_map = {
            "primitives": {
                "sm": "px-3 py-1.5 text-sm",
                "md": "px-4 py-2 text-base",
                "lg": "px-6 py-3 text-lg",
                "xl": "px-8 py-4 text-xl"
            },
            "form": {
                "sm": "px-2 py-1 text-xs",
                "md": "px-3 py-2 text-sm",
                "lg": "px-4 py-3 text-base",
                "xl": "px-6 py-4 text-lg"
            },
            "typography": {
                "xs": "text-xs",
                "sm": "text-sm",
                "md": "text-base",
                "lg": "text-lg",
                "xl": "text-xl",
                "2xl": "text-2xl",
                "3xl": "text-3xl"
            }
        }

        return sizes_map.get(category, sizes_map["primitives"])

    def _get_default_variant(self, category: str) -> str:
        """获取默认变体"""
        defaults = {
            "primitives": "primary",
            "form": "default",
            "typography": "default"
        }
        return defaults.get(category, "primary")

    def _get_default_size(self, category: str) -> str:
        """获取默认尺寸"""
        defaults = {
            "typography": "md",
            "form": "md"
        }
        return defaults.get(category, "md")

    def _format_variants_config(self, config: Dict) -> str:
        """格式化变体配置"""
        lines = ["{"]
        for variant_name, variant_values in config.items():
            lines.append(f"      {variant_name}: {{")
            for value, classes in variant_values.items():
                lines.append(f"        {value}: \"{classes}\",")
            lines.append("      },")
        lines.append("    }")
        lines.append("  }")
        lines.append("}")
        return "\n".join(lines)

    def _generate_props_interface(self, name_pascal: str, features: List[str], category: str) -> str:
        """生成 Props 接口 - 分类定制版"""

        # 基础属性
        base_props = [
            "variant?: string",
            "size?: string",
            "className?: string",
            "children?: React.ReactNode",
            "disabled?: boolean",
            "onClick?: (event: React.MouseEvent) => void"
        ]

        # 根据功能添加属性
        if "loading" in features:
            base_props.append("loading?: boolean")
            base_props.append("loadingText?: string")

        if "error" in features:
            base_props.append("error?: boolean")
            base_props.append("errorMessage?: string")

        if "validation" in features:
            base_props.append("required?: boolean")
            base_props.append("invalid?: boolean")

        props_str = "\n".join(f"  {prop};" for prop in base_props)

        return f"""export interface {name_pascal}Props extends React.HTMLAttributes<HTMLDivElement> {{
{props_str}
}}"""

    def _generate_test_content(self, name_pascal: str, category: str, features: List[str]) -> str:
        """生成测试内容"""
        return f"""import {{ render, screen, fireEvent }} from '@testing-library/react'
import {{ {name_pascal} }} from './{name_pascal}'

describe('{name_pascal}', () => {{
  it('renders correctly', () => {{
    render(<{name_pascal}>Test Component</{name_pascal}>)
    expect(screen.getByText('Test Component')).toBeInTheDocument()
  }})

  it('handles click events', () => {{
    const handleClick = vi.fn()
    render(<{name_pascal} onClick={{handleClick}}>Click me</{name_pascal}>)

    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  }})

  it('applies variant classes correctly', () => {{
    render(<{name_pascal} variant="primary">Primary</{name_pascal}>)
    const element = screen.getByText('Primary')
    expect(element).toHaveClass('bg-[var(--color-primary-500)]')
  }})

  it('can be disabled', () => {{
    render(<{name_pascal} disabled>Disabled</{name_pascal}>)
    const element = screen.getByText('Disabled')
    expect(element).toBeDisabled()
  }})
}})"""

    def _generate_stories_content(self, name_pascal: str, category: str, features: List[str]) -> str:
        """生成 Storybook 内容"""
        return f"""import type {{ Meta, StoryObj }} from '@storybook/react'
import {{ {name_pascal} }} from './{name_pascal}'

const meta: Meta<typeof {name_pascal}> = {{
  title: '{category}/{name_pascal}',
  component: {name_pascal},
  parameters: {{
    layout: 'centered',
  }},
  tags: ['autodocs'],
}}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {{
  args: {{
    children: 'Default {name_pascal}',
  }},
}}

export const Variants: Story = {{
  render: () => (
    <div className="flex gap-4">
      <{name_pascal} variant="primary">Primary</{name_pascal}>
      <{name_pascal} variant="secondary">Secondary</{name_pascal}>
      <{name_pascal} variant="outline">Outline</{name_pascal}>
    </div>
  ),
}}

export const Sizes: Story = {{
  render: () => (
    <div className="flex items-center gap-4">
      <{name_pascal} size="sm">Small</{name_pascal}>
      <{name_pascal} size="md">Medium</{name_pascal}>
      <{name_pascal} size="lg">Large</{name_pascal}>
    </div>
  ),
}}"""

    def _generate_index_content(self, name_pascal: str) -> str:
        """生成导出文件内容"""
        return f"""export {{ {name_pascal} }} from './{name_pascal}'
export type {{ {name_pascal}Props }} from './{name_pascal}'
"""

    def _update_category_export(self, category: str, name_pascal: str):
        """更新分类导出文件"""
        index_file = self.base_path / category / "index.ts"

        # 如果文件不存在，创建基础结构
        if not index_file.exists():
            self.ensure_directory(self.base_path / category)
            self._write_file(index_file, f"// {category} 组件导出\n\n")

        # 读取现有内容
        with open(index_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # 检查是否已导出
        if f"export {{ {name_pascal} }}" not in content:
            # 添加新的导出
            content += f"export {{ {name_pascal} }} from './{name_pascal}'\n"

            # 写回文件
            self._write_file(index_file, content)
            print(f"✅ 更新分类导出: {category}/index.ts")

    def _print_usage_example(self, name_pascal: str, category: str, features: List[str]):
        """打印使用示例"""

        import_path = f"@xorigo-ui/core/{category}"

        print(f"\n📖 使用示例:")
        print(f"```typescript")
        print(f"// 导入组件")
        print(f"import {{ {name_pascal} }} from '{import_path}'")
        print(f"")
        print(f"// 基础使用")
        print(f"<{name_pascal}>Click me</{name_pascal}>")
        print(f"")
        print(f"// 完整使用")
        usage_props = ["variant='primary'", "size='md'"]
        if "loading" in features:
            usage_props.append("loading={false}")
        if "error" in features:
            usage_props.append("error={false}")
        print(f"<{name_pascal} {{ ', '.join(usage_props) }}>")
        print(f"  Click me")
        print(f"</{name_pascal}>")
        print(f"```")


def main():
    """主函数 - 增强版"""
    if len(sys.argv) < 2:
        print("❌ 请提供组件名称")
        print("用法: python smart_generator_fixed.py <组件名> [功能1,功能2,...]")
        print("示例: python smart_generator_fixed.py DataTable sorting,pagination,filtering")
        print("智能特性: 自动分类推断、复杂度检测、完整文件生成")
        sys.exit(1)

    component_name = sys.argv[1]
    features = sys.argv[2].split(',') if len(sys.argv) > 2 else None

    try:
        generator = SmartComponentGenerator()
        generator.generate_component(component_name, features)
    except Exception as e:
        print(f"❌ 生成失败: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()