#!/bin/bash

# 搜索 API 测试脚本
# 使用 curl 测试各种搜索场景

echo "======================================"
echo "🔍 TH-UI 搜索 API 测试脚本"
echo "======================================"
echo ""

# 配置
BASE_URL="${BASE_URL:-http://localhost:3100}"
API_URL="$BASE_URL/api/search"

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试函数
test_api() {
  local test_name="$1"
  local url="$2"

  echo -e "${YELLOW}测试: $test_name${NC}"
  echo "URL: $url"
  echo ""

  response=$(curl -s -w "\n%{http_code}" "$url")
  http_code=$(echo "$response" | tail -n 1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ HTTP $http_code${NC}"
    echo "$body" | jq '.'
  else
    echo -e "${RED}✗ HTTP $http_code${NC}"
    echo "$body" | jq '.'
  fi

  echo ""
  echo "--------------------------------------"
  echo ""
}

# ============================================================================
# 测试用例
# ============================================================================

echo "1️⃣  基础搜索测试"
test_api "搜索 'button'" "$API_URL?q=button"

echo "2️⃣  组件搜索测试"
test_api "仅搜索组件 'card'" "$API_URL?q=card&type=component"

echo "3️⃣  配方搜索测试"
test_api "仅搜索配方 'dark'" "$API_URL?q=dark&type=recipe"

echo "4️⃣  分页测试"
test_api "第1页，每页5条" "$API_URL?q=button&page=1&pageSize=5"
test_api "第2页，每页5条" "$API_URL?q=button&page=2&pageSize=5"

echo "5️⃣  中文搜索测试"
test_api "搜索中文 '按钮'" "$API_URL?q=%E6%8C%89%E9%92%AE"

echo "6️⃣  空查询测试"
test_api "空查询字符串" "$API_URL?q="

echo "7️⃣  参数验证测试"
test_api "无效页码 (page=0)" "$API_URL?q=test&page=0"
test_api "无效每页数量 (pageSize=100)" "$API_URL?q=test&pageSize=100"

echo "8️⃣  搜索所有类型"
test_api "搜索 'color' (所有类型)" "$API_URL?q=color&type=all"

echo "9️⃣  复杂查询测试"
test_api "搜索 'theme' 第1页" "$API_URL?q=theme&type=all&page=1&pageSize=10"

echo "🔟 性能测试"
echo "测试响应时间..."
time curl -s "$API_URL?q=button" > /dev/null

echo ""
echo "======================================"
echo "✅ 测试完成"
echo "======================================"
