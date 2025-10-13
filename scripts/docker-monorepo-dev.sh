#!/bin/bash

# ============================================
# Xorigo UI Monorepo Docker 开发环境启动脚本
# 支持 Website + Packages 完整热更新
# ============================================

set -e

# 脚本参数
COMPOSE_FILE="docker-compose.dev.monorepo.yml"
SERVICE_NAME="xorigo-ui-website"

# 颜色输出函数
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "${BLUE}"
    echo "=========================================="
    echo "  Xorigo UI Monorepo Docker 开发环境"
    echo "=========================================="
    echo -e "${NC}"
}

# 主函数
main() {
    print_header

    # 检查 Docker 是否运行
    print_status "检查 Docker 环境..."
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker 未运行，请先启动 Docker"
        echo ""
        echo "📋 安装 Docker:"
        echo "  - Ubuntu/Debian: sudo apt-get install docker.io docker-compose"
        echo "  - CentOS/RHEL: sudo yum install docker docker-compose"
        echo "  - macOS: 下载 Docker Desktop for Mac"
        echo ""
        echo "🔗 官方文档: https://docs.docker.com/get-docker/"
        exit 1
    fi
    print_success "Docker 环境正常"

    # 检查 Docker Compose 文件
    print_status "检查配置文件..."
    if [ ! -f "$COMPOSE_FILE" ]; then
        print_error "Docker Compose 配置文件不存在: $COMPOSE_FILE"
        exit 1
    fi
    print_success "配置文件存在: $COMPOSE_FILE"

    # 停止并移除旧容器
    print_status "清理旧容器..."
    docker-compose -f "$COMPOSE_FILE" down --remove-orphans 2>/dev/null || true
    print_success "旧容器已清理"

    # 构建镜像
    print_status "构建 Docker 镜像..."
    docker-compose -f "$COMPOSE_FILE" build --parallel
    print_success "Docker 镜像构建完成"

    # 启动服务
    print_status "启动开发服务..."
    docker-compose -f "$COMPOSE_FILE" up -d

    # 等待服务就绪
    print_status "等待服务启动..."
    sleep 10

    # 检查容器状态
    print_status "检查服务状态..."

    if docker ps | grep -q "$SERVICE_NAME"; then
        print_success "Xorigo UI Monorepo 开发环境已启动!"
        echo ""
        echo "🌐 访问地址:"
        echo "  • Website: http://localhost:3100"
        echo "  • Core Library: http://localhost:5173"
        echo "  • Monitor Panel: http://localhost:3101"
        echo "  • Storybook: http://localhost:6009"
        echo ""
        echo "🔧 管理命令:"
        echo "  • 查看日志: docker-compose -f $COMPOSE_FILE logs -f"
        echo "  • 重启服务: docker-compose -f $COMPOSE_FILE restart"
        echo "  • 停止服务: docker-compose -f $COMPOSE_FILE down"
        echo "  • 重建镜像: docker-compose -f $COMPOSE_FILE build --no-cache"
        echo ""
        echo "🔥 热更新功能:"
        echo "  • Website: 修改 apps/website/src/ 会自动刷新"
        echo "  • Packages: 修改 packages/*/src/ 会自动更新"
        echo "  • 配置文件: 修改 *.config.ts 会自动重载"
        echo ""
        echo "🐳 调试命令:"
        echo "  • 进入容器: docker exec -it xorigo-ui-website-dev bash"
        echo "  • 运行命令: docker exec -it xorigo-ui-website-dev npm run <command>"
        echo ""
        print_success "开发环境启动完成! 🎉"

        # 可选：自动打开浏览器
        if command -v xdg-open > /dev/null 2>&1; then
            # Linux
            xdg-open "http://localhost:3100" 2>/dev/null &
        elif command -v open > /dev/null 2>&1; then
            # macOS
            open "http://localhost:3100" 2>/dev/null &
        elif command -v start > /dev/null 2>&1; then
            # Windows
            start "http://localhost:3100" 2>/dev/null &
        fi

    else
        print_error "容器启动失败!"
        echo ""
        echo "📊 查看详细日志:"
        docker-compose -f "$COMPOSE_FILE" logs
        echo ""
        echo "🔍 常见问题排查:"
        echo "  1. 检查端口是否被占用: lsof -i :3100"
        echo "  2. 检查磁盘空间: df -h"
        echo "  3. 检查 Docker 资源: docker system df"
        echo "  4. 检查容器状态: docker ps -a"
        echo ""
        exit 1
    fi
}

# 处理命令行参数
case "${1:-}" in
    "stop"|"down")
        print_status "停止服务..."
        docker-compose -f "$COMPOSE_FILE" down --remove-orphans
        print_success "服务已停止"
        ;;
    "restart")
        print_status "重启服务..."
        docker-compose -f "$COMPOSE_FILE" restart
        print_success "服务已重启"
        ;;
    "logs"|"log")
        print_status "查看服务日志..."
        docker-compose -f "$COMPOSE_FILE" logs -f
        ;;
    "build"|"rebuild")
        print_status "重新构建镜像..."
        docker-compose -f "$COMPOSE_FILE" build --no-cache --parallel
        print_success "镜像重新构建完成"
        ;;
    "status")
        print_status "检查服务状态..."
        docker-compose -f "$COMPOSE_FILE" ps
        ;;
    "exec"|"shell")
        print_status "进入容器 Shell..."
        docker exec -it "$SERVICE_NAME-dev" bash
        ;;
    "clean")
        print_status "清理资源..."
        docker-compose -f "$COMPOSE_FILE" down --volumes --remove-orphans
        docker system prune -f
        print_success "资源清理完成"
        ;;
    "help"|"-h"|"--help")
        echo "用法: $0 [命令]"
        echo ""
        echo "可用命令:"
        echo "  (default)  启动完整的 Monorepo 开发环境"
        echo "  stop      停止所有服务"
        echo "  restart   重启所有服务"
        echo "  logs      查看服务日志"
        echo "  build     重新构建镜像"
        echo"   status    检查服务状态"
        echo "  exec      进入容器 Shell"
        echo "  clean     清理 Docker 资源"
        echo "  help      显示此帮助信息"
        ;;
    *)
        main
        ;;
esac