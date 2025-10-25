# Xorigo UI 完整开发工作流 Agent

专门为 Xorigo UI 组件库设计的完整开发工作流智能协调 Agent，能够自动化管理从代码质量分析到文档生成的整个开发流程。

## 🚀 快速开始

### 1. 验证技能
```bash
python scripts/validate_skill.py .
```

### 2. 执行完整工作流
```bash
# 对单个组件执行
python scripts/workflow_executor.py --component=Button

# 对多个组件执行
python scripts/workflow_executor.py --components="Button,Input,Card"

# 对整个组件目录执行
python scripts/workflow_executor.py --scope="packages/core/src/components"
```

### 3. 执行特定阶段
```bash
# 仅分析阶段
python scripts/workflow_executor.py --phase=analyze --component=Button

# 仅重构阶段
python scripts/workflow_executor.py --phase=refactor --component=Button

# 仅测试阶段
python scripts/workflow_executor.py --phase=test --component=Button

# 仅文档阶段
python scripts/workflow_executor.py --phase=document --component=Button
```

## 📁 技能结构

```
xorigo-ui-workflow-agent/
├── SKILL.md                  # 主技能文件
├── README.md                 # 使用说明
├── workflow-config.json      # 工作流配置
└── scripts/                  # 执行脚本
    ├── workflow_executor.py  # 工作流执行器
    └── validate_skill.py     # 技能验证器
```

## 🔄 工作流程

### 阶段 1: 分析与评估 🔍
- **技术债务基线分析**: 使用 `tech-debt` 插件
- **AI 代码质量审查**: 使用 `ai-review` 插件
- **输出**: 分析报告和质量评估

### 阶段 2: 重构与优化 🔧
- **代码重构执行**: 使用 `refactor-clean` 插件
- **上下文完整性检查**: 使用 `context-restore` 插件
- **输出**: 重构后的代码和改进建议

### 阶段 3: 测试与验证 🧪
- **单元测试自动生成**: 使用 `test-generate` 插件
- **集成测试协调**: 协调多个测试场景
- **输出**: 完整的测试套件

### 阶段 4: 文档与交付 📚
- **API 文档生成**: 使用 `doc-generate` 插件
- **开发指南更新**: 更新相关开发文档
- **输出**: 完整的文档集

## ⚙️ 配置选项

### 质量门禁设置
```json
"qualityGates": {
  "testCoverage": 90,        // 测试覆盖率阈值
  "complexityThreshold": 10, // 复杂度阈值
  "duplicationThreshold": 3, // 重复代码阈值
  "maintainabilityIndex": 70 // 可维护性指数
}
```

### 阶段配置
```json
"phases": {
  "analysis": {
    "enabled": true,          // 是否启用
    "tools": ["tech-debt"],   // 使用的工具
    "priority": 1,            // 执行优先级
    "timeout": 300            // 超时时间（秒）
  }
}
```

## 📊 输出产物

### 分析报告
- 技术债务评估报告
- 代码质量评分卡
- 性能影响分析
- 安全风险评估

### 重构建议
- 具体重构计划
- 代码改进建议
- 架构优化方案

### 测试套件
- 完整的单元测试文件
- 集成测试场景
- 可访问性测试

### 文档集
- API 参考文档
- 使用指南
- 最佳实践文档

## 🔗 集成特性

### 与现有工具链集成
- **无缝集成**: 与 Xorigo UI 技能生态系统完全兼容
- **工具协调**: 智能调用相关的专业技能和插件
- **状态同步**: 与项目状态保持同步

### CI/CD 集成支持
- **流水线就绪**: 可直接集成到 CI/CD 流水线中
- **自动化触发**: 支持基于代码变更的自动触发
- **报告生成**: 生成机器可读的执行报告

## 🛠️ 故障排除

### 常见问题
1. **插件依赖**: 确保所有相关插件已正确安装
2. **权限问题**: 确保有足够的文件读写权限
3. **环境配置**: 确保开发环境配置正确

### 调试模式
```bash
# 详细日志
python scripts/workflow_executor.py --verbose --component=Button

# 干运行模式
python scripts/workflow_executor.py --dry-run --component=Button
```

## 📝 使用示例

### 典型工作流
```bash
# 1. 验证技能
python scripts/validate_skill.py .

# 2. 执行完整工作流
python scripts/workflow_executor.py --component=Button --config=workflow-config.json

# 3. 查看报告
ls reports/
ls docs/generated/
ls workflow-artifacts/
```

### 批量处理
```bash
# 对核心组件批量执行
python scripts/workflow_executor.py --components="Button,Input,Card,Modal"

# 使用自定义配置
python scripts/workflow_executor.py --scope="packages/core/src/components" --config=custom-config.json
```

## 🎯 最佳实践

1. **渐进式应用**: 先在单个组件上试用，确认效果后再扩展
2. **定期执行**: 每个迭代周期执行一次完整工作流
3. **配置调优**: 根据项目特点调整质量门禁和工具配置
4. **团队协作**: 鼓励团队成员参与工作流配置和优化

## 📄 许可证

MIT License

---

通过这个智能工作流 Agent，Xorigo UI 团队可以显著提升开发效率，确保代码质量，并维护项目的技术健康度。