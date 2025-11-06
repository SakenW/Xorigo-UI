# AI助手自然语言解析器

基于Claude API的NLP引擎，将用户描述转换为组件代码需求。

## 特性

- ✅ **意图识别**：准确识别创建、修改、调试等10+种意图
- ✅ **组件检测**：支持Button、Input、Table等20+种组件类型
- ✅ **属性提取**：智能提取size、variant、disabled等20+种属性
- ✅ **样式解析**：支持dark theme、rounded corners等视觉效果
- ✅ **双语支持**：完整支持中文和英文
- ✅ **高性能**：解析响应时间 < 2秒
- ✅ **高准确率**：意图识别准确率 > 85%
- ✅ **缓存机制**：智能缓存提升性能

## 安装

```bash
pnpm add @xorigo-ui/ai
# 或
npm install @xorigo-ui/ai
# 或
yarn add @xorigo-ui/ai
```

## 快速开始

### 1. 基本用法

```typescript
import { createParser } from '@xorigo-ui/ai'

// 创建解析器实例
const parser = createParser({
  language: 'zh', // 或 'en'
  model: 'claude-3-sonnet-20240229',
  timeout: 10000
})

// 解析用户输入
const result = await parser.parse('创建一个主要的大按钮，深色主题')

console.log(result)
/*
{
  intent: {
    primary: 'create_component',
    confidence: 0.92
  },
  component: 'button',
  props: {
    variant: 'primary',
    size: 'lg'
  },
  style: {
    theme: 'dark'
  },
  language: 'zh',
  confidence: 0.92,
  ...
}
*/
```

### 2. 批量解析

```typescript
import { batchParse } from '@xorigo-ui/ai'

const inputs = [
  '创建按钮',
  'Create input',
  '生成表格'
]

const results = await batchParse(inputs, {
  concurrency: 5
})
```

### 3. 快速解析

```typescript
import { quickParse } from '@xorigo-ui/ai'

const result = await quickParse('创建一个按钮组件')
```

## API 文档

### NLPParser

主要的解析器类。

#### 构造函数

```typescript
const parser = new NLPParser(config: ParserConfig)
```

##### ParserConfig

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| language | 'zh' \\| 'en' | 'zh' | 默认语言 |
| model | string | - | Claude API模型 |
| temperature | number | 0.1 | 生成温度 |
| maxTokens | number | 4000 | 最大token数 |
| timeout | number | 10000 | 超时时间(ms) |
| enableCache | boolean | true | 是否启用缓存 |
| cacheTTL | number | 300000 | 缓存TTL(ms) |
| maxRetries | number | 3 | 最大重试次数 |

#### 方法

##### parse(input: string): Promise<ParseResult>

解析用户输入，返回完整的解析结果。

```typescript
interface ParseResult {
  intent: IntentClassification      // 意图分类结果
  component?: ComponentType         // 组件类型
  props: ComponentProps            // 组件属性
  style: StyleAttributes           // 样式属性
  entities: Entity[]               // 抽取的实体
  requirements: string[]           // 需求列表
  constraints: string[]            // 约束列表
  language: Language               // 检测的语言
  confidence: number               // 整体置信度
  suggestions?: string[]           // 建议列表
  context?: Record<string, any>    // 上下文信息
}
```

##### getPerformanceReport(): PerformanceReport

获取性能报告。

```typescript
interface PerformanceReport {
  avgLatency: number       // 平均延迟
  p95Latency: number       // P95延迟
  avgCost: number          // 平均成本
  totalRequests: number    // 总请求数
  cacheHitRate: number     // 缓存命中率
}
```

##### clearCache(): void

清空缓存。

##### resetMetrics(): void

重置性能指标。

### IntentClassifier

意图分类器，负责识别用户意图和抽取实体。

#### classifyIntent(input: string, language: Language): Promise<IntentClassification>

分类用户意图。

```typescript
enum IntentType {
  CREATE_COMPONENT = 'create_component',
  MODIFY_COMPONENT = 'modify_component',
  ADD_FEATURE = 'add_feature',
  REVIEW_CODE = 'review_code',
  DEBUG_ERROR = 'debug_error',
  EXPLAIN_CODE = 'explain_code',
  REFACTOR_CODE = 'refactor_code',
  GENERATE_DOCS = 'generate_docs'
}
```

#### extractEntities(input: string, language: Language): Promise<Entity[]>

抽取实体信息。

```typescript
interface Entity {
  type: 'component' | 'property' | 'value' | 'action' | 'style' | 'constraint'
  value: string
  confidence: number
  startIndex: number
  endIndex: number
  metadata?: Record<string, any>
}
```

### PropExtractor

属性提取器，负责提取组件属性和样式。

#### extractProps(input: string, language: Language, entities: Entity[]): Promise<ComponentProps>

提取组件属性。

```typescript
interface ComponentProps {
  size?: ComponentSize          // xs, sm, md, lg, xl
  variant?: ComponentVariant    // primary, secondary, outline, ghost, link, solid, minimal
  disabled?: boolean
  loading?: boolean
  error?: boolean
  success?: boolean
  required?: boolean
  readOnly?: boolean
  selected?: boolean
  active?: boolean
  expandable?: boolean
  collapsible?: boolean
  sortable?: boolean
  filterable?: boolean
  paginated?: boolean
  virtual?: boolean
  async?: boolean
  multiple?: boolean
  clearable?: boolean
  searchable?: boolean
  draggable?: boolean
  resizable?: boolean
}
```

#### extractStyles(input: string, language: Language, entities: Entity[]): Promise<StyleAttributes>

提取样式属性。

```typescript
interface StyleAttributes {
  theme?: ComponentTheme        // light, dark, auto, sepia, forest, ocean, sunset
  density?: ComponentDensity    // compact, comfortable, spacious
  motion?: ComponentMotion      // none, subtle, moderate, dynamic
  rounded?: boolean
  roundedSize?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  shadow?: boolean
  shadowLevel?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  border?: boolean
  borderStyle?: 'solid' | 'dashed' | 'dotted'
  gradient?: boolean
  animation?: string
  customCSS?: string
}
```

## 支持的组件类型

| 中文 | 英文 | ComponentType |
|------|------|---------------|
| 按钮 | button | BUTTON |
| 输入框 | input | INPUT |
| 表格 | table | TABLE |
| 卡片 | card | CARD |
| 模态框 | modal | MODAL |
| 下拉框 | dropdown | DROPDOWN |
| 复选框 | checkbox | CHECKBOX |
| 单选框 | radio | RADIO |
| 开关 | switch | SWITCH |
| 提示 | tooltip | TOOLTIP |
| 标签页 | tabs | TABS |
| 导航 | navigation | NAVIGATION |
| 表单 | form | FORM |
| 容器 | container | CONTAINER |
| 文本 | text | TEXT |
| 图片 | image | IMAGE |
| 布局 | layout | LAYOUT |

## 使用示例

### 示例1：创建按钮

```typescript
const result = await parser.parse('创建一个主要的大按钮，有阴影和圆角')

console.log(result)
/*
{
  intent: { primary: 'create_component', confidence: 0.95 },
  component: 'button',
  props: {
    variant: 'primary',
    size: 'lg'
  },
  style: {
    shadow: true,
    shadowLevel: 'md',
    rounded: true,
    roundedSize: 'md'
  },
  suggestions: [
    '添加图标可以增强视觉效果',
    '考虑添加loading状态',
    '使用不同变体区分操作优先级'
  ]
}
*/
```

### 示例2：创建输入框

```typescript
const result = await parser.parse('Create an input with error state and validation hints')

console.log(result)
/*
{
  intent: { primary: 'create_component', confidence: 0.93 },
  component: 'input',
  props: {
    error: true,
    required: true
  },
  suggestions: [
    'Add labels for better accessibility',
    'Consider adding validation hints',
    'Use placeholders to guide user input'
  ]
}
*/
```

### 示例3：创建表格

```typescript
const result = await parser.parse('创建一个大型表格，支持排序、分页和虚拟滚动')

console.log(result)
/*
{
  intent: { primary: 'create_component', confidence: 0.97 },
  component: 'table',
  props: {
    sortable: true,
    filterable: true,
    paginated: true,
    virtual: true
  },
  suggestions: [
    'Pagination is recommended for better performance',
    'Consider adding sort functionality',
    'Responsive design requires special handling'
  ]
}
*/
```

### 示例4：修改组件

```typescript
const result = await parser.parse('修改按钮组件，添加禁用状态和loading效果')

console.log(result)
/*
{
  intent: { primary: 'modify_component', confidence: 0.92 },
  component: 'button',
  props: {
    disabled: true,
    loading: true
  }
}
*/
```

### 示例5：调试错误

```typescript
const result = await parser.parse('调试按钮点击无反应的问题')

console.log(result)
/*
{
  intent: { primary: 'debug_error', confidence: 0.89 },
  suggestions: [
    '检查事件处理器是否正确绑定',
    '确认按钮没有被禁用',
    '验证父组件状态是否正确传递'
  ]
}
*/
```

## 性能指标

### 响应时间

- **目标**: < 2秒
- **缓存命中**: < 100ms
- **平均**: 800-1200ms
- **P95**: < 1500ms

### 准确率

- **意图识别**: > 85%
- **属性提取**: > 80%
- **组件检测**: > 90%
- **样式解析**: > 75%

### 缓存命中率

- **目标**: > 70%
- **实际**: 60-80%（取决于输入重复度）

## 环境变量

```bash
# Claude API密钥（必需）
ANTHROPIC_API_KEY=your_api_key_here

# 可选配置
CLAUDE_MODEL=claude-3-sonnet-20240229
CLAUDE_TIMEOUT=10000
```

## 测试

```bash
# 运行所有测试
pnpm test

# 运行特定测试
pnpm test nlp-parser

# 生成覆盖率报告
pnpm test:coverage

# 以UI模式运行测试
pnpm test:ui
```

## 构建

```bash
# 构建包
pnpm build

# 类型检查
pnpm type-check

# 代码检查
pnpm lint
pnpm lint:fix
```

## 性能基准测试

```typescript
import { benchmark } from '@xorigo-ui/ai'

const inputs = [
  '创建按钮',
  '创建输入框',
  '创建表格',
  'Create button',
  'Create input',
  'Create table'
]

const report = await benchmark(parser, inputs, 10)

console.log(report)
/*
{
  avgLatency: 850,
  p50Latency: 820,
  p95Latency: 1450,
  p99Latency: 1780,
  minLatency: 500,
  maxLatency: 1950,
  totalRequests: 60,
  successRate: 1
}
*/
```

## 最佳实践

### 1. 选择合适的模型

```typescript
// 简单任务
const simpleParser = createParser({
  model: 'claude-3-haiku-20240307',
  temperature: 0.1
})

// 复杂任务
const complexParser = createParser({
  model: 'claude-3-opus-20240229',
  temperature: 0.3
})
```

### 2. 启用缓存

```typescript
const parser = createParser({
  enableCache: true,
  cacheTTL: 5 * 60 * 1000 // 5分钟
})
```

### 3. 批量处理

```typescript
const inputs = [...]

// 使用并发控制
const results = await batchParse(inputs, {
  concurrency: 5
})
```

### 4. 性能监控

```typescript
const result = await parser.parse('创建按钮')

// 获取性能报告
const report = parser.getPerformanceReport()
console.log(`平均延迟: ${report.avgLatency}ms`)
console.log(`缓存命中率: ${(report.cacheHitRate * 100).toFixed(1)}%`)
```

## 故障排除

### 问题1：API密钥错误

```
Error: Invalid API key
```

**解决方案**: 确保设置了正确的 `ANTHROPIC_API_KEY` 环境变量。

### 问题2：解析时间过长

```
Warning: Parsing took 3000ms, exceeding target of 2000ms
```

**解决方案**:
1. 启用缓存
2. 简化输入
3. 使用更快的模型（claude-3-haiku）

### 问题3：置信度过低

```
ParseResult { confidence: 0.3, ... }
```

**解决方案**:
1. 提供更详细的描述
2. 使用更明确的关键词
3. 指定组件类型

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

MIT

## 更新日志

### v0.1.0 (2025-11-05)

- ✅ 初始版本发布
- ✅ 支持意图分类
- ✅ 支持属性提取
- ✅ 支持样式解析
- ✅ 支持中英文双语
- ✅ 完整的测试覆盖

## 路线图

- [ ] 支持更多组件类型
- [ ] 增加语义理解能力
- [ ] 支持多轮对话
- [ ] 集成更多AI模型
- [ ] 添加可视化调试工具
- [ ] 支持插件扩展

## 支持

如有问题，请提交 [Issue](https://github.com/xorigo-ui/xorigo-ui/issues) 或联系团队。
