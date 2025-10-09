# TH-UI 开发环境说明

## 🚀 快速开始

### 开发模式(支持热更新)

```bash
# 启动开发环境容器
docker-compose -f docker-compose.dev.yml up -d

# 查看日志
docker logs -f th-ui-dev

# 停止开发环境
docker-compose -f docker-compose.dev.yml down
```

**访问地址**: http://localhost:3100

**特性**:
- ✅ 代码热更新 (HMR)
- ✅ 文件修改自动刷新浏览器
- ✅ Volume挂载,无需重建镜像
- ✅ 实时查看组件效果

### 生产模式(静态构建)

```bash
# 启动生产环境容器
docker-compose up -d

# 查看日志
docker logs -f th-ui-prod

# 停止生产环境
docker-compose down
```

**访问地址**: http://localhost:3100

**特性**:
- ✅ 优化的静态资源
- ✅ Nginx服务器
- ✅ 压缩和缓存配置
- ✅ 生产环境性能

## 📁 项目结构

```
TH-UI/
├── demo-site/              # 演示网站
│   ├── components/         # 组件演示(按分类组织)
│   │   ├── forms/         # 表单组件演示
│   │   ├── feedback/      # 反馈组件演示
│   │   ├── data/          # 数据展示组件演示
│   │   └── advanced/      # 高级组件演示
│   ├── pages/             # 页面
│   │   ├── LandingPage.tsx       # 首页
│   │   └── ComponentLibrary.tsx  # 组件库页面
│   ├── index.html         # HTML入口
│   ├── main.tsx           # React入口
│   └── App.tsx            # 路由配置
├── src/                   # 组件库源码
├── Dockerfile             # 生产环境镜像
├── Dockerfile.dev         # 开发环境镜像
├── docker-compose.yml     # 生产环境配置
└── docker-compose.dev.yml # 开发环境配置
```

## 🔧 开发工作流

### 1. 修改组件演示

编辑 `demo-site/components/` 目录下的文件:

```bash
# 修改按钮演示
vim demo-site/components/forms/ButtonDemo.tsx

# 浏览器自动刷新,立即看到效果
```

### 2. 添加新组件演示

```bash
# 创建新组件演示文件
touch demo-site/components/forms/SelectDemo.tsx

# 在 ComponentLibrary.tsx 中导入并使用
# 浏览器自动刷新
```

### 3. 修改组件库源码

```bash
# 修改Button组件
vim src/components/Button.tsx

# 浏览器自动刷新,组件库页面立即更新
```

## 🎨 主题开发

修改主题配置会自动生效:

```bash
# 修改颜色令牌
vim src/tokens/colors.ts

# 修改主题配置
vim src/theme/palettes.ts

# 浏览器自动刷新,主题立即更新
```

## 📝 注意事项

### 开发环境 vs 生产环境

| 功能 | 开发环境 | 生产环境 |
|------|---------|---------|
| 热更新 | ✅ 支持 | ❌ 不支持 |
| Volume挂载 | ✅ 是 | ❌ 否 |
| 构建速度 | 🚀 快速启动 | 🐢 完整构建 |
| 性能优化 | ❌ 否 | ✅ 是 |
| 适用场景 | 开发调试 | 部署上线 |

### 切换环境

```bash
# 从生产切到开发
docker-compose down
docker-compose -f docker-compose.dev.yml up -d

# 从开发切到生产
docker-compose -f docker-compose.dev.yml down
docker-compose up -d --build
```

## 🐛 故障排查

### 热更新不生效

1. 确认使用的是开发环境配置:
   ```bash
   docker ps | grep th-ui-dev
   ```

2. 检查Volume挂载:
   ```bash
   docker inspect th-ui-dev | grep -A 10 "Mounts"
   ```

3. 重启容器:
   ```bash
   docker restart th-ui-dev
   ```

### 页面404错误

检查Vite服务器日志:
```bash
docker logs th-ui-dev
```

### 依赖安装问题

重新构建镜像:
```bash
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d --build
```

## 📚 相关命令

```bash
# 查看容器状态
docker ps

# 查看实时日志
docker logs -f th-ui-dev

# 进入容器
docker exec -it th-ui-dev sh

# 重启容器
docker restart th-ui-dev

# 停止并删除所有容器
docker-compose -f docker-compose.dev.yml down -v
```
