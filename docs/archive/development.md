# TH-UI Docker 开发环境

支持热更新的 Docker 开发环境配置。

## 🚀 快速开始

### 方式一: 使用 npm 脚本(推荐)

```bash
# 启动开发环境
npm run docker:dev

# 查看日志
npm run docker:logs

# 停止开发环境
npm run docker:stop
```

### 方式二: 使用 Docker Compose

```bash
# 启动开发环境
docker-compose -f docker-compose.dev.yml up -d

# 查看日志
docker-compose -f docker-compose.dev.yml logs -f

# 停止开发环境
docker-compose -f docker-compose.dev.yml down
```

### 方式三: 使用 Shell 脚本

```bash
# 启动开发环境
./scripts/dev-docker.sh

# 查看日志
./scripts/dev-docker-logs.sh

# 停止开发环境
./scripts/dev-docker-stop.sh
```

## 📍 访问地址

开发环境启动后,访问 **http://localhost:3100**

## 🔥 热更新

以下文件或目录的修改会自动触发热更新:

- `src/` - 源代码
- `public/` - 静态资源
- `index.html` - HTML 入口
- `vite.config.ts` - Vite 配置
- `tailwind.config.ts` - Tailwind 配置
- `tsconfig.json` - TypeScript 配置
- `postcss.config.js` - PostCSS 配置

## 📋 Docker 文件说明

### Dockerfile.dev
开发环境 Dockerfile,基于 Node.js 22 Alpine,安装依赖并启动 Vite 开发服务器。

### docker-compose.dev.yml
Docker Compose 配置文件:
- 容器名: `th-ui-dev`
- 端口映射: `3100:3100`
- 卷挂载: 源代码目录映射以支持热更新
- 网络: `th-ui-network`

### .dockerignore
排除不需要复制到容器的文件:
- `node_modules`
- `dist`
- `.git`
- 开发工具配置
- 文档文件

## 🛠️ 常用命令

```bash
# 重新构建镜像
docker-compose -f docker-compose.dev.yml build

# 查看容器状态
docker ps

# 进入容器 Shell
docker exec -it th-ui-dev sh

# 查看容器日志(最后100行)
docker-compose -f docker-compose.dev.yml logs --tail=100

# 完全清理(删除容器、镜像、卷)
docker-compose -f docker-compose.dev.yml down -v
docker rmi th-ui-dev
```

## 🐛 故障排查

### 端口被占用

如果端口 3100 被占用,修改 `docker-compose.dev.yml`:

```yaml
ports:
  - "3200:3100"  # 使用主机端口 3200
```

### 依赖安装失败

删除容器并重新构建:

```bash
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up -d
```

### 热更新不生效

1. 确认卷挂载是否正确:
   ```bash
   docker inspect th-ui-dev | grep Mounts -A 20
   ```

2. 重启容器:
   ```bash
   docker-compose -f docker-compose.dev.yml restart
   ```

### 查看详细日志

```bash
docker-compose -f docker-compose.dev.yml logs -f --tail=500
```

## 📦 环境变量

当前配置的环境变量:

- `NODE_ENV=development`
- `VITE_HOST=0.0.0.0`
- `VITE_PORT=3100`

在 `docker-compose.dev.yml` 中添加更多环境变量:

```yaml
environment:
  - NODE_ENV=development
  - VITE_HOST=0.0.0.0
  - VITE_PORT=3100
  - CUSTOM_VAR=value
```

## 🔧 自定义配置

### 修改端口

编辑 `docker-compose.dev.yml`:

```yaml
ports:
  - "YOUR_PORT:3100"
```

### 添加额外的卷挂载

编辑 `docker-compose.dev.yml`:

```yaml
volumes:
  - ./src:/app/src
  - ./your-folder:/app/your-folder  # 新增
```

### 使用不同的包管理器

编辑 `Dockerfile.dev`,修改安装命令优先级。

## 💡 提示

1. **性能优化**: Docker Desktop for Windows/Mac 用户可以在设置中增加 CPU 和内存分配
2. **网络问题**: 国内用户可以配置 Docker 镜像加速器
3. **开发体验**: 推荐安装 Docker Desktop 可视化界面管理容器
4. **持久化**: `node_modules` 目录在容器中,主机不需要安装依赖

## 📚 相关文档

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Vite 文档](https://vitejs.dev/)
