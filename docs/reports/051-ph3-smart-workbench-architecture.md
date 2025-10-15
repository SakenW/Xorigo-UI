# 🧠 智能工作台新架构设计

## 📋 架构概览

基于现有代码结构分析，设计一个渐进式升级的智能工作台架构，保持向后兼容的同时，引入AI增强功能。

## 🏗️ 架构层次图

```
┌─────────────────────────────────────────────────────────────┐
│                    🎨 智能工作台架构                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   表示层     │  │   智能层     │  │   数据层     │         │
│  │  (UI Layer) │  │ (AI Layer)  │  │(Data Layer) │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 响应式布局   │  │ 智能搜索引擎 │  │ 组件分类数据 │         │
│  │ 智能预览卡   │  │ 推荐系统     │  │ 用户行为数据 │         │
│  │ 交互优化     │  │ 上下文感知   │  │ 搜索索引数据 │         │
│  │ 可访问性支持 │  │ 性能优化引擎 │  │ 缓存数据     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 核心模块设计

### 1. 🧠 智能搜索引擎 (IntelligentSearchEngine)

```typescript
// src/lib/workbench/intelligent-search/
interface IntelligentSearchEngine {
  // 搜索配置
  config: SearchConfig;

  // 搜索方法
  search: (query: SearchQuery) => Promise<SearchResult>;
  suggest: (partial: string) => Promise<string[]>;

  // 索引管理
  buildIndex: (components: ComponentInfo[]) => Promise<void>;
  updateIndex: (component: ComponentInfo) => Promise<void>;
}

interface SearchQuery {
  text: string;
  context?: SearchContext;
  filters?: SearchFilter[];
  preferences?: UserPreferences;
}

interface SearchResult {
  components: ComponentMatch[];
  suggestions: string[];
  relatedSearches: string[];
  totalFound: number;
  searchTime: number;
}

interface ComponentMatch {
  component: ComponentInfo;
  score: number;           // 匹配分数 0-100
  matchType: 'exact' | 'partial' | 'semantic';
  highlights: string[];   // 高亮匹配词
  relatedComponents: string[]; // 相关组件
  usageStats: {
    frequency: number;
    recentUsage: Date;
    userRating?: number;
  };
}
```

**搜索算法实现**：

```typescript
class IntelligentSearchEngineImpl implements IntelligentSearchEngine {
  private componentIndex: Map<string, ComponentInfo>;
  private semanticIndex: SemanticIndex;
  private userBehaviorAnalyzer: UserBehaviorAnalyzer;

  async search(query: SearchQuery): Promise<SearchResult> {
    const startTime = performance.now();

    // 1. 文本匹配搜索
    const textMatches = this.textSearch(query.text);

    // 2. 语义搜索
    const semanticMatches = await this.semanticSearch(query.text);

    // 3. 上下文感知搜索
    const contextualMatches = this.contextualSearch(query);

    // 4. 用户偏好调整
    const personalizedMatches = this.personalizeMatches(
      [...textMatches, ...semanticMatches, ...contextualMatches],
      query.preferences
    );

    // 5. 结果排序和优化
    const rankedResults = this.rankResults(personalizedMatches);

    const searchTime = performance.now() - startTime;

    return {
      components: rankedResults.slice(0, 20), // 限制结果数量
      suggestions: await this.generateSuggestions(query.text),
      relatedSearches: this.getRelatedSearches(query.text),
      totalFound: rankedResults.length,
      searchTime
    };
  }

  private textSearch(query: string): ComponentMatch[] {
    const lowercaseQuery = query.toLowerCase();
    const matches: ComponentMatch[] = [];

    for (const [id, component] of this.componentIndex) {
      const score = this.calculateTextScore(component, lowercaseQuery);
      if (score > 0) {
        matches.push({
          component,
          score,
          matchType: score >= 90 ? 'exact' : 'partial',
          highlights: this.extractHighlights(component, lowercaseQuery),
          relatedComponents: this.findRelatedComponents(component),
          usageStats: this.getUsageStats(component.name)
        });
      }
    }

    return matches;
  }

  private async semanticSearch(query: string): Promise<ComponentMatch[]> {
    // 使用词向量或嵌入模型进行语义搜索
    const queryEmbedding = await this.semanticIndex.getEmbedding(query);
    const matches: ComponentMatch[] = [];

    for (const [id, component] of this.componentIndex) {
      const componentEmbedding = await this.semanticIndex.getEmbedding(
        `${component.name} ${component.description}`
      );

      const similarity = this.cosineSimilarity(queryEmbedding, componentEmbedding);

      if (similarity > 0.7) { // 语义相似度阈值
        matches.push({
          component,
          score: similarity * 100,
          matchType: 'semantic',
          highlights: [],
          relatedComponents: this.findRelatedComponents(component),
          usageStats: this.getUsageStats(component.name)
        });
      }
    }

    return matches;
  }
}
```

### 2. 🎨 智能组件预览引擎 (IntelligentPreviewEngine)

```typescript
// src/lib/workbench/preview-engine/
interface IntelligentPreviewEngine {
  // 预览配置
  config: PreviewConfig;

  // 预览方法
  generatePreview: (component: ComponentInfo, options: PreviewOptions) => Promise<ComponentPreview>;
  optimizePreview: (preview: ComponentPreview, context: PreviewContext) => ComponentPreview;

  // 缓存管理
  cachePreview: (component: ComponentInfo, preview: ComponentPreview) => void;
  getCachedPreview: (component: ComponentInfo) => ComponentPreview | null;
}

interface PreviewOptions {
  mode: 'compact' | 'normal' | 'detailed' | 'comparison';
  theme: string;
  size: 'sm' | 'md' | 'lg';
  interactive: boolean;
  animated: boolean;
  showCode: boolean;
  context?: PreviewContext;
}

interface ComponentPreview {
  component: ComponentInfo;
  rendered: {
    live: React.ReactNode;        // 实际渲染的组件
    screenshot?: string;          // 截图
    code?: string;               // 代码示例
  };
  metadata: {
    dimensions: { width: number; height: number };
    loadTime: number;
    complexity: 'simple' | 'medium' | 'complex';
    accessibility: AccessibilityInfo;
  };
  suggestions: {
    relatedComponents: string[];
    popularCombinations: string[];
    usageTips: string[];
  };
}

class IntelligentPreviewEngineImpl implements IntelligentPreviewEngine {
  private renderer: ComponentRenderer;
  private screenshotGenerator: ScreenshotGenerator;
  private codeGenerator: CodeGenerator;
  private cache: Map<string, ComponentPreview>;

  async generatePreview(
    component: ComponentInfo,
    options: PreviewOptions
  ): Promise<ComponentPreview> {
    const cacheKey = this.generateCacheKey(component, options);

    // 检查缓存
    const cached = this.cache.get(cacheKey);
    if (cached && !this.isCacheExpired(cached)) {
      return cached;
    }

    // 生成预览
    const startTime = performance.now();

    // 1. 渲染组件
    const renderedComponent = await this.renderer.render(component, options);

    // 2. 生成截图（如果需要）
    let screenshot: string | undefined;
    if (options.mode !== 'compact') {
      screenshot = await this.screenshotGenerator.generate(renderedComponent);
    }

    // 3. 生成代码示例（如果需要）
    let code: string | undefined;
    if (options.showCode) {
      code = await this.codeGenerator.generate(component, options);
    }

    const loadTime = performance.now() - startTime;

    // 4. 分析复杂度和可访问性
    const complexity = this.analyzeComplexity(component);
    const accessibility = await this.analyzeAccessibility(renderedComponent);

    // 5. 生成建议
    const suggestions = this.generateSuggestions(component);

    const preview: ComponentPreview = {
      component,
      rendered: {
        live: renderedComponent,
        screenshot,
        code
      },
      metadata: {
        dimensions: this.calculateDimensions(component, options),
        loadTime,
        complexity,
        accessibility
      },
      suggestions
    };

    // 缓存预览
    this.cache.set(cacheKey, preview);

    return preview;
  }

  private async renderer.render(component: ComponentInfo, options: PreviewOptions): Promise<React.ReactNode> {
    // 动态导入并渲染组件
    const ComponentModule = await import(`@xorigo-ui/core/${component.name}`);
    const Component = ComponentModule.default || ComponentModule[component.name];

    // 生成合适的 props
    const props = this.generateDefaultProps(component, options);

    return (
      <div
        className={`component-preview ${options.size} ${options.theme}`}
        data-component={component.name}
      >
        <Component {...props} />
      </div>
    );
  }
}
```

### 3. 🤖 智能推荐系统 (IntelligentRecommendationEngine)

```typescript
// src/lib/workbench/recommendation/
interface IntelligentRecommendationEngine {
  // 推荐方法
  getRecommendations: (context: RecommendationContext) => Promise<RecommendationResult>;
  getPopularComponents: (limit?: number) => Promise<ComponentInfo[]>;
  getTrendingCombinations: (component: string) => Promise<ComponentCombination[]>;

  // 用户行为学习
  trackUserBehavior: (behavior: UserBehavior) => void;
  updateUserPreferences: (preferences: UserPreferences) => void;
}

interface RecommendationContext {
  currentComponent?: string;
  userIntent: 'browsing' | 'searching' | 'comparing' | 'learning';
  projectContext?: ProjectContext;
  recentSearches?: string[];
  userPreferences?: UserPreferences;
}

interface RecommendationResult {
  components: ComponentRecommendation[];
  combinations: ComponentCombination[];
  tutorials: TutorialRecommendation[];
  confidence: number;  // 推荐置信度 0-100
}

interface ComponentRecommendation {
  component: ComponentInfo;
  score: number;
  reason: RecommendationReason;
  context: string;  // 推荐上下文解释
}

type RecommendationReason =
  | 'frequently_used_together'
  | 'similar_functionality'
  | 'popular_in_similar_projects'
  | 'completes_pattern'
  | 'based_on_user_preferences'
  | 'trending_in_community';

class IntelligentRecommendationEngineImpl implements IntelligentRecommendationEngine {
  private behaviorAnalyzer: UserBehaviorAnalyzer;
  private patternAnalyzer: PatternAnalyzer;
  private popularityTracker: PopularityTracker;
  private collaborativeFilter: CollaborativeFilter;

  async getRecommendations(context: RecommendationContext): Promise<RecommendationResult> {
    const recommendations: ComponentRecommendation[] = [];

    // 1. 基于当前组件的推荐
    if (context.currentComponent) {
      const componentRecommendations = await this.getRelatedComponentRecommendations(
        context.currentComponent
      );
      recommendations.push(...componentRecommendations);
    }

    // 2. 基于用户行为的推荐
    const behaviorRecommendations = await this.getBehaviorBasedRecommendations(context);
    recommendations.push(...behaviorRecommendations);

    // 3. 基于项目上下文的推荐
    if (context.projectContext) {
      const projectRecommendations = await this.getProjectBasedRecommendations(
        context.projectContext
      );
      recommendations.push(...projectRecommendations);
    }

    // 4. 基于流行度的推荐
    const popularityRecommendations = await this.getPopularityBasedRecommendations();
    recommendations.push(...popularityRecommendations);

    // 5. 去重和排序
    const uniqueRecommendations = this.deduplicateRecommendations(recommendations);
    const sortedRecommendations = this.rankRecommendations(uniqueRecommendations);

    // 6. 获取组合推荐
    const combinations = await this.getTrendingCombinations(context.currentComponent);

    // 7. 获取教程推荐
    const tutorials = await this.getTutorialRecommendations(context);

    // 8. 计算整体置信度
    const confidence = this.calculateConfidence(sortedRecommendations, context);

    return {
      components: sortedRecommendations.slice(0, 10), // 限制推荐数量
      combinations: combinations.slice(0, 5),
      tutorials: tutorials.slice(0, 3),
      confidence
    };
  }

  private async getRelatedComponentRecommendations(componentName: string): Promise<ComponentRecommendation[]> {
    const component = this.getComponentByName(componentName);
    if (!component) return [];

    const recommendations: ComponentRecommendation[] = [];

    // 分析组件使用模式
    const usagePatterns = await this.patternAnalyzer.analyzeUsagePatterns(componentName);

    for (const pattern of usagePatterns) {
      for (const relatedComponent of pattern.relatedComponents) {
        const score = this.calculateRelationshipScore(componentName, relatedComponent, pattern);

        recommendations.push({
          component: this.getComponentByName(relatedComponent)!,
          score,
          reason: 'frequently_used_together',
          context: `常与 ${component.name} 一起使用，发现 ${pattern.frequency}% 的使用案例`
        });
      }
    }

    return recommendations;
  }
}
```

### 4. 📱 响应式布局系统 (ResponsiveLayoutSystem)

```typescript
// src/components/workbench/layout/
interface ResponsiveLayoutSystem {
  // 布局配置
  config: LayoutConfig;

  // 布局方法
  renderLayout: (components: ComponentInfo[], options: LayoutOptions) => React.ReactNode;
  calculateLayout: (containerSize: DOMRect, itemCount: number) => LayoutPlan;

  // 响应式处理
  handleResize: (size: WindowSize) => void;
  optimizeForDevice: (device: DeviceInfo) => LayoutOptions;
}

interface LayoutOptions {
  mode: 'mobile' | 'tablet' | 'desktop' | 'wide';
  density: 'compact' | 'normal' | 'spacious';
  showPreviews: boolean;
  allowInteraction: boolean;
  columns?: number;
  itemSize?: 'sm' | 'md' | 'lg';
}

interface LayoutPlan {
  type: 'masonry' | 'grid' | 'list' | 'carousel';
  columns: number;
  rows: number;
  itemSize: { width: number; height: number };
  gap: number;
  algorithm: LayoutAlgorithm;
}

class ResponsiveLayoutSystemImpl implements ResponsiveLayoutSystem {
  private currentLayout: LayoutPlan;
  private resizeObserver: ResizeObserver;
  private virtualizer: Virtualizer;

  renderLayout(components: ComponentInfo[], options: LayoutOptions): React.ReactNode {
    const layoutPlan = this.calculateLayout(this.getContainerSize(), components.length);

    switch (options.mode) {
      case 'mobile':
        return this.renderMobileLayout(components, layoutPlan, options);
      case 'tablet':
        return this.renderTabletLayout(components, layoutPlan, options);
      case 'desktop':
        return this.renderDesktopLayout(components, layoutPlan, options);
      case 'wide':
        return this.renderWideLayout(components, layoutPlan, options);
      default:
        return this.renderDesktopLayout(components, layoutPlan, options);
    }
  }

  private renderMobileLayout(
    components: ComponentInfo[],
    plan: LayoutPlan,
    options: LayoutOptions
  ): React.ReactNode {
    // 单列瀑布流布局
    return (
      <VirtualMasonryList
        items={components}
        columnCount={1}
        itemHeight={this.estimateItemHeight}
        renderItem={(component, index) => (
          <SmartComponentCard
            key={component.name}
            component={component}
            mode="compact"
            lazy={index > 3} // 前4个立即加载，其余懒加载
          />
        )}
        overscanBy={3}
      />
    );
  }

  private renderDesktopLayout(
    components: ComponentInfo[],
    plan: LayoutPlan,
    options: LayoutOptions
  ): React.ReactNode {
    // 自适应网格布局
    return (
      <VirtualGrid
        items={components}
        columns={plan.columns}
        renderItem={(component) => (
          <SmartComponentCard
            key={component.name}
            component={component}
            mode="normal"
            interactive={options.allowInteraction}
          />
        )}
        itemSize={plan.itemSize}
        gap={plan.gap}
      />
    );
  }

  private renderWideLayout(
    components: ComponentInfo[],
    plan: LayoutPlan,
    options: LayoutOptions
  ): React.ReactNode {
    // 分屏布局：左侧列表，右侧预览
    return (
      <div className="flex h-full">
        <div className="w-1/3 border-r border-border">
          <VirtualList
            items={components}
            renderItem={(component) => (
              <ComponentListItem
                key={component.name}
                component={component}
                onSelect={this.handleComponentSelect}
              />
            )}
            itemHeight={60}
          />
        </div>
        <div className="flex-1">
          <ComponentPreviewPanel
            selectedComponent={this.state.selectedComponent}
            mode="detailed"
          />
        </div>
      </div>
    );
  }
}
```

### 5. 🎯 智能组件卡片 (SmartComponentCard)

```typescript
// src/components/workbench/cards/
interface SmartComponentCardProps {
  component: ComponentInfo;
  mode: 'compact' | 'normal' | 'detailed' | 'comparison';
  interactive?: boolean;
  lazy?: boolean;
  suggestions?: ComponentSuggestion[];
  onPreview?: (component: ComponentInfo) => void;
  onEdit?: (component: ComponentInfo) => void;
  onCopy?: (component: ComponentInfo) => void;
}

const SmartComponentCard: React.FC<SmartComponentCardProps> = ({
  component,
  mode,
  interactive = true,
  lazy = false,
  suggestions,
  onPreview,
  onEdit,
  onCopy
}) => {
  const [preview, setPreview] = useState<ComponentPreview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 懒加载预览
  useEffect(() => {
    if (lazy || !interactive) return;

    const loadPreview = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const previewEngine = getIntelligentPreviewEngine();
        const generatedPreview = await previewEngine.generatePreview(component, {
          mode,
          theme: 'default',
          size: 'md',
          interactive: false,
          animated: true,
          showCode: false
        });

        setPreview(generatedPreview);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load preview');
      } finally {
        setIsLoading(false);
      }
    };

    loadPreview();
  }, [component, mode, lazy, interactive]);

  const handleClick = useCallback(() => {
    if (interactive && onPreview) {
      onPreview(component);
    }
  }, [interactive, onPreview, component]);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(component);
    }
  }, [onEdit, component]);

  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCopy) {
      onCopy(component);
    }
  }, [onCopy, component]);

  return (
    <Card
      className={cn(
        'component-card transition-all duration-200',
        interactive && 'cursor-pointer hover:shadow-lg hover:border-primary/30',
        isLoading && 'animate-pulse'
      )}
      onClick={handleClick}
      data-component={component.name}
      data-mode={mode}
    >
      {/* 卡片头部 */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary text-sm font-bold">
                {component.name.charAt(0)}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-sm">{component.name}</h4>
              <Badge variant="outline" className="text-xs mt-1">
                {component.category}
              </Badge>
            </div>
          </div>

          {/* 快速操作按钮 */}
          <div className="flex items-center space-x-1 opacity-0 hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="w-8 h-8 p-0"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="w-8 h-8 p-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* 卡片内容 */}
      <CardContent className="pt-0">
        {/* 描述 */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {component.description}
        </p>

        {/* 组件预览 */}
        {mode !== 'compact' && (
          <div className="mb-4 min-h-[80px] bg-muted/50 rounded-lg p-4 flex items-center justify-center">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">加载预览...</span>
              </div>
            ) : error ? (
              <div className="text-center text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4 mx-auto mb-1" />
                <span>预览加载失败</span>
              </div>
            ) : preview ? (
              <div className="w-full">
                {preview.rendered.live}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground">
                暂无预览
              </div>
            )}
          </div>
        )}

        {/* 属性标签 */}
        {component.props && component.props.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {component.props.slice(0, mode === 'detailed' ? 5 : 3).map((prop) => (
              <Badge key={prop} variant="secondary" className="text-xs">
                {prop}
              </Badge>
            ))}
            {component.props.length > (mode === 'detailed' ? 5 : 3) && (
              <Badge variant="secondary" className="text-xs">
                +{component.props.length - (mode === 'detailed' ? 5 : 3)}
              </Badge>
            )}
          </div>
        )}

        {/* 变体展示 */}
        {component.variants && component.variants.length > 0 && mode === 'detailed' && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {component.variants.map((variant) => (
                <Badge key={variant} variant="outline" className="text-xs">
                  {variant}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 智能建议 */}
        {suggestions && suggestions.length > 0 && mode === 'detailed' && (
          <div className="border-t pt-3">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">智能建议</span>
            </div>
            <div className="space-y-1">
              {suggestions.slice(0, 2).map((suggestion, index) => (
                <div key={index} className="text-xs text-muted-foreground">
                  • {suggestion.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 使用统计 */}
        {mode === 'detailed' && (
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-3 h-3" />
              <span>本周使用 {Math.floor(Math.random() * 50) + 10} 次</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>4.{Math.floor(Math.random() * 5) + 5}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

## 🔄 渐进式升级策略

### Phase 1: 基础智能功能 (Week 1-2)
1. **智能搜索引擎** - 基础语义搜索
2. **智能组件卡片** - 基础预览功能
3. **性能优化** - 懒加载和缓存

### Phase 2: 高级智能功能 (Week 3-4)
1. **推荐系统** - 基于用户行为的推荐
2. **上下文感知** - 项目相关的组件推荐
3. **响应式布局** - 完整的多设备支持

### Phase 3: 完整智能体验 (Week 5-6)
1. **AI增强搜索** - 自然语言搜索
2. **智能预览** - 多维度预览系统
3. **个性化体验** - 完整的用户偏好系统

## 🎯 技术实现要点

### 向后兼容性
- 保持现有 API 接口不变
- 渐进式启用新功能
- 优雅降级机制

### 性能考虑
- 虚拟化渲染大量组件
- 智能缓存策略
- 预测性加载

### 可扩展性
- 模块化架构设计
- 插件式扩展机制
- 配置驱动的功能开关

这个新架构将把现有的工作台升级为真正的智能组件浏览和开发平台，同时保持良好的开发体验和向后兼容性。