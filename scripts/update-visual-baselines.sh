#!/bin/bash

# 视觉基准截图更新脚本
# 用于在本地或CI环境中更新视觉回归测试的基准截图

set -e

# 颜色定义
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

# 检查参数
UPDATE_ALL=false
COMPONENT=""
THEME=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --all)
            UPDATE_ALL=true
            shift
            ;;
        --component)
            COMPONENT="$2"
            shift 2
            ;;
        --theme)
            THEME="$2"
            shift 2
            ;;
        --help|-h)
            echo "用法: $0 [选项]"
            echo ""
            echo "选项:"
            echo "  --all              更新所有基准截图"
            echo "  --component NAME   只更新指定组件的截图"
            echo "  --theme NAME       只更新指定主题的截图"
            echo "  --help, -h         显示此帮助信息"
            echo ""
            echo "示例:"
            echo "  $0 --all"
            echo "  $0 --component Button"
            echo "  $0 --theme dark"
            exit 0
            ;;
        *)
            log_error "未知参数: $1"
            echo "使用 --help 查看帮助信息"
            exit 1
            ;;
    esac
done

# 检查必要条件
if ! command -v npx &> /dev/null; then
    log_error "npx 未安装，请确保 Node.js 和 npm 已正确安装"
    exit 1
fi

if [ ! -f "playwright.config.ts" ]; then
    log_error "未找到 playwright.config.ts 配置文件"
    exit 1
fi

# 检查开发服务器是否运行
if ! curl -f http://localhost:3100 > /dev/null 2>&1; then
    log_warning "开发服务器未运行，正在启动..."
    npm run docker:dev &
    SERVER_PID=$!

    log_info "等待开发服务器启动..."
    timeout 60 bash -c 'until curl -f http://localhost:3100 > /dev/null 2>&1; do sleep 2; done' || {
        log_error "开发服务器启动超时"
        if [ ! -z "$SERVER_PID" ]; then
            kill $SERVER_PID 2>/dev/null || true
        fi
        exit 1
    }

    log_success "开发服务器已启动"
    CLEANUP_SERVER=true
else
    log_success "开发服务器已运行"
    CLEANUP_SERVER=false
fi

# 构建测试命令
TEST_COMMAND="npx playwright test --update-snapshots"

if [ "$UPDATE_ALL" = true ]; then
    log_info "更新所有视觉基准截图..."
    $TEST_COMMAND
elif [ ! -z "$COMPONENT" ]; then
    log_info "更新组件 '$COMPONENT' 的基准截图..."
    $TEST_COMMAND --grep "$COMPONENT"
elif [ ! -z "$THEME" ]; then
    log_info "更新主题 '$THEME' 的基准截图..."
    $TEST_COMMAND --grep "$THEME"
else
    log_error "请指定要更新的内容。使用 --all 更新所有，或使用 --component/--theme 指定具体内容"
    exit 1
fi

# 检查执行结果
if [ $? -eq 0 ]; then
    log_success "基准截图更新完成！"

    # 显示更新统计
    if [ -d "tests/visual/screenshots" ]; then
        SCREENSHOT_COUNT=$(find tests/visual/screenshots -name "*.png" | wc -l)
        log_info "当前基准截图数量: $SCREENSHOT_COUNT"
    fi

    # 提交建议
    log_info "建议将更新的基准截图提交到版本控制:"
    echo "  git add tests/visual/screenshots/"
    echo "  git commit -m 'chore: 更新视觉回归测试基准截图'"
    echo "  git push"
else
    log_error "基准截图更新失败"
    exit 1
fi

# 清理
if [ "$CLEANUP_SERVER" = true ] && [ ! -z "$SERVER_PID" ]; then
    log_info "停止开发服务器..."
    kill $SERVER_PID 2>/dev/null || true
fi

# 生成报告
if [ -f "playwright-report/results.json" ]; then
    log_info "生成更新报告..."

    REPORT_FILE="visual-baseline-update-report.md"
    cat > "$REPORT_FILE" << EOF
# 视觉基准截图更新报告

**更新时间**: $(date)
**更新范围**: $([ "$UPDATE_ALL" = true ] && echo "全部组件" || [ ! -z "$COMPONENT" ] && echo "组件: $COMPONENT" || echo "主题: $THEME")

## 更新统计

EOF

    # 添加具体统计信息
    if command -v jq &> /dev/null; then
        UPDATED_TESTS=$(jq '.suites | length' playwright-report/results.json 2>/dev/null || echo "未知")
        echo "- 更新的测试套件: $UPDATED_TESTS" >> "$REPORT_FILE"
    fi

    echo "- 基准截图总数: $(find tests/visual/screenshots -name "*.png" 2>/dev/null | wc -l)" >> "$REPORT_FILE"

    cat >> "$REPORT_FILE" << EOF

## 下一步

1. 仔细检查更新的基准截图是否准确
2. 提交更改到版本控制
3. 推送到远程仓库触发CI验证

EOF

    log_success "更新报告已生成: $REPORT_FILE"
fi

log_success "脚本执行完成！"