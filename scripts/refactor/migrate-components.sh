#!/bin/bash

################################################################################
# Xorigo UI 组件库分层架构迁移脚本
# 
# 功能:
# 1. 分析现有组件结构
# 2. 创建4层目录结构
# 3. 自动迁移组件到正确层级
# 4. 更新导入路径和依赖关系
# 5. 验证迁移结果
#
# 使用方法:
#   ./scripts/refactor/migrate-components.sh --phase 1 --dry-run
#
################################################################################

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="/home/saken/project/Xorigo-UI"
CORE_SRC="$PROJECT_ROOT/packages/core/src"

# 目标目录结构
declare -A LAYER_DIRS=(
    ["01-atoms"]="$CORE_SRC/01-atoms"
    ["02-components"]="$CORE_SRC/02-components"
    ["03-composites"]="$CORE_SRC/03-composites"
    ["04-pages"]="$CORE_SRC/04-pages"
)

# 组件分类到图层的映射
declare -A CATEGORY_TO_LAYER=(
    ["primitives"]="01-atoms"
    ["utilities"]="01-atoms"
    ["effects"]="01-atoms"
    ["motion"]="01-atoms"
    
    ["inputs"]="02-components"
    ["data-display"]="02-components"
    ["feedback"]="02-components"
    ["layout"]="02-components"
    ["overlays"]="02-components"
    ["typography"]="02-components"
    
    ["forms"]="03-composites"
    ["charts"]="03-composites"
    ["navigation"]="03-composites"
    ["interactive"]="03-composites"
    
    ["blocks"]="04-pages"
    ["templates"]="04-pages"
    ["showcase"]="04-pages"
    ["labs"]="04-pages"
)

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

# 打印使用说明
usage() {
    cat << USAGE
用法: $0 [选项]

选项:
    --phase <1-4>        指定迁移阶段 (1=原子, 2=基础, 3=组合, 4=页面, all=全部)
    --category <name>    迁移指定分类 (如: primitives, inputs)
    --dry-run           仅模拟迁移，不实际执行
    --validate          仅验证，不迁移
    --check-deps        检查依赖关系
    --help              显示此帮助信息

示例:
    $0 --phase 1 --dry-run              # 模拟迁移第1层
    $0 --category primitives            # 迁移primitives分类
    $0 --phase all                      # 迁移所有层
    $0 --validate                       # 验证现有结构
    $0 --check-deps                     # 检查依赖关系

USAGE
    exit 1
}

# 解析命令行参数
DRY_RUN=false
VALIDATE_ONLY=false
CHECK_DEPS_ONLY=false
PHASE=""
CATEGORY=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --phase)
            PHASE="$2"
            shift 2
            ;;
        --category)
            CATEGORY="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --validate)
            VALIDATE_ONLY=true
            shift
            ;;
        --check-deps)
            CHECK_DEPS_ONLY=true
            shift
            ;;
        --help)
            usage
            ;;
        *)
            log_error "未知参数: $1"
            usage
            ;;
    esac
done

# 检查参数
if [[ -z "$PHASE" && -z "$CATEGORY" && "$VALIDATE_ONLY" == "false" && "$CHECK_DEPS_ONLY" == "false" ]]; then
    log_error "请指定 --phase, --category, --validate 或 --check-deps"
    usage
fi

################################################################################
# 核心函数
################################################################################

# 1. 分析现有组件结构
analyze_structure() {
    log_info "分析现有组件结构..."
    
    echo ""
    echo "=== 组件统计 ==="
    find "$CORE_SRC" -maxdepth 2 -type d -name "components" -prune -o -type d -print | while read dir; do
        category=$(basename "$dir")
        count=$(find "$dir" -name "*.tsx" 2>/dev/null | wc -l)
        if [[ $count -gt 0 ]]; then
            echo "  $category: $count 个组件"
        fi
    done
    
    echo ""
    echo "=== 目录结构检查 ==="
    ls -la "$CORE_SRC" | grep "^d"
}

# 2. 创建4层目录结构
create_directory_structure() {
    log_info "创建4层目录结构..."
    
    for layer in "${!LAYER_DIRS[@]}"; do
        dir="${LAYER_DIRS[$layer]}"
        if [[ "$DRY_RUN" == "false" ]]; then
            mkdir -p "$dir"
            log_success "创建目录: $dir"
        else
            echo "[DRY-RUN] 创建目录: $dir"
        fi
    done
    
    # 创建子目录
    for layer in "${!LAYER_DIRS[@]}"; do
        dir="${LAYER_DIRS[$layer]}"
        case $layer in
            "01-atoms")
                mkdir -p "$dir"/{primitives,utilities,effects,motion}
                ;;
            "02-components")
                mkdir -p "$dir"/{inputs,data-display,feedback,layout,overlays,typography}
                ;;
            "03-composites")
                mkdir -p "$dir"/{forms,charts,navigation,interactive}
                ;;
            "04-pages")
                mkdir -p "$dir"/{blocks,templates,showcase,labs}
                ;;
        esac
    done
}

# 3. 迁移组件
migrate_category() {
    local category=$1
    local target_layer="${CATEGORY_TO_LAYER[$category]}"
    
    if [[ -z "$target_layer" ]]; then
        log_error "未知分类: $category"
        return 1
    fi
    
    local source_dir="$CORE_SRC/$category"
    local target_dir="${LAYER_DIRS[$target_layer]}/$category"
    
    log_info "迁移分类: $category -> $target_layer"
    
    if [[ ! -d "$source_dir" ]]; then
        log_warning "源目录不存在: $source_dir"
        return 1
    fi
    
    # 创建目标目录
    if [[ "$DRY_RUN" == "false" ]]; then
        mkdir -p "$target_dir"
    else
        echo "[DRY-RUN] 创建目录: $target_dir"
    fi
    
    # 迁移文件
    find "$source_dir" -name "*.tsx" | while read file; do
        local filename=$(basename "$file")
        local target_file="$target_dir/$filename"
        
        if [[ "$DRY_RUN" == "false" ]]; then
            # 复制文件
            cp "$file" "$target_file"
            
            # 更新导入路径
            update_imports "$target_file"
            
            log_success "迁移: $filename"
        else
            echo "[DRY-RUN] 迁移: $filename -> $target_file"
        fi
    done
    
    # 创建index.ts
    if [[ "$DRY_RUN" == "false" ]]; then
        create_index_file "$target_dir" "$category"
    else
        echo "[DRY-RUN] 创建 index.ts"
    fi
}

# 4. 更新导入路径
update_imports() {
    local file=$1
    
    # 替换相对导入路径
    sed -i 's|from '\''../../utils|cva-standalone'\''|from '\''../../../utils/cva-standalone'\''|g' "$file"
    sed -i 's|from '\''../utils/cva-standalone'\''|from '\''../../../utils/cva-standalone'\''|g' "$file"
    sed -i 's|from '\''../../utils/cn'\''|from '\''../../../utils/cn'\''|g' "$file"
    sed -i 's|from '\''../utils/cn'\''|from '\''../../../utils/cn'\''|g' "$file"
    sed -i 's|from '\''../../utils'\''|from '\''../../../utils'\''|g' "$file"
    sed -i 's|from '\''../utils'\''|from '\''../../../utils'\''|g' "$file"
    
    # 更新主题导入
    sed -i 's|from '\''../../theme/theme-mapping'\''|from '\''../../../theme/theme-mapping'\''|g' "$file"
    sed -i 's|from '\''../theme/theme-mapping'\''|from '\''../../../theme/theme-mapping'\''|g' "$file"
}

# 5. 创建index.ts文件
create_index_file() {
    local dir=$1
    local category=$2
    
    echo "Creating index.ts for $category..."
    
    # 查找所有tsx文件
    find "$dir" -name "*.tsx" -type f | while read file; do
        local basename=$(basename "$file" .tsx)
        
        # 跳过测试和故事文件
        if [[ "$basename" == *.test.* || "$basename" == *.stories.* ]]; then
            return
        fi
        
        echo "export * from './$basename'" >> "$dir/index.ts"
    done
}

# 6. 验证目录结构
validate_structure() {
    log_info "验证目录结构..."
    
    local errors=0
    
    # 检查目标目录是否存在
    for layer in "${!LAYER_DIRS[@]}"; do
        dir="${LAYER_DIRS[$layer]}"
        if [[ ! -d "$dir" ]]; then
            log_error "目录不存在: $dir"
            errors=$((errors + 1))
        else
            log_success "目录存在: $dir"
        fi
    done
    
    # 检查组件文件
    for category in "${!CATEGORY_TO_LAYER[@]}"; do
        local target_layer="${CATEGORY_TO_LAYER[$category]}"
        local target_dir="${LAYER_DIRS[$target_layer]}/$category"
        
        if [[ -d "$target_dir" ]]; then
            local count=$(find "$target_dir" -name "*.tsx" 2>/dev/null | wc -l)
            echo "  $category: $count 个组件"
        fi
    done
    
    return $errors
}

# 7. 检查依赖关系
check_dependencies() {
    log_info "检查组件依赖关系..."
    
    echo ""
    echo "=== 内部依赖统计 ==="
    find "$CORE_SRC" -name "*.tsx" -exec grep -h "from ['\"]\.\./" {} \; | sort | uniq -c | sort -nr | head -20
    
    echo ""
    echo "=== 外部依赖统计 ==="
    find "$CORE_SRC" -name "*.tsx" -exec grep -h "from ['\"]@xorigo-ui/" {} \; | sort | uniq -c | sort -nr | head -20
    
    echo ""
    echo "=== 检测跨层依赖 ==="
    # TODO: 实现跨层依赖检测逻辑
    log_warning "跨层依赖检测功能待实现"
}

# 8. 生成迁移报告
generate_report() {
    log_info "生成迁移报告..."
    
    local report_file="$PROJECT_ROOT/docs/reports/migration-report-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$report_file" << REPORT
# 组件迁移报告

生成时间: $(date)

## 迁移统计

$(find "$CORE_SRC" -maxdepth 3 -name "*.tsx" 2>/dev/null | wc -l) 个组件文件

## 目录结构

$(find "$CORE_SRC" -maxdepth 2 -type d | sort)

REPORT
    
    log_success "报告已生成: $report_file"
}

# 9. 运行指定阶段
run_phase() {
    local phase=$1
    local phases=("01-atoms" "02-components" "03-composites" "04-pages")
    
    log_info "运行阶段 $phase..."
    
    case $phase in
        "1")
            migrate_layer "01-atoms"
            ;;
        "2")
            migrate_layer "02-components"
            ;;
        "3")
            migrate_layer "03-composites"
            ;;
        "4")
            migrate_layer "04-pages"
            ;;
        "all")
            for p in 1 2 3 4; do
                run_phase $p
            done
            ;;
        *)
            log_error "未知阶段: $phase"
            return 1
            ;;
    esac
}

# 10. 迁移整个图层
migrate_layer() {
    local layer=$1
    
    log_info "迁移图层: $layer"
    
    # 获取该图层的所有分类
    for category in "${!CATEGORY_TO_LAYER[@]}"; do
        if [[ "${CATEGORY_TO_LAYER[$category]}" == "$layer" ]]; then
            migrate_category "$category"
        fi
    done
}

################################################################################
# 主函数
################################################################################

main() {
    echo "========================================"
    echo "  Xorigo UI 组件库迁移工具"
    echo "========================================"
    echo ""
    
    # 验证阶段
    if [[ "$VALIDATE_ONLY" == "true" ]]; then
        analyze_structure
        validate_structure
        return 0
    fi
    
    # 检查依赖阶段
    if [[ "$CHECK_DEPS_ONLY" == "true" ]]; then
        check_dependencies
        return 0
    fi
    
    # 创建目录结构
    create_directory_structure
    
    # 执行迁移
    if [[ -n "$PHASE" ]]; then
        run_phase "$PHASE"
    elif [[ -n "$CATEGORY" ]]; then
        migrate_category "$CATEGORY"
    fi
    
    # 验证结果
    validate_structure
    
    # 生成报告
    generate_report
    
    echo ""
    echo "========================================"
    if [[ "$DRY_RUN" == "true" ]]; then
        log_warning "这是模拟运行，未实际执行迁移"
    else
        log_success "迁移完成!"
    fi
    echo "========================================"
}

# 运行主函数
main
