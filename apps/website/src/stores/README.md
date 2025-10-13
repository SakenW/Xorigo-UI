# Playground Store 状态管理系统

这是一个为 Xorigo UI Playground 设计的完整状态管理系统，基于 Zustand 构建，支持 Live Props 模式、Snapshot 模式和 Compare 模式。

## 🚀 核心功能

### 📊 三种操作模式

- **Live Props 模式**: 实时编辑组件属性，支持历史记录和撤销/重做
- **Snapshot 模式**: 创建和管理快照，支持快照的导入导出
- **Compare 模式**: 对比两个快照的差异，支持双栏对比显示

### 🔧 核心特性

- ✅ **TypeScript 类型安全**: 完整的类型定义和类型推导
- ✅ **数据持久化**: 支持多种数据适配器，默认使用 localStorage
- ✅ **错误边界集成**: 完整的错误报告和用户操作跟踪
- ✅ **性能监控**: 实时性能指标收集和分析
- ✅ **自动保存**: 可配置的自动保存机制
- ✅ **搜索筛选**: 支持按名称、描述、标签搜索快照
- ✅ **数据导入导出**: 支持快照和配置的批量导入导出

## 📦 安装和基本使用

### 基本用法

```typescript
import { usePlaygroundStore, useCurrentComponent } from '@/stores'

// 使用组件状态
function ComponentEditor() {
  const { id, props, updateProp } = useCurrentComponent()

  return (
    <input
      value={props.text || ''}
      onChange={(e) => updateProp('text', e.target.value)}
    />
  )
}

// 使用快照管理
function SnapshotManager() {
  const { snapshots, createSnapshot, restoreSnapshot } = usePlaygroundStore(
    state => ({
      snapshots: state.snapshots,
      createSnapshot: state.createSnapshot,
      restoreSnapshot: state.restoreSnapshot,
    })
  )

  return (
    <div>
      <button onClick={() => createSnapshot('新快照')}>
        创建快照
      </button>
      {snapshots.map(snapshot => (
        <button
          key={snapshot.id}
          onClick={() => restoreSnapshot(snapshot.id)}
        >
          {snapshot.name}
        </button>
      ))}
    </div>
  )
}
```

### 初始化系统

```typescript
import { initializePlayground } from '@/stores'

// 在应用启动时初始化
async function initApp() {
  const result = await initializePlayground({
    autoSave: true,
    autoSaveInterval: 30000,
    performanceTracking: true,
    restoreFromStorage: true,
  })

  if (result.success) {
    console.log('Playground 初始化成功')
  } else {
    console.error('Playground 初始化失败:', result.error)
  }
}
```

## 🔌 可用的 Hooks

### 状态管理 Hooks

- `usePlaygroundMode()` - 获取当前模式
- `useCurrentComponent()` - 当前组件状态和操作
- `useThemeState()` - 主题状态和操作
- `useHistory()` - 历史记录和撤销重做
- `useSnapshots()` - 快照管理
- `useCompareMode()` - 对比模式
- `useUIState()` - UI 面板状态
- `usePerformanceMetrics()` - 性能指标
- `useSearchAndFilter()` - 搜索和筛选
- `useAutoSave()` - 自动保存设置
- `usePlaygroundActions()` - 常用操作集合

### 工具 Hooks

- `useSnapshotDiff()` - 获取快照差异对比
- `useDataAdapter()` - 数据适配器操作

## 🗄️ 数据适配器系统

### 使用默认适配器

```typescript
import { localStorageAdapter } from '@/stores'

// 在初始化时使用
await initializePlayground({
  dataAdapter: localStorageAdapter,
})
```

### 自定义适配器

```typescript
import { DataAdapter, ComponentState, Snapshot, ThemeState } from '@/stores'

class CustomAdapter implements DataAdapter {
  async loadComponent(id: string): Promise<ComponentState | null> {
    // 实现组件加载逻辑
  }

  async saveComponent(state: ComponentState): Promise<void> {
    // 实现组件保存逻辑
  }

  async loadSnapshots(): Promise<Snapshot[]> {
    // 实现快照加载逻辑
  }

  async saveSnapshot(snapshot: Snapshot): Promise<void> {
    // 实现快照保存逻辑
  }

  async deleteSnapshot(id: string): Promise<void> {
    // 实现快照删除逻辑
  }

  async loadTheme(): Promise<ThemeState | null> {
    // 实现主题加载逻辑
  }

  async saveTheme(theme: ThemeState): Promise<void> {
    // 实现主题保存逻辑
  }
}
```

## 🛡️ 错误边界集成

```typescript
import { PlaygroundErrorBoundary } from '@/stores'

const errorBoundary = new PlaygroundErrorBoundary()

// 设置到 Store
usePlaygroundStore.getState().setErrorBoundary(errorBoundary)

// 监听错误
errorBoundary.onError((error, context) => {
  console.error('Playground 错误:', error, context)
})

// 获取错误报告
const errorReport = errorBoundary.generateErrorReport()
```

## 📈 性能监控

```typescript
// 启动性能监控
const { startTracking, stopTracking } = usePerformanceMetrics()

startTracking()

// 获取性能指标
const { metrics } = usePerformanceMetrics()
console.log('渲染时间:', metrics.renderTime)
console.log('内存使用:', metrics.memoryUsage)
console.log('更新次数:', metrics.updateCount)

// 停止监控
stopTracking()
```

## 🔍 搜索和筛选

```typescript
const { searchQuery, setSearchQuery, filterTags, setFilterTags, getFilteredSnapshots } = useSearchAndFilter()

// 设置搜索词
setSearchQuery('button')

// 设置筛选标签
setFilterTags(['primary', 'interactive'])

// 获取筛选结果
const filteredSnapshots = getFilteredSnapshots()
```

## 💾 数据导入导出

```typescript
import { exportPlaygroundData, importPlaygroundData } from '@/stores'

// 导出数据
const exportData = await exportPlaygroundData()
const blob = new Blob([exportData], { type: 'application/json' })
const url = URL.createObjectURL(blob)

// 导入数据
const importData = JSON.parse(await file.text())
const success = await importPlaygroundData(importData)
```

## 🧪 状态健康检查

```typescript
const { validateState, repairState } = usePlaygroundActions()

// 验证状态
const validation = validateState()
if (!validation.isValid) {
  console.error('状态问题:', validation.errors)
}

// 修复状态
await repairState()
```

## 🔧 高级配置

### Store 配置选项

```typescript
interface PlaygroundInitOptions {
  autoSave?: boolean           // 是否启用自动保存
  autoSaveInterval?: number    // 自动保存间隔 (毫秒)
  performanceTracking?: boolean // 是否启用性能监控
  restoreFromStorage?: boolean  // 是否从存储中恢复数据
  dataAdapter?: DataAdapter    // 自定义数据适配器
  errorBoundary?: ErrorBoundaryContext // 自定义错误边界
}
```

### 持久化配置

Store 使用 Zustand 的 persist 中间件，默认持久化以下数据：

- 快照数据
- 主题设置
- UI 面板状态
- 自动保存配置

可以通过 `partialize` 函数自定义持久化策略。

## 📝 最佳实践

### 1. 组件中使用

```typescript
// ✅ 推荐：使用选择器 hooks
const { updateProp } = useCurrentComponent()

// ✅ 推荐：批量更新状态
const batchUpdate = () => {
  updateProp('variant', 'primary')
  updateProp('size', 'lg')
}

// ❌ 避免：直接访问 Store
const store = usePlaygroundStore.getState()
store.updateProp('variant', 'primary') // 不会触发重新渲染
```

### 2. 异步操作

```typescript
// ✅ 推荐：使用异步方法
await createSnapshot('新快照')
await restoreSnapshot(snapshotId)

// ✅ 推荐：处理错误
try {
  await loadComponentAsync('Button')
} catch (error) {
  console.error('加载组件失败:', error)
}
```

### 3. 性能优化

```typescript
// ✅ 推荐：使用 shallow 比较避免不必要的重渲染
const component = usePlaygroundStore(
  state => ({
    id: state.currentComponentId,
    props: state.currentProps,
  }),
  shallow
)
```

## 🧪 测试

```typescript
import { renderHook, act } from '@testing-library/react'
import { usePlaygroundStore } from '@/stores'

// 测试 Store 操作
test('应该正确更新组件属性', () => {
  const { result } = renderHook(() => usePlaygroundStore.getState())

  act(() => {
    result.current.setCurrentComponent('Button', { variant: 'primary' })
    result.current.updateProp('size', 'lg')
  })

  expect(result.current.currentProps).toEqual({
    variant: 'primary',
    size: 'lg'
  })
})
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个状态管理系统！

## 📄 许可证

MIT License