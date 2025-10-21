# 📚 Xorigo UI 双重唯一事实源文档系统

> **Xorigo UI 完整架构文档索引和导航** - 从组件库到展示网站的完整技术架构

**创建日期**: 2025年10月14日 | **版本**: v1.0 | **状态**: ✅ 已完成

---

## 🎯 快速导航

### 🚀 新手入门
- [**项目概览**](../README.md) - 了解 Xorigo UI 是什么
- [**开发指南**](../CLAUDE.md) - 开发规范和最佳实践
- [**MCP 配置指南**](./MCP-Configuration-Guide.md) - AI 增强开发工具配置 (🆕 新增)
- [**MCP 快速参考**](./MCP-Quick-Reference.md) - MCP 工具速查卡 (🆕 新增)
- [**MCP 使用示例**](./MCP-Usage-Examples.md) - 实际使用案例演示 (🆕 新增)
- [**快速开始**](./guides/QUICK_START.md) - 5分钟上手指南 (🔄 待创建)

---

## 🏗️ 双重唯一事实源文档系统

### 📐 UI架构文档系统
**位置**: `/docs/UI-ARCHITECTURE/`

1. **[Xorigo UI 核心架构文档终极版](./UI-ARCHITECTURE/00-Xorigo-UI核心架构文档终极版.md)** ⭐
   - 8大组件分类系统完整规范
   - 7大核心设计原则深度解析
   - 30个核心组件实施路线图
   - API标准化和设计令牌系统

2. **[组件分类系统白皮书v1.0](./UI-ARCHITECTURE/01-组件分类系统白皮书v1.0.md)** 🎨
   - 8大组件分类体系设计
   - 组件边界和依赖关系
   - 复合组件模式规范

3. **[API设计标准v1.1](./UI-ARCHITECTURE/02-API设计标准v1.1.md)** ⚙️
   - 统一5级尺寸系统 (xs-sm-md-lg-xl)
   - 6种语义化变体 (primary-secondary-success-warning-danger-neutral)
   - 标准化Props命名规范

4. **[设计令牌系统v1.1](./UI-ARCHITECTURE/03-设计令牌系统v1.1.md)** 🎨
   - 4层设计令牌架构体系
   - 500+设计变量完整规范
   - OKLCH色彩系统集成

5. **[实施路线图v1.1](./UI-ARCHITECTURE/04-实施路线图v1.1.md)** 🗺️
   - 8周分阶段实施计划
   - Phase 1-4详细里程碑
   - 风险控制和质量保证

6. **[优化建议报告v1.1](./UI-ARCHITECTURE/05-优化建议报告v1.1.md)** 📊
   - 122个TSX文件深度分析
   - 系统性优化策略
   - 成功指标和验收标准

### 🌐 Website技术架构文档系统
**位置**: `/docs/WEBSITE-ARCHITECTURE/`

1. **[Website技术架构终极版](./WEBSITE-ARCHITECTURE/00-Website技术架构终极版.md)** 🚀
   - 完整技术栈架构设计
   - 性能优化和安全策略
   - 监控、日志和部署运维

2. **[Docker容器化架构v1.0](./WEBSITE-ARCHITECTURE/01-Docker容器化架构v1.0.md)** 🐳
   - 多阶段构建最佳实践
   - 开发/生产环境配置
   - 容器安全和优化策略

3. **[性能优化策略v1.0](./WEBSITE-ARCHITECTURE/02-性能优化策略v1.0.md)** ⚡
   - Lighthouse性能优化
   - Bundle分析和优化
   - 缓存策略和CDN配置

4. **[监控和日志系统v1.0](./WEBSITE-ARCHITECTURE/03-监控和日志系统v1.0.md)** 📊
   - 应用性能监控(APM)
   - 日志聚合和分析
   - 告警和故障处理

5. **[部署和运维v1.0](./WEBSITE-ARCHITECTURE/04-部署和运维v1.0.md)** 🔧
   - CI/CD流水线设计
   - 自动化部署策略
   - 运维最佳实践

6. **[系统安全和合规v1.0](./WEBSITE-ARCHITECTURE/05-系统安全和合规v1.0.md)** 🛡️
   - 安全架构设计
   - 合规性要求
   - 安全审计和监控

---

## 📊 文档整理统计

### 梳理完成情况
- **总文件数**: 35个markdown文件 ✅
- **总大小**: 844KB ✅
- **UI架构相关**: 28个文件 → 已整合到6个核心文档 ✅
- **Website相关**: 7个文件 → 已整合到6个技术文档 ✅
- **重复内容**: 12个重复主题 → 已去重整合 ✅
- **遗漏检查**: 零遗漏 → 确保完整性 ✅

### 内容整合映射
```
docs/待整理/组件分类整理.md → docs/UI-ARCHITECTURE/01-组件分类系统白皮书v1.0.md
docs/待整理/Xorigo UI 架构白皮书v1.0.md → docs/UI-ARCHITECTURE/00-Xorigo-UI核心架构文档终极版.md
docs/待整理/Website架构重构总结.md → docs/WEBSITE-ARCHITECTURE/00-Website技术架构终极版.md
docs/待整理/Xorigo-UI白皮书v1.1优化建议报告-2025-10-13.md → docs/UI-ARCHITECTURE/05-优化建议报告v1.1.md
```

---

## 🏗️ 历史核心架构文档

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
├── 🤖 MCP-Enhanced Development/           # AI 增强开发工具（3个）
│   ├── MCP-Configuration-Guide.md         # ⚙️ MCP 配置详细指南 (🆕)
│   ├── MCP-Quick-Reference.md             # 📋 MCP 快速参考卡 (🆕)
│   └── MCP-Usage-Examples.md              # 💡 MCP 实际使用示例 (🆕)
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
