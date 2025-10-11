# 📚 Context7 集成策略 - Agent 技术栈文档增强

## 🎯 核心策略：融入式集成

**推荐方案**: 将 Context7 文档查询**直接融入每个 Agent** 的指令中，而不是创建独立的文档 Agent。

### 为什么选择融入式？

#### ✅ 优势

1. **上下文连贯性**
   - Agent 在实现功能时直接参考最新官方文档
   - 避免"查文档 → 传递信息 → 实现"的信息损耗

2. **效率提升**
   - 减少 Agent 间的通信开销
   - 单个 Agent 可以自主完成"查阅 → 理解 → 实现"

3. **质量保证**
   - 确保代码遵循官方最佳实践
   - 避免过时或错误的实现模式

4. **灵活性**
   - 不同 Agent 查询不同技术栈的文档
   - 按需查询，无需预先准备

#### ❌ 独立 Agent 的劣势

1. **信息传递损耗** - 文档 Agent → 实现 Agent 需要额外交互
2. **上下文分离** - 实现 Agent 可能误解文档 Agent 的总结
3. **效率降低** - 串行执行降低并行能力
4. **职责不清** - 文档 Agent 的粒度难以把控

---

## 📋 融入式集成指南

### 1. 在 Agent 指令中添加文档查询步骤

**标准模板**:
```markdown
**[Agent 名称]** (Agent-ID)
- 任务: [具体任务描述]
- **技术栈文档查询** (使用 Context7):
  * React 19: [查询关键词]
  * Next.js 15: [查询关键词]
  * Framer Motion 12: [查询关键词]
  * [其他相关技术栈]
- 功能需求: [详细需求]
- 实现要求: **必须遵循官方文档的最佳实践**
- 输出: [输出要求]
- 验证: [验证标准]
```

### 2. 针对性查询关键词

根据不同 Agent 的任务，设计精准的查询关键词：

#### Phase 2 示例：配方预览页面 Agent

```markdown
**配方预览页面 Agent** (Recipes-Page-Builder)
- 任务: 创建 /recipes 配方预览页面
- **技术栈文档查询** (使用 Context7):
  * React 19:
    - "React 19 Server Components best practices"
    - "React 19 use hook client component patterns"
  * Next.js 15:
    - "Next.js 15 App Router pages and layouts"
    - "Next.js 15 client components use client directive"
  * Framer Motion 12:
    - "Framer Motion 12 AnimatePresence layout animations"
    - "Framer Motion 12 variants stagger children"
  * @th-ui/core:
    - 参考现有 StyleRecipeProvider 实现
    - 参考现有配方定义文件

- 实现要求:
  * **必须使用 Next.js 15 App Router 模式**
  * **必须正确标记 'use client' 指令**
  * **必须遵循 React 19 最佳实践（避免过时的 API）**
  * **动画必须使用 Framer Motion 12 推荐模式**
  * 响应式布局，移动优先
  * 无障碍支持（ARIA 标签）

- 功能需求: [...]
```

#### Phase 2 示例：OKLCH 引擎 Agent

```markdown
**OKLCH 色彩引擎 Agent** (OKLCH-Engine-Builder)
- 任务: 实现完整的 OKLCH 色彩引擎
- **技术栈文档查询** (使用 Context7):
  * culori:
    - "culori OKLCH color space conversion"
    - "culori color interpolation methods"
    - "culori formatHex formatRgb utilities"
  * TypeScript 5.9:
    - "TypeScript 5.9 utility types Pick Omit"
    - "TypeScript 5.9 generic constraints"
  * React 19:
    - "React 19 Context API best practices"
    - "React 19 useMemo useCallback optimization"

- 实现要求:
  * **必须使用 culori 官方推荐的 API**
  * **TypeScript 类型定义必须完整且严格**
  * **遵循 React 19 性能优化最佳实践**
  * 单元测试覆盖核心函数

- 功能需求: [...]
```

### 3. 优先级技术栈列表

根据 TH-UI 项目的核心技术栈，优先查询以下文档：

| 技术栈 | Context7 库 ID | 查询优先级 | 适用 Agent |
|--------|----------------|-----------|-----------|
| **React 19** | `/facebook/react` | 🔴 极高 | 所有前端 Agent |
| **Next.js 15** | `/vercel/next.js/v15` | 🔴 极高 | Website 相关 Agent |
| **TypeScript 5.9** | `/microsoft/TypeScript` | 🔴 极高 | 所有 Agent |
| **Framer Motion 12** | `/framer/motion` | 🟡 高 | UI 动画相关 Agent |
| **Tailwind CSS 4** | `/tailwindlabs/tailwindcss` | 🟡 高 | 样式相关 Agent |
| **Vite 7** | `/vitejs/vite` | 🟡 高 | 构建相关 Agent |
| **Radix UI** | `/radix-ui/primitives` | 🟢 中 | Radix 组件 Agent |
| **culori** | `/evercoder/culori` | 🟢 中 | OKLCH 引擎 Agent |
| **Zod** | `/colinhacks/zod` | 🟢 中 | API 验证相关 Agent |

---

## 🛠️ 增强版 Agent 指令模板

### 通用模板（所有 Agent 适用）

```markdown
**[Agent 名称]** (Agent-ID)

### 📋 任务概述
- 核心任务: [一句话描述]
- 目标产物: [代码/文档/配置]
- 预估时间: [X 小时/天]

### 📚 技术栈文档查询 (Context7)

**优先查询** (必须):
1. [技术栈 1]: "[查询关键词 1]", "[查询关键词 2]"
2. [技术栈 2]: "[查询关键词 1]", "[查询关键词 2]"

**可选查询** (按需):
3. [技术栈 3]: "[查询关键词]"

**查询要求**:
- ✅ 优先使用 Context7 官方文档
- ✅ 关注版本特性（如 React 19 新特性）
- ✅ 查找最佳实践和常见陷阱
- ✅ 参考代码示例和 API 签名

### 🎯 功能需求
[详细功能列表]

### 🔧 技术要求
- **必须遵循**: [从文档中提取的最佳实践]
- **必须避免**: [从文档中提取的反模式]
- **性能优化**: [相关优化建议]
- **类型安全**: TypeScript 严格模式

### 📤 输出要求
- 完整代码文件（带注释）
- TypeScript 类型定义
- 单元测试（可选）
- 使用文档（简要）

### ✅ 验证标准
- [ ] 功能测试通过
- [ ] TypeScript 无错误
- [ ] 遵循官方最佳实践
- [ ] 代码可读性良好
```

---

## 📝 实战示例：Phase 2 增强版指令

### 示例 1: 配方预览页面 Agent（增强版）

```markdown
**配方预览页面 Agent** (Recipes-Page-Builder)

### 📋 任务概述
- 核心任务: 创建 `/recipes` 配方预览和切换页面
- 目标产物: Next.js 页面组件 + 配方卡片组件 + 过滤器组件
- 预估时间: 4 小时

### 📚 技术栈文档查询 (Context7)

**优先查询** (必须):
1. **Next.js 15**:
   - "Next.js 15 App Router page components"
   - "Next.js 15 use client directive"
   - "Next.js 15 metadata API"
2. **React 19**:
   - "React 19 hooks useState useEffect useMemo"
   - "React 19 client components patterns"
3. **Framer Motion 12**:
   - "Framer Motion 12 AnimatePresence grid layout"
   - "Framer Motion 12 layout animations"
   - "Framer Motion 12 variants stagger"

**可选查询** (按需):
4. **Tailwind CSS 4**: "Tailwind CSS 4 grid responsive breakpoints"
5. **@radix-ui/react-select**: "Radix UI Select component API"

**查询要求**:
- ✅ 确认 Next.js 15 App Router 的页面组件结构
- ✅ 确认 React 19 的 client component 正确用法
- ✅ 确认 Framer Motion 12 的动画最佳实践
- ✅ 避免使用过时的 API 或模式

### 🎯 功能需求

**1. 配方网格展示**
- 20 个七轴 DTCG 配方，4 列响应式网格
- 配方卡片包含：名称、描述、七轴参数、颜色预览渐变
- 悬停效果：卡片提升 + 边框高亮

**2. 多维度过滤器**
- 模式过滤：light/dark
- 色调过滤：vibrant/muted/pastel
- 密度过滤：compact/comfortable/spacious
- 表面过滤：matte/gloss/texture
- 类别过滤：商务/创意/经典

**3. 配方切换**
- 点击配方卡片切换当前配方
- 集成 StyleRecipeProvider 的 setRecipe 方法
- 平滑过渡动画（Framer Motion）

**4. 实时预览区域**
- 展示当前配方效果
- 包含 Button、Card、Input 示例组件
- 动态更新配方参数

### 🔧 技术要求

**必须遵循** (基于 Context7 文档):
- ✅ Next.js 15 App Router 页面结构 (`page.tsx`)
- ✅ 正确使用 `'use client'` 指令（因为需要状态和交互）
- ✅ React 19 hooks 最佳实践（useMemo 缓存过滤结果）
- ✅ Framer Motion 12 layout animations（避免布局抖动）
- ✅ 响应式设计：移动优先（Tailwind CSS 断点）

**必须避免** (基于文档反模式):
- ❌ 在 Server Component 中使用 useState/useEffect
- ❌ 使用 Framer Motion 过时的 `layoutId` 模式
- ❌ 过度嵌套的 AnimatePresence

**性能优化**:
- useMemo 缓存过滤后的配方列表
- useCallback 稳定化事件处理器
- 图片懒加载（如果有配方预览图）

**类型安全**:
- 完整的 Recipe 类型定义
- 过滤器状态的类型
- 事件处理器的类型注解

### 📤 输出要求

**文件结构**:
```
apps/website/app/recipes/
├── page.tsx                 # 主页面组件
├── components/
│   ├── RecipeGrid.tsx      # 配方网格
│   ├── RecipeCard.tsx      # 配方卡片
│   ├── RecipeFilters.tsx   # 过滤器
│   └── RecipePreview.tsx   # 实时预览
└── types.ts                 # 类型定义
```

**代码要求**:
- 完整的 TypeScript 类型
- JSDoc 注释说明组件用途
- 清晰的变量命名
- 合理的组件拆分

**测试说明** (Markdown):
- 如何访问页面
- 如何测试过滤功能
- 如何验证配方切换

### ✅ 验证标准

**功能验证**:
- [ ] 访问 `http://localhost:3100/recipes` 页面加载成功
- [ ] 20 个配方全部显示
- [ ] 过滤器可以筛选配方
- [ ] 点击配方可以切换当前配方
- [ ] 实时预览区域正确更新

**代码质量**:
- [ ] TypeScript 编译无错误 (`npm run type-check`)
- [ ] ESLint 检查通过 (`npm run lint`)
- [ ] 遵循 Next.js 15 官方模式
- [ ] 遵循 React 19 最佳实践
- [ ] Framer Motion 动画流畅无卡顿

**可访问性**:
- [ ] 键盘导航支持（Tab 键可聚焦卡片）
- [ ] ARIA 标签完整（role, aria-label 等）
- [ ] 屏幕阅读器友好

---

**执行说明**:
1. 首先使用 Context7 查询上述技术栈文档
2. 阅读并理解官方最佳实践
3. 按照文档推荐的模式实现功能
4. 在代码注释中标注参考的文档来源
5. 遇到疑问时再次查询文档
```

---

## 🎯 关键原则

### 1. 文档优先 (Documentation-First)
- 在写代码前先查文档
- 遵循官方推荐模式
- 避免"我觉得"式的实现

### 2. 版本敏感 (Version-Aware)
- 明确查询具体版本的文档
- 关注版本间的差异（如 React 18 → 19）
- 避免使用过时的 API

### 3. 最佳实践导向 (Best-Practice Oriented)
- 查找"best practices"相关文档
- 学习官方示例和推荐模式
- 避免常见反模式

### 4. 持续验证 (Continuous Validation)
- 实现过程中多次查询文档
- 对比代码与文档示例
- 确保一致性

---

## 📊 效果预期

### 代码质量提升

**融入 Context7 前**:
- 可能使用过时的 API
- 可能不符合官方最佳实践
- 类型定义可能不完整

**融入 Context7 后**:
- ✅ 使用最新的官方推荐 API
- ✅ 完全符合最佳实践
- ✅ 类型定义完整且严格
- ✅ 性能优化到位

### 开发效率提升

- 减少"试错"时间（直接参考官方文档）
- 避免"重复造轮子"（使用官方推荐方案）
- 减少后期重构（一次做对）

### 可维护性提升

- 代码遵循社区标准，易于理解
- 升级技术栈时更容易适配
- 新成员上手更快（遵循官方模式）

---

## 🚀 实施建议

### 立即执行

1. **更新所有 Phase 2-4 的 Agent 指令**
   - 添加"技术栈文档查询"章节
   - 明确查询关键词
   - 强调"必须遵循官方文档"

2. **创建技术栈查询速查表**
   - 列出所有核心技术栈的 Context7 库 ID
   - 列出常见查询关键词
   - 提供查询示例

3. **在 Agent 执行报告中包含文档引用**
   - 记录查询了哪些文档
   - 记录参考了哪些示例
   - 记录遵循了哪些最佳实践

### 长期优化

1. **建立文档知识库**
   - 将常用的文档查询结果缓存
   - 建立最佳实践索引
   - 定期更新文档版本

2. **自动化文档检查**
   - 代码 lint 规则检查是否符合官方模式
   - CI/CD 集成文档合规性检查

3. **团队培训**
   - 分享 Context7 使用技巧
   - 分享查询到的最佳实践
   - 建立内部文档库

---

## 📝 总结

**核心观点**:
- ✅ **推荐**: 将 Context7 融入每个 Agent 的指令中
- ❌ **不推荐**: 创建独立的文档查询 Agent

**关键优势**:
1. 上下文连贯，信息损耗少
2. 执行效率高，并行能力强
3. 代码质量高，符合官方最佳实践
4. 可维护性好，易于升级和重构

**实施步骤**:
1. 更新所有 Agent 指令，添加文档查询章节
2. 明确查询关键词和技术栈版本
3. 强调"必须遵循官方文档"
4. 在执行报告中记录文档引用

---

**维护**: TH-UI Team
**版本**: 1.0.0
**最后更新**: 2025-10-12
