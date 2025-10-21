# MCP 快速参考卡

## 🎯 当前配置状态 (9/10 ✅)

### 📡 信息搜索 (3个)
- **context7** ✅ 官方文档查询
- **tavily** ✅ 实时网络搜索
- **brave** ❌ 连接失败

### 🎨 开发工具 (4个)
- **magic** ✅ UI 组件生成
- **morphllm** ✅ 批量代码编辑
- **eslint** ✅ 代码质量检查
- **filesystem** ✅ 文件系统管理

### 🧠 分析工具 (2个)
- **sequential-thinking** ✅ 推理分析
- **memory** ✅ 记忆管理

### 🎭 测试工具 (1个)
- **playwright** ✅ 浏览器测试

---

## 🚀 常用工作流

### 🎨 创建新组件
```
🔍 搜索趋势 → 🎨 Magic生成 → ✅ ESLint检查 → 🎭 Playwright测试 → 📁 Filesystem集成
```

### 📊 代码质量提升
```
📁 扫描文件 → ✅ 质量检查 → ⚡ 批量修复 → 🎭 功能验证
```

### 🔬 技术研究
```
🔍 信息搜索 → 🧠 深度分析 → 💾 知识保存
```

---

## 💡 快速命令

### 查看状态
```bash
claude mcp list
```

### 常用示例
- `用 Magic 创建一个开关组件`
- `用 Tavily 搜索 React 19 新特性`
- `用 ESLint 检查代码质量`
- `用 Playwright 测试组件功能`

---

## 🛠️ 配置管理

### 添加服务器
```bash
claude mcp add <name> --scope user -- <command>
```

### 移除服务器
```bash
claude mcp remove <name> --scope user
```

---

**📍 详细文档**: `/docs/MCP-Configuration-Guide.md`
**🕐 更新时间**: 2025-10-21
**📈 成功率**: 90% (9/10 服务器正常)