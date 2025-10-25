# 🛡️ Claude Code 配置更新说明

## 📋 概述

本文档说明了 Xorigo UI 项目中 `.claude/` 目录下配置文件的更新内容，以及如何与新的混合开发环境协作。

### 🎯 更新目标

- ✅ 支持混合开发环境（本地 + Docker）
- ✅ 保持安全约束和代码质量标准
- ✅ 提供更灵活的开发工作流
- ✅ 避免端口 3000 冲突（为其他库保留）

---

## 🔧 配置文件更新详情

### 1. settings.json 环境变量扩展

#### 新增环境变量
```json
{
  "env": {
    "XORIGO_DOCKER_DEV_PORT": "3100",
    "XORIGO_CORE_DEV_PORT": "3001",      // 新增
    "XORIGO_WEBSITE_DEV_PORT": "3100",   // 新增
    "XORIGO_DEV_MODE": "mixed",          // 新增
  }
}
```

**变量说明**：
- `XORIGO_CORE_DEV_PORT`: 核心库本地开发端口
- `XORIGO_WEBSITE_DEV_PORT`: Website 本地开发端口
- `XORIGO_DEV_MODE`: 当前开发模式（mixed/local/docker）

#### 权限允许列表扩展
```json
{
  "permissions": {
    "allow": [
      // 原有权限...
      "Bash(npm run local:dev:*)",    // 新增
      "Bash(npm run local:dev)",      // 新增
      "Bash(npm run local:dev:all)",  // 新增
      "Bash(npm run dev:core)",       // 新增
      "Bash(npm run dev:website)",    // 新增
    ]
  }
}
```

#### 禁止命令调整
移除了以下过时的禁止命令：
- ~~`Bash(npm run dev:*)`~~
- ~~`Bash(npm run dev)`~~
- ~~`Bash(npm run dev:website)`~~
- ~~`Bash(npm run dev:core)`~~

### 2. validate-bash.py 验证规则优化

#### Hook 文档更新
```python
"""
支持混合开发环境：
- 本地开发模式：允许 npm run local:dev, npm run dev:core, npm run dev:website
- Docker 开发模式：允许通过代理系统的 Docker 命令
- 严格禁止直接运行 npm run dev，必须指定具体模式
"""
```

#### 被禁止命令调整
**仍然禁止**：
- 模糊的 `npm run dev` 命令
- 占用端口 3000 的命令
- 直接的 Docker 操作命令

**新增允许**：
- 明确的本地开发命令
- 环境管理器命令

#### 端口限制优化
```python
# 只检查是否试图使用端口 3000（为其他库保留）
forbidden_port_patterns = [
    r'--port\s+3000',
    r'-p\s+3000',
    r':3000',
    r'localhost:3000',
    r'127\.0\.0\.1:3000'
]
```

#### 错误提示信息更新
```
⚠️ 重要约束:
- ❌ 严禁使用模糊的 npm run dev 命令，必须指定具体模式
- ❌ 严禁直接操作 Docker，必须通过代理系统
- ❌ 严禁使用端口 3000（为其他库保留）
- ✅ 本地开发: npm run local:dev 或 npm run dev:core/website
- ✅ Docker 开发: npm run docker:dev
- ✅ 环境管理: node scripts/dev-env-manager.js
```

### 3. 代码质量检测器配置

现有的代码质量检测规则保持不变：
- ✅ Website 架构规则检查
- ✅ 组件命名规范验证
- ✅ 硬编码颜色值检测
- ✅ TypeScript 文件格式化

---

## 🚀 新的开发工作流

### 1. 本地开发模式（推荐）

#### 启动完整本地环境
```bash
# Claude Code 可以执行此命令
pnpm local:dev

# 等效于
node scripts/dev-env-manager.js local
```

#### 分别启动服务
```bash
# 仅启动核心库
pnpm dev:core

# 仅启动 Website
pnpm dev:website

# 等效命令
pnpm local:dev:core
pnpm local:dev:website
```

#### 访问地址
- 核心库开发服务器：http://localhost:3001
- Website 开发服务器：http://localhost:3100

### 2. Docker 开发模式

#### Docker 核心库模式
```bash
# Claude Code 可以执行此命令
pnpm docker:dev
```

#### Docker 完整模式
```bash
# Claude Code 可以执行此命令
pnpm docker:dev:monorepo
```

#### 访问地址
- Docker 容器：http://localhost:3100

### 3. 智能环境管理

#### 交互式环境管理器
```bash
# Claude Code 可以执行此命令
node scripts/dev-env-manager.js

# 或使用选项
node scripts/dev-env-manager.js local
node scripts/dev-env-manager.js docker-core
node scripts/dev-env-manager.js status
```

#### 环境检查
```bash
# Claude Code 可以执行此命令
pnpm local:dev:check
```

---

## 🛡️ 安全约束和最佳实践

### 保持的安全约束

1. **Docker 操作安全**
   - ❌ 仍然禁止直接 Docker 命令
   - ✅ 必须通过代理系统（npm scripts）

2. **端口管理**
   - ❌ 严禁占用端口 3000
   - ✅ 核心库使用端口 3001
   - ✅ Website 使用端口 3100

3. **命令明确性**
   - ❌ 严禁模糊的 `npm run dev`
   - ✅ 必须指定具体的开发模式

### 代码质量保证

1. **自动检测**
   - 文件编辑时自动触发代码质量检测
   - 实时反馈架构规则和命名规范问题

2. **类型安全**
   - TypeScript 文件自动格式化
   - 编译错误及时发现

3. **架构合规**
   - Website 组件导入规则检查
   - 组件库命名规范验证

---

## 🔍 故障排除

### 常见问题

#### 1. 命令被禁止
```
🚨 命令被禁止！
原因: 检测到被禁止的命令: npm run dev
```

**解决方案**：
```bash
# 使用明确的命令
pnpm local:dev          # 本地开发
pnpm docker:dev         # Docker 开发
pnpm dev:core          # 仅核心库
pnpm dev:website       # 仅 Website
```

#### 2. 端口冲突
```
原因: 检测到试图使用被禁止的端口 3000
```

**解决方案**：
- 检查是否有其他服务占用端口 3000
- 使用正确的端口：核心库 3001，Website 3100

#### 3. Docker 命令被禁止
```
原因: 检测到被禁止的 Docker 命令: docker-compose up
```

**解决方案**：
```bash
# 使用代理命令
pnpm docker:dev
pnpm docker:dev:monorepo
```

### 调试技巧

#### 1. 检查环境状态
```bash
node scripts/dev-env-manager.js status
```

#### 2. 验证端口可用性
```bash
lsof -ti:3000  # 检查端口 3000 是否被占用
lsof -ti:3001  # 检查端口 3001 是否被占用
lsof -ti:3100  # 检查端口 3100 是否被占用
```

#### 3. 查看详细错误信息
错误信息会包含具体的违反规则和建议的正确命令。

---

## 📊 配置文件影响范围

### 直接影响

1. **Claude Code 权限**
   - 可以执行新的本地开发命令
   - 保持 Docker 安全约束
   - 维护代码质量标准

2. **开发工作流**
   - 支持混合开发模式
   - 提供更灵活的启动选项
   - 保持向后兼容性

3. **错误处理**
   - 更清晰的错误提示
   - 更好的用户指导
   - 更快的问题定位

### 间接影响

1. **开发体验**
   - 更快的本地开发启动
   - 更好的调试体验
   - 更灵活的环境选择

2. **团队协作**
   - 统一的开发环境管理
   - 一致的命令使用规范
   - 清晰的文档指导

3. **项目维护**
   - 保持代码质量标准
   - 减少环境配置问题
   - 提高开发效率

---

## 🎯 总结

.claude 配置文件的更新成功实现了以下目标：

✅ **灵活性提升**：支持本地和 Docker 两种开发模式
✅ **安全性保持**：维护所有安全约束和质量标准
✅ **用户体验**：提供清晰的错误提示和使用指导
✅ **向后兼容**：现有工作流继续正常工作
✅ **端口管理**：避免端口 3000 冲突，为其他库让路

### 推荐使用方式

1. **日常开发**：使用 `pnpm local:dev` 进行本地开发
2. **团队协作**：使用 `pnpm docker:dev` 确保环境一致
3. **环境管理**：使用 `node scripts/dev-env-manager.js` 智能切换
4. **问题排查**：查看错误提示中的具体建议

---

**维护者**：Xorigo UI Team
**更新日期**：2025-01-25
**版本**：1.0.0
**相关文档**：[DEV-ENVIRONMENT.md](../DEV-ENVIRONMENT.md)