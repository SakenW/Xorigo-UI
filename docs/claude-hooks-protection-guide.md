# 🛡️ Claude Code Hooks 保护系统

## 概述

本文档描述了为 Xorigo UI 项目配置的 Claude Code Hooks 保护系统，该系统通过 PreToolUse hooks 严格禁止 `npm run dev` 等违规命令，确保只能使用 Docker 热更新容器进行开发。

## 🎯 保护目标

### 核心约束
- ❌ **严禁使用 `npm run dev` 命令**
- ❌ **严禁直接操作 Docker，必须通过代理系统**
- ❌ **严禁使用端口 3000/3001**
- ✅ **必须使用 Docker 热更新容器 (端口 3100)**
- ✅ **只能通过代理系统管理开发环境和 Docker 操作**

### 保护范围
- 所有 Bash 命令执行
- 开发服务器启动命令
- Docker 直接操作命令
- 端口使用控制
- 包管理器 dev 命令

## 🏗️ 系统架构

### Hook 位置
```
.claude/
├── settings.json              # Claude Code 配置
├── hooks/
│   └── validate-bash.py      # 命令验证脚本
└── agents/
    └── dev-server-agent.ts   # 开发服务器代理
```

### 工作流程
```
用户输入命令
        ↓
Claude Code 接收
        ↓
PreToolUse Hook 触发
        ↓
validate-bash.py 验证
        ↓
命令是否允许?
 ├─ 允许 → 继续执行
 └─ 禁止 → 阻止并提示
```

## 🔧 配置详解

### 1. settings.json 配置

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "cat | python3 .claude/hooks/validate-bash.py"
          }
        ]
      }
    ]
  }
}
```

**关键特性**：
- `PreToolUse`: 在工具调用前执行
- `matcher: "Bash"`: 匹配所有 Bash 命令
- 验证脚本通过 stdin 接收命令信息

### 2. 权限配置更新

从 permissions 中移除了 `npm run dev` 的允许权限：

```json
"permissions": {
  "allow": [
    // ... 其他允许的命令
    // "Bash(npm run dev:*)",  // 已移除
    "Bash(npm run docker:dev:*)",  // 保留
    "Bash(./scripts/agent-dev-server.sh:*)"  // 保留
  ]
}
```

## 🧪 验证脚本详解

### validate-bash.py 核心功能

#### 1. 禁止命令检测
```python
forbidden_patterns = [
    r'npm\s+run\s+dev',
    r'npm\s+run\s+dev:website',
    r'yarn\s+dev',
    r'pnpm\s+dev',
    r'npm\s+start',
    r'next\s+dev'
]
```

#### 2. 端口使用检测
```python
forbidden_port_patterns = [
    r'--port\s+3000',
    r'-p\s+3000',
    r':3000',
    r'--port\s+3001',
    r'-p\s+3001',
    r':3001'
]
```

#### 3. 允许命令白名单
```python
allowed_patterns = [
    r'docker-compose.*up',
    r'docker.*run',
    r'npm\s+run\s+docker:dev',
    r'npm\s+run\s+agent:',
    r'\./scripts/agent-dev-server\.sh'
]
```

### 验证逻辑

1. **第一层检查**：是否为明确的禁止命令
2. **第二层检查**：是否试图使用被禁止的端口
3. **第三层检查**：是否为开发服务器相关但非 Docker 命令

## 📊 测试验证

### 被禁止的命令测试

```bash
# 测试 npm run dev
echo '{"command": "npm run dev"}' | python3 .claude/hooks/validate-bash.py
# 结果: ❌ 被阻止

# 测试 yarn dev
echo '{"command": "yarn dev"}' | python3 .claude/hooks/validate-bash.py
# 结果: ❌ 被阻止

# 测试端口 3000
echo '{"command": "npm start -- --port 3000"}' | python3 .claude/hooks/validate-bash.py
# 结果: ❌ 被阻止
```

### 允许的命令测试

```bash
# 测试 Docker 命令
echo '{"command": "npm run docker:dev"}' | python3 .claude/hooks/validate-bash.py
# 结果: ✅ 允许执行

# 测试代理命令
echo '{"command": "npm run agent:start"}' | python3 .claude/hooks/validate-bash.py
# 结果: ✅ 允许执行
```

## 🚨 错误信息示例

当违规命令被阻止时，系统会显示详细的错误信息：

```
🚨 命令被禁止！

原因: 检测到被禁止的命令: npm\s+run\s+dev

⚠️ 重要约束:
- ❌ 严禁使用 npm run dev 命令
- ❌ 严禁使用端口 3000/3001
- ✅ 必须使用 Docker 热更新容器 (端口 3100)
- ✅ 请使用: npm run agent:start 或 npm run docker:dev

📖 参考: docs/dev-server-agent-guide.md

当前命令: npm run dev

建议: 请使用 'npm run agent:start' 启动开发环境
```

## 🔄 Hook 执行机制

### PreToolUse Hook 流程

1. **触发时机**：任何 Bash 工具调用之前
2. **输入数据**：JSON 格式的工具调用信息
3. **验证脚本**：通过 stdin 接收输入
4. **输出格式**：JSON 格式的验证结果
5. **退出码**：
   - `0`: 允许执行
   - `2`: 阻止执行

### JSON 输入格式
```json
{
  "command": "npm run dev",
  "tool_input": {
    "command": "npm run dev"
  }
}
```

### JSON 输出格式
```json
{
  "allowed": false,
  "message": "详细错误信息...",
  "suggestion": "建议的替代方案"
}
```

## 🛠️ 维护和更新

### 添加新的禁止命令

在 `validate-bash.py` 中的 `forbidden_patterns` 数组添加新模式：

```python
forbidden_patterns = [
    r'npm\s+run\s+dev',
    # 新增的禁止模式
    r'new-forbidden-command'
]
```

### 添加新的允许命令

在 `allowed_patterns` 数组添加新模式：

```python
allowed_patterns = [
    r'npm\s+run\s+docker:dev',
    # 新增的允许模式
    r'new-allowed-command'
]
```

### 更新端口限制

修改 `forbidden_port_patterns` 数组：

```python
forbidden_port_patterns = [
    r'--port\s+3000',
    r'--port\s+3001',
    # 新增的禁止端口
    r'--port\s+4000'
]
```

## 🔍 故障排除

### Hook 不生效

1. **检查 Python 脚本权限**：
   ```bash
   chmod +x .claude/hooks/validate-bash.py
   ```

2. **验证 settings.json 配置**：
   ```bash
   cat .claude/settings.json | grep -A 10 PreToolUse
   ```

3. **测试脚本功能**：
   ```bash
   echo '{"command": "npm run dev"}' | python3 .claude/hooks/validate-bash.py
   ```

### 误阻止合法命令

1. **检查命令模式**：验证正则表达式是否过于严格
2. **更新白名单**：将合法命令添加到 `allowed_patterns`
3. **调试模式**：临时添加调试输出查看匹配过程

### 允许了违规命令

1. **检查模式覆盖**：确保违规模式被正确识别
2. **验证正则表达式**：测试模式是否能匹配违规命令
3. **检查执行顺序**：确保验证逻辑按预期执行

## 📋 最佳实践

### 1. 渐进式部署
- 先在测试环境验证 Hook 功能
- 逐步收紧约束规则
- 监控误报情况

### 2. 用户教育
- 提供清晰的错误信息
- 包含替代方案建议
- 指向相关文档

### 3. 规则维护
- 定期审查禁止/允许列表
- 根据项目需求调整规则
- 保持文档同步更新

### 4. 性能考虑
- 优化正则表达式性能
- 避免复杂的验证逻辑
- 缓存常用验证结果

## 🎯 安全考虑

### 1. 多层防护
- Hook 系统作为第一层防护
- 权限配置作为第二层防护
- 用户教育作为第三层防护

### 2. 绕过防护
- Hook 系统无法阻止直接的系统调用
- 需要结合其他安全措施
- 定期审查系统访问权限

### 3. 日志记录
- 记录所有被阻止的命令尝试
- 定期分析违规模式
- 根据需要调整防护策略

## 📈 监控和报告

### 违规命令统计

建议定期检查以下指标：
- 被阻止的命令数量
- 常见的违规模式
- 用户对新规则的适应情况

### 效果评估

- Hook 系统阻止率
- 违规命令减少趋势
- 开发环境一致性改善

---

**维护**: Xorigo UI Team
**版本**: 1.0.0
**更新**: 2025-01-19
**状态**: ✅ 已部署并通过测试