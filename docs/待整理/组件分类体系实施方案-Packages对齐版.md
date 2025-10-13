# 📘 Xorigo UI 组件分类体系实施方案 - Packages 对齐版

> **基于**：[Xorigo UI 组件分类体系白皮书 v1.0](./Xorigo%20UI%20组件分类体系白皮书.md)
> **目标**：将分类白皮书与当前 packages 架构对齐，提供可执行的重构方案
> **范围**：仅覆盖 packages，不涉及 website

---

## 📊 当前状态分析

### 现有目录结构

```
packages/core/src/
├── adapters/          # 适配器层（Radix 等）
├── base/              # 基础组件（部分对应白皮书的 ui）
├── blocks/            # 业务区块
├── components/        # 旧组件目录（待清理）
├── composite/         # 复合组件
│   ├── business/
│   ├── functional/
│   └── ui-pattern/
├── data/              # 数据展示组件
├── feedback/          # 反馈组件
├── form/              # 表单组件
├── layout/            # 布局组件
├── navigation/        # 导航组件
├── types/             # 类型定义
├── utils/             # 工具函数
└── visualization/     # 可视化组件
```

### 白皮书分类映射

| 白皮书分类 | 当前目录 | 对齐状态 | 需要操作 |
|-----------|---------|---------|----------|
| **ui** | `base/` | 🟡 部分对齐 | 重命名为 `ui/` |
| **inputs** | 不存在 | 🔴 缺失 | 创建 `inputs/` |
| **forms** | `form/` | 🟡 部分对齐 | 重命名为 `forms/` |
| **navigation** | `navigation/` | ✅ 完全对齐 | 无需操作 |
| **layout** | `layout/` | ✅ 完全对齐 | 无需操作 |
| **feedback** | `feedback/` | ✅ 完全对齐 | 无需操作 |
| **overlays** | 不存在 | 🔴 缺失 | 创建 `overlays/` |
| **datadisplay** | `data/` | 🟡 部分对齐 | 重命名为 `datadisplay/` |
| **charts** | `visualization/` | 🟡 部分对齐 | 重命名为 `charts/` |
| **utilities** | `utils/` | 🟡 部分对齐 | 拆分为组件和工具 |

### 特殊目录处理

| 目录 | 状态 | 处理方案 |
|------|------|---------|
| `adapters/` | 保留 | 适配器层，不属于组件分类 |
| `composite/` | 映射到 patterns | 重构为 CLI 模板 |
| `blocks/` | 映射到 patterns | 重构为 CLI 模板 |
| `components/` | 待清理 | 内容迁移后删除 |
| `types/` | 保留 | 公共类型定义 |
| `utils/` | 拆分 | 组件相关 → `utilities/`，工具函数保留 |

---

## 🎯 目标架构

### 最终目录结构

```
packages/core/src/
├── components/                    # 🆕 组件主目录（按白皮书分类）
│   ├── ui/                        # 基础UI（视觉原子）
│   │   ├── Button/
│   │   ├── Icon/
│   │   ├── Typography/
│   │   ├── Avatar/
│   │   ├── AvatarGroup/
│   │   ├── Badge/
│   │   ├── Divider/
│   │   ├── Separator/
│   │   ├── ScrollArea/
│   │   ├── Kbd/
│   │   ├── Code/
│   │   └── Surface/
│   │
│   ├── inputs/                    # 输入控件
│   │   ├── Input/
│   │   ├── Textarea/
│   │   ├── NumberInput/
│   │   ├── MaskedInput/
│   │   ├── Select/
│   │   ├── Combobox/
│   │   ├── Checkbox/
│   │   ├── Radio/
│   │   ├── Switch/
│   │   ├── ToggleGroup/
│   │   ├── SegmentedControl/
│   │   ├── Slider/
│   │   ├── Rating/
│   │   ├── DatePicker/
│   │   ├── DateRangePicker/
│   │   ├── TimePicker/
│   │   ├── Calendar/
│   │   ├── ColorPicker/
│   │   ├── FileUpload/
│   │   └── PinInput/
│   │
│   ├── forms/                     # 表单容器/逻辑
│   │   ├── Form/
│   │   ├── FormField/
│   │   ├── Fieldset/
│   │   ├── InputGroup/
│   │   ├── ValidationMessage/
│   │   ├── FormList/
│   │   └── FormLayout/
│   │
│   ├── navigation/                # 导航与结构
│   │   ├── Tabs/
│   │   ├── Breadcrumb/
│   │   ├── Pagination/
│   │   ├── Menu/
│   │   ├── DropdownMenu/
│   │   ├── ContextMenu/
│   │   ├── CommandPalette/
│   │   ├── Toolbar/
│   │   ├── Tree/
│   │   ├── Navbar/
│   │   ├── Sidebar/
│   │   └── Stepper/
│   │
│   ├── layout/                    # 布局与分区
│   │   ├── Container/
│   │   ├── Grid/
│   │   ├── Flex/
│   │   ├── Stack/
│   │   ├── Section/
│   │   ├── Spacer/
│   │   ├── SplitView/
│   │   ├── ResizablePanel/
│   │   ├── Masonry/
│   │   ├── AspectRatio/
│   │   └── AppShell/
│   │
│   ├── feedback/                  # 反馈与状态
│   │   ├── Alert/
│   │   ├── Toast/
│   │   ├── Notification/
│   │   ├── Progress/
│   │   ├── Spinner/
│   │   ├── Skeleton/
│   │   ├── Tooltip/
│   │   └── Result/
│   │
│   ├── overlays/                  # 弹层与遮罩
│   │   ├── Modal/
│   │   ├── Dialog/
│   │   ├── Drawer/
│   │   ├── Sheet/
│   │   ├── Popover/
│   │   ├── HoverCard/
│   │   ├── Lightbox/
│   │   └── OverlayTrigger/
│   │
│   ├── datadisplay/               # 数据展示
│   │   ├── Card/
│   │   ├── List/
│   │   ├── Table/
│   │   ├── TreeTable/
│   │   ├── Tag/
│   │   ├── Statistic/
│   │   ├── Timeline/
│   │   ├── Accordion/
│   │   ├── EmptyState/
│   │   ├── DescriptionList/
│   │   └── Carousel/
│   │
│   ├── charts/                    # 数据可视化
│   │   ├── Axis/
│   │   ├── Legend/
│   │   ├── ChartTooltip/
│   │   ├── LineChart/
│   │   ├── BarChart/
│   │   ├── PieChart/
│   │   ├── AreaChart/
│   │   ├── RadarChart/
│   │   ├── ScatterChart/
│   │   ├── GaugeChart/
│   │   └── Heatmap/
│   │
│   └── utilities/                 # 技术基元
│       ├── Portal/
│       ├── FocusTrap/
│       ├── FocusScope/
│       ├── DismissableLayer/
│       ├── ScrollLock/
│       ├── VisuallyHidden/
│       ├── ResizeObserver/
│       ├── IntersectionObserver/
│       ├── SSRBoundary/
│       └── ThemeProvider/
│
├── adapters/                      # 适配器层（保留）
│   └── radix/
│
├── types/                         # 公共类型（保留）
├── utils/                         # 工具函数（保留）
│   ├── color/
│   ├── matrix/
│   └── component-helpers.ts
│
└── index.ts                       # 分类聚合导出
```

---

## 🔄 迁移映射表

### 从当前目录到目标目录的完整映射

#### 1. base/ → components/ui/

| 当前文件 | 目标位置 | 操作 |
|---------|---------|------|
| `base/Button.tsx` | `components/ui/Button/index.tsx` | 移动 |
| `base/Badge.tsx` | `components/ui/Badge/index.tsx` | 移动 |
| `base/Avatar.tsx` | `components/ui/Avatar/index.tsx` | 移动 |
| `base/Card.tsx` | `components/datadisplay/Card/index.tsx` | 移动 |
| `base/Input.tsx` | `components/inputs/Input/index.tsx` | 移动 |
| `base/Textarea.tsx` | `components/inputs/Textarea/index.tsx` | 移动 |
| `base/Select.tsx` | `components/inputs/Select/index.tsx` | 移动 |
| `base/Checkbox.tsx` | `components/inputs/Checkbox/index.tsx` | 移动 |
| `base/Radio.tsx` | `components/inputs/Radio/index.tsx` | 移动 |
| `base/Switch.tsx` | `components/inputs/Switch/index.tsx` | 移动 |
| `base/Slider.tsx` | `components/inputs/Slider/index.tsx` | 移动 |
| `base/Command.tsx` | `components/navigation/CommandPalette/index.tsx` | 移动 + 重命名 |
| `base/Breadcrumb.tsx` | `components/navigation/Breadcrumb/index.tsx` | 移动 |
| `base/Tabs.tsx` | `components/navigation/Tabs/index.tsx` | 移动 |
| `base/Accordion.tsx` | `components/datadisplay/Accordion/index.tsx` | 移动 |
| `base/Skeleton.tsx` | `components/feedback/Skeleton/index.tsx` | 移动 |

#### 2. feedback/ → components/feedback/

| 当前文件 | 目标位置 | 操作 |
|---------|---------|------|
| `feedback/Alert.tsx` | `components/feedback/Alert/index.tsx` | 移动 |
| `feedback/Loading.tsx` | `components/feedback/Spinner/index.tsx` | 移动 + 重命名 |
| `feedback/ThemeToggle.tsx` | `components/utilities/ThemeProvider/ThemeToggle.tsx` | 移动 |

#### 3. navigation/ → components/navigation/

| 当前文件 | 目标位置 | 操作 |
|---------|---------|------|
| `navigation/Header.tsx` | `components/navigation/Navbar/index.tsx` | 移动 + 重命名 |
| `navigation/Sidebar.tsx` | `components/navigation/Sidebar/index.tsx` | 移动 |
| 其他导航组件 | 对应目标位置 | 移动 |

#### 4. data/ → components/datadisplay/

| 当前文件 | 目标位置 | 操作 |
|---------|---------|------|
| `data/AdvancedCard.tsx` | `components/datadisplay/Card/Advanced.tsx` | 移动 + 合并 |
| 其他数据展示组件 | 对应目标位置 | 移动 |

#### 5. form/ → components/forms/

| 当前文件 | 目标位置 | 操作 |
|---------|---------|------|
| 所有表单组件 | `components/forms/` | 直接移动 |

#### 6. layout/ → components/layout/

| 当前文件 | 目标位置 | 操作 |
|---------|---------|------|
| 所有布局组件 | `components/layout/` | 直接移动 |

#### 7. visualization/ → components/charts/

| 当前文件 | 目标位置 | 操作 |
|---------|---------|------|
| 所有可视化组件 | `components/charts/` | 直接移动 |

#### 8. composite/ → CLI templates (patterns)

| 当前文件 | 目标位置 | 操作 |
|---------|---------|------|
| `composite/business/*` | `cli/templates/patterns/` | 移动到 CLI |
| `composite/functional/*` | `cli/templates/patterns/` | 移动到 CLI |
| `composite/ui-pattern/*` | `cli/templates/patterns/` | 移动到 CLI |

#### 9. blocks/ → CLI templates (patterns)

| 当前文件 | 目标位置 | 操作 |
|---------|---------|------|
| 所有 blocks | `cli/templates/patterns/` | 移动到 CLI |

#### 10. 新增组件（overlays）

需要从 `base/` 或新创建：

| 组件 | 来源 | 操作 |
|------|------|------|
| Modal | 新建或从 base 迁移 | 创建 |
| Dialog | 可能在 adapters/radix | 移动 |
| Drawer | 新建 | 创建 |
| Sheet | 新建 | 创建 |
| Popover | 可能在 adapters/radix | 移动 |
| HoverCard | 新建 | 创建 |
| Lightbox | 新建 | 创建 |
| OverlayTrigger | 新建 | 创建 |

---

## 📋 执行步骤

### Phase 1: 准备工作（P0 - 当天完成）

#### 1.1 创建新目录结构

```bash
# 创建 components 主目录及所有分类子目录
mkdir -p packages/core/src/components/{ui,inputs,forms,navigation,layout,feedback,overlays,datadisplay,charts,utilities}

# 验证目录创建
ls -la packages/core/src/components/
```

#### 1.2 备份当前代码

```bash
# 创建备份分支
git checkout -b backup/before-classification-refactor
git add .
git commit -m "备份：组件分类重构前的代码状态"

# 切换到重构分支
git checkout -b refactor/component-classification
```

#### 1.3 创建分类元数据文件

创建 `packages/core/src/components/categories.yml`：

```yaml
version: "1.0"
components:
  ui:
    - Button
    - Icon
    - Typography
    - Avatar
    - AvatarGroup
    - Badge
    - Divider
    - Separator
    - ScrollArea
    - Kbd
    - Code
    - Surface

  inputs:
    - Input
    - Textarea
    - NumberInput
    - MaskedInput
    - Select
    - Combobox
    - Checkbox
    - Radio
    - Switch
    - ToggleGroup
    - SegmentedControl
    - Slider
    - Rating
    - DatePicker
    - DateRangePicker
    - TimePicker
    - Calendar
    - ColorPicker
    - FileUpload
    - PinInput

  forms:
    - Form
    - FormField
    - Fieldset
    - InputGroup
    - ValidationMessage
    - FormList
    - FormLayout

  navigation:
    - Tabs
    - Breadcrumb
    - Pagination
    - Menu
    - DropdownMenu
    - ContextMenu
    - CommandPalette
    - Toolbar
    - Tree
    - Navbar
    - Sidebar
    - Stepper

  layout:
    - Container
    - Grid
    - Flex
    - Stack
    - Section
    - Spacer
    - SplitView
    - ResizablePanel
    - Masonry
    - AspectRatio
    - AppShell

  feedback:
    - Alert
    - Toast
    - Notification
    - Progress
    - Spinner
    - Skeleton
    - Tooltip
    - Result

  overlays:
    - Modal
    - Dialog
    - Drawer
    - Sheet
    - Popover
    - HoverCard
    - Lightbox
    - OverlayTrigger

  datadisplay:
    - Card
    - List
    - Table
    - TreeTable
    - Tag
    - Statistic
    - Timeline
    - Accordion
    - EmptyState
    - DescriptionList
    - Carousel

  charts:
    - Axis
    - Legend
    - ChartTooltip
    - LineChart
    - BarChart
    - PieChart
    - AreaChart
    - RadarChart
    - ScatterChart
    - GaugeChart
    - Heatmap

  utilities:
    - Portal
    - FocusTrap
    - FocusScope
    - DismissableLayer
    - ScrollLock
    - VisuallyHidden
    - ResizeObserver
    - IntersectionObserver
    - SSRBoundary
    - ThemeProvider
```

### Phase 2: 组件迁移（P1 - 本周内）

#### 2.1 迁移脚本

创建 `scripts/migrate-components.sh`：

```bash
#!/bin/bash

# 组件迁移脚本
# 用法: ./scripts/migrate-components.sh

set -e

CORE_SRC="packages/core/src"
COMPONENTS_DIR="$CORE_SRC/components"

echo "🚀 开始组件分类迁移..."

# 1. 迁移 base/ → components/ui/ 和 components/inputs/
echo "📦 迁移 base/ 目录组件..."

# UI 组件
for component in Button Badge Avatar; do
  if [ -f "$CORE_SRC/base/$component.tsx" ]; then
    mkdir -p "$COMPONENTS_DIR/ui/$component"
    mv "$CORE_SRC/base/$component.tsx" "$COMPONENTS_DIR/ui/$component/index.tsx"
    echo "  ✅ 迁移 $component → components/ui/"
  fi
done

# Input 组件
for component in Input Textarea Select Checkbox Radio Switch Slider; do
  if [ -f "$CORE_SRC/base/$component.tsx" ]; then
    mkdir -p "$COMPONENTS_DIR/inputs/$component"
    mv "$CORE_SRC/base/$component.tsx" "$COMPONENTS_DIR/inputs/$component/index.tsx"
    echo "  ✅ 迁移 $component → components/inputs/"
  fi
done

# 导航组件
if [ -f "$CORE_SRC/base/Command.tsx" ]; then
  mkdir -p "$COMPONENTS_DIR/navigation/CommandPalette"
  mv "$CORE_SRC/base/Command.tsx" "$COMPONENTS_DIR/navigation/CommandPalette/index.tsx"
  echo "  ✅ 迁移 Command → components/navigation/CommandPalette/"
fi

if [ -f "$CORE_SRC/base/Breadcrumb.tsx" ]; then
  mkdir -p "$COMPONENTS_DIR/navigation/Breadcrumb"
  mv "$CORE_SRC/base/Breadcrumb.tsx" "$COMPONENTS_DIR/navigation/Breadcrumb/index.tsx"
  echo "  ✅ 迁移 Breadcrumb → components/navigation/"
fi

if [ -f "$CORE_SRC/base/Tabs.tsx" ]; then
  mkdir -p "$COMPONENTS_DIR/navigation/Tabs"
  mv "$CORE_SRC/base/Tabs.tsx" "$COMPONENTS_DIR/navigation/Tabs/index.tsx"
  echo "  ✅ 迁移 Tabs → components/navigation/"
fi

# 数据展示组件
if [ -f "$CORE_SRC/base/Card.tsx" ]; then
  mkdir -p "$COMPONENTS_DIR/datadisplay/Card"
  mv "$CORE_SRC/base/Card.tsx" "$COMPONENTS_DIR/datadisplay/Card/index.tsx"
  echo "  ✅ 迁移 Card → components/datadisplay/"
fi

if [ -f "$CORE_SRC/base/Accordion.tsx" ]; then
  mkdir -p "$COMPONENTS_DIR/datadisplay/Accordion"
  mv "$CORE_SRC/base/Accordion.tsx" "$COMPONENTS_DIR/datadisplay/Accordion/index.tsx"
  echo "  ✅ 迁移 Accordion → components/datadisplay/"
fi

# 反馈组件
if [ -f "$CORE_SRC/base/Skeleton.tsx" ]; then
  mkdir -p "$COMPONENTS_DIR/feedback/Skeleton"
  mv "$CORE_SRC/base/Skeleton.tsx" "$COMPONENTS_DIR/feedback/Skeleton/index.tsx"
  echo "  ✅ 迁移 Skeleton → components/feedback/"
fi

# 2. 迁移 feedback/ → components/feedback/
echo "📦 迁移 feedback/ 目录组件..."
if [ -d "$CORE_SRC/feedback" ]; then
  for file in "$CORE_SRC/feedback"/*.tsx; do
    if [ -f "$file" ]; then
      component=$(basename "$file" .tsx)
      if [ "$component" != "ThemeToggle" ]; then
        mkdir -p "$COMPONENTS_DIR/feedback/$component"
        mv "$file" "$COMPONENTS_DIR/feedback/$component/index.tsx"
        echo "  ✅ 迁移 $component → components/feedback/"
      fi
    fi
  done
fi

# 3. 迁移 navigation/ → components/navigation/
echo "📦 迁移 navigation/ 目录组件..."
if [ -d "$CORE_SRC/navigation" ]; then
  for file in "$CORE_SRC/navigation"/*.tsx; do
    if [ -f "$file" ]; then
      component=$(basename "$file" .tsx)
      mkdir -p "$COMPONENTS_DIR/navigation/$component"
      mv "$file" "$COMPONENTS_DIR/navigation/$component/index.tsx"
      echo "  ✅ 迁移 $component → components/navigation/"
    fi
  done
fi

# 4. 迁移 data/ → components/datadisplay/
echo "📦 迁移 data/ 目录组件..."
if [ -d "$CORE_SRC/data" ]; then
  for file in "$CORE_SRC/data"/*.tsx; do
    if [ -f "$file" ]; then
      component=$(basename "$file" .tsx)
      mkdir -p "$COMPONENTS_DIR/datadisplay/$component"
      mv "$file" "$COMPONENTS_DIR/datadisplay/$component/index.tsx"
      echo "  ✅ 迁移 $component → components/datadisplay/"
    fi
  done
fi

# 5. 迁移 form/ → components/forms/
echo "📦 迁移 form/ 目录组件..."
if [ -d "$CORE_SRC/form" ]; then
  for file in "$CORE_SRC/form"/*.tsx; do
    if [ -f "$file" ]; then
      component=$(basename "$file" .tsx)
      mkdir -p "$COMPONENTS_DIR/forms/$component"
      mv "$file" "$COMPONENTS_DIR/forms/$component/index.tsx"
      echo "  ✅ 迁移 $component → components/forms/"
    fi
  done
fi

# 6. 迁移 layout/ → components/layout/
echo "📦 迁移 layout/ 目录组件..."
if [ -d "$CORE_SRC/layout" ]; then
  for file in "$CORE_SRC/layout"/*.tsx; do
    if [ -f "$file" ]; then
      component=$(basename "$file" .tsx"
      mkdir -p "$COMPONENTS_DIR/layout/$component"
      mv "$file" "$COMPONENTS_DIR/layout/$component/index.tsx"
      echo "  ✅ 迁移 $component → components/layout/"
    fi
  done
fi

# 7. 迁移 visualization/ → components/charts/
echo "📦 迁移 visualization/ 目录组件..."
if [ -d "$CORE_SRC/visualization" ]; then
  for file in "$CORE_SRC/visualization"/*.tsx; do
    if [ -f "$file" ]; then
      component=$(basename "$file" .tsx)
      mkdir -p "$COMPONENTS_DIR/charts/$component"
      mv "$file" "$COMPONENTS_DIR/charts/$component/index.tsx"
      echo "  ✅ 迁移 $component → components/charts/"
    fi
  done
fi

echo "✅ 组件迁移完成！"
echo "📝 下一步："
echo "  1. 更新导入路径"
echo "  2. 更新 index.ts 导出"
echo "  3. 运行类型检查"
```

#### 2.2 更新导入路径脚本

创建 `scripts/update-imports.sh`：

```bash
#!/bin/bash

# 导入路径更新脚本
set -e

CORE_SRC="packages/core/src"

echo "🔧 更新导入路径..."

# 更新所有 TypeScript 文件中的导入路径
find "$CORE_SRC" -type f -name "*.tsx" -o -name "*.ts" | while read -r file; do
  # base/ → components/ui/ or components/inputs/
  sed -i "s|from ['\"]../base/Button['\"]|from '../components/ui/Button'|g" "$file"
  sed -i "s|from ['\"]../../base/Button['\"]|from '../../components/ui/Button'|g" "$file"
  sed -i "s|from ['\"]../../../base/Button['\"]|from '../../../components/ui/Button'|g" "$file"

  # feedback/ → components/feedback/
  sed -i "s|from ['\"]../feedback/Alert['\"]|from '../components/feedback/Alert'|g" "$file"
  sed -i "s|from ['\"]../../feedback/Alert['\"]|from '../../components/feedback/Alert'|g" "$file"

  # navigation/ → components/navigation/
  sed -i "s|from ['\"]../navigation/Header['\"]|from '../components/navigation/Navbar'|g" "$file"

  # data/ → components/datadisplay/
  sed -i "s|from ['\"]../data/|from '../components/datadisplay/|g" "$file"

  # form/ → components/forms/
  sed -i "s|from ['\"]../form/|from '../components/forms/|g" "$file"

  # layout/ → components/layout/
  sed -i "s|from ['\"]../layout/|from '../components/layout/|g" "$file"

  # visualization/ → components/charts/
  sed -i "s|from ['\"]../visualization/|from '../components/charts/|g" "$file"
done

echo "✅ 导入路径更新完成！"
```

#### 2.3 更新主导出文件

更新 `packages/core/src/index.ts`：

```typescript
/**
 * Xorigo UI - Core Components
 * 按组件分类体系 v1.0 组织导出
 */

// ============================================================================
// UI 组件（基础视觉原子）
// ============================================================================
export * from './components/ui/Button'
export * from './components/ui/Icon'
export * from './components/ui/Typography'
export * from './components/ui/Avatar'
export * from './components/ui/AvatarGroup'
export * from './components/ui/Badge'
export * from './components/ui/Divider'
export * from './components/ui/Separator'
export * from './components/ui/ScrollArea'
export * from './components/ui/Kbd'
export * from './components/ui/Code'
export * from './components/ui/Surface'

// ============================================================================
// 输入控件
// ============================================================================
export * from './components/inputs/Input'
export * from './components/inputs/Textarea'
export * from './components/inputs/NumberInput'
export * from './components/inputs/Select'
export * from './components/inputs/Combobox'
export * from './components/inputs/Checkbox'
export * from './components/inputs/Radio'
export * from './components/inputs/Switch'
export * from './components/inputs/Slider'
export * from './components/inputs/Rating'
export * from './components/inputs/DatePicker'
export * from './components/inputs/Calendar'
export * from './components/inputs/ColorPicker'

// ============================================================================
// 表单容器/逻辑
// ============================================================================
export * from './components/forms/Form'
export * from './components/forms/FormField'
export * from './components/forms/Fieldset'
export * from './components/forms/InputGroup'
export * from './components/forms/ValidationMessage'

// ============================================================================
// 导航与结构
// ============================================================================
export * from './components/navigation/Tabs'
export * from './components/navigation/Breadcrumb'
export * from './components/navigation/Pagination'
export * from './components/navigation/Menu'
export * from './components/navigation/DropdownMenu'
export * from './components/navigation/CommandPalette'
export * from './components/navigation/Toolbar'
export * from './components/navigation/Navbar'
export * from './components/navigation/Sidebar'

// ============================================================================
// 布局与分区
// ============================================================================
export * from './components/layout/Container'
export * from './components/layout/Grid'
export * from './components/layout/Flex'
export * from './components/layout/Stack'
export * from './components/layout/Section'

// ============================================================================
// 反馈与状态
// ============================================================================
export * from './components/feedback/Alert'
export * from './components/feedback/Toast'
export * from './components/feedback/Notification'
export * from './components/feedback/Progress'
export * from './components/feedback/Spinner'
export * from './components/feedback/Skeleton'
export * from './components/feedback/Tooltip'
export * from './components/feedback/Result'

// ============================================================================
// 弹层与遮罩
// ============================================================================
export * from './components/overlays/Modal'
export * from './components/overlays/Dialog'
export * from './components/overlays/Drawer'
export * from './components/overlays/Popover'

// ============================================================================
// 数据展示
// ============================================================================
export * from './components/datadisplay/Card'
export * from './components/datadisplay/List'
export * from './components/datadisplay/Table'
export * from './components/datadisplay/Tag'
export * from './components/datadisplay/Timeline'
export * from './components/datadisplay/Accordion'
export * from './components/datadisplay/EmptyState'

// ============================================================================
// 数据可视化
// ============================================================================
export * from './components/charts/LineChart'
export * from './components/charts/BarChart'
export * from './components/charts/PieChart'

// ============================================================================
// 技术基元（不对外展示为业务组件）
// ============================================================================
export * from './components/utilities/Portal'
export * from './components/utilities/FocusTrap'
export * from './components/utilities/ScrollLock'
export * from './components/utilities/VisuallyHidden'

// ============================================================================
// 类型定义
// ============================================================================
export * from './types'
```

### Phase 3: 清理与验证（P1 - 本周内）

#### 3.1 清理旧目录

```bash
#!/bin/bash

echo "🧹 清理旧目录..."

CORE_SRC="packages/core/src"

# 确认目录为空后再删除
if [ -d "$CORE_SRC/base" ] && [ -z "$(ls -A $CORE_SRC/base)" ]; then
  rm -rf "$CORE_SRC/base"
  echo "  ✅ 删除空目录 base/"
fi

if [ -d "$CORE_SRC/components" ] && [ -z "$(ls -A $CORE_SRC/components)" ]; then
  rm -rf "$CORE_SRC/components"
  echo "  ✅ 删除空目录 components/"
fi

# 移动 composite/ 和 blocks/ 到 CLI
if [ -d "$CORE_SRC/composite" ]; then
  mkdir -p "packages/cli/templates/patterns"
  mv "$CORE_SRC/composite"/* "packages/cli/templates/patterns/"
  rm -rf "$CORE_SRC/composite"
  echo "  ✅ 迁移 composite/ → cli/templates/patterns/"
fi

if [ -d "$CORE_SRC/blocks" ]; then
  mv "$CORE_SRC/blocks"/* "packages/cli/templates/patterns/"
  rm -rf "$CORE_SRC/blocks"
  echo "  ✅ 迁移 blocks/ → cli/templates/patterns/"
fi

echo "✅ 清理完成！"
```

#### 3.2 验证构建

```bash
# 运行类型检查
npm --workspace=@xorigo-ui/core run type-check

# 运行构建
npm --workspace=@xorigo-ui/core run build

# 运行测试
npm --workspace=@xorigo-ui/core run test
```

### Phase 4: Registry 集成（P2 - 择期）

#### 4.1 创建 Registry 生成脚本

创建 `packages/registry/scripts/generate-registry.ts`：

```typescript
import fs from 'fs'
import path from 'path'
import yaml from 'yaml'

interface CategoryConfig {
  version: string
  components: Record<string, string[]>
}

interface RegistryEntry {
  name: string
  title: string
  category: string
  tags: string[]
  a11y: 'ok' | 'warn' | 'na'
  rtl: boolean
  i18n: string[]
  preview?: {
    module: string
  }
}

async function generateRegistry() {
  // 读取分类配置
  const categoriesPath = path.join(
    process.cwd(),
    'packages/core/src/components/categories.yml'
  )
  const categoriesYaml = fs.readFileSync(categoriesPath, 'utf-8')
  const categories: CategoryConfig = yaml.parse(categoriesYaml)

  const registry: RegistryEntry[] = []

  // 遍历所有分类和组件
  for (const [category, components] of Object.entries(categories.components)) {
    for (const componentName of components) {
      const entry: RegistryEntry = {
        name: componentName,
        title: componentName, // 可以从组件文件中提取中文名称
        category,
        tags: [], // 可以从组件文件中提取
        a11y: 'ok', // 需要运行 a11y 测试
        rtl: true, // 默认支持 RTL
        i18n: ['en', 'zh-CN'],
        preview: {
          module: `${category}/${componentName}/Preview`
        }
      }
      registry.push(entry)
    }
  }

  // 写入 registry.json
  const registryPath = path.join(
    process.cwd(),
    'packages/registry/registry.json'
  )
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2))

  console.log(`✅ 生成 Registry: ${registry.length} 个组件`)
}

generateRegistry()
```

#### 4.2 创建 JSON Schema

创建 `packages/registry/schema.json`（从白皮书复制）

---

## 📊 进度跟踪

### 执行清单

- [ ] **Phase 1: 准备工作**
  - [ ] 创建新目录结构
  - [ ] 创建备份分支
  - [ ] 创建 categories.yml
  - [ ] 创建迁移脚本

- [ ] **Phase 2: 组件迁移**
  - [ ] 运行迁移脚本
  - [ ] 更新导入路径
  - [ ] 更新主导出文件
  - [ ] 验证所有导入正确

- [ ] **Phase 3: 清理与验证**
  - [ ] 清理旧目录
  - [ ] 运行类型检查（0 错误）
  - [ ] 运行构建（成功）
  - [ ] 运行测试（全部通过）

- [ ] **Phase 4: Registry 集成**
  - [ ] 创建 Registry 生成脚本
  - [ ] 生成 registry.json
  - [ ] 验证 JSON Schema
  - [ ] CI 集成

### 风险评估

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 导入路径更新遗漏 | 高 | 使用脚本批量更新 + 类型检查验证 |
| 组件重命名冲突 | 中 | 提前识别冲突组件，手动处理 |
| 测试失败 | 中 | 逐步迁移，每个分类迁移后运行测试 |
| 构建失败 | 高 | 使用备份分支，随时可回滚 |

---

## ✅ 验收标准

1. **目录结构**
   - ✅ `packages/core/src/components/` 存在所有 10 个分类目录
   - ✅ 每个组件有独立目录，包含 `index.tsx`
   - ✅ 旧目录（base/、components/、blocks/、composite/）已清理

2. **代码质量**
   - ✅ TypeScript 类型检查通过（0 错误）
   - ✅ 所有导入路径正确
   - ✅ 构建成功
   - ✅ 测试全部通过

3. **文档完整**
   - ✅ categories.yml 与白皮书一致
   - ✅ registry.json 生成正确
   - ✅ 每个分类有 README.md

4. **向后兼容**
   - ✅ 主导出文件保持 API 兼容
   - ✅ 外部项目无需修改导入路径

---

## 📝 后续工作

### P1 阶段后续（1-2周）

1. **CLI 集成**
   - 实现 `xorigo check categories` 命令
   - 实现 `xorigo add <component>` 基于分类生成
   - 实现 `xorigo list --category=<name>` 列出组件

2. **测试增强**
   - Overlay 协议测试（ESC、焦点、滚动锁）
   - A11y 自动化测试
   - RTL 测试

3. **文档生成**
   - 自动生成每个组件的基础文档
   - 生成分类索引页
   - 生成 API 参考表

### P2 阶段（1个月）

1. **Registry 完善**
   - 添加组件标签系统
   - 添加依赖关系图
   - 添加使用示例

2. **Storybook 集成**
   - 按分类组织 Stories
   - 添加组件预览
   - 添加交互测试

3. **性能优化**
   - Tree-shaking 验证
   - Bundle 分析
   - 按需加载策略

---

## 📚 参考文档

- [Xorigo UI 组件分类体系白皮书 v1.0](./Xorigo%20UI%20组件分类体系白皮书.md)
- [Xorigo UI 架构白皮书](./Xorigo%20UI%20架构白皮书.md)
- [架构重构执行清单](./架构重构执行清单.md)
- [P1 优化任务进度报告](./P1-优化任务进度报告.md)

---

**文档版本**: 1.0
**创建日期**: 2025-10-13
**维护者**: Xorigo UI Team
**状态**: ✅ 就绪，待执行
