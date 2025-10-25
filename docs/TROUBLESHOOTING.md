# 🛠️ Xorigo UI 开发环境故障排除指南

本文档提供 Xorigo UI 开发环境常见问题的诊断和解决方案。

## 📋 快速诊断

### 环境检查命令
```bash
# 检查开发环境状态
pnpm local:dev status

# 检查所有端口占用
netstat -tulpn | grep -E ':(3000|3001|3002|3100|6380)'

# 检查 Node.js 和 pnpm 版本
node --version  # 需要 >= 22.0.0
pnpm --version # 需要 >= 9.0.0
```

## 🔧 常见问题与解决方案

### 1. 依赖安装问题

#### 问题：Native binding 错误
**错误信息**：
```
Error: Failed to load native binding
Cannot find module './swc.linux-x64-gnu.node'
```

**解决方案**：
```bash
# 完全清理并重新安装
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install --ignore-scripts
pnpm rebuild

# 如果仍有问题，安装特定的 native 依赖
pnpm add @swc/helpers@latest --filter=@xorigo-ui/core
```

#### 问题：Workspace 依赖错误
**错误信息**：
```
ERR_PNPM_NO_MATCHING_VERSION : No matching version found for @xorigo-ui/tokens
```

**解决方案**：
```bash
# 检查 workspace 配置
cat package.json | grep -A 10 "workspaces"

# 重新安装 workspace 依赖
pnpm install --force

# 验证 workspace 链接
pnpm list --depth=0
```

### 2. 端口占用问题

#### 问题：端口 3000 被占用
**错误信息**：
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决方案**：
```bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程（替换 PID）
kill -9 <PID>

# 或者使用不同端口
export XORIGO_CORE_DEV_PORT=3001
export XORIGO_WEBSITE_DEV_PORT=3100
```

#### 问题：端口冲突检查
**预防措施**：
```bash
# 运行端口检查脚本
node scripts/check-dev-env.js

# 手动检查所有开发端口
for port in 3000 3001 3002 3100 6380; do
  if lsof -i :$port > /dev/null 2>&1; then
    echo "端口 $port 被占用"
    lsof -i :$port
  else
    echo "端口 $port 空闲"
  fi
done
```

### 3. 开发服务器启动问题

#### 问题：无限循环启动
**错误信息**：
```
🚀 直接启动模式: 本地开发模式
启动 本地开发模式...
[重复输出]
```

**原因**：dev-env-manager.js 脚本配置错误导致无限递归

**解决方案**：
```bash
# 检查脚本配置
cat scripts/dev-env-manager.js | grep -A 5 "LOCAL:"

# 临时直接启动服务器
pnpm dev:core &
pnpm dev:website &

# 或者修复配置（确保命令不是 'local:dev'）
```

#### 问题：Next.js 配置警告
**错误信息**：
```
⚠ The config property `experimental.turbo` is deprecated
⚠ Warning: Next.js inferred your workspace root incorrectly
```

**解决方案**：
```bash
# 更新 Next.js 配置
cat apps/website/next.config.js

# 添加正确的配置
echo "module.exports = {
  outputFileTracingRoot: '../../',
  turbopack: process.env.NODE_ENV === 'development'
}" > apps/website/next.config.js
```

### 4. Docker 相关问题

#### 问题：Docker 构建失败
**错误信息**：
```
failed to solve: process "/bin/sh -c pnpm install" didn't complete
```

**解决方案**：
```bash
# 清理 Docker 缓存
docker system prune -a

# 重新构建
docker-compose -f docker-compose.dev.yml up --build

# 检查 Dockerfile 语法
docker build -f Dockerfile.dev .
```

#### 问题：权限问题
**错误信息**：
```
permission denied while trying to connect to Docker daemon
```

**解决方案**：
```bash
# 添加用户到 docker 组
sudo usermod -aG docker $USER

# 重新登录或使用 newgrp
newgrp docker

# 检查 Docker 状态
sudo systemctl status docker
```

### 5. TypeScript 和构建问题

#### 问题：类型错误
**错误信息**：
```
error TS2307: Cannot find module '@xorigo-ui/tokens'
```

**解决方案**：
```bash
# 检查 tsconfig.json 路径映射
cat tsconfig.json | grep -A 10 "paths"

# 重新构建类型声明
pnpm build:types

# 验证模块解析
pnpm --filter @xorigo-ui/core type-check
```

#### 问题：Vite 构建错误
**错误信息**：
```
Unknown option `--workspaces`
```

**解决方案**：
```bash
# 检查 package.json scripts
cat package.json | grep "build:packages"

# 修复构建脚本（使用 pnpm -r 而不是 vite --workspaces）
pnpm -r --if-present build
```

### 6. pnpm 工作空间问题

#### 问题：包管理器冲突
**错误信息**：
```
ERROR This project is configured to use npm
```

**解决方案**：
```bash
# 检查 package.json 中的 packageManager
cat package.json | grep packageManager

# 更新为 pnpm
npm pkg set packageManager=pnpm@9.0.0

# 重新安装
rm -rf node_modules
pnpm install
```

#### 问题：Workspace 链接错误
**错误信息**：
```
ERR_PNPM_WORKSPACE_PACKAGE_NOT_FOUND
```

**解决方案**：
```bash
# 检查 workspace 配置
ls packages/ apps/
cat pnpm-workspace.yaml

# 重新链接 workspace
pnpm install --force
pnpm list --filter=@xorigo-ui/core
```

## 🔄 环境重置步骤

当遇到复杂问题时，可以执行完全重置：

```bash
# 1. 停止所有服务
pkill -f "node.*dev"
pkill -f "next"
pkill -f "vite"

# 2. 清理所有缓存和依赖
pnpm store prune
rm -rf node_modules
rm -rf packages/*/node_modules
rm -rf apps/*/node_modules
rm -rf .next
rm -rf dist
rm -rf pnpm-lock.yaml

# 3. 清理临时文件
find . -name "*.log" -delete
find . -name ".DS_Store" -delete

# 4. 重新安装依赖
pnpm install

# 5. 验证环境
node scripts/check-dev-env.js

# 6. 启动开发环境
pnpm local:dev
```

## 📊 性能优化建议

### 开发环境加速
```bash
# 1. 增加内存限制
export NODE_OPTIONS="--max-old-space-size=4096"

# 2. 使用 SWC 替代 Babel（已在配置中）
# 3. 启用 Vite 的预构建
echo "server.pretransformRequests = true" >> packages/core/vite.config.js

# 4. 优化 Next.js 开发模式
echo "experimental.optimizeCss = true" >> apps/website/next.config.js
```

### Docker 性能优化
```bash
# 1. 使用 bind mount 而不是 volume
# 2. 启用 Docker BuildKit
export DOCKER_BUILDKIT=1

# 3. 使用多阶段构建
docker build --target=development .
```

## 🆘 获取帮助

### 命令行帮助
```bash
# 开发环境管理器帮助
node scripts/dev-env-manager.js help

# 检查环境状态
node scripts/dev-env-manager.js status

# 停止所有服务
node scripts/dev-env-manager.js stop
```

### 日志和调试
```bash
# 查看详细日志
pnpm local:dev --verbose

# 调试模式
DEBUG=* pnpm local:dev

# 检查配置
cat .env.example
cat package.json | grep -A 20 "scripts"
```

### 常用调试端口
- **核心库开发**: http://localhost:3001
- **Website 开发**: http://localhost:3100
- **Storybook**: http://localhost:6006
- **配方预览**: http://localhost:3101/recipes

## 📝 问题报告模板

如果遇到新问题，请使用以下模板报告：

```markdown
## 问题描述
[简要描述遇到的问题]

## 环境信息
- OS: [Linux/macOS/Windows]
- Node.js: [版本]
- pnpm: [版本]
- 浏览器: [浏览器和版本]

## 错误信息
```
[粘贴完整的错误输出]
```

## 重现步骤
1. 运行 [命令]
2. 执行 [操作]
3. 观察 [结果]

## 期望行为
[描述期望的正确行为]

## 尝试的解决方案
[列出已经尝试的解决方法]
```

---

**最后更新**: 2025-10-25
**维护者**: Xorigo UI Team