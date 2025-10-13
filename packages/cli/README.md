# @xorigo-cli/commands

Xorigo UI 命令行工具 - 提供组件脚手架、质量检查、令牌导出等功能。

## 安装

```bash
npm install -g @xorigo-cli/commands
```

或在项目中使用：

```bash
npm install --save-dev @xorigo-cli/commands
```

## 命令概览

### 组件生成

```bash
# 生成基础组件
xorigo add Button

# 生成高级组件（带动画）
xorigo add Modal -t advanced -c feedback

# 生成表单组件
xorigo add TextInput -t form -c form
```

**选项**：
- `-t, --template <type>` - 组件模板：basic（默认）| advanced | form
- `-c, --category <category>` - 组件分类：base | feedback | navigation | form | data | layout
- `-p, --path <path>` - 自定义输出路径

**生成的文件**：
- 组件 TypeScript 文件（含完整类型定义）
- 组件测试文件（Vitest + Testing Library）
- 组件文档文件（Markdown）
- 自动更新导出文件

---

### 设计令牌导出

```bash
# 导出为 CSS 变量
xorigo tokens:export -f css -o ./tokens

# 导出为 SCSS 变量
xorigo tokens:export -f scss -o ./styles

# 导出为 JSON
xorigo tokens:export -f json -o ./config

# 导出所有格式
xorigo tokens:export -f all -o ./design-tokens
```

**选项**：
- `-f, --format <type>` - 输出格式：css（默认）| scss | json | all
- `-o, --output <path>` - 输出目录（默认：./tokens）
- `-t, --theme <theme>` - 主题名称（可选）

**输出文件**：
- `tokens.css` - CSS 自定义属性
- `_tokens.scss` - SCSS 变量
- `tokens.json` - JSON 格式令牌

---

### 国际化提取

```bash
# 提取国际化字符串
xorigo i18n:extract -l en zh

# 指定源目录和输出目录
xorigo i18n:extract -l en zh-CN ja -s ./src -o ./locales

# 覆盖已有翻译
xorigo i18n:extract -l en zh --overwrite
```

**选项**：
- `-l, --locales <locales...>` - 目标语言列表（默认：en zh）
- `-s, --source <path>` - 源代码目录
- `-o, --output <path>` - 输出目录
- `--overwrite` - 覆盖已有翻译（默认：增量更新）

**支持的模式**：
```tsx
// useTranslation hook
const text = useTranslation('welcome.message', 'Welcome!')

// t() function
const label = t('button.submit', 'Submit')

// Trans component
<Trans i18nKey="app.title">应用标题</Trans>
```

**输出文件**：
- `en.json` - 英文翻译
- `zh.json` - 中文翻译
- ...（其他语言）

---

### 组件注册表

```bash
# 扫描组件生成注册表
xorigo registry:scan

# 指定要扫描的包
xorigo registry:scan -p core registry

# 增量更新（保留已有元数据）
xorigo registry:scan -i

# 自定义输出路径
xorigo registry:scan -o ./packages/registry/src
```

**选项**：
- `-p, --packages <packages...>` - 要扫描的包（默认：core registry）
- `-o, --output <path>` - 输出目录
- `-i, --incremental` - 增量更新

**生成的信息**：
- 组件名称和分类
- Props 类型定义
- 导出类型（named | default）
- 组件标签（interactive, form, animated, accessible）
- 可访问性支持情况
- 统计信息

---

### 质量检查

#### 键盘导航检查

```bash
# 检查键盘导航合规性
xorigo check keyboard

# 详细输出
xorigo check keyboard -v

# 指定检查路径
xorigo check keyboard -p ./packages/core/src/feedback
```

**检查项**：
- ✓ 交互元素支持 Tab 键导航
- ✓ 支持 Enter 键触发
- ✓ 支持 Esc 键关闭
- ✓ 箭头键导航（菜单、列表）
- ✓ 焦点指示器可见

#### 弹层可访问性检查

```bash
# 检查弹层可访问性
xorigo check overlay

# 详细输出
xorigo check overlay -v
```

**检查项**：
- ✓ 焦点陷阱（focus trap）
- ✓ Esc 键关闭
- ✓ ARIA 属性（role, aria-modal, aria-labelledby）
- ✓ 初始焦点管理
- ✓ 关闭后焦点恢复

#### 虚拟化性能检查

```bash
# 检查虚拟化性能
xorigo check virtualization

# 详细输出
xorigo check virtualization -v
```

**检查项**：
- ✓ 大列表使用虚拟化
- ✓ 虚拟化配置合理
- ✓ React.memo 优化
- ✓ 正确使用 key 属性

**通用选项**：
- `-p, --path <path>` - 指定检查路径
- `-f, --fix` - 自动修复（部分支持）
- `-v, --verbose` - 详细输出

---

## 使用场景

### 快速创建组件

```bash
# 1. 创建新组件
xorigo add Avatar -t basic -c base

# 2. 编辑组件实现
# packages/core/src/base/Avatar.tsx

# 3. 运行测试
npm test -- Avatar

# 4. 构建项目
npm run build
```

### 导出设计系统

```bash
# 导出所有格式的设计令牌
xorigo tokens:export -f all -o ./design-system

# 在项目中使用
# CSS
import './design-system/tokens.css'

# SCSS
@import './design-system/tokens'

# JSON
import tokens from './design-system/tokens.json'
```

### 国际化工作流

```bash
# 1. 提取翻译字符串
xorigo i18n:extract -l en zh-CN ja

# 2. 翻译文件
# packages/i18n/locales/zh-CN.json

# 3. 在组件中使用
import { useTranslation } from '@xorigo-ui/i18n'

function MyComponent() {
  const t = useTranslation()
  return <div>{t('welcome.message')}</div>
}
```

### 质量保证工作流

```bash
# 1. 检查键盘导航
xorigo check keyboard -v

# 2. 检查弹层可访问性
xorigo check overlay -v

# 3. 检查性能优化
xorigo check virtualization -v

# 4. 修复问题后重新检查
xorigo check keyboard -v
```

---

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 类型检查
npm run type-check
```

---

## 新增命令

### `xorigo doctor`

执行全面的系统健康检查，包括：

- ✅ Node.js 版本检查
- ✅ 包版本一致性检查
- ✅ TypeScript 编译检查
- ✅ ESLint 规则检查
- ✅ Bundle Size 检查
- ✅ Registry 一致性检查
- ✅ 依赖安全检查
- ✅ 测试覆盖率检查

```bash
# 基本检查
xorigo doctor

# 自动修复问题
xorigo doctor --fix

# 详细输出
xorigo doctor --verbose

# 保存报告到文件
xorigo doctor --report ./health-report.json
```

**输出示例**：
```
🏥 Xorigo UI 健康检查报告
时间: 2024-01-15 14:30:25

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 总体状态: 系统健康

📊 检查统计:
  总计: 8 项检查
  ✅ 正常: 7
  ⚠️ 警告: 1
  ❌ 错误: 0

📋 详细结果:

Environment:
  ✅ Node.js 版本正常: v18.17.0

Dependencies:
  ✅ 所有包版本保持一致

TypeScript:
  ✅ TypeScript 编译检查通过

Code Quality:
  ⚠️ ESLint 发现代码质量问题
     💡 修复: 运行 npx eslint . --fix 自动修复

Build:
  ✅ Bundle 大小正常: 245.67 KB
     15 个文件

Security:
  ✅ 未发现安全漏洞

Testing:
  ⚠️ 测试覆盖率偏低: 65.2%
     建议达到 80% 以上的覆盖率

Registry:
  ✅ Registry 与组件一致
     共 24 个组件
```

### `xorigo sync`

同步文档和组件信息，自动生成：

- 📝 Props 文档表格
- 💡 示例代码
- 🔍 搜索索引
- 📋 组件列表

```bash
# 生成所有文档
xorigo sync

# 监听模式，自动同步文件变化
xorigo sync --watch

# 指定输出目录
xorigo sync --output ./docs/generated

# 跳过特定内容生成
xorigo sync --no-examples --no-index
```

**输出文件**：
- `docs/generated/props/[Component].md` - Props 文档
- `docs/generated/examples/[Component].md` - 示例代码
- `docs/generated/search-index.json` - 搜索索引
- `docs/generated/components.md` - 组件列表

**监听模式**：
```bash
# 启动监听，文件变化时自动同步
xorigo sync --watch

👁️  启动监听模式...
✅ 监听已启动，按 Ctrl+C 退出

📝 检测到文件变更: packages/core/src/Button/Button.tsx
✅ 自动同步完成
```

---

## 集成到 CI/CD

### GitHub Actions

```yaml
name: Quality Checks

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm ci
      - run: npm run build
      - run: npx xorigo doctor --report ./health-report.json
      - run: npx xorigo check keyboard
      - run: npx xorigo sync

      - name: Upload health report
        uses: actions/upload-artifact@v3
        with:
          name: health-report
          path: ./health-report.json
```

### npm scripts

在 `package.json` 中添加：

```json
{
  "scripts": {
    "doctor": "xorigo doctor",
    "doctor:fix": "xorigo doctor --fix",
    "check": "xorigo check keyboard && xorigo check overlay",
    "sync": "xorigo sync",
    "sync:watch": "xorigo sync --watch",
    "quality": "npm run doctor && npm run check && npm run sync"
  }
}
```

---

## 技术栈

- **Commander.js** - 命令行框架
- **Chalk** - 终端样式
- **Ora** - 加载动画
- **Chokidar** - 文件监听
- **TypeScript** - 类型安全

---

## 贡献

欢迎提交 Issue 和 Pull Request！

---

## 许可证

MIT © Xorigo UI Team
