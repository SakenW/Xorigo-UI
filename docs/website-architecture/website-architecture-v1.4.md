# 🌐 Xorigo UI Website 技术架构文档（v1.4 SSOT）- Website 专用

**作用域**：`apps/website` 应用架构
**职责**：网站技术实现、部署架构、用户界面、内容管理
**版本**：v1.4

---

## 一、Website 架构边界

### 应用分层

```
apps/website/
├── app/                       # ✅ Next.js 15 App Router
│   ├── (marketing)/          # 营销页面组
│   ├── (dashboard)/          # 功能页面组
│   ├── (content)/            # 内容页面组
│   ├── layout.tsx            # 根布局
│   └── globals.css           # 全局样式
├── src/
│   ├── components/           # ✅ Website 专用组件
│   ├── data/                 # ✅ 数据层
│   ├── lib/                  # ✅ 工具函数
│   └── hooks/                # ✅ 自定义钩子
├── public/                   # 静态资源
└── package.json             # 依赖配置
```

### 与 packages 的关系

| packages 层 | website 使用方式 | 示例 |
| ----------- | --------------- | ---- |
| **@xorigo-ui/core** | ✅ 消费组件库 | `import { Button } from '@xorigo-ui/core'` |
| **@xorigo-ui/system** | ✅ 主题切换 | `import { ThemeProvider } from '@xorigo-ui/system'` |
| **@xorigo-ui/tokens** | ✅ 设计令牌 | `import { colors } from '@xorigo-ui/tokens'` |
| **@xorigo-ui/registry** | ✅ 组件注册 | `import { ComponentRegistry } from '@xorigo-ui/registry'` |

---

## 二、技术栈架构（基于 taxonomy.yaml）

### 核心技术栈

```yaml
core_tech:
  framework: "Next.js 15 (App Router)"
  language: "TypeScript 5.9"
  styling: "Tailwind CSS 4"
  ui_library: "Xorigo UI v1.4"
  animation: "Framer Motion 12"
  state_management: "Zustand"

build_tools:
  bundler: "Next.js内置"
  monorepo: "PNPM 9"
  deployment: "Docker + Nginx"

development_tools:
  testing: "Vitest + Playwright"
  linting: "ESLint + Prettier"
  documentation: "Auto-generated from taxonomy"
```

### 包依赖关系

```json
{
  "dependencies": {
    "@xorigo-ui/core": "file:../../packages/core",
    "@xorigo-ui/system": "file:../../packages/system",
    "@xorigo-ui/tokens": "file:../../packages/tokens",
    "@xorigo-ui/registry": "file:../../packages/registry",
    "next": "^15.5.4",
    "react": "^19.2.0",
    "framer-motion": "^12.23.5"
  }
}
```

---

## 三、页面路由架构

### App Router 分组

```
app/
├── (marketing)/              # 营销页面组
│   ├── page.tsx              # 首页
│   ├── features/page.tsx     # 功能特性
│   └── pricing/page.tsx      # 价格页面
├── (dashboard)/              # 功能页面组
│   ├── layout.tsx            # 仪表板布局
│   ├── matrix/page.tsx       # 矩阵页面
│   └── tools/page.tsx        # 工具页面
├── (content)/                # 内容页面组
│   ├── docs/page.tsx         # 文档中心
│   ├── examples/page.tsx     # 示例展示
│   └── showcase/page.tsx     # 组件展示
├── layout.tsx                 # 根布局
├── globals.css                # 全局样式
└── not-found.tsx              # 404页面
```

### 路由命名规范（现代前端标准）

| 路由类型 | 命名规则 | 示例 |
|---------|----------|------|
| 静态页面 | kebab-case | `user-profile/page.tsx` |
| 动态路由 | kebab-case + 参数 | `[id]/page.tsx` |
| 布局文件 | PascalCase | `layout.tsx` |
| 特殊文件 | kebab-case | `loading.tsx`, `error.tsx` |

---

## 四、组件架构

### Website 专用组件

```
src/components/
├── ui/                        # UI 组件（基于 @xorigo-ui/core）
│   ├── button.tsx            # 扩展 Button 组件
│   ├── card.tsx              # 扩展 Card 组件
│   └── skeleton.tsx          # 骨架屏组件
├── marketing/                 # 营销页面组件
│   ├── hero-section.tsx      # 英雄区块
│   ├── feature-grid.tsx      # 特性网格
│   └── pricing-table.tsx     # 价格表
├── dashboard/                 # 仪表板组件
│   ├── sidebar.tsx           # 侧边栏
│   ├── header.tsx            # 头部导航
│   └── widget.tsx            # 小组件
└── layout/                    # 布局组件
    ├── page-container.tsx    # 页面容器
    ├── section-header.tsx    # 区块标题
    └── footer.tsx            # 页脚
```

### 组件开发规范

#### 文件命名（kebab-case 标准）
```typescript
// ✅ 正确的文件命名
hero-section.tsx          // kebab-case
feature-grid.tsx          // kebab-case
user-profile-card.tsx     // kebab-case

// ❌ 错误的文件命名
HeroSection.tsx           // 避免使用 PascalCase
featureGrid.tsx           // 避免使用 camelCase
```

#### 导出变量命名（camelCase 标准）
```typescript
// ✅ 正确的导出命名
export const heroSection = { ... }      // camelCase
export const createFeatureGrid = () => { ... }  // camelCase
export interface UserProfileCardProps { ... }   // PascalCase for interfaces
export const UserProfileCard = () => { ... }   // PascalCase for components
```

---

## 五、数据层架构

### 数据结构

```
src/data/
├── component-classification.ts  # 组件分类数据
├── recipes.readonly.ts         # 主题配方数据
├── registry.readonly.ts        # 组件注册数据
├── tokens.readonly.ts          # 设计令牌数据
├── validation.ts               # 数据验证
└── __tests__/                  # 数据测试
```

### 数据管理策略

```typescript
// ✅ 推荐的数据管理模式
export const componentClassification = {
  categories: [...],  // 基于 taxonomy.yaml
  components: [...],  // 组件列表
  metadata: {...}     // 元数据
}

// ✅ 类型安全的数据访问
export interface ComponentData {
  id: string
  name: string
  category: string
  variants: ComponentVariant[]
}

// ✅ 数据验证
export function validateComponentData(data: unknown): data is ComponentData {
  // Zod 验证逻辑
}
```

---

## 六、主题系统架构

### 主题提供者集成

```typescript
// src/components/theme-provider.tsx
import { ThemeProvider } from '@xorigo-ui/system'
import { themes } from '@xorigo-ui/tokens'

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(themes.midnight)

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}
```

### 主题切换实现

```typescript
// ✅ 主题切换组件
export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    const nextTheme = theme.mode === 'light' ? 'dark' : 'light'
    setTheme(themes[nextTheme])
  }

  return (
    <button onClick={toggleTheme}>
      Switch to {theme.mode === 'light' ? 'dark' : 'light'}
    </button>
  )
}
```

---

## 七、部署架构

### Docker 配置

```dockerfile
# Dockerfile（生产环境）
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 部署流程

```yaml
# GitHub Actions 工作流
name: Deploy Website
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'
      - name: Install dependencies
        run: npm ci
      - name: Build application
        run: npm run build
      - name: Deploy to production
        run: # 部署脚本
```

---

## 八、性能优化

### 代码分割策略

```typescript
// ✅ 组件懒加载
const ComponentPreview = dynamic(
  () => import('./component-preview'),
  { loading: () => <div>Loading...</div> }
)

// ✅ 路由级代码分割
const ComponentShowcase = dynamic(
  () => import('./component-showcase'),
  { ssr: false }
)
```

### 构建优化

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@xorigo-ui/core', 'framer-motion']
  },
  images: {
    domains: ['example.com'],
    formats: ['image/webp', 'image/avif']
  }
}
```

---

## 九、监控和分析

### 性能监控

```typescript
// ✅ 性能监控配置
export const reportWebVitals = (metric: NextWebVitalsMetric) => {
  // 发送到分析服务
  analytics.track('web-vitals', {
    name: metric.name,
    value: metric.value,
    id: metric.id,
  })
}
```

### 错误处理

```typescript
// ✅ 全局错误边界
export const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      {children}
      <ErrorReporting />
    </div>
  )
}
```

---

## 十、SSOT 依赖

本 Website 架构文档依赖于以下 SSOT 文档：

1. **`/docs/SHARED/theme-system-ssot-v1.4.md`** - 主题系统规范
2. **`/docs/SHARED/component-taxonomy-v1.4.yaml`** - ⭐ 组件分类定义（唯一事实来源）
3. **`/docs/UI-ARCHITECTURE/ui-architecture-ssot-v1.4.md`** - UI 架构标准
4. **`packages/core/src/system/theme-axis-controller.ts`** - 七轴系统实现

### 组件分类引用

```typescript
// ✅ Website 应用中的正确引用方式
import componentTaxonomy from '../../../docs/SHARED/component-taxonomy-v1.4.yaml'

// ✅ 在组件展示中使用分类
const featuredCategories = componentTaxonomy.categories.filter(cat =>
  ['primitives', 'components'].includes(cat.id)
)
```

**注意**：所有组件分类相关的功能必须引用 `SHARED/component-taxonomy-v1.4.yaml` 作为唯一事实来源。

所有架构决策必须与这些 SSOT 文档保持一致。

---

## 十一、文件命名标准总结

### Website 专用命名规范

| 文件类型 | 命名规则 | 示例 |
|---------|----------|------|
| 页面文件 | kebab-case | `user-profile/page.tsx` |
| 组件文件 | kebab-case | `hero-section.tsx` |
| 数据文件 | kebab-case | `component-data.ts` |
| 工具文件 | kebab-case | `format-utils.ts` |
| 类型文件 | kebab-case + `.types.ts` | `component.types.ts` |
| 配置文件 | kebab-case | `next.config.js` |

### 导出命名标准

| 导出类型 | 命名规则 | 示例 |
|---------|----------|------|
| 变量/函数 | camelCase | `export const userData` |
| 类型/接口 | PascalCase | `export interface UserProfileProps` |
| React 组件 | PascalCase | `export const UserProfileCard` |

---

*本文档为 Xorigo UI Website 技术架构的单一事实来源，版本 v1.4*