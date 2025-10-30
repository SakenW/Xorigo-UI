#!/bin/bash
# 测试管理脚本

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

case "$1" in
    "visual")
        bash "$SCRIPT_DIR/visual-test-runner.sh"
        ;;
    "setup")
        bash "$SCRIPT_DIR/test-setup.sh"
        ;;
    "cleanup")
        bash "$SCRIPT_DIR/test-cleanup.sh"
        ;;
    *)
        echo "用法: $0 {visual|setup|cleanup}"
        echo "  visual  - 运行视觉测试"
        echo "  setup   - 设置测试环境"
        echo "  cleanup - 清理测试环境"
        exit 1
        ;;
esac
