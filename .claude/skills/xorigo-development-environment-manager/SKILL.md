---
name: "Xorigo UI 开发环境管理器"
description: "基于本地 + Docker 混合开发模式的智能环境管理器，支持多种开发模式协调、进程管理、端口配置和环境健康检查"
author: "Xorigo UI Team"
version: "3.0.0"
tags: ["development", "environment", "local", "docker", "hybrid", "monitoring", "monorepo"]
---

# Xorigo UI 开发环境管理器 🚀

基于 Xorigo UI **本地 + Docker 混合开发模式**的智能环境管理器，支持多种开发模式的协调管理。

## 🎯 推荐开发模式

### ✅ 本地开发模式（推荐）
```bash
# 启动本地混合开发环境（核心库 + Website）
pnpm local:dev

# 或者分别启动
pnpm dev:core     # 核心库开发 (localhost:3001)
pnpm dev:website  # Website开发 (localhost:3100)
```

### 🔧 Docker 模式（可选）
```bash
# Docker 核心库模式
pnpm docker:dev

# Docker 完整模式
pnpm docker:dev:monorepo
```

## 📋 端口分配策略

- **端口 3000**: 保留给用户其他库使用 ⚠️ **不占用**
- **端口 3001**: 核心库开发服务器 ✅ **Vite 热更新**
- **端口 3100**: Website 开发服务器 ✅ **Next.js 热更新**
- **端口 6380**: Redis 开发服务器 ✅ **可选**

## 🛠️ 核心功能模块

### 🏠 本地开发环境管理
- **进程协调**：智能管理 `pnpm dev:core` 和 `pnpm dev:website` 进程
- **端口冲突检测**：自动检测和解决端口占用问题
- **热更新监控**：确保 Vite 和 Next.js 热更新正常工作
- **环境状态检查**：实时监控开发环境健康状态

### 🐳 Docker 环境支持
- **混合模式协调**：本地 + Docker 混合开发环境管理
- **容器状态监控**：Docker 容器健康检查和监控
- **配置管理**：Docker 配置文件生成和维护
- **容器编排**：Docker Compose 环境管理

### 🔍 智能故障诊断
- **进程冲突解决**：自动检测和协调进程冲突
- **端口占用分析**：智能端口分配和冲突解决
- **编译错误诊断**：Next.js 和 Vite 编译错误分析
- **环境同步检查**：确保构建和依赖同步

### 📊 性能监控
- **资源使用监控**：CPU、内存使用情况跟踪
- **启动性能分析**：开发服务器启动时间优化建议
- **热更新性能**：热更新响应时间监控
- **构建性能**：构建时间和效率分析

## 🎮 使用方法

### 启动开发环境
对我说：
- "启动本地开发环境"
- "启动核心库开发服务器"
- "启动 Website 开发服务器"
- "启动混合开发模式"

### 环境状态检查
对我说：
- "检查开发环境状态"
- "检查端口占用情况"
- "诊断开发环境问题"
- "检查热更新是否正常"

### 进程和端口管理
对我说：
- "解决端口冲突"
- "检查开发服务器状态"
- "重启开发环境"
- "清理僵尸进程"

### Docker 支持
对我说：
- "启动 Docker 开发环境"
- "检查 Docker 容器状态"
- "配置 Docker 环境"
- "切换到 Docker 模式"

## 🔧 技术实现

### 智能端口管理算法
```typescript
interface PortManagement {
  scanAvailablePorts(): PortScanResult
  detectPortConflicts(): PortConflict[]
  resolvePortConflicts(conflicts: PortConflict[]): PortResolution
  monitorPortUsage(): PortMonitoringStatus
}

// 端口分配策略
const PORT_ALLOCATION = {
  3000: { reserved: true, purpose: '用户其他库' },
  3001: { service: 'core-dev', technology: 'Vite' },
  3100: { service: 'website-dev', technology: 'Next.js' },
  6380: { service: 'redis-dev', optional: true }
}
```

### 开发模式协调器
```typescript
class DevelopmentModeCoordinator {
  async startLocalDevelopment(): Promise<DevEnvironmentStatus> {
    return {
      coreServer: await this.startCoreServer(),
      websiteServer: await this.startWebsiteServer(),
      portStatus: await this.verifyPortAllocation(),
      healthCheck: await this.performHealthCheck()
    }
  }

  async startDockerHybrid(): Promise<DockerEnvironmentStatus> {
    return {
      dockerContainers: await this.startDockerServices(),
      localServices: await this.coordinateLocalServices(),
      networkStatus: await this.verifyNetworkConnectivity()
    }
  }
}
```

### 环境健康监控
```typescript
interface EnvironmentHealthStatus {
  services: ServiceStatus[]
  ports: PortStatus[]
  performance: PerformanceMetrics
  recommendations: HealthRecommendation[]
}
```

## 🚨 常见问题解决

### 端口冲突解决
```bash
# 🔍 检测端口占用
lsof -i :3001 && echo "端口 3001 被占用" || echo "端口 3001 可用"
lsof -i :3100 && echo "端口 3100 被占用" || echo "端口 3100 可用"

# 🛠️ 智能端口冲突解决
pkill -f "next dev --port 3100"  # 清理 Next.js 进程
pkill -f "vite --port 3001"      # 清理 Vite 进程
```

### 进程协调管理
```bash
# ✅ 协调进程启动（推荐方式）
pnpm local:dev                   # 智能启动本地混合环境
pnpm dev:core & pnpm dev:website # 手动协调启动

# 🔧 进程状态检查
ps aux | grep -E "(vite|next)" | grep -v grep
```

### 环境同步检查
```bash
# 📦 依赖同步检查
pnpm install                     # 确保依赖最新
pnpm build                       # 构建最新版本

# 🔄 热更新验证
curl -I http://localhost:3001    # 验证核心库服务
curl -I http://localhost:3100    # 验证 Website 服务
```

## 🎯 与旧技能的差异

### ❌ 旧技能（已废弃）
- **错误假设**：严格禁止 `npm run dev`，只允许 Docker
- **过时理念**：将本地开发标记为"违规进程"
- **错误分类**：将推荐的开发方式当作问题处理

### ✅ 新技能（当前规范）
- **正确理念**：本地开发优先，Docker 作为可选补充
- **智能协调**：管理而非禁止本地开发进程
- **混合支持**：支持本地 + Docker 混合模式
- **健康导向**：环境健康检查而非违规监管

## 🔄 替代的旧技能

这个新技能替代了以下过时的技能：
- ❌ `xorigo-docker-unified-manager` - 基于错误的开发模式假设
- ❌ 所有基于"禁止本地开发"理念的旧 Docker 技能

## 📈 环境验证命令

```bash
# ✅ 验证本地开发环境
curl -I http://localhost:3001 && echo "✅ 核心库服务正常"
curl -I http://localhost:3100 && echo "✅ Website 服务正常"

# ✅ 验证端口分配正确
lsof -i :3000 || echo "✅ 端口 3000 未被占用"
lsof -i :3001 && echo "✅ 端口 3001 用于核心库"
lsof -i :3100 && echo "✅ 端口 3100 用于 Website"

# ✅ 验证进程健康
ps aux | grep -E "(vite.*3001|next.*3100)" | grep -v grep && echo "✅ 开发进程运行正常"
```

---

**版本**: 3.0.0 (本地优先版本)
**兼容性**: 替代所有基于错误开发模式的旧技能
**维护**: Xorigo UI Team
**理念**: 本地开发优先，Docker 作为增强选项