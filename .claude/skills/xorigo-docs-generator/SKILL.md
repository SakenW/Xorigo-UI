---
name: "Xorigo UI 文档生成器"
description: "自动生成 Xorigo UI 组件的完整技术文档，包括 API 文档、使用示例、最佳实践指南和可访问性说明"
author: "Xorigo UI Team"
version: "1.0.0"
tags: ["documentation", "api", "examples", "markdown", "storybook"]
---

# Xorigo UI 文档生成器

这个 Skill 专门为 Xorigo UI 组件生成完整的技术文档，确保文档与代码完全同步。

## 文档类型

### 📚 API 文档
- **Props 完整说明** - 每个属性的详细描述和类型定义
- **使用示例** - 代码示例和实际用法演示
- **变体系统** - variant 和 size 的所有选项说明
- **事件处理** - 回调函数的详细说明
- **样式定制** - className 和样式覆盖指南

### 🎨 设计指南
- **设计原则** - 组件的设计理念和使用场景
- **视觉规范** - 颜色、间距、字体的使用规范
- **主题集成** - 与 Xorigo UI 主题系统的集成方式
- **响应式设计** - 不同屏幕尺寸下的适配方案
- **动画效果** - 交互动画的设计说明

### ♿ 可访问性文档
- **ARIA 支持** - 可访问性属性的完整说明
- **键盘导航** - 键盘操作指南和快捷键
- **屏幕阅读器** - 屏幕阅读器兼容性说明
- **对比度标准** - WCAG 对比度合规性说明
- **最佳实践** - 可访问性使用建议

### 🧪 测试文档
- **测试覆盖** - 单元测试、集成测试的覆盖说明
- **测试用例** - 关键测试场景的详细说明
- **质量保证** - 代码质量检查项目清单
- **性能指标** - 组件性能基准和优化建议

## 生成文档结构

```
docs/components/
├── Button/
│   ├── README.md              # 主要文档页面
│   ├── api.md                 # API 详细说明
│   ├── examples.md            # 使用示例集合
│   ├── accessibility.md       # 可访问性指南
│   ├── design-guidelines.md   # 设计规范
│   ├── migration-guide.md     # 迁移指南（如需要）
│   └── troubleshooting.md     # 常见问题解答
├── Card/
│   └── ... (同上结构)
└── ...
```

## 文档内容模板

### 📖 主要文档 (README.md)

```markdown
# Button 按钮组件

> 基础的按钮组件，支持多种样式变体和交互状态

## 🚀 快速开始

```tsx
import { Button } from '@xorigo-ui/core'

function App() {
  return (
    <Button variant="primary" size="md" onClick={() => console.log('clicked')}>
      点击我
    </Button>
  )
}
```

## 📦 安装和导入

```bash
npm install @xorigo-ui/core
```

```tsx
import { Button } from '@xorigo-ui/core'
// 或者
import { Button } from '@xorigo-ui/core/Button'
```

## 🎨 基础用法

[包含各种基础使用示例]

## 🎯 使用场景

- **表单提交** - 表单中的提交按钮
- **操作触发** - 触发各种用户操作
- **导航链接** - 页面导航按钮
- **模态框控制** - 打开/关闭模态框

## 📱 响应式设计

[响应式使用示例]

## ♿ 可访问性

Button 组件完全符合 WCAG 2.1 AA 标准：

- ✅ 键盘导航支持
- ✅ 屏幕阅读器兼容
- ✅ 焦点管理
- ✅ 对比度达标

[详细可访问性说明]

## 🔧 高级用法

[高级使用场景和技巧]

## 📚 更多资源

- [API 文档](./api.md)
- [设计指南](./design-guidelines.md)
- [更多示例](./examples.md)
```

### 🔧 API 文档 (api.md)

```markdown
# Button API 文档

## Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| variant | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | 按钮样式变体 |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | 按钮尺寸 |
| disabled | `boolean` | `false` | 是否禁用 |
| loading | `boolean` | `false` | 是否显示加载状态 |
| onClick | `(event: MouseEvent) => void` | - | 点击事件处理 |
| className | `string` | - | 自定义 CSS 类名 |
| children | `React.ReactNode` | - | 按钮内容 |

## CSS 变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `--button-bg-color` | 按钮背景色 | `var(--color-primary-500)` |
| `--button-text-color` | 按钮文字颜色 | `var(--color-white)` |
| `--button-border-radius` | 按钮圆角 | `var(--radius-md)` |

## 数据属性

| 属性 | 值 | 用途 |
|------|-----|------|
| `data-variant` | `primary \| secondary \| outline` | 样式变体标识 |
| `data-size` | `sm \| md \| lg` | 尺寸标识 |
| `data-loading` | `true \| false` | 加载状态标识 |

## 组件类型

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  asChild?: boolean
}

declare const Button: React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLButtonElement>
>
```
```

## 使用方法

对我说：
- "为 Button 组件生成完整文档"
- "更新 Card 组件的 API 文档"
- "创建组件使用示例"
- "生成可访问性文档"

## 文档特性

### 🔄 自动同步
- **代码变更检测** - 自动检测组件代码变更
- **文档更新** - 自动更新过时的文档内容
- **示例验证** - 自动验证文档中的代码示例

### 🎨 多格式输出
- **Markdown** - 适合 GitHub 和文档网站
- **Storybook Stories** - 交互式组件示例
- **JSON Schema** - 用于 IDE 智能提示
- **Typedoc** - TypeScript API 文档

### 🌐 多语言支持
- **中文文档** - 详细的中文说明和示例
- **英文文档** - 国际化英文版本
- **代码注释** - 内联代码注释的多语言支持

### 📊 质量检查
- **示例可执行性** - 验证文档中的代码示例可以运行
- **链接完整性** - 检查文档中的链接是否有效
- **图片优化** - 自动优化文档中的图片资源

## 生成流程

### 1. 代码分析
```typescript
// 自动解析组件源码
const componentInfo = {
  props: extractProps(componentFile),
  variants: extractVariants(stylingFile),
  examples: extractExamples(testFile),
  accessibility: extractAccessibilityTests(a11yFile)
}
```

### 2. 文档生成
- **模板渲染** - 使用预定义模板生成文档
- **示例提取** - 从测试文件中提取使用示例
- **API 解析** - 自动生成 API 文档
- **类型导出** - 生成 TypeScript 类型定义

### 3. 质量验证
- **语法检查** - 验证生成的文档语法正确性
- **示例测试** - 运行文档中的代码示例
- **链接检查** - 验证内部和外部链接
- **图片验证** - 检查图片资源和 alt 文本

## 文档增强功能

### 🎯 交互式示例
- **Live Preview** - 在文档中嵌入可交互的组件预览
- **代码编辑** - 支持在线编辑代码并实时预览
- **主题切换** - 在文档中切换不同主题查看效果

### 📱 响应式文档
- **移动端适配** - 文档在移动设备上的良好显示
- **触摸优化** - 移动端的交互优化
- **离线支持** - 支持离线查看文档

### 🔍 智能搜索
- **全文搜索** - 支持文档内容的全文搜索
- **API 搜索** - 快速搜索组件 API
- **示例搜索** - 根据使用场景搜索示例代码

## 集成选项

### 📖 Storybook 集成
```typescript
// 自动生成 Storybook stories
const buttonStories = generateStories(Button, {
  docs: {
    description: {
      component: '基础按钮组件，支持多种样式和交互状态'
    }
  }
})
```

### 🌐 文档网站集成
- **Docusaurus** - 静态文档网站生成
- **VitePress** - Vue 生态的文档方案
- **Next.js** - 全栈文档网站

### 🔧 IDE 集成
- **VS Code 扩展** - 在编辑器中显示组件文档
- **智能提示** - 基于文档的代码自动完成
- **悬停提示** - 鼠标悬停显示组件说明

## 文档模板

### 📋 标准模板
- **基础组件模板** - Button、Input 等基础组件
- **复合组件模板** - Card、Modal 等复合组件
- **布局组件模板** - Header、Sidebar 等布局组件

### 🎨 自定义模板
- **品牌定制** - 根据品牌定制文档样式
- **项目定制** - 根据项目需求定制文档结构
- **团队定制** - 根据团队习惯定制文档风格

## 最佳实践

### ✅ 文档原则
- **简洁明了** - 用简单的语言说明复杂的概念
- **示例驱动** - 提供丰富的代码示例
- **保持更新** - 确保文档与代码同步

### 📈 质量标准
- **准确性** - 文档内容必须准确无误
- **完整性** - 覆盖组件的所有功能
- **易用性** - 便于开发者快速理解和使用

### 🔄 维护策略
- **定期审查** - 定期检查文档的准确性和完整性
- **用户反馈** - 收集用户对文档的反馈意见
- **持续改进** - 基于使用数据持续优化文档

让我知道你要为哪个组件生成文档，我会立即创建完整的技术文档！