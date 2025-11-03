# 📘 Xorigo UI 文件与文档命名规范

> **目标**：确保整个代码库、配置、测试、文档的命名一致、可读、可检索、可扩展，形成统一信息架构标准。

---

## 🎯 总体原则

| 原则     | 说明                                         |
| ------ | ------------------------------------------ |
| 一致性优先  | 同类型文件命名风格统一，避免混用                           |
| 可读性优先  | 文件名应能直观表达用途                                |
| 生态对齐   | 遵循 React / Node / ESLint / Storybook 等主流规范 |
| 可扩展    | 支持生成物、环境差异、阶段演进等多维扩展                       |
| 最小心智负担 | 一眼能分辨：组件 / 工具 / 文档 / 阶段报告 / 临时稿            |

---

## 🧩 1. 源代码命名规范

### 1.1 React 组件

* **格式**：`PascalCase.tsx`
* **规则**：组件名 = 文件名；仅用于导出组件逻辑。

✅ 示例：

```
Button.tsx
ThemeBridge.tsx
DataTable.tsx
MotionProvider.tsx
```

---

### 1.2 自定义 Hook

* **格式**：`use-xxx.ts`
* **理由**：与 React 社区惯例保持一致，利于 IDE 搜索与 Tree Shaking。

✅ 示例：

```
use-theme.ts
use-local-storage.ts
use-debounce.ts
```

---

### 1.3 工具与通用逻辑

* **格式**：`kebab-case.ts`
* **用途**：utils / helpers / lib / services / store / guards / schemas / api

✅ 示例：

```
component-helpers.ts
theme-utils.ts
color-contrast.ts
auth-guard.ts
user-schema.ts
api-client.ts
```

---

### 1.4 类型定义与常量

* **类型文件**：`kebab-case.types.ts`
* **常量文件**：`kebab-case.constants.ts`

✅ 示例：

```
theme.types.ts
api.types.ts
validation.constants.ts
color.constants.ts
```

---

### 1.5 生成、模拟、平台差异文件

| 用途        | 命名后缀                                                     | 示例                     |
| --------- | -------------------------------------------------------- | ---------------------- |
| 生成代码      | `.gen.ts` / `.auto.ts`                                   | `icon-map.gen.ts`      |
| Mock 数据   | `.mock.ts` / `.fixture.ts`                               | `user-data.fixture.ts` |
| Schema/枚举 | `.schema.ts` / `.enum.ts`                                | `theme.enum.ts`        |
| 平台差异      | `.browser.ts` / `.node.ts` / `.client.ts` / `.server.ts` | `logger.node.ts`       |

---

## ⚙️ 2. 配置与脚本文件命名规范

### 2.1 构建与工具配置

* **格式**：`kebab-case.config.{ts|mjs|js}`
* **若项目为 ESM 环境，建议 `.mjs`。

✅ 示例：

```
vite.config.ts
eslint.config.mjs
postcss.config.mjs
tailwind.config.ts
prettier.config.mjs
```

---

### 2.2 脚本文件

* **格式**：`kebab-case.{ts|js|sh}`

✅ 示例：

```
check-deps.js
generate-types.js
deploy.sh
cleanup-dist.ts
```

---

## 🧪 3. 测试与 Storybook 文件

| 类型        | 格式                        | 示例                      |                               |
| --------- | ------------------------- | ----------------------- | ----------------------------- |
| 单元测试      | `{filename}.test.{ts      | tsx}`                   | `Button.test.tsx`             |
| 端到端测试     | `kebab-case.spec.{ts      | js}`                    | `user-authentication.spec.ts` |
| Storybook | `{Component}.stories.tsx` | `DataTable.stories.tsx` |                               |

---

## 🎨 4. 样式文件

| 类型     | 格式                     | 示例                           |                     |
| ------ | ---------------------- | ---------------------------- | ------------------- |
| CSS 模块 | `kebab-case.module.css | scss`                        | `button.module.css` |
| 全局样式   | `kebab-case.css`       | `global.css`、`variables.css` |                     |

---

## 🧾 5. 文档文件命名规范（整合版）

> 📚 **文档管理工具**：使用 `xorigo-docs-structure-helper` 进行命名、索引、目录生成。

### 5.1 文档分类主线

| 线别    | 前缀                | 含义               |
| ----- | ----------------- | ---------------- |
| 项目阶段线 | `ph{N}`           | Phase 1–3 项目阶段文件 |
| 组件开发线 | `comp-{category}` | 组件库开发与优化         |
| 系统构建线 | `sys-{area}`      | 系统/工具/构建相关文档     |
| 质量保证线 | `qa-{type}`       | 测试、审查、评估报告       |

---

### 5.2 命名格式

```
{序号}-{scope}-{task}[-{stage}]-{描述}.md
```

✅ 示例：

```
comp-01-ThemeBridge组件重构-架构优化.md
sys-01-构建系统优化-性能提升.md
qa-02-代码质量审查-阶段一.md
ph3-01-项目封版-打包流程说明.md
```

**字段说明**：

* **序号**：两位数字（01, 02, 03）
* **scope**：`comp` / `sys` / `qa` / `ph`
* **task**：任务核心描述
* **stage**：可选阶段，如"第一阶段"
* **描述**：简要说明补充信息（可选）

---

### 5.3 文档结构组织

```
docs/
├── 00-TIMELINE-INDEX.md          # 全局时间线索引
├── guidelines/                   # 命名/开发规范类
│   └── naming-guidelines.md      # 完整命名指南
├── reports/                      # 阶段/任务报告
│   ├── phases/                   # Phase 文档
│   ├── components/               # 组件开发线
│   ├── design-system/            # 设计系统线
│   ├── build/                    # 构建系统线
│   └── deployment/               # 部署线
└── temp/                         # 临时文档（自动清理区）
```

---

### 5.4 特殊文档命名例外（保持大写）

```
README.md
LICENSE
CHANGELOG.md
CODE_OF_CONDUCT.md
CONTRIBUTING.md
SECURITY.md
```

其它所有文档：一律使用 **kebab-case.md**

✅ 示例：

```
getting-started.md
migration-guide.md
api-reference.md
```

---

### 5.5 临时文档

* **格式**：`temp-{描述}-{YYYYMMDD}.md`

✅ 示例：

```
temp-theme-analysis-20251103.md
temp-bug-investigation-20251103.md
```

---

## 🧱 6. 目录与结构命名规范

| 类型     | 格式         | 示例                                          |
| ------ | ---------- | ------------------------------------------- |
| 功能目录   | kebab-case | `components/`, `hooks/`, `utils/`, `types/` |
| 组件子目录  | kebab-case | `base/`, `layout/`, `form/`, `navigation/`  |
| 自动生成目录 | 前缀 `_`     | `_temp/`, `_cache/`, `_generated/`（自动忽略）    |

---

## ⚖️ 7. 一致性与 CI 校验规则

### ESLint（基于 `eslint-plugin-unicorn`）

* **默认** `kebabCase`
* **components/** 允许 `PascalCase`
* **忽略白名单文档**（见 §5.4）
* **CI 阶段**：`eslint --max-warnings=0` 阻断不合规提交

### Husky + lint-staged

* **在 `pre-commit` 钩子**执行 `eslint --fix`
* **同步格式化**与命名校验

### Dry-run 批量重命名脚本

* **`bash scripts/rename-to-norm.sh`**
* **支持** `--apply` 实际执行、自动忽略标准例外文档

---

## ⚠️ 8. 边界约定与兼容性策略

1. **导出边界**：所有包仅通过 `index.ts` 暴露外部 API，不直接依赖内部路径。
2. **大小写敏感性**：CI 模拟 Linux FS 检查，防止 `Button.tsx` / `button.tsx` 并存。
3. **生成与缓存目录排除**：`dist/`, `storybook-static/`, `coverage/`, `node_modules/`, `__snapshots__/` 均不纳入规范检测。

---

## ✅ 9. 命名优化验证总结

| 维度                       | 状态    | 说明                         |
| ------------------------ | ----- | -------------------------- |
| 工具兼容（React/TS/Storybook） | ✅     | Hook + E2E 对齐              |
| 结构清晰（docs/reports 分层）    | ✅     | 支持自动索引                     |
| 文档阶段语义                   | ✅     | ph/comp/sys/qa 四线明晰        |
| CI 可执行性                  | ✅     | ESLint + Husky + rename 脚本 |
| 可迁移性                     | ✅     | 支持未来 monorepo 扩展           |
| 成熟度                      | ⭐⭐⭐⭐☆ | A+ 级行业一致性方案                |

---

## 🧭 附：项目文档层级推荐实践

```
docs/
├── guidelines/
│   ├── naming-guidelines.md         # 本规范
│   ├── code-style-guide.md          # 代码风格
│   └── component-structure.md       # 组件结构约定
├── reports/
│   ├── comp-01-Button重构-可访问性优化.md
│   ├── sys-02-打包性能优化.md
│   ├── qa-01-单元测试覆盖率报告.md
│   └── ph3-01-版本封板说明.md
└── temp/
    └── temp-bug-analysis-20251103.md
```

---

## 🔄 10. 迁移指南

### 从旧规范迁移

1. **识别文件类型**：使用脚本自动识别当前文件类型
2. **批量重命名**：使用 `scripts/rename-to-norm.sh --apply`
3. **更新导入**：IDE 自动重命名功能更新所有导入路径
4. **验证结果**：运行 ESLint 检查确保无遗漏

### 常见迁移场景

| 旧文件名 | 新文件名 | 迁移类型 |
| ------- | ------- | ------ |
| `colorTokens.ts` | `color-tokens.ts` | 常量文件 |
| `UserProfile.tsx` | `UserProfile.tsx` | React 组件（保持不变） |
| `formatDate.ts` | `format-date.ts` | 工具函数 |
| `COMP-001-Button.md` | `comp-01-Button组件开发.md` | 文档 |

---

# ✅ 结论

该版本整合了：

* **原定义的文档命名逻辑**（phase/comp/sys/qa）
* **最新源码/测试/配置/脚本统一标准**
* **CI 可执行机制** + **迁移脚本支持**

整体结构清晰、分层合理、生态兼容、长期可维护，可直接作为 Xorigo UI 项目的**统一命名规范标准**。

---

*维护*: Xorigo UI Team
*版本*: 1.5.1
*更新*: 2025-11-03