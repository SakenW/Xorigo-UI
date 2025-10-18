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
- 📦 **组件分类检测**：9 大组件分类系统规范

---

## 🏗️ Agent 架构

```
.claude/agents/
├── index.ts                    # Agents 目录索引
├── README.md                   # 本文档
└── code-quality-detector/     # 代码质量检测 Agent
    ├── index.ts               # Agent 主入口
    ├── README.md              # Agent 详细文档
    ├── init.ts                # Agent 初始化
    ├── core/                  # 检测系统核心
    ├── modules/               # 检测模块
    └── config/                # 配置文件
```

## 🚀 使用方式

### 导入和使用 Agent

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

### 创建新 Agent

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
   - Agent 目录使用 kebab-case
   - Agent 文件使用 camelCase
   - Agent 名称使用 kebab-case

2. **接口规范**
   - 必须提供 `detect` 函数
   - 必须提供 `AGENT_METADATA`
   - 建议提供状态管理函数

3. **文档规范**
   - 必须有 README.md 文档
   - 必须包含使用示例
   - 必须说明检测能力

4. **错误处理**
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

## 📝 开发路线图

### 短期目标 (v1.1)
- [ ] 添加更多专用 Agent
- [ ] 实现 Agent 间通信
- [ ] 添加 Agent 性能监控面板

### 中期目标 (v1.5)
- [ ] 支持 Agent 插件系统
- [ ] 实现 Agent 配置热重载
- [ ] 添加 Agent 测试框架

### 长期目标 (v2.0)
- [ ] 实现 Agent 市场
- [ ] 支持 Agent 版本管理
- [ ] 添加 Agent 可视化编辑器

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

**维护**: Xorigo UI Team
**更新**: 2025-01-18
**版本**: 1.0.0