# 🚀 Xorigo UI 开发环境使用指南

## 📋 概述

Xorigo UI 现在支持**混合式开发环境**，既保留了 Docker 的一致性保障，又提供了本地开发的高效体验。

### 🎯 核心设计理念

- **本地开发为主**：日常开发使用本地环境，速度快、调试方便
- **Docker 环境为辅**：确保生产环境一致性和团队协作
- **端口智能分配**：避免与其他库冲突，3000端口保留给其他项目
- **一键切换**：智能环境管理器，轻松切换开发模式

## 🚀 快速开始

### 1. 环境检查

```bash
# 检查开发环境是否就绪
pnpm local:dev:check

# 或者使用智能管理器
node scripts/dev-env-manager.js status
```

### 2. 本地开发（推荐）

```bash
# 启动完整本地开发环境
pnpm local:dev

# 或者分别启动
pnpm dev:core          # 核心库开发服务器 (端口 3001)
pnpm dev:website       # Website 开发服务器 (端口 3100)

# 启动所有服务
pnpm local:dev:all
```

### 3. Docker 开发

```bash
# Docker 核心库模式
pnpm docker:dev

# Docker 完整模式
pnpm docker:dev:monorepo

# 查看 Docker 日志
pnpm docker:logs
```

### 4. 智能管理器

```bash
# 启动交互式环境管理器
node scripts/dev-env-manager.js

# 命令行直接启动
node scripts/dev-env-manager.js local
node scripts/dev-env-manager.js docker-core
node scripts/dev-env-manager.js stop
```

## 📊 端口分配

| 端口 | 服务 | 状态 | 说明 |
|------|------|------|------|
| **3000** | 🔒 **保留** | 禁止使用 |
| **3001** | 🚀 核心库开发 | 可用 | Vite 开发服务器 |
| **3002** | 📋 核心库预览 | 可选 | Vite Preview |
| **3100** | 🌐 Website 开发 | 可用 | Next.js 开发服务器 |
| **3101** | 🎨 配方预览 | 可选 | 主题配方展示 |
| **6006** | 📚 Storybook | 可选 | 交互式文档 |
| **6380** | 💾 Redis | 可选 | 缓存服务 |

## 🎛️ 开发模式详解

### 1. 本地开发模式 🌟

**适用场景**：日常开发、功能开发、调试

```bash
# 优势
- ⚡ 启动速度极快 (2-3秒)
- 🔍 调试方便，断点清晰
- 💻 占用资源少，电池友好
- 🎛️ 配置灵活，个性化设置

# 使用方法
pnpm local:dev
# 或
node scripts/dev-env-manager.js local
```

**访问地址**：
- 核心库：http://localhost:3001
- Website：http://localhost:3100

### 2. Docker 核心库模式 🐳

**适用场景**：核心库开发、生产环境验证

```bash
# 优势
- 🎯 环境一致性保障
- 🔄 热更新支持完整
- 👥 团队协作友好
- 🚫 避免本地环境问题

# 使用方法
pnpm docker:dev
# 或
node scripts/dev-env-manager.js docker-core
```

### 3. Docker 完整模式 🐳

**适用场景**：团队协作、CI/CD、演示部署

```bash
# 优势
- 🎯 完全隔离，无环境差异
- 📦 包含完整 Monorepo 环境
- 🎪 集成 Storybook 和配方预览
- 👥 新成员入职快速上手

# 使用方法
pnpm docker:dev:monorepo
# 或
node scripts/dev-env-manager.js docker-monorepo
```

### 4. 混合模式 🔄

**适用场景**：性能要求高、复杂开发场景

```bash
# 优势
- ⚡ 性能最优
- 🎛️ 灵活配置
- 🔄 智能协调

# 使用方法
pnpm local:dev:all
# 或
node scripts/dev-env-manager.js hybrid
```

## 🔧 环境管理

### 环境检查

```bash
# 完整环境检查
node scripts/dev-env-manager.js status

# 检查特定环境
node scripts/check-dev-env.js
```

### 服务管理

```bash
# 停止所有服务
pnpm docker:stop
# 或
node scripts/dev-env-manager.js stop

# 重启服务
pnpm docker:stop && pnpm docker:dev
```

### 端口冲突解决

```bash
# 查找端口占用进程
lsof -ti:3001

# 终止进程
kill -9 <PID>

# 或者使用管理器清理
node scripts/dev-env-manager.js stop
```

## 📱 访问地址

### 开发服务器

| 服务 | 地址 | 说明 |
|------|------|------|
| **核心库开发** | http://localhost:3001 | Vite 开发服务器 |
| **核心库预览** | http://localhost:3002 | Vite Preview |
| **Website** | http://localhost:3100 | Next.js 开发服务器 |
| **配方预览** | http://localhost:3101/recipes | 主题配方展示 |
| **Storybook** | http://localhost:6006 | 交互式文档 |

### 开发工具

- **Vite 开发工具**：http://localhost:3001/__vite_ping
- **Next.js 调试**：浏览器开发者工具
- **VS Code 调试**：F5 或调试面板启动调试

## 🛠️ VS Code 集成

### 调试配置

已预配置调试配置：

1. **本地开发调试**：F5 启动，支持断点调试
2. **Docker 调试**：支持容器内进程调试
3. **测试调试**：Vitest 集成调试
4. **组合启动**：一键启动核心库 + Website

### 任务快捷键

- **Ctrl+Shift+P** → "Tasks: Run Task" → 选择开发任务
- **F5** → 启动调试
- **Ctrl+`** → 打开终端

### 推荐扩展

自动安装推荐扩展：
- **Prettier** - 代码格式化
- **ESLint** - 代码检查
- **Tailwind CSS** - 样式开发
- **Docker** - 容器管理
- **Vitest** - 测试集成

## 🔧 故障排除

### 常见问题

#### 1. 端口被占用

```bash
# 检查端口占用
lsof -ti:3001

# 解决方案 1：终止占用进程
kill -9 <PID>

# 解决方案 2：使用管理器清理
node scripts/dev-env-manager.js stop

# 解决方案 3：更换端口
# 修改 .env 文件中的端口配置
```

#### 2. 依赖安装失败

```bash
# 清理缓存
rm -rf node_modules
rm -rf packages/*/node_modules
rm -rf apps/*/node_modules

# 重新安装
pnpm install
```

#### 3. Docker 启动失败

```bash
# 检查 Docker 状态
docker --version
docker ps

# 重新构建镜像
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up --build

# 清理 Docker 资源
docker system prune -f
```

#### 4. 热更新不工作

```bash
# 检查文件监听
CHOKIDAR_USEPOLLING=true WATCHPACK_POLLING=true

# 检查 Docker 文件挂载
# 确保 volumes 配置正确

# 重启开发服务器
pnpm local:dev
```

### 调试技巧

#### 1. 启用详细日志

```bash
# 环境变量
DEBUG=vite:* node scripts/dev-env-manager.js

# 或者在 package.json 中配置
```

#### 2. 检查网络请求

```bash
# 测试服务可用性
curl http://localhost:3001
curl http://localhost:3100
```

#### 3. 检查构建状态

```bash
# 检查构建产物
ls -la packages/core/dist
ls -la apps/website/.next
```

## 📚 高级配置

### 环境变量配置

复制 `.env.example` 到 `.env` 并自定义：

```bash
cp .env.example .env
```

主要配置项：
- `CORE_DEV_PORT`：核心库开发端口
- `WEBSITE_PORT`：Website 开发端口
- `NODE_ENV`：环境模式
- `DEBUG`：调试日志级别

### Docker 配置优化

1. **资源限制**：调整 Docker 容器内存和CPU 限制
2. **构建缓存**：优化 Docker 镜像构建缓存
3. **网络配置**：自定义 Docker 网络设置

### 性能优化

1. **本地开发**：启用增量构建和热更新
2. **Docker 开发**：优化镜像大小和启动速度
3. **混合模式**：智能负载均衡和资源分配

## 📈 最佳实践

### 日常开发工作流

1. **启动环境**：`pnpm local:dev:check` → `pnpm local:dev`
2. **代码开发**：实时热更新，无需重启
3. **质量检查**：`pnpm lint` + `pnpm type-check`
4. **测试验证**：`pnpm test`
5. **提交代码**：`pnpm lint` → `git commit`

### 团队协作工作流

1. **新成员入职**：使用 Docker 完整模式
2. **功能开发**：切换到对应开发模式
3. **代码审查**：保持环境一致性
4. **部署测试**：使用 Docker 验证

### CI/CD 集成

1. **构建验证**：使用 Docker 确保一致性
2. **测试执行**：集成测试套件
3. **部署发布**：自动化部署流程

---

## 🎉 总结

Xorigo UI 的混合式开发环境为开发者提供了：

✅ **灵活选择**：根据需求选择最适合的开发模式
✅ **性能优化**：本地开发极速，Docker 环境一致
✅ **智能管理**：一键切换，自动检测和修复
✅ **端口安全**：避免冲突，为其他库让路
✅ **工具完善**：VS Code 集成，调试工具齐全

开始使用 `pnpm local:dev` 体验极速本地开发吧！