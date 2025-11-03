# 🤖 Xorigo UI Claude Agents

这个目录包含多个独立的 Claude Agent，每个 Agent 负责特定的功能领域。

---

## 📋 可用 Agents

### 🔍 代码质量检测 Agent
- **名称**: `code-quality-detector`
- **版本**: `1.0.0`
- **功能**: 检测 Xorigo UI 项目的代码质量、命名规范和架构规则合规性
- **状态**: ✅ 活跃
- **详细文档**: [./code-quality-detector/README.md](./code-quality-detector/README.md)

#### 检测能力
- 🏷️ **命名规范检测**：组件文件命名、工具函数命名等
- 🏗️ **架构规则检测**：Website 架构合规性、UI 组件来源检查
- 🔧 **API 设计检测**：组件 API 一致性、TypeScript 类型安全
- 📦 **组件分类检测**：11 大组件分类系统规范（v1.5）

### 🎨 Xorigo UI 组件开发主管
- **名称**: `xorigo-component-master`
- **版本**: `1.0.0`
- **功能**: 专门负责 Xorigo UI 组件开发全流程的专家，协调组件创建、质量检查、测试和文档生成
- **状态**: ✅ 活跃
- **详细文档**: [./xorigo-component-master/AGENT.md](./xorigo-component-master/AGENT.md)

#### 核心职责
- 🏗️ **组件开发全流程管理**：需求分析 → 设计 → 开发 → 测试 → 文档
- 🎯 **API 设计协调**：确保组件API的一致性和可预测性
- 🧪 **质量保证**：协调质量检查和测试覆盖
- 📚 **文档标准化**：确保文档完整性和一致性

### 🛡️ Xorigo UI 质量守护者
- **名称**: `xorigo-quality-guardian`
- **版本**: `1.0.0`
- **功能**: 负责 Xorigo UI 项目全方位质量管理，包括命名规范、架构规则、API 设计标准和组件分类系统合规性
- **状态**: ✅ 活跃
- **详细文档**: [./xorigo-quality-guardian/AGENT.md](./xorigo-quality-guardian/AGENT.md)

#### 质量守护范围
- 📋 **命名规范**：文件命名、变量命名、组件命名的一致性
- 🏗️ **架构合规**：目录结构、模块组织、依赖关系
- 🔧 **API 标准**：组件接口、TypeScript 类型、事件处理
- 📦 **分类系统**：组件分类的准确性和一致性（v1.5 十一类分类系统）

### 🎭 Xorigo UI 工作流编排器 🔥
- **名称**: `xorigo-ui-workflow-agent`
- **版本**: `1.0.0`
- **功能**: 专门负责 Xorigo UI 组件库完整开发工作流的智能协调Agent，集成代码质量分析、重构优化、测试生成和文档生成的全流程自动化管理
- **状态**: ✅ 活跃
- **详细文档**: [./xorigo-ui-workflow-agent/AGENT.md](./xorigo-ui-workflow-agent/AGENT.md)

#### 四阶段工作流程
1. **🔍 分析与评估**：技术债务基线分析 + AI代码质量深度审查
2. **🔧 重构与优化**：系统性代码重构 + 上下文完整性保障
3. **🧪 测试与验证**：全面测试用例生成 + 集成测试场景协调
4. **📚 文档与交付**：API参考文档生成 + 开发者指南更新

#### 智能协调特性
- **🎯 自动化决策**：优先级智能排序、依赖关系管理、影响范围评估
- **🔄 迭代优化**：质量门禁、反馈循环、基线更新
- **📊 进度跟踪**：实时状态监控、风险预警、成果总结

#### 使用方式
```bash
# 完整工作流执行
/agent xorigo-ui-workflow-agent "对Button组件执行完整开发工作流"

# 分阶段执行
/agent xorigo-ui-workflow-agent "对Button组件执行分析评估阶段"

# 批量处理
/agent xorigo-ui-workflow-agent "对Button、Input、Card组件批量执行工作流"
```

### 🚀 Xorigo UI 工作流协调器
- **名称**: `xorigo-workflow-orchestrator`
- **版本**: `1.0.0`
- **功能**: 负责协调多个开发工作流，管理复杂任务的执行顺序和依赖关系
- **状态**: ✅ 活跃
- **详细文档**: [./xorigo-workflow-orchestrator/AGENT.md](./xorigo-workflow-orchestrator/AGENT.md)

#### 协调能力
- 📋 **任务编排**：多任务执行顺序管理
- 🔗 **依赖管理**：任务间依赖关系协调
- ⚡ **并行处理**：独立任务的并行执行
- 📊 **状态跟踪**：工作流执行状态监控

### 🚀 开发环境管理代理 (Dev Environment Manager Agent)
- **名称**: `dev-environment-manager`
- **版本**: `2.0.0` 🆕
- **功能**: 智能开发环境管理器，支持本地开发、Docker开发和混合模式
- **状态**: ✅ 活跃
- **新增功能**: 🔥 智能端口冲突检测与处理

#### 核心能力
- 🔍 **智能端口检测**：自动检测端口占用并识别进程类型
- 🛑 **进程自动管理**：智能识别并安全停止开发服务器进程
- 💬 **交互式用户界面**：清晰的用户选择和操作反馈
- 🔄 **多模式支持**：本地开发、Docker核心库、Docker完整模式、混合模式
- 🐳 **Docker 环境管理**：热更新容器启动、停止、重启
- 📊 **环境状态监控**：实时检查开发环境状态
- 🧹 **违规进程清理**：自动检测和终止违规的开发进程

#### 新增智能特性 (v2.0)
- **🎯 智能进程识别**: 自动识别 Vite、Next.js、concurrently 等开发服务器进程
- **⚡ 安全停止机制**: 优雅停止 → 等待验证 → 必要时强制终止
- **📱 用户友好界面**: 彩色输出、清晰提示、详细的状态信息
- **🔄 向后兼容**: 保持所有原有功能不变

#### 支持的开发模式
1. **本地开发模式** - 直接在本地运行开发服务器
   - 端口: 核心库 3001, Website 3100
2. **Docker 核心库模式** - 在 Docker 中运行核心库，本地运行 Website
   - 端口: 核心库 3001, Website 3100
3. **Docker 完整模式** - 在 Docker 中运行完整 Monorepo 环境
   - 端口: Website 3100, Storybook 6006, 配方预览 3101
4. **混合模式** - 本地开发 + Docker 辅助
   - 端口: 核心库 3001, Website 3100

#### 使用方式
```bash
# 交互式菜单
node scripts/dev-env-manager.js

# 直接启动本地开发模式
node scripts/dev-env-manager.js local

# 检查环境状态
node scripts/dev-env-manager.js status

# 停止所有服务
node scripts/dev-env-manager.js stop

# 查看帮助
node scripts/dev-env-manager.js help
```

#### 端口管理示例
```bash
$ node scripts/dev-env-manager.js local

🔍 检查端口占用情况:
==================
  端口 3001: 被占用 (core)
    进程信息: 59684 node vite --port 3001 --host
    检测到开发服务器进程
  端口 3100: 被占用 (website)
    进程信息: 59005 node next dev --port 3100
    检测到开发服务器进程

🛑 发现可以停止的开发服务器进程:
  - core (端口 3001, PID 59684)
  - website (端口 3100, PID 59005)

是否停止现有的开发服务器进程？ [y/N]: y

✅ 成功停止 2 个进程
```

#### 🎯 推荐的开发命令
```bash
# 推荐的本地开发命令
pnpm local:dev

# Docker 开发环境
pnpm docker:dev

# 混合模式
pnpm docker:dev:monorepo

# 环境检查
pnpm local:dev status
```

#### 📋 访问地址
- **核心库开发**: http://localhost:3001
- **Website 开发**: http://localhost:3100
- **Storybook**: http://localhost:6006
- **配方预览**: http://localhost:3101/recipes

---

## 🏗️ Agent 架构

```
.claude/agents/
├── index.ts                           # Agents 目录索引
├── README.md                          # 本文档
├── code-quality-detector/             # 代码质量检测 Agent
│   ├── index.ts                      # Agent 主入口
│   └── README.md                     # Agent 详细文档
├── xorigo-component-master/           # 组件开发主管 Agent
│   └── AGENT.md                      # Agent 定义文件
├── xorigo-quality-guardian/           # 质量守护者 Agent
│   └── AGENT.md                      # Agent 定义文件
├── xorigo-workflow-orchestrator/      # 工作流协调器 Agent
│   └── AGENT.md                      # Agent 定义文件
└── xorigo-ui-workflow-agent/          # 工作流编排器 Agent 🔥
    ├── AGENT.md                      # Agent 定义文件
    ├── README.md                     # 使用说明文档
    ├── scripts/                      # 支持脚本
    │   ├── workflow_executor.py      # 工作流执行器
    │   └── validate_skill.py         # 技能验证器
    └── workflow-config.json          # 工作流配置文件
```

## 🚀 使用方式

### Agent 调用方式

Xorigo UI 项目中的 Agent 采用不同的调用方式：

#### 1. 代码质量检测 Agent (TypeScript 接口)
```typescript
// 导入特定的 Agent
import { codeQualityDetector } from '.claude/agents'

// 使用 Agent
const results = await codeQualityDetector.detect({
  operation: 'edit',
  filePath: '/home/saken/project/Xorigo-UI/packages/core/src/ui/Button.tsx',
  content: '新的组件代码',
  workspace: '/home/saken/project/Xorigo-UI',
  timestamp: new Date()
})

// 获取 Agent 状态
const status = codeQualityDetector.getStatus()
```

#### 2. Xorigo 专用 Agent (Claude Code Agent 调用)
```bash
# 组件开发主管
/agent xorigo-component-master "为新的Button组件创建完整的开发流程"

# 质量守护者
/agent xorigo-quality-guardian "检查所有组件的API一致性"

# 工作流协调器
/agent xorigo-workflow-orchestrator "协调多个组件的并行开发任务"

# 工作流编排器 (推荐) 🔥
/agent xorigo-ui-workflow-agent "对Button组件执行完整开发工作流"
```

#### 3. 工作流编排器脚本执行
```bash
# 完整工作流执行
python3 .claude/agents/xorigo-ui-workflow-agent/scripts/workflow_executor.py --component=Button

# 分阶段执行
python3 .claude/agents/xorigo-ui-workflow-agent/scripts/workflow_executor.py --phase=analyze --component=Button

# 批量处理
python3 .claude/agents/xorigo-ui-workflow-agent/scripts/workflow_executor.py --components="Button,Input,Card"
```

### 动态获取 Agent

```typescript
import { getAgentInfo, getActiveAgents } from '.claude/agents'

// 获取特定 Agent 信息
const agentInfo = getAgentInfo('code-quality-detector')

// 获取所有活跃的 Agent
const activeAgents = getActiveAgents()
```

---

## 📋 Agent 开发指南

### Agent 类型说明

Xorigo UI 项目支持两种类型的 Agent：

#### 1. TypeScript Agent (如 code-quality-detector)
- **文件格式**: `.ts` 文件为主入口
- **调用方式**: 编程接口调用
- **适用场景**: 代码检测、自动化工具集成

#### 2. Claude Code Agent (如 xorigo-*-agent)
- **文件格式**: `AGENT.md` 定义文件
- **调用方式**: `/agent` 命令调用
- **适用场景**: 工作流协调、专家决策、任务编排

### 创建新的 Claude Code Agent

1. **创建 Agent 目录**
   ```bash
   mkdir .claude/agents/xorigo-your-agent-name
   ```

2. **创建 Agent 定义文件**
   ```markdown
   ---
   name: "Agent 显示名称"
   description: "Agent 功能描述，说明何时使用"
   model: "sonnet"
   allowed-tools: "Task,Read,Write,Edit,Grep,Glob"
   ---

   # Agent 标题

   作为 Agent 角色，我专门负责...

   ## 🎯 核心职责
   ### 主要功能领域
   - **功能1**: 具体描述
   - **功能2**: 具体描述

   ## 🚀 工作流程
   ### 阶段说明
   1. **步骤1**: 具体执行内容
   2. **步骤2**: 具体执行内容

   ## 🔧 执行命令
   ```bash
   # 使用示例
   /agent xorigo-your-agent-name "执行具体任务"
   ```

   ## 📈 输出产物
   - **产物1**: 描述和格式
   - **产物2**: 描述和格式
   ```

3. **创建支持文件** (可选)
   - `README.md`: 详细使用说明
   - `scripts/`: 支持脚本
   - `config.json`: 配置文件

4. **更新本文档**
   在 "可用 Agents" 部分添加新 Agent 的说明

### 创建新的 TypeScript Agent

1. **创建 Agent 目录**
   ```bash
   mkdir .claude/agents/your-agent-name
   ```

2. **创建 Agent 基础文件**
   - `index.ts` - Agent 主入口
   - `README.md` - Agent 文档
   - 核心逻辑文件

3. **实现 Agent 接口**
   ```typescript
   // index.ts
   export const AGENT_METADATA = {
     name: 'your-agent-name',
     displayName: 'Agent 显示名称',
     version: '1.0.0',
     description: 'Agent 功能描述'
   }

   export async function detect(context: DetectionContext) {
     // Agent 检测逻辑
     return results
   }

   export default {
     detect,
     metadata: AGENT_METADATA
   }
   ```

4. **更新主索引**
   ```typescript
   // .claude/agents/index.ts
   export { default as yourAgentName } from './your-agent-name'

   export const AVAILABLE_AGENTS = [
     // ... 其他 agents
     {
       name: 'your-agent-name',
       displayName: 'Agent 显示名称',
       description: 'Agent 功能描述',
       version: '1.0.0',
       path: './your-agent-name',
       active: true
     }
   ]
   ```

### Agent 开发规范

1. **命名规范**
   - Agent 目录使用 kebab-case (如 `xorigo-ui-workflow-agent`)
   - Claude Code Agent 文件固定为 `AGENT.md`
   - TypeScript Agent 文件使用 camelCase (如 `index.ts`)
   - Agent 名称使用 kebab-case

2. **格式规范**
   - **Claude Code Agent**: 必须使用 YAML frontmatter + Markdown 格式
   - **TypeScript Agent**: 必须提供 `detect` 函数和 `AGENT_METADATA`
   - 建议提供状态管理函数

3. **文档规范**
   - 必须有功能描述和使用示例
   - Claude Code Agent 必须有详细的核心职责和工作流程
   - TypeScript Agent 必须有 README.md 文档
   - 必须说明检测能力或功能范围

4. **工具权限规范**
   - Claude Code Agent 必须指定 `allowed-tools`
   - 权限范围应与功能需求匹配
   - 避免过度授权

5. **错误处理**
   - 捕获并处理异常
   - 提供有意义的错误信息
   - 不要让 Agent 崩溃

---

## 🔧 配置管理

### Agent 配置

每个 Agent 可以有独立的配置：

```typescript
// 在 Agent 目录中创建配置
const agentConfig = {
  enabled: true,
  tokenOptimization: {
    maxTokensPerOperation: 200
  },
  customRules: [...]
}
```

### 全局配置

```typescript
// .claude/config/agents-config.ts
export const AGENTS_GLOBAL_CONFIG = {
  defaultEnabled: true,
  logLevel: 'info',
  performance: {
    enableMetrics: true
  }
}
```

---

## 📊 性能监控

### Token 使用优化

所有 Agent 都应该遵循 Token 优化原则：

- **轻量级模式**：根据操作类型选择检测模块
- **预算控制**：设置合理的 Token 消耗限制
- **优先级排序**：优先运行重要的检测模块

### 监控指标

```typescript
// Agent 性能指标
interface AgentMetrics {
  tokenConsumption: number
  detectionTime: number
  accuracy: number
  errorRate: number
}
```

---

## 🛠️ 故障排除

### 常见问题

**Q: Agent 没有响应**
```bash
# 检查 Agent 状态
import { getAgentInfo } from '.claude/agents'
const agent = getAgentInfo('code-quality-detector')
console.log(agent)
```

**Q: Agent 导入失败**
```bash
# 检查文件结构
ls -la .claude/agents/
# 检查语法错误
node -c .claude/agents/code-quality-detector/index.ts
```

**Q: 检测结果不准确**
```typescript
// 启用调试模式
const agent = await import('.claude/agents/code-quality-detector')
agent.configure({ debug: true })
```

### 调试技巧

1. **单独测试 Agent**
   ```bash
   node -e "
   import('./code-quality-detector/index.js').then(agent => {
     console.log('Agent 状态:', agent.getStatus())
   })
   "
   ```

2. **查看详细日志**
   ```typescript
   // 在 Agent 中添加日志
   console.log(`[${AGENT_METADATA.name}] 检测开始:`, context.filePath)
   console.log(`[${AGENT_METADATA.name}] 检测结果:`, results.length)
   ```

3. **性能分析**
   ```typescript
   const startTime = performance.now()
   const results = await detect(context)
   const endTime = performance.now()
   console.log(`检测耗时: ${endTime - startTime}ms`)
   ```

---

## 🎯 推荐使用工作流

### 组件开发完整流程
```bash
# 1. 新组件创建 - 使用组件开发主管
/agent xorigo-component-master "创建新的Button组件"

# 2. 质量检查 - 使用质量守护者
/agent xorigo-quality-guardian "检查Button组件的API一致性"

# 3. 完整工作流 - 使用工作流编排器 (推荐) 🔥
/agent xorigo-ui-workflow-agent "对Button组件执行完整开发工作流"

# 4. 批量处理 - 使用脚本方式
python3 .claude/agents/xorigo-ui-workflow-agent/scripts/workflow_executor.py --components="Button,Input,Card"
```

### 代码质量保证流程
```bash
# 1. 代码检测
import { codeQualityDetector } from '.claude/agents'
const results = await codeQualityDetector.detect({...})

# 2. 质量守护
/agent xorigo-quality-guardian "全面检查代码质量问题"

# 3. 工作流优化
/agent xorigo-ui-workflow-agent "基于检测结果执行优化工作流"
```

## 📝 开发路线图

### 短期目标 (v1.1) ✅ 已完成
- [x] 添加 xorigo-ui-workflow-agent 工作流编排器
- [x] 实现 Agent 间协作机制
- [x] 添加完整的工作流执行脚本

### 中期目标 (v1.5)
- [ ] 实现 Agent 性能监控面板
- [ ] 支持 Agent 配置热重载
- [ ] 添加 Agent 测试框架
- [ ] 集成更多 Claude Code 插件

### 长期目标 (v2.0)
- [ ] 实现 Agent 可视化编辑器
- [ ] 支持 Agent 版本管理
- [ ] 添加 Agent 模板库
- [ ] 实现 Agent 市场集成

---

## 🤝 贡献指南

### 提交新 Agent

1. Fork 项目
2. 创建 Agent 目录
3. 实现 Agent 功能
4. 编写文档和测试
5. 提交 Pull Request

### Agent 质量标准

- ✅ 功能完整且稳定
- ✅ 文档清晰且详细
- ✅ 遵循开发规范
- ✅ 通过所有测试
- ✅ 性能优化良好

---

## 🌟 Agent 生态系统总览

Xorigo UI 项目现已建立了完整的 Agent 生态系统：

### 🎯 核心工作流
- **组件开发** → **质量保证** → **工作流编排** → **代码检测**

### 🔧 技术栈支持
- **React 19 + TypeScript 5.9**: 现代组件开发
- **Tailwind CSS 4**: 设计系统集成
- **Framer Motion 12**: 动画系统
- **七轴主题系统**: 多维度主题支持

### 📊 质量保证体系
- **自动化检测**: 代码质量、命名规范、架构合规
- **智能工作流**: 四阶段完整开发流程
- **插件集成**: Claude Code 生态无缝对接

**维护**: Xorigo UI Team
**更新**: 2025-10-25
**版本**: 2.0.0
**新增**: 智能端口管理功能 + 工作流编排器 🔥