# 在线代码编译 API - 快速开始指南

## 🚀 5 分钟快速开始

### 第一步：启动开发服务器

```bash
cd /home/saken/project/Xorigo UI/apps/website
npm run dev
```

服务器将在 `http://localhost:3000` 启动。

### 第二步：测试 API 可用性

```bash
# GET 请求 - 查看 API 信息
curl http://localhost:3000/api/compile

# 应该返回 API 使用说明 JSON
```

### 第三步：第一次编译请求

```bash
# POST 请求 - 编译 TypeScript 代码
curl -X POST http://localhost:3000/api/compile \
  -H "Content-Type: application/json" \
  -d '{
    "code": "const greeting: string = \"Hello, Xorigo UI!\"; console.log(greeting);",
    "config": {
      "loader": "ts",
      "target": "es2020"
    }
  }'
```

**期望响应**:
```json
{
  "success": true,
  "code": "const greeting = \"Hello, Xorigo UI!\";\nconsole.log(greeting);\n"
}
```

### 第四步：使用测试脚本

```bash
# 运行完整测试套件
cd /home/saken/project/Xorigo UI/apps/website
./test-compile-api.sh
```

---

## 📌 核心 API 端点

### `POST /api/compile` - 编译代码

**最简请求**:
```json
{
  "code": "const x = 1;"
}
```

**完整请求**:
```json
{
  "code": "const greeting: string = 'Hello';",
  "config": {
    "loader": "ts",
    "target": "es2020",
    "minify": false,
    "sourcemap": false
  }
}
```

**成功响应**:
```json
{
  "success": true,
  "code": "const greeting = 'Hello';\n",
  "warnings": []
}
```

**失败响应**:
```json
{
  "success": false,
  "error": "编译失败",
  "details": "Unexpected token"
}
```

---

## 🎯 常见使用场景

### 场景 1: 基础 TypeScript 编译

```typescript
const response = await fetch('/api/compile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: 'const x: number = 1; console.log(x);'
  })
})
const result = await response.json()
```

### 场景 2: React 组件编译

```typescript
const response = await fetch('/api/compile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: `
      import React from 'react';
      export const Button = () => <button>Click</button>;
    `,
    config: { loader: 'tsx' }
  })
})
```

### 场景 3: 代码压缩

```typescript
const response = await fetch('/api/compile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: 'const longVar = 123; console.log(longVar);',
    config: { minify: true }
  })
})
```

---

## ⚠️ 常见错误和解决方法

### 错误 1: 代码长度超限
```json
{
  "success": false,
  "error": "请求参数验证失败",
  "details": "code: 代码长度不能超过 10KB"
}
```
**解决**: 减少代码长度至 10,000 字符以内

### 错误 2: 语法错误
```json
{
  "success": false,
  "error": "编译失败",
  "details": "Expected ';' but found 'eof'"
}
```
**解决**: 检查代码语法，修复错误

### 错误 3: 禁止的模块
```json
{
  "success": false,
  "error": "代码包含不允许的模块或操作",
  "details": "出于安全考虑，禁止使用 Node.js 内置模块"
}
```
**解决**: 移除 `fs`、`child_process` 等禁止模块的导入

---

## 📂 项目文件位置

```
apps/website/
├── src/
│   ├── app/
│   │   └── api/
│   │       └── compile/
│   │           ├── route.ts          ← API 核心逻辑
│   │           ├── types.ts          ← TypeScript 类型
│   │           └── README.md         ← 详细文档
│   └── components/
│       └── CodeCompiler.tsx          ← React 客户端组件
├── test-compile-api.sh               ← 测试脚本
└── COMPILE_API_SUMMARY.md            ← 实现总结
```

---

## 🔧 配置选项速查

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `loader` | `'tsx' \| 'ts' \| 'jsx' \| 'js'` | `'tsx'` | 代码类型 |
| `target` | `'es2020' \| 'esnext' \| 'es2015'` | `'es2020'` | 编译目标 |
| `minify` | `boolean` | `false` | 是否压缩 |
| `sourcemap` | `boolean` | `false` | 是否生成 Source Map |

---

## 🛡️ 安全限制速查

- ✅ **代码长度**: 最大 10KB (10,000 字符)
- ✅ **编译超时**: 5 秒自动中断
- ✅ **模块白名单**: 禁止 `fs`、`child_process`、`net`、`process.env` 等

---

## 📞 故障排查

### 问题: API 无响应
```bash
# 检查服务器是否运行
curl http://localhost:3000/api/compile

# 检查端口是否被占用
lsof -i :3000
```

### 问题: 编译超时
- 简化代码复杂度
- 移除复杂的类型推导
- 检查是否有死循环逻辑

### 问题: 类型错误
- 确保导入 `React` (对于 TSX)
- 检查 TypeScript 类型定义
- 使用 `loader: 'tsx'` 而非 `'ts'` (对于 JSX)

---

## 🎉 成功检查清单

- [ ] 开发服务器正常启动 (`npm run dev`)
- [ ] GET `/api/compile` 返回 API 信息
- [ ] POST `/api/compile` 可以编译 TypeScript
- [ ] POST `/api/compile` 可以编译 TSX
- [ ] 语法错误正确返回 400 状态码
- [ ] 禁止模块正确返回 403 状态码
- [ ] 代码压缩功能正常工作
- [ ] 测试脚本 `./test-compile-api.sh` 全部通过

---

## 📚 下一步

1. **集成到 Playground**: 在页面中使用 `CodeCompiler` 组件
2. **添加语法高亮**: 使用 Prism.js 或 Monaco Editor
3. **实时编译**: 添加 debounce 实现自动编译
4. **代码模板**: 提供常用代码片段模板
5. **分享功能**: 生成可分享的代码链接

---

**准备好了吗？立即启动服务器并开始使用！** 🚀

```bash
cd /home/saken/project/Xorigo UI/apps/website && npm run dev
```
