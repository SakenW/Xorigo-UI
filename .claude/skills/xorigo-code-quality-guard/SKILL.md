---
name: "Xorigo UI 代码质量守护者"
description: "基于 Xorigo UI v2025.11.03 架构文档的全方位代码质量检测，包括命名规范、架构规则、API 设计标准和组件分类系统合规性"
author: "Xorigo UI Team"
version: "2025.11.05"
tags: ["code-quality", "naming", "architecture", "api-design", "classification", "standards", "xorigo-ui-v2025.11.03"]
changelog:
  - "v2025.11.03: 🔄 三层架构重构 - 基于 Xorigo UI 三层架构+17分类系统完全重构，支持 180+ 组件"
  - "v1.5.1: 重大架构适配 - 基于 Xorigo UI 棕地架构文档 v1.5.1 完全重构"
  - "v1.1.0: 更新文件命名规范 - 普通文件采用 kebab-case，React 组件文件保持 PascalCase"
  - "v1.0.0: 初始版本 - 完整的代码质量检测系统"
---

**📋 v2025.11.03 重大更新**: 基于三层架构+17分类系统完全重构，支持 180+ 组件的完整质量检测体系。

# Xorigo UI 代码质量守护者

这个 Skill 专门用于守护 Xorigo UI 项目的代码质量，确保所有代码都符合项目规范和最佳实践。

## 质量检测维度

### 🏷️ 命名规范检测
- **组件命名** - PascalCase 命名规范检查
- **文件命名** - 文件名与内容一致性检查
- **变量命名** - camelCase 命名规范检查
- **函数命名** - 动词开头、语义化检查
- **目录结构** - 目录命名和组织规范检查

### 🏗️ 架构规则检测
- **分层架构** - packages/apps 分层规范
- **依赖方向** - 避免循环依赖
- **组件边界** - UI 组件与业务逻辑分离
- **导入规范** - 导入路径和方式规范
- **模块职责** - 单一职责原则检查

### 🎨 API 设计检测
- **Props 一致性** - 组件 API 设计标准
- **事件处理** - 事件命名和处理规范
- **类型定义** - TypeScript 类型设计规范
- **默认值** - 合理的默认值设置
- **向后兼容** - API 变更兼容性检查

### 📚 组件分类检测
- **17 分类系统** - 组件分类归属检查（System Layer 3类 + Component Layer 11类 + Composition Layer 3类）
- **API 标准** - 分类对应的 API 设计标准
- **目录位置** - 组件文件位置规范
- **命名一致性** - 组件命名与分类一致性
- **180+ 组件** - 全量组件覆盖检查

## 使用方法

对我说：
- "检查 Button 组件的代码质量"
- "验证整个项目的命名规范"
- "检查架构合规性"
- "分析 API 设计一致性"
- "生成代码质量报告"
- "修复代码质量问题"

## 质量标准

### 🎯 现代前端命名规范

**核心理念**：文件名是路径标识，变量名是代码语义，两者职责不同

**推荐标准**：

| 类型 | 文件名命名 | 导出变量命名 | 类型命名 | 示例 |
|------|------------|-------------|----------|------|
| React 组件 | PascalCase | camelCase | PascalCase | `Button.tsx` → `export const buttonVariants` |
| 工具函数 | kebab-case | camelCase | PascalCase | `format-date.ts` → `export function formatDate()` |
| 类型定义 | kebab-case | N/A | PascalCase | `user-types.ts` → `export interface UserType` |
| 配置文件 | kebab-case | camelCase | PascalCase | `theme-config.ts` → `export const themeConfig` |
| 常量文件 | kebab-case | UPPER_SNAKE_CASE | N/A | `api-constants.ts` → `export const API_BASE_URL` |

**为什么选择 kebab-case 文件名**：
1. **跨平台兼容**：避免大小写敏感问题 (Windows vs macOS/Linux)
2. **工具生态支持**：TypeScript、ESLint、Vite、Next.js 默认支持
3. **行业标准**：主流 UI 组件库 (Material-UI、Ant Design、Chakra UI) 都采用
4. **可读性更好**：连字符比驼峰更易读，特别是长文件名
5. **URL 友好**：可以直接用于路由，无需转换

### 📦 Packages 目录规范

**组件命名规范** (v2025.11.03):
- ✅ React 组件文件: PascalCase: `Button.tsx`, `DataTable.tsx`
- ✅ 组件文件夹: PascalCase: `Button/`, `DataTable/`
- ✅ 文件夹/其他文件: kebab-case: `color-tokens.ts`, `theme-utils.ts`, `xorigo-logo-loader.tsx`
- ✅ 工具函数文件: kebab-case: `format-date.ts`, `color-helpers.ts`
- ✅ 类型定义文件: kebab-case: `user-types.ts`, `component-types.ts`
- ❌ 禁止版本号: `Button-v1.1.tsx`
- ❌ 禁止下划线: `my_button.tsx`
- ❌ 禁止 camelCase 文件名: `colorTokens.ts`, `themeUtils.ts`
- ❌ 禁止错误的分类: `ui/button.tsx`, `forms/input.tsx` (应为 `form/`)
- ✅ 十七分类体系: foundations/system/primitives (System Layer) + layout/navigation/inputs/form/data-display/typography-media/charts/feedback/overlays/interactive/utilities (Component Layer) + blocks/templates/labs (Composition Layer)

**API 设计标准**：
```typescript
// ✅ 推荐的 API 设计
interface ComponentProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
  disabled?: boolean
  onClick?: (event: Event) => void
}

// ✅ forwardRef 支持
const Component = React.forwardRef<HTMLDivElement, ComponentProps>(...)
Component.displayName = 'Component'
```

**📋 v2025.11.03 目录结构规范** (基于三层架构+17分类系统):
```
packages/core/src/
├── foundations/        # 🔹 System Layer - 设计令牌基础（颜色、字体、间距、动画等）
├── system/            # 🔹 System Layer - 系统级组件（主题系统、配方管理、主题切换器等）
├── primitives/        # 🔹 System Layer - 原子组件（Button、Card、Surface、ThemeSwitcher等）
│
├── layout/            # 🔷 Component Layer - 布局组件（Container、Box、Grid、Panel等）
├── navigation/        # 🔷 Component Layer - 导航组件（Navbar、Sidebar、Menu、Breadcrumb等）
├── inputs/            # 🔷 Component Layer - 输入控件（Button、Input、Select、Switch等）
├── form/              # 🔷 Component Layer - 表单组件（FormProvider、Field等）
├── data-display/      # 🔷 Component Layer - 数据展示（Table、List、Card等）
├── typography-media/  # 🔷 Component Layer - 排版媒体（Text、Heading、Image等）
├── charts/            # 🔷 Component Layer - 图表组件（LineChart、PieChart等）
├── feedback/          # 🔷 Component Layer - 反馈组件（Alert、Toast、Loading等）
├── overlays/          # 🔷 Component Layer - 覆盖层（Modal、Drawer、Popover等）
├── interactive/       # 🔷 Component Layer - 交互组件（DragDrop、Carousel等）
├── utilities/         # 🔷 Component Layer - 工具组件（Transition、Fade等）
│
├── blocks/            # 🔶 Composition Layer - 区块组件（Hero、Feature、Pricing等）
├── templates/         # 🔶 Composition Layer - 页面模板（Auth、Landing等）
├── labs/              # 🔶 Composition Layer - 实验组件（NewFeature、Tour等）
│
├── hooks/             # 🪝 自定义React Hooks
├── utils/             # 🛠️ 工具函数
└── types/             # 📝 TypeScript类型定义

# ⚠️ 应用层组件
apps/website/src/components/  # 🖥️ 应用级组件
```

**📁 组件文件夹结构**:
```
packages/core/src/{category}/
├── {ComponentName}/           # ✅ PascalCase 文件夹
│   ├── {ComponentName}.tsx   # ✅ PascalCase 组件文件
│   ├── {ComponentName}.test.tsx  # 测试文件
│   └── index.ts              # 导出文件
```

**🔍 关键检测规则**:
- ✅ **正确**: `packages/core/src/primitives/Button/Button.tsx`
- ❌ **错误**: `packages/core/src/components/ui/button.tsx`
- ✅ **正确**: `packages/core/src/form/Input/Input.tsx`
- ❌ **错误**: `packages/core/src/forms/input.tsx` (forms 应为单数 form)

### 🌐 Apps 目录规范

**页面命名规范**：
- ✅ 路由文件夹: kebab-case: `user-profile/`
- ✅ 页面文件: kebab-case: `user-profile.tsx` 或 page.tsx
- ✅ 路由参数: `[id]/page.tsx`
- ✅ 组件文件夹: PascalCase: `UserProfileCard/`
- ❌ 避免复杂嵌套: `a/b/c/d/page.tsx`
- ❌ 禁止 camelCase 文件名: `userProfile.tsx`

**组件导入规范**：
```typescript
// ✅ 正确的导入方式
import { Button, Card } from '@xorigo-ui/core'
import { PageLoader } from '@/components/marketing'

// ❌ 错误的导入方式
import { Button } from '../../../packages/core/src/primitives/Button/Button'
```

## 检测功能

### 🔍 自动质量检测

**单个组件检测**：
> "检查 Button 组件的代码质量"
> "验证 DataTable 的 API 设计"
> "分析 Card 组件的命名规范"

**批量质量检测**：
> "检查所有核心组件的质量"
> "验证整个项目的命名规范"
> "分析 packages 目录的架构合规性"

**专项检测**：
> "检查命名规范"
> "验证 API 一致性"
> "分析架构规则"
> "检查组件分类"

### 🛠️ 自动修复功能

**命名修复**：
- 自动重命名不符合规范的文件
- 修正变量和函数命名
- 统一目录命名规范

**API 修复**：
- 补充缺失的标准属性
- 修正事件处理器命名
- 统一 TypeScript 类型定义

**架构修复**：
- 修正导入路径
- 调整文件目录位置
- 解决循环依赖问题

## 质量报告

### 📊 代码质量评分

```
📊 Xorigo UI 代码质量报告
====================
检测时间: 2025-01-XX 14:30:25
检测范围: 45 个文件

总体评分: 87/100 (优秀)

🏆 各项评分:
- 命名规范: 92/100 ✅
- 架构规则: 85/100 ✅
- API 设计: 88/100 ✅
- 组件分类: 90/100 ✅
- TypeScript: 83/100 ⚠️

📋 详细结果:
✅ 通过项目: 38/45
⚠️ 警告项目: 5/45
❌ 错误项目: 2/45

🔧 需要修复的问题:
❌ Button-v1.1.tsx - 文件名包含版本号
   建议: 重命名为 Button.tsx
   自动修复: ✅ 可用

❌ InputComponent.tsx - 命名不规范
   建议: 重命名为 InputField.tsx
   自动修复: ✅ 可用

❌ colorTokens.ts - 文件名应使用 kebab-case
   建议: 重命名为 color-tokens.ts
   自动修复: ✅ 可用

❌ themeUtils.ts - 文件名应使用 kebab-case
   建议: 重命名为 theme-utils.ts
   自动修复: ✅ 可用

⚠️ CustomModal.tsx - 缺少标准属性
   建议: 添加 variant 和 size 属性
   自动修复: ✅ 可用
```

### 🎯 分类检测报告

```
🎯 组件分类合规性报告
====================

📦 核心组件 (Core Components):
✅ Button - API 完整度 100%
✅ Input - API 完整度 95%
⚠️ Modal - 缺少 trap-focus 属性
✅ Card - API 完整度 100%

🎨 高级组件 (Advanced Components):
✅ DataTable - 功能完整
✅ EnhancedCard - 动画集成良好
❌ CustomChart - 分类归属错误，应为 advanced

🏗️ 布局组件 (Layout Components):
✅ Header - 响应式设计完整
✅ Sidebar - 折叠功能完善
⚠️ Grid - 缺少 gap 属性支持

分类准确性: 92%
建议调整组件: 3 个
```

### 📝 API 一致性报告

```
📝 API 设计一致性报告
====================

🔍 标准属性检查:
variant 属性: 89% 组件支持 ✅
size 属性: 87% 组件支持 ✅
className 属性: 100% 组件支持 ✅
disabled 属性: 76% 组件支持 ⚠️
loading 属性: 45% 组件支持 ⚠️

🎯 变体系统:
primary 变体: 91% 组件支持 ✅
secondary 变体: 87% 组件支持 ✅
outline 变体: 73% 组件支持 ⚠️
ghost 变体: 68% 组件支持 ⚠️

📋 事件处理:
onClick: 89% 组件支持 ✅
onFocus: 67% 组件支持 ⚠️
onBlur: 65% 组件支持 ⚠️

一致性评分: 82/100
改进建议: 补充标准属性支持，统一变体命名
```

## 质量规则

### 🏷️ 命名规范规则

```typescript
// 命名规范检查规则
const namingRules = {
  // React 组件文件命名
  componentFiles: {
    pattern: /^[A-Z][a-zA-Z0-9]*\.tsx$/,
    description: 'React 组件文件必须使用 PascalCase',
    examples: {
      valid: ['Button.tsx', 'DataTable.tsx', 'UserProfile.tsx'],
      invalid: ['button.tsx', 'data-table.tsx', 'Button_v1.tsx', 'Button-v1.tsx']
    }
  },

  // 普通文件命名 (非组件文件)
  regularFiles: {
    pattern: /^[a-z][a-zA-Z0-9-]*\.(ts|tsx|js|jsx)$/,
    description: '普通文件必须使用 kebab-case',
    examples: {
      valid: ['color-tokens.ts', 'theme-utils.ts', 'xorigo-logo-loader.tsx'],
      invalid: ['colorTokens.ts', 'themeUtils.ts', 'color_tokens.ts', 'ColorTokens.ts']
    }
  },

  // 工具函数命名 (导出的函数/变量)
  utilityFunctions: {
    pattern: /^[a-z][a-zA-Z0-9]*$/,
    description: '导出的函数/变量使用 camelCase',
    examples: {
      valid: ['formatDate', 'calculateTotal', 'isValidEmail'],
      invalid: ['FormatDate', 'calculate_total', 'isValid-email']
    }
  },

  // 常量命名
  constants: {
    pattern: /^[A-Z][A-Z0-9_]*$/,
    description: '常量使用 UPPER_SNAKE_CASE',
    examples: {
      valid: ['API_BASE_URL', 'MAX_FILE_SIZE', 'DEFAULT_TIMEOUT'],
      invalid: ['apiBaseUrl', 'max_file_size', 'DefaultTimeout']
    }
  },

  // 类型/接口命名
  types: {
    pattern: /^[A-Z][a-zA-Z0-9]*$/,
    description: '类型和接口使用 PascalCase',
    examples: {
      valid: ['ColorTokenMap', 'ThemeConfig', 'UserSettings'],
      invalid: ['colorTokenMap', 'theme_config', 'color-token-map']
    }
  }
}
```

### 🏗️ 架构规则

```typescript
// 架构合规性检查
const architectureRules = {
  // 分层规则
  layering: {
    'packages/ui': {
      canImport: ['@xorigo-ui/tokens', '@xorigo-ui/theme'],
      cannotImport: ['apps/website']
    },
    'apps/website': {
      canImport: ['@xorigo-ui/core', '@/components'],
      cannotImport: ['packages/ui/src']
    }
  },

  // 组件职责规则
  componentResponsibilities: {
    ui: '只负责 UI 展示，不包含业务逻辑',
    layout: '负责布局和结构，可包含简单的状态管理',
    business: '包含业务逻辑，使用 UI 组件组合'
  },

  // 依赖方向规则
  dependencyDirection: {
    allowed: ['ui → theme', 'ui → tokens', 'app → ui'],
    forbidden: ['ui → app', 'theme → ui', 'tokens → ui']
  }
}
```

### 🎨 API 设计规则

```typescript
// API 设计标准
const apiDesignRules = {
  // 基础属性
  baseProps: {
    required: ['className', 'children'],
    recommended: ['variant', 'size', 'disabled'],
    optional: ['id', 'data-testid', 'aria-label']
  },

  // 变体系统
  variantSystem: {
    standardVariants: ['primary', 'secondary', 'outline', 'ghost'],
    standardSizes: ['sm', 'md', 'lg'],
    naming: {
      variant: '使用语义化的变体名称',
      size: '使用通用的尺寸名称'
    }
  },

  // 事件处理
  eventHandlers: {
    naming: {
      pattern: '^on[A-Z]',
      description: '事件处理器使用 on 前缀'
    },
    standardEvents: ['onClick', 'onFocus', 'onBlur', 'onChange'],
    accessibility: ['onKeyDown', 'onKeyUp', 'onKeyPress']
  }
}
```

## 自动修复

### 🛠️ 智能修复功能

**文件重命名**：
```bash
# 自动重命名不规范的文件
Button-v1.1.tsx → Button.tsx
my_component.tsx → MyComponent.tsx
data-table.tsx → DataTable.tsx
colorTokens.ts → color-tokens.ts
themeUtils.ts → theme-utils.ts
```

**API 标准化**：
```typescript
// 自动补充标准属性
interface ButtonProps {
  // ✅ 自动添加的标准属性
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean

  // 保留的现有属性
  customProp?: string
}

// 自动修复事件处理器
const handleButtonClick = (event: React.MouseEvent) => {
  // 规范化事件处理逻辑
}
```

**导入路径修复**：
```typescript
// ✅ 修复后的导入路径
import { Button, Card } from '@xorigo-ui/core'
import { PageLoader } from '@/components/marketing'

// ❌ 修复前的问题导入
import { Button } from '../../../packages/core/src/components/Button'
```

### 🔧 配置自定义规则

```typescript
// 自定义质量规则配置
const customQualityRules = {
  // 项目特定的命名规范
  projectNaming: {
    components: {
      prefix: 'X',
      pattern: /^X[A-Z][a-zA-Z0-9]*$/
    }
  },

  // 团队特定的 API 标准
  teamApiStandards: {
    requiredProps: ['testId', 'aria-label'],
    forbiddenProps: ['style', 'customClass']
  },

  // 业务特定的架构规则
  businessArchitecture: {
    componentCategories: ['presentation', 'container', 'business'],
    dependencyLayers: ['presentation → container → business']
  }
}
```

## 集成配置

### 🔌 IDE 集成

**VS Code 扩展配置**：
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.xorigo-quality": true
  },
  "xorigo-quality.rules": {
    "naming": "strict",
    "architecture": "strict",
    "api": "recommended"
  }
}
```

**ESLint 插件**：
```javascript
// eslint-plugin-xorigo-quality
module.exports = {
  plugins: ['xorigo-quality'],
  rules: {
    'xorigo-quality/naming': 'error',
    'xorigo-quality/architecture': 'error',
    'xorigo-quality/api-design': 'warn'
  }
}
```

### 🚀 CI/CD 集成

**GitHub Actions**：
```yaml
name: Code Quality Check
on: [push, pull_request]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Quality Checks
        run: npx xorigo-quality check --fail-on-error
      - name: Generate Quality Report
        run: npx xorigo-quality report --format=markdown
```

## 最佳实践

### 📏 评分标准

**命名规范评分** (100分制)：
- ✅ React 组件文件 PascalCase: +20分
- ✅ 普通文件 kebab-case: +20分
- ✅ 导出变量 camelCase: +15分
- ✅ 类型定义 PascalCase: +15分
- ✅ 常量 UPPER_SNAKE_CASE: +10分
- ❌ 版本号文件名: -20分
- ❌ 混合命名规范: -15分
- ❌ 不一致命名: -10分

**自动修复能力**：
- 🟢 **完全可修复**: 文件重命名、变量命名
- 🟡 **部分可修复**: 需要手动调整导入路径
- 🔴 **需要手动修复**: 复杂的架构调整

### ✅ 代码质量原则

1. **一致性优先** - 保持命名和 API 的一致性
2. **可读性至上** - 代码应该自文档化
3. **维护性考虑** - 便于未来维护和扩展
4. **团队协作** - 考虑团队协作的便利性
5. **现代标准** - 遵循当前前端生态最佳实践

### 📈 质量提升策略

1. **渐进式改进** - 逐步提升代码质量
2. **自动化优先** - 优先使用自动化工具
3. **知识共享** - 建立团队质量标准共识
4. **持续监控** - 建立质量监控体系
5. **工具链集成** - 与 ESLint、Prettier、TypeScript 深度集成

### 🔧 实际检查命令示例

对我说：
- "检查 utils 目录的文件命名是否符合 kebab-case 规范"
- "验证所有组件文件的命名是否正确"
- "分析 types 目录的文件命名和导出变量是否一致"
- "生成完整的命名规范合规性报告"
- "修复所有发现的命名问题"

### 💻 检测实现示例

**文件命名检测逻辑**：
```typescript
// 检测文件命名规范的伪代码
function validateFileNaming(filePath: string, isComponent: boolean): ValidationResult {
  const fileName = path.basename(filePath, path.extname(filePath));

  if (isComponent) {
    // React 组件文件必须使用 PascalCase
    const isValidPascalCase = /^[A-Z][a-zA-Z0-9]*$/.test(fileName);
    return {
      isValid: isValidPascalCase,
      suggestion: isValidPascalCase ? null : `重命名为 ${toPascalCase(fileName)}`,
      autoFix: true
    };
  } else {
    // 普通文件必须使用 kebab-case
    const isValidKebabCase = /^[a-z][a-z0-9-]*$/.test(fileName);
    return {
      isValid: isValidKebabCase,
      suggestion: isValidKebabCase ? null : `重命名为 ${toKebabCase(fileName)}`,
      autoFix: true
    };
  }
}

// 示例检测结果
[
  { file: 'Button.tsx', isValid: true, isComponent: true },
  { file: 'colorTokens.ts', isValid: false, suggestion: '重命名为 color-tokens.ts', autoFix: true },
  { file: 'theme-utils.ts', isValid: true, isComponent: false },
  { file: 'UserCard.tsx', isValid: true, isComponent: true }
]
```

**自动修复实现**：
```typescript
// 自动重命名文件
async function autoRenameFile(oldPath: string, newPath: string): Promise<void> {
  // 1. 检查新文件名是否已存在
  if (await fileExists(newPath)) {
    throw new Error(`目标文件 ${newPath} 已存在`);
  }

  // 2. 更新所有导入路径
  await updateImportPaths(oldPath, newPath);

  // 3. 重命名文件
  await fs.rename(oldPath, newPath);

  // 4. 验证重命名结果
  const renamed = await fileExists(newPath);
  if (!renamed) {
    throw new Error(`文件重命名失败: ${oldPath} → ${newPath}`);
  }
}

// 更新导入路径
async function updateImportPaths(oldPath: string, newPath: string): Promise<void> {
  const files = await findFilesThatImport(oldPath);

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const updated = content.replace(
      generateImportRegex(oldPath),
      generateNewImport(newPath)
    );
    await fs.writeFile(file, updated);
  }
}
```

让我知道你要检查什么代码质量问题，我会立即进行全面的代码质量分析和修复建议！