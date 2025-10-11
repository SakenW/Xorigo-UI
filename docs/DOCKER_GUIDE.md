# Docker 配置使用指南

本项目包含多个Docker配置文件，用于不同的开发和部署场景。

## 配置文件说明

### 1. 生产环境
- **文件**: `docker-compose.yml`
- **用途**: 生产环境部署
- **默认端口**: 3100
- **启动命令**: `docker-compose up -d`

### 2. Vite开发环境
- **文件**: `docker-compose.dev.yml`
- **用途**: Vite开发服务器
- **默认端口**: 5173
- **启动命令**: `docker-compose -f docker-compose.dev.yml up -d`

### 3. Next.js网站开发环境
- **文件**: `docker-compose.website.yml`
- **用途**: Next.js网站开发服务器
- **默认端口**: 3100
- **启动命令**: `docker-compose -f docker-compose.website.yml up -d`

## 环境变量配置

项目使用 `.env.docker` 文件管理环境变量，包括端口配置：

```bash
# 端口配置
PROD_PORT=3100          # 生产环境端口
VITE_DEV_PORT=5173      # Vite开发环境端口
NEXTJS_DEV_PORT=3100    # Next.js开发环境端口
```

### 自定义端口

如果需要自定义端口，可以：

1. 修改 `.env.docker` 文件中的变量值
2. 或者在启动命令中直接指定环境变量：

```bash
# 使用自定义端口启动Vite开发环境
VITE_DEV_PORT=8080 docker-compose -f docker-compose.dev.yml up -d

# 使用自定义端口启动Next.js开发环境
NEXTJS_DEV_PORT=8081 docker-compose -f docker-compose.website.yml up -d
```

## 常用命令

### 启动服务
```bash
# 启动生产环境
docker-compose up -d

# 启动Vite开发环境
docker-compose -f docker-compose.dev.yml up -d

# 启动Next.js开发环境
docker-compose -f docker-compose.website.yml up -d
```

### 停止服务
```bash
# 停止生产环境
docker-compose down

# 停止Vite开发环境
docker-compose -f docker-compose.dev.yml down

# 停止Next.js开发环境
docker-compose -f docker-compose.website.yml down
```

### 查看日志
```bash
# 查看生产环境日志
docker-compose logs -f

# 查看Vite开发环境日志
docker-compose -f docker-compose.dev.yml logs -f

# 查看Next.js开发环境日志
docker-compose -f docker-compose.website.yml logs -f
```

## 注意事项

1. 不同环境使用不同端口，避免冲突：
   - 生产环境: 3100
   - Vite开发环境: 5173
   - Next.js开发环境: 3100

2. 如果需要同时运行多个环境，请确保使用不同的端口。

3. 开发环境已配置卷挂载，支持热更新。

4. 生产环境包含健康检查和自动重启配置。