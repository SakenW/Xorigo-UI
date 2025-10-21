# 🚀 开发服务器代理使用指南

## 概述

开发服务器代理是专门为 Xorigo UI 项目设计的子代理系统，用于管理开发服务器和 Docker 容器操作。该代理确保严格遵循项目约束，杜绝违规操作。

## 🚨 核心约束

### 严格禁止的操作
```bash
# ❌ 绝对禁止的命令
npm run dev
npm run dev:website
yarn dev
pnpm dev
```

### 唯一正确的操作
```bash
# ✅ 唯一正确的命令
npm run docker:dev          # 原始 Docker 脚本
npm run agent:start         # 代理管理的启动方式
```

### 端口规范
- ✅ **正确端口**: `3100` (Docker 热更新容器)
- ❌ **禁用端口**: `3000`, `3001` (npm run dev 默认端口)

## 🛠️ 使用方式

### 1. 通过代理脚本 (推荐)

```bash
# 启动开发环境
npm run agent:start

# 停止开发环境
npm run agent:stop

# 重启开发环境
npm run agent:restart

# 查看实时日志
npm run agent:logs

# 检查环境状态
npm run agent:status

# 检查违规情况
npm run agent:check

# 清理违规进程
npm run agent:cleanup

# 健康检查
npm run agent:health
```

### 2. 直接使用代理脚本

```bash
# 启动开发环境
./scripts/agent-dev-server.sh start

# 查看帮助
./scripts/agent-dev-server.sh help
```

### 3. 通过 TypeScript 代理 (编程方式)

```typescript
import { getDevServer } from '.claude/agents'

// 获取代理实例
const devServer = getDevServer()

// 启动开发环境
await devServer.startDevEnvironment()

// 检查违规情况
const violations = await devServer.checkForViolations()
if (violations.hasViolations) {
  console.log('发现违规:', violations.violations)
  await devServer.cleanupViolatingProcesses()
}

// 查看日志
await devServer.showLogs(true) // 实时日志
```

## 🔍 功能详解

### 违规进程检测

代理会自动检测以下违规情况：

1. **npm run dev 进程**
   ```bash
   # 检测命令
   ps aux | grep -E "npm.*run.*dev|next.*dev"
   ```

2. **端口冲突**
   - 端口 3000, 3001 被占用
   - 非 Docker 容器占用端口 3100

3. **容器状态**
   - Docker 容器是否正常运行
   - 服务是否响应

### 自动清理功能

当检测到违规进程时，代理会执行以下清理操作：

```bash
# 强制终止违规进程 - 更安全的方式
pkill -9 -f "npm.*run.*dev"
pkill -9 -f "next.*dev"
pgrep -f "npm.*run.*dev" | xargs -r kill -9
pgrep -f "next.*dev" | xargs -r kill -9
# 注意：移除了危险的 killall node 命令，避免影响WSL和其他系统进程
```

### 健康监控

代理提供多层次的健康检查：

1. **Docker 状态检查**
2. **容器运行状态**
3. **端口响应性检查**
4. **违规进程检查**

## 📊 命令参考

### agent:start
启动开发环境，包括：
- 检查 Docker 状态
- 清理违规进程
- 停止旧容器
- 构建并启动新容器
- 验证启动成功

### agent:stop
停止开发环境：
- 优雅停止 Docker 容器
- 清理资源

### agent:restart
重启开发环境：
- 停止当前环境
- 等待 2 秒
- 重新启动

### agent:logs
查看容器日志：
```bash
npm run agent:logs          # 静态日志
npm run agent:logs -f       # 实时日志
```

### agent:status
检查环境状态：
- Docker 运行状态
- 容器运行状态
- 端口响应状态
- 违规进程检查

### agent:check
专门检查违规情况：
- npm run dev 进程
- 端口冲突
- 违规进程列表

### agent:cleanup
强制清理违规进程：
- 终止所有 npm run dev 进程
- 清理顽固进程
- 验证清理结果

### agent:health
全面健康检查：
- 所有系统状态检查
- 问题统计
- 健康评分

## 🔧 配置选项

代理可以通过环境变量进行配置：

```bash
# 设置容器名称
export AGENT_CONTAINER_NAME="xorigo-ui-website-dev"

# 设置端口
export AGENT_PORT="3100"

# 设置 Docker Compose 文件
export AGENT_COMPOSE_FILE="docker-compose.dev.monorepo.yml"

# 启用详细输出
export AGENT_VERBOSE="true"
```

## 🚨 故障排除

### 常见问题

**Q: 启动失败，提示 Docker 未运行**
```bash
# 解决方案
# 1. 启动 Docker Desktop
# 2. 确保 WSL2 集成已启用
# 3. 重新运行 agent:start
```

**Q: 端口 3100 被占用**
```bash
# 检查占用情况
lsof -ti:3100 | xargs ps -p

# 清理占用进程
npm run agent:cleanup
```

**Q: 容器启动后无法访问**
```bash
# 检查容器状态
npm run agent:status

# 查看容器日志
npm run agent:logs

# 重启容器
npm run agent:restart
```

**Q: 热更新不工作**
```bash
# 确认使用正确端口
curl -I http://localhost:3100

# 检查文件挂载
docker exec xorigo-ui-website-dev ls -la /app/src
```

### 调试模式

启用详细输出进行调试：

```bash
# 设置调试环境变量
export AGENT_VERBOSE=true

# 运行命令
npm run agent:start
```

### 手动干预

如果代理无法解决问题，可以手动操作：

```bash
# 手动停止所有容器
docker-compose -f docker-compose.dev.monorepo.yml down

# 手动清理进程 - 更安全的方式
pkill -9 -f "npm.*run.*dev"
pkill -9 -f "next.*dev"
# 注意：移除了危险的 killall node 命令，避免影响WSL和其他系统进程

# 手动启动
docker-compose -f docker-compose.dev.monorepo.yml up -d --build
```

## 📋 开发工作流

### 推荐的日常开发流程

1. **开始开发**
   ```bash
   npm run agent:start
   ```

2. **检查状态**
   ```bash
   npm run agent:status
   ```

3. **开发过程中**
   - 修改代码会自动热更新
   - 遇到问题时查看日志：`npm run agent:logs`

4. **结束开发**
   ```bash
   npm run agent:stop
   ```

### 团队协作规范

1. **严禁直接使用 npm run dev**
2. **始终通过代理管理开发环境**
3. **发现违规情况及时清理**
4. **定期检查环境健康状态**

## 🔐 安全考虑

### 进程管理
- 代理使用强制的进程清理机制
- 防止僵尸进程占用资源
- 确保开发环境的一致性

### 端口管理
- 严格管理端口分配
- 防止端口冲突
- 确保服务可访问性

### 容器安全
- 使用专用的开发容器
- 隔离开发环境
- 定期更新基础镜像

## 📈 性能优化

### 启动优化
- 复用 Docker 镜像层
- 并行启动服务
- 智能缓存机制

### 资源管理
- 自动清理无用资源
- 监控内存使用
- 优化容器配置

## 🎯 最佳实践

1. **遵循严格约束**：绝不绕过代理直接操作
2. **定期检查**：开发前先检查环境状态
3. **及时清理**：发现违规立即处理
4. **日志监控**：保持日志查看习惯
5. **团队协作**：确保团队成员都了解约束

---

**维护**: Xorigo UI Team
**版本**: 1.0.0
**更新**: 2025-01-19