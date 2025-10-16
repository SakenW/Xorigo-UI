# Xorigo-UI 配置模板

本目录包含重构过程中需要的各种配置文件模板。

## 模板说明

### 构建配置
- `vite.config.ts` - Vite 构建配置模板
- `tsconfig.json` - TypeScript 配置模板
- `package.json.exports` - package.json 导出配置

### 测试配置
- `playwright.config.ts` - Playwright 配置模板
- `vitest.config.ts` - Vitest 配置模板
- `a11y-test.spec.ts` - 可访问性测试模板
- `visual-test.spec.ts` - 视觉回归测试模板

### CI/CD 配置
- `github-workflows.yml` - GitHub Actions 工作流模板
- `changeset-config.json` - Changesets 配置模板

### 主题系统
- `tokens/index.ts` - 设计令牌模板
- `theme-provider.tsx` - 主题提供者模板

## 使用方法

每个模板文件都包含详细的注释和配置说明。在实际使用时，请根据项目需求进行相应调整。