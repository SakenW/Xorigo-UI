# 🎨 七轴主题系统访问指南

## 🚀 快速访问方式

### 方式一：在现有项目中集成

```bash
# 1. 确保你在项目根目录
cd /home/saken/project/Xorigo-UI

# 2. 启动开发环境 (Docker 热更新)
npm run docker:dev

# 3. 访问地址
http://localhost:3100
```

### 方式二：直接使用演示组件

```typescript
import {
  StyleRecipeProvider,
  ThemeSystemDemo,
  ThemeSystemApp
} from '@xorigo-ui/style-recipe'

// 方式A：使用完整演示 (推荐)
function App() {
  return (
    <StyleRecipeProvider>
      <ThemeSystemDemo />
    </StyleRecipeProvider>
  )
}

// 方式B：使用应用级示例
function App() {
  return (
    <StyleRecipeProvider>
      <ThemeSystemApp />
    </StyleRecipeProvider>
  )
}

// 方式C：仅使用主题切换器
function App() {
  return (
    <StyleRecipeProvider>
      <ThemeSwitcher />
      {/* 你的其他组件 */}
    </StyleRecipeProvider>
  )
}
```

---

## 🎯 访问路径说明

### 1. 演示页面位置

**文件位置**：
```
/home/saken/project/Xorigo-UI/packages/style-recipe/src/components/ThemeSystemDemo.tsx
```

**功能**：
- 🎨 完整的三层架构演示
- ⚡ 实时主题切换预览
- 🎛️ 七轴参数调节
- 🛡️ 智能约束验证

### 2. 应用级示例

**文件位置**：
```
/home/saken/project/Xorigo-UI/packages/style-recipe/src/examples/ThemeSystemIntegration.tsx
```

**功能**：
- 📊 仪表板场景演示
- 📝 编辑器场景演示
- 🔄 自动主题切换
- 💾 用户偏好保存

### 3. 七轴编辑器

**文件位置**：
```
/home/saken/project/Xorigo-UI/packages/style-recipe/src/components/SevenAxisEditor.tsx
```

**功能**：
- 🎛️ 完整的七轴控制
- ✅ 实时参数验证
- 🎨 颜色选择器
- 📱 响应式界面

---

## 🌐 访问 URL 结构

### 开发环境访问

```bash
# 主页 (如果已集成到网站)
http://localhost:3100/

# 主题演示页面 (需要路由配置)
http://localhost:3100/theme-demo

# 配方展示页面
http://localhost:3100/recipes
```

### 路由配置示例

```typescript
// app/router.tsx (如果有)
import { ThemeSystemDemo, ThemeSystemApp } from '@xorigo-ui/style-recipe'

export const routes = [
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/theme-demo',
    element: (
      <StyleRecipeProvider>
        <ThemeSystemDemo />
      </StyleRecipeProvider>
    )
  },
  {
    path: '/theme-app',
    element: <ThemeSystemApp />
  },
  {
    path: '/recipes',
    element: <RecipesPage />
  }
]
```

---

## 💻 本地开发访问

### 1. 启动开发服务器

```bash
# 方式A：使用 Docker (推荐)
npm run docker:dev

# 方式B：直接启动 (如果配置允许)
npm run dev
```

### 2. 访问开发地址

```bash
# Docker 开发环境
http://localhost:3100

# 本地开发服务器
http://localhost:3000 (如果启用)
```

### 3. 热更新支持

- ✅ 修改代码自动重新编译
- ✅ 浏览器自动刷新
- ✅ 保持状态不丢失

---

## 📱 组件使用指南

### 1. 基础使用

```typescript
import {
  StyleRecipeProvider,
  useDynamicTheme,
  useThemeSystem
} from '@xorigo-ui/style-recipe'

function MyComponent() {
  const dynamicTheme = useDynamicTheme({ autoApply: true })
  const themeSystem = useThemeSystem()

  return (
    <div>
      <h1>当前主题: {dynamicTheme.currentRecipe?.name}</h1>
      <button onClick={() => themeSystem.applyPreset('corporate-blue')}>
        应用企业蓝调
      </button>
    </div>
  )
}
```

### 2. 高级配置

```typescript
import {
  AppThemeProvider,
  useAppTheme
} from '@xorigo-ui/style-recipe'

function App() {
  return (
    <AppThemeProvider>
      <Header />
      <Main />
      <Footer />
    </AppThemeProvider>
  )
}

function ThemeToggle() {
  const { currentTheme, switchTheme } = useAppTheme()

  return (
    <button onClick={() => switchTheme('professional-light', 'quick')}>
      切换到专业亮色
    </button>
  )
}
```

---

## 🔧 故障排除

### 1. 无法访问页面

**检查清单**：
- [ ] Docker 容器是否运行：`docker ps`
- [ ] 端口是否正确：`http://localhost:3100`
- [ ] 防火墙是否阻止：检查端口 3100

**解决方案**：
```bash
# 重启 Docker 服务
npm run docker:stop
npm run docker:dev

# 检查端口占用
lsof -i :3100

# 清理并重建
npm run docker:stop
docker system prune -f
npm run docker:dev
```

### 2. 组件导入错误

**常见错误**：
```
Module not found: Can't resolve '@xorigo-ui/style-recipe'
```

**解决方案**：
```bash
# 重新安装依赖
npm install

# 重新构建项目
npm run build

# 检查 package.json 依赖
cat package.json | grep style-recipe
```

### 3. 主题不生效

**检查清单**：
- [ ] 是否使用 `StyleRecipeProvider` 包装
- [ ] 组件是否在 Provider 内部
- [ ] 是否正确调用 `autoApply` 或手动应用

**解决方案**：
```typescript
// 确保正确的组件层级
<StyleRecipeProvider>
  <AppThemeProvider>
    <YourApp />  {/* 你的组件必须在这里 */}
  </AppThemeProvider>
</StyleRecipeProvider>
```

---

## 🎨 快速体验代码片段

### 立即可用的最小示例

```typescript
import React from 'react'
import {
  StyleRecipeProvider,
  ThemeSystemDemo
} from '/home/saken/project/Xorigo-UI/packages/style-recipe/src/index'

export default function QuickDemo() {
  return (
    <StyleRecipeProvider>
      <div style={{ padding: '20px', minHeight: '100vh' }}>
        <ThemeSystemDemo />
      </div>
    </StyleRecipeProvider>
  )
}
```

### 仅主题切换器

```typescript
import React from 'react'
import {
  StyleRecipeProvider,
  ThemeSwitcher
} from '/home/saken/project/Xorigo-UI/packages/style-recipe/src/index'

export default function MinimalDemo() {
  return (
    <StyleRecipeProvider>
      <div style={{ padding: '20px' }}>
        <h1>我的应用</h1>
        <ThemeSwitcher />
        <p>这里是你应用的内容...</p>
      </div>
    </StyleRecipeProvider>
  )
}
```

---

## 📚 更多资源

### 文档位置
- 📖 [设计哲学](./SEVEN-AXIS-PHILOSOPHY.md)
- 🔧 [API 文档](./docs/API.md)
- 🎨 [组件库](./ui/README.md)

### 示例代码
- 💼 [企业应用示例](./examples/corporate-app.tsx)
- 🎨 [创意设计应用](./examples/creative-app.tsx)
- 📱 [移动端适配](./examples/mobile-app.tsx)

### 获取帮助
- 🐛 [问题反馈](https://github.com/xorigo-ui/issues)
- 💬 [讨论区](https://github.com/xorigo-ui/discussions)
- 📧 [邮件支持](support@xorigo-ui.com)

---

## 🎯 下一步

1. **体验演示**：访问 `http://localhost:3100` 查看完整演示
2. **阅读文档**：了解设计哲学和最佳实践
3. **集成项目**：按照示例集成到你的项目
4. **自定义主题**：使用七轴编辑器创建专属主题
5. **分享反馈**：告诉我们你的使用体验

**开始探索七轴主题系统的无限可能！** 🚀