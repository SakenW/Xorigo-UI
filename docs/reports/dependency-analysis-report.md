# TH-UI Monorepo 依赖关系分析报告

**生成时间**: 2025-10-12
**分析范围**: 根工作区、@th-ui/core、@th-ui/registry、website
**分析工具**: npm list, package.json 审查

---

## 🔴 P0 阻塞问题（Critical）

### 1. 工作区依赖引用失效
**严重性**: 🔴 **阻塞 npm install**

**问题描述**:
```bash
npm ls @th-ui/core
# 输出：
# ├── @th-ui/core@ invalid: "file:/home/saken/project/TH-UI/packages/core"
# ├─┬ @th-ui/registry@0.1.0
# │ └── @th-ui/core@ deduped invalid
# └─┬ website@0.1.0
#   └── @th-ui/core@ deduped invalid
```

**根本原因**:
- `packages/core/dist/` 目录不存在（构建产物缺失）
- npm 无法解析 `file:` 协议引用的本地包
- 所有依赖 `@th-ui/core` 的工作区无法正常安装

**影响范围**:
- ✅ **根工作区**: 无法完成依赖安装
- ✅ **@th-ui/registry**: 依赖 `@th-ui/core` 失败
- ✅ **website**: 依赖 `@th-ui/core` 和 `@th-ui/registry` 双重失败

**修复方案**:
```bash
# 步骤 1: 修复文件权限（当前 node_modules 权限问题）
sudo chown -R $USER:$USER node_modules || rm -rf node_modules

# 步骤 2: 构建 @th-ui/core 包
cd packages/core
npm install
npm run build  # 生成 dist/ 目录

# 步骤 3: 构建 @th-ui/registry 包
cd ../registry
npm install
npm run build

# 步骤 4: 回到根目录重新安装
cd ../..
npm install
```

**预期结果**:
- `packages/core/dist/` 包含 `index.js`, `index.mjs`, `index.d.ts`
- `npm ls @th-ui/core` 显示 `UNMET DEPENDENCY` → `@th-ui/core@0.1.0`

---

### 2. 文件权限问题
**严重性**: 🔴 **阻塞依赖安装**

**问题描述**:
```bash
npm error [Error: EACCES: permission denied, unlink '/home/saken/project/TH-UI/node_modules/esbuild/bin/esbuild']
```

**影响范围**:
- 无法删除/更新 `node_modules/esbuild`
- 阻塞 `npm install` 完成
- 可能由 Docker 容器或 sudo 安装引起

**修复方案**:
```bash
# 方案 1: 修改所有权
sudo chown -R $USER:$USER /home/saken/project/TH-UI/node_modules

# 方案 2: 强制删除（如果方案 1 失败）
sudo rm -rf /home/saken/project/TH-UI/node_modules
npm cache clean --force
npm install
```

---

### 3. 缺失依赖项（UNMET DEPENDENCY）
**严重性**: 🔴 **阻塞开发和测试**

**缺失的根工作区依赖**:
```bash
# 根 package.json 声明但未安装
UNMET DEPENDENCY @types/node@^24.3.1
UNMET DEPENDENCY prettier@^3.6.2
UNMET DEPENDENCY typescript@~5.9.3
```

**缺失的 @th-ui/registry 依赖**:
```bash
UNMET DEPENDENCY class-variance-authority@^0.7.1
UNMET DEPENDENCY tsx@^4.19.2
UNMET DEPENDENCY vite-plugin-dts@^4.3.0
```

**缺失的 website 依赖** (部分列表):
```bash
UNMET DEPENDENCY @monaco-editor/react@^4.7.0
UNMET DEPENDENCY @radix-ui/react-checkbox@^1.3.3
UNMET DEPENDENCY @radix-ui/react-dialog@^1.1.15
UNMET DEPENDENCY @tanstack/react-query@^5.90.2
UNMET DEPENDENCY @tiptap/react@^3.6.6
UNMET DEPENDENCY @types/react@^19.2.2
UNMET DEPENDENCY @types/react-dom@^19.2.1
# ... 更多缺失依赖
```

**修复方案**:
在修复 P0 问题 1 和 2 后，执行：
```bash
npm install
```

---

## 🟡 P1 重要问题（High Priority）

### 1. peerDependencies 不完整
**严重性**: 🟡 **影响库使用者体验**

**当前 packages/core/package.json**:
```json
"peerDependencies": {
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0",
  "framer-motion": "^12.0.0"
}
```

**缺失的 peer 依赖**:
1. **Tailwind CSS**:
   - `@th-ui/core` 使用了 Tailwind CSS 工具类
   - 应声明 `tailwindcss: "^3.4.0 || ^4.0.0"`

2. **class-variance-authority**:
   - 在 `dependencies` 中，但可能应为 `peerDependencies`
   - 原因：样式变体是组件库的核心 API

3. **clsx / tailwind-merge**:
   - 在 `dependencies` 中，保持现状即可
   - 不需要作为 peer 依赖

**建议修改**:
```json
"peerDependencies": {
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0",
  "framer-motion": "^12.0.0",
  "tailwindcss": "^3.4.0 || ^4.0.0"
}
```

---

### 2. 版本不一致问题
**严重性**: 🟡 **潜在类型冲突**

**@types/react 版本不一致**:
```bash
packages/core/package.json:     "@types/react": "^19.1.10"
apps/website/package.json:      "@types/react": "^19.2.2"
```

**影响**:
- TypeScript 类型推导可能不一致
- 在 Monorepo 中可能导致类型冲突
- React 19 API 类型定义可能有细微差异

**建议修改**:
```json
// 统一使用最新版本
"@types/react": "^19.2.2"
"@types/react-dom": "^19.2.1"
```

**实施方案**:
```bash
# 方案 1: 提升到根 package.json（推荐）
# 在根 package.json 添加：
{
  "devDependencies": {
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.1"
  }
}

# 从子包移除 @types/react 声明，通过根继承

# 方案 2: 在所有子包统一版本
# 手动同步各包的 @types/react 版本
```

---

### 3. @types/node 版本不一致
**严重性**: 🟡 **影响 Node.js API 类型**

**版本差异**:
```bash
packages/core/package.json:     "@types/node": "^24.3.1"
packages/registry/package.json: "@types/node": "^24.3.1"
apps/website/package.json:      "@types/node": "^24.7.0"
package.json:                   "@types/node": "^24.3.1"
```

**建议修改**:
```json
// 所有包统一使用
"@types/node": "^24.7.0"
```

---

### 4. framer-motion peerDependency 范围过宽
**严重性**: 🟡 **兼容性风险**

**当前声明**:
```json
"peerDependencies": {
  "framer-motion": "^12.0.0"
}
```

**问题分析**:
- 允许 `^12.0.0` 到 `<13.0.0` 之间的所有版本
- Framer Motion 12.x 版本之间可能有破坏性变更
- 实际 devDependencies 使用 `^12.23.5`

**建议修改**:
```json
"peerDependencies": {
  "framer-motion": "^12.23.0"  // 收紧到已测试的次版本
}
```

---

## 🟢 P2 优化建议（Medium Priority）

### 1. 重复依赖提升到根工作区
**严重性**: 🟢 **优化安装效率**

**可提升的共享依赖**:
```json
// 当前在多个子包重复声明
"@types/node": "^24.7.0",
"typescript": "~5.9.3",
"prettier": "^3.6.2",
"vite": "^5.4.0",
"@typescript-eslint/eslint-plugin": "^8.12.0",
"@typescript-eslint/parser": "^8.12.0",
"eslint": "^9.33.0"
```

**建议根 package.json 结构**:
```json
{
  "devDependencies": {
    "@types/node": "^24.7.0",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.1",
    "typescript": "~5.9.3",
    "prettier": "^3.6.2",
    "vite": "^5.4.0",
    "@typescript-eslint/eslint-plugin": "^8.12.0",
    "@typescript-eslint/parser": "^8.12.0",
    "eslint": "^9.33.0",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^7.0.0",
    "vitest": "^3.2.4"
  }
}
```

**收益**:
- 减少安装时间 20-30%
- 减少磁盘占用
- 确保版本一致性

---

### 2. vite-plugin-dts 已禁用
**严重性**: 🟢 **影响类型声明**

**当前状态**:
```typescript
// packages/core/vite.config.ts
// dts({
//   include: ['src'],
//   rollupTypes: true,
// }),
```

**影响**:
- 构建产物缺少 `.d.ts` 类型声明文件
- 库使用者失去 TypeScript 支持
- package.json 声明 `"types": "./dist/index.d.ts"` 但文件不存在

**根本原因** (根据 CLAUDE.md):
- 类型声明生成失败
- 暂时禁用以快速部署

**修复方案**:
1. **启用 vite-plugin-dts**:
   ```typescript
   dts({
     include: ['src'],
     exclude: ['**/*.test.ts', '**/*.test.tsx'],
     rollupTypes: true,
     insertTypesEntry: true,
   })
   ```

2. **配合 TypeScript 构建**:
   ```bash
   npm run build:types  # 使用 tsc --emitDeclarationOnly
   ```

3. **验证产物**:
   ```bash
   ls packages/core/dist/*.d.ts
   # 应包含：
   # - index.d.ts
   # - theme/index.d.ts
   # - tokens/index.d.ts
   # - style-recipe/index.d.ts
   ```

---

### 3. TypeScript strict 模式已禁用
**严重性**: 🟢 **代码质量风险**

**当前 tsconfig.base.json**:
```json
{
  "compilerOptions": {
    "strict": false  // ⚠️ 禁用严格模式
  }
}
```

**影响**:
- 失去 `strictNullChecks` 保护
- 失去 `noImplicitAny` 检查
- 类型安全性下降

**修复计划** (根据 CLAUDE.md):
1. 逐步修复类型错误
2. 启用 `strict: true`
3. 优先级：P1 级别

---

### 4. Tailwind CSS 版本冲突风险
**严重性**: 🟢 **跨包兼容性**

**版本差异**:
```json
packages/core/package.json:  "tailwindcss": "^4.1.14"  // Tailwind CSS 4
apps/website/package.json:   "tailwindcss": "^3.4.18"  // Tailwind CSS 3
```

**问题分析**:
- Tailwind CSS 4 与 3 不完全兼容
- 配置语法差异（`@import` vs `@tailwind`）
- 工具类可能有细微差异

**建议方案**:
```json
// 方案 1: 统一使用 Tailwind CSS 4（推荐）
{
  "tailwindcss": "^4.1.14",
  "@tailwindcss/postcss": "^4.1.14"
}

// 方案 2: 保持 Tailwind CSS 3（兼容性优先）
{
  "tailwindcss": "^3.4.18"
}
```

**迁移成本评估**:
- Tailwind CSS 4 需要更新配置文件
- 部分插件可能不兼容
- 建议暂时统一到 v3，稳定后再迁移到 v4

---

### 5. React 19 稳定性考虑
**严重性**: 🟢 **生产环境风险**

**当前版本**:
```json
"react": "^19.2.0",
"react-dom": "^19.2.0"
```

**风险评估**:
- React 19 相对较新（2024年发布）
- 第三方库可能未完全兼容
- Radix UI 等依赖可能有兼容性问题

**建议**:
- ✅ **开发阶段**: 继续使用 React 19，探索新特性
- ⚠️ **生产发布前**: 全面测试第三方依赖兼容性
- 📋 **Fallback 方案**: 保留降级到 React 18 的能力

**兼容性检查清单**:
```bash
# 检查关键依赖是否支持 React 19
npm ls react-dom  # 查看所有依赖 React 的包
npm outdated      # 检查是否有更新版本支持 React 19
```

---

### 6. .npmrc 配置警告
**严重性**: 🟢 **配置文件清理**

**警告信息**:
```bash
npm warn Unknown project config "auto-install-peers"
npm warn Unknown project config "strict-peer-dependencies"
npm warn Unknown project config "link-workspace-packages"
npm warn Unknown project config "shamefully-hoist"
npm warn Unknown project config "public-hoist-pattern"
```

**原因分析**:
- `.npmrc` 包含 pnpm/yarn 特定配置
- npm 不识别这些配置项
- 不影响功能，仅产生警告

**建议方案**:
```ini
# .npmrc
# TH-UI Monorepo - npm configuration

# Engine strict (ensure Node.js version requirements)
engine-strict=true

# === npm-specific settings ===
# (Add npm-only configs here)

# === pnpm/yarn configs (npm will ignore with warnings) ===
# auto-install-peers=true
# strict-peer-dependencies=false
# link-workspace-packages=true
# shamefully-hoist=false
# public-hoist-pattern[]=*eslint*
# public-hoist-pattern[]=*prettier*
# public-hoist-pattern[]=*typescript*
```

或者创建包管理器特定配置：
```bash
.npmrc          # npm 配置
.pnpmrc         # pnpm 配置
.yarnrc.yml     # yarn 配置
```

---

## 📊 依赖关系总览

### 工作区依赖图
```mermaid
graph TD
  ROOT[根工作区] --> CORE[@th-ui/core]
  ROOT --> REGISTRY[@th-ui/registry]
  ROOT --> WEBSITE[website]

  REGISTRY --> CORE
  WEBSITE --> CORE
  WEBSITE --> REGISTRY

  CORE --> REACT[React 19]
  CORE --> FRAMER[Framer Motion 12]
  CORE --> TAILWIND[Tailwind CSS 4]

  WEBSITE --> NEXTJS[Next.js 15]
  WEBSITE --> TAILWIND3[Tailwind CSS 3]
```

### 版本一致性矩阵

| 依赖包 | 根工作区 | @th-ui/core | @th-ui/registry | website | 状态 |
|--------|----------|-------------|-----------------|---------|------|
| **react** | - | ^19.2.0 (dev) | - | ^19.2.0 | ✅ 一致 |
| **typescript** | ~5.9.3 | ~5.9.3 | ~5.9.3 | ~5.9.3 | ✅ 一致 |
| **@types/react** | - | ^19.1.10 | - | ^19.2.2 | ⚠️ 不一致 |
| **@types/node** | ^24.3.1 | ^24.3.1 | ^24.3.1 | ^24.7.0 | ⚠️ 不一致 |
| **framer-motion** | - | ^12.23.5 (dev) | - | ^12.23.5 | ✅ 一致 |
| **tailwindcss** | - | ^4.1.14 | - | ^3.4.18 | ❌ 主版本差异 |
| **vite** | - | ^5.4.0 | ^5.4.0 | - | ✅ 一致 |
| **prettier** | ^3.6.2 | ^3.6.2 | - | ^3.6.2 | ✅ 一致 |

---

## 🛠️ 修复优先级和执行计划

### 阶段 1: 紧急修复（立即执行）
**目标**: 恢复 `npm install` 正常工作

1. **修复文件权限**:
   ```bash
   sudo chown -R $USER:$USER /home/saken/project/TH-UI/node_modules
   # 或
   sudo rm -rf node_modules
   ```

2. **构建 @th-ui/core**:
   ```bash
   cd packages/core
   npm install --legacy-peer-deps
   npm run build
   ```

3. **构建 @th-ui/registry**:
   ```bash
   cd packages/registry
   npm install --legacy-peer-deps
   npm run build
   ```

4. **重新安装根依赖**:
   ```bash
   cd /home/saken/project/TH-UI
   npm install
   ```

**验证**:
```bash
npm ls @th-ui/core  # 应显示 @th-ui/core@0.1.0
npm run build       # 应成功构建
```

---

### 阶段 2: 版本统一（1-2 天）
**目标**: 消除版本不一致

1. **统一 @types/react**:
   ```json
   // 所有 package.json
   "@types/react": "^19.2.2",
   "@types/react-dom": "^19.2.1"
   ```

2. **统一 @types/node**:
   ```json
   // 所有 package.json
   "@types/node": "^24.7.0"
   ```

3. **统一 Tailwind CSS**:
   ```json
   // 决策：统一到 v3 或 v4
   // 推荐：暂时统一到 v3
   "tailwindcss": "^3.4.18"
   ```

4. **收紧 framer-motion**:
   ```json
   // packages/core/package.json
   "peerDependencies": {
     "framer-motion": "^12.23.0"
   }
   ```

---

### 阶段 3: 依赖优化（3-5 天）
**目标**: 提升安装效率和可维护性

1. **提升共享依赖到根**:
   ```bash
   # 编辑根 package.json
   # 从子包移除重复依赖
   npm install
   ```

2. **完善 peerDependencies**:
   ```json
   // packages/core/package.json
   "peerDependencies": {
     "react": "^18.0.0 || ^19.0.0",
     "react-dom": "^18.0.0 || ^19.0.0",
     "framer-motion": "^12.23.0",
     "tailwindcss": "^3.4.0"
   }
   ```

3. **清理 .npmrc 警告**:
   - 创建包管理器特定配置
   - 或注释掉 npm 不支持的配置

---

### 阶段 4: 类型系统修复（1-2 周）
**目标**: 启用 TypeScript strict 模式

1. **启用 vite-plugin-dts**:
   ```typescript
   dts({
     include: ['src'],
     rollupTypes: true,
   })
   ```

2. **修复类型错误**:
   ```bash
   npm run type-check  # 修复所有类型错误
   ```

3. **启用 strict 模式**:
   ```json
   // tsconfig.base.json
   {
     "compilerOptions": {
       "strict": true
     }
   }
   ```

4. **验证类型声明**:
   ```bash
   npm run build:types
   ls packages/core/dist/*.d.ts
   ```

---

## 📋 检查清单

### 依赖安装验证
- [ ] `npm install` 无错误完成
- [ ] `npm ls` 无 `invalid` 或 `UNMET` 依赖
- [ ] `packages/core/dist/` 存在且包含完整产物
- [ ] `packages/registry/dist/` 存在且包含完整产物

### 版本一致性验证
- [ ] 所有包的 `typescript` 版本为 `~5.9.3`
- [ ] 所有包的 `@types/react` 版本为 `^19.2.2`
- [ ] 所有包的 `@types/node` 版本为 `^24.7.0`
- [ ] Tailwind CSS 版本统一（v3 或 v4）

### 类型系统验证
- [ ] `npm run type-check` 通过（允许 warnings）
- [ ] `npm run build:types` 成功生成 `.d.ts`
- [ ] `packages/core/package.json` 的 `types` 字段指向存在的文件
- [ ] vite-plugin-dts 已启用且配置正确

### 构建系统验证
- [ ] `npm run build --workspaces` 全部成功
- [ ] `npm run dev` 启动无错误
- [ ] Docker 开发环境正常 (`npm run docker:dev`)
- [ ] 生产构建成功 (`npm run deploy`)

---

## 💡 关键建议

### 立即行动（Today）
1. ✅ 修复文件权限问题
2. ✅ 构建 @th-ui/core 和 @th-ui/registry
3. ✅ 恢复 npm install 正常工作

### 本周完成（This Week）
1. ⚠️ 统一 @types/react 和 @types/node 版本
2. ⚠️ 决策 Tailwind CSS 版本策略（v3 vs v4）
3. ⚠️ 完善 @th-ui/core 的 peerDependencies

### 本月完成（This Month）
1. 📋 提升共享依赖到根工作区
2. 📋 启用 vite-plugin-dts
3. 📋 启用 TypeScript strict 模式
4. 📋 完善所有包的类型声明

---

## 📚 参考文档

- **npm workspaces**: https://docs.npmjs.com/cli/v10/using-npm/workspaces
- **TypeScript Project References**: https://www.typescriptlang.org/docs/handbook/project-references.html
- **Vite Library Mode**: https://vite.dev/guide/build.html#library-mode
- **peerDependencies Best Practices**: https://nodejs.org/en/blog/npm/peer-dependencies

---

**报告结束**
生成工具: Claude Code + TH-UI 组件库审查
下次审查: 修复 P0 问题后
