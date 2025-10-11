#!/bin/bash

# Registry API 测试脚本
# 用于快速验证 API 功能

# 配置
API_BASE="http://localhost:3100/api/registry"
TIMEOUT=5

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试计数器
PASS=0
FAIL=0

# 打印测试标题
print_test() {
  echo -e "\n${YELLOW}=== $1 ===${NC}"
}

# 打印成功
print_pass() {
  echo -e "${GREEN}✓ PASS${NC}: $1"
  ((PASS++))
}

# 打印失败
print_fail() {
  echo -e "${RED}✗ FAIL${NC}: $1"
  ((FAIL++))
}

# 测试函数
test_endpoint() {
  local name="$1"
  local url="$2"
  local expected_status="$3"

  response=$(curl -s -w "\n%{http_code}" --connect-timeout $TIMEOUT "$url")
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" = "$expected_status" ]; then
    print_pass "$name (HTTP $http_code)"
    if command -v jq &> /dev/null; then
      echo "$body" | jq -C '.' 2>/dev/null || echo "$body"
    else
      echo "$body"
    fi
  else
    print_fail "$name (Expected $expected_status, Got $http_code)"
    echo "$body"
  fi
}

# 主测试流程
echo "========================================="
echo "Registry API 测试"
echo "========================================="
echo "API Base: $API_BASE"
echo "Timeout: ${TIMEOUT}s"
echo "========================================="

# 1. 基础连接测试
print_test "基础连接测试"
test_endpoint "获取所有组件" "$API_BASE" "200"

# 2. 分类过滤测试
print_test "分类过滤测试"
test_endpoint "UI 分类" "$API_BASE?category=ui" "200"
test_endpoint "Feedback 分类" "$API_BASE?category=feedback" "200"
test_endpoint "无效分类 (应该 400)" "$API_BASE?category=invalid" "400"

# 3. 搜索功能测试
print_test "搜索功能测试"
test_endpoint "搜索 'button'" "$API_BASE?search=button" "200"
test_endpoint "搜索 'card'" "$API_BASE?search=card" "200"
test_endpoint "空搜索" "$API_BASE?search=" "200"

# 4. 精确过滤测试
print_test "精确过滤测试"
test_endpoint "过滤 Button" "$API_BASE?filter=Button" "200"
test_endpoint "过滤多个组件" "$API_BASE?filter=Button,Card,Input" "200"

# 5. 组合查询测试
print_test "组合查询测试"
test_endpoint "分类+搜索" "$API_BASE?category=ui&search=button" "200"

# 6. 组件详情测试
print_test "组件详情测试"
test_endpoint "获取 Button 详情" "$API_BASE/Button" "200"
test_endpoint "获取 Card 详情" "$API_BASE/Card" "200"
test_endpoint "不存在的组件 (应该 404)" "$API_BASE/NonExistent" "404"

# 7. CORS 测试
print_test "CORS 测试"
cors_headers=$(curl -s -I -X OPTIONS "$API_BASE" | grep -i "access-control")
if [ -n "$cors_headers" ]; then
  print_pass "CORS 头存在"
  echo "$cors_headers"
else
  print_fail "CORS 头缺失"
fi

# 8. 响应格式测试
print_test "响应格式验证"
response=$(curl -s "$API_BASE")
if command -v jq &> /dev/null; then
  # 检查 JSON 结构
  status=$(echo "$response" | jq -r '.status' 2>/dev/null)
  meta=$(echo "$response" | jq -r '.meta' 2>/dev/null)

  if [ "$status" = "success" ] && [ "$meta" != "null" ]; then
    print_pass "JSON 结构正确"
  else
    print_fail "JSON 结构错误"
  fi
else
  echo "jq 未安装，跳过 JSON 验证"
fi

# 9. 性能测试
print_test "性能测试"
start=$(date +%s%3N)
curl -s "$API_BASE" > /dev/null
end=$(date +%s%3N)
duration=$((end - start))

if [ $duration -lt 1000 ]; then
  print_pass "响应时间: ${duration}ms (< 1s)"
else
  print_fail "响应时间过长: ${duration}ms"
fi

# 测试总结
echo ""
echo "========================================="
echo "测试总结"
echo "========================================="
echo -e "通过: ${GREEN}${PASS}${NC}"
echo -e "失败: ${RED}${FAIL}${NC}"
echo -e "总计: $((PASS + FAIL))"
echo "========================================="

# 退出码
if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}所有测试通过！${NC}"
  exit 0
else
  echo -e "${RED}部分测试失败${NC}"
  exit 1
fi
