#!/bin/bash

# 在线代码编译 API 测试脚本
# 用法: ./test-compile-api.sh

API_URL="http://localhost:3000/api/compile"

echo "======================================"
echo "TH-UI Compile API 测试"
echo "======================================"
echo ""

# 测试 1: GET 请求 - API 信息
echo "测试 1: GET /api/compile (API 信息)"
echo "--------------------------------------"
curl -s -X GET "$API_URL" | jq '.'
echo ""
echo ""

# 测试 2: POST 请求 - 简单 TypeScript 编译
echo "测试 2: POST /api/compile (TypeScript 编译)"
echo "--------------------------------------"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "const greeting: string = \"Hello, TH-UI!\"; console.log(greeting);",
    "config": {
      "loader": "ts",
      "target": "es2020"
    }
  }' | jq '.'
echo ""
echo ""

# 测试 3: POST 请求 - TSX 编译
echo "测试 3: POST /api/compile (TSX 编译)"
echo "--------------------------------------"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "import React from \"react\"; const App = () => <div>Hello World</div>;",
    "config": {
      "loader": "tsx",
      "target": "es2020"
    }
  }' | jq '.'
echo ""
echo ""

# 测试 4: POST 请求 - 代码压缩
echo "测试 4: POST /api/compile (代码压缩)"
echo "--------------------------------------"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "const veryLongVariableName = 123; console.log(veryLongVariableName);",
    "config": {
      "loader": "ts",
      "minify": true
    }
  }' | jq '.'
echo ""
echo ""

# 测试 5: 错误测试 - 空代码
echo "测试 5: POST /api/compile (空代码 - 应该失败)"
echo "--------------------------------------"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "code": ""
  }' | jq '.'
echo ""
echo ""

# 测试 6: 错误测试 - 语法错误
echo "测试 6: POST /api/compile (语法错误 - 应该失败)"
echo "--------------------------------------"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "const x: = 1;"
  }' | jq '.'
echo ""
echo ""

# 测试 7: 安全测试 - 禁止的模块
echo "测试 7: POST /api/compile (禁止的模块 - 应该失败)"
echo "--------------------------------------"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "import fs from \"fs\"; fs.readFileSync(\"/etc/passwd\");"
  }' | jq '.'
echo ""
echo ""

echo "======================================"
echo "测试完成！"
echo "======================================"
