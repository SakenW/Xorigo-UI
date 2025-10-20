# Dev Server Agent 使用指南

**版本**: 2.0.0 (增强版)
**更新日期**: 2025-10-20

---

## 📖 概述

Dev Server Agent 是专门负责 Xorigo UI Docker 开发环境管理和问题诊断的智能代理。

### 核心职责

- 🐳 Docker 开发环境管理
- 🔥 热更新容器监控
- 🔍 智能编译错误诊断
- 📦 Monorepo 包依赖检查
- 🚨 端口冲突检测和清理
- 📊 容器日志管理
- 💊 自动问题修复

---

## 🚀 快速开始

### 初始化

```typescript
import { getDevServerAgent } from '.claude/agents/dev-server-agent'

const agent = getDevServerAgent('/home/saken/project/Xorigo-UI')
```

### 基本操作

```typescript
// 启动开发环境
await agent.startDevEnvironment()

// 健康检查
const health = await agent.healthCheck()
console.log(health.recommendations)

// 诊断编译错误
const diagnosis = await agent.diagnoseCompilationErrors()

// 查看日志
await agent.showLogs()
```

---

## 🛠️ 功能详解

### 1. 健康检查 (增强版)

**功能**：全面检查开发环境健康状态

**使用**：
```typescript
const health = await agent.healthCheck()
```

**返回数据**：
```typescript
{
  status: 'healthy' | 'unhealthy',
  docker: boolean,              // Docker 是否运行
  container: boolean,           // 容器是否运行
  containerHealth: string,      // 容器健康状态
  port: boolean,                // 端口是否可用
  compilation: {
    status: 'success' | 'error' | 'unknown',
    errors: string[],           // 编译错误
    warnings: string[]          // 编译警告
  },
  recommendations: string[],    // 修复建议
  lastCheck: string
}
```

**示例输出**：
```
{
  status: 'unhealthy',
  docker: true,
  container: true,
  containerHealth: 'unhealthy',
  port: true,
  compilation: {
    status: 'error',
    errors: ['./src/components/marketing/hero-title.tsx: No such file'],
    warnings: []
  },
  recommendations: [
    '⚠️ 容器不健康 - 检查日志: docker logs xorigo-ui-website-dev',
    '❌ 编译错误 - 运行诊断工具: npm run diagnose',
    '   首个错误: ./src/components/marketing/hero-title.tsx: No such file'
  ]
}
```

---

### 2. 智能诊断编译错误

**功能**：解析容器日志，识别和分析编译错误

**使用**：
```typescript
const diagnosis = await agent.diagnoseCompilationErrors()
```

**返回数据**：
```typescript
{
  errors: Array<{
    type: string,               // 错误类型
    message: string,            // 错误信息
    file?: string,              // 涉及的文件
    importChain?: string[],     // 导入链
    suggestions?: string[]      // 修复建议
  }>,
  summary: {
    totalErrors: number,
    errorTypes: Record<string, number>,
    criticalFiles: string[]
  }
}
```

**支持的错误类型**：

| 类型 | 描述 | 示例 |
|-----|------|-----|
| `import-chain` | 导入链错误 | `./src/components/marketing/hero-title.tsx` → `index.ts` → `page2.tsx` |
| `missing-file` | 文件缺失 | `No such file or directory` |
| `typescript` | TypeScript 错误 | `TS2307: Cannot find module` |
| `compilation` | 通用编译错误 | `Failed to compile` |

**示例输出**：
```
============================================================
🔍 编译错误诊断报告
============================================================

📊 错误摘要:
   总错误数: 1
   错误类型:
      - import-chain: 1

📁 关键文件:
   - src/components/marketing/hero-title.tsx

📋 详细错误:

1. [IMPORT-CHAIN] ./src/components/marketing/hero-title.tsx
   文件: src/components/marketing/hero-title.tsx
   导入链:
      → ./src/components/marketing/hero-title.tsx
      → ./src/components/marketing/index.ts
      → ./app/(marketing)/page2/page.tsx

   📍 检查文件: ./app/(marketing)/page2/page.tsx
   🔧 可能的修复:
      1. 检查 ./app/(marketing)/page2/page.tsx 中的导入语句
      2. 确认被导入的文件是否存在
      3. 检查导出语句是否正确
      4. 检查 index.ts 中是否有错误的重导出

============================================================
```

---

### 3. Monorepo 包依赖检查

**功能**：检查 Xorigo UI monorepo 中各个包的构建状态

**使用**：
```typescript
// 检查包状态
const status = await agent.checkMonorepoPackages()

// 自动修复
await agent.fixMonorepoPackages()
```

**检查的包**：
- `@xorigo-ui/core`
- `@xorigo-ui/tokens`
- `@xorigo-ui/system`
- `@xorigo-ui/style-recipe`

**返回数据**：
```typescript
{
  [packageName]: {
    exists: boolean,           // 包是否存在
    hasBuilt: boolean,         // 是否已构建
    buildDate?: string,        // 构建日期
    issues: string[]           // 发现的问题
  }
}
```

**示例输出**：
```
📊 Monorepo 包状态报告:
✅ @xorigo-ui/core:
   存在: 是
   已构建: 是
   构建时间: Oct 20 04:20

⚠️ @xorigo-ui/tokens:
   存在: 是
   已构建: 否
   问题:
      - 包未构建，需要运行 npm run build

⚠️ @xorigo-ui/system:
   存在: 是
   已构建: 是
   构建时间: Oct 19 22:15
   问题:
      - 容器内包未同步，需要重启容器
```

**自动修复**：
- 自动构建缺失的包
- 重启容器同步包到容器内
- 验证修复结果

---

### 4. 开发环境管理

#### 启动开发环境

```typescript
await agent.startDevEnvironment()
```

**步骤**：
1. 检查 Docker 状态
2. 清理违规进程（`npm run dev`）
3. 停止旧容器
4. 构建并启动新容器
5. 等待服务就绪
6. 验证启动成功

#### 停止开发环境

```typescript
await agent.stopDevEnvironment()
```

#### 重启开发环境

```typescript
await agent.restartDevEnvironment()
```

---

### 5. Docker 镜像管理

#### 构建镜像

```typescript
// 普通构建
await agent.buildDockerImages()

// 重新构建（清理后构建）
await agent.buildDockerImages(true)
```

#### 清理 Docker 资源

```typescript
await agent.cleanDockerResources()
```

**清理内容**：
- 停止并删除容器
- 清理未使用的镜像
- 清理未使用的网络
- 清理未使用的卷

---

### 6. 日志和监控

#### 查看日志

```typescript
// 查看最近日志
await agent.showLogs()

// 持续跟踪日志
await agent.showLogs(true)
```

#### 检查违规进程

```typescript
const { hasViolations, violations } = await agent.checkForViolations()

if (hasViolations) {
  console.log('发现违规:', violations)
  await agent.cleanupViolatingProcesses()
}
```

---

## 📋 错误诊断指南

### 常见问题诊断流程

#### 1. 容器 unhealthy

**问题表现**：
```bash
docker ps
# STATUS: Up 1 hour (unhealthy)
```

**诊断步骤**：
```typescript
// 1. 健康检查
const health = await agent.healthCheck()
console.log(health.recommendations)

// 2. 编译错误诊断
const diagnosis = await agent.diagnoseCompilationErrors()

// 3. 检查包依赖
const packages = await agent.checkMonorepoPackages()
```

#### 2. 导入链错误

**错误信息**：
```
Import trace for requested module:
./src/components/marketing/hero-title.tsx
./src/components/marketing/index.ts
./app/(marketing)/page2/page.tsx
```

**诊断方法**：
```typescript
const diagnosis = await agent.diagnoseCompilationErrors()

// 查看导入链分析
diagnosis.errors.forEach(error => {
  if (error.type === 'import-chain') {
    console.log('导入链:', error.importChain)
    console.log('修复建议:', error.suggestions)
  }
})
```

**修复建议**：
1. 检查导入链的最后一个文件（通常是触发点）
2. 验证中间文件的导出是否正确
3. 确认源文件是否真实存在

#### 3. TypeScript 错误

**错误信息**：
```
TS2503: Cannot find namespace 'JSX'
```

**诊断方法**：
```typescript
const diagnosis = await agent.diagnoseCompilationErrors()

// 查找 TypeScript 错误
const tsErrors = diagnosis.errors.filter(e => e.type === 'typescript')
tsErrors.forEach(error => {
  console.log(`TS${error.tsCode}:`, error.message)
  console.log('建议:', error.suggestions)
})
```

**常见 TypeScript 错误**：

| 错误代码 | 描述 | 解决方案 |
|---------|------|---------|
| TS2307 | 模块未找到 | 检查导入路径、确认包已安装 |
| TS2503 | 找不到命名空间 | 添加类型声明、检查 tsconfig.json |
| TS2604 | JSX 元素类型错误 | 使用 `React.ElementType` 代替 `keyof JSX.IntrinsicElements` |
| TS2786 | JSX 组件使用错误 | 检查组件签名、确认 Props 类型 |

#### 4. 包依赖问题

**问题表现**：
```
Attempted import error: 'HeroTitle' is not exported from '@xorigo-ui/core'
```

**诊断方法**：
```typescript
// 检查包状态
const packages = await agent.checkMonorepoPackages()

// 自动修复
await agent.fixMonorepoPackages()
```

**手动修复**：
```bash
# 构建包
cd packages/core && npm run build

# 重启容器
docker-compose -f docker-compose.dev.monorepo.yml restart
```

---

## 🎯 最佳实践

### Docker 开发环境

1. **始终使用 Docker 热更新容器**：
   ```bash
   npm run docker:dev  # ✅ 正确
   npm run dev         # ❌ 禁止
   ```

2. **定期健康检查**：
   ```typescript
   // 每30分钟或遇到问题时
   const health = await agent.healthCheck()
   ```

3. **遇到问题先诊断**：
   ```typescript
   // 不要盲目重启，先诊断问题
   const diagnosis = await agent.diagnoseCompilationErrors()
   ```

### 文件组织

1. **index.ts 重导出规范**：
   ```typescript
   // ✅ 正确：只导出存在的文件
   export { PageLoader } from './page-loader'
   export { CodeEditor } from './code-editor'

   // ❌ 错误：导出不存在的文件
   export { HeroTitle } from './hero-title'  // 文件不存在
   ```

2. **导入路径规范**：
   ```typescript
   // ✅ 正确：明确来源
   import { HeroTitle } from '@xorigo-ui/core'           // 从包导入
   import { PageLoader } from '@/components/marketing'   // 从本地导入

   // ❌ 错误：混淆来源
   import { HeroTitle } from '@/components/marketing'    // 但 HeroTitle 在包中
   ```

### 错误处理

1. **容器路径映射**：
   ```
   容器内: /app/src/components/marketing/index.ts
   宿主机: src/components/marketing/index.ts
   ```

2. **导入链追踪**：
   - 从错误堆栈底部向上追踪
   - 最后一个文件通常是触发点
   - 中间文件是传播路径

3. **自动修复优先**：
   ```typescript
   // 优先使用自动修复
   await agent.fixMonorepoPackages()

   // 自动修复失败再手动处理
   ```

---

## 🔧 配置

### Agent 配置

```typescript
export const DevServerAgentConfig = {
  name: 'Development Server Agent',
  version: '2.0.0',

  defaultConfig: {
    port: 3100,                                  // 开发端口
    containerName: 'xorigo-ui-website-dev',      // 容器名称
    composeFile: 'docker-compose.dev.monorepo.yml',
    startupTimeout: 60000,                       // 启动超时（毫秒）
    healthCheckInterval: 30000                   // 健康检查间隔（毫秒）
  },

  features: {
    enhancedHealthCheck: true,      // 增强健康检查
    intelligentDiagnosis: true,     // 智能诊断
    monorepoSupport: true           // Monorepo 支持
  }
}
```

---

## 📚 API 参考

### 核心方法

| 方法 | 描述 | 返回值 |
|-----|------|--------|
| `healthCheck()` | 健康检查 | `Promise<HealthStatus>` |
| `diagnoseCompilationErrors()` | 诊断编译错误 | `Promise<Diagnosis>` |
| `checkMonorepoPackages()` | 检查包状态 | `Promise<PackageStatus>` |
| `fixMonorepoPackages()` | 修复包依赖 | `Promise<FixResult>` |
| `startDevEnvironment()` | 启动开发环境 | `Promise<StartResult>` |
| `stopDevEnvironment()` | 停止开发环境 | `Promise<StopResult>` |
| `restartDevEnvironment()` | 重启开发环境 | `Promise<void>` |
| `showLogs(follow?)` | 查看日志 | `Promise<void>` |
| `checkForViolations()` | 检查违规进程 | `Promise<ViolationStatus>` |
| `cleanupViolatingProcesses()` | 清理违规进程 | `Promise<void>` |
| `buildDockerImages(rebuild?)` | 构建镜像 | `Promise<BuildResult>` |
| `cleanDockerResources()` | 清理 Docker 资源 | `Promise<CleanResult>` |

---

## 📝 更新日志

### v2.0.0 (2025-10-20)

**新增功能**：
- ✨ 增强的健康检查（包含编译状态）
- ✨ 智能编译错误诊断
- ✨ 导入链分析
- ✨ TypeScript 错误建议
- ✨ 容器路径映射
- ✨ Monorepo 包依赖检查
- ✨ 自动修复建议

**改进**：
- 🔧 更详细的错误报告
- 🔧 更智能的修复建议
- 🔧 更完善的容器监控

### v1.0.0 (初始版本)

**基础功能**：
- Docker 环境管理
- 违规进程清理
- 容器日志查看
- 基本健康检查

---

## 🤝 贡献

如果遇到新的问题类型或有改进建议，请：

1. 记录问题详情
2. 分析根本原因
3. 提供修复方案
4. 更新诊断逻辑

---

**维护**: Xorigo UI Team
**更新**: 2025-10-20
