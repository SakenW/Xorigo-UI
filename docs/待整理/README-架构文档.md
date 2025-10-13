# Xorigo UI 架构文档快速导航

**最后更新**: 2025-10-13
**文档版本**: v1.0.0

---

## 🚀 快速开始

### 新人必读 (2小时)
```bash
1. 00-架构文档总索引.md           # 10分钟 - 了解文档体系
2. Website重构架构文档总览.md      # 10分钟 - Website全貌
3. Website重构快速开始指南.md      # 30分钟 - 环境配置+实战
4. Website架构数据流和交互图.md    # 20分钟 - 可视化学习
5. Website重构最佳实践和规则.md    # 30分钟 - 开发规范
6. Website重构实施清单.md          # 10分钟 - 任务定位
```

### 核心开发者必读 (2.5小时)
```bash
1. Website重构架构文档总览.md      # 10分钟
2. Website重构快速开始指南.md      # 30分钟
3. Website重构最佳实践和规则.md    # 30分钟
4. Website重构架构设计方案.md      # 60分钟 (选读负责模块)
5. Website架构数据流和交互图.md    # 20分钟
6. Website重构实施清单.md          # 10分钟
```

### 架构师必读 (4.5小时)
```bash
1. Xorigo UI 架构白皮书.md                # 30分钟
2. Xorigo UI Website 架构白皮书.md        # 60分钟
3. Website重构架构文档总览.md             # 10分钟
4. Website重构架构设计方案.md             # 90分钟
5. Website架构数据流和交互图.md           # 30分钟
6. Website重构实施清单.md                 # 20分钟
7. Website重构最佳实践和规则.md           # 30分钟
```

---

## 📚 文档分类

### 🎯 核心架构白皮书
- `Xorigo UI 架构白皮书.md` (82KB) - 整体项目架构
- `Xorigo UI Website 架构白皮书.md` (148KB) - Website七轴架构

### 🔧 Website 重构设计 (7篇核心文档)
- `Website重构架构设计方案.md` (57KB) - **最重要** 四层架构完整设计
- `Website重构实施清单.md` (26KB) - 16周执行清单
- `Website架构数据流和交互图.md` (26KB) - Mermaid可视化图表
- `Website重构最佳实践和规则.md` (27KB) - 20条开发规则
- `Website重构快速开始指南.md` (20KB) - 新人实战教程
- `Website重构架构总览.md` (18KB) - 架构概览
- `Website重构架构文档总览.md` (13KB) - 文档导航

### 📊 执行清单和验收
- `架构重构执行清单.md` (15KB) - 整体重构清单
- `Website-Packages 联动架构验收清单.md` (16KB) - 联动验收标准
- `Website白皮书DX增强层完善报告.md` (5.4KB) - DX工具设计

### 🚀 Agent 设计和总结
- `架构重构-Agent设计方案.md` (24KB) - AI辅助设计
- `架构重构-执行总结.md` (9.3KB) - 经验总结

### 🗂️ 导航索引
- `00-架构文档总索引.md` (18KB) - **本文档** 完整索引
- `README-架构文档.md` - 快速导航

---

## 🎯 按需求场景查找

| 场景 | 推荐文档 | 阅读时间 |
|------|---------|---------|
| 了解整体架构 | Xorigo UI 架构白皮书 | 30分钟 |
| 了解七轴系统 | Xorigo UI Website 架构白皮书 | 60分钟 |
| 开始重构开发 | Website重构快速开始指南 | 30分钟 |
| 理解数据流 | Website架构数据流和交互图 | 20分钟 |
| 学习开发规范 | Website重构最佳实践和规则 | 30分钟 |
| 制定迁移计划 | Website重构实施清单 | 20分钟 |
| 深入架构设计 | Website重构架构设计方案 | 90分钟 |
| 配置CI/CD | Website-Packages 联动验收清单 | 20分钟 |
| 参考经验教训 | 架构重构-执行总结 | 15分钟 |

---

## 🔑 核心架构原则

### 1. 数据只读原则
```typescript
// ✅ 正确 - 使用 readonly adapter (RSC)
import { readonlyRegistry } from '@/data/registry.readonly'

// ✅ 正确 - 使用 SDK (Client)
import { registryClient } from '@/lib/sdk/registry-client'

// ❌ 错误 - 直接导入
import { registry } from '@xorigo-ui/registry'
```

### 2. RSC/Client 严格分离
- **RSC Pages**: `/docs/*`, `/adoption/*`, `/tokens/*`, `/themes/*`
- **Client Pages**: `/playground/*`

### 3. 四层架构
```
Packages (只读源)
    ↓
Data Layer (适配层)
    ↓
SDK Layer (协议层)
    ↓
App Layer (展示层)
```

### 4. 性能预算
- 站点整体: ≤ 120KB (gzip)
- Playground: ≤ 150KB (gzip)
- LCP: ≤ 2.5s
- 筛选响应: ≤ 50ms

---

## 📊 重构进度跟踪

### Phase 1-8 时间线 (16周)
- **Phase 1-2**: Week 1-4 - 数据层重构 + Schema验证
- **Phase 3**: Week 5-6 - Playground双模式
- **Phase 4**: Week 7-8 - 页面层RSC/Client分离
- **Phase 5**: Week 9-10 - 主题系统重构
- **Phase 6**: Week 11-12 - DX增强层
- **Phase 7**: Week 13-14 - 性能优化
- **Phase 8**: Week 15-16 - 联调验收

详细进度查看: `Website重构实施清单.md`

---

## 🛠️ 常用命令

### 开发环境
```bash
# 启动开发服务器
cd apps/website && npm run dev

# 运行 Build-time 验证
npm run validate:readonly

# ESLint 检查
npm run lint

# 类型检查
npm run type-check
```

### 文档查阅
```bash
# 查看总索引
cat docs/待整理/00-架构文档总索引.md

# 快速开始
cat docs/待整理/Website重构快速开始指南.md

# 查看实施清单
cat docs/待整理/Website重构实施清单.md
```

---

## 📞 支持渠道

- **GitHub Issues**: 文档问题反馈
- **内部 Slack**: #xorigo-architecture-docs
- **架构团队**: 架构决策咨询

---

## 🎓 学习资源

### 官方文档
- [Next.js 15 App Router](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Zustand State Management](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS 4](https://tailwindcss.com/docs)

### 设计系统
- [Design Tokens Community Group (DTCG)](https://design-tokens.github.io/community-group/)
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)

---

**维护者**: Xorigo UI Core Team
**最后更新**: 2025-10-13
**文档状态**: ✅ 完整且最新
