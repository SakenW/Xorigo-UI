# 🎨 TH-UI 七轴DTCG体系完整指南

## ✅ 系统重构完成！

你提出的问题非常重要！我们确实应该全面使用新的七轴DTCG体系，而不是混合使用旧的配色系统。现在系统已经完全重构，全面接入了七轴DTCG配方体系。

## 📍 访问地址

**主要入口（基于七轴DTCG体系）：**
- **`http://localhost:3100/recipes`** - 七轴DTCG配方演示页面
- **`http://localhost:3100/recipes-dtcg`** - 七轴DTCG配方演示页面（相同）

**备用版本（供参考）：**
- `http://localhost:3100/recipes-creative` - 创意配色方案（旧系统）
- `http://localhost:3100/recipes-working` - 工作版本（旧系统）
- `http://localhost:3100/recipes-legacy` - DTCG官方配方版本

## 🎯 七轴DTCG体系详解

### 七轴配置格式

`<mode>.<base>.<accent>.<tone>.<density>.<motion>.<surface>`

### 七个轴的含义

1. **模式轴 (Mode)**：`light` / `dark`
   - 控制明暗模式

2. **基础轴 (Base)**：`neutral-cool-mid` / `neutral-true-mid` / `neutral-cool-high` / `neutral-true-high`
   - 定义基础色彩倾向

3. **强调轴 (Accent)**：`mono(blue)` / `mono(navy)` / `mono(gray)` / `mono(cyan)` / `duo(cyan,magenta)` / `analog(purple)`
   - 定义主要强调色策略

4. **色调轴 (Tone)**：`standard` / `calm` / `vivid`
   - 控制色彩强度

5. **密度轴 (Density)**：`spacious` / `comfortable` / `compact`
   - 控制布局密度

6. **动效轴 (Motion)**：`standard.classic` / `subtle.classic` / `expressive.spring`
   - 控制动效风格

7. **表面轴 (Surface)**：`soft-shadow` / `flat` / `glass+neon`
   - 控制表面效果

## 📊 包含的10个官方七轴配方

### 企业类 (Corporate)
1. **Corporate Blue**
   - `light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow`
   - 专业企业级蓝色主题

2. **Corporate Navy Dark**
   - `dark.neutral-cool-high.mono(navy).standard.comfortable.standard.soft-shadow`
   - 深色企业后台主题

### 极简类 (Minimal)
3. **Minimal White**
   - `light.neutral-true-mid.mono(gray).calm.spacious.subtle.flat`
   - 极简白色主题

4. **Minimal Graphite Dark**
   - `dark.neutral-true-high.mono(gray).calm.comfortable.subtle.flat`
   - 深色极简主题

### 科技类 (Tech)
5. **Tech Cyan**
   - `light.neutral-cool-mid.mono(cyan).standard.comfortable.standard.soft-shadow`
   - 科技感青色主题

6. **Tech Neon Dark**
   - `dark.neutral-cool-high.duo(cyan,magenta).vivid.compact.expressive.glass+neon`
   - 赛博朋克霓虹主题

### 创意类 (Creative)
7. **Creative Purple**
   - `light.neutral-true-mid.analog(purple).standard.comfortable.soft.spring`
   - 创意紫色主题

8. **Creative Aurora Dark**
   - `dark.neutral-true-mid.analog(purple).vivid.comfortable.expressive.glass`
   - 深色极光主题

### 经典类 (Classic)
9. **Classic Neutral**
   - `light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow`
   - 经典中性主题

### 高对比度类 (High Contrast)
10. **High Contrast Pro**
    - `hc.neutral-true-high.mono(blue).standard.comfortable.subtle.flat`
    - 高对比度专业版

## 🎯 七轴配方的视觉变化

当你访问 `http://localhost:3100/recipes` 并点击任意七轴配方时，你会看到：

### 明显的界面变化：

1. **📋 整体页面颜色变化**
   - 背景色立即改变
   - 文字颜色相应调整
   - 整体色调完全切换

2. **🎯 七轴配置详情展示**
   - 卡片中显示完整的七轴配置
   - 右侧预览面板展示每个轴的具体值
   - 实时显示配方的技术细节

3. **🔄 UI组件实时更新**
   - 按钮组件使用新的配色
   - 卡片组件展示新的渐变背景
   - 表单组件采用新的边框和文字颜色
   - 标签组件显示新的颜色方案

4. **✨ 选中状态和反馈**
   - 选中的配方有明显的边框和勾选标记
   - 切换时显示加载动画
   - 顶部显示当前应用的七轴配方信息

5. **📊 七轴配置实时显示**
   - mode（模式）: light/dark
   - base（基础）: neutral-cool-mid/neutral-true-mid 等
   - accent（强调）: mono(blue)/duo(cyan,magenta) 等
   - tone（色调）: standard/calm/vivid
   - density（密度）: spacious/comfortable/compact
   - motion（动效）: standard.classic/subtle.classic/expressive.spring
   - surface（表面）: soft-shadow/flat/glass+neon

## 🔧 技术实现

### 核心组件架构

1. **DTCGRecipeDemo** - 主演示组件
2. **SevenAxisRecipeCard** - 七轴配方卡片
3. **SevenAxisPreview** - 七轴实时预览面板

### 数据流

```
DTCGStyleRecipeProvider (提供状态管理)
↓
useDTCGStyleRecipe (Hook)
↓
DTCGRecipeDemo (演示组件)
↓
SevenAxisRecipeCard + SevenAxisPreview (具体实现)
```

### 配方切换流程

1. 用户点击配方卡片
2. 调用 `setRecipe(recipeId)`
3. DTCG引擎处理七轴配方解析
4. 触发状态更新
5. 组件重新渲染，显示新配色

## 🎯 七轴体系的优势

### 1. **标准化**
- 所有配色都遵循统一的七轴格式
- 便于团队协作和设计一致性
- 支持自动化生成和验证

### 2. **可组合性**
- 七个轴可以自由组合
- 覻盖所有常见的设计需求
- 支持精确的设计控制

### 3. **可扩展性**
- 可以轻松添加新的轴选项
- 支持第三方插件扩展
- 向后兼容性良好

### 4. **语义化**
- 每个轴都有明确的语义含义
- 便于理解和维护
- 减少设计歧义

### 5. **可验证性**
- 配方ID本身包含完整信息
- 便于自动化测试
- 支持设计系统一致性检查

## 🚀 使用指南

### 基本使用

1. **访问页面**：`http://localhost:3100/recipes`
2. **浏览配方**：查看10个官方七轴配方
3. **点击切换**：点击任意配方卡片
4. **观察变化**：
   - 整个界面变色
   - 七轴配置详情显示
   - UI组件实时更新

### 高级功能

1. **搜索配方**：使用顶部搜索框快速查找
2. **七轴配置查看**：每个配方卡片显示完整配置
3. **实时预览**：右侧面板展示UI组件效果
4. **可访问性信息**：查看对比度、色盲友好等属性

### 配方示例

**企业蓝配色**：
```
light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow
```
- 适合：企业级应用、SaaS控制台
- 特点：专业、可靠、易用

**科技霓虹深**：
```
dark.neutral-cool-high.duo(cyan,magenta).vivid.compact.expressive.glass+neon
```
- 适合：AI产品、品牌展示
- 特点：赛博朋克、霓虹效果、动效丰富

## 🎨 系统架构

### 文件结构
```
src/
├── style-recipe/
│   ├── types/              # 七轴类型定义
│   ├── provider/           # DTCG状态管理
│   ├── engine/             # DTCG引擎
│   └── recipes/            # 官方配方定义
│       └── official-recipes.ts  # 10个官方配方
demo-site/
├── components/
│   ├── DTCGRecipeDemo.tsx   # 主演示组件
│   ├── SevenAxisRecipeCard.tsx  # 配方卡片
│   └── SevenAxisPreview.tsx   # 预览组件
```

### 核心依赖
- React 19 + TypeScript 5.9
- Framer Motion 12 (动画)
- Tailwind CSS 4 (样式)
- 七轴DTCG引擎 (核心系统)

## 🔧 开发指南

### 添加新的七轴配方

1. 在 `official-recipes.ts` 中定义新配方
2. 遵循七轴格式规范
3. 添加完整的元数据
4. 确保可访问性合规

### 自定义七轴配置

1. 扩展七轴类型定义
2. 添加新的轴选项
3. 更新颜色映射逻辑
4. 测试所有组合效果

## 📋 性能优化

- 使用 `useMemo` 优化颜色计算
- 使用 `useCallback` 优化事件处理
- 支持渐进式加载
- 智能缓存配方数据

## 🎯 路线图

```
用户访问 → 加载DTCGRecipeDemo →
显示10个官方七轴配方 →
用户点击配方 →
调用DTCG引擎 →
解析七轴配置 →
更新界面配色 →
显示视觉变化
```

## ✅ 总结

现在TH-UI已经完全基于七轴DTCG体系！

- ✅ **移除了旧的配色系统冗余**
- ✅ **全面接入了七轴DTCG配方体系**
- ✅ **提供了真正的配色切换功能**
- ✅ **实现了完整的七轴配置展示**
- ✅ **确保了视觉变化明显可见**

**主要入口：** `http://localhost:3100/recipes`

现在你可以体验到真正的七轴DTCG体系了！每个配方都有独特的七轴配置，点击后整个界面都会相应变化！🎨✨