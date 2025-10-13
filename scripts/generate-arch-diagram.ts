#!/usr/bin/env tsx
/**
 * 架构图生成工具
 * 生成 Xorigo UI Monorepo 架构可视化
 */

import { writeFileSync } from 'fs'
import { resolve } from 'path'

// Mermaid 架构图定义
const architectureDiagram = `
# Xorigo UI 架构图

## Monorepo 整体结构

\`\`\`mermaid
graph TB
    subgraph "Xorigo UI Monorepo"
        subgraph "Packages (组件库)"
            tokens[tokens<br/>设计令牌]
            style_recipe[style-recipe<br/>样式配方]
            system[system<br/>系统组件]
            hooks[hooks<br/>React Hooks]
            core[core<br/>核心组件]
            registry[registry<br/>组件注册表]
        end

        subgraph "Apps (应用)"
            website[Website<br/>Next.js 15 文档站点]
        end

        subgraph "工具链"
            cli[CLI<br/>开发工具]
            scripts[Scripts<br/>构建脚本]
        end
    end

    %% 依赖关系
    style_recipe --> tokens
    system --> tokens
    system --> style_recipe
    hooks --> tokens
    core --> tokens
    core --> style_recipe
    core --> system
    core --> hooks
    registry --> core

    website --> core
    website --> registry
    cli --> registry

    style tokens fill:#e1f5ff
    style style_recipe fill:#e8f5e9
    style system fill:#fff9c4
    style hooks fill:#ffebee
    style core fill:#f3e5f5
    style registry fill:#e0f2f1
    style website fill:#ffe0b2
    style cli fill:#f0f4c3
\`\`\`

## 七轴 DTCG 设计系统

\`\`\`mermaid
graph LR
    subgraph "七轴配方系统"
        mode[Mode<br/>light/dark]
        tone[Tone<br/>色调]
        density[Density<br/>密度]
        surface[Surface<br/>表面]
        radius[Radius<br/>圆角]
        semantic[Semantic<br/>语义]
        brand[Brand<br/>品牌]
    end

    subgraph "令牌层"
        colors[Colors]
        spacing[Spacing]
        typography[Typography]
        shadows[Shadows]
        motion[Motion]
    end

    mode --> colors
    tone --> colors
    density --> spacing
    surface --> colors
    radius --> shadows
    semantic --> colors
    brand --> colors

    style mode fill:#e3f2fd
    style tone fill:#e8f5e9
    style density fill:#fff9c4
    style surface fill:#fce4ec
    style radius fill:#f3e5f5
    style semantic fill:#e0f2f1
    style brand fill:#ffe0b2
\`\`\`

## 组件层级架构

\`\`\`mermaid
graph TB
    subgraph "组件层级"
        base[Base 原子层<br/>Button, Input, Badge]
        layout[Layout 布局<br/>Container, Grid, Flex]
        navigation[Navigation 导航<br/>Menu, Breadcrumb, Tabs]
        form[Form 表单<br/>FormField, Validator]
        data[Data 数据展示<br/>Table, List, Tree]
        feedback[Feedback 反馈<br/>Modal, Alert, Toast]
        composite[Composite 复合<br/>Header, Card, Dashboard]
        visualization[Visualization 可视化<br/>Chart, Graph, Heatmap]
        adapters[Adapters 适配器<br/>Radix UI, HeadlessUI]
    end

    base --> layout
    base --> navigation
    base --> form
    base --> data
    base --> feedback
    layout --> composite
    navigation --> composite
    form --> composite
    data --> composite
    data --> visualization
    adapters --> base
    adapters --> layout
    adapters --> navigation

    style base fill:#e3f2fd
    style layout fill:#e8f5e9
    style navigation fill:#fff9c4
    style form fill:#ffebee
    style data fill:#f3e5f5
    style feedback fill:#fce4ec
    style composite fill:#e0f2f1
    style visualization fill:#ffe0b2
    style adapters fill:#f0f4c3
\`\`\`

## DX Enhancement 层

\`\`\`mermaid
graph TB
    subgraph "DX 工具链"
        cli_menu[dev-menu.sh<br/>交互式 CLI]
        perf[Performance Dashboard<br/>性能监控]
        typedoc[TypeDoc<br/>文档生成]
        arch[架构可视化<br/>Mermaid 图表]
    end

    subgraph "监控 SDK"
        monitor[PerformanceMonitor<br/>Core Web Vitals]
        hooks_perf[Performance Hooks<br/>React 集成]
        components[可视化组件<br/>MetricCard, Chart]
    end

    subgraph "分析工具"
        bundle[Bundle Analyzer<br/>包大小分析]
        deps[Dependency Checker<br/>依赖检查]
        validator[Package Validator<br/>包结构验证]
    end

    cli_menu --> perf
    cli_menu --> typedoc
    cli_menu --> arch
    perf --> monitor
    perf --> hooks_perf
    perf --> components
    cli_menu --> bundle
    cli_menu --> deps
    cli_menu --> validator

    style cli_menu fill:#e1f5ff
    style perf fill:#e8f5e9
    style typedoc fill:#fff9c4
    style arch fill:#ffebee
    style monitor fill:#f3e5f5
    style bundle fill:#e0f2f1
\`\`\`

## 数据流架构

\`\`\`mermaid
sequenceDiagram
    participant User
    participant Website
    participant Core
    participant System
    participant Tokens

    User->>Website: 访问页面
    Website->>Core: 加载组件
    Core->>System: 获取主题配置
    System->>Tokens: 读取设计令牌
    Tokens-->>System: 返回令牌值
    System-->>Core: 应用主题
    Core-->>Website: 渲染组件
    Website-->>User: 展示页面

    User->>Website: 切换主题
    Website->>System: 更新主题状态
    System->>Tokens: 重新计算令牌
    Tokens-->>System: 新令牌值
    System-->>Core: 触发重渲染
    Core-->>Website: 更新 UI
    Website-->>User: 主题切换完成
\`\`\`
`

// SVG 架构图 (简化版)
const svgDiagram = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <defs>
    <style>
      .node { fill: #ffffff; stroke: #1976d2; stroke-width: 2; }
      .node-text { fill: #212121; font-family: Arial; font-size: 14px; }
      .arrow { stroke: #616161; stroke-width: 2; fill: none; marker-end: url(#arrowhead); }
      .title { fill: #1976d2; font-family: Arial; font-size: 20px; font-weight: bold; }
      .subtitle { fill: #616161; font-family: Arial; font-size: 12px; }
    </style>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#616161" />
    </marker>
  </defs>

  <!-- 标题 -->
  <text x="400" y="30" text-anchor="middle" class="title">Xorigo UI 架构概览</text>
  <text x="400" y="50" text-anchor="middle" class="subtitle">Monorepo 结构 • 七轴 DTCG • 九大组件体系</text>

  <!-- Tokens 层 -->
  <rect x="50" y="100" width="120" height="60" class="node" rx="5" />
  <text x="110" y="135" text-anchor="middle" class="node-text">Tokens</text>

  <!-- Style Recipe 层 -->
  <rect x="220" y="100" width="120" height="60" class="node" rx="5" />
  <text x="280" y="135" text-anchor="middle" class="node-text">Style Recipe</text>

  <!-- System 层 -->
  <rect x="390" y="100" width="120" height="60" class="node" rx="5" />
  <text x="450" y="135" text-anchor="middle" class="node-text">System</text>

  <!-- Hooks 层 -->
  <rect x="560" y="100" width="120" height="60" class="node" rx="5" />
  <text x="620" y="135" text-anchor="middle" class="node-text">Hooks</text>

  <!-- Core 层 -->
  <rect x="220" y="220" width="280" height="80" class="node" rx="5" />
  <text x="360" y="250" text-anchor="middle" class="node-text">Core Components</text>
  <text x="360" y="275" text-anchor="middle" class="subtitle">9大组件体系 • 50+组件</text>

  <!-- Website 层 -->
  <rect x="220" y="360" width="280" height="80" class="node" rx="5" />
  <text x="360" y="390" text-anchor="middle" class="node-text">Website (Next.js 15)</text>
  <text x="360" y="415" text-anchor="middle" class="subtitle">文档 • Playground • 演示</text>

  <!-- DX Tools 层 -->
  <rect x="560" y="220" width="180" height="220" class="node" rx="5" />
  <text x="650" y="250" text-anchor="middle" class="node-text">DX Tools</text>
  <text x="650" y="280" text-anchor="middle" class="subtitle">• CLI 菜单</text>
  <text x="650" y="305" text-anchor="middle" class="subtitle">• 性能监控</text>
  <text x="650" y="330" text-anchor="middle" class="subtitle">• Bundle 分析</text>
  <text x="650" y="355" text-anchor="middle" class="subtitle">• 文档生成</text>
  <text x="650" y="380" text-anchor="middle" class="subtitle">• 架构可视化</text>

  <!-- 箭头连接 -->
  <path d="M 170 130 L 220 130" class="arrow" />
  <path d="M 340 130 L 390 130" class="arrow" />
  <path d="M 510 130 L 560 130" class="arrow" />
  <path d="M 360 160 L 360 220" class="arrow" />
  <path d="M 360 300 L 360 360" class="arrow" />
  <path d="M 500 260 L 560 260" class="arrow" />
  <path d="M 500 400 L 560 400" class="arrow" />

  <!-- 图例 -->
  <text x="50" y="520" class="subtitle" font-weight="bold">图例说明：</text>
  <rect x="50" y="530" width="15" height="15" class="node" rx="2" />
  <text x="75" y="542" class="subtitle">包 (Package)</text>
  <path d="M 200 537 L 250 537" class="arrow" />
  <text x="260" y="542" class="subtitle">依赖关系</text>
</svg>
`

// 主函数
async function generateArchDiagrams() {
  const outputDir = resolve(process.cwd(), 'docs')

  console.log('📊 生成架构图...\n')

  // 1. Mermaid 文档
  const mermaidPath = resolve(outputDir, 'ARCHITECTURE.md')
  writeFileSync(mermaidPath, architectureDiagram, 'utf-8')
  console.log(`✅ Mermaid 架构图: ${mermaidPath}`)

  // 2. SVG 图表
  const svgPath = resolve(outputDir, 'architecture-diagram.svg')
  writeFileSync(svgPath, svgDiagram, 'utf-8')
  console.log(`✅ SVG 架构图: ${svgPath}`)

  console.log('\n✨ 架构图生成完成！')
  console.log('\n📖 使用方式:')
  console.log('  • Mermaid 图: 在支持 Mermaid 的编辑器中打开 ARCHITECTURE.md')
  console.log('  • SVG 图: 直接在浏览器中打开 architecture-diagram.svg')
  console.log('  • GitHub: 两种格式都可以在 README.md 中引用')
}

// 执行
generateArchDiagrams().catch(console.error)
