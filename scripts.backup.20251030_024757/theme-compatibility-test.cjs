#!/usr/bin/env node

/**
 * Xorigo UI 主题兼容性测试工具
 * 验证组件在不同主题配方下的兼容性
 */

const fs = require('fs');
const path = require('path');

// 主题配方配置
const themeRecipes = [
  'corporate-blue',
  'corporate-blue-dark',
  'tech-cyan',
  'tech-cyan-neon'
];

// 需要测试的组件类别
const componentCategories = [
  'primitives',
  'data-display',
  'layout',
  'navigation',
  'feedback',
  'motion',
  'examples'
];

// 硬编码颜色检查规则
const hardcodedColorPatterns = [
  /bg-(blue|red|green|yellow|orange|purple|pink|indigo|cyan|gray|slate)-\d+/g,
  /text-(blue|red|green|yellow|orange|purple|pink|indigo|cyan|gray|slate)-\d+/g,
  /border-(blue|red|green|yellow|orange|purple|pink|indigo|cyan|gray|slate)-\d+/g,
  /ring-(blue|red|green|yellow|orange|purple|pink|indigo|cyan|gray|slate)-\d+/g,
  /#[0-9a-fA-F]{6}/g, // hex colors
  /rgb\([^)]+\)/g, // rgb colors
  /rgba\([^)]+\)/g, // rgba colors
];

// 主题令牌使用检查规则
const themeTokenPatterns = [
  /bg-(primary|secondary|accent|success|error|warning|info|background|surface|text|border)-\d+/g,
  /text-(primary|secondary|accent|success|error|warning|info|background|surface|text|border)-\d+/g,
  /border-(primary|secondary|accent|success|error|warning|info|background|surface|text|border)-\d+/g,
  /ring-(primary|secondary|accent|success|error|warning|info|background|surface|text|border)-\d+/g,
  /bg-(on-primary|on-secondary|on-accent|on-success|on-error|on-warning|on-info)/g,
  /text-(on-primary|on-secondary|on-accent|on-success|on-error|on-warning|on-info)/g,
];

// 递归获取所有文件
function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    return fileList;
  }

  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// 检查单个文件的兼容性
function checkFileCompatibility(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(process.cwd(), filePath);

    const result = {
      filePath: relativePath,
      category: getCategoryFromPath(relativePath),
      hardcodedColors: [],
      themeTokens: [],
      hasThemeLogic: false,
      score: 0,
      issues: []
    };

    // 检查硬编码颜色
    hardcodedColorPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        result.hardcodedColors.push(...matches);
      }
    });

    // 检查主题令牌使用
    themeTokenPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        result.themeTokens.push(...matches);
      }
    });

    // 检查是否有主题逻辑
    const themeLogicPatterns = [
      /useTheme\s*\(/,
      /ThemeProvider/,
      /themeAxis/,
      /themeRecipe/,
      /motionTheme/
    ];

    result.hasThemeLogic = themeLogicPatterns.some(pattern =>
      content.match(pattern)
    );

    // 计算兼容性评分
    result.score = calculateCompatibilityScore(result);

    // 生成问题列表
    if (result.hardcodedColors.length > 0) {
      result.issues.push(`发现 ${result.hardcodedColors.length} 个硬编码颜色`);
    }
    if (!result.hasThemeLogic) {
      result.issues.push('缺少主题逻辑集成');
    }
    if (result.themeTokens.length === 0) {
      result.issues.push('未使用主题令牌');
    }

    return result;
  } catch (error) {
    return {
      filePath: path.relative(process.cwd(), filePath),
      error: error.message,
      score: 0
    };
  }
}

// 计算兼容性评分
function calculateCompatibilityScore(result) {
  let score = 0;

  // 基础分：没有硬编码颜色
  if (result.hardcodedColors.length === 0) {
    score += 40;
  } else {
    // 根据硬编码颜色数量扣分
    score -= result.hardcodedColors.length * 5;
  }

  // 使用主题令牌加分
  if (result.themeTokens.length > 0) {
    score += 30;
  }

  // 有主题逻辑加分
  if (result.hasThemeLogic) {
    score += 30;
  }

  return Math.max(0, Math.min(100, score));
}

// 从文件路径获取组件类别
function getCategoryFromPath(filePath) {
  if (filePath.includes('/primitives/')) return 'primitives';
  if (filePath.includes('/data-display/')) return 'data-display';
  if (filePath.includes('/layout/')) return 'layout';
  if (filePath.includes('/navigation/')) return 'navigation';
  if (filePath.includes('/feedback/')) return 'feedback';
  if (filePath.includes('/overlays/')) return 'overlays';
  if (filePath.includes('/loading/')) return 'loading';
  if (filePath.includes('/motion/')) return 'motion';
  if (filePath.includes('/examples/')) return 'examples';
  return 'other';
}

// 主函数
function main() {
  console.log('🧪 Xorigo UI 主题兼容性测试');
  console.log('==============================\n');

  const results = [];
  const allFiles = [];

  // 收集所有文件
  componentCategories.forEach(category => {
    const dir = `packages/core/src/${category}`;
    const files = getAllFiles(dir);
    allFiles.push(...files);
  });

  console.log(`📁 发现 ${allFiles.length} 个文件需要测试\n`);

  // 测试所有文件
  allFiles.forEach(file => {
    const result = checkFileCompatibility(file);
    results.push(result);

    if (result.error) {
      console.log(`❌ ${result.filePath}: ${result.error}`);
    } else {
      const status = result.score >= 80 ? '✅' : result.score >= 60 ? '⚠️' : '❌';
      console.log(`${status} ${result.filePath}: ${result.score}分`);

      if (result.issues.length > 0) {
        result.issues.forEach(issue => {
          console.log(`   - ${issue}`);
        });
      }
    }
  });

  // 生成报告
  const report = generateReport(results);

  console.log('\n📊 测试结果汇总:');
  console.log('==================');
  console.log(`总文件数: ${report.summary.totalFiles}`);
  console.log(`优秀 (80-100分): ${report.summary.excellent} (${((report.summary.excellent / report.summary.totalFiles) * 100).toFixed(1)}%)`);
  console.log(`良好 (60-79分): ${report.summary.good} (${((report.summary.good / report.summary.totalFiles) * 100).toFixed(1)}%)`);
  console.log(`较差 (0-59分): ${report.summary.poor} (${((report.summary.poor / report.summary.totalFiles) * 100).toFixed(1)}%)`);
  console.log(`平均分数: ${report.summary.averageScore.toFixed(1)}分`);
  console.log(`硬编码颜色总数: ${report.summary.totalHardcodedColors}`);
  console.log(`主题令牌使用总数: ${report.summary.totalThemeTokens}`);

  // 按类别统计
  console.log('\n📋 按类别统计:');
  console.log('================');
  Object.entries(report.categoryStats).forEach(([category, stats]) => {
    console.log(`${category}:`);
    console.log(`  文件数: ${stats.count}`);
    console.log(`  平均分: ${stats.averageScore.toFixed(1)}`);
    console.log(`  硬编码颜色: ${stats.totalHardcodedColors}`);
    console.log(`  主题令牌: ${stats.totalThemeTokens}`);
    console.log('');
  });

  // 生成建议
  console.log('💡 改进建议:');
  console.log('=============');
  if (report.summary.totalHardcodedColors > 0) {
    console.log('🔧 仍有硬编码颜色需要处理:');
    console.log('   - 运行主题转换脚本进行批量替换');
    console.log('   - 手动处理特殊的颜色值');
    console.log('   - 扩展颜色映射表');
  }

  const lowScoreFiles = results.filter(r => r.score < 60 && !r.error);
  if (lowScoreFiles.length > 0) {
    console.log('🔧 低分文件需要优化:');
    lowScoreFiles.forEach(file => {
      console.log(`   - ${file.filePath} (${file.score}分)`);
    });
  }

  console.log('\n🎉 主题兼容性测试完成!');

  // 保存详细报告
  const reportContent = generateDetailedReport(report);
  const reportPath = 'docs/reports/theme-compatibility-test-results.md';

  try {
    fs.writeFileSync(reportPath, reportContent, 'utf8');
    console.log(`📄 详细报告已保存: ${reportPath}`);
  } catch (error) {
    console.warn('⚠️ 无法保存报告文件:', error.message);
  }
}

// 生成测试报告
function generateReport(results) {
  const validResults = results.filter(r => !r.error);

  const summary = {
    totalFiles: validResults.length,
    excellent: validResults.filter(r => r.score >= 80).length,
    good: validResults.filter(r => r.score >= 60 && r.score < 80).length,
    poor: validResults.filter(r => r.score < 60).length,
    averageScore: validResults.reduce((sum, r) => sum + r.score, 0) / validResults.length,
    totalHardcodedColors: validResults.reduce((sum, r) => sum + (r.hardcodedColors?.length || 0), 0),
    totalThemeTokens: validResults.reduce((sum, r) => sum + (r.themeTokens?.length || 0), 0)
  };

  // 按类别统计
  const categoryStats = {};
  validResults.forEach(result => {
    const category = result.category;
    if (!categoryStats[category]) {
      categoryStats[category] = {
        count: 0,
        totalScore: 0,
        totalHardcodedColors: 0,
        totalThemeTokens: 0
      };
    }

    categoryStats[category].count++;
    categoryStats[category].totalScore += result.score;
    categoryStats[category].totalHardcodedColors += result.hardcodedColors?.length || 0;
    categoryStats[category].totalThemeTokens += result.themeTokens?.length || 0;
  });

  // 计算平均值
  Object.keys(categoryStats).forEach(category => {
    const stats = categoryStats[category];
    stats.averageScore = stats.totalScore / stats.count;
  });

  return {
    summary,
    categoryStats,
    details: results
  };
}

// 生成详细报告内容
function generateDetailedReport(report) {
  const now = new Date().toLocaleString('zh-CN');

  return `# 🧪 Xorigo UI 主题兼容性测试报告

## 📋 测试概述

**测试时间**: ${now}
**测试工具**: Xorigo UI Theme Compatibility Tester v1.0
**测试范围**: 所有核心组件的主题兼容性

## 📊 测试结果汇总

| 指标 | 数值 | 百分比 |
|------|------|--------|
| 总文件数 | ${report.summary.totalFiles} | 100% |
| 优秀 (80-100分) | ${report.summary.excellent} | ${((report.summary.excellent / report.summary.totalFiles) * 100).toFixed(1)}% |
| 良好 (60-79分) | ${report.summary.good} | ${((report.summary.good / report.summary.totalFiles) * 100).toFixed(1)}% |
| 较差 (0-59分) | ${report.summary.poor} | ${((report.summary.poor / report.summary.totalFiles) * 100).toFixed(1)}% |
| 平均分数 | ${report.summary.averageScore.toFixed(1)}分 | - |
| 硬编码颜色总数 | ${report.summary.totalHardcodedColors} | - |
| 主题令牌使用总数 | ${report.summary.totalThemeTokens} | - |

## 📁 按类别统计

${Object.entries(report.categoryStats).map(([category, stats]) => `
### ${category.charAt(0).toUpperCase() + category.slice(1)}

- **文件数**: ${stats.count}
- **平均分数**: ${stats.averageScore.toFixed(1)}分
- **硬编码颜色**: ${stats.totalHardcodedColors}
- **主题令牌**: ${stats.totalThemeTokens}
`).join('')}

## 📋 详细测试结果

${report.details.map(result => {
  if (result.error) {
    return `
### ❌ ${result.filePath}

**错误**: ${result.error}
`;
  }

  const status = result.score >= 80 ? '✅ 优秀' : result.score >= 60 ? '⚠️ 良好' : '❌ 需要改进';

  return `
### ${status} ${result.filePath}

**兼容性评分**: ${result.score}分
**组件类别**: ${result.category}
**硬编码颜色**: ${result.hardcodedColors.length}个
**主题令牌使用**: ${result.themeTokens.length}个
**主题逻辑集成**: ${result.hasThemeLogic ? '✅ 是' : '❌ 否'}

${result.issues.length > 0 ? `
**问题列表**:
${result.issues.map(issue => `- ${issue}`).join('\n')}
` : ''}

${result.hardcodedColors.length > 0 ? `
**硬编码颜色详情**:
\`\`\`
${[...new Set(result.hardcodedColors)].join(', ')}
\`\`\`
` : ''}

${result.themeTokens.length > 0 ? `
**使用的主题令牌**:
\`\`\`
${[...new Set(result.themeTokens)].join(', ')}
\`\`\`
` : ''}
`;
}).join('')}

## 💡 改进建议

### 立即处理 (高优先级)
${report.summary.totalHardcodedColors > 0 ? `
1. **处理剩余的硬编码颜色**
   - 运行主题转换脚本: \`node scripts/simple-theme-converter.cjs\`
   - 扩展颜色映射表以覆盖更多颜色变体
   - 手动处理特殊的颜色值和自定义颜色
` : ''}

${report.details.filter(r => r.score < 60 && !r.error).length > 0 ? `
2. **优化低分组件**
   - 重点优化评分低于60分的组件
   - 确保所有组件都使用主题令牌
   - 集成主题逻辑到组件中
` : ''}

### 中期优化 (中等优先级)
3. **完善主题集成**
   - 为所有组件添加深色模式支持
   - 实现状态样式的主题响应
   - 优化可访问性主题适配

4. **建立测试机制**
   - 建立自动化主题兼容性测试
   - 集成到 CI/CD 流程中
   - 定期运行兼容性检查

### 长期维护 (低优先级)
5. **质量保证**
   - 建立主题使用最佳实践文档
   - 创建主题开发指南
   - 定期审查和更新主题系统

## 📈 成功指标

### 当前状态
- **兼容性通过率**: ${((report.summary.excellent + report.summary.good) / report.summary.totalFiles * 100).toFixed(1)}%
- **硬编码颜色**: ${report.summary.totalHardcodedColors}个
- **主题令牌使用**: ${report.summary.totalThemeTokens}个

### 目标状态 (Phase 1)
- **兼容性通过率**: 90%+
- **硬编码颜色**: 0个
- **主题令牌使用**: 全面覆盖

---

**报告生成时间**: ${now}
**测试工具版本**: v1.0
**下次测试**: 修复完成后重新运行
`;
}

if (require.main === module) {
  main();
}