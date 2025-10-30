#!/bin/bash

# ============================================
# Xorigo UI 健康检查脚本 - Phase 6
# 零停机部署 + 性能监控 + 错误追踪
# ============================================

set -euo pipefail

# 配置变量
HEALTH_ENDPOINT="http://localhost:3100/health"
API_HEALTH_ENDPOINT="http://localhost:3100/api/health"
METRICS_ENDPOINT="http://localhost:3100/api/metrics"
WEB_VITALS_ENDPOINT="http://localhost:3100/api/web-vitals"
TIMEOUT=10
RETRY_COUNT=5
RETRY_DELAY=3

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查端点健康状态
check_endpoint() {
    local url="$1"
    local endpoint_name="$2"
    local max_retries="$3"
    local retry_count=0

    log_info "检查 ${endpoint_name} 健康状态: ${url}"

    while [ $retry_count -lt $max_retries ]; do
        if curl -f -s --max-time $TIMEOUT "$url" > /dev/null 2>&1; then
            log_success "${endpoint_name} 健康检查通过"
            return 0
        else
            retry_count=$((retry_count + 1))
            if [ $retry_count -lt $max_retries ]; then
                log_warning "${endpoint_name} 健康检查失败，${RETRY_DELAY}秒后重试... (${retry_count}/${max_retries})"
                sleep $RETRY_DELAY
            fi
        fi
    done

    log_error "${endpoint_name} 健康检查失败，已重试 ${max_retries} 次"
    return 1
}

# 检查系统资源
check_system_resources() {
    log_info "检查系统资源..."

    # 检查 CPU 使用率
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')
    if (( $(echo "$cpu_usage > 80" | bc -l) )); then
        log_warning "CPU 使用率较高: ${cpu_usage}%"
    else
        log_success "CPU 使用率正常: ${cpu_usage}%"
    fi

    # 检查内存使用率
    memory_usage=$(free | grep Mem | awk '{printf("%.1f", $3/$2 * 100.0)}')
    if (( $(echo "$memory_usage > 85" | bc -l) )); then
        log_warning "内存使用率较高: ${memory_usage}%"
    else
        log_success "内存使用率正常: ${memory_usage}%"
    fi

    # 检查磁盘使用率
    disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$disk_usage" -gt 85 ]; then
        log_warning "磁盘使用率较高: ${disk_usage}%"
    else
        log_success "磁盘使用率正常: ${disk_usage}%"
    fi
}

# 检查端口状态
check_port() {
    local port="$1"
    local service_name="$2"

    if netstat -tuln | grep -q ":${port} "; then
        log_success "${service_name} 端口 ${port} 正常监听"
        return 0
    else
        log_error "${service_name} 端口 ${port} 未监听"
        return 1
    fi
}

# 检查进程状态
check_process() {
    local process_name="$1"
    local service_name="$2"

    if pgrep -f "$process_name" > /dev/null; then
        log_success "${service_name} 进程运行正常"
        return 0
    else
        log_error "${service_name} 进程未运行"
        return 1
    fi
}

# 检查日志错误
check_log_errors() {
    local log_file="$1"
    local service_name="$2"

    if [ -f "$log_file" ]; then
        error_count=$(grep -c "ERROR\|FATAL\|CRITICAL" "$log_file" 2>/dev/null || echo "0")
        if [ "$error_count" -gt 0 ]; then
            log_warning "${service_name} 日志中发现 ${error_count} 个错误"
            # 显示最近的错误
            log_info "最近的错误记录："
            grep "ERROR\|FATAL\|CRITICAL" "$log_file" | tail -3
        else
            log_success "${service_name} 日志中无错误记录"
        fi
    else
        log_warning "${service_name} 日志文件不存在: $log_file"
    fi
}

# 检查性能指标
check_performance_metrics() {
    log_info "检查性能指标..."

    # 检查响应时间
    if curl -f -s -w "%{time_total}" --max-time $TIMEOUT "$HEALTH_ENDPOINT" > /dev/null 2>&1; then
        response_time=$(curl -f -s -w "%{time_total}" --max-time $TIMEOUT "$HEALTH_ENDPOINT" 2>/dev/null)
        if (( $(echo "$response_time > 2.0" | bc -l) )); then
            log_warning "响应时间较慢: ${response_time}s"
        else
            log_success "响应时间正常: ${response_time}s"
        fi
    fi

    # 检查页面大小
    if curl -f -s -I --max-time $TIMEOUT "$HEALTH_ENDPOINT" > /dev/null 2>&1; then
        page_size=$(curl -f -s -I --max-time $TIMEOUT "$HEALTH_ENDPOINT" | grep -i content-length | awk '{print $2}' | tr -d '\r')
        if [ -n "$page_size" ]; then
            page_size_kb=$((page_size / 1024))
            if [ "$page_size_kb" -gt 100 ]; then
                log_warning "页面大小较大: ${page_size_kb}KB"
            else
                log_success "页面大小正常: ${page_size_kb}KB"
            fi
        fi
    fi
}

# 主健康检查函数
main_health_check() {
    local failed_checks=0
    local total_checks=0

    log_info "开始 Xorigo UI 健康检查..."

    # 系统资源检查
    echo
    log_info "=== 系统资源检查 ==="
    ((total_checks++))
    check_system_resources || ((failed_checks++))

    # 端口检查
    echo
    log_info "=== 端口状态检查 ==="
    ((total_checks++))
    check_port 3100 "Nginx" || ((failed_checks++))

    # 进程检查
    echo
    log_info "=== 进程状态检查 ==="
    ((total_checks++))
    check_process "nginx" "Nginx" || ((failed_checks++))

    # 端点健康检查
    echo
    log_info "=== 端点健康检查 ==="

    ((total_checks++))
    check_endpoint "$HEALTH_ENDPOINT" "主页健康检查" $RETRY_COUNT || ((failed_checks++))

    ((total_checks++))
    check_endpoint "$API_HEALTH_ENDPOINT" "API健康检查" $RETRY_COUNT || ((failed_checks++))

    ((total_checks++))
    check_endpoint "$METRICS_ENDPOINT" "指标端点" $RETRY_COUNT || ((failed_checks++))

    ((total_checks++))
    check_endpoint "$WEB_VITALS_ENDPOINT" "Web Vitals端点" $RETRY_COUNT || ((failed_checks++))

    # 性能检查
    echo
    log_info "=== 性能指标检查 ==="
    ((total_checks++))
    check_performance_metrics || ((failed_checks++))

    # 日志检查
    echo
    log_info "=== 日志错误检查 ==="
    ((total_checks++))
    check_log_errors "/var/log/nginx/error.log" "Nginx" || ((failed_checks++))

    # 总结
    echo
    log_info "=== 健康检查总结 ==="
    if [ $failed_checks -eq 0 ]; then
        log_success "所有健康检查通过！ (${total_checks}/${total_checks})"
        return 0
    else
        log_error "健康检查失败：${failed_checks}/${total_checks} 项检查未通过"
        return 1
    fi
}

# 生成健康报告
generate_health_report() {
    local report_file="/app/logs/health-report-$(date +%Y%m%d-%H%M%S).log"

    echo "Xorigo UI 健康检查报告" > "$report_file"
    echo "检查时间: $(date)" >> "$report_file"
    echo "检查结果: $1" >> "$report_file"
    echo "================================" >> "$report_file"

    # 添加系统信息
    echo "系统信息:" >> "$report_file"
    uname -a >> "$report_file"
    echo >> "$report_file"

    # 添加容器信息（如果在容器中）
    if [ -f /.dockerenv ]; then
        echo "容器信息:" >> "$report_file"
        cat /proc/1/cgroup | head -5 >> "$report_file"
        echo >> "$report_file"
    fi

    # 添加资源使用情况
    echo "资源使用情况:" >> "$report_file"
    free -h >> "$report_file"
    df -h >> "$report_file"

    log_info "健康检查报告已生成: $report_file"
}

# 命令行参数处理
case "${1:-full}" in
    "full")
        main_health_check
        if [ $? -eq 0 ]; then
            generate_health_report "SUCCESS"
            exit 0
        else
            generate_health_report "FAILED"
            exit 1
        fi
        ;;
    "basic")
        check_endpoint "$HEALTH_ENDPOINT" "主页健康检查" 3
        ;;
    "system")
        check_system_resources
        ;;
    "performance")
        check_performance_metrics
        ;;
    *)
        echo "用法: $0 [full|basic|system|performance]"
        echo "  full        - 完整健康检查（默认）"
        echo "  basic       - 基础健康检查"
        echo "  system      - 系统资源检查"
        echo "  performance - 性能指标检查"
        exit 1
        ;;
esac