# 🔄 Xorigo UI Website 架构数据流和交互图

> **版本**: v2.0.0
> **创建时间**: 2025-10-13
> **目标**: 可视化数据流、组件交互和状态管理

---

## 一、完整系统数据流

### 1.1 四层架构数据流图

```mermaid
graph TB
    subgraph "Layer 4: Packages (只读源) - 上游数据"
        P1[registry.json<br/>组件注册表]
        P2[tokens/*.json<br/>设计令牌]
        P3[docs/*.mdx<br/>文档内容]
        P4[templates/*.tsx<br/>组件模板]
        P5[i18n/*.json<br/>国际化]
    end

    subgraph "Layer 3: Data Layer (适配层) - 只读入口"
        D1[registry.readonly.ts<br/>Registry 适配器]
        D2[tokens.readonly.ts<br/>Tokens 适配器]
        D3[docs.readonly.ts<br/>Docs 适配器]
        D4[validation.ts<br/>一致性校验]
    end

    subgraph "Layer 2: SDK Layer (协议层) - 客户端访问"
        SDK1[registry-client.ts<br/>Registry SDK]
        SDK2[tokens-client.ts<br/>Tokens SDK]
        SDK3[docs-client.ts<br/>Docs SDK]
        SDK4[cache.ts<br/>客户端缓存]
    end

    subgraph "Layer 1: App Layer (展示层) - 用户界面"
        subgraph "RSC Pages (服务端渲染)"
            A1[首页<br/>/]
            A2[文档<br/>/docs]
            A3[Adoption<br/>/adoption]
            A4[Tokens<br/>/tokens]
            A5[Theme<br/>/themes]
        end

        subgraph "Client Pages (客户端渲染)"
            A6[Playground<br/>/playground]
            A7[Search<br/>/search]
        end

        subgraph "API Routes"
            A8[/api/registry]
            A9[/api/tokens]
            A10[/api/docs]
            A11[/api/search]
        end
    end

    %% 构建时数据流
    P1 -.构建时读取.-> D1
    P2 -.构建时读取.-> D2
    P3 -.构建时读取.-> D3
    P4 -.构建时读取.-> D3
    P5 -.构建时读取.-> D3

    %% 校验流程
    D1 -.Schema 校验.-> D4
    D2 -.Schema 校验.-> D4
    D3 -.Schema 校验.-> D4
    D4 -.构建阻断.-> D1

    %% RSC 服务端数据访问
    D1 -->|直接访问| A1
    D1 -->|直接访问| A2
    D1 -->|直接访问| A3
    D2 -->|直接访问| A4
    D2 -->|直接访问| A5

    %% API Routes 数据访问
    D1 -->|直接访问| A8
    D2 -->|直接访问| A9
    D3 -->|直接访问| A10
    D1 -->|直接访问| A11
    D3 -->|直接访问| A11

    %% Client 通过 SDK 访问
    A8 -->|API 响应| SDK1
    A9 -->|API 响应| SDK2
    A10 -->|API 响应| SDK3
    A11 -->|API 响应| SDK1

    SDK1 -->|缓存| SDK4
    SDK2 -->|缓存| SDK4
    SDK3 -->|缓存| SDK4

    SDK1 -->|数据| A6
    SDK1 -->|数据| A7
    SDK2 -->|数据| A6
    SDK3 -->|数据| A7

    style P1 fill:#e1f5ff
    style P2 fill:#e1f5ff
    style P3 fill:#e1f5ff
    style P4 fill:#e1f5ff
    style P5 fill:#e1f5ff

    style D1 fill:#fff3e0
    style D2 fill:#fff3e0
    style D3 fill:#fff3e0
    style D4 fill:#ffebee

    style SDK1 fill:#f3e5f5
    style SDK2 fill:#f3e5f5
    style SDK3 fill:#f3e5f5
    style SDK4 fill:#f3e5f5

    style A1 fill:#e8f5e9
    style A2 fill:#e8f5e9
    style A3 fill:#e8f5e9
    style A4 fill:#e8f5e9
    style A5 fill:#e8f5e9

    style A6 fill:#e3f2fd
    style A7 fill:#e3f2fd
```

---

## 二、Playground 完整数据流

### 2.1 Playground 双模式交互图

```mermaid
graph TB
    subgraph "用户交互层"
        U1[用户操作<br/>编辑 Props]
        U2[用户操作<br/>切换主题]
        U3[用户操作<br/>保存快照]
        U4[用户操作<br/>对比快照]
    end

    subgraph "Playground Store (Zustand)"
        S1[currentTheme<br/>currentDensity<br/>currentRtl]
        S2[selectedComponent<br/>componentProps]
        S3[snapshots[]<br/>currentSnapshot]
        S4[history[]<br/>historyIndex]
        S5[editMode<br/>compareMode]
    end

    subgraph "Live Props 模式"
        L1[Live Props Editor<br/>实时编辑]
        L2[Theme Editor<br/>主题编辑]
        L3[Props Editor<br/>属性编辑]
        L4[Token Inspector<br/>令牌检查]
        L5[Component Preview<br/>实时预览]
    end

    subgraph "Snapshot 模式"
        SN1[Snapshot Manager<br/>快照管理]
        SN2[Compare Mode<br/>对比模式]
        SN3[Snapshot A<br/>快照 A 预览]
        SN4[Snapshot B<br/>快照 B 预览]
        SN5[Diff Viewer<br/>差异分析]
    end

    subgraph "数据持久化"
        P1[LocalStorage<br/>Zustand Persist]
        P2[URL Params<br/>?theme=&density=]
    end

    %% 用户操作到 Store
    U1 -->|updateComponentProp| S2
    U2 -->|setThemeState| S1
    U3 -->|saveSnapshot| S3
    U4 -->|setCompareMode| S5

    %% Store 到 Live Props 模式
    S1 -->|subscribe| L2
    S2 -->|subscribe| L3
    S1 -->|subscribe| L4
    S1 & S2 -->|subscribe| L5

    %% Live Props 模式交互
    L1 -->|包含| L2
    L1 -->|包含| L3
    L1 -->|包含| L4
    L1 -->|渲染| L5

    %% Store 到 Snapshot 模式
    S3 -->|subscribe| SN1
    S5 -->|subscribe| SN2
    S3 -->|快照数据| SN3
    S3 -->|快照数据| SN4

    %% Snapshot 模式交互
    SN2 -->|包含| SN3
    SN2 -->|包含| SN4
    SN2 -->|包含| SN5
    SN3 & SN4 -->|比较| SN5

    %% 数据持久化
    S3 -.持久化.-> P1
    S1 -.持久化.-> P1
    S1 <-.同步.-> P2

    %% 历史管理
    S1 -->|记录变更| S4
    S2 -->|记录变更| S4
    S4 -->|undo/redo| S1
    S4 -->|undo/redo| S2

    style U1 fill:#fff3e0
    style U2 fill:#fff3e0
    style U3 fill:#fff3e0
    style U4 fill:#fff3e0

    style S1 fill:#e3f2fd
    style S2 fill:#e3f2fd
    style S3 fill:#e3f2fd
    style S4 fill:#e3f2fd
    style S5 fill:#e3f2fd

    style L1 fill:#e8f5e9
    style L2 fill:#e8f5e9
    style L3 fill:#e8f5e9
    style L4 fill:#e8f5e9
    style L5 fill:#e8f5e9

    style SN1 fill:#f3e5f5
    style SN2 fill:#f3e5f5
    style SN3 fill:#f3e5f5
    style SN4 fill:#f3e5f5
    style SN5 fill:#f3e5f5

    style P1 fill:#ffebee
    style P2 fill:#ffebee
```

### 2.2 Playground 状态管理详图

```mermaid
stateDiagram-v2
    [*] --> LivePropsMode: 默认模式

    LivePropsMode --> EditingProps: 编辑属性
    LivePropsMode --> EditingTheme: 编辑主题
    LivePropsMode --> InspectingTokens: 检查令牌

    EditingProps --> LivePropsMode: 保存
    EditingTheme --> LivePropsMode: 应用
    InspectingTokens --> LivePropsMode: 关闭

    LivePropsMode --> SaveSnapshot: 保存快照
    SaveSnapshot --> SnapshotMode: 进入快照模式

    SnapshotMode --> ListSnapshots: 查看列表
    SnapshotMode --> LoadSnapshot: 加载快照
    SnapshotMode --> DeleteSnapshot: 删除快照
    SnapshotMode --> CompareMode: 对比模式

    ListSnapshots --> SnapshotMode
    LoadSnapshot --> LivePropsMode: 恢复状态
    DeleteSnapshot --> SnapshotMode

    CompareMode --> SelectSnapshotA: 选择快照 A
    CompareMode --> SelectSnapshotB: 选择快照 B

    SelectSnapshotA --> CompareMode
    SelectSnapshotB --> CompareMode

    SelectSnapshotA --> ViewDiff: 查看差异
    SelectSnapshotB --> ViewDiff

    ViewDiff --> CompareMode: 继续对比
    CompareMode --> SnapshotMode: 退出对比

    SnapshotMode --> LivePropsMode: 返回编辑
```

---

## 三、搜索系统数据流

### 3.1 搜索引擎架构图

```mermaid
graph TB
    subgraph "用户输入"
        U1[Cmd+K 快捷键]
        U2[搜索输入框]
        U3[搜索筛选]
    end

    subgraph "Search Store (Zustand)"
        SS1[searchQuery<br/>搜索关键词]
        SS2[searchHistory[]<br/>搜索历史]
        SS3[recentSearches[]<br/>最近搜索]
        SS4[activeFilters<br/>活跃筛选]
    end

    subgraph "搜索引擎 (Fuse.js)"
        SE1[Search Index<br/>搜索索引]
        SE2[Component Index<br/>组件索引]
        SE3[Docs Index<br/>文档索引]
        SE4[Token Index<br/>令牌索引]
    end

    subgraph "搜索 API"
        API1[/api/search]
        API2[Search Engine<br/>搜索引擎]
        API3[Data Loader<br/>数据加载器]
    end

    subgraph "搜索结果"
        R1[Components<br/>组件结果]
        R2[Docs<br/>文档结果]
        R3[Tokens<br/>令牌结果]
        R4[Highlights<br/>高亮显示]
    end

    subgraph "数据源"
        D1[registry.readonly.ts]
        D2[docs.readonly.ts]
        D3[tokens.readonly.ts]
    end

    %% 用户输入到 Store
    U1 -->|触发| U2
    U2 -->|输入| SS1
    U3 -->|筛选| SS4

    %% Store 到 API
    SS1 -->|搜索请求| API1
    SS4 -->|筛选条件| API1

    %% API 处理流程
    API1 -->|调用| API2
    API2 -->|加载数据| API3

    %% 数据加载
    D1 -->|提供数据| API3
    D2 -->|提供数据| API3
    D3 -->|提供数据| API3

    %% 搜索索引
    API3 -->|构建索引| SE1
    SE1 -->|组件索引| SE2
    SE1 -->|文档索引| SE3
    SE1 -->|令牌索引| SE4

    %% 搜索执行
    API2 -->|搜索| SE2
    API2 -->|搜索| SE3
    API2 -->|搜索| SE4

    %% 搜索结果
    SE2 -->|组件结果| R1
    SE3 -->|文档结果| R2
    SE4 -->|令牌结果| R3

    %% 结果高亮
    R1 -->|高亮| R4
    R2 -->|高亮| R4
    R3 -->|高亮| R4

    %% 搜索历史
    SS1 -.记录.-> SS2
    SS1 -.记录.-> SS3

    style U1 fill:#fff3e0
    style U2 fill:#fff3e0
    style U3 fill:#fff3e0

    style SS1 fill:#e3f2fd
    style SS2 fill:#e3f2fd
    style SS3 fill:#e3f2fd
    style SS4 fill:#e3f2fd

    style SE1 fill:#f3e5f5
    style SE2 fill:#f3e5f5
    style SE3 fill:#f3e5f5
    style SE4 fill:#f3e5f5

    style R1 fill:#e8f5e9
    style R2 fill:#e8f5e9
    style R3 fill:#e8f5e9
    style R4 fill:#e8f5e9
```

### 3.2 搜索性能优化流程

```mermaid
sequenceDiagram
    participant User as 用户
    participant Input as 搜索输入框
    participant Debounce as 防抖处理<br/>(300ms)
    participant Cache as 客户端缓存
    participant API as /api/search
    participant Engine as 搜索引擎<br/>(Fuse.js)
    participant Index as 搜索索引

    User->>Input: 输入关键词
    Input->>Debounce: 触发防抖

    Note over Debounce: 等待 300ms<br/>用户停止输入

    Debounce->>Cache: 检查缓存

    alt 缓存命中
        Cache-->>Input: 返回缓存结果
        Input-->>User: 显示结果 (< 10ms)
    else 缓存未命中
        Cache->>API: 发起搜索请求
        API->>Engine: 执行搜索
        Engine->>Index: 查询索引
        Index-->>Engine: 返回匹配项
        Engine->>Engine: 权重排序
        Engine-->>API: 返回结果
        API-->>Cache: 写入缓存
        Cache-->>Input: 返回结果
        Input-->>User: 显示结果 (< 200ms)
    end

    Note over User,Index: 性能目标:<br/>缓存命中 < 10ms<br/>API 响应 < 200ms
```

---

## 四、Adoption Matrix 数据流

### 4.1 组件矩阵筛选流程

```mermaid
graph TB
    subgraph "用户筛选操作"
        F1[类别筛选<br/>Category]
        F2[标签筛选<br/>Tags]
        F3[依赖筛选<br/>Dependencies]
        F4[特性筛选<br/>A11y/RTL/I18n]
    end

    subgraph "Filter Store (Zustand)"
        FS1[activeCategory[]<br/>活跃类别]
        FS2[activeTags[]<br/>活跃标签]
        FS3[activeDeps[]<br/>活跃依赖]
        FS4[activeFeatures{}<br/>活跃特性]
    end

    subgraph "筛选引擎"
        FE1[Filter Engine<br/>筛选引擎]
        FE2[Category Filter<br/>类别筛选]
        FE3[Tag Filter<br/>标签筛选]
        FE4[Dependency Filter<br/>依赖筛选]
        FE5[Feature Filter<br/>特性筛选]
    end

    subgraph "数据源"
        D1[Registry Readonly<br/>组件注册表]
        D2[All Components[]<br/>所有组件]
    end

    subgraph "筛选结果"
        R1[Filtered Components[]<br/>筛选后组件]
        R2[Component Cards<br/>组件卡片]
        R3[Statistics<br/>统计信息]
    end

    subgraph "性能优化"
        P1[Virtual List<br/>虚拟滚动]
        P2[Memoization<br/>结果缓存]
    end

    %% 用户筛选到 Store
    F1 -->|更新| FS1
    F2 -->|更新| FS2
    F3 -->|更新| FS3
    F4 -->|更新| FS4

    %% 数据加载
    D1 -->|提供| D2

    %% Store 到筛选引擎
    FS1 -->|筛选条件| FE1
    FS2 -->|筛选条件| FE1
    FS3 -->|筛选条件| FE1
    FS4 -->|筛选条件| FE1

    %% 筛选引擎处理
    FE1 -->|类别| FE2
    FE1 -->|标签| FE3
    FE1 -->|依赖| FE4
    FE1 -->|特性| FE5

    %% 应用筛选
    D2 -->|输入| FE2
    FE2 -->|中间结果| FE3
    FE3 -->|中间结果| FE4
    FE4 -->|中间结果| FE5

    %% 输出结果
    FE5 -->|筛选结果| R1
    R1 -->|渲染| R2
    R1 -->|计算| R3

    %% 性能优化
    R2 -->|虚拟化| P1
    R1 -.缓存.-> P2
    P2 -.复用.-> R1

    %% 性能监控
    FE1 -.性能检测.-> Monitor[Performance Monitor<br/>≤ 50ms]

    style F1 fill:#fff3e0
    style F2 fill:#fff3e0
    style F3 fill:#fff3e0
    style F4 fill:#fff3e0

    style FS1 fill:#e3f2fd
    style FS2 fill:#e3f2fd
    style FS3 fill:#e3f2fd
    style FS4 fill:#e3f2fd

    style FE1 fill:#f3e5f5
    style FE2 fill:#f3e5f5
    style FE3 fill:#f3e5f5
    style FE4 fill:#f3e5f5
    style FE5 fill:#f3e5f5

    style R1 fill:#e8f5e9
    style R2 fill:#e8f5e9
    style R3 fill:#e8f5e9

    style P1 fill:#ffebee
    style P2 fill:#ffebee
    style Monitor fill:#ffe0b2
```

### 4.2 筛选性能优化策略

```mermaid
sequenceDiagram
    participant User as 用户
    participant UI as 筛选 UI
    participant Store as Filter Store
    participant Cache as Memo Cache
    participant Engine as 筛选引擎
    participant Data as 组件数据

    User->>UI: 选择筛选条件
    UI->>Store: 更新筛选状态
    Store->>Cache: 检查缓存

    alt 缓存命中
        Cache-->>UI: 返回缓存结果
        UI-->>User: 显示结果 (< 10ms)
    else 缓存未命中
        Store->>Engine: 执行筛选
        Engine->>Data: 读取组件数据

        Note over Engine: 多条件并行筛选<br/>类别 && 标签 && 依赖 && 特性

        Engine->>Engine: 应用筛选逻辑
        Engine->>Engine: 计算统计信息
        Engine-->>Cache: 写入缓存
        Cache-->>UI: 返回结果
        UI-->>User: 显示结果 (< 50ms)
    end

    Note over User,Data: 性能目标:<br/>缓存命中 < 10ms<br/>1000 项筛选 < 50ms
```

---

## 五、主题系统数据流

### 5.1 主题切换流程图

```mermaid
graph TB
    subgraph "用户操作"
        U1[选择主题<br/>Brand/Mode]
        U2[选择密度<br/>Density]
        U3[选择方向<br/>RTL/LTR]
    end

    subgraph "Theme Store (Zustand)"
        TS1[currentTheme<br/>当前主题]
        TS2[currentDensity<br/>当前密度]
        TS3[currentRtl<br/>当前方向]
        TS4[themeState<br/>主题状态]
    end

    subgraph "主题生成"
        TG1[generateThemeState<br/>生成主题状态]
        TG2[getColorPalette<br/>颜色调色板]
        TG3[getSpacingScale<br/>间距系统]
        TG4[getTypographySystem<br/>字体系统]
        TG5[getBorderRadiusScale<br/>圆角系统]
        TG6[getShadowSystem<br/>阴影系统]
        TG7[getAnimationSystem<br/>动画系统]
    end

    subgraph "URL 同步"
        URL1[URL Params<br/>?theme=&density=&rtl=]
        URL2[useThemeSync<br/>URL 状态同步]
    end

    subgraph "CSS 变量注入"
        CSS1[CSS Custom Properties<br/>--color-primary-500]
        CSS2[Tailwind CSS<br/>动态配置]
        CSS3[Global Styles<br/>全局样式]
    end

    subgraph "组件应用"
        C1[Component Preview<br/>组件预览]
        C2[Token Inspector<br/>令牌检查]
        C3[Theme Preview<br/>主题预览]
    end

    %% 用户操作到 Store
    U1 -->|setThemeState| TS1
    U2 -->|setDensity| TS2
    U3 -->|setRtl| TS3

    %% Store 到主题生成
    TS1 -->|theme| TG1
    TS2 -->|density| TG1
    TS3 -->|rtl| TG1

    %% 主题生成流程
    TG1 -->|调用| TG2
    TG1 -->|调用| TG3
    TG1 -->|调用| TG4
    TG1 -->|调用| TG5
    TG1 -->|调用| TG6
    TG1 -->|调用| TG7

    %% 生成结果
    TG2 -->|colors| TS4
    TG3 -->|spacing| TS4
    TG4 -->|typography| TS4
    TG5 -->|borderRadius| TS4
    TG6 -->|shadows| TS4
    TG7 -->|animations| TS4

    %% URL 同步
    TS1 -.同步.-> URL1
    TS2 -.同步.-> URL1
    TS3 -.同步.-> URL1
    URL1 <-.监听.-> URL2
    URL2 -->|恢复状态| TS1

    %% CSS 注入
    TS4 -->|注入| CSS1
    CSS1 -->|应用| CSS2
    CSS2 -->|更新| CSS3

    %% 组件应用
    TS4 -->|subscribe| C1
    TS4 -->|subscribe| C2
    TS4 -->|subscribe| C3

    style U1 fill:#fff3e0
    style U2 fill:#fff3e0
    style U3 fill:#fff3e0

    style TS1 fill:#e3f2fd
    style TS2 fill:#e3f2fd
    style TS3 fill:#e3f2fd
    style TS4 fill:#e3f2fd

    style TG1 fill:#f3e5f5
    style TG2 fill:#f3e5f5
    style TG3 fill:#f3e5f5
    style TG4 fill:#f3e5f5
    style TG5 fill:#f3e5f5
    style TG6 fill:#f3e5f5
    style TG7 fill:#f3e5f5

    style CSS1 fill:#e8f5e9
    style CSS2 fill:#e8f5e9
    style CSS3 fill:#e8f5e9

    style C1 fill:#ffebee
    style C2 fill:#ffebee
    style C3 fill:#ffebee
```

### 5.2 主题 URL 参数化流程

```mermaid
sequenceDiagram
    participant User as 用户
    participant UI as 主题 UI
    participant Store as Theme Store
    participant Hook as useThemeSync
    participant URL as URL Params
    participant Browser as 浏览器

    Note over User,Browser: 场景 1: 用户切换主题

    User->>UI: 选择主题 "dark"
    UI->>Store: setThemeState("dark")
    Store->>Store: 更新 currentTheme
    Store->>Hook: 通知状态变化
    Hook->>Hook: 编码主题状态
    Hook->>URL: 更新 URL 参数
    URL->>Browser: 更新地址栏
    Browser-->>User: 显示新 URL<br/>?theme=dark&density=modern

    Note over User,Browser: 场景 2: 用户分享 URL

    User->>Browser: 复制 URL 并分享
    Browser->>User: 提供完整 URL

    Note over User,Browser: 场景 3: 接收者访问 URL

    User->>Browser: 访问分享的 URL
    Browser->>URL: 解析 URL 参数
    URL->>Hook: 提取主题状态
    Hook->>Hook: 解码主题状态
    Hook->>Store: 恢复主题状态
    Store->>UI: 应用主题
    UI-->>User: 显示相同主题效果
```

---

## 六、错误处理和降级策略

### 6.1 分层错误边界

```mermaid
graph TB
    subgraph "错误边界层次"
        EB1[Global Error Boundary<br/>全局错误边界]
        EB2[Page Error Boundary<br/>页面错误边界]
        EB3[Component Error Boundary<br/>组件错误边界]
    end

    subgraph "错误类型"
        E1[RSC 渲染错误]
        E2[Client 运行时错误]
        E3[MDX 编译错误]
        E4[数据加载错误]
        E5[API 请求错误]
    end

    subgraph "错误处理策略"
        H1[友好错误提示]
        H2[重试机制]
        H3[降级显示]
        H4[错误上报]
    end

    subgraph "降级内容"
        F1[Error Fallback UI<br/>错误回退 UI]
        F2[Skeleton Loader<br/>骨架屏]
        F3[Empty State<br/>空状态]
    end

    %% 错误到边界
    E1 -->|捕获| EB2
    E2 -->|捕获| EB3
    E3 -->|捕获| EB2
    E4 -->|捕获| EB3
    E5 -->|捕获| EB3

    %% 边界到策略
    EB1 -->|应用| H1
    EB1 -->|应用| H4
    EB2 -->|应用| H1
    EB2 -->|应用| H2
    EB2 -->|应用| H3
    EB3 -->|应用| H1
    EB3 -->|应用| H2

    %% 策略到降级
    H1 -->|显示| F1
    H3 -->|显示| F2
    H3 -->|显示| F3

    style EB1 fill:#ffebee
    style EB2 fill:#ffebee
    style EB3 fill:#ffebee

    style E1 fill:#fff3e0
    style E2 fill:#fff3e0
    style E3 fill:#fff3e0
    style E4 fill:#fff3e0
    style E5 fill:#fff3e0

    style H1 fill:#e3f2fd
    style H2 fill:#e3f2fd
    style H3 fill:#e3f2fd
    style H4 fill:#e3f2fd

    style F1 fill:#e8f5e9
    style F2 fill:#e8f5e9
    style F3 fill:#e8f5e9
```

### 6.2 错误恢复流程

```mermaid
sequenceDiagram
    participant Comp as 组件
    participant Boundary as Error Boundary
    participant Log as Error Logger
    participant UI as Error UI
    participant User as 用户

    Comp->>Comp: 抛出错误
    Comp->>Boundary: 错误被捕获
    Boundary->>Boundary: getDerivedStateFromError
    Boundary->>Boundary: hasError = true

    Boundary->>Log: componentDidCatch
    Log->>Log: 记录错误信息
    Log-->>Log: 发送到监控系统

    Boundary->>UI: 渲染错误 UI
    UI-->>User: 显示友好错误提示

    alt 用户点击重试
        User->>UI: 点击重试按钮
        UI->>Boundary: 重置错误状态
        Boundary->>Boundary: hasError = false
        Boundary->>Comp: 重新渲染组件

        alt 渲染成功
            Comp-->>User: 显示正常内容
        else 渲染失败
            Comp->>Boundary: 再次抛出错误
            Boundary-->>User: 建议刷新页面
        end
    else 用户刷新页面
        User->>Browser: 刷新页面
        Browser->>Comp: 重新加载
    end
```

---

## 七、性能监控数据流

### 7.1 性能指标收集流程

```mermaid
graph TB
    subgraph "性能数据源"
        D1[Web Vitals API]
        D2[Performance API]
        D3[Bundle Analyzer]
        D4[axe-core]
    end

    subgraph "数据收集"
        C1[Metric Collector<br/>指标收集器]
        C2[LCP/FCP/CLS/FID]
        C3[Bundle Size]
        C4[A11y Score]
    end

    subgraph "数据聚合"
        A1[Metrics Aggregator<br/>指标聚合器]
        A2[Real User Metrics<br/>真实用户指标]
        A3[Build Metrics<br/>构建指标]
    end

    subgraph "性能监控"
        M1[Performance Monitor<br/>性能监控器]
        M2[Threshold Check<br/>阈值检查]
        M3[Alert System<br/>告警系统]
    end

    subgraph "可视化展示"
        V1[DX Dashboard<br/>DX 仪表板]
        V2[Performance Charts<br/>性能图表]
        V3[A11y Report<br/>可访问性报告]
    end

    %% 数据源到收集
    D1 -->|LCP/FCP/CLS/FID| C2
    D2 -->|Performance Timing| C2
    D3 -->|Bundle Size| C3
    D4 -->|A11y Violations| C4

    %% 收集到聚合
    C1 -->|收集| C2
    C1 -->|收集| C3
    C1 -->|收集| C4
    C2 -->|指标| A1
    C3 -->|指标| A1
    C4 -->|指标| A1

    %% 聚合分类
    A1 -->|分类| A2
    A1 -->|分类| A3

    %% 监控处理
    A2 -->|实时监控| M1
    A3 -->|构建监控| M1
    M1 -->|检查| M2
    M2 -->|超限| M3

    %% 可视化
    M1 -->|数据| V1
    V1 -->|包含| V2
    V1 -->|包含| V3

    style D1 fill:#fff3e0
    style D2 fill:#fff3e0
    style D3 fill:#fff3e0
    style D4 fill:#fff3e0

    style C1 fill:#e3f2fd
    style C2 fill:#e3f2fd
    style C3 fill:#e3f2fd
    style C4 fill:#e3f2fd

    style A1 fill:#f3e5f5
    style A2 fill:#f3e5f5
    style A3 fill:#f3e5f5

    style M1 fill:#e8f5e9
    style M2 fill:#e8f5e9
    style M3 fill:#ffebee

    style V1 fill:#e1f5ff
    style V2 fill:#e1f5ff
    style V3 fill:#e1f5ff
```

---

## 八、构建和部署流程

### 8.1 CI/CD 流程图

```mermaid
graph TB
    subgraph "开发阶段"
        D1[代码提交<br/>git push]
        D2[触发 CI<br/>GitHub Actions]
    end

    subgraph "构建前检查"
        C1[ESLint<br/>代码规范]
        C2[TypeScript<br/>类型检查]
        C3[Data Validation<br/>数据一致性]
        C4[Unit Tests<br/>单元测试]
    end

    subgraph "构建阶段"
        B1[npm run build<br/>Next.js 构建]
        B2[Bundle Analysis<br/>体积分析]
        B3[Bundle Size Check<br/>体积检查]
    end

    subgraph "测试阶段"
        T1[E2E Tests<br/>端到端测试]
        T2[A11y Audit<br/>可访问性审计]
        T3[Performance Test<br/>性能测试]
    end

    subgraph "部署阶段"
        DE1[Deploy Preview<br/>预览部署]
        DE2[Deploy Production<br/>生产部署]
        DE3[Invalidate CDN<br/>CDN 失效]
    end

    subgraph "监控阶段"
        M1[Health Check<br/>健康检查]
        M2[Performance Monitor<br/>性能监控]
        M3[Error Tracking<br/>错误追踪]
    end

    %% 开发到检查
    D1 -->|触发| D2
    D2 -->|并行运行| C1
    D2 -->|并行运行| C2
    D2 -->|并行运行| C3
    D2 -->|并行运行| C4

    %% 检查到构建
    C1 -->|通过| B1
    C2 -->|通过| B1
    C3 -->|通过| B1
    C4 -->|通过| B1

    %% 构建分析
    B1 -->|生成| B2
    B2 -->|检查| B3

    %% 构建到测试
    B1 -->|通过| T1
    B1 -->|通过| T2
    B1 -->|通过| T3

    %% 测试到部署
    T1 -->|通过| DE1
    T2 -->|通过| DE1
    T3 -->|通过| DE1

    %% 部署流程
    DE1 -->|审核通过| DE2
    DE2 -->|部署完成| DE3

    %% 部署到监控
    DE3 -->|启动| M1
    DE3 -->|启动| M2
    DE3 -->|启动| M3

    %% 失败处理
    C1 -.失败.-> Fail[构建失败<br/>通知团队]
    C2 -.失败.-> Fail
    C3 -.失败.-> Fail
    C4 -.失败.-> Fail
    B3 -.超限.-> Fail
    T1 -.失败.-> Fail
    T2 -.失败.-> Fail
    T3 -.失败.-> Fail

    style D1 fill:#fff3e0
    style D2 fill:#fff3e0

    style C1 fill:#e3f2fd
    style C2 fill:#e3f2fd
    style C3 fill:#e3f2fd
    style C4 fill:#e3f2fd

    style B1 fill:#f3e5f5
    style B2 fill:#f3e5f5
    style B3 fill:#f3e5f5

    style T1 fill:#e8f5e9
    style T2 fill:#e8f5e9
    style T3 fill:#e8f5e9

    style DE1 fill:#e1f5ff
    style DE2 fill:#e1f5ff
    style DE3 fill:#e1f5ff

    style M1 fill:#fff9c4
    style M2 fill:#fff9c4
    style M3 fill:#fff9c4

    style Fail fill:#ffebee
```

---

## 九、总结

### 9.1 核心数据流模式

1. **只读数据模式**: Packages → Data Layer (只读适配) → SDK Layer (协议) → App Layer (展示)
2. **RSC/Client 分离**: RSC 服务端直接访问 Data Layer，Client 通过 SDK 访问 API Routes
3. **状态管理模式**: Zustand Store + Persist 中间件 + URL 同步
4. **错误处理模式**: 分层错误边界 + 友好降级 + 错误上报
5. **性能监控模式**: 实时指标收集 + 聚合分析 + 阈值告警

### 9.2 关键交互流程

1. **Playground 双模式**: Live Props (实时编辑) + Snapshot (快照对比)
2. **搜索系统**: Cmd+K 触发 → 防抖处理 → 缓存检查 → Fuse.js 搜索 → 结果高亮
3. **筛选系统**: 多条件并行筛选 → Memoization 缓存 → Virtual List 虚拟化
4. **主题系统**: 主题切换 → 状态生成 → CSS 注入 → URL 同步
5. **构建部署**: 构建前检查 → Next.js 构建 → 体积检查 → E2E 测试 → 部署监控

---

**文档维护**: Xorigo UI Architecture Team
**版本**: v2.0.0
**更新时间**: 2025-10-13
**状态**: 架构设计完成
