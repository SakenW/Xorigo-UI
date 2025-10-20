# Docker 开发环境问题诊断总结

**日期**: 2025-10-20
**Agent 版本**: dev-server-agent v2.0.0

## 🐛 遇到的问题

### 问题描述

**错误信息**：
```
Failed to compile
./src/components/marketing/hero-title.tsx
Error: No such file or directory (os error 2)

Import trace for requested module:
./src/components/marketing/hero-title.tsx
./src/components/marketing/index.ts
./app/(marketing)/page2/page.tsx
```

**表现**：
- Docker 容器状态显示 `unhealthy`
- Next.js 编译失败
- 页面访问返回 500 错误
- 容器日志持续报错

### 根本原因

1. **导出链错误**：
   - `/apps/website/src/components/marketing/index.ts` 导出了不存在的 `hero-title.tsx`
   - 但该文件从未创建

2. **导入链传播**：
   ```
   page2.tsx
     → @/components/marketing (index.ts)
       → hero-title.tsx (❌ 文件不存在)
   ```

3. **容器环境复杂性**：
   - 错误路径显示为容器内路径 `/app/src/...`
   - 需要映射到宿主机路径才能定位问题
   - Docker 热更新环境增加了诊断难度

---

## 🔍 诊断过程

### 1. 初步检查

**步骤**：
- 检查 Docker 容器状态
- 查看容器日志

**命令**：
```bash
docker ps --filter "name=xorigo" --format "{{.Names}} - {{.Status}}"
docker logs xorigo-ui-website-dev --tail 50
```

**发现**：
- 容器状态 `unhealthy`
- 日志显示编译错误

### 2. 路径追踪

**错误堆栈分析**：
```
Import trace for requested module:
./src/components/marketing/hero-title.tsx  ← 源头：文件不存在
./src/components/marketing/index.ts        ← 中间：导出了不存在的文件
./app/(marketing)/page2/page.tsx           ← 触发：使用了导出
```

**关键发现**：
- 容器路径 `/app/src/...` 映射到宿主机 `src/...`
- 问题源头在 `marketing/index.ts` 的第7行

### 3. 文件验证

**检查文件是否存在**：
```bash
ls -la /home/saken/project/Xorigo-UI/apps/website/src/components/marketing/
```

**结果**：
- ❌ `hero-title.tsx` 文件不存在
- ✅ 其他导出的文件都存在

### 4. 导入分析

**读取 `marketing/index.ts`**：
```typescript
export { PageLoader } from './page-loader'
export { HeroTitle } from './hero-title'      // ← 问题行
export { Component3DCarousel } from './component-3d-carousel'
```

**读取 `page2.tsx`**：
```typescript
import { HeroTitle } from '@xorigo-ui/core'  // ← 实际应该从 core 包导入
import { ... } from '@/components/marketing' // ← 触发了错误的导入链
```

---

## ✅ 解决方案

### 1. 移除冗余导出

**文件**: `apps/website/src/components/marketing/index.ts`

**修改**：
```diff
- export { HeroTitle } from './hero-title'
+ // HeroTitle 从 @xorigo-ui/core 导入，不在本地组件中
```

### 2. 修复页面导入

**文件**: `apps/website/app/(marketing)/page2/page.tsx`

**修改**：
```diff
- import { SuperParticleSystem, HeroTitle } from '@xorigo-ui/core'
+ import { SuperParticleSystem } from '@xorigo-ui/core'
```

**临时方案**：
```typescript
// 用简单的渐变标题替换 HeroTitle
<motion.h1
  className="text-7xl md:text-8xl lg:text-9xl font-bold mb-12 bg-gradient-to-r from-[var(--color-primary-500)] via-[var(--color-accent-500)] to-[var(--color-info-500)] bg-clip-text text-transparent"
>
  Xorigo UI
</motion.h1>
```

### 3. 验证修复

**步骤**：
1. Docker 热更新自动重新编译
2. 等待 5 秒后检查日志
3. 验证 HTTP 状态码

**命令**：
```bash
sleep 5 && docker logs xorigo-ui-website-dev --tail 30 | grep "Compiled"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/page2
```

**结果**：
- ✅ 编译成功
- ✅ HTTP 200

---

## 📚 经验总结

### 关键教训

1. **导入链错误难以追踪**：
   - Next.js 的错误信息会显示完整的导入链
   - 从错误堆栈底部向上追踪最有效

2. **容器路径映射**：
   - 容器内路径 `/app/...` 需要映射到宿主机路径
   - 诊断时需要在宿主机文件系统中定位

3. **Docker 环境复杂性**：
   - 热更新环境增加了诊断难度
   - 需要区分容器内和宿主机的状态

4. **index.ts 重导出风险**：
   - `index.ts` 文件中的错误导出会传播到所有引用者
   - 应该定期检查导出的文件是否真实存在

### 预防措施

1. **编写 lint 规则**：
   - 检查 `index.ts` 中导出的文件是否存在
   - 防止类似问题再次发生

2. **增强错误诊断**：
   - 解析导入链错误
   - 提供容器路径映射
   - 自动建议修复方案

3. **健康检查增强**：
   - 监控容器健康状态
   - 检测编译错误
   - 提供诊断建议

---

## 🚀 Agent 优化成果

### 新增功能

#### 1. 增强的健康检查

**功能**：
- ✅ Docker 运行状态
- ✅ 容器运行状态
- ✅ 容器健康状态（healthy/unhealthy）
- ✅ 编译状态（success/error/unknown）
- ✅ 错误和警告分析
- ✅ 智能修复建议

**使用**：
```typescript
const health = await devServerAgent.healthCheck()
console.log(health.recommendations)
```

#### 2. 智能诊断编译错误

**功能**：
- ✅ 解析 Next.js 编译错误
- ✅ 识别导入链错误
- ✅ 检测文件缺失
- ✅ TypeScript 错误分析
- ✅ 容器路径映射
- ✅ 自动修复建议

**使用**：
```typescript
const diagnosis = await devServerAgent.diagnoseCompilationErrors()
```

**输出示例**：
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
      5. 检查组件目录结构是否正确

============================================================
```

#### 3. Monorepo 包依赖检查

**功能**：
- ✅ 检查包构建状态
- ✅ 验证容器内包同步
- ✅ 自动构建缺失的包
- ✅ 检测包依赖问题

**使用**：
```typescript
// 检查包状态
const status = await devServerAgent.checkMonorepoPackages()

// 自动修复
const result = await devServerAgent.fixMonorepoPackages()
```

### 支持的错误类型

| 错误类型 | 描述 | 处理器 |
|---------|------|--------|
| `import-chain` | 导入链错误 | `suggestImportChainFix` |
| `missing-file` | 文件缺失 | `suggestMissingFileFix` |
| `typescript` | TypeScript 编译错误 | `suggestTypeScriptFix` |
| `compilation` | 通用编译错误 | `suggestGeneralFix` |

### TypeScript 错误支持

| 错误代码 | 描述 | 建议 |
|---------|------|------|
| TS2307 | 模块未找到 | 检查导入路径、确认包已安装 |
| TS2503 | 找不到命名空间 | 添加类型声明、检查 tsconfig.json |
| TS2604 | JSX 元素类型错误 | 检查组件类型定义、使用 React.ElementType |
| TS2786 | JSX 组件使用错误 | 检查组件签名、确认 Props 类型 |

---

## 📝 最佳实践

### Docker 开发环境

1. **始终使用 Docker 热更新容器**：
   - ✅ `npm run docker:dev`
   - ❌ `npm run dev`

2. **定期检查容器健康**：
   ```bash
   docker ps | grep xorigo
   ```

3. **查看容器日志诊断问题**：
   ```bash
   docker logs xorigo-ui-website-dev --tail 100
   ```

### 错误诊断流程

1. **检查容器状态**：
   ```typescript
   const health = await devServerAgent.healthCheck()
   ```

2. **诊断编译错误**：
   ```typescript
   const diagnosis = await devServerAgent.diagnoseCompilationErrors()
   ```

3. **检查包依赖**：
   ```typescript
   const packages = await devServerAgent.checkMonorepoPackages()
   ```

4. **自动修复**：
   ```typescript
   await devServerAgent.fixMonorepoPackages()
   ```

### 文件组织

1. **index.ts 重导出**：
   - 只导出真实存在的文件
   - 添加注释说明导出来源
   - 定期检查导出的有效性

2. **导入路径**：
   - 使用绝对路径别名（`@/components`）
   - 明确区分本地组件和包组件
   - 避免循环依赖

---

## 🔧 相关文件

- **Agent 实现**: `.claude/agents/dev-server-agent.ts`
- **问题文件**: `apps/website/src/components/marketing/index.ts`
- **页面文件**: `apps/website/app/(marketing)/page2/page.tsx`
- **配置文件**: `docker-compose.dev.monorepo.yml`

---

**更新日期**: 2025-10-20
**维护者**: Xorigo UI Team
