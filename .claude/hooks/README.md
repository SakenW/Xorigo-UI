# 🎵📢 Xorigo UI 通知系统

Xorigo UI 项目专用的声音提醒和飞书通知系统，为开发过程提供即时反馈。

## 📋 目录

- [系统概述](#系统概述)
- [组件结构](#组件结构)
- [功能特性](#功能特性)
- [配置说明](#配置说明)
- [使用方法](#使用方法)
- [测试指南](#测试指南)
- [故障排除](#故障排除)

## 🎯 系统概述

### 核心功能
- **🔊 音效反馈**：根据 Todo 任务状态自动播放不同的音效
- **📢 飞书通知**：发送结构化的任务进度卡片到飞书群聊
- **🎨 Xorigo UI 定制**：专门针对 Xorigo UI 组件库开发场景优化

### 设计理念
- **自动化**：无需手动操作，TodoWrite 工具触发时自动执行
- **智能化**：根据任务状态智能选择音效和通知样式
- **项目化**：深度集成 Xorigo UI 项目信息和技术栈

## 🏗️ 组件结构

```
.claude/hooks/
├── README.md                              # 本文档
├── test-notifications.py                   # 测试脚本
├── todo-audio-feedback.py                  # 音效反馈 Hook
├── todo-feishu-notification.py             # 飞书通知 Hook
└── components/
    └── audio/
        └── wsl-audio.py                    # 音频播放组件
```

### 文件说明

#### 1. `todo-audio-feedback.py`
- **功能**：分析 Todo 状态并播放对应音效
- **支持音效**：
  - `all_complete`：所有任务完成
  - `task_progress`：任务进行中
  - `todo_update`：任务列表更新
- **环境检测**：自动识别 WSL/Linux 环境

#### 2. `todo-feishu-notification.py`
- **功能**：发送 Xorigo UI 专用的飞书通知卡片
- **特性**：
  - 智能进度条显示
  - 项目信息集成
  - 美观的卡片设计
  - 状态分析

#### 3. `components/audio/wsl-audio.py`
- **功能**：跨平台音频播放组件
- **支持环境**：
  - WSL + Windows PowerShell
  - Linux + ALSA/PulseAudio
  - 终端提示音（备用方案）

## ✨ 功能特性

### 🔊 音效系统
- **智能状态识别**：根据任务完成度自动选择音效
- **跨平台支持**：WSL 和 Linux 环境完美适配
- **静音模式**：支持环境变量控制
- **项目感知**：识别 Xorigo UI 项目并定制描述

### 📢 飞书通知
- **富文本卡片**：支持 Markdown 格式和 Emoji
- **进度可视化**：动态进度条和统计信息
- **项目上下文**：自动包含项目信息和技术栈
- **时间戳**：记录通知发送时间

### 🎨 Xorigo UI 定制
- **项目识别**：自动检测 Xorigo UI 项目
- **技术栈展示**：React 19 + TypeScript 5.9 + Tailwind CSS 4 + Framer Motion 12
- **组件开发场景**：针对组件库开发任务优化
- **品牌一致性**：统一的视觉风格

## ⚙️ 配置说明

### 环境变量

#### 音效控制
```bash
# 全局音频开关（默认：true）
export CLAUDE_GLOBAL_AUDIO_ENABLED=true

# Xorigo UI 项目音频开关（默认：true）
export XORIGO_AUDIO_ENABLED=true
```

#### 飞书通知控制
```bash
# 全局飞书开关（默认：true）
export CLAUDE_LARK_ENABLED=true

# Xorigo UI 项目飞书开关（默认：true）
export XORIGO_FEISHU_ENABLED=true

# 飞书应用配置
export LARK_APP_ID="your_app_id"
export LARK_APP_SECRET="your_app_secret"
export LARK_DEFAULT_CHAT_ID="your_chat_id"
export LARK_DOMAIN="https://open.feishu.cn"
```

### Hook 配置

在 `.claude/settings.json` 中已自动配置：

```json
{
  "name": "todo-audio-feedback",
  "description": "Xorigo UI Todo音效反馈系统",
  "matcher": {"tool": "TodoWrite"},
  "hooks": [
    {
      "type": "command",
      "command": "cat | python3 .claude/hooks/todo-audio-feedback.py",
      "enabled": true,
      "timeout": 5000,
      "runSync": true,
      "errorBehavior": "ignore"
    }
  ]
},
{
  "name": "todo-feishu-notification",
  "description": "Xorigo UI Todo飞书通知系统",
  "matcher": {"tool": "TodoWrite"},
  "hooks": [
    {
      "type": "command",
      "command": "cat | python3 .claude/hooks/todo-feishu-notification.py",
      "enabled": true,
      "timeout": 15000,
      "runSync": false,
      "errorBehavior": "ignore"
    }
  ]
}
```

## 🚀 使用方法

### 自动触发
当使用 TodoWrite 工具时，通知系统会自动触发：

```typescript
// 使用 TodoWrite 工具时，自动触发音效和飞书通知
await TodoWrite({
  todos: [
    { content: "完成 Button 组件开发", status: "completed" },
    { content: "编写 Button 测试用例", status: "in_progress" }
  ]
})
```

### 手动测试
```bash
# 运行完整测试套件
python3 .claude/hooks/test-notifications.py

# 测试音频组件（静音模式）
python3 .claude/hooks/components/audio/wsl-audio.py test_preset "测试音效" --silent
```

### 禁用通知
```bash
# 临时禁用音频
export CLAUDE_GLOBAL_AUDIO_ENABLED=false

# 临时禁用飞书通知
export CLAUDE_LARK_ENABLED=false
```

## 🧪 测试指南

### 运行测试
```bash
# 完整功能测试
python3 .claude/hooks/test-notifications.py
```

### 测试场景
测试脚本会自动验证以下场景：

1. **all_complete**：所有任务完成时的音效和通知
2. **in_progress**：任务进行中的音效和通知
3. **pending**：待处理任务的音效和通知
4. **mixed**：混合状态任务的音效和通知

### 测试结果
- ✅ 12/12 测试通过表示系统工作正常
- ❌ 如果有测试失败，请检查文件权限和依赖

## 🔧 故障排除

### 音效问题

#### 音效没有播放
1. 检查环境变量：
   ```bash
   echo $CLAUDE_GLOBAL_AUDIO_ENABLED
   echo $XORIGO_AUDIO_ENABLED
   ```

2. 检查音频组件：
   ```bash
   python3 .claude/hooks/components/audio/wsl-audio.py test_preset "测试"
   ```

3. 检查系统音频工具：
   ```bash
   # WSL 环境
   which powershell

   # Linux 环境
   which aplay paplay speaker-test
   ```

#### 权限问题
```bash
# 确保脚本有执行权限
chmod +x .claude/hooks/*.py
chmod +x .claude/hooks/components/audio/*.py
```

### 飞书通知问题

#### 通知发送失败
1. 检查飞书配置：
   ```bash
   echo $LARK_APP_ID
   echo $LARK_APP_SECRET
   echo $LARK_DEFAULT_CHAT_ID
   ```

2. 检查网络连接：
   ```bash
   curl -I https://open.feishu.cn
   ```

3. 测试飞书连接：
   ```bash
   python3 .claude/hooks/todo-feishu-notification.py << 'EOF'
   {
     "tool_input": {
       "todos": [
         {"content": "测试任务", "status": "completed"}
       ]
     }
   }
   EOF
   ```

### Hook 配置问题

#### Hook 没有触发
1. 检查 `.claude/settings.json` 配置
2. 确认文件路径正确
3. 查看 Claude Code 日志

#### 脚本执行错误
1. 检查 Python 依赖：
   ```bash
   python3 -c "import json, subprocess, requests, pathlib"
   ```

2. 检查脚本语法：
   ```bash
   python3 -m py_compile .claude/hooks/todo-audio-feedback.py
   python3 -m py_compile .claude/hooks/todo-feishu-notification.py
   ```

## 📊 性能优化

### 音效优化
- **超时设置**：音效播放超时 5 秒
- **错误忽略**：音效失败不影响主流程
- **备用方案**：终端提示音作为最后备用

### 飞书通知优化
- **异步执行**：不阻塞主流程
- **错误处理**：网络异常时优雅降级
- **缓存机制**：访问令牌缓存复用

## 🎨 自定义配置

### 添加新音效
在 `todo-audio-feedback.py` 中的 `analyze_todo_audio_type` 函数中添加新逻辑：

```python
def analyze_todo_audio_type(todo_data):
    # 添加新的状态检测逻辑
    if some_condition:
        return "new_audio_type"
```

### 自定义飞书卡片
在 `todo-feishu-notification.py` 中的 `create_xorigo_card` 函数中修改卡片结构：

```python
def create_xorigo_card(self, todos, analysis):
    # 自定义卡片内容和样式
    card = {
        # 自定义卡片配置
    }
    return card
```

## 🔄 更新日志

### v1.0.0 (2025-10-19)
- ✅ 初始版本发布
- ✅ 音效反馈系统
- ✅ 飞书通知系统
- ✅ Xorigo UI 项目定制
- ✅ 完整测试套件
- ✅ 跨平台支持

## 🤝 贡献指南

### 添加新功能
1. 在对应文件中实现功能
2. 更新测试脚本
3. 更新文档
4. 运行测试验证

### 报告问题
请包含以下信息：
- 操作系统环境
- 错误信息
- 复现步骤
- 相关日志

---

**维护者**：Xorigo UI Team
**版本**：v1.0.0
**更新时间**：2025-10-19