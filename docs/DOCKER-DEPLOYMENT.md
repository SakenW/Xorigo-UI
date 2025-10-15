# 🐳 Xorigo UI Docker 部署指南

## 📌 快速开始

### 开发环境

```bash
# 启动开发环境（热更新，端口 3100）
npm run docker:dev

# 或使用脚本快速重启
./scripts/restart-dev.sh

# 查看日志
docker logs -f xorigo-ui-website-dev
```

**访问地址**: http://localhost:3100

### 生产环境（简化版）

```bash
# 部署生产环境
./scripts/deploy-prod-simple.sh

# 查看日志
docker-compose -f docker-compose.prod.simple.yml logs -f
```

**访问地址**: http://localhost:3100

## 🔧 环境说明

### 开发环境特性
- ✅ **热更新支持**: 代码修改自动重载
- ✅ **完整源码挂载**: 包括 apps 和 packages 目录
- ✅ **调试友好**: 详细的日志输出
- ✅ **快速启动**: 使用缓存加速构建

### 生产环境特性
- ✅ **优化构建**: 使用 Next.js standalone 模式
- ✅ **最小镜像**: 仅包含运行时必要文件
- ✅ **性能优化**: 生产级配置
- ✅ **健康检查**: 自动监控服务状态

## 📁 配置文件说明

### Docker Compose 文件

| 文件 | 用途 | 端口 |
|------|------|------|
| `docker-compose.dev.monorepo.yml` | 开发环境（热更新） | 3100 |
| `docker-compose.prod.simple.yml` | 简化生产环境 | 3100 |
| `docker-compose.prod.yml` | 完整生产环境（含监控） | 3100, 9090, 3001 |

### Dockerfile 文件

| 文件 | 用途 | 特点 |
|------|------|------|
| `apps/website/Dockerfile.dev` | 开发镜像 | 包含开发工具，支持热更新 |
| `apps/website/Dockerfile` | 生产镜像 | 多阶段构建，优化体积 |

## 🚀 常用命令

### 开发环境命令

```bash
# 启动开发环境
docker-compose -f docker-compose.dev.monorepo.yml up -d

# 停止开发环境
docker-compose -f docker-compose.dev.monorepo.yml down

# 重新构建（无缓存）
docker-compose -f docker-compose.dev.monorepo.yml build --no-cache

# 查看容器状态
docker ps | grep xorigo

# 进入容器内部
docker exec -it xorigo-ui-website-dev sh
```

### 生产环境命令

```bash
# 构建生产镜像
docker-compose -f docker-compose.prod.simple.yml build

# 启动生产服务
docker-compose -f docker-compose.prod.simple.yml up -d

# 停止生产服务
docker-compose -f docker-compose.prod.simple.yml down

# 查看生产日志
docker-compose -f docker-compose.prod.simple.yml logs -f
```

## 🔍 故障排除

### 端口冲突

如果遇到端口冲突：

```bash
# 查找占用端口的进程
lsof -i :3100

# 强制停止所有相关进程
pkill -f "npm run dev"
pkill -f "next dev"
```

### 构建失败

如果构建失败：

```bash
# 清理 Docker 缓存
docker system prune -a

# 删除旧镜像
docker rmi xorigo-ui-website:dev xorigo-ui-website:prod

# 重新构建
docker-compose -f [配置文件] build --no-cache
```

### 容器无法启动

检查日志：

```bash
# 查看容器日志
docker logs xorigo-ui-website-dev --tail 100

# 检查容器状态
docker ps -a | grep xorigo

# 检查健康检查
docker inspect xorigo-ui-website-dev | grep -A 10 Health
```

## 📊 资源配置

### 开发环境资源

- **CPU**: 不限制
- **内存**: 不限制
- **磁盘**: 共享宿主机文件系统

### 生产环境资源

- **CPU**:
  - 限制: 1.0 核心
  - 预留: 0.5 核心
- **内存**:
  - 限制: 1GB
  - 预留: 512MB

## 🔐 环境变量

### 开发环境变量

```env
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
PORT=3100
HOSTNAME=0.0.0.0
CHOKIDAR_USEPOLLING=true
WATCHPACK_POLLING=true
FAST_REFRESH=true
```

### 生产环境变量

```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3100
HOSTNAME=0.0.0.0
REDIS_PASSWORD=prod123
```

## 🏗️ 架构说明

### 开发架构

```
宿主机
  ├── apps/website (源码)
  ├── packages (共享包)
  └── Docker 容器
      ├── Node.js 22 Alpine
      ├── Next.js Dev Server
      └── 热更新监听
```

### 生产架构

```
Docker 容器
  ├── Node.js 22 Alpine (精简)
  ├── Next.js Standalone
  ├── 静态资源
  └── Redis 缓存（可选）
```

## ⚠️ 注意事项

1. **禁止使用 `npm run dev`**: 本项目使用 Docker 容器进行开发，不要在宿主机运行开发服务器
2. **端口规范**: 始终使用 3100 端口，避免 3000/3001
3. **缓存清理**: 定期清理 Docker 缓存避免空间占用
4. **日志管理**: 生产环境注意日志文件大小，定期轮转

## 📈 性能优化建议

1. **使用 Docker BuildKit**:
   ```bash
   export DOCKER_BUILDKIT=1
   ```

2. **利用构建缓存**: 合理组织 Dockerfile 层级

3. **多阶段构建**: 生产环境使用多阶段构建减少镜像体积

4. **资源限制**: 合理设置容器资源限制避免影响宿主机

## 🔄 更新历史

- **2025-10-15**: 修复模块导入问题，简化生产部署配置
- **2025-10-15**: 添加快速重启脚本，优化开发体验
- **2025-10-15**: 创建简化版生产配置，移除监控组件

---

**维护者**: Xorigo UI Team
**最后更新**: 2025-10-15