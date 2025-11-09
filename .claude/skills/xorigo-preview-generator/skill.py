#!/usr/bin/env python3
"""
Xorigo UI 组件预览生成器 - 自动化组件预览渲染器生成技能

这个技能专门用于自动生成 Xorigo UI 组件的预览渲染器，基于组件类型、属性和使用模式
智能推断并生成符合规范的渲染器代码。
"""

import os
import re
import json
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
from pathlib import Path
import argparse

@dataclass
class ComponentInfo:
    """组件信息数据结构"""
    name: str
    id: str
    description: str
    category: str
    usage: int
    props: List[str]
    tags: List[str]
    complexity: str  # simple, medium, complex

@dataclass
class RendererTemplate:
    """渲染器模板数据结构"""
    template_name: str
    component_type: str
    interactive_props: List[str]
    default_values: Dict[str, Any]
    variants: List[str]
    sizes: List[str]
    requires_state: bool
    requires_async: bool

class ComponentPreviewGenerator:
    """组件预览生成器主类"""

    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.components_dir = self.project_root / "apps/website/app/workbench/hooks"
        self.renderers_dir = self.project_root / "apps/website/app/workbench/components/renderers"

        # 组件分类映射
        self.category_mapping = {
            "表单组件": "forms",
            "图表组件": "charts",
            "业务区块": "blocks",
            "高级数据展示": "advanced-data",
            "增强输入": "enhanced-inputs",
            "反馈动效": "feedback-motion",
            "其他组件": "others",
            "展示组件": "display",
            "反馈组件": "feedback",
            "导航组件": "navigation",
            "布局组件": "layout",
            "数据展示": "data-display",
            "输入增强": "input-enhanced"
        }

        # 渲染器模板库
        self.templates = self._load_templates()

    def _load_templates(self) -> Dict[str, RendererTemplate]:
        """加载渲染器模板库"""
        templates = {
            "chart": RendererTemplate(
                template_name="ChartRenderer",
                component_type="chart",
                interactive_props=["data", "type", "variant", "interactive"],
                default_values={
                    "data": [
                        { "name": "Jan", "value": 30 },
                        { "name": "Feb", "value": 45 },
                        { "name": "Mar", "value": 60 }
                    ],
                    "type": "line",
                    "variant": "default",
                    "interactive": True
                },
                variants=["default", "gradient", "minimal", "colorful"],
                sizes=["sm", "md", "lg", "xl"],
                requires_state=True,
                requires_async=False
            ),

            "business-block": RendererTemplate(
                template_name="BusinessBlockRenderer",
                component_type="business-block",
                interactive_props=["title", "subtitle", "cta", "variant", "layout"],
                default_values={
                    "title": "示例标题",
                    "subtitle": "这是一个示例副标题",
                    "cta": "了解更多",
                    "variant": "default",
                    "layout": "center"
                },
                variants=["default", "minimal", "featured", "dark"],
                sizes=["sm", "md", "lg"],
                requires_state=False,
                requires_async=False
            ),

            "data-display": RendererTemplate(
                template_name="DataDisplayRenderer",
                component_type="data-display",
                interactive_props=["data", "variant", "density", "selectable"],
                default_values={
                    "data": [
                        { "id": 1, "name": "项目1", "value": 100 },
                        { "id": 2, "name": "项目2", "value": 200 }
                    ],
                    "variant": "default",
                    "density": "medium",
                    "selectable": False
                },
                variants=["default", "bordered", "striped", "compact"],
                sizes=["sm", "md", "lg"],
                requires_state=True,
                requires_async=False
            ),

            "input-enhanced": RendererTemplate(
                template_name="InputEnhancedRenderer",
                component_type="input-enhanced",
                interactive_props=["value", "placeholder", "variant", "size", "disabled"],
                default_values={
                    "value": "",
                    "placeholder": "请输入内容",
                    "variant": "default",
                    "size": "md",
                    "disabled": False
                },
                variants=["default", "filled", "outlined", "underlined"],
                sizes=["sm", "md", "lg"],
                requires_state=True,
                requires_async=False
            ),

            "feedback-motion": RendererTemplate(
                template_name="FeedbackMotionRenderer",
                component_type="feedback-motion",
                interactive_props=["visible", "variant", "position", "closable"],
                default_values={
                    "visible": True,
                    "variant": "info",
                    "position": "top-right",
                    "closable": True
                },
                variants=["info", "success", "warning", "error", "loading"],
                sizes=["sm", "md", "lg"],
                requires_state=True,
                requires_async=False
            ),

            "navigation": RendererTemplate(
                template_name="NavigationRenderer",
                component_type="navigation",
                interactive_props=["items", "variant", "orientation", "expandable"],
                default_values={
                    "items": [
                        { "label": "首页", "href": "/" },
                        { "label": "组件", "href": "/components" },
                        { "label": "文档", "href": "/docs" }
                    ],
                    "variant": "default",
                    "orientation": "horizontal",
                    "expandable": False
                },
                variants=["default", "tabs", "pills", "underline"],
                sizes=["sm", "md", "lg"],
                requires_state=True,
                requires_async=False
            ),

            "layout": RendererTemplate(
                template_name="LayoutRenderer",
                component_type="layout",
                interactive_props=["gap", "direction", "wrap", "align", "justify"],
                default_values={
                    "gap": "medium",
                    "direction": "row",
                    "wrap": True,
                    "align": "start",
                    "justify": "start"
                },
                variants=["default", "compact", "spacious", "flexible"],
                sizes=["sm", "md", "lg"],
                requires_state=False,
                requires_async=False
            )
        }
        return templates

    def analyze_components(self) -> List[ComponentInfo]:
        """分析组件库，提取组件信息"""
        components = []

        component_library_file = self.components_dir / "useComponentLibraryV2.ts"
        if not component_library_file.exists():
            print(f"❌ 找不到组件库文件: {component_library_file}")
            return components

        with open(component_library_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # 使用正则表达式提取组件信息
        component_pattern = r'\{\s*id:\s*\'([^\']*)\',\s*name:\s*\'([^\']*)\',\s*description:\s*\'([^\']*)\',\s*usage:\s*(\d+)\s*\}'
        matches = re.findall(component_pattern, content)

        for match in matches:
            component_id, name, description, usage = match
            category = self._infer_category(name, description)
            complexity = self._infer_complexity(name, description, usage)

            components.append(ComponentInfo(
                name=name,
                id=component_id,
                description=description,
                category=category,
                usage=int(usage),
                props=self._infer_props(name, description),
                tags=self._infer_tags(name, description, category),
                complexity=complexity
            ))

        # 按使用频率排序
        components.sort(key=lambda x: x.usage, reverse=True)
        return components

    def _infer_category(self, name: str, description: str) -> str:
        """根据名称和描述推断组件分类"""
        name_lower = name.lower()
        desc_lower = description.lower()

        # 图表组件
        if any(keyword in name_lower for keyword in ['chart', 'graph', 'plot', 'gauge', 'heatmap', 'radar']):
            return "charts"

        # 业务区块
        if any(keyword in name_lower for keyword in ['section', 'hero', 'feature', 'pricing', 'testimonial', 'faq']):
            return "blocks"

        # 数据展示
        if any(keyword in name_lower for keyword in ['avatar', 'badge', 'tag', 'card', 'list', 'table', 'timeline']):
            return "data-display"

        # 输入组件
        if any(keyword in name_lower for keyword in ['input', 'select', 'picker', 'upload', 'editor', 'autocomplete']):
            return "input-enhanced"

        # 反馈组件
        if any(keyword in name_lower for keyword in ['alert', 'message', 'toast', 'spinner', 'progress', 'skeleton', 'empty']):
            return "feedback-motion"

        # 导航组件
        if any(keyword in name_lower for keyword in ['menu', 'nav', 'breadcrumb', 'pagination', 'steps', 'link']):
            return "navigation"

        # 布局组件
        if any(keyword in name_lower for keyword in ['layout', 'grid', 'row', 'col', 'container', 'space', 'gap']):
            return "layout"

        return "others"

    def _infer_complexity(self, name: str, description: str, usage: int) -> str:
        """推断组件复杂度"""
        name_lower = name.lower()
        desc_lower = description.lower()

        # 复杂组件
        if any(keyword in name_lower for keyword in ['chart', 'editor', 'upload', 'table', 'timeline']):
            return "complex"

        if len(description) > 20 or "复杂" in desc_lower or "高级" in desc_lower:
            return "complex"

        # 简单组件
        if any(keyword in name_lower for keyword in ['badge', 'tag', 'divider', 'space', 'text']):
            return "simple"

        if len(description) < 15 and usage > 5:
            return "simple"

        # 中等复杂度
        return "medium"

    def _infer_props(self, name: str, description: str) -> List[str]:
        """推断组件可能的属性"""
        name_lower = name.lower()
        desc_lower = description.lower()

        common_props = []

        if "颜色" in desc_lower or "color" in name_lower:
            common_props.extend(["color", "variant"])

        if "大小" in desc_lower or "size" in name_lower:
            common_props.extend(["size", "width", "height"])

        if "交互" in desc_lower or "interactive" in desc_lower:
            common_props.extend(["onClick", "onChange", "onSelect"])

        if "数据" in desc_lower or "data" in name_lower:
            common_props.extend(["data", "items", "dataSource"])

        if "状态" in desc_lower or "disabled" in desc_lower:
            common_props.extend(["disabled", "loading", "state"])

        return list(set(common_props))

    def _infer_tags(self, name: str, description: str, category: str) -> List[str]:
        """推断组件标签"""
        tags = [category]

        name_lower = name.lower()
        desc_lower = description.lower()

        if "响应式" in desc_lower or "responsive" in name_lower:
            tags.append("responsive")

        if "动画" in desc_lower or "animation" in name_lower:
            tags.append("animated")

        if "交互" in desc_lower or "interactive" in name_lower:
            tags.append("interactive")

        if "可访问" in desc_lower or "accessible" in name_lower:
            tags.append("accessible")

        return tags

    def generate_renderer(self, component: ComponentInfo) -> str:
        """为指定组件生成渲染器代码"""
        template = self._select_template(component)

        renderer_code = f'''/**
 * {component.name} 组件预览渲染器
 * 自动生成于: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
 * 组件分类: {component.category}
 * 复杂度: {component.complexity}
 * 使用频率: {component.usage}
 */

'use client'

import React, {{ useState, useEffect, useMemo }} from 'react'
import {{ motion, AnimatePresence }} from 'framer-motion'

interface {component.name}RendererProps {{
  component: any
  previewProps: Record<string, any>
  updatePreviewProp: (prop: string, value: any) => void
  isInteractiveMode: boolean
  setIsInteractiveMode: (mode: boolean) => void
  resetPreviewProps: () => void
}}

export default function {component.name}Renderer({{
  component,
  previewProps,
  updatePreviewProp,
  isInteractiveMode,
  setIsInteractiveMode,
  resetPreviewProps
}}: {component.name}RendererProps) {{
  const [localState, setLocalState] = useState({{
    {self._generate_default_state(component, template)}
  }})

  // 计算组件预览数据
  const previewData = useMemo(() => {{
    {self._generate_preview_data(component, template)}
  }}, [localState, previewProps])

  // 处理状态更新
  const handleStateChange = (key: string, value: any) => {{
    setLocalState(prev => ({{ ...prev, [key]: value }}))
    updatePreviewProp(key, value)
  }}

  // 重置状态
  const handleReset = () => {{
    setLocalState({{
      {self._generate_default_state(component, template)}
    }})
    resetPreviewProps()
  }}

  return (
    <div className="w-full h-full flex flex-col">
      {{/* 渲染器控制面板 */}}
      {{isInteractiveMode && (
        <motion.div
          initial={{{{ opacity: 0, height: 0 }}}}
          animate={{{{ opacity: 1, height: 'auto' }}}}
          exit={{{{ opacity: 0, height: 0 }}}}
          className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {component.name} 配置
              </h3>
              <button
                onClick={handleReset}
                className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                重置
              </button>
            </div>

            {self._generate_control_panel(component, template)}
          </div>
        </motion.div>
      )}}

      {/* 组件预览区域 */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl"
        >
          {self._generate_component_preview(component, template)}
        </motion.div>
      </div>

      {/* 交互模式切换 */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-2 flex justify-center">
        <button
          onClick={() => setIsInteractiveMode(!isInteractiveMode)}
          className={`text-xs px-3 py-1 rounded transition-colors ${
            isInteractiveMode
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {{isInteractiveMode ? '关闭' : '开启'}} 交互模式
        </button>
      </div>
    </div>
  )
}}
'''
        return renderer_code

    def _select_template(self, component: ComponentInfo) -> RendererTemplate:
        """选择合适的渲染器模板"""
        category_template_map = {
            "charts": "chart",
            "blocks": "business-block",
            "data-display": "data-display",
            "input-enhanced": "input-enhanced",
            "feedback-motion": "feedback-motion",
            "navigation": "navigation",
            "layout": "layout"
        }

        template_key = category_template_map.get(component.category, "data-display")
        return self.templates.get(template_key, self.templates["data-display"])

    def _generate_default_state(self, component: ComponentInfo, template: RendererTemplate) -> str:
        """生成默认状态代码"""
        state_items = []
        for prop, value in template.default_values.items():
            if isinstance(value, str):
                state_items.append(f"    {prop}: '{value}'")
            elif isinstance(value, bool):
                state_items.append(f"    {prop}: {str(value).lower()}")
            elif isinstance(value, list):
                state_items.append(f"    {prop}: {json.dumps(value, ensure_ascii=False)}")
            else:
                state_items.append(f"    {prop}: {value}")

        return ",\n".join(state_items)

    def _generate_preview_data(self, component: ComponentInfo, template: RendererTemplate) -> str:
        """生成预览数据逻辑"""
        return f"""
    // 混合本地状态和预览属性
    return {{
      ...localState,
      ...previewProps,
      variant: previewProps.variant || localState.variant,
      size: previewProps.size || localState.size
    }}
"""

    def _generate_control_panel(self, component: ComponentInfo, template: RendererTemplate) -> str:
        """生成控制面板代码"""
        controls = []

        # 变体选择
        if template.variants:
            variant_options = ", ".join([f"'{v}'" for v in template.variants])
            controls.append(f'''
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                变体
              </label>
              <select
                value={{localState.variant}}
                onChange={{(e) => handleStateChange('variant', e.target.value)}}
                className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
              >
                {[{variant_options}].map(variant => (
                  <option key={{variant}} value={{variant}}>{{variant}}</option>
                ))}
              </select>
            </div>''')

        # 尺寸选择
        if template.sizes:
            size_options = ", ".join([f"'{s}'" for s in template.sizes])
            controls.append(f'''
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                尺寸
              </label>
              <select
                value={{localState.size}}
                onChange={{(e) => handleStateChange('size', e.target.value)}}
                className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
              >
                {[{size_options}].map(size => (
                  <option key={{size}} value={{size}}>{{size}}</option>
                ))}
              </select>
            </div>''')

        # 开关控制
        for prop in template.interactive_props:
            if prop in ['disabled', 'closable', 'selectable', 'expandable', 'interactive']:
                controls.append(f'''
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {prop}
              </label>
              <input
                type="checkbox"
                checked={{localState.{prop}}}
                onChange={{(e) => handleStateChange('{prop}', e.target.checked)}}
                className="rounded"
              />
            </div>''')

        return "\n".join(controls)

    def _generate_component_preview(self, component: ComponentInfo, template: RendererTemplate) -> str:
        """生成组件预览代码"""
        if component.category == "charts":
            return self._generate_chart_preview(component)
        elif component.category == "blocks":
            return self._generate_block_preview(component)
        elif component.category == "data-display":
            return self._generate_data_display_preview(component)
        elif component.category == "input-enhanced":
            return self._generate_input_preview(component)
        elif component.category == "feedback-motion":
            return self._generate_feedback_preview(component)
        elif component.category == "navigation":
            return self._generate_navigation_preview(component)
        elif component.category == "layout":
            return self._generate_layout_preview(component)
        else:
            return self._generate_generic_preview(component)

    def _generate_chart_preview(self, component: ComponentInfo) -> str:
        return f'''
        <div className="w-full h-64 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {component.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {component.description}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                变体: {{previewData.variant}}} | 尺寸: {{previewData.size}}}
              </div>
            </div>
          </div>
        </div>'''

    def _generate_block_preview(self, component: ComponentInfo) -> str:
        return f'''
        <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {{previewData.title}}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              {{previewData.subtitle}}
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {{previewData.cta}}
            </button>
          </div>
        </div>'''

    def _generate_data_display_preview(self, component: ComponentInfo) -> str:
        return f'''
        <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {component.name}
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {previewData.data?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="text-sm text-gray-900 dark:text-white">{{item.name}}</span>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{{item.value}}</span>
                </div>
              )) || (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  暂无数据
                </div>
              )}
            </div>
          </div>
        </div>'''

    def _generate_input_preview(self, component: ComponentInfo) -> str:
        return f'''
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {component.name}
            </label>
            <input
              type="text"
              placeholder={{previewData.placeholder}}
              value={{previewData.value}}
              onChange={{(e) => handleStateChange('value', e.target.value)}}
              disabled={{previewData.disabled}}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              变体: {{previewData.variant}}} | 尺寸: {{previewData.size}}} | 禁用: {{previewData.disabled ? '是' : '否'}}
            </div>
          </div>
        </div>'''

    def _generate_feedback_preview(self, component: ComponentInfo) -> str:
        return f'''
        <div className="w-full max-w-md mx-auto">
          <div className={{"bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"}}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="text-xl">ℹ️</div>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {component.name}
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  {component.description}
                </p>
                {previewData.closable && (
                  <button className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">
                    关闭
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>'''

    def _generate_navigation_preview(self, component: ComponentInfo) -> str:
        return f'''
        <div className="w-full max-w-md mx-auto">
          <nav className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex space-x-1">
              {previewData.items?.map((item, index) => (
                <button
                  key={index}
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  {{item.label}}
                </button>
              )) || (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  暂无导航项
                </div>
              )}
            </div>
          </nav>
        </div>'''

    def _generate_layout_preview(self, component: ComponentInfo) -> str:
        return f'''
        <div className="w-full">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className={{"grid gap-4"}} style={{{{
              gridTemplateColumns: previewData.direction === 'row' ? 'repeat(3, 1fr)' : '1fr',
              gap: previewData.gap === 'small' ? '0.5rem' : previewData.gap === 'large' ? '2rem' : '1rem'
            }}}}>
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded text-center text-sm text-blue-800 dark:text-blue-200">
                项目 1
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded text-center text-sm text-green-800 dark:text-green-200">
                项目 2
              </div>
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded text-center text-sm text-purple-800 dark:text-purple-200">
                项目 3
              </div>
            </div>
          </div>
        </div>'''

    def _generate_generic_preview(self, component: ComponentInfo) -> str:
        return f'''
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="text-2xl mb-4">🧩</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {component.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {component.description}
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              分类: {component.category} | 复杂度: {component.complexity}
            </div>
          </div>
        </div>'''

    def batch_generate_renderers(self, components: List[ComponentInfo], max_count: int = 10) -> List[str]:
        """批量生成渲染器"""
        generated_files = []

        for i, component in enumerate(components[:max_count]):
            print(f"🔧 正在生成 {component.name} 渲染器...")

            renderer_code = self.generate_renderer(component)
            renderer_filename = f"{component.name}Renderer.tsx"
            renderer_path = self.renderers_dir / renderer_filename

            try:
                with open(renderer_path, 'w', encoding='utf-8') as f:
                    f.write(renderer_code)

                generated_files.append(str(renderer_path))
                print(f"✅ 已生成: {renderer_filename}")

            except Exception as e:
                print(f"❌ 生成失败 {renderer_filename}: {e}")

        return generated_files

    def update_component_preview_mapping(self, components: List[ComponentInfo]):
        """更新ComponentPreview.tsx中的渲染器映射"""
        preview_file = self.project_root / "apps/website/app/workbench/components/ComponentPreview.tsx"

        if not preview_file.exists():
            print(f"❌ 找不到ComponentPreview.tsx文件")
            return

        with open(preview_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # 提取DEDICATED_RENDERERS部分
        renderer_pattern = r'const DEDICATED_RENDERERS: Record<string, string> = \{([^}]+)\}'
        match = re.search(renderer_pattern, content, re.DOTALL)

        if match:
            existing_renderers = match.group(1)
            new_renderer_entries = []

            for component in components:
                if component.complexity in ['medium', 'complex']:
                    entry = f"  '{component.name}': '{component.name}'"
                    if entry not in existing_renderers:
                        new_renderer_entries.append(entry)

            if new_renderer_entries:
                updated_renderers = existing_renderers.rstrip() + ",\n" + ",\n".join(new_renderer_entries) + "\n}"
                updated_content = content.replace(match.group(0), f"const DEDICATED_RENDERERS: Record<string, string> = {{{updated_renderers}}}")

                with open(preview_file, 'w', encoding='utf-8') as f:
                    f.write(updated_content)

                print(f"✅ 已更新ComponentPreview.tsx映射，新增{len(new_renderer_entries)}个渲染器")

    def generate_report(self, components: List[ComponentInfo]) -> str:
        """生成分析报告"""
        report = f"""
# Xorigo UI 组件预览生成报告

**生成时间**: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**分析组件总数**: {len(components)}

## 📊 组件分类统计

"""

        # 统计各分类组件数量
        category_stats = {}
        for component in components:
            category = component.category
            if category not in category_stats:
                category_stats[category] = []
            category_stats[category].append(component)

        for category, comps in category_stats.items():
            report += f"- **{category}**: {len(comps)}个组件\n"

        report += f"""

## 🔥 高优先级组件 (使用频率Top 20)

"""

        for i, component in enumerate(components[:20], 1):
            report += f"{i}. **{component.name}** (使用: {component.usage}次, 复杂度: {component.complexity})\n"

        report += f"""

## 🎯 推荐生成顺序

1. **Phase 1**: 图表组件 (15个) - 最高优先级
2. **Phase 2**: 业务区块组件 (16个) - 高优先级
3. **Phase 3**: 高级数据展示 (20个) - 高优先级
4. **Phase 4**: 增强输入组件 (15个) - 中优先级
5. **Phase 5**: 反馈动效组件 (15个) - 中优先级

## 📋 下一步操作

1. 运行批量生成命令:
   ```bash
   python skill.py --batch --count 10
   ```

2. 更新渲染器映射:
   ```bash
   python skill.py --update-mapping
   ```

3. 测试生成的渲染器

---
*报告由 Xorigo UI 组件预览生成器自动生成*
"""

        return report

def main():
    """主函数"""
    parser = argparse.ArgumentParser(description="Xorigo UI 组件预览生成器")
    parser.add_argument("--project-root", default=".", help="项目根目录路径")
    parser.add_argument("--analyze", action="store_true", help="分析组件库")
    parser.add_argument("--generate", help="为指定组件生成渲染器")
    parser.add_argument("--batch", action="store_true", help="批量生成渲染器")
    parser.add_argument("--count", type=int, default=10, help="批量生成数量")
    parser.add_argument("--update-mapping", action="store_true", help="更新组件映射")
    parser.add_argument("--report", action="store_true", help="生成分析报告")

    args = parser.parse_args()

    # 转换为绝对路径
    project_root = os.path.abspath(args.project_root)

    # 初始化生成器
    generator = ComponentPreviewGenerator(project_root)

    if args.analyze:
        print("🔍 正在分析组件库...")
        components = generator.analyze_components()
        print(f"✅ 分析完成，发现 {len(components)} 个组件")

        for component in components[:10]:
            print(f"  - {component.name} ({component.category}) - 使用次数: {component.usage}")

    elif args.generate:
        print(f"🔧 正在为 {args.generate} 生成渲染器...")
        components = generator.analyze_components()
        target_component = next((c for c in components if c.name == args.generate), None)

        if target_component:
            renderer_code = generator.generate_renderer(target_component)
            print(renderer_code)
        else:
            print(f"❌ 找不到组件: {args.generate}")

    elif args.batch:
        print(f"🚀 批量生成渲染器 (最多 {args.count} 个)...")
        components = generator.analyze_components()
        generated_files = generator.batch_generate_renderers(components, args.count)
        print(f"✅ 成功生成 {len(generated_files)} 个渲染器")

    elif args.update_mapping:
        print("📝 更新组件映射...")
        components = generator.analyze_components()
        generator.update_component_preview_mapping(components)
        print("✅ 映射更新完成")

    elif args.report:
        print("📊 生成分析报告...")
        components = generator.analyze_components()
        report = generator.generate_report(components)

        report_file = Path(project_root) / "component-preview-report.md"
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report)

        print(f"✅ 报告已生成: {report_file}")

    else:
        print("🎯 Xorigo UI 组件预览生成器")
        print("使用 --help 查看可用命令")
        print("\n示例命令:")
        print("  python skill.py --analyze")
        print("  python skill.py --batch --count 5")
        print("  python skill.py --generate 'AreaChart'")
        print("  python skill.py --update-mapping")
        print("  python skill.py --report")

if __name__ == "__main__":
    main()