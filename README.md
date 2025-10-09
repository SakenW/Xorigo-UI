# 🎨 TH-UI

Modern UI component library extracted from Trans-Hub

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)

## ✨ Features

- 🎨 **25+ Components** - 完整的UI组件库
- 🌈 **10 Theme Palettes** - 经典、现代、自然、优雅、活泼五大类
- ⚡ **Framer Motion** - 流畅的动画效果
- 🎯 **TypeScript** - 完整的类型定义
- 📱 **Responsive** - 移动优先的响应式设计
- ♿ **Accessible** - 遵循WCAG标准
- 🎪 **12+ Button Variants** - 丰富的按钮样式
- 🃏 **9+ Card Variants** - 多样的卡片风格

## 📦 Installation

```bash
npm install @th-ui/core
# or
yarn add @th-ui/core
# or
pnpm add @th-ui/core
```

## 🚀 Quick Start

```tsx
import { Button, Card, ThemeProvider } from '@th-ui/core'

function App() {
  return (
    <ThemeProvider>
      <Card variant="glass">
        <h1>Hello TH-UI</h1>
        <Button variant="primary" size="lg">
          Get Started
        </Button>
      </Card>
    </ThemeProvider>
  )
}
```

## 🎨 Theme System

TH-UI includes 10 carefully crafted theme palettes:

**Classic**: Light, Dark
**Modern**: Cyber Blue-Purple, Warm Sunrise
**Natural**: Forest, Deep Ocean
**Elegant**: Noble Purple, Minimal Black-White
**Vibrant**: Lemon, Rainbow

```tsx
import { useTheme } from '@th-ui/core'

function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <button onClick={() => setTheme('cyber-blue-purple')}>
      Switch Theme
    </button>
  )
}
```

## 📚 Components

### Core Components
- **Button** (12 variants)
- **Card** (9 variants)
- **Input** (5 variants)
- **Select**
- **Checkbox**

### Advanced Components
- MagneticButton
- RippleEffect
- AnimatedCard
- ThemeToggle
- ProgressRing
- And more...

### Navigation
- Header
- Sidebar
- Breadcrumb

### Feedback
- Alert
- Loading
- Notifications

### Data
- DataTable

### Layout
- CardLayout
- ContentLayout
- DashboardLayout
- ShellLayout

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build library
npm run build

# Run tests
npm test

# Lint
npm run lint

# Format
npm run format
```

## 📖 Documentation

Full documentation coming soon!

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

## 📄 License

MIT © TH-UI Team

## 🙏 Acknowledgments

Built with:
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Framer Motion 12](https://www.framer.com/motion/)
- [Vite](https://vitejs.dev/)

Inspired by Trans-Hub design system.

---

**Status**: 🚧 In Development - Phase 1 Complete (Project Initialization)

**Next Steps**: Design system migration, component migration
