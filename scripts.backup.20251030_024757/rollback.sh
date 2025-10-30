#!/bin/bash

# ============================================
# Xorigo UI 快速回滚脚本 - Phase 6
# 自动回滚 + 版本管理 + 快速恢复
# ============================================

set -euo pipefail

# 配置变量
COMPOSE_FILE="docker-compose.prod.yml"
BACKUP_DIR="backups"
ROLLBACK_REASON="${1:-manual}"
HEALTH_CHECK_TIMEOUT=180

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

log_rollback() {
    echo -e "${PURPLE}[ROLLBACK]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"
}

log_command() {
    echo -e "${CYAN}[COMMAND]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"
}

# 获取最新备份
get_latest_backup() {
    local latest_backup=$(ls -1t "$BACKUP_DIR" 2>/dev/null | head -1)

    if [ -z "$latest_backup" ]; then
        log_error "没有找到任何备份"
        return 1
    fi

    echo "$BACKUP_DIR/$latest_backup"
}

# 列出可用备份
list_backups() {
    log_info "可用备份列表:"

    if [ ! -d "$BACKUP_DIR" ]; then
        log_warning "备份目录不存在: $BACKUP_DIR"
        return 1
    fi

    local backup_count=0
    while IFS= read -r -d '' backup; do
        backup_count=$((backup_count + 1))
        local backup_name=$(basename "$backup")
        local backup_time=$(echo "$backup_name" | sed 's/.*-\([0-9]*-[0-9]*\).*/\1/' | sed 's/\([0-9]\{4\}\)\([0-9]\{2\}\)\([0-9]\{2\}\)-\([0-9]\{2\}\)\([0-9]\{2\}\)\([0-9]\{2\}\)/\1-\2-\3 \4:\5:\6/')

        echo "  $backup_count. $backup_name ($backup_time)"

        # 显示备份内容
        if [ -f "$backup/current-images.txt" ]; then
            echo "     镜像版本:"
            cat "$backup/current-images.txt" | sed 's/^/       /'
        fi
        echo
    done < <(find "$BACKUP_DIR" -maxdepth 1 -type d -printf "%p\0" | sort -z -r)

    if [ $backup_count -eq 0 ]; then
        log_warning "没有找到任何备份"
        return 1
    fi

    return 0
}

# 验证备份完整性
verify_backup() {
    local backup_path="$1"

    log_info "验证备份完整性: $backup_path"

    # 检查必需文件
    local required_files=(
        "docker-compose.yml"
    )

    for file in "${required_files[@]}"; do
        if [ ! -f "$backup_path/$file" ]; then
            log_error "备份缺少必需文件: $file"
            return 1
        fi
    done

    # 验证 docker-compose.yml 格式
    if ! docker-compose -f "$backup_path/docker-compose.yml" config &>/dev/null; then
        log_error "docker-compose.yml 格式无效"
        return 1
    fi

    log_success "备份完整性验证通过"
    return 0
}

# 停止当前服务
stop_current_services() {
    log_rollback "停止当前服务..."

    if docker-compose -f "$COMPOSE_FILE" ps -q &>/dev/null; then
        log_command "docker-compose -f $COMPOSE_FILE down"
        docker-compose -f "$COMPOSE_FILE" down

        # 等待容器完全停止
        log_info "等待容器完全停止..."
        sleep 10
    else
        log_info "没有运行中的服务"
    fi

    log_success "当前服务已停止"
}

# 恢复配置文件
restore_config_files() {
    local backup_path="$1"

    log_rollback "恢复配置文件..."

    # 备份当前配置
    if [ -f "$COMPOSE_FILE" ]; then
        cp "$COMPOSE_FILE" "$COMPOSE_FILE.backup.$(date +%Y%m%d-%H%M%S)"
    fi

    # 恢复配置文件
    cp "$backup_path/docker-compose.yml" "$COMPOSE_FILE"

    # 恢复环境变量文件
    if [ -f "$backup_path/.env" ]; then
        if [ -f ".env.production" ]; then
            cp ".env.production" ".env.production.backup.$(date +%Y%m%d-%H%M%S)"
        fi
        cp "$backup_path/.env" ".env.production"
    fi

    log_success "配置文件恢复完成"
}

# 恢复镜像版本
restore_image_versions() {
    local backup_path="$1"

    log_rollback "恢复镜像版本..."

    if [ -f "$backup_path/current-images.txt" ]; then
        log_info "从备份恢复镜像版本..."

        # 这里可以实现具体的镜像版本恢复逻辑
        # 例如：docker tag current_image:latest backup_image:version
        log_warning "镜像版本恢复需要手动实现"
        log_info "备份的镜像信息保存在: $backup_path/current-images.txt"
    fi

    log_success "镜像版本信息已记录"
}

# 启动恢复的服务
start_restored_services() {
    log_rollback "启动恢复的服务..."

    log_command "docker-compose -f $COMPOSE_FILE up -d"

    if docker-compose -f "$COMPOSE_FILE" up -d; then
        log_success "服务启动成功"
    else
        log_error "服务启动失败"
        return 1
    fi
}

# 健康检查恢复的服务
health_check_restored_services() {
    log_rollback "执行恢复后健康检查..."

    local max_wait=$HEALTH_CHECK_TIMEOUT
    local wait_count=0

    log_info "等待服务启动并完成健康检查..."

    while [ $wait_count -lt $max_wait ]; do
        if curl -f http://localhost:3100/health &>/dev/null; then
            log_success "恢复后健康检查通过"
            return 0
        fi

        wait_count=$((wait_count + 10))
        echo -n "."
        sleep 10
    done

    echo
    log_error "恢复后健康检查超时"
    return 1
}

# 记录回滚事件
log_rollback_event() {
    local backup_path="$1"
    local status="$2"
    local reason="$3"

    local log_file="rollback-history.log"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    echo "[$timestamp] Rollback $status: $backup_path | Reason: $reason" >> "$log_file"

    log_info "回滚事件已记录到: $log_file"
}

# 创建回滚后备份
create_post_rollback_backup() {
    log_info "创建回滚后备份..."

    local post_rollback_dir="$BACKUP_DIR/post-rollback-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$post_rollback_dir"

    # 备份回滚后的状态
    if [ -f "$COMPOSE_FILE" ]; then
        cp "$COMPOSE_FILE" "$post_rollback_dir/docker-compose.yml"
    fi

    if [ -f ".env.production" ]; then
        cp ".env.production" "$post_rollback_dir/.env"
    fi

    # 记录回滚信息
    cat > "$post_rollback_dir/rollback-info.txt" << EOF
回滚信息:
- 回滚时间: $(date)
- 回滚原因: $ROLLBACK_REASON
- 原始备份: $1
- 回滚状态: $2
EOF

    log_success "回滚后备份已创建: $post_rollback_dir"
}

# 自动回滚到上一个版本
auto_rollback() {
    log_rollback "执行自动回滚..."

    local latest_backup=$(get_latest_backup)

    if [ $? -eq 0 ]; then
        log_info "自动回滚到: $latest_backup"
        perform_rollback "$latest_backup"
    else
        log_error "无法找到可用备份进行自动回滚"
        return 1
    fi
}

# 交互式回滚
interactive_rollback() {
    log_rollback "启动交互式回滚..."

    if ! list_backups; then
        log_error "没有可用备份进行回滚"
        return 1
    fi

    echo -n "请选择要回滚到的备份编号 (1-N), 或 'latest' 回滚到最新版本: "
    read -r choice

    if [ "$choice" = "latest" ]; then
        auto_rollback
    elif [[ "$choice" =~ ^[0-9]+$ ]]; then
        local backup_list=($(ls -1t "$BACKUP_DIR"))
        local selected_backup="${backup_list[$((choice - 1))]}"

        if [ -n "$selected_backup" ] && [ -d "$BACKUP_DIR/$selected_backup" ]; then
            log_info "选择回滚到: $selected_backup"
            perform_rollback "$BACKUP_DIR/$selected_backup"
        else
            log_error "无效的备份编号: $choice"
            return 1
        fi
    else
        log_error "无效的选择: $choice"
        return 1
    fi
}

# 执行回滚
perform_rollback() {
    local backup_path="$1"

    log_rollback "开始回滚到: $backup_path"

    # 记录回滚开始
    log_rollback_event "$backup_path" "STARTED" "$ROLLBACK_REASON"

    # 验证备份
    if ! verify_backup "$backup_path"; then
        log_rollback_event "$backup_path" "FAILED" "备份验证失败"
        return 1
    fi

    # 停止当前服务
    stop_current_services

    # 恢复配置文件
    restore_config_files "$backup_path"

    # 恢复镜像版本
    restore_image_versions "$backup_path"

    # 启动恢复的服务
    if ! start_restored_services; then
        log_rollback_event "$backup_path" "FAILED" "服务启动失败"
        return 1
    fi

    # 健康检查
    if ! health_check_restored_services; then
        log_rollback_event "$backup_path" "FAILED" "健康检查失败"
        return 1
    fi

    # 创建回滚后备份
    create_post_rollback_backup "$backup_path"

    # 记录成功回滚
    log_rollback_event "$backup_path" "SUCCESS" "$ROLLBACK_REASON"

    log_success "🎉 回滚成功完成！"
    echo
    log_info "📍 当前状态:"
    log_info "   回滚到版本: $backup_path"
    log_info "   健康检查: 通过"
    log_info "   访问地址: http://localhost:3100"
    echo
    log_info "🔧 后续操作:"
    log_info "   查看服务状态: docker-compose -f $COMPOSE_FILE ps"
    log_info "   查看日志: docker-compose -f $COMPOSE_FILE logs -f"
    log_info "   健康检查: ./scripts/health-check.sh"

    return 0
}

# 显示回滚历史
show_rollback_history() {
    local log_file="rollback-history.log"

    if [ -f "$log_file" ]; then
        log_info "回滚历史记录:"
        cat "$log_file" | tail -20
    else
        log_info "没有找到回滚历史记录"
    fi
}

# 主函数
main() {
    local action="${1:-interactive}"

    case "$action" in
        "interactive")
            interactive_rollback
            ;;
        "auto")
            auto_rollback
            ;;
        "list")
            list_backups
            ;;
        "history")
            show_rollback_history
            ;;
        "help"|"-h"|"--help")
            cat << EOF
Xorigo UI 快速回滚脚本

用法: $0 [选项] [原因]

选项:
  interactive          交互式回滚 (默认)
  auto                 自动回滚到最新备份
  list                 列出可用备份
  history              显示回滚历史
  help, -h, --help     显示此帮助信息

示例:
  $0                           # 交互式回滚
  $0 auto "部署失败"            # 自动回滚，指定原因
  $0 list                      # 列出可用备份
  $0 history                   # 显示回滚历史

环境变量:
  ROLLBACK_REASON    回滚原因 (默认: manual)

EOF
            ;;
        *)
            log_error "未知操作: $action"
            echo "使用 '$0 help' 查看帮助信息"
            exit 1
            ;;
    esac
}

# 检查备份目录
if [ ! -d "$BACKUP_DIR" ]; then
    log_warning "备份目录不存在，创建: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
fi

# 设置默认回滚原因
if [ -z "${ROLLBACK_REASON:-}" ] && [ $# -gt 0 ] && [ "$1" != "interactive" ] && [ "$1" != "auto" ] && [ "$1" != "list" ] && [ "$1" != "history" ] && [ "$1" != "help" ] && [ "$1" != "-h" ] && [ "$1" != "--help" ]; then
    ROLLBACK_REASON="$1"
    shift
fi

# 导出环境变量
export ROLLBACK_REASON

# 执行主函数
main "$@"