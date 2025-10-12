# Xorigo UI 生产环境部署指南

完整的 Docker 生产环境部署配置,采用多阶段构建和 Nginx 服务器。

## 🚀 快速部署

### 方式一: 使用 npm 脚本(推荐)

```bash
# 部署生产环境
npm run deploy

# 查看日志
npm run deploy:logs

# 停止服务
npm run deploy:stop

# 重新构建并部署
npm run deploy:rebuild
```

### 方式二: 使用 Docker Compose

```bash
# 部署
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止
docker-compose down
```

### 方式三: 使用 Shell 脚本

```bash
# 部署
./scripts/deploy.sh

# 查看日志
./scripts/deploy-logs.sh

# 停止
./scripts/deploy-stop.sh

# 重新构建
./scripts/deploy-rebuild.sh
```

## 📍 访问地址

生产环境启动后,访问 **http://localhost:3100**

## 🏗️ 架构说明

### 多阶段构建

#### Stage 1: Builder (构建阶段)
- 基于 Node.js 22 Alpine
- 安装依赖并构建应用
- 生成优化的生产构建产物

#### Stage 2: Production (生产阶段)
- 基于 Nginx Alpine (轻量级)
- 复制构建产物到 Nginx
- 配置 Nginx 服务器
- 最终镜像大小 ~50MB

### 优势
✅ 镜像体积小 (仅包含构建产物和 Nginx)
✅ 安全性高 (不包含源代码和开发依赖)
✅ 性能优异 (Nginx 静态文件服务)
✅ 生产就绪 (包含健康检查和日志)

## 📋 配置文件说明

### Dockerfile
生产环境多阶段构建配置:
- 第一阶段: 构建应用
- 第二阶段: Nginx 服务器
- 健康检查: `/health` 端点
- 端口: 3100

### docker-compose.yml
生产环境 Docker Compose 配置:
- 容器名: `xorigo-ui-prod`
- 自动重启: `unless-stopped`
- 健康检查: 30s 间隔
- 标签: 版本和描述信息

### nginx.conf
Nginx 主配置:
- 性能优化 (sendfile, tcp_nopush)
- Gzip 压缩 (6级压缩)
- 安全头 (XSS, Frame, Content-Type)
- 日志配置

### nginx-default.conf
虚拟主机配置:
- 监听端口: 3100
- 静态资源缓存: 1年
- SPA 路由支持: try_files
- 健康检查端点: `/health`
- API 代理示例(已注释)

## 🔧 Nginx 配置详解

### 性能优化

```nginx
# Gzip 压缩
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css application/javascript ...;

# 静态资源缓存
location ~* \.(js|css|png|jpg|...) {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### SPA 路由支持

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

所有未匹配的路由都会返回 `index.html`,支持前端路由。

### 健康检查

```nginx
location /health {
    return 200 "healthy\n";
}
```

Docker 通过此端点检查服务健康状态。

### API 代理(可选)

如需代理后端 API,取消注释并配置:

```nginx
location /api {
    proxy_pass http://backend:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## 🛠️ 常用命令

### 部署相关

```bash
# 查看容器状态
docker ps

# 查看容器详细信息
docker inspect xorigo-ui-prod

# 进入容器
docker exec -it xorigo-ui-prod sh

# 查看 Nginx 配置
docker exec xorigo-ui-prod cat /etc/nginx/nginx.conf

# 重载 Nginx 配置
docker exec xorigo-ui-prod nginx -s reload

# 测试 Nginx 配置
docker exec xorigo-ui-prod nginx -t
```

### 日志查看

```bash
# 实时日志
docker-compose logs -f

# 最近100行
docker-compose logs --tail=100

# Nginx 访问日志
docker exec xorigo-ui-prod tail -f /var/log/nginx/access.log

# Nginx 错误日志
docker exec xorigo-ui-prod tail -f /var/log/nginx/error.log
```

### 镜像管理

```bash
# 查看镜像
docker images | grep xorigo-ui

# 删除旧镜像
docker image prune -f

# 查看镜像大小
docker images xorigo-ui-prod --format "{{.Size}}"
```

## 📊 监控与健康检查

### 健康检查配置

```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3100/health"]
  interval: 30s
  timeout: 3s
  retries: 3
  start_period: 10s
```

### 查看健康状态

```bash
# 查看容器健康状态
docker inspect xorigo-ui-prod --format='{{.State.Health.Status}}'

# 查看健康检查日志
docker inspect xorigo-ui-prod --format='{{json .State.Health}}' | jq
```

## 🔒 安全配置

### 安全响应头

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

### 禁止访问隐藏文件

```nginx
location ~ /\. {
    deny all;
}
```

## 🌐 生产环境优化

### 1. 修改端口

编辑 `nginx-default.conf`:

```nginx
server {
    listen 8080;  # 修改为你的端口
    ...
}
```

编辑 `docker-compose.yml`:

```yaml
ports:
  - "8080:8080"  # 主机端口:容器端口
```

### 2. 配置 HTTPS

挂载 SSL 证书并修改 Nginx 配置:

```yaml
volumes:
  - ./ssl:/etc/nginx/ssl:ro
```

```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ...
}
```

### 3. 配置反向代理

修改 `nginx-default.conf`,添加上游服务器:

```nginx
upstream backend {
    server api-server:8080;
}

location /api {
    proxy_pass http://backend;
}
```

### 4. 启用日志持久化

编辑 `docker-compose.yml`:

```yaml
volumes:
  - ./logs:/var/log/nginx
```

### 5. 资源限制

编辑 `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 512M
    reservations:
      cpus: '0.5'
      memory: 256M
```

## 🐛 故障排查

### 容器无法启动

```bash
# 查看容器日志
docker-compose logs

# 检查镜像构建
docker-compose build --no-cache
```

### 健康检查失败

```bash
# 手动测试健康端点
docker exec xorigo-ui-prod wget -O- http://localhost:3100/health

# 检查 Nginx 配置
docker exec xorigo-ui-prod nginx -t
```

### 静态文件无法访问

```bash
# 查看文件是否存在
docker exec xorigo-ui-prod ls -la /usr/share/nginx/html

# 检查权限
docker exec xorigo-ui-prod ls -la /usr/share/nginx/html/index.html
```

### Gzip 压缩未生效

```bash
# 测试 Gzip
curl -H "Accept-Encoding: gzip" -I http://localhost:3100

# 查看响应头
curl -I http://localhost:3100
```

## 📦 CI/CD 集成

### GitHub Actions 示例

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build and Deploy
        run: |
          docker-compose build
          docker-compose up -d

      - name: Health Check
        run: |
          sleep 10
          curl -f http://localhost:3100/health || exit 1
```

### GitLab CI 示例

```yaml
deploy:
  stage: deploy
  script:
    - docker-compose build
    - docker-compose up -d
    - sleep 10
    - curl -f http://localhost:3100/health
  only:
    - main
```

## 🌍 环境变量

当前支持的环境变量:

```yaml
environment:
  - NODE_ENV=production
  - NGINX_PORT=3100
  - API_URL=https://api.example.com
```

在构建时传递环境变量:

```bash
docker-compose build --build-arg API_URL=https://api.example.com
```

## 📈 性能指标

### 镜像大小
- Builder 阶段: ~300MB
- 最终镜像: ~50MB (仅 Nginx + 构建产物)

### 启动时间
- 构建: 30-60秒
- 启动: 3-5秒
- 健康检查就绪: 10秒内

### 资源占用
- CPU: <5% (空闲时)
- 内存: ~50MB

## 💡 最佳实践

1. **定期更新基础镜像**
   ```bash
   docker pull node:22-alpine
   docker pull nginx:alpine
   ```

2. **监控日志大小**
   ```bash
   # 配置日志轮转
   docker exec xorigo-ui-prod du -sh /var/log/nginx/*
   ```

3. **定期清理未使用资源**
   ```bash
   docker system prune -a
   ```

4. **使用 .dockerignore**
   减少构建上下文大小,加快构建速度

5. **版本标签管理**
   ```bash
   docker tag xorigo-ui-prod:latest xorigo-ui-prod:v0.1.0
   ```

## 📚 相关文档

- [Docker 多阶段构建](https://docs.docker.com/build/building/multi-stage/)
- [Nginx 配置指南](https://nginx.org/en/docs/)
- [Docker Compose 参考](https://docs.docker.com/compose/compose-file/)
- [容器健康检查](https://docs.docker.com/engine/reference/builder/#healthcheck)
