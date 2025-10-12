# 🎭 Xorigo UI 组件展示架构

> **严格依赖原则**：网站必须仅使用组件库组件，完整展示所有组件效果

---

## 🎯 核心设计原则

### ⚠️ 严格依赖约束

1. **禁止额外UI组件库**
   ```typescript
   // ❌ 禁止的行为
   import { Button } from 'antd'          // 禁止
   import { Card } from '@mui/material'  // 禁止
   import { Component } from 'chakra-ui'  // 禁止

   // ✅ 正确的行为
   import { Button, Card } from '@xorigo-ui/core'  // 必须使用组件库
   ```

2. **组件开发优先级**
   ```bash
   # 开发流程
   1. 发现网站需要新组件 → 2. 在组件库设计创建 → 3. 网站使用组件
   ```

3. **完整性要求**
   - 网站必须展示组件库的所有组件
   - 网站必须展示每个组件的所有变体和状态
   - 禁止"组件在组件库有但网站不展示"的情况

### 🎨 样式系统分离

#### 配方系统（网站全局）
```typescript
// 网站整体使用配方系统切换
<StyleRecipeProvider initialRecipe="dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass">
  {/* 整个网站使用统一配方 */}
</StyleRecipeProvider>
```

#### 组件展示（独立于配方）
```typescript
// 组件展示页面使用独立样式系统
<div className="component-showcase">
  {/* 使用固定的展示样式，不受配方切换影响 */}
  <ComponentShowcase />
</div>
```

---

## 📋 组件库当前状态

### ✅ 已有组件（17个）

| 类别 | 组件 | 变体 | 尺寸 | 状态 |
|------|------|------|------|------|
| **基础** | Button | primary, secondary, ghost, glass | sm, md, lg | normal, loading, disabled |
| **基础** | Card | default, elevated, glass | - | - |
| **基础** | Input | default, error, success | sm, md, lg | normal, focus, disabled |
| **布局** | Avatar | default, badge | sm, md, lg | - |
| **布局** | Badge | default, primary, success, warning, error | - | - |
| **反馈** | Alert | info, success, warning, error | - | - |
| **反馈** | Toast | default, success, error | - | - |
| **反馈** | Spinner | sm, md, lg | - | - |
| **导航** | Breadcrumb | default | - | - |
| **导航** | Tabs | default, underline | - | - |
| **导航** | Dropdown | default | - | - |
| **导航** | Accordion | default | - | - |
| **表单** | Checkbox | default | - | - |
| **表单** | Radio | default | - | - |
| **表单** | Switch | default | - | - |
| **表单** | Textarea | default | - | - |
| **表单** | Select | default | - | - |
| **高级** | Modal | default | - | - |

---

## 🏗️ 组件展示页面设计

### 1. 完整组件展示页面 `/components`

**页面结构**：
```typescript
// src/app/components/page.tsx
export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 页面标题 */}
      <header className="component-showcase-header">
        <h1>组件库完整展示</h1>
        <p>展示所有17个组件的所有变体和状态</p>
      </header>

      {/* 组件分类导航 */}
      <ComponentCategories />

      {/* 组件展示网格 */}
      <ComponentShowcaseGrid />
    </div>
  )
}
```

### 2. 单个组件展示组件

```typescript
// src/components/ComponentShowcase.tsx
interface ComponentShowcaseProps {
  component: string  // 组件名称
  variants: string[] // 所有变体
  sizes: string[]    // 所有尺寸
  states: string[]   // 所有状态
}

export function ComponentShowcase({ component, variants, sizes, states }: ComponentShowcaseProps) {
  return (
    <div className="component-showcase">
      {/* 组件标题 */}
      <h2 className="component-title">{component}</h2>

      {/* 展示网格 */}
      <div className="showcase-grid">
        {variants.map(variant => (
          <div key={variant} className="variant-group">
            <h3>{variant}</h3>
            {sizes.map(size => (
              <div key={size} className="size-group">
                <h4>{size}</h4>
                {states.map(state => (
                  <div key={state} className="state-demo">
                    {/* 使用固定样式展示，不受配方影响 */}
                    <ComponentDemo
                      component={component}
                      variant={variant}
                      size={size}
                      state={state}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 3. 组件演示组件

```typescript
// src/components/ComponentDemo.tsx
interface ComponentDemoProps {
  component: string
  variant: string
  size: string
  state: string
}

export function ComponentDemo({ component, variant, size, state }: ComponentDemoProps) {
  // 根据组件名称动态渲染
  const renderComponent = () => {
    switch (component) {
      case 'Button':
        return (
          <Button
            variant={variant as any}
            size={size as any}
            disabled={state === 'disabled'}
            loading={state === 'loading'}
          >
            {state === 'loading' ? 'Loading...' : `${variant} ${size}`}
          </Button>
        )

      case 'Card':
        return (
          <Card variant={variant as any}>
            <h3>Card Title</h3>
            <p>Card content with {variant} variant</p>
          </Card>
        )

      case 'Input':
        return (
          <Input
            variant={variant as any}
            size={size as any}
            placeholder={`Input ${variant} ${size}`}
            disabled={state === 'disabled'}
          />
        )

      // ... 其他组件
      default:
        return <div>Unknown component: {component}</div>
    }
  }

  return (
    <div className="component-demo">
      {/* 固定样式，不受配方切换影响 */}
      <div className="demo-wrapper">
        {renderComponent()}
      </div>
      <div className="demo-info">
        <span className="variant">{variant}</span>
        <span className="size">{size}</span>
        <span className="state">{state}</span>
      </div>
    </div>
  )
}
```

---

## 🎨 样式系统设计

### 展示页面固定样式

```css
/* src/styles/components-showcase.css */
.component-showcase {
  /* 固定展示样式，不受配方系统影响 */
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 24px;
  margin: 16px 0;
}

.component-showcase-header {
  text-align: center;
  margin-bottom: 48px;
}

.showcase-grid {
  display: grid;
  gap: 32px;
}

.variant-group {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 16px;
}

.size-group {
  margin: 16px 0;
}

.state-demo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid #f1f5f9;
  border-radius: 4px;
  margin: 8px 0;
}

.demo-wrapper {
  /* 确保组件使用默认样式 */
  background: white;
  padding: 16px;
  border-radius: 4px;
}

.demo-info {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
}
```

### 配方系统与展示系统分离

```typescript
// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>
        {/* 配方系统仅影响网站框架，不影响组件展示 */}
        <StyleRecipeProvider>
          <div className="app-layout">
            <Navigation />
            <main>{children}</main>
            <Footer />
          </div>
        </StyleRecipeProvider>
      </body>
    </html>
  )
}
```

---

## 📊 组件展示完整性检查

### 必须展示的维度

每个组件必须展示以下所有维度：

| 维度 | 要求 | 检查点 |
|------|------|--------|
| **变体(variant)** | 所有可用变体 | primary, secondary, ghost, glass, default, elevated |
| **尺寸(size)** | 所有可用尺寸 | sm, md, lg (如果有) |
| **状态(state)** | 所有可用状态 | normal, loading, disabled, focus, error, success |
| **组合** | 跨维度组合 | variant + size + state 的所有组合 |
| **交互** | 所有交互行为 | hover, focus, active, disabled |
| **可访问性** | ARIA 支持 | keyboard navigation, screen reader |

### 自动化检查

```typescript
// src/lib/component-checker.ts
export function checkComponentCompleteness(componentName: string) {
  const component = getComponentDefinition(componentName)
  const requiredDimensions = ['variants', 'sizes', 'states']

  const completeness = requiredDimensions.map(dimension => ({
    dimension,
    provided: component[dimension]?.length || 0,
    expected: getExpectedCount(dimension),
    missing: findMissingVariants(component, dimension)
  }))

  return {
    component: componentName,
    completeness,
    score: calculateCompletenessScore(completeness),
    issues: identifyMissingFeatures(completeness)
  }
}
```

---

## 🔧 开发工作流程

### 新组件开发流程

```bash
# 1. 需求确认
发现网站需要新组件 → 检查是否已存在于组件库

# 2. 组件库开发
cd packages/@xorigo-ui/core
# 创建新组件文件
# 实现所有变体和状态
# 添加测试
# 构建验证

# 3. 网站集成
cd packages/@xorigo-ui/website
# 导入新组件
# 创建展示组件
# 添加到展示页面

# 4. 验证完整性
npm run check:components  # 自动检查组件完整性
```

### 依赖管理

```json
// packages/@xorigo-ui/website/package.json
{
  "dependencies": {
    "@xorigo-ui/core": "workspace:*",  // 必须使用工作区版本
    "framer-motion": "^12.23.5",    // 仅来自组件库
    // 禁止：antd, @mui/material, chakra-ui 等外部UI库
  }
}
```

---

## 📋 验收标准

### ✅ 必须满足

1. **100% 组件覆盖率** - 组件库所有组件都在网站展示
2. **100% 变体展示** - 每个组件的所有变体都有展示
3. **100% 状态展示** - 每个组件的所有状态都有展示
4. **0 外部依赖** - 网站不使用任何外部UI组件库
5. **样式分离** - 组件展示不受配方系统影响

### 🔍 质量检查

- 组件展示页面完整性检查
- 依赖关系验证
- 样式隔离测试
- 可访问性验证

---

**创建时间**: 2025-01-13
**更新时间**: 2025-01-13
**状态**: 🎭 架构设计
**负责人**: Xorigo UI Team