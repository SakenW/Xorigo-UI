# @xorigo-ui/registry

组件注册中心 - 管理 Xorigo UI 组件库的组件注册和查询。

## 功能特性

- **组件注册**: 提供组件注册机制
- **组件查询**: 支持组件信息查询
- **类型安全**: 完整的 TypeScript 类型支持

## 安装

```bash
npm install @xorigo-ui/registry
```

## 使用

```typescript
import { registry } from '@xorigo-ui/registry';

// 注册组件
registry.register('Button', ButtonComponent);

// 查询组件
const component = registry.get('Button');
```

## 许可证

MIT © Xorigo UI Team
