# Showcase 展示组件

这个目录包含用于展示 Xorigo UI 组件库特性的演示组件。

## Component3DCarousel

一个精美的3D轮播组件，用于展示UI组件库中的各个组件。

### 特性

- 🎨 **3D透视效果** - 流畅的3D旋转和透视动画
- 🔄 **自动轮播** - 每4秒自动切换到下一个组件
- 🖱️ **交互控制** - 支持手动点击卡片和导航按钮
- ⏸️ **悬停暂停** - 鼠标悬停时暂停自动轮播
- 📱 **响应式设计** - 适配不同屏幕尺寸
- ✨ **视觉效果** - 优雅的光影效果和状态指示

### 使用方法

```tsx
import { Component3DCarousel } from '@xorigo-ui/core'

function App() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-900">
      <Component3DCarousel />
    </div>
  )
}
```

### 组件结构

组件展示以下6个核心组件：

1. **Button** - 灵活的按钮组件
2. **Card** - 优雅的卡片容器
3. **Input** - 强大的表单输入
4. **Modal** - 流畅的弹窗组件
5. **Table** - 智能数据表格
6. **Form** - 完整的表单方案

### 自定义配置

当前组件使用固定的配置，但你可以通过修改 `components` 数组来自定义展示的组件：

```tsx
const components = [
  {
    name: '自定义组件',
    icon: <CustomIcon />,
    color: 'from-blue-500 to-purple-500',
    desc: '组件描述'
  },
  // ... 更多组件
]
```

### 技术实现

- **React 19** - 现代React特性
- **Framer Motion** - 流畅动画效果
- **Lucide React** - 精美图标库
- **Tailwind CSS** - 响应式样式

### 性能优化

- 使用 `useCallback` 优化事件处理函数
- 合理的 `useEffect` 依赖管理
- 优化的动画配置和性能设置

### 可访问性

- 支持键盘导航
- 清晰的视觉状态指示
- 语义化的HTML结构

## 文件结构

```
showcase/
├── Component3DCarousel.tsx          # 主组件文件
├── Component3DCarousel.test.tsx     # 测试文件
├── Component3DCarousel.example.tsx  # 使用示例
├── index.ts                         # 导出文件
└── README.md                        # 说明文档
```