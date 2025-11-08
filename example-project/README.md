# Xorigo UI 示例项目

这是一个演示如何在外部项目中使用Xorigo UI组件库的示例。

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装项目依赖
npm install

# 或者使用 pnpm
pnpm install
```

### 2. 启动开发服务器

```bash
npm run dev
# 或者
pnpm dev
```

### 3. 访问应用

打开浏览器访问 `http://localhost:5173`

## 📁 项目结构

```
example-project/
├── src/
│   ├── App.tsx          # 主应用组件
│   └── main.tsx         # 应用入口
├── package.json         # 项目配置
├── tailwind.config.js   # Tailwind配置
├── tsconfig.json        # TypeScript配置
├── vite.config.ts       # Vite配置
└── README.md           # 项目说明
```

## 🎨 特性演示

- ✅ **主题系统**: 支持明暗主题切换
- ✅ **表单组件**: 完整的表单输入和验证
- ✅ **布局组件**: 响应式卡片布局
- ✅ **反馈组件**: Alert提示组件
- ✅ **按钮组件**: 多种样式和状态

## 📚 核心依赖

- **React 19**: 最新的React版本
- **@xorigo-ui/core**: Xorigo UI核心组件库
- **Tailwind CSS**: 原子化CSS框架
- **TypeScript**: 类型安全支持

## 🔗 相关链接

- [Xorigo UI 完整使用指南](../EXTERNAL_USAGE_GUIDE.md)
- [Xorigo UI 组件库文档](../docs/README.md)
- [Xorigo UI GitHub仓库](https://github.com/your-org/xorigo-ui)

## 🛠️ 开发说明

### 如何添加新的Xorigo UI组件

```tsx
// 1. 导入组件
import { NewComponent } from '@xorigo-ui/core'

// 2. 在应用中使用
<NewComponent
  prop1="value1"
  prop2={2}
  onEvent={(data) => console.log(data)}
/>
```

### 主题定制

```tsx
import { useTheme } from '@xorigo-ui/core'

const { theme, updateTheme } = useTheme()

// 应用自定义主题
updateTheme({
  mode: 'dark',
  hue: 220,
  saturation: 80
})
```

---

**注意**: 这个示例项目直接引用了本地的Xorigo UI包，确保您已经在本地构建了核心组件库。