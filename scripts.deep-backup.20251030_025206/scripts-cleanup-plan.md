# Scripts 目录清理计划

## 📊 当前状态
- **总脚本文件数**: 52个
- **问题**: 重复功能、命名混乱、缺乏分类

## 🗂️ 脚本分类整理

### 🚀 开发环境管理 (保留并合并)
- ✅ `dev-server.sh` (新创建) - 统一开发服务器管理
- 🔄 `dev-env-manager.js` - 与新服务器管理器合并
- ❌ `agent-dev-server.sh` - 功能重复，合并到dev-server.sh
- ❌ `dev-menu.sh` - 功能重复，可删除
- ❌ `dev-docker.sh`, `dev-docker-logs.sh`, `dev-docker-stop.sh` - 合并到docker管理

### 🐳 Docker 管理 (整合)
- ✅ `docker-scripts/` (新建目录)
  - `docker-dev.sh` - 开发环境Docker管理
  - `docker-prod.sh` - 生产环境Docker管理
  - `docker-cleanup.sh` - Docker清理工具

### 🚀 部署脚本 (简化)
- ✅ `deploy/` (新建目录)
  - `deploy.sh` - 主部署脚本
  - `deploy-production.sh` - 生产部署
  - `deploy-simple.sh` - 简化部署
- ❌ 删除重复脚本: `deploy-logs.sh`, `deploy-rebuild.sh`, `deploy-stop.sh`

### 🧪 测试脚本 (分类)
- ✅ `test/` (新建目录)
  - `visual-test-runner.sh` - 视觉测试管理
  - `test-setup.sh` - 测试环境设置
  - `test-cleanup.sh` - 测试清理

### 🔍 检查和分析工具 (整合)
- ✅ `check/` (新建目录)
  - `check-dependencies.sh` - 依赖检查
  - `check-architecture.sh` - 架构一致性检查
  - `check-theme.sh` - 主题问题检查
  - `check-deps.sh` - 与dependencies检查合并

### 🏗️ 构建工具 (保留)
- ✅ `build/` (新建目录)
  - `bundle-analyzer.js`
  - `convert-theme-tokens.ts`

### 📦 包管理 (保留)
- ✅ `package/` (新建目录)
  - `detect-package-manager.sh`
  - `validate-packages.js`

## 🗑️ 需要删除的脚本 (重复/废弃)
1. 所有deploy-*的重复脚本
2. agent相关的重复脚本
3. dev-menu功能重复脚本
4. 过时的check脚本
5. 符号链接文件 (移动到实际位置)

## 📈 整理后的结构
```
scripts/
├── 🚀 dev-server.sh (主开发服务器管理)
├── 🐳 docker/
│   ├── docker-dev.sh
│   ├── docker-prod.sh
│   └── docker-cleanup.sh
├── 🚀 deploy/
│   ├── deploy.sh
│   └── deploy-production.sh
├── 🧪 test/
│   ├── visual-test-runner.sh
│   ├── test-setup.sh
│   └── test-cleanup.sh
├── 🔍 check/
│   ├── check-dependencies.sh
│   ├── check-architecture.sh
│   └── check-theme.sh
├── 🏗️ build/
│   ├── bundle-analyzer.js
│   └── convert-theme-tokens.ts
└── 📦 package/
    ├── detect-package-manager.sh
    └── validate-packages.js
```

## 🎯 预期结果
- **脚本数量**: 从52个减少到约15个
- **功能完整性**: 保持所有必要功能
- **易维护性**: 清晰的分类和命名
- **使用便利性**: 统一的调用方式