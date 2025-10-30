# Scripts 使用指南

## 🚀 开发服务器管理
```bash
pnpm server:start      # 启动开发服务器
pnpm server:stop       # 停止开发服务器
pnpm server:restart    # 重启开发服务器
pnpm server:status     # 检查服务器状态
pnpm server:cleanup    # 清理所有进程
```

## 🐳 Docker 管理
```bash
bash scripts/docker/docker-manager.sh dev    # 开发环境Docker
bash scripts/docker/docker-manager.sh prod   # 生产环境Docker
bash scripts/docker/docker-manager.sh cleanup # 清理Docker资源
```

## 🧪 测试管理
```bash
bash scripts/test/test-manager.sh visual  # 视觉测试
bash scripts/test/test-manager.sh setup   # 设置测试环境
bash scripts/test/test-manager.sh cleanup # 清理测试环境
```

## 🔍 检查工具
```bash
bash scripts/check/check-dependencies.sh  # 检查依赖
bash scripts/check/check-deps.sh           # 检查包依赖
bash scripts/check/check-theme.js         # 检查主题
```

## 🏗️ 构建工具
```bash
node scripts/build/bundle-analyzer.js      # 包分析
node scripts/build/convert-theme-tokens.ts # 转换主题令牌
```

## 📦 包管理
```bash
bash scripts/package/detect-package-manager.sh # 检测包管理器
node scripts/package/validate-packages.js       # 验证包
```

## 🔧 维护工具
```bash
bash scripts/maintenance/health-check.sh     # 健康检查
bash scripts/maintenance/fix-dependencies.sh # 修复依赖
node scripts/maintenance/fix-theme-access.js  # 修复主题访问
```

## 🤖 自动化
```bash
bash scripts/automation/local-ci.sh    # 本地CI
bash scripts/automation/load-test.sh    # 负载测试
```

## 📊 监控
```bash
node scripts/monitoring/publish-monitor.js # 发布监控
node scripts/monitoring/validate-release.js # 验证发布
```

## 🎨 可视化测试
```bash
bash scripts/update-visual-baselines.sh  # 更新视觉基线
node scripts/visual-test-summary.js     # 测试总结
```

## 📈 架构和文档
```bash
node scripts/generate-arch-diagram.ts   # 生成架构图
node scripts/generate-component-docs.ts # 生成组件文档
```
