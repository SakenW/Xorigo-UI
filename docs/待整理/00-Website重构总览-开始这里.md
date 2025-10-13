# 🎯 Website 重构总览 - 从这里开始

> **项目状态**: 📋 规划完成，等待执行确认
> **最后更新**: 2025-10-13
> **预计工期**: 16周（8个Phase）
> **优先级**: P0（架构基础）→ P1（核心功能）→ P2（优化功能）

---

## 📌 一句话总结

**基于《Xorigo UI Website 架构白皮书》完成全面架构审查，发现严重偏离白皮书设计（3/10分），已制定16周渐进式重构方案，包含完整的Agent执行计划。**

---

## 🎬 快速开始

### 第一步：了解当前问题（5分钟）
```bash
# 阅读架构审查报告
cat docs/待整理/Website架构审查报告-2025-10-13.md

# 核心问题摘要:
# ❌ P0: 数据入口收口层完全缺失
# ❌ P0: Website SDK 层完全缺失
# ❌ P0: 构建前校验缺失
# ❌ P0: ErrorBoundary 完全缺失
# ❌ P1: RSC/Client 边界模糊
# ❌ P1: 无性能预算控制
```

### 第二步：理解重构架构（10分钟）
```bash
# 阅读架构设计方案（最重要！）
cat docs/待整理/Website重构架构设计方案.md

# 核心架构:
# Layer 4: Packages (只读源)
# Layer 3: Data Layer (*.readonly.ts 适配层)
# Layer 2: SDK Layer (*-client.ts 协议层)
# Layer 1: App Layer (RSC Pages + Client Components)
```

### 第三步：选择执行方式（1分钟）

#### 方式A：Hive-Mind 全自动执行（推荐）
```bash
cd /home/saken/project/Xorigo-UI/apps/website

# 执行完整重构（6个并行Agent组）
claude-flow hive-mind --plan docs/待整理/Website重构-Agent执行计划.md --phase all

# 或分阶段执行（更安全）
claude-flow hive-mind --plan docs/待整理/Website重构-Agent执行计划.md --phase 1  # Week 1-2
claude-flow hive-mind --plan docs/待整理/Website重构-Agent执行计划.md --phase 2  # Week 3-4
claude-flow hive-mind --plan docs/待整理/Website重构-Agent执行计划.md --phase 3  # Week 5-6
```

#### 方式B：手动分步执行
```bash
# 参考实施清单逐步执行
cat docs/待整理/Website重构实施清单.md

# 参考快速开始指南
cat docs/待整理/Website重构快速开始指南.md
```

---

## 📚 完整文档地图

### 🎯 核心架构文档（必读）

#### 1. **架构白皮书**（理解目标）
- **[Xorigo UI Website 架构白皮书.md](./Xorigo UI Website 架构白皮书.md)** (148KB)
  - 定义Website与Packages分离的七轴架构
  - P0硬护栏、DX强化层、P1规范深化
  - KPI指标体系、风险兜底机制

#### 2. **架构审查报告**（了解现状）
- **Website架构审查报告-2025-10-13.md** (由Agent生成)
  - 当前实现评分: 3/10
  - 13个Gap清单（P0/P1/P2分类）
  - 152小时工作量估算

#### 3. **架构设计方案**（掌握蓝图）⭐️
- **[Website重构架构设计方案.md](./Website重构架构设计方案.md)** (57KB)
  - **四层架构设计**（最重要！）
  - 完整目录结构设计
  - 9个Mermaid可视化图表
  - 核心模块伪代码设计

#### 4. **实施清单**（执行指南）
- **[Website重构实施清单.md](./Website重构实施清单.md)** (26KB)
  - 16周详细排期（8个Phase）
  - 每个Phase的任务清单
  - 验收标准和KPI目标

#### 5. **Agent执行计划**（自动化执行）⭐️
- **[Website重构-Agent执行计划.md](./Website重构-Agent执行计划.md)** (19KB)
  - 6个并行Agent组设计
  - Hive-Mind执行命令
  - 每个Agent的详细任务清单

#### 6. **组件分类说明**（分类体系）🆕
- **[Website重构-组件分类说明.md](./Website重构-组件分类说明.md)** (22KB)
  - 10个组件分类详解
  - 七轴映射规则
  - Registry 字段映射
  - Website 路由映射

---

### 📖 辅助参考文档

#### 开发规范
- **[Website重构最佳实践和规则.md](./Website重构最佳实践和规则.md)** (27KB)
  - 20条开发规范（正反示例）
  - Code Review检查清单
  - 常见错误模式和修复方案

#### 学习指南
- **[Website重构快速开始指南.md](./Website重构快速开始指南.md)** (20KB)
  - Phase 1-3 Step-by-step 教程
  - 环境配置详细步骤
  - Troubleshooting 常见问题

#### 架构可视化
- **[Website架构数据流和交互图.md](./Website架构数据流和交互图.md)** (26KB)
  - 9个Mermaid图表
  - 数据流架构图
  - 状态管理流程图

#### 验收标准
- **[Website-Packages 联动架构验收清单.md](./Website-Packages 联动架构验收清单.md)** (16KB)
  - P0/P1/P2验收标准
  - 测试覆盖要求
  - 性能指标验收

#### 文档导航
- **[Website重构架构文档总览.md](./Website重构架构文档总览.md)** (13KB)
  - 4条阅读路线（架构师/开发者/新人/PM）
  - 按场景查找表
  - 文档质量自查清单

#### 总体架构
- **[Website重构架构总览.md](./Website重构架构总览.md)** (18KB)
  - 架构全景概览
  - KPI指标体系
  - 技术栈对齐说明

---

## 🎯 核心设计要点

### 1. **四层架构设计**
```
┌─────────────────────────────────────────┐
│ Layer 1: App Layer (展示层)             │
│  - RSC Pages: /docs, /adoption, /tokens │
│  - Client Pages: /playground            │
├─────────────────────────────────────────┤
│ Layer 2: SDK Layer (协议层)             │
│  - registry-client.ts (Zustand Store)   │
│  - tokens-client.ts                     │
│  - docs-client.ts                       │
├─────────────────────────────────────────┤
│ Layer 3: Data Layer (适配层)            │
│  - registry.readonly.ts (Singleton)     │
│  - tokens.readonly.ts                   │
│  - docs.readonly.ts                     │
│  - i18n.readonly.ts                     │
├─────────────────────────────────────────┤
│ Layer 4: Packages (只读源)              │
│  - @xorigo-ui/registry (registry.json)  │
│  - @xorigo-ui/tokens (tokens/*.json)    │
│  - /docs/**/*.mdx                       │
└─────────────────────────────────────────┘
```

### 2. **数据只读原则**
- ✅ **单一入口**: 所有数据通过 `src/data/*.readonly.ts` 访问
- ✅ **Build验证**: Schema验证 + 路径一致性检查
- ✅ **ESLint强制**: 禁止直接导入 `@xorigo-ui/*` 包

### 3. **RSC/Client 严格分离**
- ✅ **RSC Pages**: `/docs/*`, `/adoption/*`, `/tokens/*` (服务端渲染)
- ✅ **Client Pages**: `/playground/*` (客户端交互)
- ✅ **Dynamic Import**: Client组件使用 `dynamic(() => import(), { ssr: false })`

### 4. **Playground 双模式**
- ✅ **Live Props Mode**: 实时编辑组件Props
- ✅ **Snapshot Mode**: 保存配置快照
- ✅ **Compare Mode**: 双栏对比不同配置

### 5. **性能预算体系**
- ✅ **Bundle Size**: 站点 ≤ 120KB, Playground ≤ 150KB (gzip)
- ✅ **Core Web Vitals**: LCP ≤ 2.5s, FID ≤ 100ms, CLS ≤ 0.1
- ✅ **交互响应**: 筛选操作 ≤ 50ms

---

## 📋 6个Agent执行组

### **Group 1: 数据层基础建设（P0 - Week 1-2）**
- ✅ Agent 1.1: Data Layer Adapter Creator (8h)
- ✅ Agent 1.2: Schema Validator (10h)
- ✅ Agent 1.3: ESLint Rules Enforcer (4h)

### **Group 2: 错误容忍机制（P0 - Week 1-2）**
- ✅ Agent 2.1: Error Boundary Implementer (6h)

### **Group 3: RSC/Client 分层优化（P1 - Week 3-4）**
- ✅ Agent 3.1: RSC Page Optimizer (12h)
- ✅ Agent 3.2: Client Component Isolator (8h)

### **Group 4: Playground 双模式架构（P1 - Week 5-6）**
- ✅ Agent 4.1: Playground Store Designer (10h)
- ✅ Agent 4.2: Playground UI Builder (16h)

### **Group 5: DX 增强层（P1 - Week 5-6）**
- ✅ Agent 5.1: CLI Tools Enhancer (12h)
- ✅ Agent 5.2: Performance Dashboard Creator (10h)

### **Group 6: 搜索性能优化（P1 - Week 3-4）**
- ✅ Agent 6.1: Search Index Builder (8h)
- ✅ Agent 6.2: Search UI Optimizer (6h)

**总计**: 110小时（约3周，6组并行可压缩至1周）

---

## 🎯 KPI 目标

| 指标 | 当前值 | 目标值 | 验收方式 |
|------|--------|--------|----------|
| **数据入口收口** | ❌ 0/4 | ✅ 4/4 | 所有 Data Layer Adapter 存在 |
| **构建前校验** | ❌ 无 | ✅ 有 | prebuild 钩子工作 |
| **错误边界** | ❌ 0/3 | ✅ 3/3 | 3个 ErrorBoundary 实现 |
| **RSC 页面** | ⚠️ 2/5 | ✅ 5/5 | 5个页面无 "use client" |
| **搜索性能** | ⚠️ ~200ms | ✅ ≤50ms | 1000项筛选 ≤50ms |
| **Bundle Size** | ⚠️ 180KB | ✅ ≤120KB | Lighthouse 报告 |
| **Playground 模式** | ❌ 0/3 | ✅ 3/3 | Live/Snapshot/Compare 可用 |

---

## ⚠️ 风险和缓解

| 风险 | 影响 | 缓解措施 | 负责 |
|------|------|----------|------|
| **数据漂移** | 🔴 高 | 构建前校验 + ESLint 规则 | Agent 1.2, 1.3 |
| **性能退化** | 🟡 中 | Bundle Analyzer + Web Vitals 监控 | Agent 5.2 |
| **类型安全** | 🟡 中 | TypeScript 严格模式 + Zod 验证 | Agent 1.2 |
| **用户体验** | 🟡 中 | ErrorBoundary + 性能预算 | Agent 2.1, 3.1 |

---

## 🚀 立即行动

### 方案A：完全自动化（推荐）
```bash
# 1. 进入项目目录
cd /home/saken/project/Xorigo-UI/apps/website

# 2. 确认环境
npm install
npm run type-check

# 3. 执行 Hive-Mind（全自动重构）
claude-flow hive-mind \
  --plan docs/待整理/Website重构-Agent执行计划.md \
  --phase all \
  --parallel 6 \
  --verbose

# 4. 验收测试
npm run build          # 验证构建通过
npm run lint           # 验证 ESLint 通过
npm test               # 验证单元测试通过
npx xorigo doctor      # 健康检查
```

### 方案B：分阶段执行（更安全）
```bash
# Phase 1: 基础建设（Week 1-2）
claude-flow hive-mind --plan docs/待整理/Website重构-Agent执行计划.md --phase 1
# 验收: npm run build && npm run lint

# Phase 2: 页面优化（Week 3-4）
claude-flow hive-mind --plan docs/待整理/Website重构-Agent执行计划.md --phase 2
# 验收: npm run analyze && npm run test

# Phase 3: DX 增强（Week 5-6）
claude-flow hive-mind --plan docs/待整理/Website重构-Agent执行计划.md --phase 3
# 验收: npx xorigo doctor && npm run dev
```

### 方案C：手动执行（完全控制）
```bash
# 参考实施清单逐步执行
cat docs/待整理/Website重构实施清单.md

# 参考快速开始指南（Step-by-step）
cat docs/待整理/Website重构快速开始指南.md

# 参考开发规范
cat docs/待整理/Website重构最佳实践和规则.md
```

---

## 📞 支持和反馈

### 问题咨询
- **架构问题**: 查看 `Website重构架构设计方案.md`
- **开发问题**: 查看 `Website重构最佳实践和规则.md`
- **执行问题**: 查看 `Website重构-Agent执行计划.md`

### Troubleshooting
1. **Agent执行失败**: 检查依赖是否完成，查看错误日志
2. **构建前校验阻断**: 修复 registry.json 或 tokens/*.json 问题
3. **Bundle Size超标**: 使用 dynamic import 拆分大组件

### 反馈渠道
- **GitHub Issues**: 文档问题反馈
- **内部 Slack**: #xorigo-architecture
- **架构团队**: 架构评审和技术咨询

---

## 📊 进度追踪

### 当前状态
- ✅ **Phase 0**: 架构审查和设计完成（2025-10-13）
- ⏳ **Phase 1**: 等待执行确认
- ⏳ **Phase 2-8**: 未开始

### 下一步
1. **阅读核心文档**（30分钟）:
   - [Website重构架构设计方案.md](./Website重构架构设计方案.md)
   - [Website重构-Agent执行计划.md](./Website重构-Agent执行计划.md)

2. **确认执行方式**（5分钟）:
   - 方案A: Hive-Mind 全自动
   - 方案B: 分阶段执行
   - 方案C: 手动执行

3. **开始重构**（预计16周）:
   - Phase 1-2: 数据层基础（Week 1-4）
   - Phase 3-4: 页面和功能（Week 5-8）
   - Phase 5-6: DX 增强（Week 9-12）
   - Phase 7-8: 优化验收（Week 13-16）

---

## 🎉 总结

基于《Xorigo UI Website 架构白皮书》完成全面架构审查，发现当前实现严重偏离设计（评分3/10），已制定完整的重构方案：

**✅ 已完成**:
- 15篇完整架构文档 (~530KB)
- 四层架构设计蓝图
- 16周详细实施清单
- 6个并行Agent执行计划
- 9个Mermaid可视化图表
- 20条开发规范标准
- 4条角色化阅读路线

**🚀 下一步**:
1. 阅读核心文档（30分钟）
2. 选择执行方式（5分钟）
3. 开始执行重构（16周）

**核心原则**:
- 🎯 数据只读原则 (Single Source of Truth)
- 🏗️ 四层架构设计 (Separation of Concerns)
- ⚡ 性能预算体系 (Performance First)
- 📦 RSC/Client 严格分离 (Clear Boundaries)
- 🎨 Playground 双模式 (Enhanced DX)
- 📈 渐进式迁移方案 (Risk Mitigation)

---

**开始重构**: `claude-flow hive-mind --plan docs/待整理/Website重构-Agent执行计划.md --phase all`

**最后更新**: 2025-10-13
**维护者**: Xorigo UI Architecture Team
**版本**: v1.0.0
