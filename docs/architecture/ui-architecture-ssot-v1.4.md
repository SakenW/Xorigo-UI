# 🎨 Xorigo UI 架构文档（v1.4 SSOT）- UI 架构专用

**作用域**：`packages/core` UI 组件架构
**职责**：UI 组件设计、分类、API 标准、开发规范
**版本**：v1.4

---

## 一、UI 架构边界

### 架构分层

```
packages/core/src/
├── foundations/              # ✅ 设计令牌层（SSOT 来源）
├── system/                  # ✅ 主题引擎层
├── primitives/              # ✅ UI 原子组件层
├── components/              # ✅ 结构组件层
└── index.ts                 # ✅ 统一导出
```

### 职责分离

| 层级 | 负责 | 示例 |
| ---- | ---- | ---- |
| **foundations** | 设计令牌定义 | `color-tokens.ts`, `density-tokens.ts` |
| **system** | 主题引擎运行时 | `theme-provider.tsx`, `theme-axis-controller.ts` |
| **primitives** | 原子组件 | `button/`, `card/`, `surface/` |
| **components** | 复合组件 | `layout/`, `feedback/`, `navigation/` |

---

## 二、组件分类系统（基于 taxonomy.yaml）

### 核心分类（Core）

#### 1. foundations - 基础设计
**描述**：静态设计令牌与基线规则（不含运行时状态）

**核心项目**：
- `design-tokens` - 令牌汇总入口
- `color-tokens` - 色谱与语义色
- `density-tokens` - 密度刻度
- `motion-curves` - 动画曲线基线
- `surface-tokens` - 表面视觉语言基线

#### 2. primitives - UI 基元
**描述**：可组合的无样式或轻样式原子组件与可达性基元

**核心组件**：
- `button` - 按钮基元
- `card` - 卡片基元
- `surface` - 表面容器基元
- `badge` - 徽章基元
- `avatar` - 头像基元
- `tooltip` - 工具提示基元

#### 3. components - 结构组件
**描述**：基于 primitives 的复合结构组件

**分类**：
- `layout/` - 布局组件
- `feedback/` - 反馈组件
- `navigation/` - 导航组件
- `data-display/` - 数据显示组件

---

## 三、API 设计标准

### 组件文件结构
```
component-name/
├── index.ts              # 统一导出
├── component-name.tsx   # 主组件实现
├── component-name.types.ts # 类型定义
├── component-name.variants.ts # CVA 变体定义
├── component-name.test.tsx   # 单元测试
└── component-name.stories.tsx # Storybook 故事
```

### 标准 Props 接口
```typescript
export interface ComponentProps
  extends React.HTMLAttributes<HTMLElementType>,
    VariantProps<typeof componentVariants> {

  // 🎨 变体系统
  variant?: ComponentVariant
  size?: ComponentSize

  // 🎭 状态控制
  disabled?: boolean
  loading?: boolean

  // 🎪 内容组合
  children?: React.ReactNode

  // 🛡️ 可访问性
  'aria-label'?: string

  // 🧪 测试属性
  testProps?: Record<string, string>
}
```

### 变体系统标准
```typescript
export const componentVariants = cva(
  "base-component-classes",
  {
    variants: {
      variant: {
        primary: "variant-primary-classes",
        secondary: "variant-secondary-classes",
      },
      size: {
        sm: "size-sm-classes",
        md: "size-md-classes",
        lg: "size-lg-classes",
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)
```

---

## 四、开发规范

### 文件命名规范（现代前端标准）

| 类型 | 命名规则 | 示例 |
|------|----------|------|
| 组件文件 | kebab-case | `button.tsx`, `data-table.tsx` |
| 类型定义 | kebab-case + `.types.ts` | `button.types.ts` |
| 工具函数 | kebab-case | `color-tokens.ts`, `theme-utils.ts` |
| 配置文件 | kebab-case | `vite.config.ts`, `tailwind.config.ts` |
| 测试文件 | kebab-case + `.test.tsx` | `button.test.tsx` |

### 导出变量命名标准

| 导出类型 | 命名规则 | 示例 |
|---------|----------|------|
| 常量 | camelCase | `export const colorTokens` |
| 函数 | camelCase | `export const createTheme` |
| 类型 | PascalCase | `interface ColorTokenMap` |
| 组件 | PascalCase | `export const Button` |

### 组件实现标准
```typescript
// ✅ 标准组件实现
export const Component = React.forwardRef<HTMLElementType, ComponentProps>(
  ({ className, variant, size, disabled, children, ...props }, ref) => {
    const variantClasses = componentVariants({ variant, size, disabled })
    const classes = cn(variantClasses, className)

    return (
      <ElementType
        ref={ref}
        className={classes}
        disabled={disabled}
        {...props}
      >
        {children}
      </ElementType>
    )
  }
)

Component.displayName = 'Component'
export { Component, componentVariants }
export type { ComponentProps }
```

---

## 五、质量保证

### 测试要求
- **单元测试**：每个组件必须有 `.test.tsx` 文件
- **可访问性测试**：使用 axe-core 进行 A11y 测试
- **视觉回归测试**：Storybook + Chromatic

### ESLint 规则
```json
{
  "rules": {
    "unicorn/filename-case": [
      "error",
      { "cases": { "kebabCase": true } }
    ]
  }
}
```

### 构建验证
- **类型检查**：`npm run type-check`
- **代码规范**：`npm run lint`
- **测试覆盖**：`npm run test:coverage`

---

## 六、版本控制

### 版本号规范
- **主版本**：破坏性 API 变更
- **次版本**：新功能或组件添加
- **修订版本**：Bug 修复或改进

### 发布流程
1. **开发完成**：组件通过所有测试
2. **文档更新**：API 文档和使用示例
3. **版本标记**：更新 package.json 版本号
4. **构建发布**：`npm run build && npm publish`

---

## 七、文档维护

### 文档文件结构
```
docs/UI-ARCHITECTURE/
├── ui-architecture-ssot-v1.4.md     # 本文档
├── component-api-standards.md        # API 标准
├── development-guidelines.md         # 开发指南
└── migration-guides/                 # 迁移指南
```

### 文档更新要求
- **API 变更**：必须同步更新文档
- **新组件**：添加完整 API 文档和使用示例
- **破坏性变更**：必须提供迁移指南

---

## 八、SSOT 依赖

本 UI 架构文档依赖于以下 SSOT 文档：

1. **`/docs/SHARED/theme-system-ssot-v1.4.md`** - 主题系统规范
2. **`/docs/SHARED/component-taxonomy-v1.4.yaml`** - ⭐ 组件分类定义（唯一事实来源）
3. **`packages/core/src/system/theme-axis-controller.ts`** - 七轴系统实现

### 组件分类引用

```typescript
// ✅ 正确的引用方式
import componentTaxonomy from '../../../docs/SHARED/component-taxonomy-v1.4.yaml'

// ✅ 在代码中使用分类标准
const categories = componentTaxonomy.categories
const components = componentTaxonomy.components
```

**注意**：所有组件分类相关的决策必须引用 `SHARED/component-taxonomy-v1.4.yaml` 作为唯一事实来源。

所有架构决策必须与这些 SSOT 文档保持一致。

---

*本文档为 Xorigo UI UI 架构的单一事实来源，版本 v1.4*