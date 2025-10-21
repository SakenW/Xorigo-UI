---
name: "Xorigo UI 统一 Docker 管理器"
description: "全面管理 Xorigo UI 项目的 Docker 环境，包括容器管理、配置管理、违规监管和健康监控的统一解决方案"
author: "Xorigo UI Team"
version: "2.0.0"
tags: ["docker", "environment", "configuration", "monitoring", "troubleshooting", "monorepo"]
---

# Xorigo UI 统一 Docker 管理器

这是 Xorigo UI 项目的**唯一官方 Docker 管理技能**，整合了所有 Docker 相关功能，提供完整的环境管理解决方案。

## 🚨 重要规则：禁止运行 npm run dev

**⚠️ 严格禁止**：本项目使用 Docker 热更新容器进行开发，**严禁在任何情况下运行 `npm run dev` 命令！**

**正确流程**：
- ✅ 启动：`npm run docker:dev`
- ❌ 禁止：`npm run dev`

## 核心功能模块

### 🐳 容器环境管理
- **容器状态监控** - 实时监控容器健康状态
- **热更新管理** - 确保 Docker 热更新正常工作
- **自动重启** - 智能判断是否需要重启容器
- **一键启动** - 自动启动完整的开发环境

### ⚙️ Docker 配置管理
- **配置文件生成** - 自动生成标准化的 Docker 配置
- **环境变量管理** - 统一管理开发/生产环境变量
- **端口配置** - 智能配置和检测端口使用
- **容器编排** - Docker Compose 配置和管理

### 🚨 违规进程监管
- **违规进程检测** - 实时检测 `npm run dev` 等违规进程
- **自动清理** - 强制清理所有违规开发进程
- **端口冲突解决** - 自动检测和解决端口冲突
- **规则执行** - 严格执行 Docker 开发环境规范

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

### 📊 健康监控和优化
- **资源监控** - 监控容器资源使用情况
- **性能优化** - 提供容器性能优化建议
- **日志分析** - 分析容器日志并识别问题
- **健康检查** - 定期执行容器健康检查

## 使用方法

### 环境启动和管理
对我说：
- "启动 Docker 开发环境"
- "检查 Docker 容器状态"
- "重启 Docker 环境"
- "停止所有容器"

### 问题诊断和修复
对我说：
- "Docker 环境出问题了，帮我诊断"
- "清理所有违规进程"
- "解决端口冲突"
- "检查容器健康状态"

### 配置管理
对我说：
- "生成 Docker 配置文件"
- "检查环境变量配置"
- "验证端口配置"
- "更新 Docker Compose 配置"

## 技术实现

### 违规进程清理算法
```bash
# 🚨 强制清理所有违规进程（最高权限）
pkill -9 -f "npm run dev"
pkill -9 -f "next dev"
pkill -9 -f "node.*next"
sudo killall -9 node 2>/dev/null

# 🔥 彻底清理顽固进程
pgrep -f "npm.*run.*dev" | xargs -r kill -9 2>/dev/null
pgrep -f "next.*dev" | xargs -r kill -9 2>/dev/null

# 🧹 验证清理结果
ps aux | grep -E "(npm.*run.*dev|next.*dev)" | grep -v grep || echo "✅ 所有违规进程已清理"
```

### 端口配置标准
```typescript
// 端口状态检查和配置
interface PortConfiguration {
  port3100: { status: 'occupied', service: 'xorigo-ui-website-dev' }  // Docker 容器
  port3000: { status: 'free', recommendation: '必须保持空闲' }         // 禁用
  port3001: { status: 'free', recommendation: '必须保持空闲' }         // 禁用
}
```

### Docker 配置生成器
```typescript
class DockerConfigGenerator {
  generateDockerCompose(config: DockerConfig): {
    dockerComposeYml: string
    dockerfileDev: string
    dockerfileProd: string
    envFile: string
  } {
    return {
      dockerComposeYml: this.generateComposeYml(config),
      dockerfileDev: this.generateDockerfileDev(config),
      dockerfileProd: this.generateDockerfileProd(config),
      envFile: this.generateEnvFile(config)
    }
  }
}
```

### 容器健康监控
```typescript
interface ContainerHealthStatus {
  containerId: string
  status: 'healthy' | 'unhealthy' | 'stopped'
  uptime: number
  cpuUsage: number
  memoryUsage: number
  lastHealthCheck: Date
  recommendations: string[]
}
```

## 集成的触发条件

这个技能会在以下情况自动触发：

1. **环境启动** - 用户请求启动开发环境
2. **问题检测** - 检测到 Docker 相关问题或错误
3. **配置需求** - 需要管理 Docker 配置
4. **违规操作** - 检测到违规的 `npm run dev` 命令
5. **端口冲突** - 检测到端口占用问题
6. **健康检查** - 定期健康监控检查

## 替代的旧技能

这个统一技能替代了以下重复的旧技能：
- ❌ `xorigo-docker-manager` - Docker 开发环境管理器
- ❌ `xorigo-docker-dev-guardian` - Docker 开发环境监管 Skill
- ❌ `xorigo-docker-config-manager` - Docker 配置管理 Skill

所有这些技能的功能都已整合到当前的统一管理器中，提供更完整、更一致的 Docker 管理体验。

## 验证和测试

使用以下命令验证 Docker 环境状态：
```bash
# ✅ 验证只有 Docker 容器在运行
docker ps | grep xorigo

# ✅ 确认端口状态
curl -I http://localhost:3100  # 应该返回 200
curl -I http://localhost:3000  # 应该无响应
curl -I http://localhost:3001  # 应该无响应

# ✅ 验证没有违规进程
ps aux | grep -E "(npm.*run.*dev|next.*dev)" | grep -v grep || echo "✅ 无违规进程"
```

---

**版本**: 2.0.0 (统一整合版本)
**兼容性**: 替代所有旧的 Docker 相关技能
**维护**: Xorigo UI Team