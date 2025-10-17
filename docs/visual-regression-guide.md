# Xorigo UI 视觉回归测试指南

## 📋 概述

Xorigo UI 组件库的视觉回归测试系统基于 Playwright 构建，用于确保组件在不同主题、设备和交互状态下的一致性表现。

## 🎯 测试范围

### 核心组件测试
- ✅ **Button** - 所有变体、尺寸和状态
- ✅ **Input** - 聚焦、错误、禁用等状态
- ✅ **Card** - 悬停、选中、布局变化
- ✅ **Alert** - 不同类型的提示信息
- ✅ **Badge** - 各种颜色和尺寸
- ✅ **Form组件** - Switch、Checkbox、Select等
- ✅ **Modal** - 开启/关闭状态和焦点管理

### 主题系统测试
- 🎨 **10种主题** - default, ocean, sunset, forest, purple, midnight, candy, corporate, minimal, dark
- 🌓 **主题切换** - 平滑过渡和状态保持
- 🎭 **深色模式** - 特殊适配和对比度验证

### 响应式设计测试
- 📱 **移动端** - 375x667, 414x896
- 📱 **平板端** - 768x1024, 1024x1366
- 💻 **桌面端** - 1280x720, 1920x1080
- 🔄 **断点切换** - 布局变化和流畅性

### 交互状态测试
- 👆 **Hover状态** - 鼠标悬停效果
- 🎯 **Focus状态** - 键盘导航和焦点指示器
- 👇 **Active状态** - 按下和点击效果
- 🚫 **Disabled状态** - 禁用状态和可访问性
- ⌨️ **键盘导航** - Tab键和快捷键操作

## 🚀 快速开始

### 安装依赖

```bash
npm run visual:setup
```

### 运行测试

```bash
# 运行所有视觉测试
npm run visual:test

# 在浏览器中查看测试过程
npm run visual:test:headed

# 调试模式
npm run visual:test:debug

# 可视化测试界面
npm run visual:test:ui
```

### 更新基准截图

```bash
# 更新所有基准截图
npm run visual:test:update

# 更新特定组件
npm run visual:update:component Button

# 更新特定主题
npm run visual:update:theme dark
```

## 📊 测试报告

### 生成报告

```bash
npm run visual:test:report
```

报告将生成在 `visual-reports/` 目录：
- `visual-report.html` - 交互式HTML报告
- `visual-report.md` - Markdown格式报告

### 报告内容

1. **测试概览** - 总体统计和成功率
2. **失败测试详情** - 视觉差异对比和错误信息
3. **组件分析** - 各组件的测试结果统计
4. **主题兼容性** - 各主题下的表现分析
5. **建议和下一步** - 改进建议和操作指南

## 🛠️ 配置说明

### Playwright配置

主要配置文件：`playwright.config.ts`

```typescript
// 关键配置项
export default {
  testDir: './tests/visual',
  testMatch: '**/*.visual.test.{ts,tsx}',

  // 多浏览器测试
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],

  // 截图配置
  use: {
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true,
      animations: 'disabled'
    }
  }
}
```

### 测试结构

```
tests/visual/
├── components/          # 组件测试
│   ├── Button.visual.test.tsx
│   ├── Input.visual.test.tsx
│   └── Card.visual.test.tsx
├── themes/              # 主题测试
│   └── theme-switching.visual.test.tsx
├── responsive/          # 响应式测试
│   └── responsive-design.visual.test.tsx
├── interactions/        # 交互测试
│   └── interaction-states.visual.test.tsx
├── fixtures/            # 测试页面
│   └── component-pages.tsx
└── helpers/             # 工具函数
    └── test-utils.ts
```

## 🎨 主题测试

### 支持的主题

| 主题名 | 描述 | 适用场景 |
|--------|------|----------|
| default | 默认浅色主题 | 日常使用 |
| ocean | 海洋蓝色调 | 清新风格 |
| sunset | 日落橙色调 | 温暖风格 |
| forest | 森林绿色调 | 自然风格 |
| purple | 紫色调 | 优雅风格 |
| midnight | 深蓝夜空 | 深色主题 |
| candy | 糖果色彩 | 活泼风格 |
| corporate | 企业风格 | 商务应用 |
| minimal | 极简风格 | 简洁设计 |
| dark | 纯黑主题 | 深色模式 |

### 主题切换测试

测试确保：
- ✅ 所有组件在10种主题下正常显示
- ✅ 主题切换过渡动画流畅
- ✅ 组件状态在主题切换时保持
- ✅ 深色模式对比度符合标准

## 📱 响应式测试

### 视口配置

| 设备类型 | 分辨率 | 测试重点 |
|----------|--------|----------|
| 移动端 | 375x667 | 触摸目标、单列布局 |
| 移动端(大) | 414x896 | 较大手机屏幕 |
| 平板 | 768x1024 | 双列布局、触摸优化 |
| 平板(大) | 1024x1366 | 大平板适配 |
| 桌面 | 1280x720 | 标准显示器 |
| 桌面(大) | 1920x1080 | 高分辨率显示器 |

### 测试要点

- **触摸目标大小** - 至少44x44像素
- **文字缩放** - 响应字体大小变化
- **布局切换** - 网格和弹性布局
- **导航适配** - 汉堡菜单和水平导航

## 🎭 交互测试

### 状态测试

每个交互状态都经过测试：

1. **Hover状态**
   - 鼠标悬停效果
   - 过渡动画时间
   - 颜色和阴影变化

2. **Focus状态**
   - 键盘导航焦点环
   - 高亮对比度
   - 焦点管理

3. **Active状态**
   - 按下效果
   - 点击反馈
   - 状态持续时间

4. **Disabled状态**
   - 视觉禁用指示
   - 无交互响应
   - 可访问性支持

### 键盘导航测试

- Tab键顺序
- 快捷键支持
- 焦点陷阱(Modal等)
- 屏幕阅读器支持

## 🔧 CI/CD集成

### GitHub Actions

自动触发条件：
- 推送到 `main`/`develop` 分支
- Pull Request
- 每日定时检查
- 手动触发

### 工作流程

1. **环境设置** - 安装依赖和浏览器
2. **并行测试** - 多浏览器和设备测试
3. **结果收集** - 截图和测试数据
4. **报告生成** - HTML和Markdown报告
5. **结果通知** - PR评论和状态更新

### 失败处理

测试失败时：
- 自动生成视觉差异报告
- 在PR中显示详细对比
- 提供更新基准截图指导
- 阻止合并到主分支

## 📈 最佳实践

### 编写测试

1. **测试命名** - 使用描述性名称
   ```typescript
   test('Button primary variant hover state in dark theme', async ({ page }) => {
     // 测试代码
   });
   ```

2. **截图配置** - 合理设置容差
   ```typescript
   await expect(component).toHaveScreenshot('button-primary-hover.png', {
     threshold: 0.2,        // 允许20%的差异
     maxDiffPixels: 10,      // 最多10个像素差异
     animations: 'disabled'  // 禁用动画确保一致性
   });
   ```

3. **等待策略** - 确保状态稳定
   ```typescript
   await component.hover();
   await page.waitForTimeout(300); // 等待过渡动画
   ```

### 维护基准截图

1. **定期更新** - 设计变更时及时更新
2. **团队协作** - PR中说明截图变更原因
3. **版本控制** - 基准截图纳入版本管理
4. **环境一致** - 使用CI环境生成基准

### 性能优化

1. **并行执行** - 利用多核处理器
2. **缓存策略** - 缓存依赖和浏览器
3. **增量测试** - 只测试变更相关内容
4. **智能重试** - 失败测试自动重试

## 🔍 故障排除

### 常见问题

1. **测试不稳定**
   ```bash
   # 增加等待时间
   await page.waitForTimeout(500);

   # 降低容差要求
   threshold: 0.3
   ```

2. **截图路径错误**
   ```bash
   # 检查文件路径
   ls -la tests/visual/screenshots/

   # 重新生成基准
   npm run visual:test:update
   ```

3. **浏览器启动失败**
   ```bash
   # 重新安装浏览器
   npx playwright install chromium --with-deps
   ```

4. **主题切换不生效**
   ```typescript
   // 确保等待主题应用
   await setTheme(page, theme);
   await page.waitForTimeout(1000);
   ```

### 调试技巧

1. **Headed模式** - 查看实际浏览器行为
   ```bash
   npm run visual:test:headed
   ```

2. **调试模式** - 暂停执行进行检查
   ```bash
   npm run visual:test:debug
   ```

3. **单文件测试** - 快速验证特定测试
   ```bash
   npx playwright test Button.visual.test.tsx
   ```

4. **截图对比** - 手动检查差异
   ```bash
   # 使用Playwright报告查看对比
   npx playwright show-report
   ```

## 📚 扩展指南

### 添加新组件测试

1. 创建测试文件：`tests/visual/components/NewComponent.visual.test.tsx`
2. 参考现有测试模板
3. 添加到组件页面fixtures
4. 更新测试文档

### 添加新主题测试

1. 在 `test-utils.ts` 中添加主题常量
2. 更新主题切换逻辑
3. 运行完整测试套件
4. 更新基准截图

### 自定义断言

```typescript
// 扩展视觉断言
expect.extend({
  async toHaveGoodContrast(received, threshold = 4.5) {
    const contrast = await getContrastRatio(received);
    return {
      pass: contrast >= threshold,
      message: () => `对比度 ${contrast} 低于阈值 ${threshold}`
    };
  }
});
```

## 🤝 贡献指南

### 提交变更

1. **运行测试** - 确保所有视觉测试通过
2. **更新截图** - 如有设计变更，更新基准截图
3. **文档更新** - 更新相关文档和注释
4. **PR描述** - 详细说明视觉变更原因

### 代码审查

检查要点：
- ✅ 视觉测试覆盖新功能
- ✅ 基准截图是否需要更新
- ✅ 主题适配是否完整
- ✅ 响应式表现是否正常
- ✅ 交互状态是否正确

---

**维护团队**: Xorigo UI Team
**最后更新**: 2025年10月16日
**版本**: 1.0.0