---
name: "Xorigo UI Docker 开发环境管理器"
description: "专门管理 Xorigo UI 项目的 Docker 开发环境，包括容器启动、健康检查、错误诊断和自动修复"
author: "Xorigo UI Team"
version: "1.0.0"
tags: ["docker", "development", "environment", "troubleshooting", "monorepo"]
---

# Xorigo UI Docker 开发环境管理器

这个 Skill 专门用于管理 Xorigo UI 项目的 Docker 开发环境，确保开发环境的稳定运行。

## 🚨 重要规则：禁止运行 npm run dev

**⚠️ 严格禁止**：本项目使用 Docker 热更新容器进行开发，**严禁在任何情况下运行 `npm run dev` 命令！**

**正确流程**：
- ✅ 启动：`npm run docker:dev`
- ❌ 禁止：`npm run dev`

## 功能特性

### 🐳 Docker 环境管理
- **容器状态监控** - 实时监控容器健康状态
- **热更新管理** - 确保 Docker 热更新正常工作
- **端口冲突检测** - 自动检测和清理端口冲突
- **违规进程清理** - 自动清理 `npm run dev` 等违规进程

### 🔍 智能错误诊断
- **编译错误分析** - 解析 Next.js 编译错误
- **导入链追踪** - 定位导入错误的源头
- **TypeScript 错误** - 提供具体的修复建议
- **容器路径映射** - 自动映射容器内外路径

### 📦 Monorepo 包管理
- **包构建状态** - 检查各个包的构建状态
- **依赖同步** - 确保容器内包依赖同步
- **自动构建** - 自动构建缺失的包
- **版本验证** - 验证包版本兼容性

### 🚀 自动化修复
- **一键启动** - 自动启动完整的开发环境
- **智能重启** - 智能判断是否需要重启容器
- **问题修复** - 自动修复常见开发环境问题
- **配置验证** - 验证 Docker 配置正确性

## 使用方法

对我说：
- "启动 Docker 开发环境"
- "检查开发环境健康状态"
- "诊断编译错误"
- "清理违规进程"
- "重启开发环境"
- "检查容器日志"

## 支持的操作

### 🟢 基础操作

**启动开发环境**：
> "启动 Docker 开发环境"
> "启动开发服务器"
> "npm run docker:dev"

**健康检查**：
> "检查开发环境状态"
> "Docker 容器健康吗"
> "检查端口状态"

**查看日志**：
> "查看容器日志"
> "显示最近的错误"
> "检查编译状态"

### 🔧 故障排除

**诊断编译错误**：
> "诊断编译错误"
> "分析 Next.js 错误"
> "检查导入链问题"

**清理违规进程**：
> "清理违规进程"
> "停止 npm run dev"
> "清理端口冲突"

**重启环境**：
> "重启开发环境"
> "重新构建容器"
> "强制重启"

### 📦 包管理

**检查包状态**：
> "检查 monorepo 包状态"
> "验证 @xorigo-ui/core 构建"
> "包依赖是否正常"

**修复包问题**：
> "修复包依赖"
> "重新构建所有包"
> "同步包到容器"

## 错误诊断能力

### 🎯 编译错误类型

| 错误类型 | 描述 | 自动修复 |
|---------|------|---------|
| **import-chain** | 导入链错误 | ✅ 移除无效导出 |
| **missing-file** | 文件缺失 | ✅ 创建缺失文件 |
| **typescript** | TypeScript 错误 | ✅ 提供修复建议 |
| **compilation** | 通用编译错误 | ✅ 分析并建议 |

### 🔍 智能分析示例

**导入链错误**：
```
❌ 错误: ./src/components/marketing/hero-title.tsx 不存在
📍 导入链: page.tsx → index.ts → hero-title.tsx
🔧 修复: 移除 index.ts 中的无效导出
```

**TypeScript 错误**：
```
❌ 错误: TS2307: Cannot find module '@xorigo-ui/core'
🔧 修复: 构建缺失的包并重启容器
```

**容器状态错误**：
```
❌ 错误: 容器状态 unhealthy
🔧 修复: 检查编译错误并自动修复
```

## 开发环境检查清单

### ✅ 启动前检查
- [ ] Docker 服务运行正常
- [ ] 端口 3100 可用
- [ ] 没有 `npm run dev` 进程
- [ ] docker-compose 文件存在
- [ ] 项目依赖已安装

### ✅ 启动后验证
- [ ] 容器状态 healthy
- [ ] HTTP 200 响应
- [ ] 热更新功能正常
- [ ] 浏览器自动刷新
- [ ] 编译无错误

### ✅ 开发过程监控
- [ ] 定期健康检查
- [ ] 及时清理违规进程
- [ ] 监控容器资源使用
- [ ] 备份重要数据

## 最佳实践

### 🚫 禁止的操作
```bash
# ❌ 绝对禁止这些命令
npm run dev
cd apps/website && npm run dev
yarn dev
pnpm dev
```

### ✅ 推荐的操作
```bash
# ✅ 正确的启动方式
npm run docker:dev

# ✅ 检查容器状态
docker ps | grep xorigo

# ✅ 查看日志
docker logs xorigo-ui-website-dev --tail 50

# ✅ 重启容器
docker-compose -f docker-compose.dev.monorepo.yml restart
```

### 🔧 故障排除流程

1. **遇到问题时**：
   ```
   检查容器状态 → 诊断编译错误 → 修复问题 → 验证修复
   ```

2. **性能问题时**：
   ```
   检查资源使用 → 清理无用容器 → 重启环境 → 监控性能
   ```

3. **包依赖问题时**：
   ```
   检查包构建 → 重新构建包 → 同步到容器 → 验证功能
   ```

## 高级功能

### 📊 性能监控
- **容器资源使用** - CPU、内存、网络使用情况
- **编译性能** - 编译时间和成功率统计
- **热更新效率** - 热更新响应时间分析

### 🔄 自动化操作
- **定时健康检查** - 每 30 分钟自动检查环境状态
- **自动问题修复** - 检测到问题时自动尝试修复
- **智能重启** - 只在必要时重启容器

### 🎛️ 配置管理
- **环境变量配置** - 自动配置开发环境变量
- **端口管理** - 智能分配和管理端口
- **网络配置** - 自动配置 Docker 网络

## 集成工具

### 📝 日志管理
- **结构化日志** - JSON 格式的结构化日志
- **日志级别** - DEBUG、INFO、WARN、ERROR 级别
- **日志轮转** - 自动轮转和清理旧日志

### 📈 监控集成
- **Prometheus 指标** - 导出监控指标
- **Grafana 仪表板** - 可视化监控面板
- **告警通知** - 问题告警通知

### 🔌 IDE 集成
- **VS Code 扩展** - 在编辑器中直接操作
- **命令面板** - 通过命令面板快速操作
- **状态栏显示** - 实时显示环境状态

## 故障排除指南

### 常见问题解决

**Q: 容器启动失败**
```bash
# 检查 Docker 状态
docker --version
docker info

# 清理 Docker 资源
docker system prune -f

# 重新构建
docker-compose -f docker-compose.dev.monorepo.yml up --build
```

**Q: 热更新不工作**
```bash
# 检查文件挂载
docker exec xorigo-ui-website-dev ls -la /app

# 重启容器
docker-compose -f docker-compose.dev.monorepo.yml restart
```

**Q: 端口冲突**
```bash
# 查找占用端口的进程
lsof -i :3100

# 强制清理
pkill -9 -f "npm.*run.*dev"
```

## 配置选项

### Docker 配置
```yaml
# docker-compose.dev.monorepo.yml
services:
  website:
    ports:
      - "3100:3100"    # 开发端口
    volumes:
      - .:/app         # 代码挂载
      - node_modules:/app/node_modules  # 依赖缓存
    environment:
      - NODE_ENV=development
      - WATCH=true     # 启用热更新
```

### Skill 配置
```typescript
const config = {
  port: 3100,
  containerName: 'xorigo-ui-website-dev',
  healthCheckInterval: 30000,
  autoRestart: true,
  logLevel: 'info'
}
```

让我知道你需要进行什么 Docker 环境操作，我会立即帮你管理和维护开发环境！