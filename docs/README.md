# 📚 Xorigo UI 文档中心

> **Xorigo UI 完整文档索引和导航** - 从组件库到展示网站的完整架构文档

---

## 🎯 快速导航

### 🚀 新手入门
- [**项目概览**](../README.md) - 了解 Xorigo UI 是什么
- [**开发指南**](../CLAUDE.md) - 开发规范和最佳实践
- [**快速开始**](./guides/QUICK_START.md) - 5分钟上手指南 (🔄 待创建)

---

## 🏗️ 核心架构文档

### 📐 系统设计

1. **[七轴系统架构](./architecture/SEVEN_AXIS_SYSTEM.md)** (41KB) ⭐
   - 完整的七轴配方体系设计
   - 系统分层设计（应用层→组件层→Provider层→引擎层→数据层→生态层）
   - OKLCH 色彩引擎设计
   - 实施路线图（P0-P4）

2. **[OKLCH 色彩系统](./architecture/OKLCH_COLOR_GUIDE.md)** (18KB) 🌈
   - OKLCH 色彩空间详解
   - 4种色彩生成策略（单色/类似色/双色/三色）
   - 暗色模式对称映射
   - WCAG 对比度计算

### 🌐 网站架构

3. **[Next.js 网站架构](./architecture/NEXTJS_ARCHITECTURE.md)** (25KB) 🚀
   - 严格依赖组件库原则
   - Gallery 展示页面设计（SSG + 搜索/过滤）
   - Adoption Matrix 取用矩阵（交互式代码生成）
   - Playground 实时预览（Monaco Editor + iframe）
   - Monorepo 架构（pnpm workspaces）

4. **[组件展示架构](./architecture/COMPONENTS_SHOWCASE.md)** (10KB) 🎭
   - 严格依赖组件库约束
   - 完整组件展示设计
   - 样式系统分离（配方 vs 组件展示）
   - 组件完整性验证

### 🌍 生态系统

5. **[I18N 国际化包设计](./architecture/I18N_PACKAGE_DESIGN.md)** (41KB) 🌐
   - 独立 @xorigo-ui/i18n 包设计
   - 多语言资源管理
   - 格式化器和检测器
   - 支持所有 Xorigo UI 子系统

6. **[Matrix 规则与验证系统](./architecture/MATRIX_RULES_SYSTEM.md)** (45KB) 🔍
   - 对比度验证（WCAG AA/AAA）
   - 非法组合检测
   - 热力图可视化
   - 国际化支持

### 📦 数据标准

7. **[Registry 标准化架构](./architecture/REGISTRY_STANDARDS.md)** (23KB) 📋
   - 固化 Registry Schema
   - CI 自动校验
   - JSON Schema + TypeScript 类型定义
   - Gallery/Adoption/Matrix 数据一致性

### 🔄 迁移计划

8. **[迁移批次计划](./architecture/MIGRATION_BATCHING_PLAN.md)** (12KB) 🛠️
   - 渐进式迁移策略
   - P0-P3 批次规划
   - 风险控制措施
   - 回滚机制

9. **[Monorepo 目录结构重组方案](./architecture/MONOREPO_RESTRUCTURE_PLAN.md)** (11KB) 📦
   - 当前混合结构问题分析
   - 标准 Monorepo 目标架构
   - 分步迁移方案（Phase 1-6）
   - 迁移检查清单和验证步骤

---

## 📖 实施指南

### 迁移指南

- **[组件迁移指南](./guides/MIGRATION_GUIDE.md)** (16KB) 🔄
  - 从 ThemeProvider 到 StyleRecipeProvider
  - CSS 变量完整映射表
  - 标准迁移步骤（Step 1-4）
  - 特殊场景处理

---

## 📘 参考资料

### 技术参考

- **[技术栈参考](./references/TECH_STACK.md)** (6KB) ⚙️
  - 当前技术栈版本信息
  - Tailwind CSS v4 配置详情
  - 构建决策记录
  - 升级历史

- **[API 参考文档](./references/API_REFERENCE.md)** (15KB) 📖
  - StyleRecipeProvider 完整 API
  - 4个核心 Hooks 文档
  - 类型定义
  - 配方查询 API

---

## 📂 文档结构

```
docs/
├── README.md                              # 📚 本文档（文档中心）
│
├── 🏗️ architecture/                         # 核心架构文档（9个）
│   ├── SEVEN_AXIS_SYSTEM.md               # ⭐ 七轴系统完整架构 (41KB)
│   ├── OKLCH_COLOR_GUIDE.md               # 🌈 OKLCH 色彩系统 (18KB)
│   ├── NEXTJS_ARCHITECTURE.md             # 🚀 Next.js 网站架构 (25KB)
│   ├── COMPONENTS_SHOWCASE.md             # 🎭 组件展示架构 (10KB)
│   ├── I18N_PACKAGE_DESIGN.md             # 🌐 国际化包设计 (41KB)
│   ├── MATRIX_RULES_SYSTEM.md             # 🔍 Matrix 规则系统 (45KB)
│   ├── REGISTRY_STANDARDS.md              # 📋 Registry 标准 (23KB)
│   ├── MIGRATION_BATCHING_PLAN.md         # 🛠️ 迁移批次计划 (12KB)
│   └── MONOREPO_RESTRUCTURE_PLAN.md       # 📦 Monorepo 重组 (11KB)
│
├── 📖 guides/                              # 实施指南（1个）
│   ├── MIGRATION_GUIDE.md                 # 🔄 组件迁移指南 (16KB)
│   └── QUICK_START.md                     # 🚀 快速开始（待创建）
│
├── 📘 references/                          # 参考资料（2个）
│   ├── TECH_STACK.md                      # ⚙️ 技术栈参考 (6KB)
│   └── API_REFERENCE.md                   # 📖 API 参考 (15KB)
│
├── 📁 tutorials/                           # 教程文档（预留）
│
└── 🗑️ archive/                             # 已归档的历史文档
    ├── ARCHIVE_INDEX.md                   # 📋 归档说明索引
    └── ... (14个历史文档)
```

---

## 🎨 核心概念

### 七轴风格配方体系

**七个轴**：
1. **Mode** - 模式轴：light / dark / hc
2. **Base** - 基础轴：中性色温度和色度
3. **Accent** - 强调轴：主色策略（mono/analog/duo/triadic）
4. **Tone** - 色调轴：calm / standard / vivid / vibrant
5. **Density** - 密度轴：spacious / comfortable / compact
6. **Motion** - 动效轴：subtle / standard / expressive
7. **Surface** - 表面轴：flat / soft-shadow / elevated / glass

**配方 ID 格式**：
```
<mode>.<base>.<accent>.<tone>.<density>.<motion>.<surface>

示例:
dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass
```

### OKLCH 色彩空间

- **L (Lightness)**: 亮度 (0-1)
- **C (Chroma)**: 色度 (0-0.4)
- **H (Hue)**: 色相 (0-360°)

**优势**：
- ✅ 感知均匀
- ✅ 亮度一致
- ✅ 动画流畅
- ✅ 易于计算对比度

### CSS 变量系统

组件完全解耦，使用 CSS 变量：

```typescript
// ✅ 新系统
'bg-[var(--color-primary-500)]'
'px-[var(--spacing-md)]'
'duration-[var(--motion-duration-base)]'

// ❌ 旧系统
'bg-gradient-to-r from-blue-500 to-purple-600'
```

---

## 🎯 核心架构约束

### ⚠️ 严格依赖原则

- **网站必须仅使用组件库的组件** - 禁止额外增加任何UI组件
- **缺乏组件时** - 先在组件库中设计创建，再添加到网站
- **组件完整性** - 网站必须展示组件库的所有组件及其所有效果

### 🎨 样式系统分离

- **网站样式切换** - 使用配方系统切换显示样式效果
- **组件展示** - 展示所有组件的所有维度效果，独立于配方切换
- **展示维度** - 包括变体(variant)、尺寸(size)、状态(state)等所有方面

---

## 📋 开发路线图

### ✅ 已完成（架构设计阶段）

- [x] 七轴配方体系设计
- [x] OKLCH 色彩引擎设计
- [x] StyleRecipeProvider 架构
- [x] Next.js 网站架构
- [x] 组件展示架构设计
- [x] I18N 国际化包设计
- [x] Matrix 规则验证系统设计
- [x] Registry 标准化设计
- [x] 迁移批次计划
- [x] Monorepo 重组方案
- [x] 核心文档编写（226KB，12个文档）

### 🔄 进行中（实施阶段）

- [ ] Monorepo 目录结构重组
- [ ] OKLCH 色彩引擎实现
- [ ] CSS 变量生成器实现
- [ ] StyleRecipeProvider 实现
- [ ] Card 组件迁移
- [ ] Input 组件迁移

### ⏳ 待开始（核心功能）

- [ ] @xorigo-ui/i18n 包实现
- [ ] Matrix 规则验证系统实现
- [ ] Registry Schema 固化和 CI 校验
- [ ] Modal 组件迁移
- [ ] Switch 组件迁移
- [ ] 其余13个组件迁移

### 📅 未来规划（网站功能）

- [ ] Next.js 网站实现
- [ ] Gallery 页面实现
- [ ] Adoption Matrix 实现
- [ ] Playground 实现
- [ ] 组件展示页面实现

---

## 🔗 相关资源

### 外部文档
- [OKLCH Color Space](https://bottosson.github.io/posts/oklab/)
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)
- [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/)
- [Tailwind CSS 4](https://tailwindcss.com/docs)
- [React 19](https://react.dev/)
- [Framer Motion 12](https://www.framer.com/motion/)
- [Next.js 15](https://nextjs.org/docs)

### 工具库
- [culori](https://culorijs.org/) - 色彩空间转换
- [color.js](https://colorjs.io/) - 现代色彩操作
- [CVA](https://cva.style/) - 类型安全的变体系统
- [Radix UI](https://www.radix-ui.com/) - 无障碍组件基础

---

## 📞 获取帮助

- **GitHub Issues**: [提交问题](https://github.com/your-org/xorigo-ui/issues)
- **讨论区**: [参与讨论](https://github.com/your-org/xorigo-ui/discussions)
- **团队联系**: Xorigo UI Team

---

## 📄 文档状态

| 分类 | 文档 | 状态 | 大小 |
|------|------|------|------|
| **架构** | SEVEN_AXIS_SYSTEM.md | ✅ 完成 | 41KB |
| **架构** | OKLCH_COLOR_GUIDE.md | ✅ 完成 | 18KB |
| **架构** | NEXTJS_ARCHITECTURE.md | ✅ 完成 | 25KB |
| **架构** | COMPONENTS_SHOWCASE.md | ✅ 完成 | 10KB |
| **架构** | I18N_PACKAGE_DESIGN.md | ✅ 完成 | 41KB |
| **架构** | MATRIX_RULES_SYSTEM.md | ✅ 完成 | 45KB |
| **架构** | REGISTRY_STANDARDS.md | ✅ 完成 | 23KB |
| **架构** | MIGRATION_BATCHING_PLAN.md | ✅ 完成 | 12KB |
| **架构** | MONOREPO_RESTRUCTURE_PLAN.md | ✅ 完成 | 11KB |
| **指南** | MIGRATION_GUIDE.md | ✅ 完成 | 16KB |
| **指南** | QUICK_START.md | ⏳ 待创建 | - |
| **参考** | TECH_STACK.md | ✅ 完成 | 6KB |
| **参考** | API_REFERENCE.md | ✅ 完成 | 15KB |

**已完成**: 12个核心文档，**总计 263KB** 内容

**待创建**: 1个指南文档（QUICK_START.md）

---

## 🗑️ 历史文档

所有历史开发报告和旧版本文档已归档到 `archive/` 目录，详见 [归档索引](./archive/ARCHIVE_INDEX.md)。

---

**维护**: Xorigo UI Team
**版本**: 2.0.0 (架构完善版 + Monorepo 重组)
**最后更新**: 2025-10-12
