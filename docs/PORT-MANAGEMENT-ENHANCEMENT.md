# 🔧 端口管理增强功能文档

## 📋 功能概述

本次更新为 Xorigo UI 开发环境管理器 (`scripts/dev-env-manager.js`) 添加了智能的端口冲突检测和处理功能，解决了用户反馈的端口管理问题。

## 🎯 核心改进

### 1. ✅ 修复无限循环问题
- **问题**: `LOCAL` 和 `HYBRID` 模式的命令配置错误导致无限递归调用
- **解决方案**: 将命令从 `'local:dev:all'` 更改为 `'concurrently "pnpm dev:core" "pnpm dev:website"'`
- **影响**: 完全解决了脚本无限循环的问题

### 2. 🔍 智能端口冲突检测
- **功能**: 在启动开发服务器前自动检查所需端口的占用情况
- **检测范围**: 核心库端口 3001, Website 端口 3100
- **检测信息**:
  - 端口占用状态
  - 进程PID和命令信息
  - 是否为开发服务器进程

### 3. 🛑 智能进程管理
- **开发服务器识别**: 自动识别 Vite、Next.js、concurrently 等开发服务器进程
- **交互式停止**: 当检测到可停止的开发服务器进程时，询问用户是否停止
- **安全停止**: 优雅停止进程，支持强制终止超时进程
- **进程验证**: 停止后验证端口是否真正释放

### 4. 💬 交互式用户界面
- **清晰的状态显示**: 彩色输出显示端口占用情况
- **用户选择**: 提供是否停止现有开发服务器的选择
- **访问地址显示**: 启动前显示所有服务的访问地址

## 🚀 新增功能详解

### 端口冲突检测逻辑
```javascript
// 检查端口占用情况
function checkPortOccupancy(port) {
  // 获取占用端口的进程信息
  const pid = execSync(`lsof -ti:${port}`, { stdio: 'ignore' }).toString().trim()
  // 获取进程详细信息
  const processInfo = execSync(`ps -p ${pid} -o pid,ppid,cmd --no-headers`, { stdio: 'pipe' })
  // 返回进程信息对象
}

// 智能端口冲突处理
async function handlePortConflicts(requiredPorts, modeName) {
  // 检查所有需要的端口
  // 识别开发服务器进程类型
  // 提供用户选择或自动处理
}
```

### 进程自动停止功能
```javascript
// 停止指定的进程
function stopProcesses(processes) {
  // 优雅停止进程
  execSync(`kill ${process.pid}`, { stdio: 'ignore' })
  // 等待进程结束（最多10次尝试）
  // 必要时强制终止
  execSync(`kill -9 ${process.pid}`, { stdio: 'ignore' })
}
```

## 📊 使用示例

### 场景1: 正常启动（无端口冲突）
```bash
$ node scripts/dev-env-manager.js local

🔍 检查端口占用情况:
==================
  端口 3001: ✅ 空闲 (core)
  端口 3100: ✅ 空闲 (website)

✅ 无端口冲突，可以启动开发服务器

启动: 本地开发模式...
访问地址:
  核心库: http://localhost:3001
  Website: http://localhost:3100
```

### 场景2: 检测到开发服务器进程
```bash
$ node scripts/dev-env-manager.js local

🔍 检查端口占用情况:
==================
  端口 3001: 被占用 (core)
    进程信息: 59684 node vite --port 3001 --host
    检测到开发服务器进程
  端口 3100: 被占用 (website)
    进程信息: 59005 node next dev --port 3100
    检测到开发服务器进程

🛑 发现可以停止的开发服务器进程:
  - core (端口 3001, PID 59684)
  - website (端口 3100, PID 59005)

是否停止现有的开发服务器进程？ [y/N]: y

🛑 停止开发服务器进程:
==================
停止 core (PID 59684)...
  ✅ 已停止
停止 website (PID 59005)...
  ✅ 已停止

✅ 成功停止 2 个进程
```

### 场景3: 检测到非开发服务器进程
```bash
$ node scripts/dev-env-manager.js local

🔍 检查端口占用情况:
==================
  端口 3001: 被占用 (core)
    进程信息: 12345 python -m http.server 3001
    非开发服务器进程

❌ 发现无法停止的进程占用端口:
  - core (端口 3001, PID 12345): python -m http.server 3001

解决方案:
  手动停止进程 12345: kill 12345
```

## 🔧 技术实现细节

### 开发服务器进程识别规则
脚本通过以下命令模式识别开发服务器进程：
- `vite` - Vite 开发服务器
- `next` - Next.js 开发服务器
- `node.*dev` - 通用的开发服务器模式
- `concurrently` - 并发进程管理器

### 端口检测机制
- 使用 `lsof -ti:${port}` 检测端口占用
- 使用 `ps -p ${pid}` 获取进程详细信息
- 支持进程信息解析和分类

### 安全停止机制
- 首先尝试优雅停止 (`kill ${pid}`)
- 等待进程结束（最多10次，每次0.5秒）
- 必要时强制终止 (`kill -9 ${pid}`)

## 🎉 用户体验改进

### 更好的错误提示
- 清晰的端口冲突信息
- 具体的解决方案建议
- 彩色输出提升可读性

### 智能化处理
- 自动识别可停止的进程
- 减少手动操作需求
- 避免盲目终止无关进程

### 完整的状态反馈
- 实时显示检查进度
- 详细的过程信息
- 明确的操作结果

## 🔄 向后兼容性

- ✅ 所有原有命令继续正常工作
- ✅ 交互菜单保持不变
- ✅ 命令行参数支持不变
- ✅ 环境检查功能增强

## 🐛 已知问题

1. **并发进程检测**: 在脚本运行期间，可能有其他进程占用端口，这是正常现象
2. **权限限制**: 需要足够权限停止其他用户的进程
3. **Windows兼容**: 主要优化了Linux/macOS环境，Windows可能需要额外调整

## 📝 使用建议

### 日常开发工作流
1. 使用 `pnpm local:dev` 启动本地开发环境
2. 遇到端口冲突时，按照提示操作
3. 使用 `pnpm local:dev stop` 停止所有服务
4. 使用 `pnpm local:dev status` 检查环境状态

### 故障排除
- 如果端口被无法停止的进程占用，手动执行 `kill <PID>`
- 如果检测不准确，可以查看 `ps aux | grep -E "(vite|next)"` 确认进程
- 重启开发环境前建议先执行停止操作

---

**更新日期**: 2025-10-25
**版本**: v2.0
**作者**: Xorigo UI Team