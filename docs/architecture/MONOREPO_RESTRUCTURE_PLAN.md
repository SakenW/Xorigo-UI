# 📦 TH-UI Monorepo 目录结构重组方案

> **目标**：将当前混合结构重组为标准 Monorepo 架构，符合 NEXTJS_ARCHITECTURE.md 设计

---

## 🎯 当前状态分析

### ❌ 当前问题

```
TH-UI/ (根目录 - 混合状态)
├── src/                    # ❌ 组件库源码位于根目录
├── tests/                  # ❌ 组件库测试位于根目录
├── package.json            # ❌ 配置为 @th-ui/core 包，非 Monorepo 根
├── vite.config.ts          # ❌ 组件库构建配置位于根目录
├── tsconfig.json           # ❌ 组件库 TS 配置位于根目录
├── tailwind.config.ts      # ❌ 组件库 Tailwind 配置位于根目录
│
├── apps/
│   └── website/            # ✅ Next.js 网站（正确位置）
│
└── packages/
    └── registry/           # ✅ Registry 包（正确位置）
```

**核心问题**：
1. 组件库文件散布在根目录，未按 Monorepo 规范组织
2. 根 package.json 是组件库配置，非工作区配置
3. 构建配置文件位置混乱

---

## ✅ 目标结构

### 标准 Monorepo 架构

```
TH-UI/ (Monorepo 根目录)
│
├── packages/                              # 📦 可复用包
│   ├── core/                              # @th-ui/core - 组件库
│   │   ├── src/
│   │   │   ├── components/                # UI 组件
│   │   │   ├── style-recipe/              # 七轴配方系统
│   │   │   ├── tokens/                    # 设计令牌
│   │   │   ├── theme/                     # 主题系统
│   │   │   ├── blocks/                    # 区块组件
│   │   │   ├── hooks/                     # React Hooks
│   │   │   ├── utils/                     # 工具函数
│   │   │   ├── types/                     # TypeScript 类型
│   │   │   └── index.ts                   # 入口文件
│   │   ├── tests/                         # 组件测试
│   │   ├── vite.config.ts                 # Vite 构建配置
│   │   ├── vite.config.demo.ts            # Demo 构建配置
│   │   ├── tsconfig.json                  # TypeScript 配置
│   │   ├── tailwind.config.ts             # Tailwind 配置
│   │   ├── package.json                   # 组件库依赖
│   │   └── README.md                      # 组件库文档
│   │
│   ├── registry/                          # @th-ui/registry - Registry API
│   │   ├── src/
│   │   ├── scripts/
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── i18n/                              # @th-ui/i18n - 国际化包（未来）
│       ├── src/
│       ├── locales/
│       └── package.json
│
├── apps/                                  # 🚀 应用程序
│   └── website/                           # Next.js 展示网站
│       ├── src/
│       │   ├── app/                       # App Router
│       │   │   ├── page.tsx               # 首页
│       │   │   ├── gallery/               # 配方库
│       │   │   ├── adoption/              # 取用矩阵
│       │   │   ├── playground/            # 在线预览
│       │   │   └── layout.tsx             # 根布局
│       │   ├── components/                # 网站专用组件
│       │   ├── lib/                       # 工具函数
│       │   └── styles/                    # 样式文件
│       ├── public/                        # 静态资源
│       ├── next.config.ts                 # Next.js 配置
│       ├── tailwind.config.ts             # Tailwind 配置
│       ├── tsconfig.json                  # TypeScript 配置
│       ├── package.json                   # 网站依赖
│       └── Dockerfile.dev                 # Docker 配置
│
├── docs/                                  # 📚 文档
│   ├── architecture/                      # 架构文档
│   ├── guides/                            # 指南文档
│   ├── references/                        # 参考文档
│   └── README.md                          # 文档中心
│
├── scripts/                               # 🔧 脚本工具
│   ├── dev-docker.sh
│   ├── deploy.sh
│   └── ...
│
├── examples/                              # 💡 示例代码（未来）
│
├── .github/                               # GitHub 配置
│   └── workflows/                         # CI/CD
│
├── package.json                           # ⭐ Monorepo 根配置
├── pnpm-workspace.yaml                    # ⭐ pnpm 工作区配置
├── turbo.json                             # ⭐ Turborepo 配置（未来）
├── tsconfig.base.json                     # ⭐ 共享 TS 配置
├── .gitignore                             # Git 忽略
└── README.md                              # 项目 README
```

---

## 🔄 迁移步骤

### Phase 1: 准备阶段 ✅

1. **备份当前状态**
   ```bash
   git checkout -b monorepo-restructure
   git add -A
   git commit -m "chore: 备份重组前状态"
   ```

2. **创建目标目录结构**
   ```bash
   mkdir -p packages/core
   ```

3. **保存当前根配置文件**
   ```bash
   cp package.json packages/core/package.json.bak
   cp vite.config.ts packages/core/vite.config.ts.bak
   cp tsconfig.json packages/core/tsconfig.json.bak
   cp tailwind.config.ts packages/core/tailwind.config.ts.bak
   ```

### Phase 2: 迁移组件库 🔄

4. **移动 src 目录**
   ```bash
   mv src packages/core/src
   ```

5. **移动 tests 目录**
   ```bash
   mv tests packages/core/tests
   ```

6. **移动构建配置文件**
   ```bash
   mv vite.config.ts packages/core/vite.config.ts
   mv vite.config.demo.ts packages/core/vite.config.demo.ts
   mv tsconfig.json packages/core/tsconfig.json
   mv tailwind.config.ts packages/core/tailwind.config.ts
   ```

7. **创建 packages/core/package.json**
   ```json
   {
     "name": "@th-ui/core",
     "version": "0.1.0",
     "type": "module",
     "main": "./dist/index.js",
     "module": "./dist/index.mjs",
     "types": "./dist/index.d.ts",
     "exports": {
       ".": {
         "import": "./dist/index.mjs",
         "require": "./dist/index.js",
         "types": "./dist/index.d.ts"
       },
       "./theme": {
         "import": "./dist/theme/index.mjs",
         "require": "./dist/theme/index.js",
         "types": "./dist/theme/index.d.ts"
       },
       "./style-recipe": {
         "import": "./dist/style-recipe/index.mjs",
         "require": "./dist/style-recipe/index.js",
         "types": "./dist/style-recipe/index.d.ts"
       }
     },
     "scripts": {
       "dev": "vite --config vite.config.demo.ts",
       "build": "vite build",
       "test": "vitest",
       "type-check": "tsc --noEmit"
     },
     "peerDependencies": {
       "react": "^19.0.0",
       "react-dom": "^19.0.0",
       "framer-motion": "^12.0.0"
     },
     "dependencies": {
       "@radix-ui/react-accordion": "^1.2.12",
       "@radix-ui/react-dialog": "^1.1.15",
       "class-variance-authority": "^0.7.1",
       "clsx": "^2.1.1",
       "framer-motion": "^12.23.5",
       "tailwind-merge": "^2.6.0"
     },
     "devDependencies": {
       "@vitejs/plugin-react": "^5.0.3",
       "typescript": "~5.9.3",
       "vite": "^5.4.0",
       "vitest": "^1.6.0"
     }
   }
   ```

### Phase 3: 创建 Monorepo 根配置 ⭐

8. **创建新的根 package.json**
   ```json
   {
     "name": "th-ui",
     "version": "0.1.0",
     "private": true,
     "description": "TH-UI Monorepo - Modern UI component library with Next.js website",
     "workspaces": [
       "packages/*",
       "apps/*"
     ],
     "scripts": {
       "dev": "pnpm --filter @th-ui/core dev",
       "dev:website": "pnpm --filter website dev",
       "build": "pnpm --filter @th-ui/core build",
       "build:all": "pnpm -r build",
       "test": "pnpm -r test",
       "lint": "pnpm -r lint",
       "type-check": "pnpm -r type-check",
       "clean": "pnpm -r clean && rm -rf node_modules"
     },
     "devDependencies": {
       "@types/node": "^24.3.1",
       "prettier": "^3.6.2",
       "turbo": "^2.0.0"
     },
     "engines": {
       "node": ">=22.0.0",
       "pnpm": ">=9.0.0"
     },
     "packageManager": "pnpm@9.0.0"
   }
   ```

9. **创建 pnpm-workspace.yaml**
   ```yaml
   packages:
     - 'packages/*'
     - 'apps/*'
   ```

10. **创建 tsconfig.base.json** (共享配置)
    ```json
    {
      "compilerOptions": {
        "target": "ES2022",
        "lib": ["ES2022", "DOM", "DOM.Iterable"],
        "jsx": "react-jsx",
        "module": "ESNext",
        "moduleResolution": "bundler",
        "resolveJsonModule": true,
        "allowJs": true,
        "strict": false,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "noEmit": true,
        "incremental": true,
        "isolatedModules": true
      }
    }
    ```

### Phase 4: 更新配置文件路径 🔧

11. **更新 packages/core/vite.config.ts**
    ```typescript
    // 确保路径指向当前目录的 src
    export default defineConfig({
      plugins: [react()],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          // ...
        }
      }
    })
    ```

12. **更新 apps/website/package.json**
    ```json
    {
      "dependencies": {
        "@th-ui/core": "workspace:*",
        "@th-ui/registry": "workspace:*"
      }
    }
    ```

### Phase 5: 更新文档 📚

13. **更新 docs/README.md**
    - 更新项目结构图
    - 修正文件路径引用

14. **更新 docs/architecture/*.md**
    - 修正代码示例中的路径
    - 更新导入语句

15. **更新根目录 README.md**
    - 更新项目结构说明
    - 添加 Monorepo 使用指南

### Phase 6: 验证和测试 ✅

16. **重新安装依赖**
    ```bash
    rm -rf node_modules packages/*/node_modules apps/*/node_modules
    pnpm install
    ```

17. **验证构建**
    ```bash
    pnpm build
    ```

18. **验证测试**
    ```bash
    pnpm test
    ```

19. **验证开发服务器**
    ```bash
    pnpm dev
    pnpm dev:website
    ```

20. **提交变更**
    ```bash
    git add -A
    git commit -m "refactor: 重组为标准 Monorepo 架构"
    ```

---

## 📋 迁移检查清单

### ✅ 文件迁移

- [ ] `src/` → `packages/core/src/`
- [ ] `tests/` → `packages/core/tests/`
- [ ] `vite.config.ts` → `packages/core/vite.config.ts`
- [ ] `vite.config.demo.ts` → `packages/core/vite.config.demo.ts`
- [ ] `tsconfig.json` → `packages/core/tsconfig.json`
- [ ] `tailwind.config.ts` → `packages/core/tailwind.config.ts`

### ✅ 配置文件

- [ ] 创建根 `package.json` (Monorepo 配置)
- [ ] 创建 `pnpm-workspace.yaml`
- [ ] 创建 `tsconfig.base.json`
- [ ] 创建 `packages/core/package.json`
- [ ] 更新 `apps/website/package.json`
- [ ] 更新 `packages/registry/package.json`

### ✅ 路径更新

- [ ] 更新 `packages/core/vite.config.ts` 中的路径
- [ ] 更新 `apps/website` 中的导入路径
- [ ] 更新文档中的路径引用
- [ ] 更新脚本中的路径

### ✅ 验证测试

- [ ] `pnpm install` 成功
- [ ] `pnpm build` 成功
- [ ] `pnpm test` 成功
- [ ] `pnpm dev` 成功
- [ ] `pnpm dev:website` 成功
- [ ] 所有构建产物正确生成

---

## 🎯 迁移后的优势

### 1. 清晰的架构边界
- ✅ 组件库、网站、工具包各自独立
- ✅ 依赖关系明确，单向依赖
- ✅ 便于代码复用和维护

### 2. 独立的版本管理
- ✅ 每个包可以独立发布
- ✅ 语义化版本控制
- ✅ 渐进式升级

### 3. 高效的开发体验
- ✅ 并行构建和测试
- ✅ 增量构建支持
- ✅ 精确的依赖追踪

### 4. 标准化的工具链
- ✅ Turborepo 任务编排（未来）
- ✅ Changesets 版本管理（未来）
- ✅ 统一的 CI/CD 流程

---

## ⚠️ 注意事项

### 重要约束
1. **apps/website 必须仅依赖 packages 中的包**
   - 禁止直接访问其他 apps 的代码
   - 禁止添加额外的 UI 组件库

2. **packages/core 不能依赖 apps**
   - 组件库必须保持纯粹和可复用
   - 不能包含网站特定逻辑

3. **保持向后兼容**
   - 导出路径保持不变
   - API 接口保持不变
   - 现有代码可以无缝迁移

### 风险控制
- ✅ 在分支中进行迁移，验证通过后合并
- ✅ 提交前备份当前工作
- ✅ 分步执行，每步验证
- ✅ 保留回滚能力

---

## 🚀 未来扩展

### 计划添加的包

```
packages/
├── @th-ui/core/              # ✅ 核心组件库
├── @th-ui/registry/          # ✅ Registry API
├── @th-ui/i18n/              # 🔄 国际化包
├── @th-ui/icons/             # 📅 图标包
├── @th-ui/charts/            # 📅 图表组件
└── @th-ui/forms/             # 📅 表单组件
```

### 计划添加的应用

```
apps/
├── website/                  # ✅ 展示网站
├── docs/                     # 📅 文档网站
└── playground/               # 📅 在线编辑器
```

---

**维护**: TH-UI Team
**版本**: 1.0.0
**状态**: ⏳ 待执行
**最后更新**: 2025-10-12
