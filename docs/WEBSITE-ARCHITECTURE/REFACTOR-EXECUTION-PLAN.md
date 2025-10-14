# 🚀 Website 架构重构执行计划

> **版本**: v1.0
> **日期**: 2025-01-14
> **状态**: Ready for Execution
> **执行工具**: Claude-Flow + Multi-Agent System

---

## 📋 执行概要

本文档定义了 Xorigo UI Website 从旧架构迁移到 v2.0 架构的完整执行计划，包含多个专门的 Agent 和架构校验机制。

### 核心目标
1. **消除功能重叠**：整合 Gallery + Playground → Workbench
2. **明确模块边界**：7个核心模块，零重叠
3. **保持架构一致性**：严格遵循 v2.0 架构设计

---

## 🤖 Agent 系统设计

### Agent 架构图
```
┌─────────────────────────────────────────────────────┐
│               Orchestrator Agent                    │
│            (总协调器 - 监督整体进度)                │
└────────────┬────────────────────────────────────────┘
             │
    ┌────────┴────────┬────────┬────────┬────────┐
    ▼                 ▼        ▼        ▼        ▼
┌─────────┐   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│Analyzer │   │Migrator │ │Builder  │ │Tester   │ │Validator│
│Agent    │   │Agent    │ │Agent    │ │Agent    │ │Agent    │
│(分析)   │   │(迁移)   │ │(构建)   │ │(测试)   │ │(校验)   │
└─────────┘   └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

### Agent 定义

#### 1. Orchestrator Agent (总协调器)
```yaml
name: orchestrator-agent
role: 总体协调和进度监控
responsibilities:
  - 协调所有子Agent的工作
  - 监控整体进度
  - 处理Agent间的依赖关系
  - 生成进度报告

workflow:
  1. 初始化所有Agent
  2. 分配任务给相应Agent
  3. 收集执行结果
  4. 协调下一步行动
  5. 生成最终报告

commands:
  - claude-flow orchestrate --config refactor.config.yml
  - claude-flow status --all-agents
  - claude-flow report --format detailed
```

#### 2. Architecture Validator Agent (架构校验器) ⭐️
```yaml
name: architecture-validator
role: 确保所有操作符合v2.0架构设计
responsibilities:
  - 验证模块边界
  - 检查功能重叠
  - 确保零重叠原则
  - 阻止偏离架构的操作

validation_rules:
  component_source_rule: # 🚨 最高优先级规则
    - Website必须从packages/导入所有UI组件
    - 禁止在apps/website/中创建UI组件
    - 新组件需求必须先在packages/中实现
    - 验证所有import语句来源正确

  module_boundaries:
    - Components: 只允许展示和复制功能
    - Workbench: 只允许编辑和实验功能
    - Tools: 必须独立运行
    - Templates: 只允许完整项目模板

  anti_patterns:
    - Website中创建UI组件（最严重违规）
    - Components中不能有编辑器
    - Workbench中不能有模板下载
    - Tools不能依赖其他模块
    - 不允许跨模块的功能重叠

validation_process:
  before_action: |
    验证即将执行的操作是否符合架构
    if (违反架构原则) {
      reject_action()
      report_violation()
    }

  after_action: |
    验证执行结果是否符合预期
    check_module_boundaries()
    verify_no_overlap()

commands:
  - claude-flow validate --architecture v2.0
  - claude-flow check --module-boundaries
  - claude-flow verify --no-overlap
```

#### 3. Analyzer Agent (分析器)
```yaml
name: analyzer-agent
role: 分析现有代码结构
responsibilities:
  - 扫描现有目录结构
  - 识别Gallery和Playground的重叠代码
  - 生成依赖关系图
  - 标记需要迁移的文件

analysis_targets:
  - apps/website/app/(dashboard)/gallery/
  - apps/website/app/(dashboard)/playground/
  - apps/website/src/components/gallery/
  - apps/website/src/components/playground/

output:
  - dependency-graph.json
  - overlap-analysis.md
  - migration-checklist.md

commands:
  - claude-flow analyze --source ./apps/website
  - claude-flow identify-overlaps --modules gallery,playground
  - claude-flow generate-migration-list
```

#### 4. Migrator Agent (迁移器)
```yaml
name: migrator-agent
role: 执行代码迁移
responsibilities:
  - 合并Gallery和Playground代码
  - 创建Workbench统一模块
  - 保留各自核心功能
  - 处理路由迁移

migration_tasks:
  phase1_backup:
    - 备份现有Gallery代码
    - 备份现有Playground代码
    - 创建回滚点

  phase2_merge:
    - 提取Gallery的视觉展示功能
    - 提取Playground的编辑功能
    - 合并为Workbench模块

  phase3_routing:
    - 更新路由从 /gallery → /workbench?mode=gallery
    - 更新路由从 /playground → /workbench?mode=editor
    - 设置重定向规则

commands:
  - claude-flow migrate --from gallery,playground --to workbench
  - claude-flow backup --modules gallery,playground
  - claude-flow merge-components --strategy dual-mode
```

#### 5. Builder Agent (构建器)
```yaml
name: builder-agent
role: 构建新架构组件
responsibilities:
  - 创建新模块结构
  - 实现模块功能
  - 设置模块边界
  - 生成TypeScript类型

build_targets:
  components_module:
    - 创建展示系统
    - 实现复制功能
    - 生成变体展示

  workbench_module:
    - 实现双模式切换
    - Gallery Mode视图
    - Editor Mode视图

  tools_module:
    - 独立工具架构
    - Matrix工具迁移
    - 工具路由系统

commands:
  - claude-flow build --module components
  - claude-flow build --module workbench --modes gallery,editor
  - claude-flow build --module tools --independent
```

#### 6. Tester Agent (测试器)
```yaml
name: tester-agent
role: 验证功能完整性
responsibilities:
  - 单元测试
  - 集成测试
  - E2E测试
  - 性能测试

test_suites:
  unit_tests:
    - 组件展示功能
    - 复制功能
    - 模式切换

  integration_tests:
    - 模块间通信
    - 路由系统
    - 数据流

  e2e_tests:
    - 用户旅程
    - 功能流程
    - 边界测试

commands:
  - claude-flow test --type unit
  - claude-flow test --type integration
  - claude-flow test --type e2e
  - claude-flow test --performance
```

---

## 📝 执行步骤

### Phase 0: 准备阶段
```bash
# 1. 初始化Claude-Flow配置
claude-flow init --project xorigo-ui-refactor

# 2. 配置所有Agent
claude-flow setup-agents --config agents.yml

# 3. 验证架构文档
claude-flow validate-architecture --file 00-Website技术架构终极版.md

# 4. 创建备份
claude-flow backup --full
```

### Phase 1: 分析阶段（Week 1）
```bash
# Analyzer Agent 执行
claude-flow run analyzer-agent --tasks:
  - 扫描现有结构
  - 识别重叠功能
  - 生成迁移清单

# Validator Agent 验证
claude-flow run validator-agent --validate-analysis
```

### Phase 2: 归档阶段（Week 1）
```bash
# Migrator Agent 执行备份
claude-flow run migrator-agent --task backup:
  - 归档 /gallery 到 /archive/gallery-v1
  - 归档 /playground 到 /archive/playground-v1
  - 创建git标签 'pre-refactor-v1'
```

### Phase 3: 构建阶段（Week 2-3）
```bash
# Builder Agent 构建新模块
claude-flow run builder-agent --parallel:
  - 构建 Components 模块
  - 构建 Workbench 模块（整合）
  - 构建 Tools 模块
  - 构建其他模块

# Validator Agent 实时验证
claude-flow run validator-agent --real-time --strict
```

### Phase 4: 迁移阶段（Week 3）
```bash
# Migrator Agent 执行迁移
claude-flow run migrator-agent --tasks:
  - 迁移Gallery组件到Workbench
  - 迁移Playground功能到Workbench
  - 更新所有引用
  - 设置路由重定向
```

### Phase 5: 测试阶段（Week 4）
```bash
# Tester Agent 执行测试
claude-flow run tester-agent --comprehensive:
  - 运行单元测试
  - 运行集成测试
  - 运行E2E测试
  - 性能基准测试

# Validator Agent 最终验证
claude-flow run validator-agent --final-check
```

### Phase 6: 部署阶段（Week 4）
```bash
# Orchestrator Agent 协调部署
claude-flow run orchestrator-agent --deploy:
  - 生成部署检查清单
  - 执行灰度发布
  - 监控关键指标
  - 准备回滚方案
```

---

## 🛡️ 架构校验机制

### 实时校验规则
```typescript
interface ArchitectureValidation {
  // 模块边界校验
  moduleBoundaryCheck: {
    components: ['display', 'copy'],  // 只允许这些功能
    workbench: ['edit', 'experiment'],
    tools: ['independent'],
    templates: ['complete-project']
  },

  // 功能重叠检测
  overlapDetection: {
    enabled: true,
    threshold: 0,  // 零容忍
    action: 'block'  // 阻止执行
  },

  // 依赖关系验证
  dependencyValidation: {
    allowedDependencies: {
      components: ['@xorigo-ui/core'],
      workbench: ['@xorigo-ui/core', 'monaco-editor'],
      tools: []  // 不允许依赖其他模块
    },
    forbiddenPatterns: [
      'export function.*Button',  // 禁止在Website创建组件
      'export const.*Card',       // 禁止在Website创建组件
      'React.FC.*Component'        // 禁止在Website创建组件
    ]
  },

  // 组件源规则验证 🚨
  componentSourceValidation: {
    enforcePackagesImport: true,
    scanPatterns: [
      'import.*from.*@xorigo-ui',  // 必须从包导入
      'import.*from.*packages'      // 或直接从packages
    ],
    blockPatterns: [
      'export.*function.*[A-Z]',    // 阻止组件定义
      'export.*const.*[A-Z].*=.*React'  // 阻止React组件
    ]
  }
}
```

### 校验检查点
```yaml
checkpoints:
  pre_commit:
    - 验证文件位置
    - 检查模块边界
    - 扫描功能重叠

  pre_build:
    - 验证导入关系
    - 检查类型定义
    - 验证API边界

  post_build:
    - 功能测试
    - 性能验证
    - 最终架构符合性检查
```

---

## 📊 进度追踪

### KPI指标
```yaml
metrics:
  功能重叠度:
    target: 0%
    current: 70%

  模块独立性:
    target: 100%
    current: 40%

  测试覆盖率:
    target: 80%
    current: 60%

  性能指标:
    LCP: < 2.5s
    FID: < 100ms
    CLS: < 0.1
```

### 里程碑
```yaml
milestones:
  M1_分析完成:
    date: Week 1
    deliverables:
      - 重叠分析报告
      - 迁移计划

  M2_架构搭建:
    date: Week 2
    deliverables:
      - 新模块结构
      - 脚手架代码

  M3_功能迁移:
    date: Week 3
    deliverables:
      - Workbench完成
      - Components完成

  M4_测试部署:
    date: Week 4
    deliverables:
      - 测试报告
      - 部署完成
```

---

## 🚨 风险管理

### 风险矩阵
| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| 架构偏离 | 低 | 高 | Validator Agent 实时监控 |
| 功能丢失 | 中 | 高 | 完整备份 + 增量迁移 |
| 性能退化 | 低 | 中 | 性能基准测试 |
| 用户影响 | 中 | 高 | 灰度发布 + 回滚方案 |

### 回滚策略
```bash
# 快速回滚命令
claude-flow rollback --to pre-refactor-v1
claude-flow restore --from backup/[date]
```

---

## 📝 Agent 配置文件

### refactor.config.yml
```yaml
project: xorigo-ui-website-refactor
version: 2.0
architecture_source: ./docs/WEBSITE-ARCHITECTURE/00-Website技术架构终极版.md

agents:
  - name: orchestrator-agent
    type: coordinator
    priority: highest

  - name: architecture-validator
    type: validator
    mode: strict
    real_time: true

  - name: analyzer-agent
    type: analyzer
    targets: ['gallery', 'playground']

  - name: migrator-agent
    type: migrator
    strategy: merge

  - name: builder-agent
    type: builder
    parallel: true

  - name: tester-agent
    type: tester
    coverage_target: 80

validation:
  strict_mode: true
  zero_overlap: true
  boundary_check: true

execution:
  phases: 6
  duration_weeks: 4
  rollback_enabled: true
```

---

## ✅ 完成标准

1. **零功能重叠**：所有模块功能互不重复
2. **架构符合性**：100%符合v2.0架构设计
3. **测试覆盖率**：≥80%
4. **性能达标**：所有Core Web Vitals达标
5. **文档完整**：所有模块文档更新完成

---

**文档状态**: ✅ Ready for Execution
**下一步**: 执行 `claude-flow init` 开始重构