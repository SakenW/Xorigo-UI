# 🔄 Website × Packages 联动架构验收清单

> **文档版本**：v1.0
> **适用范围**：Xorigo UI 展示层与核心包群的集成验证
> **验收目标**：确保 Website 成为「可靠可视的只读壳层」，Packages 成为「可验证的七轴内核」

---

## 📋 验收概览

### 验收优先级
- **🔴 P0（立即验收）**：数据一致性、边界控制、硬护栏
- **🟡 P1（本周验收）**：功能完整性、性能指标、用户体验
- **🟢 P2（择期验收）**：优化功能、监控面板、高级特性

### 验收方法论
1. **自动化检查**：CI/CD 流水线自动验证
2. **手动验收**：功能体验和边界条件测试
3. **性能基准**：使用标准工具集进行性能测量
4. **可访问性审计**：axe-core 和人工检查结合

---

## 🔴 P0 硬护栏验收（立即执行）

### 1. 数据访问控制验收

#### 1.1 只读数据访问边界
```bash
# 验证脚本
npm run check:data-access

# 预期结果
✅ 所有数据访问通过 src/data/*.readonly.ts
✅ 无直接访问 @xorigo-ui/registry 或 @xorigo-ui/tokens
✅ ESLint no-restricted-imports 规则生效
```

**验收清单**：
- [ ] Website 代码中无直接 import packages 的路径
- [ ] 所有数据读取均通过 readonly 适配层
- [ ] ESLint 规则正确配置并生效
- [ ] 构建时数据访问检查通过

#### 1.2 Schema 校验机制
```bash
# 运行 Schema 校验
npm run validate:schemas

# 预期结果
✅ registry.json 通过 JSON Schema 校验
✅ tokens/*.json 通过 JSON Schema 校验
✅ 无 Schema 兼容性问题
```

**验收清单**：
- [ ] registry.json Schema 文件存在且版本固定
- [ ] tokens JSON Schema 文件存在且版本固定
- [ ] CI 流水线包含 Schema 校验步骤
- [ ] 校验失败时构建被阻断

#### 1.3 构建前一致性检查
```bash
# 运行一致性检查
npm run check:consistency

# 预期结果
✅ registry.preview.module 路径一致性 100%
✅ 组件导出与注册表一致性 100%
✅ 令牌引用一致性 100%
```

**验收清单**：
- [ ] registry.preview.module 中的路径都可访问
- [ ] 组件名称与注册表完全匹配
- [ ] 令牌引用路径正确无误
- [ ] 不一致时构建被阻断并报告详情

### 2. RSC/Client 边界验收

#### 2.1 RSC 约束检查
```typescript
// 检查 RSC 页面约束
const RSC_PAGES = [
  'app/docs/**/page.tsx',
  'app/adoption/page.tsx',
  'app/tokens/**/page.tsx',
  'app/themes/page.tsx'
]

// 验证无浏览器 API 使用
npm run check:rsc-constraints

// 预期结果
✅ RSC 页面无 window/document API
✅ RSC 页面无 useEffect/useLayoutEffect
✅ RSC 页面无客户端专用依赖
```

**验收清单**：
- [ ] 所有 RSC 页面通过约束检查
- [ ] 无浏览器 API 在服务端组件中使用
- [ ] 无客户端专用 Hook 在 RSC 中使用
- [ ] RSC 页面可正常服务端渲染

#### 2.2 Client 组件动态导入
```typescript
// 验证动态导入配置
const CLIENT_COMPONENTS = [
  'components/playground/Playground',
  'components/interactive/TokenInspector',
  'components/performance/PerformancePanel'
]

// 检查动态导入实现
npm run check:dynamic-imports

// 预期结果
✅ 所有客户端组件使用 dynamic() 导入
✅ ssr: false 配置正确
✅ loading 状态组件存在
```

**验收清单**：
- [ ] Playground 组件使用动态导入
- [ ] 所有客户端交互组件动态加载
- [ ] ssr: false 配置正确应用
- [ ] 加载状态组件正常显示

#### 2.3 体积预算控制
```bash
# 运行体积检查
npm run check:bundle-size

# 预期结果
✅ 站点基础包 ≤ 120KB gzip
✅ Playground 单页 ≤ 150KB gzip
✅ 无超限警告或错误
```

**验收清单**：
- [ ] 站点基础包体积符合预算
- [ ] Playground 页面体积符合预算
- [ ] size-limit 配置正确生效
- [ ] 超限时构建被阻断

### 3. 错误容忍机制验收

#### 3.1 分层错误边界
```typescript
// 测试错误边界功能
npm run test:error-boundaries

// 测试场景
1. MDX 渲染错误
2. 组件示例加载失败
3. 只读数据缺失
4. 网络请求失败

// 预期结果
✅ 单点错误不影响全站
✅ 错误页面友好显示
✅ 重试机制正常工作
✅ 错误日志正确记录
```

**验收清单**：
- [ ] MDX 渲染错误边界正常工作
- [ ] Playground 错误边界正常工作
- [ ] 页面级错误边界正常工作
- [ ] 全局错误边界正常工作
- [ ] 错误恢复机制有效

---

## 🟡 P1 功能完整性验收（本周内）

### 4. Adoption 取用矩阵验收

#### 4.1 组件展示功能
```typescript
// 验证组件矩阵功能
const ADOPTION_FEATURES = {
  componentListing: true,
  categoryFiltering: true,
  tagFiltering: true,
  searchFunctionality: true,
  dependencyDisplay: true,
  a11yComplianceDisplay: true,
  rtlSupportDisplay: true,
  tokenUsageDisplay: true
}

// 性能测试
npm run test:adoption-performance

// 预期结果
✅ 1k 项筛选交互 ≤ 50ms
✅ 搜索响应时间 ≤ 200ms
✅ 组件列表渲染流畅
```

**验收清单**：
- [ ] 组件分类展示正常
- [ ] 标签过滤功能正常
- [ ] 搜索功能准确快速
- [ ] 依赖关系可视化
- [ ] 可访问性评分显示
- [ ] RTL 支持标识
- [ ] 令牌使用展示
- [ ] 性能指标达标

#### 4.2 一键复制功能
```typescript
// 测试复制功能
const COPY_COMMANDS = [
  'xorigo add Button',
  'xorigo add Input --variant="outlined"',
  'xorigo add Modal --with-portal'
]

// 验证复制功能
npm run test:copy-commands

// 预期结果
✅ 复制按钮正常工作
✅ 命令格式正确
✅ 剪贴板权限正常
✅ 复制成功提示显示
```

**验收清单**：
- [ ] 复制按钮点击正常
- [ ] 命令格式准确无误
- [ ] 复制成功有用户反馈
- [ ] 支持多种复制格式

### 5. Playground 交互沙盒验收

#### 5.1 Props 编辑器
```typescript
// 验证 Props 编辑器功能
const PROPS_EDITOR_FEATURES = {
  stringEditing: true,
  numberEditing: true,
  booleanEditing: true,
  enumSelection: true,
  arrayEditing: true,
  objectEditing: true,
  tokenValueSuggestion: true,
  typeValidation: true
}

// 测试所有组件 Props 编辑
npm run test:playground-props

// 预期结果
✅ 所有基础类型编辑正常
✅ 枚举值自动推断正确
✅ 令牌值提示准确
✅ 类型验证有效
```

**验收清单**：
- [ ] 基础类型编辑器正常
- [ ] 枚举值下拉选择正常
- [ ] 数组和对象编辑器正常
- [ ] 令牌值自动提示
- [ ] 类型验证错误提示
- [ ] Props 变更实时反映

#### 5.2 主题切换功能
```typescript
// 验证主题切换
const THEME_CONTROLS = {
  density: ['compact', 'normal', 'spacious'],
  mode: ['light', 'dark', 'auto'],
  contrast: ['normal', 'high'],
  direction: ['ltr', 'rtl']
}

// 测试主题切换
npm run test:theme-switching

// 预期结果
✅ 所有主题切换正常
✅ 状态保持正确
✅ URL 参数同步
✅ 组件样式正确更新
```

**验收清单**：
- [ ] 密度切换正常工作
- [ ] 明暗模式切换正常
- [ ] 高对比度模式正常
- [ ] RTL 模式切换正常
- [ ] 主题状态 URL 同步
- [ ] 组件样式正确响应

#### 5.3 Token Inspector
```typescript
// 验证令牌检查器
const TOKEN_INSPECTOR_FEATURES = {
  designTokenAnalysis: true,
  semanticTokenAnalysis: true,
  stateTokenAnalysis: true,
  themeTokenAnalysis: true,
  usageVisualization: true
}

// 测试令牌分析
npm run test:token-inspector

// 预期结果
✅ 设计令牌分析准确
✅ 语义令牌分析准确
✅ 状态令牌分析准确
✅ 主题令牌分析准确
✅ 使用可视化清晰
```

**验收清单**：
- [ ] 设计令牌正确识别
- [ ] 语义令牌正确识别
- [ ] 状态令牌正确识别
- [ ] 主题令牌正确识别
- [ ] 令牌使用可视化
- [ ] 令牌值详情展示

### 6. Tokens/Theme Hub 验收

#### 6.1 可视化令牌浏览器
```typescript
// 验证令牌可视化
const TOKEN_VISUALIZATION = {
  colorTokens: {
    swatchDisplay: true,
    contrastCheck: true,
    wcagCompliance: true
  },
  spacingTokens: {
    visualRuler: true,
    relativeScale: true
  },
  motionTokens: {
    previewAnimation: true,
    durationDisplay: true,
    easingDisplay: true
  }
}

// 测试令牌可视化
npm run test:token-visualization

// 预期结果
✅ 颜色令牌可视化正确
✅ 间距令牌可视化正确
✅ 动效令牌可视化正确
✅ WCAG 合规性检查准确
```

**验收清单**：
- [ ] 颜色令牌色板显示
- [ ] 对比度实时检查
- [ ] WCAG 合规性标识
- [ ] 间距令牌可视化尺子
- [ ] 动效令牌预览动画
- [ ] 令牌详情信息展示

#### 6.2 URL 参数化共享
```typescript
// 验证 URL 共享功能
const URL_PARAMETERS = {
  brand: 'string',
  mode: 'string',
  density: 'string',
  contrast: 'string',
  rtl: 'boolean'
}

// 测试 URL 同步
npm run test:url-sync

// 预期结果
✅ URL 参数正确解析
✅ 主题状态同步正确
✅ URL 生成正确
✅ 深链接可分享
```

**验收清单**：
- [ ] URL 参数正确解析
- [ ] 主题状态同步到 URL
- [ ] URL 变更同步到主题
- [ ] 深链接可正常访问
- [ ] 分享链接功能正常

### 7. 站点级搜索验收

#### 7.1 统一搜索功能
```typescript
// 验证搜索功能
const SEARCH_SOURCES = {
  components: true,
  documentation: true,
  tokens: true,
  examples: true
}

// 测试搜索性能
npm run test:search-performance

// 预期结果
✅ 搜索索引构建正确
✅ 搜索结果准确
✅ 搜索响应快速
✅ 搜索高亮正常
```

**验收清单**：
- [ ] 组件搜索准确
- [ ] 文档搜索准确
- [ ] 令牌搜索准确
- [ ] 示例代码搜索准确
- [ ] 搜索结果高亮
- [ ] 搜索性能达标

---

## 🟢 P2 优化功能验收（可择期）

### 8. 性能面板验收

#### 8.1 性能指标展示
```typescript
// 验证性能面板
const PERFORMANCE_METRICS = {
  bundleSize: {
    gzip: true,
    brotli: true,
    parsed: true
  },
  renderPerformance: {
    firstPaint: true,
    firstContentfulPaint: true,
    largestContentfulPaint: true,
    interactionTime: true
  },
  memoryUsage: {
    peak: true,
    average: true,
    leaks: true
  }
}

// 测试性能面板
npm run test:performance-panel

// 预期结果
✅ 性能指标收集正确
✅ 指标展示清晰
✅ 历史数据对比
✅ 优化建议提供
```

**验收清单**：
- [ ] Bundle 大小指标正确
- [ ] 渲染性能指标正确
- [ ] 内存使用指标正确
- [ ] 性能趋势图表显示
- [ ] 优化建议准确

### 9. 可达性面板验收

#### 9.1 axe 结果集成
```typescript
// 验证可访问性面板
const A11Y_CHECKS = {
  automatedScanning: true,
  violationReporting: true,
  passReporting: true,
  scoreCalculation: true,
  suggestionProviding: true
}

// 测试可访问性检查
npm run test:a11y-panel

// 预期结果
✅ axe 扫描正常
✅ 违规项报告准确
✅ 通过项报告准确
✅ 可访问性评分正确
✅ 改进建议有用
```

**验收清单**：
- [ ] axe 自动扫描正常
- [ ] 违规项详细报告
- [ ] 可访问性评分计算
- [ ] 改进建议提供
- [ ] 参考文档链接

### 10. 快照链接验收

#### 10.1 Playground 状态持久化
```typescript
// 验证快照功能
const SNAPSHOT_FEATURES = {
  stateEncoding: true,
  stateDecoding: true,
  urlGeneration: true,
  stateValidation: true,
  sharingCapability: true
}

// 测试快照功能
npm run test:snapshot-functionality

// 预期结果
✅ 状态编码正确
✅ 状态解码正确
✅ URL 生成正确
✅ 状态验证有效
✅ 分享功能正常
```

**验收清单**：
- [ ] Playground 状态正确编码
- [ ] URL 参数正确解码
- [ ] 状态完整性验证
- [ ] 快照链接可访问
- [ ] 状态恢复正确

---

## 📊 KPI 指标验收标准

### 性能指标验收

| 指标 | 目标值 | 验收方法 | 状态 |
|------|--------|----------|------|
| **首屏 LCP (3G)** | ≤ 2.5s | Lighthouse CI | □ 通过 / ❌ 失败 |
| **CLS (累积布局偏移)** | ≤ 0.05 | Lighthouse CI | □ 通过 / ❌ 失败 |
| **Adoption 页面筛选** | ≤ 50ms | Performance API | □ 通过 / ❌ 失败 |
| **站点基础包体积** | ≤ 120KB gzip | Bundle Analyzer | □ 通过 / ❌ 失败 |
| **Playground 单页体积** | ≤ 150KB gzip | Bundle Analyzer | □ 通过 / ❌ 失败 |

### 可用性指标验收

| 指标 | 目标值 | 验收方法 | 状态 |
|------|--------|----------|------|
| **站点级 a11y** | 严重/中等问题 0 | axe-core CI | □ 通过 / ❌ 失败 |
| **示例加载成功率** | ≥ 99% | ErrorBoundary 监控 | □ 通过 / ❌ 失败 |
| **搜索响应时间** | ≤ 200ms | Search Analytics | □ 通过 / ❌ 失败 |
| **Playground 渲染时间** | ≤ 100ms | Performance API | □ 通过 / ❌ 失败 |

### 内容质量指标验收

| 指标 | 目标值 | 验收方法 | 状态 |
|------|--------|----------|------|
| **文档覆盖率** | 100% 组件有文档 | Registry Check | □ 通过 / ❌ 失败 |
| **示例完整性** | 100% 组件有示例 | Registry Check | □ 通过 / ❌ 失败 |
| **令牌一致性** | 100% 一致 | Schema Validation | □ 通过 / ❌ 失败 |
| **链接有效性** | 100% 有效 | Link Checker | □ 通过 / ❌ 失败 |

---

## 🔧 验收工具集

### 自动化验收脚本

```bash
# 完整验收命令套件
npm run验收:all           # 运行所有验收检查
npm run验收:p0           # 仅运行 P0 硬护栏验收
npm run验收:p1           # 仅运行 P1 功能验收
npm run验收:p2           # 仅运行 P2 优化验收
npm run验收:performance  # 性能指标验收
npm run验收:a11y         # 可访问性验收
npm run验收:consistency  # 数据一致性验收
```

### 手动验收检查清单

```markdown
## 手动验收清单

### 用户体验验收
- [ ] 站点导航流畅直观
- [ ] 页面加载速度满意
- [ ] 搜索功能准确快速
- [ ] 示例交互响应及时
- [ ] 错误处理友好清晰

### 跨浏览器验收
- [ ] Chrome 最新版正常
- [ ] Firefox 最新版正常
- [ ] Safari 最新版正常
- [ ] Edge 最新版正常

### 移动端验收
- [ ] 响应式布局正确
- [ ] 触摸交互正常
- [ ] 性能表现可接受
- [ ] 可访问性支持良好

### 集成验收
- [ ] 与 Packages 数据同步
- [ ] 深链跳转正常
- [ ] 状态共享正确
- [ ] 错误传播受控
```

---

## ✅ 最终验收结论

### 验收通过标准

**P0 硬护栏**：必须 100% 通过，任何一项失败即验收不通过

**P1 功能完整性**：核心功能必须 100% 通过，辅助功能允许 ≤ 5% 缺陷

**P2 优化功能**：建议功能优先完成，允许 ≤ 10% 缺陷

**KPI 指标**：所有关键指标必须达标，允许非关键指标轻微偏差

### 验收报告模板

```markdown
## Xorigo UI 联动架构验收报告

**验收日期**：YYYY-MM-DD
**验收版本**：v1.x.x
**验收环境**：生产环境

### 验收结果概览
- **P0 硬护栏**：✅ 通过 (100%)
- **P1 功能完整性**：✅ 通过 (98%)
- **P2 优化功能**：⚠️ 部分通过 (85%)
- **KPI 指标**：✅ 通过 (95%)

### 关键指标达成情况
- 首屏 LCP：2.1s ✅ (目标 ≤ 2.5s)
- 站点 a11y：0 严重问题 ✅
- 站点体积：115KB gzip ✅ (目标 ≤ 120KB)
- Playground 体积：142KB gzip ✅ (目标 ≤ 150KB)

### 发现的问题与改进建议
1. [问题描述] - [优先级] - [建议解决方案]
2. [问题描述] - [优先级] - [建议解决方案]

### 验收结论
□ 通过验收，可以发布
⚠️ 有条件通过，需修复关键问题
❌ 验收不通过，需重新提交

### 下一步行动
- [ ] 修复发现的问题
- [ ] 更新文档
- [ ] 准备发布
```

---

**结论**：按此验收清单执行后，Website 将成为「**可靠可视的只读壳层**」，Packages 成为「**可验证的七轴内核**」，确保 Xorigo UI 生态的**结构正确性**能够持续固化为**长期可维护、可度量的高质量产线**。