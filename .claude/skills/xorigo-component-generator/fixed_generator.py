#!/usr/bin/env python3
"""
Xorigo UI 组件生成器 v1.5.1 - 修复版本
"""

import os
import re
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple

class ComponentGenerator:
    def __init__(self, base_path: str = "/home/saken/project/Xorigo-UI/packages/core/src"):
        self.base_path = Path(base_path)

        # v1.5.1 架构 - 13个组件分类
        self.component_categories = {
            # 原子组件
            "primitives": {
                "description": "🔷 原子组件 - 基础UI元素",
                "examples": ["Button", "Card", "Surface", "ThemeSwitcher"],
                "auto_features": ["variants", "accessibility", "forwardRef", "motion"]
            },
            # 表单组件 (注意：单数命名)
            "form": {
                "description": "📝 表单组件 - 输入和选择控件",
                "examples": ["Input", "Select", "Checkbox", "Switch"],
                "auto_features": ["validation", "errorStates", "labelIntegration", "variants"]
            },
            # 覆盖层组件
            "overlays": {
                "description": "🎭 覆盖层组件 - 模态框和弹出层",
                "examples": ["Dialog", "Drawer", "Popover", "Sheet"],
                "auto_features": ["portal", "focusTrap", "escapeHandling", "backdrop"]
            },
            # 数据展示组件
            "data-display": {
                "description": "📊 数据展示组件 - 表格和列表",
                "examples": ["Table", "List", "DataTable", "Card"],
                "auto_features": ["pagination", "sorting", "filtering", "selection"]
            },
            # 反馈组件
            "feedback": {
                "description": "🔔 反馈组件 - 状态和提示",
                "examples": ["Toast", "Loading", "Badge", "Alert"],
                "auto_features": ["autoDismiss", "variants", "positioning", "stacking"]
            },
            # 布局组件
            "layout": {
                "description": "📐 布局组件 - 网格和容器",
                "examples": ["Grid", "Container", "Stack", "Divider"],
                "auto_features": ["responsive", "gap", "alignment", "direction"]
            },
            # 导航组件
            "navigation": {
                "description": "🧭 导航组件 - 菜单和面包屑",
                "examples": ["Menu", "Breadcrumb", "Tabs", "Pagination"],
                "auto_features": ["keyboard", "routerIntegration", "activeStates", "dropdown"]
            },
            # 排版组件
            "typography": {
                "description": "🎨 排版组件 - 文本和标题",
                "examples": ["Heading", "Text", "Code", "Link"],
                "auto_features": ["semantic", "responsive", "truncation", "colorIntegration"]
            },
            # 品牌组件
            "branding": {
                "description": "🏢 品牌组件 - Logo和品牌元素",
                "examples": ["Logo", "Brand", "Icon"],
                "auto_features": ["svg", "variants", "themeAdaptation", "sizing"]
            },
            # 展示组件
            "showcase": {
                "description": "🎪 展示组件 - 代码演示和示例",
                "examples": ["CodeDemo", "Example", "Preview"],
                "auto_features": ["syntaxHighlighting", "copyButton", "livePreview", "tabs"]
            },
            # 效果组件
            "effects": {
                "description": "✨ 效果组件 - 视觉效果",
                "examples": ["Skeleton", "Shimmer", "Gradient"],
                "auto_features": ["animation", "variants", "themeIntegration", "performance"]
            },
            # 动画组件
            "motion": {
                "description": "🎬 动画组件 - Framer Motion集成",
                "examples": ["Animate", "Transition", "LayoutGroup"],
                "auto_features": ["framerMotion", "variants", "gestures", "physics"]
            },
            # 系统组件
            "system": {
                "description": "🔹 系统组件 - 主题和配方管理",
                "examples": ["ThemeProvider", "RecipeLoader", "ThemeSwitcher"],
                "auto_features": ["themeIntegration", "recipeSupport", "sevenAxis", "persistence"]
            }
        }

        # 智能分类映射
        self.category_keywords = {
            "primitives": ["button", "card", "surface", "input", "badge", "avatar", "icon"],
            "form": ["input", "select", "checkbox", "switch", "radio", "textarea", "field"],
            "overlays": ["dialog", "drawer", "popover", "sheet", "modal", "tooltip", "dropdown"],
            "data-display": ["table", "list", "grid", "card", "data", "item", "row"],
            "feedback": ["toast", "alert", "loading", "spinner", "progress", "badge", "status"],
            "layout": ["grid", "container", "stack", "flex", "divider", "space", "section"],
            "navigation": ["menu", "nav", "breadcrumb", "tabs", "pagination", "link", "sidebar"],
            "typography": ["heading", "title", "text", "paragraph", "label", "code", "quote"],
            "branding": ["logo", "brand", "icon", "symbol"],
            "showcase": ["demo", "example", "preview", "showcase", "code"],
            "effects": ["skeleton", "shimmer", "gradient", "overlay", "effect"],
            "motion": ["animate", "transition", "motion", "slide", "fade"],
            "system": ["theme", "provider", "recipe", "switcher", "config"]
        }

    def infer_component_category(self, component_name: str) -> str:
        """智能推断组件分类"""
        name_lower = component_name.lower()

        # 计算每个分类的匹配分数
        category_scores = {}
        for category, keywords in self.category_keywords.items():
            score = 0
            for keyword in keywords:
                if keyword in name_lower:
                    score += 1
            category_scores[category] = score

        # 返回得分最高的分类
        best_category = max(category_scores.items(), key=lambda x: x[1])

        # 如果没有明确匹配，使用默认分类
        if best_category[1] == 0:
            return "primitives"  # 默认分类

        return best_category[0]

    def normalize_component_name(self, component_name: str) -> Tuple[str, str, str]:
        """标准化组件名称"""
        # 移除常见前缀
        name = re.sub(r'^(ui|react|component)', '', component_name, flags=re.IGNORECASE).strip()

        # PascalCase 格式
        name_pascal = ''.join(word.capitalize() for word in re.split(r'[-_\s]+', name))

        # kebab-case 格式
        name_kebab = re.sub(r'([A-Z])', r'-\1', name_pascal).lower().lstrip('-')

        # camelCase 格式
        name_camel = name_pascal[0].lower() + name_pascal[1:] if name_pascal else ''

        return name_pascal, name_kebab, name_camel

    def infer_component_features(self, component_name: str, category: str) -> List[str]:
        """智能推断组件需要的功能"""
        name_lower = component_name.lower()
        base_features = self.component_categories[category]["auto_features"]

        # 基于组件名称推断额外功能
        additional_features = []

        if "table" in name_lower or "data" in name_lower:
            additional_features.extend(["sorting", "pagination", "filtering", "selection"])

        if "dialog" in name_lower or "modal" in name_lower:
            additional_features.extend(["size", "backdrop", "closeButton", "escapeKey"])

        if "input" in name_lower or "field" in name_lower:
            additional_features.extend(["placeholder", "disabled", "error", "label"])

        if "button" in name_lower:
            additional_features.extend(["loading", "icon", "size", "variant"])

        if "menu" in name_lower or "dropdown" in name_lower:
            additional_features.extend(["items", "trigger", "placement", "offset"])

        return list(set(base_features + additional_features))

    def generate_component(self, component_name: str, custom_features: Optional[List[str]] = None):
        """智能生成组件"""
        print(f"🚀 开始生成 Xorigo UI v1.5.1 组件: {component_name}")

        # 标准化名称
        name_pascal, name_kebab, name_camel = self.normalize_component_name(component_name)

        # 智能推断分类
        category = self.infer_component_category(component_name)

        # 推断功能
        auto_features = self.infer_component_features(component_name, category)
        features = list(set(auto_features + (custom_features or [])))

        print(f"📁 分类: {category}")
        print(f"🏷️ 名称: {name_pascal} ({name_kebab})")
        print(f"⚡ 功能: {', '.join(features)}")

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
        """生成主组件内容 - 修复版本"""

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

        # 变体定义
        variants = self._generate_variants(name_kebab, features)

        # Props 接口
        props_interface = self._generate_props_interface(name_pascal, features)

        # 组件实现 - 修复版本
        component_implementation = self._generate_component_implementation(name_pascal, name_kebab, features)

        # 组装完整内容
        content = "\\n".join(imports) + "\\n\\n" + variants + "\\n\\n" + props_interface + "\\n\\n" + component_implementation

        return content

    def _generate_component_implementation(self, name_pascal: str, name_kebab: str, features: List[str]) -> str:
        """生成组件实现 - 修复版本"""

        # 参数解构
        params = [
            "className",
            "variant",
            "size",
            "children",
            "disabled",
            "onClick"
        ]

        if "loading" in features:
            params.extend(["loading = false", "loadingText = 'Loading...'"])

        if "error" in features:
            params.extend(["error = false", "errorMessage"])

        component_params = "\\n".join(f"    {param}" for param in params)

        # 动画属性 - 修复语法错误
        motion_attrs = {
            "whileHover": "{ scale: 1.02 }",
            "whileTap": "{ scale: 0.98 }"
        }

        # motion 属性字符串格式化
        motion_attrs_str = ",\\n      ".join(f'"{k}": {v}'" for k, v in motion_attrs.items())

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
        disabled={disabled || loading}}
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
              }}}}
              transition={{{{{
                duration: 1, repeat: Infinity, ease: "linear"
              }}}}
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

    def _generate_variants(self, name_kebab: str, features: List[str]) -> str:
        """生成变体定义"""

        base_classes = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

        variants_config = {
            "variant": {
                "primary": "bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] focus:ring-[var(--color-primary-500)] shadow-md hover:shadow-lg",
                "secondary": "bg-[var(--color-surface-primary)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] hover:bg-[var(--color-surface-secondary)] focus:ring-[var(--color-border-default)]",
                "outline": "bg-transparent text-[var(--color-primary-500)] border border-[var(--color-primary-500)] hover:bg-[var(--color-primary-500)] hover:text-white focus:ring-[var(--color-primary-500)]",
                "ghost": "bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)] focus:ring-[var(--color-border-default)]"
            },
            "size": {
                "sm": "px-3 py-1.5 text-sm",
                "md": "px-4 py-2 text-base",
                "lg": "px-6 py-3 text-lg",
                "xl": "px-8 py-4 text-xl"
            }
        }

        # 根据功能调整变体
        if "loading" in features:
            variants_config["loading"] = {
                "true": "cursor-wait opacity-75",
                "false": ""
            }

        return f"""export const {name_kebab}Variants = cva(
  "{base_classes}",
  {{
    variants: {self._format_variants_config(variants_config)},
    defaultVariants: {{
      variant: 'primary',
      size: 'md'
    }}
  }}
)"""

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
        return "\\n".join(lines)

    def _generate_props_interface(self, name_pascal: str, features: List[str]) -> str:
        """生成 Props 接口"""

        base_props = [
            "variant?: 'primary' | 'secondary' | 'outline' | 'ghost'",
            "size?: 'sm' | 'md' | 'lg' | 'xl'",
            "className?: string",
            "children?: React.ReactNode",
            "disabled?: boolean",
            "onClick?: (event: React.MouseEvent) => void"
        ]

        # 根据功能添加 props
        if "loading" in features:
            base_props.append("loading?: boolean")
            base_props.append("loadingText?: string")

        if "error" in features:
            base_props.append("error?: boolean")
            base_props.append("errorMessage?: string")

        if "validation" in features:
            base_props.append("required?: boolean")
            base_props.append("invalid?: boolean")

        props_str = "\\n".join(f"  {prop};" for prop in base_props)

        return f"""export interface {name_pascal}Props extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof {name_kebab}Variants> {{
{props_str}
}}"""

    def _update_category_export(self, category: str, name_pascal: str):
        """更新分类导出文件"""
        index_file = self.base_path / category / "index.ts"

        # 如果文件不存在，创建基础结构
        if not index_file.exists():
            self.ensure_directory(self.base_path / category)
            self._write_file(index_file, f"// {category} 组件导出\\n\\n")

        # 读取现有内容
        with open(index_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # 检查是否已导出
        if f"export {{ {name_pascal} }}" not in content:
            # 添加新的导出
            content += f"export {{ {name_pascal} }} from './{name_pascal}'\\n"

            # 写回文件
            self._write_file(index_file, content)
            print(f"✅ 更新分类导出: {category}/index.ts")

    def _print_usage_example(self, name_pascal: str, category: str, features: List[str]):
        """打印使用示例"""

        import_path = f"@xorigo-ui/core/{category}"

        print(f"\\n📖 使用示例:")
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
        print(f"<{name_pascal} {{ ', '.join(usage_props) }}>")
        print(f"  Click me")
        print(f"</{name_pascal}>")
        print(f"```")

def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("❌ 请提供组件名称")
        print("用法: python fixed_generator.py <组件名> [功能1,功能2,...]")
        print("示例: python fixed_generator.py DataTable sorting,pagination,filtering")
        sys.exit(1)

    component_name = sys.argv[1]
    features = sys.argv[2].split(',') if len(sys.argv) > 2 else None

    generator = ComponentGenerator()
    generator.generate_component(component_name, features)

if __name__ == "__main__":
    main()