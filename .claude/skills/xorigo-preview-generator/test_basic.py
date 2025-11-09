#!/usr/bin/env python3
"""
基础版 Xorigo UI 组件预览生成器测试
"""

import os
import re
from pathlib import Path

def analyze_components():
    """分析组件库"""
    project_root = Path("/home/saken/project/Xorigo-UI")
    component_library_file = project_root / "apps/website/app/workbench/hooks/useComponentLibraryV2.ts"

    if not component_library_file.exists():
        print(f"❌ 找不到组件库文件: {component_library_file}")
        return []

    with open(component_library_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 使用正则表达式提取组件信息
    component_pattern = r'\{\s*id:\s*\'([^\']*)\',\s*name:\s*\'([^\']*)\',\s*description:\s*\'([^\']*)\',\s*usage:\s*(\d+)\s*\}'
    matches = re.findall(component_pattern, content)

    components = []
    for match in matches:
        component_id, name, description, usage = match
        category = infer_category(name, description)

        components.append({
            'name': name,
            'id': component_id,
            'description': description,
            'category': category,
            'usage': int(usage)
        })

    # 按使用频率排序
    components.sort(key=lambda x: x['usage'], reverse=True)
    return components

def infer_category(name, description):
    """推断组件分类"""
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

def generate_basic_renderer(component):
    """生成基础渲染器代码模板"""
    template = f"""/**
 * {component['name']} 组件预览渲染器
 * 自动生成于: 2025-11-09
 * 分类: {component['category']}
 * 使用频率: {component['usage']}
 */

'use client'

import React, {{ useState }} from 'react'

interface {component['name']}RendererProps {{
  component: any
  previewProps: Record<string, any>
  updatePreviewProp: (prop: string, value: any) => void
  isInteractiveMode: boolean
  setIsInteractiveMode: (mode: boolean) => void
  resetPreviewProps: () => void
}}

export default function {component['name']}Renderer({{
  component,
  previewProps,
  updatePreviewProp,
  isInteractiveMode,
  setIsInteractiveMode,
  resetPreviewProps
}}: {component['name']}RendererProps) {{
  const [variant, setVariant] = useState('default')
  const [size, setSize] = useState('md')
  const [disabled, setDisabled] = useState(false)

  const handleVariantChange = (value: string) => {{
    setVariant(value)
    updatePreviewProp('variant', value)
  }}

  const handleSizeChange = (value: string) => {{
    setSize(value)
    updatePreviewProp('size', value)
  }}

  const handleDisabledChange = (value: boolean) => {{
    setDisabled(value)
    updatePreviewProp('disabled', value)
  }}

  return (
    <div className="w-full h-full flex flex-col">
      {{/* 控制面板 */}}
      {{isInteractiveMode && (
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {component['name']} 配置
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  变体
                </label>
                <select
                  value={{variant}}
                  onChange={{(e) => handleVariantChange(e.target.value)}}
                  className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 w-full"
                >
                  <option value="default">默认</option>
                  <option value="outline">轮廓</option>
                  <option value="filled">填充</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  尺寸
                </label>
                <select
                  value={{size}}
                  onChange={{(e) => handleSizeChange(e.target.value)}}
                  className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 w-full"
                >
                  <option value="sm">小</option>
                  <option value="md">中</option>
                  <option value="lg">大</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  状态
                </label>
                <select
                  value={{disabled ? 'disabled' : 'enabled'}}
                  onChange={{(e) => handleDisabledChange(e.target.value === 'disabled')}}
                  className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 w-full"
                >
                  <option value="enabled">启用</option>
                  <option value="disabled">禁用</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}}

      {{/* 组件预览区域 */}}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">
              📊
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {component['name']}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {component['description']}
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 mb-4">
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div>分类: {component['category']}</div>
                <div>变体: <span className="font-medium">{{variant}}</span></div>
                <div>尺寸: <span className="font-medium">{{size}}</span></div>
                <div>状态: <span className="font-medium">{{disabled ? '禁用' : '启用'}}</span></div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className={{"px-4 py-2 rounded text-sm font-medium " + get_variant_classes(variant, disabled)}}>
                示例 {component['name']}
              </div>
            </div>
          </div>
        </div>
      </div>

      {{/* 交互模式切换 */}}
      <div className="border-t border-gray-200 dark:border-gray-700 p-2 flex justify-center">
        <button
          onClick={{() => setIsInteractiveMode(!isInteractiveMode)}}
          className={{"text-xs px-3 py-1 rounded transition-colors " + (
            isInteractiveMode
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          )}}
        >
          {{isInteractiveMode ? '关闭' : '开启'}} 交互模式
        </button>
      </div>
    </div>
  )
}}

function get_component_emoji(category: string): string {{
  switch (category) {{
    case 'charts': return '📊'
    case 'blocks': return '🧱'
    case 'data-display': return '📋'
    case 'input-enhanced': return '🎛️'
    case 'feedback-motion': return '💬'
    case 'navigation': return '🧭'
    case 'layout': return '📐'
    default: return '🧩'
  }}
}}

function get_variant_classes(variant: string, disabled: boolean): string {{
  const baseClasses = 'transition-colors '

  if (disabled) {{
    return baseClasses + 'bg-gray-200 text-gray-400 cursor-not-allowed'
  }}

  switch (variant) {{
    case 'default':
      return baseClasses + 'bg-blue-500 text-white hover:bg-blue-600'
    case 'outline':
      return baseClasses + 'border border-blue-500 text-blue-500 hover:bg-blue-50'
    case 'filled':
      return baseClasses + 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    default:
      return baseClasses + 'bg-gray-500 text-white hover:bg-gray-600'
  }}
}}
"""

    return template

def main():
    """主函数"""
    print("🔍 正在分析组件库...")
    components = analyze_components()
    print(f"✅ 分析完成，发现 {len(components)} 个组件")

    # 显示前10个组件
    print("\n🔥 高频组件 Top 10:")
    for i, component in enumerate(components[:10], 1):
        print(f"{i:2d}. {component['name']:20s} ({component['category']:15s}) - 使用: {component['usage']:3d}次")

    # 统计分类
    categories = {}
    for component in components:
        cat = component['category']
        categories[cat] = categories.get(cat, 0) + 1

    print("\n📊 分类统计:")
    for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
        print(f"  {cat:20s}: {count:3d}个组件")

    # 生成一个示例渲染器
    if components:
        target_component = components[0]
        print(f"\n🎯 生成示例渲染器: {target_component['name']}")
        renderer_code = generate_basic_renderer(target_component)

        # 保存到文件
        output_file = Path("/home/saken/project/Xorigo-UI/apps/website/app/workbench/components/renderers") / f"{target_component['name']}Renderer.tsx"

        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(renderer_code)
            print(f"✅ 渲染器已保存到: {output_file}")

            # 显示生成的前几行代码
            print("\n📄 生成的代码预览:")
            lines = renderer_code.split('\n')
            for line in lines[:20]:
                print(f"  {line}")
            if len(lines) > 20:
                print("  ... (省略其余代码)")

        except Exception as e:
            print(f"❌ 保存失败: {e}")

if __name__ == "__main__":
    main()