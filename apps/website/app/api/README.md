# Xorigo UI API 文档

**版本**: v1.0.0
**基础URL**: `http://localhost:3100/api`

## 概述

Xorigo UI API 提供了完整的组件库数据接口，支持组件查询、搜索、遥测收集等功能。所有 API 端点都支持 CORS，可以跨域访问。

## API 端点

### 1. 健康检查

**端点**: `GET /api/health`
**描述**: 检查 API 服务状态和系统健康情况

#### 基础健康检查
```bash
curl http://localhost:3100/api/health
```

#### 详细健康检查
```bash
curl "http://localhost:3100/api/health?detailed=true"
```

**响应示例**:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-13T19:39:02.839Z",
  "uptime": 1341,
  "system": {
    "version": "1.0.0",
    "name": "Xorigo UI API",
    "description": "Xorigo UI Component Library API",
    "environment": "development"
  }
}
```

### 2. 组件 API

**端点**: `GET /api/components`
**描述**: 获取组件库中的组件数据

#### 查询参数

| 参数 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| `category` | string | 否 | - | 组件分类过滤 |
| `search` | string | 否 | - | 搜索关键词 |
| `variants` | boolean | 否 | false | 是否包含变体信息 |
| `examples` | boolean | 否 | false | 是否包含示例代码 |
| `limit` | number | 否 | - | 返回结果数量限制 |
| `offset` | number | 否 | 0 | 结果偏移量 |

#### 示例请求

```bash
# 获取所有组件
curl http://localhost:3100/api/components

# 按分类过滤
curl "http://localhost:3100/api/components?category=inputs"

# 搜索组件
curl "http://localhost:3100/api/components?search=button"

# 获取详细信息
curl "http://localhost:3100/api/components?variants=true&examples=true"
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "components": [
      {
        "id": "button",
        "name": "Button",
        "description": "可点击的按钮组件",
        "category": "ui",
        "tags": ["interactive", "clickable"],
        "version": "1.0.0",
        "status": "stable"
      }
    ],
    "categories": [
      {
        "id": "ui",
        "name": "UI 基础组件",
        "description": "最基础的 UI 构建块"
      }
    ],
    "metadata": {
      "total": 1,
      "filtered": "all",
      "requestedAt": "2025-10-13T19:39:06.115Z"
    }
  }
}
```

### 3. 搜索 API

**端点**: `GET /api/search`
**描述**: 在组件库中执行全文搜索

#### 查询参数

| 参数 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| `q` | string | 是 | - | 搜索关键词 |
| `type` | string | 否 | all | 搜索类型 (components, categories, tags, all) |
| `category` | string | 否 | - | 分类过滤 |
| `limit` | number | 否 | 20 | 结果数量限制 |
| `offset` | number | 否 | 0 | 结果偏移量 |

#### 示例请求

```bash
# 搜索所有内容
curl "http://localhost:3100/api/search?q=button"

# 搜索组件
curl "http://localhost:3100/api/search?q=input&type=components"

# 搜索标签
curl "http://localhost:3100/api/search?q=form&type=tags"
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "query": "button",
    "results": [
      {
        "type": "component",
        "id": "button",
        "title": "Button",
        "description": "可点击的按钮组件",
        "url": "/gallery?component=button",
        "category": "ui",
        "tags": ["interactive", "clickable"],
        "score": 100
      }
    ],
    "pagination": {
      "total": 1,
      "limit": 20,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

### 4. 遥测 API

**端点**: `GET /api/telemetry` 或 `POST /api/telemetry`
**描述**: 收集和分析使用统计数据

#### GET 查询参数

| 参数 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| `type` | string | 否 | overview | 统计类型 (overview, components, pages, searches, performance) |
| `period` | string | 否 | 24h | 统计时间周期 |

#### POST 请求体

```json
{
  "type": "component_view",
  "data": {
    "componentId": "button",
    "timestamp": "2025-10-13T19:39:00.000Z"
  }
}
```

#### 遥测类型

- `component_view`: 组件查看记录
- `page_view`: 页面访问记录
- `search`: 搜索行为记录
- `performance`: 性能指标记录

#### 示例请求

```bash
# 获取概览统计
curl "http://localhost:3100/api/telemetry?type=overview"

# 获取组件统计
curl "http://localhost:3100/api/telemetry?type=components"

# 记录组件查看
curl -X POST http://localhost:3100/api/telemetry \
  -H "Content-Type: application/json" \
  -d '{
    "type": "component_view",
    "data": {
      "componentId": "button"
    }
  }'
```

## 错误处理

所有 API 端点都返回统一的错误格式：

```json
{
  "success": false,
  "error": "error_type",
  "message": "Human readable error message"
}
```

### 常见错误码

- `400 Bad Request`: 请求参数错误
- `404 Not Found`: 资源不存在
- `500 Internal Server Error`: 服务器内部错误
- `503 Service Unavailable`: 服务不可用

## CORS 支持

所有 API 端点都支持跨域请求，配置了以下 CORS 头部：

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## 速率限制

目前没有实施速率限制，但在生产环境中建议：

- API 调用: 1000 次/小时/IP
- 搜索请求: 100 次/分钟/IP
- 遥测上报: 10000 次/小时/IP

## 认证

当前 API 端点不需要认证。未来版本可能添加 API Key 认证。

## 版本控制

API 版本通过 URL 路径管理：
- v1: `/api/v1/*` (当前版本)
- 未来版本将支持 `/api/v2/*`

## 更新日志

### v1.0.0 (2025-10-13)
- 初始版本发布
- 实现组件、搜索、遥测、健康检查 API
- 支持 CORS 跨域访问
- 完整的错误处理和响应格式

## 支持与反馈

如有问题或建议，请通过以下方式联系：

- GitHub Issues: [xorigo-ui/xorigo-ui](https://github.com/xorigo-ui/xorigo-ui)
- 邮箱: team@xorigo-ui.com

## 开发指南

### 本地开发

```bash
# 启动开发服务器
npm run dev

# 测试 API 端点
curl http://localhost:3100/api/health
```

### API 测试

```bash
# 运行 API 测试套件
npm run test:api

# 生成 API 文档
npm run docs:api
```

### 贡献指南

1. Fork 项目仓库
2. 创建功能分支
3. 实现新功能或修复
4. 添加测试用例
5. 提交 Pull Request