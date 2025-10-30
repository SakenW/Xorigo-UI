#!/bin/bash
# Docker 管理脚本

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

case "$1" in
    "dev"|"development")
        bash "$SCRIPT_DIR/docker-dev.sh"
        ;;
    "prod"|"production")
        bash "$SCRIPT_DIR/docker-prod.sh"
        ;;
    "cleanup"|"clean")
        bash "$SCRIPT_DIR/docker-cleanup.sh"
        ;;
    *)
        echo "用法: $0 {dev|prod|cleanup}"
        echo "  dev     - 开发环境Docker"
        echo "  prod    - 生产环境Docker"
        echo "  cleanup - 清理Docker资源"
        exit 1
        ;;
esac
