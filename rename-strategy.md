# Xorigo UI 重命名策略

## 重命名映射表

| 原名称 | 新名称 | 说明 |
|--------|--------|------|
| Xorigo UI | Xorigo UI | 主要品牌名称 |
| xorigo-ui | xorigo-ui | 小写标识符 |
| @xorigo-ui | @xorigo-ui | npm 包名前缀 |
| Xorigo UI Team | Xorigo UI Team | 团队名称 |
| xorigo-ui-locale | xorigo-ui-locale | 本地存储键名 |
| xorigo-ui-locale-change | xorigo-ui-locale-change | 事件名称 |

## 重命名优先级

### 🔴 高优先级 - 核心配置
1. **package.json 文件** - 包名和描述
2. **Vite 配置文件** - 构建相关
3. **主文档文件** - README、CLAUDE.md

### 🟡 中优先级 - 源码文件
1. **TypeScript 源文件** - 导入、注释
2. **配置文件** - eslint、postcss 等
3. **国际化文件** - 翻译内容

### 🟢 低优先级 - 其他
1. **测试文件** - 覆盖率报告等
2. **临时文件** - build 产物
3. **第三方依赖** - node_modules 中的引用

## 需要修改的文件列表

### 核心包配置
- `/package.json` - 根包配置
- `/packages/core/package.json` - 核心组件库
- `/packages/tokens/package.json` - 设计令牌
- `/packages/style-recipe/package.json` - 样式配方
- `/packages/i18n/package.json` - 国际化包
- `/packages/registry/package.json` - 组件注册
- `/apps/website/package.json` - 官网应用

### 配置文件
- `/xorigo-ui.config.json` → `/xorigo-ui.config.json`
- `/CLAUDE.md` - 开发指南
- `/README.md` - 项目说明

### 源码文件
- `/packages/i18n/src/core/I18nManager.ts`
- `/packages/i18n/src/index.ts`
- `/packages/i18n/README.md`
- `/packages/i18n/examples/basic-usage.ts`
- `/packages/i18n/src/locales/zh-CN/*.json`

### 网站应用
- `/apps/website/` 目录下的相关文件