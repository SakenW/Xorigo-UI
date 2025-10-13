# ✅ Website 重构前置检查清单

> **用途**: 在开始 Website 重构前，确保所有前置条件满足
> **执行时间**: 开始重构前必须完成
> **预计时间**: 30-60分钟
> **版本**: v1.0

---

## 📋 检查清单概览

| 类别 | 检查项 | 状态 | 优先级 |
|------|--------|------|--------|
| **环境准备** | 5项 | ⏳ | P0 |
| **代码仓库** | 4项 | ⏳ | P0 |
| **依赖管理** | 6项 | ⏳ | P0 |
| **当前实现** | 5项 | ⏳ | P1 |
| **文档理解** | 4项 | ⏳ | P1 |
| **工具准备** | 3项 | ⏳ | P2 |

---

## 🔧 环境准备（P0 - 必须）

### 1. Node.js 版本检查
```bash
# 检查 Node.js 版本
node --version
# 要求: >= 18.0.0

# 检查 npm 版本
npm --version
# 要求: >= 9.0.0
```

**验收标准**:
- ✅ Node.js >= 18.0.0
- ✅ npm >= 9.0.0

**失败处理**:
```bash
# 安装/更新 Node.js
nvm install 18
nvm use 18

# 更新 npm
npm install -g npm@latest
```

---

### 2. 项目依赖安装
```bash
# 进入项目根目录
cd /home/saken/project/Xorigo-UI

# 安装所有依赖
npm install

# 验证安装成功
npm list --depth=0
```

**验收标准**:
- ✅ 所有 packages 依赖安装成功
- ✅ apps/website 依赖安装成功
- ✅ 无 peer dependency 警告

**失败处理**:
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install

# 或使用 clean install
npm ci
```

---

### 3. TypeScript 编译检查
```bash
# 检查 TypeScript 配置
cat apps/website/tsconfig.json

# 运行类型检查
cd apps/website
npm run type-check
```

**验收标准**:
- ✅ tsconfig.json 存在且配置正确
- ✅ TypeScript 严格模式启用（strict: true）
- ✅ 类型检查通过（0 errors）

**失败处理**:
```bash
# 查看详细错误
npm run type-check 2>&1 | tee type-errors.log

# 修复类型错误后重新检查
npm run type-check
```

---

### 4. ESLint 配置检查
```bash
# 检查 ESLint 配置
cat apps/website/.eslintrc.js

# 运行 ESLint 检查
cd apps/website
npm run lint
```

**验收标准**:
- ✅ .eslintrc.js 存在
- ✅ ESLint 检查通过或仅有 warnings
- ✅ 无 fatal errors

**失败处理**:
```bash
# 自动修复可修复的问题
npm run lint:fix

# 查看详细错误
npm run lint 2>&1 | tee lint-errors.log
```

---

### 5. Next.js 构建测试
```bash
# 测试构建
cd apps/website
npm run build

# 检查构建产物
ls -lh .next/
```

**验收标准**:
- ✅ 构建成功完成
- ✅ .next/ 目录生成
- ✅ 无构建错误

**失败处理**:
```bash
# 清理并重新构建
rm -rf .next
npm run build

# 查看详细构建日志
npm run build 2>&1 | tee build.log
```

---

## 📦 代码仓库（P0 - 必须）

### 1. Git 状态检查
```bash
# 检查 Git 状态
cd /home/saken/project/Xorigo-UI
git status

# 检查当前分支
git branch --show-current

# 检查远程仓库
git remote -v
```

**验收标准**:
- ✅ Git 仓库初始化完成
- ✅ 当前分支已知（建议创建新分支）
- ✅ 远程仓库配置正确

**建议操作**:
```bash
# 创建新的重构分支
git checkout -b website-refactor-2025-10

# 确保主分支最新
git fetch origin
git merge origin/main
```

---

### 2. 未提交变更检查
```bash
# 检查未提交的变更
git status --short

# 检查未跟踪的文件
git status --porcelain | grep "^??"
```

**验收标准**:
- ✅ 无未提交的重要变更
- ✅ 无未跟踪的临时文件

**建议操作**:
```bash
# 提交或暂存当前变更
git add .
git commit -m "chore: save work before refactor"

# 或使用 stash
git stash save "Pre-refactor work"
```

---

### 3. .gitignore 检查
```bash
# 检查 .gitignore 配置
cat .gitignore

# 验证忽略规则
git check-ignore -v node_modules dist .next
```

**验收标准**:
- ✅ .gitignore 包含 node_modules
- ✅ .gitignore 包含 .next
- ✅ .gitignore 包含 dist

**失败处理**:
```bash
# 补充 .gitignore
cat >> .gitignore << 'EOF'
node_modules/
.next/
dist/
*.log
.DS_Store
EOF
```

---

### 4. Git 钩子配置
```bash
# 检查 Git 钩子
ls -la .git/hooks/

# 检查 Husky 配置
cat .husky/pre-commit
```

**验收标准**:
- ✅ .husky/ 目录存在（如果使用 Husky）
- ✅ pre-commit 钩子配置正确

**可选操作**:
```bash
# 安装 Husky
npm install --save-dev husky
npx husky install

# 创建 pre-commit 钩子
npx husky add .husky/pre-commit "npm run lint && npm run type-check"
```

---

## 📚 依赖管理（P0 - 必须）

### 1. 核心依赖版本检查
```bash
# 检查关键依赖版本
cd apps/website
npm list react react-dom next typescript

# 预期版本:
# - react: ^19.2.0
# - react-dom: ^19.2.0
# - next: ^15.5.4
# - typescript: ~5.9.3
```

**验收标准**:
- ✅ React 19.2.0
- ✅ Next.js 15.5.4
- ✅ TypeScript 5.9.3

**失败处理**:
```bash
# 更新到正确版本
npm install react@^19.2.0 react-dom@^19.2.0
npm install next@^15.5.4
npm install -D typescript@~5.9.3
```

---

### 2. Packages 依赖检查
```bash
# 检查 @xorigo-ui 依赖
cd apps/website
npm list @xorigo-ui/core @xorigo-ui/registry

# 验证依赖可导入
node -e "require('@xorigo-ui/core')" && echo "✅ @xorigo-ui/core OK"
node -e "require('@xorigo-ui/registry')" && echo "✅ @xorigo-ui/registry OK"
```

**验收标准**:
- ✅ @xorigo-ui/core 依赖存在
- ✅ @xorigo-ui/registry 依赖存在
- ✅ 依赖可正确导入

**失败处理**:
```bash
# 重新链接本地包
cd /home/saken/project/Xorigo-UI
npm run build --workspace=packages/core
npm run build --workspace=packages/registry

# 重新安装 website 依赖
cd apps/website
npm install
```

---

### 3. 开发依赖检查
```bash
# 检查关键开发依赖
npm list -D @types/node @types/react eslint prettier

# 预期:
# - @types/node: ^24.7.0
# - @types/react: ^19.2.2
# - eslint: ^9.37.0
# - prettier: ^3.6.2
```

**验收标准**:
- ✅ 所有类型声明包存在
- ✅ ESLint 和 Prettier 已安装

**失败处理**:
```bash
# 安装缺失的开发依赖
npm install -D @types/node @types/react @types/react-dom
npm install -D eslint prettier
```

---

### 4. Peer Dependencies 检查
```bash
# 检查 peer dependency 警告
npm install 2>&1 | grep -i "peer"

# 或使用
npm list --depth=0 2>&1 | grep -i "unmet"
```

**验收标准**:
- ✅ 无 unmet peer dependency 错误
- ✅ 所有 peer dependencies 满足

**失败处理**:
```bash
# 查看详细的 peer dependency 问题
npm explain <package-name>

# 安装缺失的 peer dependencies
npm install <missing-peer-dependency>
```

---

### 5. 依赖安全检查
```bash
# 运行安全审计
npm audit

# 查看高危漏洞
npm audit --audit-level=high
```

**验收标准**:
- ✅ 无高危或严重漏洞
- ✅ 可接受的中低危漏洞

**失败处理**:
```bash
# 自动修复可修复的漏洞
npm audit fix

# 强制修复（可能导致破坏性变更）
npm audit fix --force

# 查看详细报告
npm audit --json > audit-report.json
```

---

### 6. 包管理器一致性
```bash
# 检查 package-lock.json
ls -lh package-lock.json

# 验证锁文件与 package.json 一致
npm ci --dry-run
```

**验收标准**:
- ✅ package-lock.json 存在
- ✅ 锁文件与 package.json 一致
- ✅ 无依赖冲突

**失败处理**:
```bash
# 重新生成锁文件
rm package-lock.json
npm install

# 或使用 clean install
npm ci
```

---

## 🔍 当前实现（P1 - 重要）

### 1. 目录结构审查
```bash
# 查看 apps/website 目录结构
cd /home/saken/project/Xorigo-UI/apps/website
tree -L 3 -I 'node_modules|.next|dist'

# 或使用 find
find . -maxdepth 3 -type d -not -path '*/node_modules/*' -not -path '*/.next/*' | sort
```

**验收标准**:
- ✅ src/ 目录存在
- ✅ app/ 目录存在（Next.js App Router）
- ✅ public/ 目录存在

**记录**:
```bash
# 保存当前目录结构
tree -L 3 -I 'node_modules|.next|dist' > pre-refactor-structure.txt
```

---

### 2. 现有页面清单
```bash
# 列出所有页面
find app src/app -name 'page.tsx' -o -name 'page.ts'

# 列出所有 API 路由
find app src/app -path '*/api/*/route.ts'
```

**验收标准**:
- ✅ 记录所有现有页面
- ✅ 记录所有 API 路由

**记录**:
```bash
# 保存现有页面清单
find app src/app -name 'page.tsx' > pre-refactor-pages.txt
find app src/app -path '*/api/*/route.ts' > pre-refactor-api-routes.txt
```

---

### 3. 组件清单
```bash
# 列出所有组件
find src/components -name '*.tsx' -o -name '*.ts' | grep -v '.test.'

# 统计组件数量
find src/components -name '*.tsx' | wc -l
```

**验收标准**:
- ✅ 记录所有现有组件
- ✅ 统计组件数量

**记录**:
```bash
# 保存组件清单
find src/components -name '*.tsx' -o -name '*.ts' > pre-refactor-components.txt
```

---

### 4. 依赖分析
```bash
# 分析直接依赖 @xorigo-ui 的文件
grep -r "@xorigo-ui" src/ app/ --include="*.ts" --include="*.tsx" | wc -l

# 列出所有直接导入
grep -r "from '@xorigo-ui" src/ app/ --include="*.ts" --include="*.tsx"
```

**验收标准**:
- ✅ 记录所有直接依赖上游包的文件
- ✅ 识别违反只读原则的导入

**记录**:
```bash
# 保存依赖分析
grep -r "from '@xorigo-ui" src/ app/ --include="*.ts" --include="*.tsx" > pre-refactor-deps.txt
```

---

### 5. 现有脚本和配置
```bash
# 检查 package.json scripts
cat package.json | grep -A 20 "scripts"

# 检查配置文件
ls -la *.config.* *.json
```

**验收标准**:
- ✅ 记录所有 npm scripts
- ✅ 记录所有配置文件

**记录**:
```bash
# 保存配置清单
ls -la *.config.* *.json > pre-refactor-configs.txt
```

---

## 📖 文档理解（P1 - 重要）

### 1. 阅读核心架构文档
```bash
# 架构白皮书
cat docs/待整理/Xorigo\ UI\ Website\ 架构白皮书.md | head -100

# 架构设计方案
cat docs/待整理/Website重构架构设计方案.md | head -100
```

**验收标准**:
- ✅ 理解四层架构设计
- ✅ 理解数据只读原则
- ✅ 理解 RSC/Client 分离

**自测问题**:
1. 四层架构分别是什么？
2. 数据只读原则如何实现？
3. 哪些页面应该是 RSC？哪些应该是 Client？

---

### 2. 理解 Agent 执行计划
```bash
# Agent 执行计划
cat docs/待整理/Website重构-Agent执行计划.md | grep -A 10 "Group"
```

**验收标准**:
- ✅ 了解 6 个 Agent 组
- ✅ 理解每个 Agent 的职责
- ✅ 了解执行顺序和依赖

**自测问题**:
1. 哪个 Agent 组是 P0 最高优先级？
2. 哪些 Agent 可以并行执行？
3. Agent 1.1 和 Agent 1.2 的依赖关系？

---

### 3. 理解组件分类体系
```bash
# 组件分类说明
cat docs/待整理/Website重构-组件分类说明.md | grep -A 5 "^### "
```

**验收标准**:
- ✅ 了解 10 个组件分类
- ✅ 理解七轴映射
- ✅ 理解路由映射规则

**自测问题**:
1. Button 组件属于哪个分类？
2. DatePicker 属于哪个分类？
3. utilities 分类的特殊处理是什么？

---

### 4. 理解实施清单
```bash
# 实施清单
cat docs/待整理/Website重构实施清单.md | grep -A 5 "Phase"
```

**验收标准**:
- ✅ 了解 8 个 Phase
- ✅ 理解每个 Phase 的任务
- ✅ 了解验收标准

**自测问题**:
1. Phase 1 需要完成什么？
2. 预计总工期是多少？
3. 哪个 Phase 是关键路径？

---

## 🛠️ 工具准备（P2 - 可选）

### 1. Claude Flow 安装
```bash
# 检查 claude-flow 是否安装
which claude-flow

# 版本检查
claude-flow --version
```

**验收标准**:
- ✅ claude-flow 已安装
- ✅ 版本 >= 1.0.0

**安装方法**:
```bash
# 安装 claude-flow（根据实际安装方式）
npm install -g claude-flow

# 或
pip install claude-flow
```

---

### 2. 开发工具配置
```bash
# 检查 VS Code 扩展
code --list-extensions | grep -E "(eslint|prettier|typescript)"

# 预期扩展:
# - dbaeumer.vscode-eslint
# - esbenp.prettier-vscode
# - ms-vscode.vscode-typescript-next
```

**验收标准**:
- ✅ ESLint 扩展已安装
- ✅ Prettier 扩展已安装
- ✅ TypeScript 扩展已安装

---

### 3. 性能监控工具
```bash
# 安装 Bundle Analyzer
npm install --save-dev @next/bundle-analyzer

# 安装 Lighthouse CI
npm install --save-dev @lhci/cli
```

**验收标准**:
- ✅ Bundle Analyzer 已安装
- ✅ Lighthouse CI 已安装（可选）

---

## ✅ 总体验收

### 必须完成（P0）
- [ ] ✅ Node.js 和 npm 版本正确
- [ ] ✅ 所有依赖安装成功
- [ ] ✅ TypeScript 类型检查通过
- [ ] ✅ ESLint 检查通过
- [ ] ✅ Next.js 构建成功
- [ ] ✅ Git 状态清晰
- [ ] ✅ 无未提交的重要变更
- [ ] ✅ .gitignore 配置正确
- [ ] ✅ 核心依赖版本正确
- [ ] ✅ Packages 依赖可用
- [ ] ✅ 无高危安全漏洞

### 建议完成（P1）
- [ ] ✅ 记录当前目录结构
- [ ] ✅ 记录现有页面清单
- [ ] ✅ 记录现有组件清单
- [ ] ✅ 分析依赖关系
- [ ] ✅ 阅读核心架构文档
- [ ] ✅ 理解 Agent 执行计划
- [ ] ✅ 理解组件分类体系
- [ ] ✅ 理解实施清单

### 可选完成（P2）
- [ ] Claude Flow 安装
- [ ] 开发工具配置
- [ ] 性能监控工具安装

---

## 📊 检查报告生成

### 自动生成检查报告
```bash
#!/bin/bash
# 文件: scripts/pre-refactor-check.sh

echo "🔍 Website 重构前置检查报告"
echo "=============================="
echo ""

echo "## 环境信息"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "当前目录: $(pwd)"
echo "Git 分支: $(git branch --show-current)"
echo ""

echo "## TypeScript 检查"
npm run type-check 2>&1 | tail -1
echo ""

echo "## ESLint 检查"
npm run lint 2>&1 | tail -1
echo ""

echo "## 依赖状态"
echo "总依赖数: $(npm list --depth=0 2>/dev/null | wc -l)"
echo ""

echo "## 安全审计"
npm audit --audit-level=high 2>&1 | grep -E "(vulnerabilities|packages audited)"
echo ""

echo "## 目录结构"
echo "总文件数: $(find src app -type f | wc -l)"
echo "组件数: $(find src/components -name '*.tsx' | wc -l)"
echo "页面数: $(find app src/app -name 'page.tsx' | wc -l)"
echo ""

echo "✅ 检查完成！"
```

**使用方法**:
```bash
# 赋予执行权限
chmod +x scripts/pre-refactor-check.sh

# 执行检查
./scripts/pre-refactor-check.sh

# 保存报告
./scripts/pre-refactor-check.sh > pre-refactor-check-report.txt
```

---

## 🚨 常见问题和解决方案

### 问题 1: TypeScript 类型错误过多
**症状**: `npm run type-check` 显示大量类型错误

**解决方案**:
```bash
# 1. 先尝试清理和重新安装
rm -rf node_modules .next
npm install

# 2. 检查 tsconfig.json 配置
# 确保 strict: true 已启用

# 3. 如果错误仍然很多，可以暂时降级检查
# 编辑 tsconfig.json，设置 strict: false（仅临时）
```

---

### 问题 2: 依赖冲突
**症状**: npm install 显示 peer dependency 警告

**解决方案**:
```bash
# 1. 使用 --legacy-peer-deps
npm install --legacy-peer-deps

# 2. 或使用 --force（不推荐）
npm install --force

# 3. 或手动安装缺失的 peer dependencies
npm install <missing-peer-dependency>
```

---

### 问题 3: 构建失败
**症状**: `npm run build` 失败

**解决方案**:
```bash
# 1. 清理构建缓存
rm -rf .next

# 2. 重新构建
npm run build

# 3. 查看详细错误日志
npm run build 2>&1 | tee build-error.log

# 4. 检查是否有缺失的环境变量
cat .env.local
```

---

## 📝 检查完成后的下一步

### 立即执行
1. **确认所有 P0 检查通过**
2. **创建新的 Git 分支**: `git checkout -b website-refactor-2025-10`
3. **保存当前状态**: `git commit -m "chore: pre-refactor checkpoint"`

### 开始重构
```bash
# 方式 1: 使用 Hive-Mind 自动执行
bash docs/待整理/EXECUTE-HIVE-MIND.sh

# 方式 2: 手动执行 Phase 1
# 参考 Website重构实施清单.md
```

---

**最后更新**: 2025-10-13
**维护者**: Xorigo UI Architecture Team
**版本**: v1.0
