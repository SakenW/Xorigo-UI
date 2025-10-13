# @xorigo-ui/system

主题系统、配置管理、可访问性和弹层管理包。

## 功能

### 主题与配置
- **ThemeProvider** - 主题上下文管理 (亮/暗模式、高对比度)
- **ConfigProvider** - 配置上下文管理 (密度/圆角/字号)

### 可访问性
- **A11yProvider** - 可访问性管理
- **VisuallyHidden** - 屏幕阅读器可见元素
- **SkipNavLink** - 跳转链接
- **FocusTrap** - 焦点陷阱

### 弹层管理
- **ZLayerProvider** - Z-index 层级管理
- **Portal** - 弹层传送门

## 安装

```bash
npm install @xorigo-ui/system
```

## 使用

### 基础设置

```tsx
import { ThemeProvider, ConfigProvider, A11yProvider } from '@xorigo-ui/system';

function App() {
  return (
    <ThemeProvider mode="system" highContrast={false}>
      <ConfigProvider density="cozy" radius="soft" fontSize="md">
        <A11yProvider>
          {/* Your app */}
        </A11yProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
}
```

### 主题切换

```tsx
import { ThemeProvider, useTheme } from '@xorigo-ui/system';

function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
      切换主题
    </button>
  );
}
```

### 配置管理

```tsx
import { ConfigProvider, useConfig } from '@xorigo-ui/system';

function DensityControl() {
  const { density, setDensity } = useConfig();

  return (
    <select value={density} onChange={(e) => setDensity(e.target.value)}>
      <option value="compact">紧凑</option>
      <option value="cozy">舒适</option>
      <option value="spacious">宽松</option>
    </select>
  );
}
```

### 弹层管理

```tsx
import { Portal, ZLayerProvider } from '@xorigo-ui/system';

function Modal() {
  return (
    <Portal>
      <div className="modal">
        模态框内容
      </div>
    </Portal>
  );
}

function App() {
  return (
    <ZLayerProvider baseZIndex={1000}>
      <Modal />
    </ZLayerProvider>
  );
}
```

### 可访问性

```tsx
import { VisuallyHidden, SkipNavLink, FocusTrap } from '@xorigo-ui/system';

function AccessiblePage() {
  return (
    <>
      <SkipNavLink href="#main-content">跳转到主内容</SkipNavLink>

      <button>
        <VisuallyHidden>搜索</VisuallyHidden>
        <SearchIcon />
      </button>

      <FocusTrap>
        <div className="dialog">
          <h2>对话框标题</h2>
          <button>关闭</button>
        </div>
      </FocusTrap>
    </>
  );
}
```

## API 文档

### ThemeProvider

#### Props
- `mode?: 'light' | 'dark' | 'system'` - 主题模式
- `highContrast?: boolean` - 是否启用高对比度
- `children: ReactNode` - 子组件

#### 返回值
- `mode: 'light' | 'dark'` - 当前主题模式
- `setMode: (mode) => void` - 设置主题模式
- `highContrast: boolean` - 高对比度状态
- `toggleHighContrast: () => void` - 切换高对比度

### ConfigProvider

#### Props
- `density?: 'compact' | 'cozy' | 'spacious'` - 密度
- `radius?: 'sharp' | 'soft' | 'round'` - 圆角
- `fontSize?: 'sm' | 'md' | 'lg'` - 字号
- `children: ReactNode` - 子组件

#### 返回值
- `density: string` - 当前密度
- `setDensity: (density) => void` - 设置密度
- `radius: string` - 当前圆角
- `setRadius: (radius) => void` - 设置圆角
- `fontSize: string` - 当前字号
- `setFontSize: (fontSize) => void` - 设置字号

### A11yProvider

#### Props
- `children: ReactNode` - 子组件
- `announcePolite?: boolean` - 是否使用 polite 公告
- `reducedMotion?: boolean` - 是否减少动画

#### 返回值
- `announce: (message) => void` - 公告消息
- `reducedMotion: boolean` - 减少动画状态
- `toggleReducedMotion: () => void` - 切换减少动画

### ZLayerProvider

#### Props
- `baseZIndex?: number` - 基础 z-index (默认 1000)
- `children: ReactNode` - 子组件

#### 返回值
- `getZIndex: (layer) => number` - 获取层级 z-index
- `registerLayer: () => string` - 注册新层级
- `unregisterLayer: (id) => void` - 注销层级

## 依赖

- `@xorigo-ui/tokens` - 设计令牌系统
- `@xorigo-ui/style-recipe` - 样式配方系统

## 许可证

MIT
