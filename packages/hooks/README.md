# @xorigo-ui/hooks

通用 React Hooks 集合，用于状态管理、键盘导航、弹层管理等。

## Hooks

- `useControllableState` - 受控/非受控状态管理
- `useKeyboardNavigation` - 键盘导航处理
- `useOverlay` - 弹层生命周期管理
- `useFocusReturn` - 焦点返回管理
- `useDebouncedValue` - 防抖值
- `useVirtualList` - 虚拟列表

## 安装

```bash
npm install @xorigo-ui/hooks
```

## 使用

```tsx
import { useKeyboardNavigation } from '@xorigo-ui/hooks';

function MyComponent() {
  const { onKeyDown } = useKeyboardNavigation({
    onEnter: () => console.log('Enter pressed'),
    onEscape: () => console.log('Escape pressed')
  });

  return <div onKeyDown={onKeyDown}>Content</div>;
}
```
