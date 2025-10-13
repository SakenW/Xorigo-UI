# 🤖 Xorigo UI 架构重构 - Agent 设计方案

> **执行工具**: claude-flow hive-mind
> **并发策略**: 多 Agent 并行执行，依赖感知
> **约束条件**: 仅重构 packages，不修改 website

---

## 📋 Agent 任务总览

| Agent ID | 任务名称 | 优先级 | 依赖关系 | 预计时间 |
|----------|---------|--------|---------|---------|
| **A1** | Package Creator | P0 | 无 | 15min |
| **A2** | Core Restructure | P0 | A1 | 30min |
| **A3** | Hooks Extractor | P0 | A1, A2 | 20min |
| **A4** | System Extractor | P0 | A1, A2 | 25min |
| **A5** | Dependency Fixer | P0 | A2, A3, A4 | 20min |
| **A6** | Export Configurator | P0 | A5 | 15min |
| **A7** | TypeScript Config | P0 | A6 | 10min |
| **A8** | Package.json Validator | P0 | A1-A7 | 10min |
| **A9** | Build System Tester | P0 | A8 | 15min |
| **A10** | Documentation Generator | P1 | A9 | 20min |

**总预计时间**: 约 3 小时（并行执行约 1 小时）

---

## 🎯 Phase 1: 基础包创建（并行执行）

### Agent A1: Package Creator

**目标**: 创建三个新包的基础结构

**输入**:
- 架构白皮书 1.3 节
- 现有 packages 结构

**任务清单**:
```bash
1. 创建 @xorigo-ui/system 包
   ├── packages/system/
   │   ├── src/
   │   │   ├── providers/
   │   │   │   ├── ThemeProvider.tsx
   │   │   │   ├── ConfigProvider.tsx
   │   │   │   └── A11yProvider.tsx
   │   │   ├── overlay/
   │   │   │   ├── Portal.tsx
   │   │   │   ├── ZLayerProvider.tsx
   │   │   │   └── OverlayManager.tsx
   │   │   ├── a11y/
   │   │   │   ├── FocusTrap.tsx
   │   │   │   ├── VisuallyHidden.tsx
   │   │   │   └── SkipNavLink.tsx
   │   │   ├── types/
   │   │   │   └── index.ts
   │   │   └── index.ts
   │   ├── package.json
   │   ├── tsconfig.json
   │   ├── vite.config.ts
   │   └── README.md

2. 创建 @xorigo-ui/hooks 包
   ├── packages/hooks/
   │   ├── src/
   │   │   ├── useControllableState.ts
   │   │   ├── useKeyboardNavigation.ts
   │   │   ├── useOverlay.ts
   │   │   ├── useFocusReturn.ts
   │   │   ├── useDebouncedValue.ts
   │   │   ├── useVirtualList.ts
   │   │   └── index.ts
   │   ├── package.json
   │   ├── tsconfig.json
   │   ├── vite.config.ts
   │   └── README.md

3. 创建 @xorigo-ui/cli 包
   ├── packages/cli/
   │   ├── bin/
   │   │   └── xorigo.js
   │   ├── src/
   │   │   ├── commands/
   │   │   │   ├── add.ts
   │   │   │   ├── tokens-export.ts
   │   │   │   ├── i18n-extract.ts
   │   │   │   ├── registry-scan.ts
   │   │   │   ├── check-keyboard.ts
   │   │   │   ├── check-overlay.ts
   │   │   │   └── check-virtualization.ts
   │   │   └── index.ts
   │   ├── package.json
   │   ├── tsconfig.json
   │   └── README.md
```

**package.json 模板**:
```json
// packages/system/package.json
{
  "name": "@xorigo-ui/system",
  "version": "0.1.0",
  "description": "Xorigo UI System - Theme, Config, A11y, Overlay management",
  "type": "module",
  "main": "./dist/index.cjs.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs.js"
    }
  },
  "files": ["dist", "README.md"],
  "scripts": {
    "build": "vite build",
    "type-check": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "dependencies": {
    "@xorigo-ui/tokens": "workspace:*",
    "@xorigo-ui/style-recipe": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.1",
    "typescript": "~5.9.3",
    "vite": "^7.1.9"
  },
  "sideEffects": false
}

// packages/hooks/package.json
{
  "name": "@xorigo-ui/hooks",
  "version": "0.1.0",
  "description": "Xorigo UI Hooks - Reusable React hooks for common behaviors",
  "type": "module",
  "main": "./dist/index.cjs.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs.js"
    }
  },
  "files": ["dist", "README.md"],
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.2.2",
    "typescript": "~5.9.3",
    "vite": "^7.1.9"
  },
  "sideEffects": false
}

// packages/cli/package.json
{
  "name": "@xorigo-cli",
  "version": "0.1.0",
  "description": "Xorigo UI CLI - Command line tools for scaffolding and validation",
  "type": "module",
  "bin": {
    "xorigo": "./bin/xorigo.js"
  },
  "files": ["bin", "dist"],
  "dependencies": {
    "commander": "^12.0.0",
    "chalk": "^5.3.0",
    "ora": "^8.0.1"
  },
  "devDependencies": {
    "@types/node": "^24.7.0",
    "typescript": "~5.9.3"
  }
}
```

**验证标准**:
- [ ] 三个包的目录结构创建完成
- [ ] package.json 符合 Monorepo 规范
- [ ] 依赖关系正确（system → tokens/style-recipe, hooks → 无, cli → 开发依赖）
- [ ] 所有包包含基础配置文件（tsconfig.json, vite.config.ts）

**输出**:
- 三个新包的完整结构
- 依赖关系声明文档

---

## 🔄 Phase 2: Core 包重构（顺序执行）

### Agent A2: Core Restructure

**目标**: 重组 core 包的组件目录结构

**依赖**: A1 完成

**输入**:
- 当前 packages/core/src 结构
- 架构白皮书 4.1 节（九大类组件体系）

**任务清单**:
```bash
1. 创建新的九大类目录
   mkdir -p packages/core/src/{base,layout,navigation,form,data,feedback,composite,visualization,adapters}

2. 迁移 components/ui → base
   mv packages/core/src/components/ui/* packages/core/src/base/

3. 迁移 components/feedback → feedback
   mv packages/core/src/components/feedback/* packages/core/src/feedback/

4. 合并 navigation 目录
   # 检查重复，合并 components/navigation 和根目录 navigation
   rsync -av packages/core/src/components/navigation/ packages/core/src/navigation/
   rm -rf packages/core/src/components/navigation

5. 拆分 components/advanced
   # 数据展示组件 → data
   mv packages/core/src/components/advanced/DataTable.tsx packages/core/src/data/
   mv packages/core/src/components/advanced/Card.tsx packages/core/src/data/
   # 复合组件 → composite/functional
   mkdir -p packages/core/src/composite/functional
   mv packages/core/src/components/advanced/TreeSelect.tsx packages/core/src/composite/functional/

6. 迁移 blocks → composite
   mkdir -p packages/core/src/composite/{business,functional,ui-pattern}
   mv packages/core/src/blocks/auth/* packages/core/src/composite/business/
   mv packages/core/src/blocks/forms/* packages/core/src/composite/business/
   mv packages/core/src/blocks/header/* packages/core/src/composite/ui-pattern/
   mv packages/core/src/blocks/hero/* packages/core/src/composite/ui-pattern/
   mv packages/core/src/blocks/footer/* packages/core/src/composite/ui-pattern/
   mv packages/core/src/blocks/pricing/* packages/core/src/composite/ui-pattern/

7. 迁移 components/radix → adapters/radix
   mkdir -p packages/core/src/adapters/radix
   mv packages/core/src/components/radix/* packages/core/src/adapters/radix/

8. 清理空目录
   rmdir packages/core/src/components/ui
   rmdir packages/core/src/components/feedback
   rmdir packages/core/src/components/navigation
   rmdir packages/core/src/components/advanced
   rmdir packages/core/src/components/radix
   rmdir packages/core/src/blocks

9. 更新各类导出文件
   # 创建各类的 index.ts
   echo "export * from './Button'\nexport * from './Input'" > packages/core/src/base/index.ts
   # ... 为每个类别创建 index.ts
```

**导出结构**:
```typescript
// packages/core/src/index.ts（更新后）
// Base 原子层
export * from './base'

// Layout 布局
export * from './layout'

// Navigation 导航
export * from './navigation'

// Form 表单
export * from './form'

// Data 数据展示
export * from './data'

// Feedback 反馈
export * from './feedback'

// Composite 复合组件
export * from './composite'

// Visualization 可视化
export * from './visualization'

// Adapters 适配层
export * from './adapters'

// Types
export * from './types'

// Utils
export * from './utils'

// 注意：不再导出 theme（已移至 @xorigo-ui/system）
// 注意：不再导出 hooks（已移至 @xorigo-ui/hooks）
```

**验证标准**:
- [ ] 无重复目录结构
- [ ] 所有组件文件正确迁移
- [ ] 无遗留空目录
- [ ] 导出路径更新完成

**输出**:
- 重组后的 core 包结构
- 组件迁移映射表

---

## 📤 Phase 3: 代码抽离（并行执行）

### Agent A3: Hooks Extractor

**目标**: 将 hooks 从 core 抽离到独立包

**依赖**: A1, A2 完成

**任务清单**:
```bash
1. 迁移 hooks 文件
   cp -r packages/core/src/hooks/* packages/hooks/src/

2. 补充缺失的 hooks（基于架构白皮书）
   # useControllableState
   # useKeyboardNavigation
   # useOverlay
   # useFocusReturn
   # useDebouncedValue
   # useVirtualList

3. 创建统一导出
   # packages/hooks/src/index.ts
   export * from './useControllableState'
   export * from './useKeyboardNavigation'
   export * from './useOverlay'
   export * from './useFocusReturn'
   export * from './useDebouncedValue'
   export * from './useVirtualList'

4. 删除 core 中的 hooks 目录
   rm -rf packages/core/src/hooks

5. 更新 core 包对 hooks 的引用
   # 替换所有 import from './hooks' 为 import from '@xorigo-ui/hooks'
   find packages/core/src -name "*.ts" -o -name "*.tsx" | xargs sed -i "s|from ['\"]\.\.\/hooks|from '@xorigo-ui/hooks|g"
```

**代码模板**:
```typescript
// packages/hooks/src/useControllableState.ts
import { useCallback, useState } from 'react';

export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T | undefined,
  onChange?: (next: T) => void
) {
  const [inner, setInner] = useState<T | undefined>(defaultValue);
  const isControlled = value !== undefined;
  const val = isControlled ? value : inner;

  const set = useCallback((next: T) => {
    if (!isControlled) setInner(next);
    onChange?.(next);
  }, [isControlled, onChange]);

  return [val, set] as const;
}

// packages/hooks/src/useKeyboardNavigation.ts
import { KeyboardEvent, useMemo } from 'react';

export interface KeyboardHandlers {
  onEnter?: () => void;
  onEscape?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onHome?: () => void;
  onEnd?: () => void;
}

export function useKeyboardNavigation(handlers: KeyboardHandlers) {
  const onKeyDown = useMemo(() => (e: KeyboardEvent) => {
    const handlerMap: Record<string, (() => void) | undefined> = {
      Enter: handlers.onEnter,
      Escape: handlers.onEscape,
      ArrowLeft: handlers.onArrowLeft,
      ArrowRight: handlers.onArrowRight,
      ArrowUp: handlers.onArrowUp,
      ArrowDown: handlers.onArrowDown,
      Home: handlers.onHome,
      End: handlers.onEnd,
    };
    const fn = handlerMap[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  }, [handlers]);

  return { onKeyDown };
}
```

**验证标准**:
- [ ] hooks 包包含所有必需的 hooks
- [ ] core 包中的 hooks 目录已删除
- [ ] core 包中的 hooks 引用已更新
- [ ] hooks 包可独立构建

**输出**:
- 完整的 @xorigo-ui/hooks 包
- core 包引用更新报告

---

### Agent A4: System Extractor

**目标**: 将主题和系统组件抽离到 system 包

**依赖**: A1, A2 完成

**任务清单**:
```bash
1. 迁移 theme 目录
   mv packages/core/src/theme/* packages/system/src/providers/

2. 实现 System 包核心组件
   # ThemeProvider
   # ConfigProvider
   # A11yProvider
   # ZLayerProvider
   # Portal
   # OverlayManager
   # FocusTrap
   # VisuallyHidden
   # SkipNavLink

3. 创建统一导出
   # packages/system/src/index.ts
   export * from './providers'
   export * from './overlay'
   export * from './a11y'

4. 更新 core 包对 theme 的引用
   # 替换所有 import from './theme' 为 import from '@xorigo-ui/system'
   find packages/core/src -name "*.ts" -o -name "*.tsx" | xargs sed -i "s|from ['\"]\.\.\/theme|from '@xorigo-ui/system|g"

5. 删除 core 中的 theme 目录
   rm -rf packages/core/src/theme
```

**代码模板**:
```typescript
// packages/system/src/providers/ThemeProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  mode?: ThemeMode;
  highContrast?: boolean;
  children: React.ReactNode;
}

export function ThemeProvider({
  mode: initialMode = 'system',
  highContrast: initialHighContrast = false,
  children
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const [highContrast, setHighContrast] = useState(initialHighContrast);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (mode === 'system') {
      const systemMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemMode);
    } else {
      root.classList.add(mode);
    }

    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [mode, highContrast]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, highContrast, setHighContrast }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// packages/system/src/overlay/ZLayerProvider.tsx
export const Z_INDEX_LEVELS = {
  base: 0,
  sticky: 10,
  dropdown: 1000,
  stickyTop: 1100,
  modal: 1200,
  modalOverlay: 1190,
  toast: 1300,
  tooltip: 1400,
  notification: 1500,
  debug: 9999,
} as const;

export type ZIndexLevel = keyof typeof Z_INDEX_LEVELS;

interface ZIndexContextValue {
  getZIndex: (level: ZIndexLevel) => number;
}

const ZIndexContext = createContext<ZIndexContextValue | undefined>(undefined);

export interface ZLayerProviderProps {
  baseZIndex?: number;
  children: React.ReactNode;
}

export function ZLayerProvider({ baseZIndex = 0, children }: ZLayerProviderProps) {
  const getZIndex = useCallback((level: ZIndexLevel) => {
    return Z_INDEX_LEVELS[level] + baseZIndex;
  }, [baseZIndex]);

  return (
    <ZIndexContext.Provider value={{ getZIndex }}>
      {children}
    </ZIndexContext.Provider>
  );
}

export function useZIndex() {
  const context = useContext(ZIndexContext);
  if (!context) {
    throw new Error('useZIndex must be used within ZLayerProvider');
  }
  return context;
}
```

**验证标准**:
- [ ] system 包包含所有系统组件
- [ ] core 包中的 theme 目录已删除
- [ ] core 包中的 theme 引用已更新
- [ ] system 包可独立构建

**输出**:
- 完整的 @xorigo-ui/system 包
- core 包引用更新报告

---

## 🔗 Phase 4: 依赖与配置（顺序执行）

### Agent A5: Dependency Fixer

**目标**: 修复所有包的依赖关系

**依赖**: A2, A3, A4 完成

**任务清单**:
```bash
1. 更新 core/package.json 依赖
   {
     "dependencies": {
       "@xorigo-ui/tokens": "workspace:*",
       "@xorigo-ui/style-recipe": "workspace:*",
       "@xorigo-ui/system": "workspace:*",
       "@xorigo-ui/hooks": "workspace:*",
       // ... 其他依赖
     }
   }

2. 验证依赖方向
   # core → tokens, style-recipe, system, hooks ✅
   # system → tokens, style-recipe ✅
   # hooks → 无 ✅
   # cli → registry (开发) ✅

3. 运行依赖检查
   npm install
   npm run type-check --workspaces

4. 检测循环依赖
   npx madge --circular packages/
```

**验证标准**:
- [ ] 无循环依赖
- [ ] 依赖方向符合架构规范
- [ ] workspace 协议正确使用
- [ ] npm install 成功

**输出**:
- 依赖关系图
- 循环依赖报告（应为空）

---

### Agent A6: Export Configurator

**目标**: 配置所有包的导出规范

**依赖**: A5 完成

**任务清单**:
```bash
1. 更新 core 包导出
   # packages/core/package.json
   {
     "exports": {
       ".": {
         "types": "./dist/index.d.ts",
         "import": "./dist/index.mjs",
         "require": "./dist/index.cjs.js"
       },
       "./base": {
         "types": "./dist/base/index.d.ts",
         "import": "./dist/base/index.mjs"
       },
       "./layout": { ... },
       "./navigation": { ... },
       "./form": { ... },
       "./data": { ... },
       "./feedback": { ... },
       "./composite": { ... },
       "./visualization": { ... }
     }
   }

2. 更新 system 包导出
   {
     "exports": {
       ".": {
         "types": "./dist/index.d.ts",
         "import": "./dist/index.mjs",
         "require": "./dist/index.cjs.js"
       },
       "./providers": { ... },
       "./overlay": { ... },
       "./a11y": { ... }
     }
   }

3. 更新 hooks 包导出
   {
     "exports": {
       ".": {
         "types": "./dist/index.d.ts",
         "import": "./dist/index.mjs",
         "require": "./dist/index.cjs.js"
       }
     }
   }

4. 标记副作用
   # 所有包添加 "sideEffects": false
```

**验证标准**:
- [ ] 导出路径正确
- [ ] 类型导出完整
- [ ] sideEffects 标记正确

**输出**:
- 导出配置文档

---

### Agent A7: TypeScript Config

**目标**: 统一 TypeScript 配置

**依赖**: A6 完成

**任务清单**:
```bash
1. 创建根 tsconfig.base.json
   {
     "compilerOptions": {
       "target": "ES2022",
       "lib": ["ES2022", "DOM", "DOM.Iterable"],
       "module": "ESNext",
       "moduleResolution": "bundler",
       "resolveJsonModule": true,
       "jsx": "react-jsx",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "paths": {
         "@xorigo-ui/tokens": ["./packages/tokens/src"],
         "@xorigo-ui/style-recipe": ["./packages/style-recipe/src"],
         "@xorigo-ui/system": ["./packages/system/src"],
         "@xorigo-ui/hooks": ["./packages/hooks/src"],
         "@xorigo-ui/core": ["./packages/core/src"],
         "@xorigo-cli/*": ["./packages/cli/src/*"]
       }
     }
   }

2. 更新各包 tsconfig.json
   {
     "extends": "../../tsconfig.base.json",
     "compilerOptions": {
       "outDir": "./dist",
       "rootDir": "./src"
     },
     "include": ["src"],
     "exclude": ["node_modules", "dist"]
   }

3. 配置 Project References
   # tsconfig.json
   {
     "references": [
       { "path": "./packages/tokens" },
       { "path": "./packages/style-recipe" },
       { "path": "./packages/system" },
       { "path": "./packages/hooks" },
       { "path": "./packages/core" },
       { "path": "./packages/cli" }
     ]
   }
```

**验证标准**:
- [ ] 路径映射正确
- [ ] IDE 智能提示正常
- [ ] 构建无路径解析错误

**输出**:
- TypeScript 配置文档

---

## ✅ Phase 5: 验证与文档（并行执行）

### Agent A8: Package.json Validator

**目标**: 验证所有包的 package.json 规范

**依赖**: A1-A7 完成

**任务清单**:
```bash
1. 检查必要字段
   - name（@xorigo-ui/* 或 @xorigo-cli）
   - version
   - type: "module"
   - main
   - module
   - types
   - exports
   - files
   - sideEffects

2. 检查依赖规范
   - peerDependencies（React 版本）
   - dependencies（workspace:*）
   - devDependencies（构建工具）

3. 检查脚本
   - build
   - type-check
   - lint（如果有）

4. 生成验证报告
   node scripts/validate-packages.js
```

**验证标准**:
- [ ] 所有包结构完整
- [ ] 无缺失必要字段
- [ ] 命名规范符合要求

**输出**:
- 包验证报告
- 不规范项清单

---

### Agent A9: Build System Tester

**目标**: 测试构建系统

**依赖**: A8 完成

**任务清单**:
```bash
1. 清理旧构建产物
   npm run clean --workspaces

2. 全量构建
   npm run build --workspaces

3. 类型检查
   npm run type-check --workspaces

4. 依赖检查
   npx madge --circular packages/

5. 构建产物验证
   - 检查 dist 目录存在
   - 检查 .d.ts 文件生成
   - 检查 esm 和 cjs 格式
```

**验证标准**:
- [ ] 构建成功率 100%
- [ ] TypeScript 编译无错误
- [ ] 无循环依赖

**输出**:
- 构建报告
- 错误日志（如果有）

---

### Agent A10: Documentation Generator

**目标**: 生成迁移文档和 README

**依赖**: A9 完成

**任务清单**:
```bash
1. 生成迁移指南
   - 组件路径变更映射
   - 导入语句更新示例
   - 破坏性变更说明

2. 更新包 README
   - packages/system/README.md
   - packages/hooks/README.md
   - packages/cli/README.md

3. 生成 CHANGELOG
   - 架构重构说明
   - 新增包列表
   - 迁移步骤

4. 更新根 README
   - Monorepo 结构说明
   - 包依赖关系图
   - 快速开始指南
```

**输出**:
- MIGRATION_GUIDE.md
- 各包 README.md
- CHANGELOG.md

---

## 🚀 执行策略

### 并行执行分组

**Group 1** (并行):
- A1: Package Creator

**Group 2** (并行，依赖 A1):
- A2: Core Restructure

**Group 3** (并行，依赖 A1, A2):
- A3: Hooks Extractor
- A4: System Extractor

**Group 4** (顺序):
- A5: Dependency Fixer
- A6: Export Configurator
- A7: TypeScript Config

**Group 5** (并行，依赖 A1-A7):
- A8: Package.json Validator
- A9: Build System Tester

**Group 6** (依赖 A9):
- A10: Documentation Generator

### claude-flow 命令

```bash
# 确保在项目根目录执行
cd /home/saken/project/Xorigo-UI

# 执行 hive-mind 模式
claude-flow hive-mind \
  --agents "A1,A2,A3,A4,A5,A6,A7,A8,A9,A10" \
  --parallel-groups "A1|A2|A3,A4|A5,A6,A7|A8,A9|A10" \
  --config ./docs/待整理/架构重构-Agent设计方案.md \
  --output ./docs/reports/架构重构执行报告.md
```

---

## ⚠️ 风险控制

### 回滚策略

1. **Git 分支保护**
   ```bash
   git checkout -b refactor/monorepo-restructure
   git add -A
   git commit -m "chore: 架构重构备份点"
   ```

2. **备份关键目录**
   ```bash
   cp -r packages packages-backup-$(date +%Y%m%d-%H%M%S)
   ```

3. **分阶段提交**
   - 每个 Phase 完成后提交一次
   - 使用语义化提交信息

### 质量门禁

- [ ] 构建成功率 100%
- [ ] TypeScript 编译无错误
- [ ] 无循环依赖
- [ ] 所有包可独立构建
- [ ] 导入路径正确

---

## 📝 验收清单

### 架构一致性
- [ ] 七轴→包映射清晰
- [ ] 组件层级符合九大类
- [ ] 依赖方向正确
- [ ] 包边界清晰

### 工程质量
- [ ] TypeScript 严格模式通过
- [ ] 所有包构建成功
- [ ] 导出配置正确
- [ ] 文档完整

### 迁移完整性
- [ ] 无遗失组件
- [ ] 导入路径更新
- [ ] 类型导出完整
- [ ] 测试可运行

---

**准备就绪，等待您的确认后执行！**
