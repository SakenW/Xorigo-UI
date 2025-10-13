/**
 * @fileoverview Playground Store 基本使用示例
 * 展示如何在 React 组件中使用各种功能
 */

import React, { useEffect } from 'react'
import {
  usePlaygroundStore,
  useCurrentComponent,
  useThemeState,
  useSnapshots,
  useCompareMode,
  useUIState,
  usePerformanceMetrics,
  useSearchAndFilter,
  useAutoSave,
  initializePlayground,
  cleanupPlayground,
} from '../index'

/**
 * 组件编辑器示例
 */
export function ComponentEditor() {
  const { id, props, loading, error, updateProp, resetProps, loadComponentAsync } = useCurrentComponent()

  const handlePropChange = (key: string, value: any) => {
    updateProp(key, value)
  }

  const handleLoadComponent = async (componentId: string) => {
    try {
      await loadComponentAsync(componentId)
    } catch (err) {
      console.error('加载组件失败:', err)
    }
  }

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error.message}</div>

  return (
    <div className="component-editor">
      <h3>组件编辑器 - {id}</h3>

      <div className="props-editor">
        <div className="prop-group">
          <label>文本内容:</label>
          <input
            type="text"
            value={props.text || ''}
            onChange={(e) => handlePropChange('text', e.target.value)}
          />
        </div>

        <div className="prop-group">
          <label>变体:</label>
          <select
            value={props.variant || 'primary'}
            onChange={(e) => handlePropChange('variant', e.target.value)}
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="outline">Outline</option>
          </select>
        </div>

        <div className="prop-group">
          <label>尺寸:</label>
          <select
            value={props.size || 'md'}
            onChange={(e) => handlePropChange('size', e.target.value)}
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>

        <div className="prop-group">
          <label>
            <input
              type="checkbox"
              checked={props.disabled || false}
              onChange={(e) => handlePropChange('disabled', e.target.checked)}
            />
            禁用状态
          </label>
        </div>
      </div>

      <div className="actions">
        <button onClick={resetProps}>重置属性</button>
        <button onClick={() => handleLoadComponent('Button')}>加载 Button 组件</button>
        <button onClick={() => handleLoadComponent('Card')}>加载 Card 组件</button>
      </div>
    </div>
  )
}

/**
 * 主题编辑器示例
 */
export function ThemeEditor() {
  const { themeState, updateTheme, applyRecipe } = useThemeState()

  const handleThemeChange = (key: keyof typeof themeState, value: any) => {
    updateTheme({ [key]: value })
  }

  const handleApplyRecipe = (recipeId: string) => {
    applyRecipe(recipeId, {
      primaryColor: '#3b82f6',
      secondaryColor: '#6b7280',
    })
  }

  return (
    <div className="theme-editor">
      <h3>主题编辑器</h3>

      <div className="theme-controls">
        <div className="control-group">
          <label>模式:</label>
          <select
            value={themeState.mode}
            onChange={(e) => handleThemeChange('mode', e.target.value)}
          >
            <option value="light">浅色</option>
            <option value="dark">深色</option>
          </select>
        </div>

        <div className="control-group">
          <label>密度:</label>
          <select
            value={themeState.density}
            onChange={(e) => handleThemeChange('density', e.target.value)}
          >
            <option value="compact">紧凑</option>
            <option value="comfortable">舒适</option>
            <option value="spacious">宽松</option>
          </select>
        </div>

        <div className="control-group">
          <label>色调:</label>
          <input
            type="color"
            value={themeState.hue === 'blue' ? '#3b82f6' : '#6b7280'}
            onChange={(e) => handleThemeChange('hue', e.target.value === '#3b82f6' ? 'blue' : 'gray')}
          />
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={themeState.rtl}
              onChange={(e) => handleThemeChange('rtl', e.target.checked)}
            />
            RTL 布局
          </label>
        </div>
      </div>

      <div className="recipe-controls">
        <h4>主题配方</h4>
        <button onClick={() => handleApplyRecipe('modern-blue')}>现代蓝</button>
        <button onClick={() => handleApplyRecipe('elegant-purple')}>优雅紫</button>
        <button onClick={() => handleApplyRecipe('nature-green')}>自然绿</button>
      </div>

      <div className="theme-preview">
        <h4>主题预览</h4>
        <div className={`theme-${themeState.mode} density-${themeState.density}`}>
          <button className="btn-primary">主要按钮</button>
          <button className="btn-secondary">次要按钮</button>
          <input placeholder="输入框示例" />
        </div>
      </div>
    </div>
  )
}

/**
 * 快照管理器示例
 */
export function SnapshotManager() {
  const {
    snapshots,
    loading,
    filteredSnapshots,
    createSnapshot,
    restoreSnapshot,
    deleteSnapshot,
    duplicateSnapshot,
    exportSnapshots,
    importSnapshots,
  } = useSnapshots()

  const { searchQuery, setSearchQuery, filterTags, setFilterTags } = useSearchAndFilter()

  const handleCreateSnapshot = async () => {
    const name = prompt('请输入快照名称:')
    if (name) {
      const description = prompt('请输入描述 (可选):')
      await createSnapshot(name, description || undefined)
    }
  }

  const handleRestoreSnapshot = async (id: string) => {
    if (confirm('确定要恢复这个快照吗？当前的更改将会丢失。')) {
      await restoreSnapshot(id)
    }
  }

  const handleDeleteSnapshot = async (id: string) => {
    if (confirm('确定要删除这个快照吗？')) {
      await deleteSnapshot(id)
    }
  }

  const handleDuplicateSnapshot = async (id: string, name: string) => {
    const newName = prompt('请输入新快照名称:', `${name} (副本)`)
    if (newName) {
      await duplicateSnapshot(id, newName)
    }
  }

  const handleExport = () => {
    const data = exportSnapshots()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `playground-snapshots-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const data = e.target?.result as string
        await importSnapshots(data)
      }
      reader.readAsText(file)
    }
  }

  if (loading) return <div>加载快照中...</div>

  return (
    <div className="snapshot-manager">
      <h3>快照管理</h3>

      <div className="snapshot-controls">
        <div className="search-filter">
          <input
            type="text"
            placeholder="搜索快照..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="filter-tags">
            {['button', 'card', 'form', 'layout'].map(tag => (
              <label key={tag}>
                <input
                  type="checkbox"
                  checked={filterTags.includes(tag)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilterTags([...filterTags, tag])
                    } else {
                      setFilterTags(filterTags.filter(t => t !== tag))
                    }
                  }}
                />
                {tag}
              </label>
            ))}
          </div>
        </div>

        <div className="actions">
          <button onClick={handleCreateSnapshot}>创建快照</button>
          <button onClick={handleExport}>导出快照</button>
          <label className="import-btn">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
            导入快照
          </label>
        </div>
      </div>

      <div className="snapshots-list">
        {filteredSnapshots.length === 0 ? (
          <p>没有找到快照</p>
        ) : (
          filteredSnapshots.map(snapshot => (
            <div key={snapshot.id} className="snapshot-item">
              <div className="snapshot-info">
                <h4>{snapshot.name}</h4>
                {snapshot.description && <p>{snapshot.description}</p>}
                <div className="snapshot-meta">
                  <span>{new Date(snapshot.timestamp).toLocaleString()}</span>
                  {snapshot.tags && (
                    <div className="tags">
                      {snapshot.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="snapshot-actions">
                <button onClick={() => handleRestoreSnapshot(snapshot.id)}>
                  恢复
                </button>
                <button onClick={() => handleDuplicateSnapshot(snapshot.id, snapshot.name)}>
                  复制
                </button>
                <button
                  onClick={() => handleDeleteSnapshot(snapshot.id)}
                  className="danger"
                >
                  删除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/**
 * 对比模式示例
 */
export function CompareMode() {
  const {
    compareMode,
    snapshotA,
    snapshotB,
    setCompareMode,
    setCompareSnapshots,
    swapCompareSnapshots,
  } = useCompareMode()

  const { snapshots } = usePlaygroundStore()
  const { getDiff } = useSnapshotDiff()

  const handleStartCompare = () => {
    if (snapshots.length >= 2) {
      setCompareSnapshots(snapshots[0].id, snapshots[1].id)
      setCompareMode(true)
    }
  }

  const diff = getDiff()

  return (
    <div className="compare-mode">
      <h3>对比模式</h3>

      {!compareMode ? (
        <div className="compare-setup">
          <p>选择两个快照进行对比</p>
          <button
            onClick={handleStartCompare}
            disabled={snapshots.length < 2}
          >
            开始对比
          </button>
        </div>
      ) : (
        <div className="compare-view">
          <div className="compare-header">
            <h4>对比快照</h4>
            <div className="compare-info">
              <span>快照 A: {snapshots.find(s => s.id === snapshotA)?.name}</span>
              <span>快照 B: {snapshots.find(s => s.id === snapshotB)?.name}</span>
            </div>
            <div className="compare-actions">
              <button onClick={swapCompareSnapshots}>交换位置</button>
              <button onClick={() => setCompareMode(false)}>退出对比</button>
            </div>
          </div>

          {diff && (
            <div className="compare-results">
              <div className="diff-section">
                <h5>组件属性差异</h5>
                {Object.keys(diff.componentDiff).length === 0 ? (
                  <p>无差异</p>
                ) : (
                  <div className="diff-list">
                    {Object.entries(diff.componentDiff).map(([key, change]) => (
                      <div key={key} className="diff-item">
                        <strong>{key}:</strong>
                        <span className="old-value">{JSON.stringify(change.old)}</span>
                        <span>→</span>
                        <span className="new-value">{JSON.stringify(change.new)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="diff-section">
                <h5>主题差异</h5>
                {Object.keys(diff.themeDiff).length === 0 ? (
                  <p>无差异</p>
                ) : (
                  <div className="diff-list">
                    {Object.entries(diff.themeDiff).map(([key, change]) => (
                      <div key={key} className="diff-item">
                        <strong>{key}:</strong>
                        <span className="old-value">{JSON.stringify(change.old)}</span>
                        <span>→</span>
                        <span className="new-value">{JSON.stringify(change.new)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * 性能监控面板示例
 */
export function PerformancePanel() {
  const { metrics, updateMetrics, startTracking, stopTracking } = usePerformanceMetrics()

  const [isTracking, setIsTracking] = React.useState(false)

  const toggleTracking = () => {
    if (isTracking) {
      stopTracking()
    } else {
      startTracking()
    }
    setIsTracking(!isTracking)
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="performance-panel">
      <h3>性能监控</h3>

      <div className="performance-controls">
        <button
          onClick={toggleTracking}
          className={isTracking ? 'stop' : 'start'}
        >
          {isTracking ? '停止监控' : '开始监控'}
        </button>
      </div>

      <div className="performance-metrics">
        <div className="metric">
          <label>渲染时间:</label>
          <span>{metrics.renderTime.toFixed(2)} ms</span>
        </div>

        <div className="metric">
          <label>更新次数:</label>
          <span>{metrics.updateCount}</span>
        </div>

        <div className="metric">
          <label>内存使用:</label>
          <span>{formatBytes(metrics.memoryUsage || 0)}</span>
        </div>

        <div className="metric">
          <label>最后更新:</label>
          <span>{new Date(metrics.lastUpdate).toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="performance-chart">
        <h4>性能趋势</h4>
        {/* 这里可以集成图表库显示性能趋势 */}
        <div className="chart-placeholder">
          性能趋势图表 (可集成 recharts 或其他图表库)
        </div>
      </div>
    </div>
  )
}

/**
 * 自动保存设置示例
 */
export function AutoSaveSettings() {
  const { enabled, interval, lastAutoSave, setAutoSave, triggerAutoSave } = useAutoSave()

  const handleToggleAutoSave = () => {
    setAutoSave(!enabled)
  }

  const handleIntervalChange = (newInterval: number) => {
    setAutoSave(enabled, newInterval)
  }

  const handleManualSave = async () => {
    await triggerAutoSave()
    alert('手动保存完成!')
  }

  return (
    <div className="auto-save-settings">
      <h3>自动保存设置</h3>

      <div className="setting-group">
        <label>
          <input
            type="checkbox"
            checked={enabled}
            onChange={handleToggleAutoSave}
          />
          启用自动保存
        </label>
      </div>

      <div className="setting-group">
        <label>保存间隔:</label>
        <select
          value={interval}
          onChange={(e) => handleIntervalChange(Number(e.target.value))}
          disabled={!enabled}
        >
          <option value={10000}>10 秒</option>
          <option value={30000}>30 秒</option>
          <option value={60000}>1 分钟</option>
          <option value={300000}>5 分钟</option>
        </select>
      </div>

      <div className="setting-group">
        <label>上次保存:</label>
        <span>
          {lastAutoSave
            ? new Date(lastAutoSave).toLocaleString()
            : '从未保存'}
        </span>
      </div>

      <div className="manual-actions">
        <button onClick={handleManualSave}>立即保存</button>
      </div>
    </div>
  )
}

/**
 * 主应用组件示例
 */
export function PlaygroundApp() {
  const { showPropsEditor, showTokenInspector, showPerformancePanel, togglePropsEditor, toggleTokenInspector, togglePerformancePanel } = useUIState()

  // 初始化 Playground
  useEffect(() => {
    const init = async () => {
      const result = await initializePlayground({
        autoSave: true,
        autoSaveInterval: 30000,
        performanceTracking: true,
        restoreFromStorage: true,
      })

      if (!result.success) {
        console.error('Playground 初始化失败:', result.error)
      }
    }

    init()

    // 清理函数
    return () => {
      cleanupPlayground()
    }
  }, [])

  return (
    <div className="playground-app">
      <header className="playground-header">
        <h1>Xorigo UI Playground</h1>
        <div className="header-actions">
          <button
            className={showPropsEditor ? 'active' : ''}
            onClick={togglePropsEditor}
          >
            属性编辑器
          </button>
          <button
            className={showTokenInspector ? 'active' : ''}
            onClick={toggleTokenInspector}
          >
            令牌检查器
          </button>
          <button
            className={showPerformancePanel ? 'active' : ''}
            onClick={togglePerformancePanel}
          >
            性能面板
          </button>
        </div>
      </header>

      <main className="playground-main">
        <div className="playground-content">
          <div className="editor-panel">
            {showPropsEditor && <ComponentEditor />}
            {showTokenInspector && <ThemeEditor />}
          </div>

          <div className="snapshot-panel">
            <SnapshotManager />
          </div>

          <div className="compare-panel">
            <CompareMode />
          </div>

          {showPerformancePanel && (
            <div className="performance-panel-wrapper">
              <PerformancePanel />
            </div>
          )}

          <div className="settings-panel">
            <AutoSaveSettings />
          </div>
        </div>
      </main>
    </div>
  )
}