# 🛠️ TH-UI 技术栈参考

> **技术栈完整版本信息和配置说明**

---

## 📊 当前技术栈状态

### ✅ 核心技术栈

| 技术 | 版本 | 状态 | 说明 |
|------|------|------|------|
| **React** | 19.2.0 | ✅ 最新 | 并发特性 + Server Components 支持 |
| **TypeScript** | 5.9.3 | ✅ 最新 | 严格类型系统 |
| **Tailwind CSS** | 4.1.14 | ✅ 最新 | Lightning CSS 引擎 |
| **Framer Motion** | 12.23.5 | ✅ 最新 | 动画系统 |
| **Vite** | 5.4.0 | ✅ 最新 | 库模式构建 |
| **Vitest** | 1.6.0 | ✅ 最新 | 单元测试 |
| **CVA** | 0.7.1 | ✅ 最新 | 类型安全变体系统 |

### 🧩 Radix UI 组件

| 组件 | 版本 | 用途 |
|------|------|------|
| @radix-ui/react-accordion | ^1.2.12 | 手风琴 |
| @radix-ui/react-dialog | ^1.1.15 | 对话框 |
| @radix-ui/react-dropdown-menu | ^2.1.16 | 下拉菜单 |
| @radix-ui/react-toast | ^1.2.15 | 提示消息 |

### 📦 可选依赖 (Peer Dependencies)

| 依赖 | 版本 | 用途 | 是否必需 |
|------|------|------|----------|
| @tanstack/react-query | ^5.0.0 | 数据获取 | ❌ 可选 |
| zustand | ^5.0.0 | 状态管理 | ❌ 可选 |
| react-hook-form | ^7.0.0 | 表单管理 | ❌ 可选 |
| zod | ^4.0.0 | 类型验证 | ❌ 可选 |
| @tiptap/react | ^2.0.0 | 富文本编辑 | ❌ 可选 |
| recharts | ^3.0.0 | 图表组件 | ❌ 可选 |
| next-themes | ^0.4.0 | 主题切换 | ❌ 可选 |

---

## 🎨 Tailwind CSS v4 配置

### 配置文件变更

**v3 配置 (已删除)**:
```typescript
// tailwind.config.ts - 已删除
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: { ... }
  }
}
```

**v4 配置 (CSS 文件)**:
```css
/* demo-site/styles.css */
@import 'tailwindcss';

@theme {
  --font-sans: Inter, system-ui, sans-serif;

  /* 自定义扩展 */
  --color-brand: #3b82f6;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}
```

### PostCSS 配置

```javascript
// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {},  // v4 新增
    // autoprefixer 已内置，无需显式配置
  }
}
```

### v4 主要变更

| 变更类型 | v3 → v4 | 影响 |
|----------|---------|------|
| **类名** | `shadow` → `shadow-sm` | 组件需调整 |
| | `shadow-sm` → `shadow-xs` |  |
| | `flex-grow-*` → `grow-*` |  |
| | `overflow-ellipsis` → `text-ellipsis` |  |
| **默认值** | border-color: `gray-200` → `currentColor` | 已自动兼容 |
| | ring: `3px blue-500` → `1px currentColor` | 已自动兼容 |
| **性能** | 构建时间优化 37.6% | 624ms vs 1000ms |

---

## 🏗️ 构构决策记录

### 决策 1: 组件库 vs Next.js 网站

**方案**: **分离架构**
- **组件库** (`@th-ui/core`): 使用 Vite，专注组件开发
- **展示网站** (`@th-ui/website`): 使用 Next.js 15，提供展示和取用矩阵

**理由**:
- ✅ 组件库构建更快（库模式优化）
- ✅ 展示网站可以充分利用 Next.js SSR/SSG
- ✅ 清晰的职责分离
- ✅ 用户可以选择性使用

### 决策 2: 新七轴配方系统

**方案**: **完全废弃旧 ThemeProvider，使用七轴 StyleRecipeProvider**

**旧系统**: 10个静态主题配置
**新系统**: 七轴参数化配方（动态 OKLCH 生成）

**优势**:
- ✅ 无限可扩展性
- ✅ 动态色彩生成
- ✅ 组件完全解耦
- ✅ 运行时切换性能优秀

### 决策 3: 技术栈版本策略

**策略**: **保守升级 + 可选依赖**

- ✅ 核心依赖使用最新稳定版
- ✅ 构建工具保持稳定（Vite）
- ✅ 复杂依赖标记为可选（peerDependencies）
- ✅ 提供详细集成文档

---

## 📋 升级历史

### 2025-10-10: Tailwind CSS v4 升级

- [x] 使用官方升级工具: `npx @tailwindcss/upgrade`
- [x] 配置迁移: JS → CSS (@theme 块)
- [x] PostCSS 更新: 添加 @tailwindcss/postcss
- [x] 构建测试通过: 624ms (优化 37.6%)
- [x] 兼容性样式自动添加

### 2025-01-13: 完整新系统架构

- [x] 七轴配方系统设计完成
- [x] OKLCH 色彩引擎设计
- [x] StyleRecipeProvider 架构
- [x] Next.js 网站架构设计
- [x] 核心文档体系完成

---

## 🔧 开发环境要求

### Node.js 和包管理器

```bash
# 推荐版本
node >= 22.0.0
npm >= 10.0.0

# 或使用 pnpm
pnpm >= 9.0.0
```

### 开发工具要求

- **IDE**: VS Code 1.90+
- **扩展**:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets

---

## 🚀 快速开始

### 基础使用

```bash
# 安装核心依赖
npm install @th-ui/core framer-motion

# 基础示例
import { Button, Card } from '@th-ui/core'

function App() {
  return (
    <Card>
      <Button variant="primary">Hello TH-UI</Button>
    </Card>
  )
}
```

### 完整集成 (带状态管理)

```bash
# 安装可选依赖
npm install @th-ui/core framer-motion @tanstack/react-query zustand react-hook-form zod
```

### Next.js 集成

```bash
# 创建 Next.js 项目
npx create-next-app@latest my-app --typescript --tailwind --app

# 安装 TH-UI
cd my-app
npm install @th-ui/core framer-motion

# 升级到 Tailwind v4 (如果需要)
npx @tailwindcss/upgrade
```

---

## 📚 相关文档

- [完整新系统架构](./NEW_SYSTEM_COMPLETE_GUIDE.md)
- [组件迁移指南](./COMPONENT_MIGRATION_GUIDE.md)
- [OKLCH 色彩系统](./OKLCH_COLOR_SYSTEM.md)
- [API 参考文档](./API_REFERENCE.md)
- [Next.js 网站架构](./NEXTJS_GALLERY_ADOPTION_ARCHITECTURE.md)

---

**维护**: TH-UI Team
**最后更新**: 2025-01-13
**版本**: 0.2.0 (Tailwind v4 + 七轴系统)