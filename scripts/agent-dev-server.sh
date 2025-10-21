#!/bin/bash

# Xorigo UI 开发服务器代理脚本
# 通过代理系统管理开发服务器，确保遵循严格约束

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 显示帮助信息
show_help() {
    cat << EOF
Xorigo UI 开发服务器代理脚本

🚨 重要约束：
- ❌ 严禁使用 npm run dev
- ✅ 必须使用 Docker 热更新容器
- ✅ 端口必须为 3100

用法: $0 [命令] [选项]

命令:
  start           启动开发环境
  stop            停止开发环境
  restart         重启开发环境
  build           构建 Docker 镜像
  rebuild         重新构建 Docker 镜像
  clean           清理 Docker 资源
  logs            查看容器日志
  status          检查开发环境状态
  info            获取 Docker 系统信息
  check           检查违规情况
  cleanup         清理违规进程
  health          健康检查
  help            显示此帮助信息

选项:
  -f, --follow    实时跟踪日志 (仅用于 logs 命令)
  -v, --verbose   详细输出
  -q, --quiet     静默模式

示例:
  $0 start                    # 启动开发环境
  $0 logs -f                  # 查看实时日志
  $0 check                    # 检查违规情况
  $0 cleanup                  # 清理违规进程

EOF
}

# 检查违规进程
check_violations() {
    print_message $BLUE "🔍 检查违规进程和端口冲突..."

    local violations_found=false

    # 检查 npm run dev 进程
    local npm_processes=$(ps aux | grep -E "npm.*run.*dev|next.*dev" | grep -v grep | wc -l)
    if [ "$npm_processes" -gt 0 ]; then
        print_message $RED "⚠️ 发现 $npm_processes 个 npm run dev 进程"
        ps aux | grep -E "npm.*run.*dev|next.*dev" | grep -v grep
        violations_found=true
    fi

    # 检查端口冲突
    local ports=("3000" "3001" "3100")
    for port in "${ports[@]}"; do
        if lsof -ti:$port > /dev/null 2>&1; then
            if [ "$port" == "3100" ]; then
                print_message $GREEN "✅ 端口 $port 正在使用 (Docker 容器)"
            else
                print_message $RED "⚠️ 端口 $port 被占用"
                lsof -ti:$port | xargs -I {} ps -p {} -o pid,ppid,cmd
                violations_found=true
            fi
        fi
    done

    if [ "$violations_found" = true ]; then
        print_message $YELLOW "🚨 发现违规情况，建议运行 '$0 cleanup' 进行清理"
        return 1
    else
        print_message $GREEN "✅ 未发现违规情况"
        return 0
    fi
}

# 清理违规进程
cleanup_processes() {
    print_message $YELLOW "🧹 清理违规进程..."

    # 强制清理 npm run dev 进程
    print_message $BLUE "清理 npm run dev 进程..."
    pkill -9 -f "npm.*run.*dev" 2>/dev/null || true
    pkill -9 -f "next.*dev" 2>/dev/null || true
    sleep 1

    # 清理顽固进程 - 更安全的方式
    print_message $BLUE "清理顽固进程..."
    # 注意：移除了危险的 killall node 命令，避免影响WSL和其他系统进程
    pgrep -f "npm.*run.*dev" | xargs -r kill -9 2>/dev/null || true
    pgrep -f "next.*dev" | xargs -r kill -9 2>/dev/null || true
    fuser -k 3000/tcp 2>/dev/null || true
    fuser -k 3001/tcp 2>/dev/null || true

    # 验证清理结果
    local remaining=$(ps aux | grep -E "npm.*run.*dev|next.*dev" | grep -v grep | wc -l)
    if [ "$remaining" -eq 0 ]; then
        print_message $GREEN "✅ 违规进程清理完成"
    else
        print_message $RED "❌ 仍有 $remaining 个违规进程"
        ps aux | grep -E "npm.*run.*dev|next.*dev" | grep -v grep
    fi
}

# 启动开发环境
start_dev() {
    print_message $BLUE "🚀 启动 Xorigo UI Docker 开发环境..."

    # 检查 Docker 状态
    if ! docker info > /dev/null 2>&1; then
        print_message $RED "❌ Docker 未运行，请先启动 Docker Desktop"
        print_message $YELLOW "💡 在 WSL2 中，需要确保 Docker Desktop 的 WSL2 集成已启用"
        exit 1
    fi

    # 检查并清理违规进程
    if check_violations; then
        print_message $GREEN "✅ 环境清洁，继续启动..."
    else
        print_message $YELLOW "⚠️ 发现违规进程，正在清理..."
        cleanup_processes
    fi

    # 停止旧容器
    print_message $BLUE "🧹 清理旧容器..."
    cd "$PROJECT_ROOT"
    docker-compose -f docker-compose.dev.monorepo.yml down 2>/dev/null || true

    # 构建并启动容器
    print_message $BLUE "🏗️ 构建 Docker 镜像..."
    docker-compose -f docker-compose.dev.monorepo.yml build

    print_message $BLUE "▶️ 启动开发容器..."
    docker-compose -f docker-compose.dev.monorepo.yml up -d

    # 等待服务就绪
    print_message $BLUE "⏳ 等待服务启动..."
    sleep 3

    # 验证启动成功
    if docker ps | grep -q xorigo-ui-website-dev; then
        print_message $GREEN "✅ Xorigo UI 开发环境已启动!"
        print_message $GREEN "📍 访问地址: http://localhost:3100"
        print_message $GREEN "🔥 热更新已启用 - 修改代码会自动刷新"
        print_message $YELLOW "📊 查看日志: $0 logs -f"
        print_message $YELLOW "🛑 停止服务: $0 stop"
    else
        print_message $RED "❌ 容器启动失败，请检查日志:"
        docker-compose -f docker-compose.dev.monorepo.yml logs
        exit 1
    fi
}

# 停止开发环境
stop_dev() {
    print_message $BLUE "🛑 停止 Xorigo UI 开发环境..."
    cd "$PROJECT_ROOT"
    docker-compose -f docker-compose.dev.monorepo.yml down
    print_message $GREEN "✅ 开发环境已停止"
}

# 重启开发环境
restart_dev() {
    print_message $BLUE "🔄 重启 Xorigo UI 开发环境..."
    stop_dev
    sleep 2
    start_dev
}

# 查看日志
show_logs() {
    local follow=false
    if [ "$1" = "-f" ] || [ "$1" = "--follow" ]; then
        follow=true
    fi

    cd "$PROJECT_ROOT"
    if [ "$follow" = true ]; then
        print_message $BLUE "📊 实时日志 (Ctrl+C 退出):"
        docker-compose -f docker-compose.dev.monorepo.yml logs -f
    else
        print_message $BLUE "📊 容器日志:"
        docker-compose -f docker-compose.dev.monoreorepo.yml logs
    fi
}

# 检查状态
check_status() {
    print_message $BLUE "🏥 检查开发环境状态..."

    # 检查 Docker 状态
    if docker info > /dev/null 2>&1; then
        print_message $GREEN "✅ Docker 运行正常"
    else
        print_message $RED "❌ Docker 未运行"
        return 1
    fi

    # 检查容器状态
    if docker ps | grep -q xorigo-ui-website-dev; then
        print_message $GREEN "✅ 容器运行正常"
    else
        print_message $YELLOW "⚠️ 容器未运行"
    fi

    # 检查端口状态
    if curl -I http://localhost:3100 > /dev/null 2>&1; then
        print_message $GREEN "✅ 端口 3100 响应正常"
    else
        print_message $YELLOW "⚠️ 端口 3100 无响应"
    fi

    # 检查违规情况
    check_violations
}

# 构建 Docker 镜像
build_docker() {
    local rebuild=false
    if [ "$1" = "rebuild" ]; then
        rebuild=true
    fi

    local action="构建"
    if [ "$rebuild" = true ]; then
        action="重新构建"
    fi

    print_message $BLUE "🏗️ ${action} Docker 镜像..."

    # 检查 Docker 状态
    if ! docker info > /dev/null 2>&1; then
        print_message $RED "❌ Docker 未运行，请先启动 Docker Desktop"
        exit 1
    fi

    # 清理违规进程
    if ! check_violations; then
        print_message $YELLOW "⚠️ 发现违规进程，正在清理..."
        cleanup_processes
    fi

    cd "$PROJECT_ROOT"

    # 如果是重新构建，先停止并清理容器
    if [ "$rebuild" = true ]; then
        print_message $BLUE "🧹 停止并清理旧容器和镜像..."
        docker-compose -f docker-compose.dev.monorepo.yml down --rmi all 2>/dev/null || true
    fi

    # 执行构建
    print_message $BLUE "🔨 开始${action} Docker 镜像..."
    docker-compose -f docker-compose.dev.monorepo.yml build

    print_message $GREEN "✅ Docker 镜像${action}完成!"
    print_message $YELLOW "💡 使用 '$0 start' 启动开发环境"
}

# 清理 Docker 资源
clean_docker() {
    print_message $BLUE "🧹 清理 Docker 资源..."

    # 检查 Docker 状态
    if ! docker info > /dev/null 2>&1; then
        print_message $RED "❌ Docker 未运行，请先启动 Docker Desktop"
        exit 1
    fi

    cd "$PROJECT_ROOT"

    # 停止并删除容器
    print_message $BLUE "🛑 停止并删除容器..."
    docker-compose -f docker-compose.dev.monorepo.yml down --volumes --remove-orphans

    # 清理未使用的镜像
    print_message $BLUE "🗑️ 清理未使用的镜像..."
    docker image prune -f

    # 清理未使用的网络
    print_message $BLUE "🌐 清理未使用的网络..."
    docker network prune -f

    # 清理未使用的卷
    print_message $BLUE "💾 清理未使用的卷..."
    docker volume prune -f

    print_message $GREEN "✅ Docker 资源清理完成!"
}

# 获取 Docker 系统信息
show_docker_info() {
    print_message $BLUE "📊 Docker 系统信息..."

    # 检查 Docker 状态
    if ! docker info > /dev/null 2>&1; then
        print_message $RED "❌ Docker 未运行，请先启动 Docker Desktop"
        exit 1
    fi

    echo ""
    print_message $GREEN "=== Docker 系统使用情况 ==="
    docker system df

    echo ""
    print_message $GREEN "=== 容器状态 ==="
    docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

    echo ""
    print_message $GREEN "=== 镜像列表 ==="
    docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"

    echo ""
    print_message $GREEN "=== 网络列表 ==="
    docker network ls

    echo ""
    print_message $GREEN "=== 卷列表 ==="
    docker volume ls
}

# 健康检查
health_check() {
    print_message $BLUE "🏥 执行健康检查..."

    local issues=0

    # Docker 检查
    if ! docker info > /dev/null 2>&1; then
        print_message $RED "❌ Docker 未运行"
        ((issues++))
    fi

    # 容器检查
    if ! docker ps | grep -q xorigo-ui-website-dev; then
        print_message $YELLOW "⚠️ 开发容器未运行"
        ((issues++))
    fi

    # 端口检查
    if ! curl -I http://localhost:3100 > /dev/null 2>&1; then
        print_message $YELLOW "⚠️ 服务端口无响应"
        ((issues++))
    fi

    # 违规检查
    if ! check_violations; then
        ((issues++))
    fi

    if [ $issues -eq 0 ]; then
        print_message $GREEN "✅ 所有检查通过，开发环境健康"
        return 0
    else
        print_message $YELLOW "⚠️ 发现 $issues 个问题，建议处理"
        return 1
    fi
}

# 主逻辑
main() {
    case "${1:-help}" in
        start)
            start_dev
            ;;
        stop)
            stop_dev
            ;;
        restart)
            restart_dev
            ;;
        build)
            build_docker
            ;;
        rebuild)
            build_docker rebuild
            ;;
        clean)
            clean_docker
            ;;
        logs)
            show_logs "$2"
            ;;
        status)
            check_status
            ;;
        info)
            show_docker_info
            ;;
        check)
            check_violations
            ;;
        cleanup)
            cleanup_processes
            ;;
        health)
            health_check
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_message $RED "❌ 未知命令: $1"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"