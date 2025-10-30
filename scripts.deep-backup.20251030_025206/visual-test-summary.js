#!/usr/bin/env node

/**
 * 视觉回归测试摘要生成器
 * 从Playwright测试结果生成详细的HTML和Markdown报告
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  reportDir: './playwright-report',
  screenshotDir: './tests/visual/screenshots',
  outputDir: './visual-reports',
  baselineDir: './tests/visual/screenshots/baseline',
  actualDir: './tests/visual/screenshots/actual',
  diffDir: './tests/visual/screenshots/diff'
};

// 颜色定义
const COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  gray: '#6b7280'
};

// HTML模板
const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xorigo UI 视觉回归测试报告</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .screenshot-comparison {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin: 1rem 0;
        }
        .screenshot-item {
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            overflow: hidden;
        }
        .screenshot-item img {
            width: 100%;
            height: auto;
            display: block;
        }
        .screenshot-label {
            padding: 0.5rem;
            background: #f9fafb;
            font-weight: 500;
            font-size: 0.875rem;
        }
        .theme-badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: 500;
        }
        .status-success { background-color: ${COLORS.success}; color: white; }
        .status-failed { background-color: ${COLORS.error}; color: white; }
        .status-skipped { background-color: ${COLORS.warning}; color: white; }
    </style>
</head>
<body class="bg-gray-50">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
        <!-- 头部 -->
        <header class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Xorigo UI 视觉回归测试报告</h1>
            <div class="text-gray-600">
                <p>生成时间: {{TIMESTAMP}}</p>
                <p>分支: {{BRANCH}} | 提交: {{COMMIT}}</p>
            </div>
        </header>

        <!-- 概览 -->
        <section class="mb-8">
            <h2 class="text-xl font-semibold mb-4">测试概览</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-white p-4 rounded-lg shadow">
                    <div class="text-2xl font-bold" style="color: ${COLORS.primary}">{{TOTAL_TESTS}}</div>
                    <div class="text-gray-600">总测试数</div>
                </div>
                <div class="bg-white p-4 rounded-lg shadow">
                    <div class="text-2xl font-bold" style="color: ${COLORS.success}">{{PASSED_TESTS}}</div>
                    <div class="text-gray-600">通过</div>
                </div>
                <div class="bg-white p-4 rounded-lg shadow">
                    <div class="text-2xl font-bold" style="color: ${COLORS.error}">{{FAILED_TESTS}}</div>
                    <div class="text-gray-600">失败</div>
                </div>
                <div class="bg-white p-4 rounded-lg shadow">
                    <div class="text-2xl font-bold" style="color: ${COLORS.warning}">{{SKIPPED_TESTS}}</div>
                    <div class="text-gray-600">跳过</div>
                </div>
            </div>
        </section>

        <!-- 失败的测试 -->
        {{FAILED_TESTS_SECTION}}

        <!-- 按组件分组的测试结果 -->
        {{COMPONENT_RESULTS}}

        <!-- 主题测试结果 -->
        {{THEME_RESULTS}}

        <!-- 建议 -->
        <section class="mt-8">
            <h2 class="text-xl font-semibold mb-4">建议和下一步</h2>
            <div class="bg-white p-6 rounded-lg shadow">
                <ul class="list-disc pl-6 space-y-2">
                    {{RECOMMENDATIONS}}
                </ul>
            </div>
        </section>
    </div>
</body>
</html>
`;

/**
 * 解析Playwright JSON报告
 */
function parsePlaywrightReport(reportPath) {
  try {
    const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    return reportData;
  } catch (error) {
    console.error('无法解析Playwright报告:', error.message);
    return null;
  }
}

/**
 * 分析测试结果
 */
function analyzeTestResults(reportData) {
  if (!reportData) return null;

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    suites: [],
    failedTests: [],
    componentResults: {},
    themeResults: {}
  };

  reportData.suites.forEach(suite => {
    const suiteResult = {
      title: suite.title,
      file: suite.file,
      specs: []
    };

    suite.specs.forEach(spec => {
      const specResult = {
        title: spec.title,
        tests: []
      };

      spec.tests.forEach(test => {
        const testResult = {
          title: test.title,
          status: test.results[0].status,
          duration: test.results[0].duration
        };

        results.total++;
        results[testResult.status]++;

        if (testResult.status === 'failed') {
          results.failedTests.push({
            suite: suite.title,
            spec: spec.title,
            test: test.title,
            error: test.results[0].error?.message || '未知错误'
          });
        }

        // 按组件分组
        const componentMatch = test.title.match(/(\w+)\s+(组件|Component)/);
        if (componentMatch) {
          const component = componentMatch[1];
          if (!results.componentResults[component]) {
            results.componentResults[component] = { passed: 0, failed: 0, total: 0 };
          }
          results.componentResults[component][testResult.status]++;
          results.componentResults[component].total++;
        }

        // 按主题分组
        const themeMatch = test.title.match(/主题[:\s]+(\w+)/);
        if (themeMatch) {
          const theme = themeMatch[1];
          if (!results.themeResults[theme]) {
            results.themeResults[theme] = { passed: 0, failed: 0, total: 0 };
          }
          results.themeResults[theme][testResult.status]++;
          results.themeResults[theme].total++;
        }

        specResult.tests.push(testResult);
      });

      suiteResult.specs.push(specResult);
    });

    results.suites.push(suiteResult);
  });

  return results;
}

/**
 * 生成失败测试部分HTML
 */
function generateFailedTestsSection(failedTests) {
  if (failedTests.length === 0) {
    return `
    <section class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-green-600">✅ 所有测试通过</h2>
        <div class="bg-white p-6 rounded-lg shadow">
            <p class="text-gray-600">没有检测到视觉回归问题，所有组件都正常工作。</p>
        </div>
    </section>`;
  }

  let html = `
    <section class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-red-600">❌ 失败的测试 (${failedTests.length})</h2>
  `;

  failedTests.forEach((test, index) => {
    html += `
      <div class="bg-white p-6 rounded-lg shadow mb-4">
          <h3 class="text-lg font-semibold mb-2">${index + 1}. ${test.test}</h3>
          <div class="text-sm text-gray-600 mb-2">
              <span class="font-medium">组件:</span> ${test.spec} |
              <span class="font-medium">测试套件:</span> ${test.suite}
          </div>
          <div class="bg-red-50 border border-red-200 rounded p-3 mb-3">
              <code class="text-sm">${test.error}</code>
          </div>
          <div class="screenshot-comparison">
              <div class="screenshot-item">
                  <div class="screenshot-label">期望结果 (Baseline)</div>
                  <img src="screenshots/baseline/${getScreenshotName(test)}"
                       alt="期望结果"
                       onerror="this.style.display='none'">
              </div>
              <div class="screenshot-item">
                  <div class="screenshot-label">实际结果 (Actual)</div>
                  <img src="screenshots/actual/${getScreenshotName(test)}"
                       alt="实际结果"
                       onerror="this.style.display='none'">
              </div>
          </div>
      </div>
    `;
  });

  html += '</section>';
  return html;
}

/**
 * 生成组件结果部分HTML
 */
function generateComponentResultsSection(componentResults) {
  const components = Object.keys(componentResults);
  if (components.length === 0) return '';

  let html = `
    <section class="mb-8">
        <h2 class="text-xl font-semibold mb-4">组件测试结果</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  `;

  components.forEach(component => {
    const result = componentResults[component];
    const successRate = ((result.passed / result.total) * 100).toFixed(1);
    const statusClass = result.failed > 0 ? 'border-red-200' : 'border-green-200';

    html += `
      <div class="bg-white p-4 rounded-lg shadow border-2 ${statusClass}">
          <h3 class="font-semibold mb-2">${component}</h3>
          <div class="space-y-1 text-sm">
              <div>通过: <span class="text-green-600 font-medium">${result.passed}</span></div>
              <div>失败: <span class="text-red-600 font-medium">${result.failed}</span></div>
              <div>成功率: <span class="font-medium">${successRate}%</span></div>
          </div>
      </div>
    `;
  });

  html += '</div></section>';
  return html;
}

/**
 * 生成主题结果部分HTML
 */
function generateThemeResultsSection(themeResults) {
  const themes = Object.keys(themeResults);
  if (themes.length === 0) return '';

  let html = `
    <section class="mb-8">
        <h2 class="text-xl font-semibold mb-4">主题测试结果</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  `;

  themes.forEach(theme => {
    const result = themeResults[theme];
    const successRate = ((result.passed / result.total) * 100).toFixed(1);
    const statusClass = result.failed > 0 ? 'border-red-200' : 'border-green-200';

    html += `
      <div class="bg-white p-4 rounded-lg shadow border-2 ${statusClass}">
          <h3 class="font-semibold mb-2">
              <span class="theme-badge status-${result.failed > 0 ? 'failed' : 'success'}">${theme}</span>
          </h3>
          <div class="space-y-1 text-sm">
              <div>通过: <span class="text-green-600 font-medium">${result.passed}</span></div>
              <div>失败: <span class="text-red-600 font-medium">${result.failed}</span></div>
              <div>成功率: <span class="font-medium">${successRate}%</span></div>
          </div>
      </div>
    `;
  });

  html += '</div></section>';
  return html;
}

/**
 * 生成建议列表
 */
function generateRecommendations(results) {
  const recommendations = [];

  if (results.failed === 0) {
    recommendations.push('所有视觉测试通过，组件库表现稳定。');
  } else {
    recommendations.push('检查失败的测试，确认是否为预期的设计变更。');
    recommendations.push('如果变更是预期的，运行 <code>npm run visual:update-baselines</code> 更新基准截图。');
  }

  if (Object.keys(results.componentResults).length > 0) {
    const problematicComponents = Object.entries(results.componentResults)
      .filter(([_, result]) => result.failed > 0)
      .map(([component, result]) => `${component} (${result.failed}个失败)`);

    if (problematicComponents.length > 0) {
      recommendations.push(`重点关注以下组件: ${problematicComponents.join(', ')}`);
    }
  }

  if (Object.keys(results.themeResults).length > 0) {
    const problematicThemes = Object.entries(results.themeResults)
      .filter(([_, result]) => result.failed > 0)
      .map(([theme, result]) => `${theme}主题 (${result.failed}个失败)`);

    if (problematicThemes.length > 0) {
      recommendations.push(`检查以下主题的适配: ${problematicThemes.join(', ')}`);
    }
  }

  recommendations.push('定期运行视觉回归测试，确保组件库的一致性。');

  return recommendations.map(rec => `<li>${rec}</li>`).join('');
}

/**
 * 获取截图文件名
 */
function getScreenshotName(test) {
  // 从测试标题生成截图文件名
  return `${test.test.replace(/\s+/g, '-').toLowerCase()}.png`;
}

/**
 * 生成完整HTML报告
 */
function generateHTMLReport(results) {
  let html = HTML_TEMPLATE;

  // 替换占位符
  html = html.replace('{{TIMESTAMP}}', new Date().toLocaleString('zh-CN'));
  html = html.replace('{{BRANCH}}', process.env.GITHUB_REF_NAME || 'local');
  html = html.replace('{{COMMIT}}', process.env.GITHUB_SHA?.substring(0, 7) || 'local');
  html = html.replace('{{TOTAL_TESTS}}', results.total);
  html = html.replace('{{PASSED_TESTS}}', results.passed);
  html = html.replace('{{FAILED_TESTS}}', results.failed);
  html = html.replace('{{SKIPPED_TESTS}}', results.skipped);

  html = html.replace('{{FAILED_TESTS_SECTION}}', generateFailedTestsSection(results.failedTests));
  html = html.replace('{{COMPONENT_RESULTS}}', generateComponentResultsSection(results.componentResults));
  html = html.replace('{{THEME_RESULTS}}', generateThemeResultsSection(results.themeResults));
  html = html.replace('{{RECOMMENDATIONS}}', generateRecommendations(results));

  return html;
}

/**
 * 生成Markdown报告
 */
function generateMarkdownReport(results) {
  let markdown = `# Xorigo UI 视觉回归测试报告

**生成时间**: ${new Date().toLocaleString('zh-CN')}
**分支**: ${process.env.GITHUB_REF_NAME || 'local'}
**提交**: ${process.env.GITHUB_SHA?.substring(0, 7) || 'local'}

## 📊 测试概览

| 指标 | 数量 |
|------|------|
| 总测试数 | ${results.total} |
| ✅ 通过 | ${results.passed} |
| ❌ 失败 | ${results.failed} |
| ⏭️ 跳过 | ${results.skipped} |
`;

  if (results.failed > 0) {
    markdown += `\n## 🚨 失败的测试 (${results.failed.length})\n\n`;
    results.failedTests.forEach((test, index) => {
      markdown += `### ${index + 1}. ${test.test}\n\n`;
      markdown += `- **组件**: ${test.spec}\n`;
      markdown += `- **测试套件**: ${test.suite}\n`;
      markdown += `- **错误**: \`${test.error}\`\n\n`;
    });
  } else {
    markdown += `\n## ✅ 所有测试通过\n\n没有检测到视觉回归问题。\n\n`;
  }

  if (Object.keys(results.componentResults).length > 0) {
    markdown += `## 🧩 组件测试结果\n\n`;
    Object.entries(results.componentResults).forEach(([component, result]) => {
      const successRate = ((result.passed / result.total) * 100).toFixed(1);
      markdown += `- **${component}**: ${result.passed}/${result.total} (${successRate}%)\n`;
    });
    markdown += '\n';
  }

  if (Object.keys(results.themeResults).length > 0) {
    markdown += `## 🎨 主题测试结果\n\n`;
    Object.entries(results.themeResults).forEach(([theme, result]) => {
      const successRate = ((result.passed / result.total) * 100).toFixed(1);
      markdown += `- **${theme}**: ${result.passed}/${result.total} (${successRate}%)\n`;
    });
    markdown += '\n';
  }

  markdown += `## 💡 建议和下一步\n\n`;
  markdown += generateRecommendations(results).map(rec => `- ${rec.replace(/<[^>]*>/g, '')}`).join('\n');

  return markdown;
}

/**
 * 主函数
 */
function main() {
  console.log('🎨 生成视觉回归测试报告...');

  // 确保输出目录存在
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  // 解析测试结果
  const reportPath = path.join(CONFIG.reportDir, 'results.json');
  const reportData = parsePlaywrightReport(reportPath);

  if (!reportData) {
    console.error('❌ 无法找到或解析测试结果文件');
    process.exit(1);
  }

  const results = analyzeTestResults(reportData);

  // 生成HTML报告
  const htmlReport = generateHTMLReport(results);
  const htmlPath = path.join(CONFIG.outputDir, 'visual-report.html');
  fs.writeFileSync(htmlPath, htmlReport);
  console.log(`✅ HTML报告已生成: ${htmlPath}`);

  // 生成Markdown报告
  const markdownReport = generateMarkdownReport(results);
  const mdPath = path.join(CONFIG.outputDir, 'visual-report.md');
  fs.writeFileSync(mdPath, markdownReport);
  console.log(`✅ Markdown报告已生成: ${mdPath}`);

  console.log(`📊 测试统计: ${results.passed}/${results.total} 通过`);

  if (results.failed > 0) {
    console.log(`⚠️  发现 ${results.failed} 个失败的测试，请查看报告了解详情`);
    process.exit(1);
  } else {
    console.log('🎉 所有视觉测试通过！');
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = {
  analyzeTestResults,
  generateHTMLReport,
  generateMarkdownReport
};