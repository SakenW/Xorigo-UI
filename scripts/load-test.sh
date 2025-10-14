#!/bin/bash

# ============================================
# Xorigo UI 负载测试脚本 - Phase 6
# 性能验证 + 压力测试 + 峰值测试
# ============================================

set -euo pipefail

# 配置变量
BASE_URL="${BASE_URL:-http://localhost:3100}"
TEST_DURATION="${TEST_DURATION:-60}"  # 测试持续时间（秒）
CONCURRENT_USERS="${CONCURRENT_USERS:-50}"  # 并发用户数
RAMP_UP_TIME="${RAMP_UP_TIME:-10}"  # 增长时间（秒）
RESULTS_DIR="load-test-results"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"
}

log_test() {
    echo -e "${PURPLE}[TEST]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"
}

# 检查依赖
check_dependencies() {
    log_info "检查负载测试依赖..."

    local missing_deps=()

    # 检查 curl
    if ! command -v curl &> /dev/null; then
        missing_deps+=(curl)
    fi

    # 检查 apachebench (ab)
    if ! command -v ab &> /dev/null; then
        missing_deps+=(apachebench)
        log_info "安装 apachebench: sudo apt-get install apache2-utils"
    fi

    # 检查 wrk (可选)
    if ! command -v wrk &> /dev/null; then
        log_info "可选: 安装 wrk 以获得更好的性能测试: sudo apt-get install wrk"
    fi

    if [ ${#missing_deps[@]} -gt 0 ]; then
        log_error "缺少依赖: ${missing_deps[*]}"
        exit 1
    fi

    # 创建结果目录
    mkdir -p "$RESULTS_DIR"

    log_success "依赖检查通过"
}

# 基础连接测试
basic_connectivity_test() {
    log_test "执行基础连接测试..."

    local start_time=$(date +%s.%N)

    if curl -f -s "$BASE_URL/health" > /dev/null; then
        local end_time=$(date +%s.%N)
        local response_time=$(echo "$end_time - $start_time" | bc)

        log_success "基础连接测试通过 (响应时间: ${response_time}s)"
        return 0
    else
        log_error "基础连接测试失败"
        return 1
    fi
}

# 响应时间基准测试
response_time_benchmark() {
    log_test "执行响应时间基准测试..."

    local results_file="$RESULTS_DIR/response_time_benchmark.json"
    local total_requests=100
    local success_count=0
    local total_time=0
    local min_time=999
    local max_time=0

    echo "[" > "$results_file"

    for i in $(seq 1 $total_requests); do
        local start_time=$(date +%s.%N)

        if curl -f -s -w "%{time_total}" -o /dev/null "$BASE_URL/" 2>/dev/null; then
            local end_time=$(date +%s.%N)
            local response_time=$(echo "$end_time - $start_time" | bc)

            success_count=$((success_count + 1))
            total_time=$(echo "$total_time + $response_time" | bc)

            # 更新最小/最大时间
            if (( $(echo "$response_time < $min_time" | bc -l) )); then
                min_time=$response_time
            fi
            if (( $(echo "$response_time > $max_time" | bc -l) )); then
                max_time=$response_time
            fi

            # 记录单个请求结果
            echo "  {\"request\": $i, \"response_time\": $response_time, \"success\": true}," >> "$results_file"
        else
            echo "  {\"request\": $i, \"response_time\": null, \"success\": false}," >> "$results_file"
        fi

        # 显示进度
        if [ $((i % 20)) -eq 0 ]; then
            echo -n "."
        fi
    done

    echo "]" >> "$results_file"
    echo

    # 计算统计数据
    if [ $success_count -gt 0 ]; then
        local avg_time=$(echo "scale=3; $total_time / $success_count" | bc)

        log_success "响应时间基准测试完成:"
        log_info "  成功率: $success_count/$total_requests ($(echo "scale=1; $success_count * 100 / $total_requests" | bc)%)"
        log_info "  平均响应时间: ${avg_time}s"
        log_info "  最小响应时间: ${min_time}s"
        log_info "  最大响应时间: ${max_time}s"

        # 性能评估
        if (( $(echo "$avg_time < 0.5" | bc -l) )); then
            log_success "响应时间性能: 优秀"
        elif (( $(echo "$avg_time < 1.0" | bc -l) )); then
            log_success "响应时间性能: 良好"
        elif (( $(echo "$avg_time < 2.0" | bc -l) )); then
            log_warning "响应时间性能: 一般"
        else
            log_error "响应时间性能: 需要优化"
        fi

        return 0
    else
        log_error "响应时间基准测试失败: 所有请求都失败了"
        return 1
    fi
}

# Apache Bench 压力测试
apache_bench_test() {
    log_test "执行 Apache Bench 压力测试..."

    if ! command -v ab &> /dev/null; then
        log_warning "跳过 Apache Bench 测试 (apachebench 未安装)"
        return 0
    fi

    local requests=1000
    local concurrency=10
    local results_file="$RESULTS_DIR/apache_bench_results.txt"

    log_info "测试参数: $requests 请求, $concurrency 并发"

    if ab -n "$requests" -c "$concurrency" -g "$RESULTS_DIR/ab_plot.txt" "$BASE_URL/" > "$results_file" 2>&1; then
        log_success "Apache Bench 测试完成"

        # 提取关键指标
        local requests_per_second=$(grep "Requests per second" "$results_file" | awk '{print $4}')
        local time_per_request=$(grep "Time per request" "$results_file" | head -1 | awk '{print $4}')
        local failed_requests=$(grep "Failed requests" "$results_file" | awk '{print $3}')

        log_info "  RPS: $requests_per_second"
        log_info "  平均响应时间: ${time_per_request}ms"
        log_info "  失败请求: $failed_requests"

        return 0
    else
        log_error "Apache Bench 测试失败"
        return 1
    fi
}

# WRK 高性能负载测试 (如果可用)
wrk_load_test() {
    log_test "执行 WRK 高性能负载测试..."

    if ! command -v wrk &> /dev/null; then
        log_warning "跳过 WRK 测试 (wrk 未安装)"
        return 0
    fi

    local duration=30
    local threads=4
    local connections=50
    local results_file="$RESULTS_DIR/wrk_results.txt"

    log_info "测试参数: ${duration}s 持续时间, $threads 线程, $connections 连接"

    if wrk -t "$threads" -c "$connections" -d "${duration}s" --timeout 10s --latency "$BASE_URL/" > "$results_file" 2>&1; then
        log_success "WRK 测试完成"

        # 提取关键指标
        local requests_per_second=$(grep "Requests/sec" "$results_file" | awk '{print $2}')
        local avg_latency=$(grep "Latency" "$results_file" | head -1 | awk '{print $2}')

        log_info "  RPS: $requests_per_second"
        log_info "  平均延迟: $avg_latency"

        return 0
    else
        log_error "WRK 测试失败"
        return 1
    fi
}

# 并发用户测试
concurrent_users_test() {
    log_test "执行并发用户测试..."

    local max_users=100
    local step=10
    local test_duration=10
    local results_file="$RESULTS_DIR/concurrent_users_test.csv"

    echo "users,success_rate,avg_response_time,errors" > "$results_file"

    for users in $(seq 10 $step $max_users); do
        log_info "测试 $users 并发用户..."

        local success_count=0
        local total_time=0
        local error_count=0

        # 并发执行
        for i in $(seq 1 $users); do
            (
                start_time=$(date +%s.%N)
                if curl -f -s -w "%{time_total}" -o /dev/null "$BASE_URL/" 2>/dev/null; then
                    end_time=$(date +%s.%N)
                    response_time=$(echo "$end_time - $start_time" | bc)
                    echo "$response_time"
                else
                    echo "ERROR"
                fi
            ) &
        done

        # 等待所有后台任务完成
        wait

        # 收集结果 (简化版本)
        local temp_file="/tmp/curl_results_$users"
        > "$temp_file"

        for i in $(seq 1 $users); do
            (
                start_time=$(date +%s.%N)
                if curl -f -s -w "%{time_total}" -o /dev/null "$BASE_URL/" 2>/dev/null; then
                    end_time=$(date +%s.%N)
                    response_time=$(echo "$end_time - $start_time" | bc)
                    echo "$response_time" >> "$temp_file"
                else
                    echo "ERROR" >> "$temp_file"
                fi
            ) &
        done

        wait

        # 分析结果
        success_count=$(grep -v "ERROR" "$temp_file" | wc -l)
        error_count=$(grep "ERROR" "$temp_file" | wc -l)

        if [ $success_count -gt 0 ]; then
            total_time=$(grep -v "ERROR" "$temp_file" | awk '{sum += $1} END {print sum}')
            avg_time=$(echo "scale=3; $total_time / $success_count" | bc)
        else
            avg_time=0
        fi

        local success_rate=$(echo "scale=1; $success_count * 100 / $users" | bc)

        echo "$users,$success_rate,$avg_time,$error_count" >> "$results_file"

        log_info "  $users 用户: 成功率 ${success_rate}%, 平均响应时间 ${avg_time}s"

        # 清理临时文件
        rm -f "$temp_file"

        # 如果成功率太低，停止测试
        if (( $(echo "$success_rate < 50" | bc -l) )); then
            log_warning "成功率过低 ($success_rate%), 停止增加并发用户数"
            break
        fi
    done

    log_success "并发用户测试完成"
}

# 峰值负载测试
peak_load_test() {
    log_test "执行峰值负载测试..."

    local peak_users=200
    local ramp_duration=30
    local peak_duration=60
    local cool_down_duration=30

    log_info "测试计划: 在 ${ramp_duration}s 内增加到 $peak_users 用户，维持 ${peak_duration}s，然后冷却 ${cool_down_duration}s"

    # 模拟逐步增加负载
    local current_users=1
    while [ $current_users -le $peak_users ]; do
        log_info "当前用户数: $current_users/$peak_users"

        # 启动当前数量的并发请求
        for i in $(seq 1 $current_users); do
            curl -f -s -o /dev/null "$BASE_URL/" &
        done

        # 短暂等待
        sleep 2

        # 增加用户数
        current_users=$((current_users * 2))
        if [ $current_users -gt $peak_users ]; then
            current_users=$peak_users
        fi
    done

    log_info "峰值负载阶段 ($peak_users 用户，${peak_duration}s)..."
    sleep "$peak_duration"

    log_info "冷却阶段..."
    sleep "$cool_down_duration"

    log_success "峰值负载测试完成"
}

# 生成测试报告
generate_test_report() {
    log_test "生成负载测试报告..."

    local report_file="$RESULTS_DIR/load_test_report.md"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    cat > "$report_file" << EOF
# Xorigo UI 负载测试报告

## 测试信息
- **测试时间**: $timestamp
- **目标URL**: $BASE_URL
- **测试环境**: $(echo "$BASE_URL" | sed 's|http://||g' | sed 's|https://||g' | cut -d: -f1)

## 测试结果概览

### 基础连接测试
$(basic_connectivity_test && echo "✅ 通过" || echo "❌ 失败")

### 响应时间基准测试
- 结果文件: \`response_time_benchmark.json\`
- 详细数据已保存

### 并发用户测试
- 结果文件: \`concurrent_users_test.csv\`
- 测试范围: 10-100 并发用户

### Apache Bench 测试
$(if [ -f "$RESULTS_DIR/apache_bench_results.txt" ]; then
    echo "- 结果文件: \`apache_bench_results.txt\`"
    grep -E "(Requests per second|Time per request|Failed requests)" "$RESULTS_DIR/apache_bench_results.txt" | sed 's/^/- /'
else
    echo "- 跳过 (apachebench 未安装)"
fi)

### WRK 测试
$(if [ -f "$RESULTS_DIR/wrk_results.txt" ]; then
    echo "- 结果文件: \`wrk_results.txt\`"
    grep -E "(Requests/sec|Latency)" "$RESULTS_DIR/wrk_results.txt" | sed 's/^/- /'
else
    echo "- 跳过 (wrk 未安装)"
fi)

## 性能建议

基于测试结果，建议关注以下方面：

1. **响应时间优化**: 如果平均响应时间 > 1s，需要优化
2. **并发处理**: 如果成功率 < 95%，需要优化并发处理能力
3. **资源使用**: 监控 CPU、内存使用情况
4. **缓存策略**: 实施有效的缓存策略
5. **CDN 加速**: 考虑使用 CDN 减少服务器负载

## 监控指标

持续监控以下指标：
- 响应时间 (目标: < 2s)
- 成功率 (目标: > 99%)
- 并发用户数
- 服务器资源使用率

---
*报告生成时间: $(date)*
*测试工具: curl, apachebench, wrk*
EOF

    log_success "负载测试报告已生成: $report_file"
}

# 主函数
main() {
    log_info "开始 Xorigo UI 负载测试"
    log_info "目标URL: $BASE_URL"

    # 检查依赖
    check_dependencies

    # 执行测试
    basic_connectivity_test || exit 1
    response_time_benchmark || exit 1
    apache_bench_test
    wrk_load_test
    concurrent_users_test
    peak_load_test

    # 生成报告
    generate_test_report

    log_success "🎉 负载测试完成！"
    echo
    log_info "📊 测试结果位置: $RESULTS_DIR"
    log_info "📋 测试报告: $RESULTS_DIR/load_test_report.md"
    echo
    log_info "🔍 关键指标查看:"
    log_info "   响应时间数据: $RESULTS_DIR/response_time_benchmark.json"
    log_info "   并发测试数据: $RESULTS_DIR/concurrent_users_test.csv"
    log_info "   Apache Bench 结果: $RESULTS_DIR/apache_bench_results.txt"
}

# 显示使用帮助
show_help() {
    cat << EOF
Xorigo UI 负载测试脚本

用法: $0 [选项]

选项:
  -h, --help              显示此帮助信息
  -u, --url URL           目标URL (默认: http://localhost:3100)
  -d, --duration SECONDS  测试持续时间 (默认: 60)
  -c, --concurrent NUM    并发用户数 (默认: 50)
  -r, --ramp-up SECONDS   增长时间 (默认: 10)

环境变量:
  BASE_URL                目标URL
  TEST_DURATION           测试持续时间
  CONCURRENT_USERS        并发用户数
  RAMP_UP_TIME           增长时间

示例:
  $0                                    # 使用默认设置
  $0 -u http://localhost:3000           # 指定URL
  $0 -c 100 -d 120                     # 100并发用户，120秒测试

EOF
}

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -u|--url)
            BASE_URL="$2"
            shift 2
            ;;
        -d|--duration)
            TEST_DURATION="$2"
            shift 2
            ;;
        -c|--concurrent)
            CONCURRENT_USERS="$2"
            shift 2
            ;;
        -r|--ramp-up)
            RAMP_UP_TIME="$2"
            shift 2
            ;;
        *)
            log_error "未知参数: $1"
            show_help
            exit 1
            ;;
    esac
done

# 执行主函数
main