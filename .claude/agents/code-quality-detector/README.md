# 🔍 Xorigo UI 代码质量检测 Agent

**一个专门为 Xorigo UI 项目设计的代码质量检测 Agent**

---

## 📋 Agent 信息

- **名称**: `code-quality-detector`
- **版本**: `1.0.0`
- **作者**: Xorigo UI Team
- **描述**: 检测 Xorigo UI 项目的代码质量、命名规范和架构规则合规性
- **标签**: `code-quality`, `naming`, `architecture`, `classification`

## 🎯 检测能力

### 🔧 核心检测功能

1. **命名规范检测**
   - 组件文件 PascalCase 命名
   - 工具函数 camelCase 命名
   - 禁止版本号和连字符
   - 目录结构合规性

2. **架构规则检测**
   - Website 中禁止创建 UI 组件
   - UI 组件必须从 packages 导入
   - 禁止继承扩展 packages 组件
   - 样式覆盖检测

3. **API 设计检测**
   - 基础属性一致性
   - 变体系统支持
   - forwardRef 和 displayName
   - TypeScript 类型安全

4. **组件分类系统检测**
   - 11 大组件分类规范（v1.5）
   - 三层架构合规性（System/Component/Composition）
   - 目录位置正确性
   - 命名一致性
   - API 设计标准
   - Labs 双重含义理解

## 🏗️ Agent 架构

```
code-quality-detector/
├── index.ts              # Agent 主入口
├── README.md             # Agent 文档
├── init.ts               # 初始化脚本
├── core/                 # 检测系统核心
│   ├── detection-core.ts # 检测引擎
│   └── token-optimizer.ts # Token 优化器
├── modules/              # 检测模块
│   ├── common/           # 通用模块
│   ├── apps/             # Website 专用模块
│   └── packages/         # Packages 专用模块
└── config/               # 配置文件
    └── directories.ts    # 目录配置
```

## 🚀 使用方式

### Claude Hook 集成

```typescript
import { detectCodeQuality } from '.claude/agents/code-quality-detector'

// 自动检测
const results = await detectCodeQuality({
  operation: 'edit',
  filePath: '/home/saken/project/Xorigo-UI/packages/core/src/ui/Button.tsx',
  content: '新的组件代码',
  workspace: '/home/saken/project/Xorigo-UI',
  timestamp: new Date()
})
```

### Agent 管理

```typescript
import {
  getAgentStatus,
  configureAgent,
  setAgentEnabled,
  healthCheck
} from '.claude/agents/code-quality-detector'

// 获取状态
const status = getAgentStatus()

// 配置 Agent
configureAgent({
  tokenOptimization: { maxTokensPerOperation: 200 }
})

// 启用/禁用
setAgentEnabled(true)

// 健康检查
const health = await healthCheck()
```

## 📊 检测模块详解

### 🎯 Website 专用模块
- **naming-app** (50 tokens)：Website 命名规范
- **content-app** (120 tokens)：内容质量检测
- **architecture-website** (100 tokens)：架构规则检测

### 📦 Packages 专用模块
- **naming-package** (60 tokens)：组件库命名规范
- **api-component** (150 tokens)：API 设计标准
- **classification-system** (80 tokens)：组件分类系统检测

### 🔄 通用模块
- **structure-common** (40 tokens)：基础文件结构检查

## ⚡ Token 优化

| 目录 | 原始消耗 | 优化后 | 节省率 |
|------|----------|--------|--------|
| Packages | ~290 tokens | ~174 tokens | 40% |
| Website | ~270 tokens | ~162 tokens | 40% |
| **平均** | **~280 tokens** | **~168 tokens** | **40%** |

## 🔧 配置管理

### 目录配置
```typescript
// config/directories.ts
export const PROJECT_DIRECTORY_CONFIGS = [
  {
    path: '/home/saken/project/Xorigo-UI/packages',
    modules: ['naming-package', 'api-component', 'classification-system']
  },
  {
    path: '/home/saken/project/Xorigo-UI/apps/website',
    modules: ['naming-app', 'content-app', 'architecture-website']
  }
]
```

### 自定义规则
```typescript
// 添加自定义检测规则
PROJECT_DIRECTORY_CONFIGS[0].customRules.push({
  id: 'custom-rule',
  name: '自定义规则',
  severity: 'warning',
  category: 'custom'
})
```

## 🚨 检测结果示例

### 命名规范违规
```json
{
  "ruleId": "packages-no-version",
  "severity": "error",
  "message": "组件文件 Button-v1.1.tsx 不能包含版本号",
  "suggestion": "移除文件名中的版本信息，使用 Git 管理版本",
  "autoFix": {
    "command": "mv \"Button-v1.1.tsx\" \"Button.tsx\"",
    "description": "重命名为标准格式"
  }
}
```

### 架构规则违规
```json
{
  "ruleId": "website-no-ui-components",
  "severity": "error",
  "message": "Website 中创建了 UI 组件 MyButton，违反架构规则",
  "suggestion": "UI 组件必须在 packages/ 目录中创建，Website 只能从 @xorigo-ui 导入使用"
}
```

## 📈 性能监控

### Agent 状态
```typescript
const status = getAgentStatus()
// 输出:
// {
//   agent: "code-quality-detector",
//   status: "active",
//   modules: { total: 7, loaded: true },
//   performance: { estimatedSavings: "~112 tokens (40%)" }
// }
```

### 健康检查
```typescript
const health = await healthCheck()
// 输出:
// {
//   agent: "code-quality-detector",
//   status: "healthy",
//   details: { /* 详细状态 */ }
// }
```

## 🔧 扩展开发

### 添加新检测模块

```typescript
// modules/custom/new-rule.ts
import type { DetectionModule } from '../../core/detection-core'

export const customModule: DetectionModule = {
  id: 'custom-rule',
  name: '自定义检测',
  description: '自定义检测规则',
  enabled: true,
  tokenCost: 60,
  rules: [/* 规则定义 */],
  async check(context) {
    // 检测逻辑
    return []
  }
}

// 注册模块
import { DetectionSystem } from '../../core/detection-core'
DetectionSystem.registerModule(customModule)
```

### 添加新监控目录

```typescript
// config/directories.ts
PROJECT_DIRECTORY_CONFIGS.push({
  path: '/home/saken/project/Xorigo-UI/docs',
  name: 'Documentation Directory',
  modules: ['structure-docs', 'content-docs']
})
```

## 🛠️ 故障排除

### 常见问题

**Q: Agent 没有响应**
```bash
# 检查 Agent 状态
import { healthCheck } from '.claude/agents/code-quality-detector'
const health = await healthCheck()
console.log(health)
```

**Q: Token 消耗过高**
```typescript
// 启用轻量级模式
configureAgent({
  tokenOptimization: {
    maxTokensPerOperation: 150,
    enableLightweightMode: true
  }
})
```

**Q: 检测结果不准确**
```bash
# 检查模块是否正确加载
import { getAgentStatus } from '.claude/agents/code-quality-detector'
console.log(getAgentStatus().modules)
```

### 调试模式

```typescript
// 启用详细日志
configureAgent({
  debug: true,
  verbose: true
})

// 查看检测过程
const results = await detectCodeQuality(context)
console.log('检测结果:', results)
```

## 📝 更新日志

### v1.0.0 (2025-01-18)
- ✨ 初始版本发布
- 🎯 实现路径感知检测系统
- 🧩 集成项目文档规则 (架构规则 + 组件分类)
- ⚡ Token 优化策略 (平均节省 40%)
- 📊 完整的监控和统计功能

---

**维护**: Xorigo UI Team
**版本**: 1.0.0
**类型**: Claude Agent
**范围**: Xorigo UI 项目代码质量检测