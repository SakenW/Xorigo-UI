#!/usr/bin/env python3
"""
Xorigo UI 组件生成器 v1.5.2 - 智能增强版
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

        # v1.5.2 架构 - 13个组件分类 + 智能增强
        self.component_categories = {
            # 原子组件
            "primitives": {
                "description": "🔷 原子组件 - 基础UI元素",
                "examples": ["Button", "Card", "Surface", "ThemeSwitcher", "ColorPicker"],
                "auto_features": ["variants", "accessibility", "forwardRef", "motion"],
                "complexity": "basic",
                "dependencies": ["react", "framer-motion", "class-variance-authority"]
            },
            # 表单组件
            "form": {
                "description": "📝 表单组件 - 输入和选择控件",
                "examples": ["Input", "Select", "Checkbox", "Switch", "TextField"],
                "auto_features": ["validation", "errorStates", "labelIntegration", "variants"],
                "complexity": "medium",
                "dependencies": ["react-hook-form", "zod"]
            },
            # 覆盖层组件
            "overlays": {
                "description": "🎭 覆盖层组件 - 模态框和弹出层",
                "examples": ["Dialog", "Drawer", "Popover", "Sheet", "Modal"],
                "auto_features": ["portal", "focusTrap", "escapeHandling", "backdrop"],
                "complexity": "high",
                "dependencies": ["@radix-ui/react-dialog", "@radix-ui/react-popover"]
            },
            # 数据展示组件
            "data-display": {
                "description": "📊 数据展示组件 - 表格和列表",
                "examples": ["Table", "List", "DataTable", "Card", "Grid"],
                "auto_features": ["pagination", "sorting", "filtering", "selection"],
                "complexity": "high",
                "dependencies": ["tanstack-react-table", "@tanstack/react-virtual"]
            },
            # 反馈组件
            "feedback": {
                "description": "🔔 反馈组件 - 状态和提示",
                "examples": ["Toast", "Loading", "Badge", "Alert", "Progress"],
                "auto_features": ["autoDismiss", "variants", "positioning", "stacking"],
                "complexity": "medium",
                "dependencies": ["sonner", "@radix-ui/react-toast"]
            },
            # 布局组件
            "layout": {
                "description": "📐 布局组件 - 网格和容器",
                "examples": ["Grid", "Container", "Stack", "Divider", "Flex"],
                "auto_features": ["responsive", "gap", "alignment", "direction"],
                "complexity": "medium",
                "dependencies": ["@radix-ui/react-separator"]
            },
            # 导航组件
            "navigation": {
                "description": "🧭 导航组件 - 菜单和面包屑",
                "examples": ["Menu", "Breadcrumb", "Tabs", "Pagination", "Sidebar"],
                "auto_features": ["keyboard", "routerIntegration", "activeStates", "dropdown"],
                "complexity": "high",
                "dependencies": ["@radix-ui/react-navigation-menu", "react-router-dom"]
            },
            # 排版组件
            "typography": {
                "description": "🎨 排版组件 - 文本和标题",
                "examples": ["Heading", "Text", "Code", "Link", "Paragraph"],
                "auto_features": ["semantic", "responsive", "truncation", "colorIntegration"],
                "complexity": "basic",
                "dependencies": ["@radix-ui/react-typography"]
            },
            # 品牌组件
            "branding": {
                "description": "🏢 品牌组件 - Logo和品牌元素",
                "examples": ["Logo", "Brand", "Icon", "BrandMark"],
                "auto_features": ["svg", "variants", "themeAdaptation", "sizing"],
                "complexity": "basic",
                "dependencies": ["lucide-react"]
            },
            # 展示组件
            "showcase": {
                "description": "🎪 展示组件 - 代码演示和示例",
                "examples": ["CodeDemo", "Example", "Preview", "Showcase"],
                "auto_features": ["syntaxHighlighting", "copyButton", "livePreview", "tabs"],
                "complexity": "high",
                "dependencies": ["react-syntax-highlighter", "react-live"]
            },
            # 效果组件
            "effects": {
                "description": "✨ 效果组件 - 视觉效果",
                "examples": ["Skeleton", "Shimmer", "Gradient", "Glow"],
                "auto_features": ["animation", "variants", "themeIntegration", "performance"],
                "complexity": "medium",
                "dependencies": ["framer-motion"]
            },
            # 动画组件
            "motion": {
                "description": "🎬 动画组件 - Framer Motion集成",
                "examples": ["Animate", "Transition", "LayoutGroup", "MotionDiv"],
                "auto_features": ["framerMotion", "variants", "gestures", "physics"],
                "complexity": "high",
                "dependencies": ["framer-motion"]
            },
            # 系统组件
            "system": {
                "description": "🔹 系统组件 - 主题和配方管理",
                "examples": ["ThemeProvider", "RecipeLoader", "ThemeSwitcher", "ConfigProvider"],
                "auto_features": ["themeIntegration", "recipeSupport", "sevenAxis", "persistence"],
                "complexity": "system",
                "dependencies": ["next-themes", "zustand"]
            }
        }

        # 增强的智能分类映射 - 加权匹配
        self.category_keywords = {
            "primitives": {
                "keywords": ["button", "card", "surface", "input", "badge", "avatar", "icon", "color", "picker"],
                "weight": 1.0,
                "priority": 1
            },
            "form": {
                "keywords": ["input", "select", "checkbox", "switch", "radio", "textarea", "field", "form", "textfield"],
                "weight": 1.2,
                "priority": 2
            },
            "overlays": {
                "keywords": ["dialog", "drawer", "popover", "sheet", "modal", "tooltip", "dropdown", "overlay"],
                "weight": 1.3,
                "priority": 3
            },
            "data-display": {
                "keywords": ["table", "list", "grid", "data", "item", "row", "card", "datatable"],
                "weight": 1.2,
                "priority": 2
            },
            "feedback": {
                "keywords": ["toast", "alert", "loading", "spinner", "progress", "badge", "status", "feedback"],
                "weight": 1.1,
                "priority": 2
            },
            "layout": {
                "keywords": ["grid", "container", "stack", "flex", "divider", "space", "section", "layout"],
                "weight": 1.1,
                "priority": 2
            },
            "navigation": {
                "keywords": ["menu", "nav", "breadcrumb", "tabs", "pagination", "link", "sidebar", "navigation"],
                "weight": 1.3,
                "priority": 3
            },
            "typography": {
                "keywords": ["heading", "title", "text", "paragraph", "label", "code", "quote", "typography"],
                "weight": 1.0,
                "priority": 1
            },
            "branding": {
                "keywords": ["logo", "brand", "icon", "symbol", "mark", "branding"],
                "weight": 1.1,
                "priority": 2
            },
            "showcase": {
                "keywords": ["demo", "example", "preview", "showcase", "code", "playground"],
                "weight": 1.2,
                "priority": 2
            },
            "effects": {
                "keywords": ["skeleton", "shimmer", "gradient", "glow", "effect", "visual"],
                "weight": 1.1,
                "priority": 2
            },
            "motion": {
                "keywords": ["animate", "transition", "motion", "slide", "fade", "animation"],
                "weight": 1.2,
                "priority": 2
            },
            "system": {
                "keywords": ["theme", "provider", "recipe", "switcher", "config", "system"],
                "weight": 1.4,
                "priority": 4
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
        """验证项目结构"""
        required_dirs = ["primitives", "form", "overlays", "data-display"]

        for dir_name in required_dirs:
            if not (self.base_path / dir_name).exists():
                print(f"⚠️ 缺少目录: {dir_name}")
                return False

        print("✅ 项目结构验证通过")
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
        print(f"🚀 开始生成 Xorigo UI v1.5.2 组件: {component_name}")

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
        """生成主组件内容 - 智能增强版"""

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