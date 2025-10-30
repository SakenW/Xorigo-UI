#!/bin/bash

# Claude Code Hooks 系统集成测试脚本
# 验证 Hook 系统是否能正确阻止违规命令

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 测试计数器
TESTS_TOTAL=0
TESTS_PASSED=0
TESTS_FAILED=0

# 打印测试结果
print_test_result() {
    local test_name=$1
    local result=$2
    local message=$3

    if [ "$result" = "PASS" ]; then
        echo -e "${GREEN}✅ PASS${NC} $test_name"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC} $test_name"
        if [ -n "$message" ]; then
            echo -e "   ${RED}Error: $message${NC}"
        fi
        ((TESTS_FAILED++))
    fi
    ((TESTS_TOTAL++))
}

# 开始测试套件
start_test_suite() {
    echo -e "${BLUE}🛡️ Claude Code Hooks 系统测试${NC}"
    echo "========================================"
}

# 结束测试套件
end_test_suite() {
    echo "========================================"
    echo -e "${BLUE}测试完成${NC}"
    echo -e "总计: $TESTS_TOTAL"
    echo -e "${GREEN}通过: $TESTS_PASSED${NC}"
    echo -e "${RED}失败: $TESTS_FAILED${NC}"

    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "${GREEN}🎉 所有测试通过！Hooks 系统正常工作${NC}"
        return 0
    else
        echo -e "${RED}💥 有 $TESTS_FAILED 个测试失败${NC}"
        return 1
    fi
}

# 测试 Hook 脚本存在性
test_hook_script_exists() {
    local hook_script="$PROJECT_ROOT/.claude/hooks/validate-bash.py"

    if [ -f "$hook_script" ] && [ -x "$hook_script" ]; then
        print_test_result "Hook 脚本存在且可执行" "PASS"
    else
        print_test_result "Hook 脚本存在且可执行" "FAIL" "Hook 脚本不存在或无执行权限"
    fi
}

# 测试 settings.json 配置
test_settings_json_config() {
    local settings_file="$PROJECT_ROOT/.claude/settings.json"

    if [ -f "$settings_file" ]; then
        # 检查 PreToolUse hook 配置
        if grep -q "validate-bash.py" "$settings_file" && \
           grep -q "PreToolUse" "$settings_file" && \
           grep -q "Bash" "$settings_file"; then
            print_test_result "settings.json Hook 配置" "PASS"
        else
            print_test_result "settings.json Hook 配置" "FAIL" "Hook 配置不正确"
        fi

        # 检查是否移除了 npm run dev 权限
        if ! grep -q "npm run dev:\*\)" "$settings_file"; then
            print_test_result "npm run dev 权限已移除" "PASS"
        else
            print_test_result "npm run dev 权限已移除" "FAIL" "权限配置中仍包含 npm run dev"
        fi
    else
        print_test_result "settings.json 存在性" "FAIL" "settings.json 文件不存在"
    fi
}

# 测试违规命令阻止
test_forbidden_commands() {
    local hook_script="$PROJECT_ROOT/.claude/hooks/validate-bash.py"

    # 测试 npm run dev
    local output
    output=$(echo '{"command": "npm run dev"}' | python3 "$hook_script" 2>&1 || true)
    if echo "$output" | grep -q '"allowed": false'; then
        print_test_result "阻止 npm run dev" "PASS"
    else
        print_test_result "阻止 npm run dev" "FAIL" "未能阻止 npm run dev"
    fi

    # 测试 yarn dev
    output=$(echo '{"command": "yarn dev"}' | python3 "$hook_script" 2>&1 || true)
    if echo "$output" | grep -q '"allowed": false'; then
        print_test_result "阻止 yarn dev" "PASS"
    else
        print_test_result "阻止 yarn dev" "FAIL" "未能阻止 yarn dev"
    fi

    # 测试端口 3000
    output=$(echo '{"command": "npm start -- --port 3000"}' | python3 "$hook_script" 2>&1 || true)
    if echo "$output" | grep -q '"allowed": false'; then
        print_test_result "阻止端口 3000 使用" "PASS"
    else
        print_test_result "阻止端口 3000 使用" "FAIL" "未能阻止端口 3000 使用"
    fi

    # 测试 next dev
    output=$(echo '{"command": "next dev"}' | python3 "$hook_script" 2>&1 || true)
    if echo "$output" | grep -q '"allowed": false'; then
        print_test_result "阻止 next dev" "PASS"
    else
        print_test_result "阻止 next dev" "FAIL" "未能阻止 next dev"
    fi
}

# 测试允许命令通过
test_allowed_commands() {
    local hook_script="$PROJECT_ROOT/.claude/hooks/validate-bash.py"

    # 测试 Docker 命令
    local output
    output=$(echo '{"command": "npm run docker:dev"}' | python3 "$hook_script" 2>&1 || true)
    if echo "$output" | grep -q '"allowed": true'; then
        print_test_result "允许 npm run docker:dev" "PASS"
    else
        print_test_result "允许 npm run docker:dev" "FAIL" "错误阻止了 Docker 命令"
    fi

    # 测试代理命令
    output=$(echo '{"command": "npm run agent:start"}' | python3 "$hook_script" 2>&1 || true)
    if echo "$output" | grep -q '"allowed": true'; then
        print_test_result "允许 npm run agent:start" "PASS"
    else
        print_test_result "允许 npm run agent:start" "FAIL" "错误阻止了代理命令"
    fi

    # 测试脚本命令
    output=$(echo '{"command": "./scripts/agent-dev-server.sh start"}' | python3 "$hook_script" 2>&1 || true)
    if echo "$output" | grep -q '"allowed": true'; then
        print_test_result "允许代理脚本命令" "PASS"
    else
        print_test_result "允许代理脚本命令" "FAIL" "错误阻止了代理脚本"
    fi

    # 测试普通构建命令
    output=$(echo '{"command": "npm run build"}' | python3 "$hook_script" 2>&1 || true)
    if echo "$output" | grep -q '"allowed": true'; then
        print_test_result "允许 npm run build" "PASS"
    else
        print_test_result "允许 npm run build" "FAIL" "错误阻止了构建命令"
    fi
}

# 测试错误信息格式
test_error_message_format() {
    local hook_script="$PROJECT_ROOT/.claude/hooks/validate-bash.py"

    local output
    output=$(echo '{"command": "npm run dev"}' | python3 "$hook_script" 2>&1 || true)

    # 检查是否包含关键信息
    if echo "$output" | grep -q "🚨 命令被禁止" && \
       echo "$output" | grep -q "严禁使用 npm run dev" && \
       echo "$output" | grep -q "必须使用 Docker 热更新容器" && \
       echo "$output" | grep -q "请使用.*agent:start"; then
        print_test_result "错误信息格式" "PASS"
    else
        print_test_result "错误信息格式" "FAIL" "错误信息不完整或不正确"
    fi
}

# 测试边界情况
test_edge_cases() {
    local hook_script="$PROJECT_ROOT/.claude/hooks/validate-bash.py"

    # 测试空命令
    local output
    output=$(echo '{"command": ""}' | python3 "$hook_script" 2>&1 || true)
    if echo "$output" | grep -q '"allowed": true'; then
        print_test_result "空命令处理" "PASS"
    else
        print_test_result "空命令处理" "FAIL" "空命令处理异常"
    fi

    # 测试无效 JSON
    output=$(echo 'invalid json' | python3 "$hook_script" 2>&1 || true)
    if [ $? -eq 2 ]; then
        print_test_result "无效 JSON 处理" "PASS"
    else
        print_test_result "无效 JSON 处理" "FAIL" "无效 JSON 处理异常"
    fi

    # 测试部分匹配
    output=$(echo '{"command": "npm run something-else"}' | python3 "$hook_script" 2>&1 || true)
    if echo "$output" | grep -q '"allowed": true'; then
        print_test_result "部分匹配处理" "PASS"
    else
        print_test_result "部分匹配处理" "FAIL" "错误阻止了合法命令"
    fi
}

# 显示系统状态
show_system_status() {
    echo -e "${BLUE}📊 Hooks 系统状态${NC}"
    echo "----------------------------------------"

    # 检查 Python
    if command -v python3 &> /dev/null; then
        echo -e "${GREEN}✅ Python3 可用${NC}"
    else
        echo -e "${RED}❌ Python3 不可用${NC}"
    fi

    # 检查 Hook 脚本
    if [ -f "$PROJECT_ROOT/.claude/hooks/validate-bash.py" ]; then
        echo -e "${GREEN}✅ Hook 脚本存在${NC}"
    else
        echo -e "${RED}❌ Hook 脚本不存在${NC}"
    fi

    # 检查 settings.json
    if [ -f "$PROJECT_ROOT/.claude/settings.json" ]; then
        echo -e "${GREEN}✅ settings.json 存在${NC}"
    else
        echo -e "${RED}❌ settings.json 不存在${NC}"
    fi

    echo "----------------------------------------"
}

# 运行所有测试
run_all_tests() {
    show_system_status
    echo ""
    start_test_suite

    test_hook_script_exists
    test_settings_json_config
    test_forbidden_commands
    test_allowed_commands
    test_error_message_format
    test_edge_cases

    end_test_suite
}

# 运行特定测试
run_specific_test() {
    local test_name=$1

    start_test_suite

    case "$test_name" in
        "config")
            test_hook_script_exists
            test_settings_json_config
            ;;
        "forbidden")
            test_forbidden_commands
            ;;
        "allowed")
            test_allowed_commands
            ;;
        "format")
            test_error_message_format
            ;;
        "edge")
            test_edge_cases
            ;;
        *)
            echo -e "${RED}未知的测试名称: $test_name${NC}"
            echo "可用的测试: config, forbidden, allowed, format, edge"
            return 1
            ;;
    esac

    end_test_suite
}

# 显示帮助
show_test_help() {
    cat << EOF
Claude Code Hooks 系统测试脚本

用法: $0 [选项] [测试名称]

选项:
  -h, --help     显示此帮助信息

测试名称:
  all            运行所有测试 (默认)
  config         测试配置文件
  forbidden      测试禁止命令阻止
  allowed        测试允许命令通过
  format         测试错误信息格式
  edge           测试边界情况

示例:
  $0              # 运行所有测试
  $0 config       # 只测试配置
  $0 forbidden    # 只测试禁止命令

EOF
}

# 主逻辑
main() {
    case "${1:-all}" in
        -h|--help)
            show_test_help
            ;;
        all)
            run_all_tests
            ;;
        config|forbidden|allowed|format|edge)
            run_specific_test "$1"
            ;;
        *)
            echo -e "${RED}未知的选项: $1${NC}"
            show_test_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"