#!/bin/bash

# Xorigo UI 开发服务器代理测试脚本
# 用于验证代理功能的完整性

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
    echo -e "${BLUE}🧪 开始测试开发服务器代理${NC}"
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
        echo -e "${GREEN}🎉 所有测试通过！${NC}"
        return 0
    else
        echo -e "${RED}💥 有 $TESTS_FAILED 个测试失败${NC}"
        return 1
    fi
}

# 测试代理脚本存在性
test_script_exists() {
    local script_path="$PROJECT_ROOT/scripts/agent-dev-server.sh"

    if [ -f "$script_path" ] && [ -x "$script_path" ]; then
        print_test_result "代理脚本存在且可执行" "PASS"
    else
        print_test_result "代理脚本存在且可执行" "FAIL" "脚本不存在或无执行权限"
    fi
}

# 测试代理脚本帮助功能
test_help_function() {
    local output
    output=$("$PROJECT_ROOT/scripts/agent-dev-server.sh" help 2>&1 || true)

    if echo "$output" | grep -q "Xorigo UI 开发服务器代理脚本"; then
        print_test_result "代理脚本帮助功能" "PASS"
    else
        print_test_result "代理脚本帮助功能" "FAIL" "帮助信息不正确"
    fi
}

# 测试 Docker 状态检查
test_docker_status() {
    if docker info > /dev/null 2>&1; then
        print_test_result "Docker 运行状态" "PASS" "Docker 正在运行"
    else
        print_test_result "Docker 运行状态" "FAIL" "Docker 未运行，请启动 Docker Desktop"
    fi
}

# 测试违规进程检测
test_violation_detection() {
    # 检查是否真的有违规进程
    local violations
    violations=$(ps aux | grep -E "npm.*run.*dev|next.*dev" | grep -v grep | wc -l)

    # 运行代理检查
    local output
    output=$("$PROJECT_ROOT/scripts/agent-dev-server.sh" check 2>&1 || true)

    if echo "$output" | grep -q "检查违规进程和端口冲突"; then
        if [ "$violations" -gt 0 ]; then
            if echo "$output" | grep -q "发现.*违规"; then
                print_test_result "违规进程检测" "PASS" "正确检测到 $violations 个违规进程"
            else
                print_test_result "违规进程检测" "FAIL" "未检测到已存在的违规进程"
            fi
        else
            if echo "$output" | grep -q "未发现违规情况"; then
                print_test_result "违规进程检测" "PASS" "正确检测到无违规进程"
            else
                print_test_result "违规进程检测" "FAIL" "违规进程检测逻辑错误"
            fi
        fi
    else
        print_test_result "违规进程检测" "FAIL" "检查功能未正常工作"
    fi
}

# 测试端口冲突检测
test_port_conflict_detection() {
    local output
    output=$("$PROJECT_ROOT/scripts/agent-dev-server.sh" check 2>&1 || true)

    if echo "$output" | grep -q "端口冲突"; then
        # 检查是否真的有端口冲突
        local port_3000=$(lsof -ti:3000 2>/dev/null || echo "")
        local port_3001=$(lsof -ti:3001 2>/dev/null || echo "")

        if [ -n "$port_3000" ] || [ -n "$port_3001" ]; then
            print_test_result "端口冲突检测" "PASS" "正确检测到端口冲突"
        else
            print_test_result "端口冲突检测" "FAIL" "误报端口冲突"
        fi
    else
        # 检查是否真的没有端口冲突
        local port_3000=$(lsof -ti:3000 2>/dev/null || echo "")
        local port_3001=$(lsof -ti:3001 2>/dev/null || echo "")

        if [ -z "$port_3000" ] && [ -z "$port_3001" ]; then
            print_test_result "端口冲突检测" "PASS" "正确检测到无端口冲突"
        else
            print_test_result "端口冲突检测" "FAIL" "未检测到存在的端口冲突"
        fi
    fi
}

# 测试状态检查功能
test_status_check() {
    local output
    output=$("$PROJECT_ROOT/scripts/agent-dev-server.sh" status 2>&1 || true)

    if echo "$output" | grep -q "检查开发环境状态"; then
        print_test_result "状态检查功能" "PASS"
    else
        print_test_result "状态检查功能" "FAIL" "状态检查未正常工作"
    fi
}

# 测试健康检查功能
test_health_check() {
    local output
    output=$("$PROJECT_ROOT/scripts/agent-dev-server.sh" health 2>&1 || true)

    if echo "$output" | grep -q "执行健康检查"; then
        print_test_result "健康检查功能" "PASS"
    else
        print_test_result "健康检查功能" "FAIL" "健康检查未正常工作"
    fi
}

# 测试 Docker Compose 文件存在
test_docker_compose_exists() {
    local compose_file="$PROJECT_ROOT/docker-compose.dev.monorepo.yml"

    if [ -f "$compose_file" ]; then
        print_test_result "Docker Compose 文件存在" "PASS"
    else
        print_test_result "Docker Compose 文件存在" "FAIL" "Docker Compose 文件不存在"
    fi
}

# 测试 package.json 脚本配置
test_package_json_scripts() {
    local package_file="$PROJECT_ROOT/package.json"

    if grep -q "agent:start" "$package_file" && \
       grep -q "agent:stop" "$package_file" && \
       grep -q "agent:status" "$package_file"; then
        print_test_result "package.json 脚本配置" "PASS"
    else
        print_test_result "package.json 脚本配置" "FAIL" "agent 脚本未正确配置"
    fi
}

# 测试代理文件存在性
test_agent_files() {
    local agent_file="$PROJECT_ROOT/.claude/agents/dev-server-agent.ts"
    local index_file="$PROJECT_ROOT/.claude/agents/index.ts"

    if [ -f "$agent_file" ] && [ -f "$index_file" ]; then
        print_test_result "代理文件存在" "PASS"
    else
        print_test_result "代理文件存在" "FAIL" "代理文件缺失"
    fi
}

# 测试容器状态（如果正在运行）
test_container_status() {
    if docker ps | grep -q xorigo-ui-website-dev; then
        # 容器正在运行，检查端口响应
        if curl -I http://localhost:3100 > /dev/null 2>&1; then
            print_test_result "容器运行状态" "PASS" "容器正在运行且响应正常"
        else
            print_test_result "容器运行状态" "FAIL" "容器正在运行但端口无响应"
        fi
    else
        print_test_result "容器运行状态" "PASS" "容器未运行（这是正常状态）"
    fi
}

# 运行所有测试
run_all_tests() {
    start_test_suite

    test_script_exists
    test_help_function
    test_docker_status
    test_violation_detection
    test_port_conflict_detection
    test_status_check
    test_health_check
    test_docker_compose_exists
    test_package_json_scripts
    test_agent_files
    test_container_status

    end_test_suite
}

# 运行特定测试
run_specific_test() {
    local test_name=$1

    start_test_suite

    case "$test_name" in
        "script")
            test_script_exists
            test_help_function
            ;;
        "docker")
            test_docker_status
            test_docker_compose_exists
            test_container_status
            ;;
        "violation")
            test_violation_detection
            test_port_conflict_detection
            ;;
        "functions")
            test_status_check
            test_health_check
            ;;
        "config")
            test_package_json_scripts
            test_agent_files
            ;;
        *)
            echo -e "${RED}未知的测试名称: $test_name${NC}"
            echo "可用的测试: script, docker, violation, functions, config"
            return 1
            ;;
    esac

    end_test_suite
}

# 显示帮助
show_test_help() {
    cat << EOF
开发服务器代理测试脚本

用法: $0 [选项] [测试名称]

选项:
  -h, --help     显示此帮助信息

测试名称:
  all            运行所有测试 (默认)
  script         测试脚本文件和帮助功能
  docker         测试 Docker 相关功能
  violation      测试违规检测功能
  functions      测试各种功能函数
  config         测试配置文件

示例:
  $0              # 运行所有测试
  $0 script       # 只测试脚本功能
  $0 docker       # 只测试 Docker 功能

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
        script|docker|violation|functions|config)
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