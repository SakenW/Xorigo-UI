# Matrix 可访问性验证系统

TH-UI 组件库的完整 WCAG 2.1 标准验证工具。

## 🎯 功能特性

### 1. 对比度验证 (Contrast Validation)
- ✅ WCAG AA/AAA 标准验证
- ✅ 正常文本: 4.5:1 (AA) / 7:1 (AAA)
- ✅ 大文本: 3:1 (AA) / 4.5:1 (AAA)
- ✅ UI 组件: 3:1
- ✅ 批量验证和调色板验证

### 2. 色盲模拟 (CVD Simulation)
- ✅ Protanopia (红色盲)
- ✅ Deuteranopia (绿色盲)
- ✅ Tritanopia (蓝色盲)
- ✅ Achromatopsia (全色盲)
- ✅ 颜色可区分性验证

### 3. 文本可读性 (Readability)
- ✅ 字体大小验证 (最小 12px)
- ✅ 行高验证 (最小 1.2)
- ✅ 字母间距验证
- ✅ 行长度验证 (最大 80 字符)

### 4. 焦点状态验证 (Focus Validation)
- ✅ 焦点指示器厚度 (最小 2px)
- ✅ 焦点指示器偏移 (最小 1px)
- ✅ 焦点对比度 (最小 3:1)
- ✅ 焦点样式验证

### 5. 键盘导航验证 (Keyboard Navigation)
- ✅ tabIndex 验证
- ✅ ARIA role 验证
- ✅ 可访问标签验证 (aria-label/aria-labelledby)
- ✅ aria-hidden 验证

### 6. 报告生成 (Report Generation)
- ✅ Markdown 格式
- ✅ JSON 格式
- ✅ 控制台格式
- ✅ 详细问题统计

## 📦 安装

```bash
npm install @th-ui/core
```

## 🚀 快速开始

### 基础使用

```typescript
import {
  validateContrast,
  DEFAULT_MATRIX_CONFIG,
} from '@th-ui/core/utils/matrix'

// 验证对比度
const result = validateContrast(
  '#FFFFFF', // 前景色
  '#000000', // 背景色
  'normal',  // 文本类型
  DEFAULT_MATRIX_CONFIG
)

console.log(result.passed) // true
console.log(result.ratio)  // 21
```

### 对比度验证

```typescript
import {
  validateContrast,
  validateContrastBatch,
  calculateContrastRatio,
} from '@th-ui/core/utils/matrix'

// 计算对比度比例
const ratio = calculateContrastRatio('#FFFFFF', '#000000')
console.log(ratio) // 21

// 单个颜色对验证
const result = validateContrast(
  '#FFFFFF',
  '#000000',
  'normal', // 'normal' | 'large' | 'ui-component'
  DEFAULT_MATRIX_CONFIG
)

// 批量验证
const pairs = [
  {
    foreground: '#000000',
    background: '#FFFFFF',
    textType: 'normal' as const,
    label: '主要文本',
  },
  {
    foreground: '#767676',
    background: '#FFFFFF',
    textType: 'large' as const,
    label: '大标题',
  },
]

const issues = validateContrastBatch(pairs, DEFAULT_MATRIX_CONFIG)
```

### 色盲模拟

```typescript
import {
  simulateCVD,
  simulateAllCVD,
  isDistinguishableWithCVD,
} from '@th-ui/core/utils/matrix'

// 模拟红色盲
const protanopia = simulateCVD('#FF0000', 'protanopia')
console.log(protanopia) // '#959500'

// 模拟所有色盲类型
const allSimulations = simulateAllCVD('#FF0000')
console.log(allSimulations)
// {
//   protanopia: '#959500',
//   deuteranopia: '#8f8f00',
//   tritanopia: '#ff1a1a',
//   achromatopsia: '#4c4c4c'
// }

// 检查颜色可区分性
const distinguishable = isDistinguishableWithCVD(
  '#FF0000',
  '#00FF00',
  'protanopia'
)
console.log(distinguishable) // false (红绿色盲无法区分)
```

### 文本可读性验证

```typescript
import {
  validateReadability,
  validateFontSize,
  validateLineHeight,
} from '@th-ui/core/utils/matrix'

// 综合验证
const issues = validateReadability(
  {
    fontSize: 16,
    lineHeight: 1.5,
    letterSpacing: 0,
    lineLength: 70,
  },
  DEFAULT_MATRIX_CONFIG
)

// 单独验证字体大小
const fontIssues = validateFontSize(
  { fontSize: 12 },
  DEFAULT_MATRIX_CONFIG
)

// 单独验证行高
const lineHeightIssues = validateLineHeight(
  { fontSize: 16, lineHeight: '24px' },
  DEFAULT_MATRIX_CONFIG
)
```

### 焦点状态验证

```typescript
import { validateFocus } from '@th-ui/core/utils/matrix'

const issues = validateFocus(
  {
    outlineColor: '#0066CC',
    outlineWidth: 2,
    outlineOffset: 2,
    outlineStyle: 'solid',
    backgroundColor: '#FFFFFF',
  },
  DEFAULT_MATRIX_CONFIG
)
```

### 键盘导航验证

```typescript
import { validateKeyboardAccessibility } from '@th-ui/core/utils/matrix'

const issues = validateKeyboardAccessibility(
  {
    type: 'custom',
    aria: {
      role: 'button',
      ariaLabel: '关闭',
      tabIndex: 0,
    },
    hasIcon: true,
  },
  DEFAULT_MATRIX_CONFIG
)
```

### 生成验证报告

```typescript
import {
  generateMarkdownReport,
  generateJSONReport,
  generateConsoleReport,
} from '@th-ui/core/utils/matrix'

const validationResult = {
  passed: false,
  recipeName: 'Ocean Light',
  issues: [...],
  timestamp: new Date(),
  config: DEFAULT_MATRIX_CONFIG,
}

// Markdown 报告
const mdReport = generateMarkdownReport(validationResult)
console.log(mdReport)

// JSON 报告
const jsonReport = generateJSONReport(validationResult)
console.log(JSON.stringify(jsonReport, null, 2))

// 控制台报告
const consoleReport = generateConsoleReport(validationResult)
console.log(consoleReport)
```

## ⚙️ 配置选项

### 默认配置 (WCAG AA)

```typescript
import { DEFAULT_MATRIX_CONFIG } from '@th-ui/core/utils/matrix'

const config = {
  contrast: {
    normalTextAA: 4.5,
    largeTextAA: 3.0,
    normalTextAAA: 7.0,
    largeTextAAA: 4.5,
    uiComponentAA: 3.0,
  },
  readability: {
    minFontSize: 12,
    recommendedMinFontSize: 14,
    minLineHeight: 1.2,
    recommendedLineHeight: 1.5,
    minLetterSpacing: -0.05,
    maxLineLength: 80,
  },
  focus: {
    minContrast: 3.0,
    minThickness: 2,
    minOffset: 1,
  },
  strictness: 'AA',
  enableCVDSimulation: true,
  cvdTypes: ['protanopia', 'deuteranopia', 'tritanopia'],
}
```

### 严格配置 (WCAG AAA)

```typescript
import { STRICT_MATRIX_CONFIG } from '@th-ui/core/utils/matrix'

// strictness: 'AAA'
// 其他配置与 DEFAULT_MATRIX_CONFIG 相同
```

### 自定义配置

```typescript
import { type MatrixConfig } from '@th-ui/core/utils/matrix'

const customConfig: MatrixConfig = {
  ...DEFAULT_MATRIX_CONFIG,
  strictness: 'AAA',
  readability: {
    ...DEFAULT_MATRIX_CONFIG.readability,
    minFontSize: 14, // 更严格的字体要求
  },
}
```

## 📊 验证问题类型

### 严重级别

```typescript
type SeverityLevel = 'error' | 'warning' | 'info'
```

- **error**: 必须修复的问题 (不符合 WCAG 标准)
- **warning**: 建议修复的问题 (符合最低标准但不理想)
- **info**: 信息性提示 (无法解析的值等)

### 问题类型

- `contrast` - 对比度不足
- `palette-contrast` - 调色板对比度问题
- `font-size` - 字体大小问题
- `line-height` - 行高问题
- `letter-spacing` - 字母间距问题
- `line-length` - 行长度问题
- `focus-thickness` - 焦点指示器厚度问题
- `focus-offset` - 焦点指示器偏移问题
- `focus-contrast` - 焦点对比度问题
- `focus-style` - 焦点样式问题
- `tabindex` - tabIndex 问题
- `role` - ARIA role 问题
- `accessible-label` - 可访问标签问题
- `aria-hidden` - aria-hidden 问题

## 🧪 测试

```bash
# 运行测试
npm run test

# 测试覆盖率
npm run test:coverage
```

测试覆盖率目标: > 90%

## 📚 参考资料

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Color Blindness Simulator](https://www.color-blindness.com/coblis-color-blindness-simulator/)
- [MDN Web Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## 🔗 相关工具

- [color-contrast-checker](https://github.com/bbc/color-contrast-checker) - WCAG 对比度计算库
- [axe-core](https://github.com/dequelabs/axe-core) - 可访问性测试引擎
- [pa11y](https://github.com/pa11y/pa11y) - 自动化可访问性测试

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**维护**: TH-UI Team
**版本**: 0.1.0
**最后更新**: 2024-01-01
