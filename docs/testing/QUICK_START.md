# 🧪 Xorigo UI 测试快速入门指南

## 🚀 快速开始

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行覆盖率测试
pnpm --filter @xorigo-ui/core test:coverage

# 运行特定组件测试
pnpm --filter @xorigo-ui/core test textarea
```

---

## 📊 覆盖率要求

- **行覆盖率**: ≥ 90%
- **分支覆盖率**: ≥ 85%

---

## 📝 编写测试

参考现有的测试文件结构：
- `/packages/core/src/primitives/textarea.test.tsx`
- `/packages/core/src/primitives/tabs.test.tsx`
- `/packages/core/src/primitives/switch.test.tsx`

---

**更多详情**: [测试覆盖率提升报告](/TEST_COVERAGE_SUMMARY.md)
