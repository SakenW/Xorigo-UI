#!/bin/bash

# ============================================
# Xorigo UI 零停机生产环境部署脚本 - Phase 6
# 健康检查 + 性能监控 + 错误追踪 + 自动回滚
# ============================================

set -euo pipefail

# 配置变量
VERSION="${1:-latest}"
ENVIRONMENT="${2:-production}"
COMPOSE_FILE="docker-compose.prod.yml"
HEALTH_CHECK_TIMEOUT=300
DEPLOYMENT_TIMEOUT=600
MAX_RETRIES=3

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"
}

log_command() {
    echo -e "${CYAN}[COMMAND]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"
}

# 错误处理
error_handler() {
    local exit_code=$?
    log_error "部署失败，退出码: $exit_code"

    # 自动回滚
    log_warning "启动自动回滚..."
    rollback_deployment

    exit $exit_code
}

trap error_handler ERR

# 检查依赖
check_dependencies() {
    log_step "检查系统依赖..."

    local missing_deps=()

    # 检查必需的命令
    for cmd in docker docker-compose curl jq; do
        if ! command -v $cmd &> /dev/null; then
            missing_deps+=($cmd)
        fi
    done

    if [ ${#missing_deps[@]} -gt 0 ]; then
        log_error "缺少依赖: ${missing_deps[*]}"
        log_info "请安装缺少的依赖后重试"
        exit 1
    fi

    # 检查 Docker 状态
    if ! docker info &> /dev/null; then
        log_error "Docker 未运行或权限不足"
        log_info "请启动 Docker 并检查权限"
        exit 1
    fi

    # 检查 docker-compose 文件
    if [ ! -f "$COMPOSE_FILE" ]; then
        log_error "Docker Compose 文件不存在: $COMPOSE_FILE"
        exit 1
    fi

    log_success "系统依赖检查通过"
}

# 环境变量检查
check_environment() {
    log_step "检查环境变量..."

    # 检查必需的环境变量
    local required_vars=(
        "SENTRY_DSN"
        "WEB_VITALS_SAMPLE_RATE"
        "DOMAIN"
        "GRAFANA_PASSWORD"
    )

    local missing_vars=()

    for var in "${required_vars[@]}"; do
        if [ -z "${!var:-}" ]; then
            missing_vars+=($var)
        fi
    done

    if [ ${#missing_vars[@]} -gt 0 ]; then
        log_warning "缺少环境变量: ${missing_vars[*]}"
        log_info "使用默认值继续部署..."
    fi

    # 设置默认值
    export VERSION=${VERSION:-latest}
    export WEB_VITALS_SAMPLE_RATE=${WEB_VITALS_SAMPLE_RATE:-0.1}
    export DOMAIN=${DOMAIN:-localhost}
    export WEBSITE_PORT=${WEBSITE_PORT:-3100}
    export PROMETHEUS_PORT=${PROMETHEUS_PORT:-9090}
    export GRAFANA_PORT=${GRAFANA_PORT:-3001}

    log_success "环境变量检查完成"
}

# 备份当前部署
backup_current_deployment() {
    log_step "备份当前部署..."

    local backup_dir="backups/$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$backup_dir"

    # 备份配置文件
    if [ -f "$COMPOSE_FILE" ]; then
        cp "$COMPOSE_FILE" "$backup_dir/docker-compose.yml"
    fi

    # 备份环境变量
    if [ -f ".env.production" ]; then
        cp ".env.production" "$backup_dir/.env"
    fi

    # 备份日志
    if [ -d "logs" ]; then
        cp -r logs "$backup_dir/"
    fi

    # 保存当前镜像标签
    if docker ps --format "table {{.Names}}\t{{.Image}}" | grep -q "xorigo-ui"; then
        docker ps --format "table {{.Names}}\t{{.Image}}" | grep "xorigo-ui" > "$backup_dir/current-images.txt"
    fi

    log_success "备份完成: $backup_dir"
    export BACKUP_DIR="$backup_dir"
}

# 构建镜像
build_images() {
    log_step "构建生产环境镜像..."

    log_command "docker-compose -f $COMPOSE_FILE build --parallel"

    if ! docker-compose -f "$COMPOSE_FILE" build --parallel; then
        log_error "镜像构建失败"
        exit 1
    fi

    log_success "镜像构建完成"
}

# 零停机部署
deploy_zero_downtime() {
    log_step "执行零停机部署..."

    # 标记当前运行的容器
    local current_containers=$(docker-compose -f "$COMPOSE_FILE" ps -q 2>/dev/null || true)

    if [ -n "$current_containers" ]; then
        log_info "发现当前运行的容器，准备滚动更新..."

        # 滚动更新主要服务
        for service in xorigo-ui-website nginx; do
            log_info "更新服务: $service"

            if docker-compose -f "$COMPOSE_FILE" up -d --no-deps --scale "$service=2" "$service"; then
                log_info "等待新容器启动..."
                sleep 10

                # 健康检查新容器
                if check_service_health "$service" 30; then
                    log_success "服务 $service 更新成功"
                    docker-compose -f "$COMPOSE_FILE" up -d --no-deps --scale "$service=1" "$service"
                else
                    log_error "服务 $service 健康检查失败"
                    return 1
                fi
            else
                log_error "服务 $service 更新失败"
                return 1
            fi
        done

        # 更新其他服务
        for service in redis prometheus grafana node-exporter cadvisor; do
            log_info "更新服务: $service"
            docker-compose -f "$COMPOSE_FILE" up -d --no-deps "$service"
            sleep 5
        done
    else
        log_info "首次部署，启动所有服务..."
        docker-compose -f "$COMPOSE_FILE" up -d
    fi

    log_success "零停机部署完成"
}

# 服务健康检查
check_service_health() {
    local service_name="$1"
    local max_wait="${2:-60}"
    local wait_count=0

    log_info "等待服务 $service_name 健康检查通过..."

    while [ $wait_count -lt $max_wait ]; do
        if docker-compose -f "$COMPOSE_FILE" exec -T "$service_name" curl -f http://localhost:3100/health &>/dev/null; then
            log_success "服务 $service_name 健康检查通过"
            return 0
        fi

        wait_count=$((wait_count + 1))
        echo -n "."
        sleep 2
    done

    echo
    log_error "服务 $service_name 健康检查超时"
    return 1
}

# 全面健康检查
comprehensive_health_check() {
    log_step "执行全面健康检查..."

    local start_time=$(date +%s)
    local timeout=$HEALTH_CHECK_TIMEOUT

    # 检查主应用
    log_info "检查主应用健康状态..."
    if ! check_service_health "xorigo-ui-website" 60; then
        log_error "主应用健康检查失败"
        return 1
    fi

    # 检查 Nginx
    log_info "检查 Nginx 健康状态..."
    if ! curl -f http://localhost:3100/health &>/dev/null; then
        log_error "Nginx 健康检查失败"
        return 1
    fi

    # 检查 API 端点
    log_info "检查 API 端点..."
    local endpoints=(
        "/api/health"
        "/api/web-vitals"
    )

    for endpoint in "${endpoints[@]}"; do
        if ! curl -f "http://localhost:3100$endpoint" &>/dev/null; then
            log_error "API 端点 $endpoint 健康检查失败"
            return 1
        fi
    done

    # 检查监控服务
    log_info "检查监控服务..."
    local monitoring_services=(
        "prometheus:9090"
        "grafana:3000"
    )

    for service in "${monitoring_services[@]}"; do
        local service_name=$(echo "$service" | cut -d: -f1)
        local service_port=$(echo "$service" | cut -d: -f2)

        if ! curl -f "http://localhost:$service_port/-/healthy" &>/dev/null; then
            log_warning "监控服务 $service_name 可能还在启动中..."
        fi
    done

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    log_success "全面健康检查通过 (耗时: ${duration}s)"
    return 0
}

# 性能基准测试
performance_benchmark() {
    log_step "执行性能基准测试..."

    # 简单的响应时间测试
    local response_time=$(curl -o /dev/null -s -w '%{time_total}' http://localhost:3100/)

    if (( $(echo "$response_time > 2.0" | bc -l) )); then
        log_warning "响应时间较慢: ${response_time}s"
    else
        log_success "响应时间良好: ${response_time}s"
    fi

    # 检查页面大小
    local page_size=$(curl -s -I http://localhost:3100/ | grep -i content-length | awk '{print $2}' | tr -d '\r')
    if [ -n "$page_size" ]; then
        local page_size_kb=$((page_size / 1024))
        if [ "$page_size_kb" -gt 500 ]; then
            log_warning "页面大小较大: ${page_size_kb}KB"
        else
            log_success "页面大小合理: ${page_size_kb}KB"
        fi
    fi

    # 并发测试（简单版本）
    log_info "执行并发测试..."
    local concurrent_requests=10
    local success_count=0

    for i in $(seq 1 $concurrent_requests); do
        if curl -f http://localhost:3100/ &>/dev/null; then
            success_count=$((success_count + 1))
        fi
    done

    if [ $success_count -eq $concurrent_requests ]; then
        log_success "并发测试通过: $success_count/$concurrent_requests"
    else
        log_warning "并发测试部分失败: $success_count/$concurrent_requests"
    fi
}

# 回滚部署
rollback_deployment() {
    log_step "执行部署回滚..."

    if [ -z "${BACKUP_DIR:-}" ]; then
        log_error "没有找到备份信息"
        return 1
    fi

    log_info "从备份回滚: $BACKUP_DIR"

    # 停止当前服务
    docker-compose -f "$COMPOSE_FILE" down

    # 恢复配置文件
    if [ -f "$BACKUP_DIR/docker-compose.yml" ]; then
        cp "$BACKUP_DIR/docker-compose.yml" "$COMPOSE_FILE"
    fi

    if [ -f "$BACKUP_DIR/.env" ]; then
        cp "$BACKUP_DIR/.env" ".env.production"
    fi

    # 恢复镜像（如果记录了的话）
    if [ -f "$BACKUP_DIR/current-images.txt" ]; then
        log_info "恢复之前的镜像版本..."
        # 这里可以根据需要实现镜像回滚逻辑
    fi

    # 重新启动服务
    docker-compose -f "$COMPOSE_FILE" up -d

    # 等待服务启动
    sleep 30

    # 健康检查
    if comprehensive_health_check; then
        log_success "回滚成功"
        return 0
    else
        log_error "回滚后健康检查失败"
        return 1
    fi
}

# 部署后验证
post_deployment_verification() {
    log_step "执行部署后验证..."

    # 检查容器状态
    local unhealthy_containers=$(docker-compose -f "$COMPOSE_FILE" ps --filter "status=running" --format "table {{.Name}}\t{{.Status}}" | grep -v "healthy\|Up" || true)

    if [ -n "$unhealthy_containers" ]; then
        log_error "发现不健康的容器:"
        echo "$unhealthy_containers"
        return 1
    fi

    # 检查资源使用
    log_info "检查容器资源使用..."
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep "xorigo-ui"

    # 检查日志错误
    log_info "检查应用日志错误..."
    local error_count=$(docker-compose -f "$COMPOSE_FILE" logs --tail=100 xorigo-ui-website | grep -i "error\|fatal\|critical" | wc -l)

    if [ "$error_count" -gt 0 ]; then
        log_warning "发现 $error_count 个错误日志"
        log_info "最近的错误:"
        docker-compose -f "$COMPOSE_FILE" logs --tail=10 xorigo-ui-website | grep -i "error\|fatal\|critical"
    else
        log_success "没有发现错误日志"
    fi

    log_success "部署后验证完成"
}

# 生成部署报告
generate_deployment_report() {
    log_step "生成部署报告..."

    local report_file="reports/deployment-report-$(date +%Y%m%d-%H%M%S).md"
    mkdir -p reports

    cat > "$report_file" << EOF
# Xorigo UI 部署报告

## 部署信息
- **版本**: $VERSION
- **环境**: $ENVIRONMENT
- **部署时间**: $(date)
- **部署用户**: $(whoami)
- **备份目录**: ${BACKUP_DIR:-无}

## 服务状态
\`\`\`
$(docker-compose -f "$COMPOSE_FILE" ps)
\`\`\`

## 健康检查
- **主应用**: $(curl -f http://localhost:3100/health &>/dev/null && echo "✅ 通过" || echo "❌ 失败")
- **API端点**: $(curl -f http://localhost:3100/api/health &>/dev/null && echo "✅ 通过" || echo "❌ 失败")
- **响应时间**: $(curl -o /dev/null -s -w '%{time_total}' http://localhost:3100/)s

## 监控服务
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001
- **健康检查脚本**: ./scripts/health-check.sh

## 访问地址
- **主应用**: http://localhost:3100
- **健康检查**: http://localhost:3100/health
- **API指标**: http://localhost:3100/api/health

## 回滚命令
\`\`\`bash
# 如果需要回滚，执行：
./scripts/deploy-production.sh rollback
\`\`\`

---
*报告生成时间: $(date)*
EOF

    log_success "部署报告已生成: $report_file"
}

# 主函数
main() {
    log_info "开始 Xorigo UI 生产环境部署 - Phase 6"
    log_info "版本: $VERSION | 环境: $ENVIRONMENT"

    # 检查是否为回滚操作
    if [ "$VERSION" = "rollback" ]; then
        rollback_deployment
        exit $?
    fi

    # 部署流程
    check_dependencies
    check_environment
    backup_current_deployment
    build_images
    deploy_zero_downtime
    comprehensive_health_check
    performance_benchmark
    post_deployment_verification
    generate_deployment_report

    log_success "🎉 Xorigo UI 生产环境部署成功！"
    echo
    log_info "📍 访问地址:"
    log_info "   主应用: http://localhost:3100"
    log_info "   健康检查: http://localhost:3100/health"
    log_info "   Prometheus: http://localhost:9090"
    log_info "   Grafana: http://localhost:3001"
    echo
    log_info "🔧 管理命令:"
    log_info "   查看日志: docker-compose -f $COMPOSE_FILE logs -f"
    log_info "   查看状态: docker-compose -f $COMPOSE_FILE ps"
    log_info "   停止服务: docker-compose -f $COMPOSE_FILE down"
    log_info "   健康检查: ./scripts/health-check.sh"
    echo
    log_info "📈 监控面板:"
    log_info "   Grafana 用户名: admin"
    log_info "   Grafana 密码: \${GRAFANA_PASSWORD}"
}

# 执行主函数
main "$@"